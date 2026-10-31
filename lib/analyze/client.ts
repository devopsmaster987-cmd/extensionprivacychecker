import { AnalysisError, toErrorCode } from "../errors";
import type { WorkerResponse } from "./worker";
import type { AnalysisProgress, AnalysisReport } from "./types";

const WORKER_TIMEOUT_MS = 90_000;

async function analyzeOnMainThread(
  filename: string,
  buffer: ArrayBuffer,
  onProgress?: (progress: AnalysisProgress) => void,
): Promise<AnalysisReport> {
  const { analyzePackage } = await import("./index");
  return analyzePackage(new Uint8Array(buffer), filename, onProgress);
}

export async function analyzeBytes(
  filename: string,
  buffer: ArrayBuffer,
  onProgress?: (progress: AnalysisProgress) => void,
): Promise<AnalysisReport> {
  if (typeof window === "undefined" || typeof Worker === "undefined") {
    return analyzeOnMainThread(filename, buffer, onProgress);
  }

  let worker: Worker;
  try {
    worker = new Worker(new URL("./worker.ts", import.meta.url));
  } catch {
    return analyzeOnMainThread(filename, buffer, onProgress);
  }

  return new Promise<AnalysisReport>((resolve, reject) => {
    let settled = false;
    const timeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      worker.terminate();
      reject(
        new AnalysisError(
          "INVALID_ARCHIVE",
          "The analysis took too long and was stopped. Try a smaller package.",
        ),
      );
    }, WORKER_TIMEOUT_MS);

    const finish = (action: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      worker.terminate();
      action();
    };

    worker.addEventListener("message", (event: MessageEvent<WorkerResponse>) => {
      const data = event.data;
      if (data.type === "progress") {
        onProgress?.(data.progress);
        return;
      }
      if (data.type === "result") {
        finish(() => resolve(data.report));
        return;
      }
      if (data.type === "error") {
        finish(() => reject(new AnalysisError(data.code, data.message)));
      }
    });

    worker.addEventListener("error", () => {
      finish(async () => {
        try {
          const report = await analyzeOnMainThread(filename, buffer, onProgress);
          resolve(report);
        } catch (error) {
          reject(new AnalysisError(toErrorCode(error), error instanceof Error ? error.message : "Analysis failed."));
        }
      });
    });

    worker.postMessage({ type: "analyze", filename, buffer });
  });
}

export async function analyzeFile(
  file: File,
  onProgress?: (progress: AnalysisProgress) => void,
): Promise<AnalysisReport> {
  const buffer = await file.arrayBuffer();
  return analyzeBytes(file.name, buffer, onProgress);
}

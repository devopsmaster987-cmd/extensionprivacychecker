/// <reference lib="webworker" />
import { analyzePackage } from "./index";
import type { AnalysisProgress, AnalysisReport } from "./types";
import type { AnalysisErrorCode } from "../errors";
import { toErrorCode } from "../errors";

export type WorkerRequest = {
  type: "analyze";
  filename: string;
  buffer: ArrayBuffer;
};

export type WorkerResponse =
  | { type: "progress"; progress: AnalysisProgress }
  | { type: "result"; report: AnalysisReport }
  | { type: "error"; code: AnalysisErrorCode; message: string };

const scope = self as unknown as DedicatedWorkerGlobalScope;

scope.addEventListener("message", async (event: MessageEvent<WorkerRequest>) => {
  const data = event.data;
  if (!data || data.type !== "analyze") return;

  try {
    const report = await analyzePackage(new Uint8Array(data.buffer), data.filename, (progress) => {
      const message: WorkerResponse = { type: "progress", progress };
      scope.postMessage(message);
    });
    const message: WorkerResponse = { type: "result", report };
    scope.postMessage(message);
  } catch (error) {
    const message: WorkerResponse = {
      type: "error",
      code: toErrorCode(error),
      message: error instanceof Error ? error.message : "The analysis failed.",
    };
    scope.postMessage(message);
  }
});

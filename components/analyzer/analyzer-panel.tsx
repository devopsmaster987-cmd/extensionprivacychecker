"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  FileArchive,
  Link2,
  Loader2,
  Lock,
  ScanSearch,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { LIMITS } from "@/lib/analyze/limits";
import { analyzeBytes } from "@/lib/analyze/client";
import type { AnalysisProgress, AnalysisReport } from "@/lib/analyze/types";
import { toErrorCode, type AnalysisErrorCode } from "@/lib/errors";
import { saveScan } from "@/lib/scan-history";
import { getMessages, type MessageKey } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReportDashboard } from "./report-dashboard";
import { ScanHistory } from "./scan-history";

type Status = "idle" | "working" | "done" | "error";

const PROGRESS_KEYS: Record<AnalysisProgress["stage"], MessageKey> = {
  reading: "analyzer.progressReading",
  unpacking: "analyzer.progressUnpacking",
  manifest: "analyzer.progressManifest",
  source: "analyzer.progressSource",
  domains: "analyzer.progressDomains",
  scoring: "analyzer.progressScoring",
  done: "analyzer.progressDone",
};

function safeDecodeURIComponent(value: string, fallback: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return fallback;
  }
}

const STORE_ERROR_KEYS: Partial<Record<AnalysisErrorCode, MessageKey>> = {
  STORE_URL_INVALID: "store.invalid",
  STORE_HOST_BLOCKED: "store.blocked",
  STORE_FETCH_FAILED: "store.failed",
  STORE_TOO_LARGE: "store.tooLarge",
  STORE_TIMEOUT: "store.timeout",
  RATE_LIMITED: "store.rateLimited",
};

export function AnalyzerPanel({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const t = (key: MessageKey) => messages[key];
  const [status, setStatus] = useState<Status>("idle");
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress>({ stage: "reading", percent: 0 });
  const [activeName, setActiveName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [storeUrl, setStoreUrl] = useState("");
  const [storeBusy, setStoreBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const busy = status === "working" || storeBusy;

  function scrollToResult() {
    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function friendlyError(code: AnalysisErrorCode, raw: string): string {
    if (code === "FILE_TOO_LARGE") return t("analyzer.fileTooLarge");
    if (code === "UNSUPPORTED_TYPE") return t("analyzer.invalidFile");
    const key = STORE_ERROR_KEYS[code];
    if (key) return t(key);
    return raw || t("analyzer.errorTitle");
  }

  async function runAnalysis(filename: string, buffer: ArrayBuffer) {
    setStatus("working");
    setError(null);
    setReport(null);
    setActiveName(filename);
    setProgress({ stage: "reading", percent: 3 });
    try {
      const result = await analyzeBytes(filename, buffer, setProgress);
      setReport(result);
      saveScan(result);
      setStatus("done");
      scrollToResult();
    } catch (caught) {
      const code = toErrorCode(caught);
      const raw = caught instanceof Error ? caught.message : "";
      setError(friendlyError(code, raw));
      setStatus("error");
    }
  }

  async function handleFile(file: File | null | undefined) {
    if (!file || busy) return;
    if (!/\.(crx|xpi|zip|json)$/i.test(file.name)) {
      setError(t("analyzer.invalidFile"));
      setStatus("error");
      return;
    }
    if (file.size > LIMITS.maxUploadBytes) {
      setError(t("analyzer.fileTooLarge"));
      setStatus("error");
      return;
    }
    if (file.size === 0) {
      setError(t("analyzer.invalidFile"));
      setStatus("error");
      return;
    }
    const buffer = await file.arrayBuffer();
    await runAnalysis(file.name, buffer);
  }

  async function handleStore(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const trimmed = storeUrl.trim();
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "https:") throw new Error("invalid");
    } catch {
      setError(t("store.invalid"));
      setStatus("error");
      return;
    }

    setStoreBusy(true);
    setStatus("working");
    setError(null);
    setReport(null);
    setActiveName(trimmed);
    setProgress({ stage: "reading", percent: 4 });

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), LIMITS.storeFetchTimeoutMs + 10_000);

    try {
      const response = await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: { code?: AnalysisErrorCode; message?: string } }
          | null;
        setError(
          friendlyError(
            payload?.error?.code ?? "STORE_FETCH_FAILED",
            payload?.error?.message ?? "",
          ),
        );
        setStatus("error");
        return;
      }

      const filename = safeDecodeURIComponent(
        response.headers.get("X-Extension-Filename") ?? "extension.crx",
        "extension.crx",
      );
      const buffer = await response.arrayBuffer();
      setStoreBusy(false);
      await runAnalysis(filename, buffer);
    } catch (caught) {
      const isAbort = caught instanceof DOMException && caught.name === "AbortError";
      setError(t(isAbort ? "store.timeout" : "store.failed"));
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
      setStoreBusy(false);
    }
  }

  function restoreReport(report: AnalysisReport) {
    setReport(report);
    setStatus("done");
    setError(null);
    scrollToResult();
  }

  function reset() {
    setStatus("idle");
    setReport(null);
    setError(null);
    setProgress({ stage: "reading", percent: 0 });
    setActiveName("");
    setStoreUrl("");
    if (inputRef.current) inputRef.current.value = "";
  }

  if (status === "done" && report) {
    return (
      <div ref={resultRef} className="scroll-mt-24">
        <ReportDashboard report={report} locale={locale} onNewScan={reset} />
      </div>
    );
  }

  return (
    <div className="scroll-mt-24" ref={resultRef}>
      {error && (
        <div role="alert" className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-red-900">{t("analyzer.errorTitle")}</p>
              <p className="mt-1 break-words text-sm leading-6 text-red-800">{error}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={reset}>
                  {t("analyzer.retry")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div>
          <label
            onDragOver={(event) => {
              event.preventDefault();
              if (!busy) setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              void handleFile(event.dataTransfer.files?.[0]);
            }}
            className={cn(
              "flex min-h-[19rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition",
              dragging
                ? "border-teal-600 bg-teal-50"
                : "border-slate-300 bg-white hover:border-teal-500 hover:bg-teal-50/40",
              busy && "pointer-events-none opacity-60",
            )}
          >
            <span
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-800",
                dragging && "scale-110",
              )}
            >
              {busy ? (
                <Loader2 aria-hidden="true" className="h-7 w-7 animate-spin" />
              ) : (
                <UploadCloud aria-hidden="true" className="h-7 w-7" />
              )}
            </span>
            <span className="mt-4 text-lg font-bold text-slate-900">
              {dragging ? t("analyzer.dragActive") : t("analyzer.dropTitle")}
            </span>
            <span className="mt-1 text-sm text-slate-500">{t("analyzer.dropSubtitle")}</span>
            <span className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              <FileArchive aria-hidden="true" className="h-4 w-4" />
              {t("analyzer.chooseFile")}
            </span>
            <span className="mt-3 text-xs text-slate-500">{t("analyzer.supported")}</span>
            <input
              ref={inputRef}
              type="file"
              accept=".crx,.xpi,.zip,.json,application/zip,application/json"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                void handleFile(file);
                event.target.value = "";
              }}
            />
          </label>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Lock aria-hidden="true" className="h-3.5 w-3.5 text-teal-700" />
              {t("analyzer.processedLocally")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-teal-700" />
              {t("analyzer.neverExecuted")}
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">{t("analyzer.privacyNote")}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <form onSubmit={handleStore}>
            <div className="flex items-center gap-2">
              <Link2 aria-hidden="true" className="h-4 w-4 text-teal-700" />
              <h2 className="text-sm font-bold text-slate-900">{t("analyzer.orStoreUrl")}</h2>
            </div>
            <label htmlFor="store-url" className="mt-3 block text-xs font-semibold text-slate-600">
              {t("analyzer.storeLabel")}
            </label>
            <input
              id="store-url"
              type="url"
              inputMode="url"
              autoComplete="off"
              value={storeUrl}
              onChange={(event) => setStoreUrl(event.target.value)}
              placeholder={t("analyzer.storePlaceholder")}
              disabled={busy}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-teal-600 placeholder:text-slate-400 focus:border-teal-600 focus:ring-2"
            />
            <Button type="submit" className="mt-3 w-full" disabled={busy || storeUrl.trim().length === 0}>
              {storeBusy ? (
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              ) : (
                <ScanSearch aria-hidden="true" className="h-4 w-4" />
              )}
              {storeBusy ? t("analyzer.fetchingStore") : t("analyzer.storeButton")}
            </Button>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">{t("store.manual")}</p>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("analyzer.emptyTitle")}</h3>
            <p className="mt-1.5 text-xs leading-5 text-slate-600">{t("analyzer.emptyBody")}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["MV3", "MV2", "CRX", "XPI", "ZIP", "JSON"].map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-900">
            {t("analyzer.limitsNote")}
          </p>
        </div>
      </div>

      {status === "idle" && (
        <>
          <ScanHistory locale={locale} onRestore={restoreReport} />

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">{t("analyzer.compareExtensions")}</h2>
              <p className="mt-1 text-xs leading-5 text-slate-600">{t("analyzer.compareBody")}</p>
            </div>
            <Link
              href={`/${locale}/compare`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:border-teal-500 hover:text-teal-900"
            >
              {t("nav.compare")}
            </Link>
          </div>
        </>
      )}

      {status === "working" && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin text-teal-700" />
              {activeName ? t("analyzer.analyzingFile").replace("{name}", activeName) : t("analyzer.analyzing")}
            </p>
            <span className="text-xs font-semibold tabular-nums text-slate-500">{progress.percent}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-700 transition-[width] duration-500"
              style={{ width: `${Math.max(3, progress.percent)}%` }}
            />
          </div>
          <p className="mt-2 truncate text-xs text-slate-500">{t(PROGRESS_KEYS[progress.stage])}</p>
        </div>
      )}
    </div>
  );
}

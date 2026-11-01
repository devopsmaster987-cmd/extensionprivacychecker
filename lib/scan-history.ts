import type { AnalysisReport } from "@/lib/analyze/types";

const STORAGE_KEY = "epc:scan-history:v1";
const MAX_SCANS = 5;
const EMPTY_SCANS: StoredScan[] = [];
const listeners = new Set<() => void>();
let cachedScans: StoredScan[] | null = null;

export interface StoredScan {
  id: string;
  savedAt: string;
  name: string;
  version: string | null;
  score: number;
  grade: string;
  level: string;
  report: AnalysisReport;
}

function isStoredScan(value: unknown): value is StoredScan {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.savedAt === "string" &&
    typeof record.name === "string" &&
    typeof record.score === "number" &&
    typeof record.report === "object" &&
    record.report !== null
  );
}

function notify(): void {
  cachedScans = null;
  for (const listener of listeners) listener();
}

export function subscribeScanHistory(listener: () => void): () => void {
  listeners.add(listener);
  if (typeof window !== "undefined") window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") window.removeEventListener("storage", listener);
  };
}

export function getScanHistorySnapshot(): StoredScan[] {
  if (cachedScans === null) cachedScans = loadScanHistory();
  return cachedScans;
}

export function getScanHistoryServerSnapshot(): StoredScan[] {
  return EMPTY_SCANS;
}

export function loadScanHistory(): StoredScan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredScan).slice(0, MAX_SCANS);
  } catch {
    return [];
  }
}

export function saveScan(report: AnalysisReport): StoredScan[] {
  if (typeof window === "undefined") return [];
  const entry: StoredScan = {
    id: `${report.source.name}:${report.analyzedAt}`,
    savedAt: new Date().toISOString(),
    name: report.manifest.name || report.source.name,
    version: report.manifest.version,
    score: report.score.score,
    grade: report.score.grade,
    level: report.score.level,
    report,
  };
  const next = [entry, ...loadScanHistory().filter((scan) => scan.id !== entry.id)].slice(0, MAX_SCANS);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    return loadScanHistory();
  }
  notify();
  return next;
}

export function clearScanHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures; the analyzer still works without history.
  }
  notify();
}

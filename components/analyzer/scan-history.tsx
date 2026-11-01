"use client";

import { useSyncExternalStore } from "react";
import { Clock3, History, Trash2 } from "lucide-react";
import type { AnalysisReport } from "@/lib/analyze/types";
import { formatDateTime, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import {
  clearScanHistory,
  getScanHistoryServerSnapshot,
  getScanHistorySnapshot,
  subscribeScanHistory,
} from "@/lib/scan-history";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "./risk";

export function ScanHistory({
  locale,
  onRestore,
}: {
  locale: Locale;
  onRestore: (report: AnalysisReport) => void;
}) {
  const messages = getMessages(locale);
  const scans = useSyncExternalStore(
    subscribeScanHistory,
    getScanHistorySnapshot,
    getScanHistoryServerSnapshot,
  );

  if (scans.length === 0) return null;

  return (
    <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <History aria-hidden="true" className="h-4 w-4 text-teal-700" />
          {messages["analyzer.recentScans"]}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => clearScanHistory()}
        >
          <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
          {messages["analyzer.clearHistory"]}
        </Button>
      </div>
      <p className="mt-1 text-xs text-slate-500">{messages["analyzer.savedLocally"]}</p>
      <ul className="mt-3 divide-y divide-slate-100">
        {scans.map((scan) => (
          <li key={scan.id} className="flex flex-wrap items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{scan.name}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Clock3 aria-hidden="true" className="h-3 w-3" />
                  {formatDateTime(scan.savedAt, locale)}
                </span>
                {scan.version && <span>v{scan.version}</span>}
                <Badge variant="outline">{scan.grade}</Badge>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <RiskBadge
                level={scan.level as AnalysisReport["score"]["level"]}
                label={messages[`risk.${scan.level}` as keyof typeof messages] ?? scan.level}
              />
              <Button type="button" size="sm" variant="outline" onClick={() => onRestore(scan.report)}>
                {messages["analyzer.restoreScan"]}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

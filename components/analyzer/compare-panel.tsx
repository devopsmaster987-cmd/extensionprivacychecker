"use client";

import { useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileArchive,
  Loader2,
  Minus,
  ShieldCheck,
} from "lucide-react";
import { analyzeBytes } from "@/lib/analyze/client";
import { compareReports, type ReportComparison } from "@/lib/analyze/compare";
import type { AnalysisProgress, AnalysisReport } from "@/lib/analyze/types";
import { LIMITS } from "@/lib/analyze/limits";
import { toErrorCode } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "./risk";

type Side = "left" | "right";
type Status = "idle" | "working" | "done" | "error";

function fileName(report: AnalysisReport): string {
  return report.manifest.name || report.source.name;
}

function ScoreCard({ label, report }: { label: string; report: AnalysisReport }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <h3 className="mt-1 break-words text-lg font-extrabold text-slate-900">{fileName(report)}</h3>
      <p className="mt-1 text-xs text-slate-500">
        {report.manifest.version ? `v${report.manifest.version}` : "No version"} · {report.source.kind.toUpperCase()}
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <span className="text-4xl font-extrabold text-slate-900">{report.score.score}</span>
        <span className="pb-1 text-xs font-semibold text-slate-500">/ 100</span>
        <RiskBadge
          level={report.score.level}
          label={report.score.level[0].toUpperCase() + report.score.level.slice(1)}
        />
        <Badge variant="outline">Grade {report.score.grade}</Badge>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {report.permissions.length} permissions · {report.findings.length} findings · {report.domains.length} domains
      </p>
    </div>
  );
}

function DifferenceList<T>({
  title,
  items,
  empty,
  render,
}: {
  title: string;
  items: T[];
  empty: string;
  render: (item: T) => React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {title} <span className="font-semibold text-slate-400">({items.length})</span>
      </h4>
      {items.length === 0 ? (
        <p className="mt-1 text-sm text-slate-500">{empty}</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {items.map((item, index) => (
            <li key={index} className="flex gap-2 text-sm text-slate-700">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span className="min-w-0 break-words">{render(item)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ComparisonResult({ comparison }: { comparison: ReportComparison }) {
  const direction = comparison.riskDirection;
  const DirectionIcon =
    direction === "worse" ? ArrowUpRight : direction === "improved" ? ArrowDownRight : Minus;
  const directionLabel =
    direction === "worse" ? "Higher risk after the change" : direction === "improved" ? "Lower risk after the change" : "No score change";

  return (
    <div className="mt-6 space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <DirectionIcon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">{directionLabel}</p>
          <p className="text-xs text-slate-500">
            Score change: {comparison.scoreDelta > 0 ? "+" : ""}
            {comparison.scoreDelta}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-bold text-slate-900">Permissions and website access</h3>
          <div className="mt-4 space-y-5">
            <DifferenceList
              title="Added permissions"
              items={comparison.permissions.added}
              empty="No new permissions."
              render={(permission) => (
                <span>
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-semibold">{permission.raw}</code>
                  {permission.optional ? " (optional)" : ""} · {permission.level}
                </span>
              )}
            />
            <DifferenceList
              title="Removed permissions"
              items={comparison.permissions.removed}
              empty="No permissions were removed."
              render={(permission) => (
                <span>
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-semibold">{permission.raw}</code>
                  {permission.optional ? " (optional)" : ""}
                </span>
              )}
            />
            <DifferenceList
              title="Added host patterns"
              items={comparison.hostPatterns.added}
              empty="No new host patterns."
              render={(pattern) => <code className="text-xs font-semibold">{pattern}</code>}
            />
            <DifferenceList
              title="Removed host patterns"
              items={comparison.hostPatterns.removed}
              empty="No host patterns were removed."
              render={(pattern) => <code className="text-xs font-semibold">{pattern}</code>}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-bold text-slate-900">Domains and code findings</h3>
          <div className="mt-4 space-y-5">
            <DifferenceList
              title="New external domains"
              items={comparison.domains.added}
              empty="No new domains."
              render={(domain) => (
                <span>
                  <code className="text-xs font-semibold">{domain.domain}</code> · {domain.category}
                </span>
              )}
            />
            <DifferenceList
              title="Removed external domains"
              items={comparison.domains.removed}
              empty="No domains were removed."
              render={(domain) => <code className="text-xs font-semibold">{domain.domain}</code>}
            />
            <DifferenceList
              title="New code findings"
              items={comparison.findings.added}
              empty="No new code findings."
              render={(finding) => (
                <span>
                  <span className="font-semibold">{finding.rule}</span> · {finding.file}
                  {finding.line ? `:${finding.line}` : ""} · {finding.severity}
                </span>
              )}
            />
            <DifferenceList
              title="Resolved code findings"
              items={comparison.findings.removed}
              empty="No findings were resolved."
              render={(finding) => (
                <span>
                  <span className="font-semibold">{finding.rule}</span> · {finding.file}
                  {finding.line ? `:${finding.line}` : ""}
                </span>
              )}
            />
          </div>
        </section>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        This comparison is based on static indicators. A new permission or domain is not proof of malicious behavior,
        and a lower score does not guarantee that an update is safe. Review the evidence in both reports before updating.
      </div>
    </div>
  );
}

export function ComparePanel() {
  const [leftReport, setLeftReport] = useState<AnalysisReport | null>(null);
  const [rightReport, setRightReport] = useState<AnalysisReport | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState<{ side: Side; value: AnalysisProgress } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [comparison, setComparison] = useState<ReportComparison | null>(null);
  const [names, setNames] = useState<{ left: string; right: string }>({ left: "", right: "" });
  const leftInput = useRef<HTMLInputElement>(null);
  const rightInput = useRef<HTMLInputElement>(null);

  async function handleFile(side: Side, file: File | null | undefined) {
    if (!file) return;
    if (!/\.(crx|xpi|zip|json)$/i.test(file.name)) {
      setError("Choose a CRX, XPI, ZIP or manifest.json file.");
      setStatus("error");
      return;
    }
    if (file.size > LIMITS.maxUploadBytes) {
      setError("This file is larger than the 25 MB limit.");
      setStatus("error");
      return;
    }
    setNames((current) => ({ ...current, [side]: file.name }));
    setStatus("working");
    setError(null);
    setComparison(null);
    try {
      const buffer = await file.arrayBuffer();
      const report = await analyzeBytes(file.name, buffer, (value) =>
        setProgress({ side, value }),
      );
      if (side === "left") setLeftReport(report);
      else setRightReport(report);
      setStatus("done");
    } catch (caught) {
      setError(toErrorCode(caught) === "FILE_TOO_LARGE" ? "The file is too large." : "The package could not be analyzed.");
      setStatus("error");
    } finally {
      setProgress(null);
    }
  }

  function runComparison() {
    if (!leftReport || !rightReport) return;
    setComparison(compareReports(leftReport, rightReport));
  }

  function reset() {
    setLeftReport(null);
    setRightReport(null);
    setComparison(null);
    setError(null);
    setStatus("idle");
    setNames({ left: "", right: "" });
    if (leftInput.current) leftInput.current.value = "";
    if (rightInput.current) rightInput.current.value = "";
  }

  return (
    <div className="space-y-5">
      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {(
          [
            ["left", "Before update", leftInput, leftReport],
            ["right", "After update", rightInput, rightReport],
          ] as const
        ).map(([side, label, input, report]) => (
          <div key={side} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-bold text-slate-900">{label}</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Upload the older package on the left and the newer package on the right. Both files stay in this browser.
            </p>
            <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-4 py-8 text-center hover:border-teal-500 hover:bg-teal-50/40">
              <FileArchive aria-hidden="true" className="h-7 w-7 text-teal-700" />
              <span className="mt-2 text-sm font-semibold text-slate-900">
                {names[side] || "Choose a CRX, XPI, ZIP or manifest.json"}
              </span>
              <span className="mt-1 text-xs text-slate-500">Maximum 25 MB</span>
              <input
                ref={input}
                type="file"
                accept=".crx,.xpi,.zip,.json,application/zip,application/json"
                className="sr-only"
                onChange={(event) => {
                  void handleFile(side, event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
            {progress?.side === side && (
              <p className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600">
                <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
                Analyzing… {progress.value.percent}%
              </p>
            )}
            {report && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                Ready: {fileName(report)} ({report.score.score}/100)
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={runComparison} disabled={!leftReport || !rightReport || status === "working"}>
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
          Compare packages
        </Button>
        <Button type="button" variant="outline" onClick={reset}>
          Start over
        </Button>
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-teal-700" />
          Code is never executed. Reports stay in this browser.
        </span>
      </div>

      {leftReport && rightReport && (
        <div className="grid gap-5 md:grid-cols-2">
          <ScoreCard label="Before" report={leftReport} />
          <ScoreCard label="After" report={rightReport} />
        </div>
      )}

      {comparison && <ComparisonResult comparison={comparison} />}
    </div>
  );
}

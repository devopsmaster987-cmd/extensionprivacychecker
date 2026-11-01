"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  AlertOctagon,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Code2,
  Copy,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Globe2,
  Info,
  Loader2,
  Printer,
  Search,
  ShieldAlert,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { AnalysisReport, Confidence, Finding, Severity } from "@/lib/analyze/types";
import { formatDateTime, formatNumber, localizedPath, type Locale } from "@/lib/i18n/config";
import { getMessages, type MessageKey } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiskBadge, RiskGauge, type BadgeVariant } from "./risk";
import { downloadCsvReport, downloadJsonReport, downloadPdfReport, reportSummary } from "@/lib/report/export";
import {
  DOMAIN_HELP_PAGE,
  categoryHelpPage,
  findingHelpPage,
  permissionHelpPage,
} from "@/lib/report-links";
import { cn, safeJsonPreview } from "@/lib/utils";

const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
};

type FindingFilter = "all" | "high" | "medium" | "low";

function severityVariant(severity: Severity): BadgeVariant {
  if (severity === "critical") return "critical";
  if (severity === "high") return "high";
  if (severity === "medium") return "moderate";
  if (severity === "low") return "low";
  return "info";
}

function confidenceLabel(confidence: Confidence, t: (key: MessageKey) => string): string {
  return t(`confidence.${confidence}` as MessageKey);
}

function severityLabel(severity: Severity, t: (key: MessageKey) => string): string {
  return t(`severity.${severity}` as MessageKey);
}

function SectionCard({
  icon,
  title,
  subtitle,
  children,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-slate-200 bg-white p-5 sm:p-6", className)}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          {icon}
        </span>
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function FindingRow({
  finding,
  locale,
  t,
}: {
  finding: Finding;
  locale: Locale;
  t: (key: MessageKey) => string;
}) {
  return (
    <details className="group rounded-xl border border-slate-200">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2 px-4 py-3">
        <RiskBadge level={finding.severity} label={severityLabel(finding.severity, t)} />
        <span className="min-w-0 flex-1 text-sm font-semibold text-slate-900">
          {t(`finding.${finding.rule}` as MessageKey)}
        </span>
        <span className="text-[11px] text-slate-500">
          {confidenceLabel(finding.confidence, t)}
        </span>
        <ChevronDown aria-hidden="true" className="h-4 w-4 text-slate-400 transition group-open:rotate-180" />
      </summary>
      <div className="border-t border-slate-100 px-4 py-3 text-sm">
        <p className="text-xs font-medium text-slate-500">
          {finding.file}
          {finding.line ? `:${finding.line}` : ""}
          {finding.column ? `:${finding.column}` : ""}
        </p>
        <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
          <code>{finding.evidence}</code>
        </pre>
        <p className="mt-3 leading-6 text-slate-600" lang="en">
          {finding.explanation}
        </p>
        <p className="mt-2 leading-6 text-slate-700" lang="en">
          <span className="font-semibold">{t("report.cannotProve")}: </span>
          {finding.recommendation}
        </p>
        <Link
          href={localizedPath(locale, `/learn/${findingHelpPage(finding.rule)}`)}
          className="no-print mt-3 inline-flex text-xs font-semibold text-teal-800 hover:text-teal-950 hover:underline"
        >
          {t("common.learnMore")}
        </Link>
      </div>
    </details>
  );
}

export function ReportDashboard({
  report,
  locale,
  onNewScan,
}: {
  report: AnalysisReport;
  locale: Locale;
  onNewScan: () => void;
}) {
  const messages = getMessages(locale);
  const t = useCallback((key: MessageKey) => messages[key], [messages]);
  const reportRef = useRef<HTMLDivElement>(null);
  const [findingFilter, setFindingFilter] = useState<FindingFilter>("all");
  const [findingSearch, setFindingSearch] = useState("");
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [copied, setCopied] = useState(false);

  const findings = useMemo(
    () => [...report.findings].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]),
    [report.findings],
  );

  const filteredFindings = useMemo(() => {
    const bySeverity =
      findingFilter === "all"
        ? findings
        : findingFilter === "high"
          ? findings.filter((f) => f.severity === "high" || f.severity === "critical")
          : findingFilter === "medium"
            ? findings.filter((f) => f.severity === "medium")
            : findings.filter((f) => f.severity === "low" || f.severity === "info");
    const query = findingSearch.trim().toLowerCase();
    if (!query) return bySeverity;
    return bySeverity.filter((finding) => {
      const label = t(`finding.${finding.rule}` as MessageKey);
      return [label, finding.rule, finding.file, finding.evidence, finding.explanation]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [findings, findingFilter, findingSearch, t]);

  const domains = useMemo(
    () => [...report.domains].sort((a, b) => b.count - a.count || a.domain.localeCompare(b.domain)),
    [report.domains],
  );

  const requiredApi = report.permissions.filter((p) => !p.optional && p.kind === "api");
  const optionalApi = report.permissions.filter((p) => p.optional && p.kind === "api");
  const requiredHost = report.permissions.filter((p) => !p.optional && p.kind === "host");
  const optionalHost = report.permissions.filter((p) => p.optional && p.kind === "host");
  const highCount = findings.filter((f) => f.severity === "high" || f.severity === "critical").length;
  const mediumCount = findings.filter((f) => f.severity === "medium").length;

  const counts = {
    all: findings.length,
    high: highCount,
    medium: mediumCount,
    low: findings.length - highCount - mediumCount,
  };

  async function handlePdf() {
    if (!reportRef.current) return;
    setPdfBusy(true);
    setPdfError(false);
    try {
      await downloadPdfReport(reportRef.current, report, locale);
    } catch {
      setPdfError(true);
    } finally {
      setPdfBusy(false);
    }
  }

  async function handleCopySummary() {
    try {
      await navigator.clipboard.writeText(reportSummary(report));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  function renderPermissionList(items: typeof report.permissions, emptyLabel: string) {
    if (items.length === 0) return <p className="text-sm text-slate-500">{emptyLabel}</p>;
    return (
      <ul className="space-y-2">
        {items.map((permission) => (
          <li key={`${permission.kind}-${permission.key}-${permission.optional}`}>
            <details className="group rounded-xl border border-slate-200">
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2 px-4 py-2.5">
                <RiskBadge level={permission.level} label={severityLabel(permission.level, t)} />
                <code className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-900">
                  {permission.raw}
                </code>
                <Badge variant="outline">{permission.kind === "host" ? t("report.hostAccess") : t("report.permission")}</Badge>
                <span className="text-[11px] text-slate-500">{permission.optional ? t("common.optional") : t("common.required")}</span>
                <ChevronDown aria-hidden="true" className="h-4 w-4 text-slate-400 transition group-open:rotate-180" />
              </summary>
              <div className="border-t border-slate-100 px-4 py-3 text-sm leading-6 text-slate-600" lang="en">
                <p>{permission.description}</p>
                <p className="mt-2 text-slate-700">
                  <span className="font-semibold">{t("report.cannotProve")}: </span>
                  {permission.recommendation}
                </p>
                <Link
                  href={localizedPath(locale, `/learn/${permissionHelpPage(permission)}`)}
                  className="no-print mt-3 inline-flex text-xs font-semibold text-teal-800 hover:text-teal-950 hover:underline"
                >
                  {t("common.learnMore")}
                </Link>
              </div>
            </details>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-5">
      <div ref={reportRef} className="space-y-5 bg-white">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-teal-50/50 p-5 sm:p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
                {t("report.title")}
              </p>
              <h2 className="mt-1 break-words text-2xl font-extrabold tracking-tight text-slate-900">
                {report.manifest.name || report.source.name}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <Badge variant="outline">{report.source.kind.toUpperCase()}</Badge>
                {report.manifest.version && <span>v{report.manifest.version}</span>}
                <span>
                  {t("report.analyzedAt")}: {formatDateTime(report.analyzedAt, locale)}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-end gap-4">
                <RiskGauge
                  score={report.score.score}
                  level={report.score.level}
                  label={t(`risk.${report.score.level}` as MessageKey)}
                  outOfLabel={t("report.scoreOutOf")}
                />
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {t("report.privacyGrade")}
                  </p>
                  <p className="mt-1 text-3xl font-extrabold leading-none text-slate-900">
                    {report.score.grade}
                  </p>
                </div>
              </div>
            </div>

            <div className="no-print flex flex-wrap gap-2 sm:flex-col sm:items-end">
              <Button type="button" onClick={handlePdf} disabled={pdfBusy} variant="default" size="sm">
                {pdfBusy ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <FileText aria-hidden="true" className="h-4 w-4" />}
                {t("report.exportPdf")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => downloadJsonReport(report, locale)}
              >
                <FileJson aria-hidden="true" className="h-4 w-4" />
                {t("report.exportJson")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => downloadCsvReport(report, locale)}
              >
                <FileSpreadsheet aria-hidden="true" className="h-4 w-4" />
                {t("report.exportCsv")}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleCopySummary}>
                <Copy aria-hidden="true" className="h-4 w-4" />
                {copied ? t("report.copied") : t("report.copySummary")}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
                <Printer aria-hidden="true" className="h-4 w-4" />
                {t("report.print")}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={onNewScan}>
                <ArrowLeft aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
                {t("report.startNew")}
              </Button>
              {pdfError && <p className="max-w-[16rem] text-xs text-red-700">{t("report.pdfError")}</p>}
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-slate-200">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{t("report.permissions")}</dt>
              <dd className="mt-0.5 text-lg font-bold text-slate-900">
                {formatNumber(report.permissions.length, locale)}
              </dd>
            </div>
            <div className="rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-slate-200">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{t("report.findings")}</dt>
              <dd className="mt-0.5 text-lg font-bold text-slate-900">
                {formatNumber(findings.length, locale)}
              </dd>
            </div>
            <div className="rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-slate-200">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{t("report.domains")}</dt>
              <dd className="mt-0.5 text-lg font-bold text-slate-900">
                {formatNumber(domains.length, locale)}
              </dd>
            </div>
            <div className="rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-slate-200">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{t("report.riskLevel")}</dt>
              <dd className="mt-1">
                <RiskBadge
                  level={report.score.level}
                  label={t(`risk.${report.score.level}` as MessageKey)}
                />
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard icon={<ShieldCheck aria-hidden="true" className="h-5 w-5" />} title={t("report.permissions")}>
            <div className="space-y-5">
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t("report.permissionsRequired")}
                </h3>
                {renderPermissionList(requiredApi, t("report.noPermissions"))}
                {requiredHost.length > 0 && (
                  <div className="mt-3">{renderPermissionList(requiredHost, t("report.noPermissions"))}</div>
                )}
              </div>
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t("report.permissionsOptional")}
                </h3>
                {renderPermissionList([...optionalApi, ...optionalHost], t("report.noPermissions"))}
              </div>
              <p className="text-xs leading-5 text-slate-500">{t("report.englishDetailsNote")}</p>
            </div>
          </SectionCard>

          <div className="space-y-5">
            <SectionCard
              icon={<Globe2 aria-hidden="true" className="h-5 w-5" />}
              title={t("report.hostAccess")}
              subtitle={t("report.hostPatterns")}
            >
              <div className="flex flex-wrap items-center gap-2">
                <RiskBadge
                  level={
                    report.hostAccess.broadness === "all-sites"
                      ? "critical"
                      : report.hostAccess.broadness === "broad"
                        ? "high"
                        : report.hostAccess.broadness === "specific"
                          ? "moderate"
                          : "low"
                  }
                  label={t(`host.${report.hostAccess.broadness}` as MessageKey)}
                />
                <span className="text-xs text-slate-500">
                  {t("host.score")}: {report.hostAccess.score}/100
                </span>
              </div>
              {report.hostAccess.patterns.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">{t("host.none")}</p>
              ) : (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {report.hostAccess.patterns.map((pattern) => (
                    <li key={pattern}>
                      <code className="rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">
                        {pattern}
                      </code>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs leading-5 text-slate-500">{t("analyzer.limitsNote")}</p>
            </SectionCard>

            <SectionCard icon={<Info aria-hidden="true" className="h-5 w-5" />} title={t("report.extension")}>
              <dl className="grid gap-2 text-sm">
                <div className="flex justify-between gap-3 border-b border-slate-100 pb-1.5">
                  <dt className="text-slate-500">{t("report.name")}</dt>
                  <dd className="text-end font-medium text-slate-800">{report.manifest.name || t("common.none")}</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-slate-100 pb-1.5">
                  <dt className="text-slate-500">{t("report.version")}</dt>
                  <dd className="text-end font-medium text-slate-800">{report.manifest.version || t("common.none")}</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-slate-100 pb-1.5">
                  <dt className="text-slate-500">{t("report.manifestVersion")}</dt>
                  <dd className="text-end font-medium text-slate-800">{report.manifest.manifestVersion ?? t("common.none")}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">{t("report.browsers")}</dt>
                  <dd className="text-end font-medium text-slate-800">
                    {report.manifest.browsers.length > 0 ? report.manifest.browsers.join(", ") : t("common.none")}
                  </dd>
                </div>
              </dl>
              {report.manifest.description && (
                <p className="mt-3 text-sm leading-6 text-slate-600">{report.manifest.description}</p>
              )}
            </SectionCard>
          </div>
        </div>

        <SectionCard
          icon={<ShieldAlert aria-hidden="true" className="h-5 w-5" />}
          title={t("report.securityDetails")}
          subtitle={t("report.rawManifest")}
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t("report.contentScripts")}
              </h3>
              {report.manifest.contentScripts.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">{t("report.noneDeclared")}</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {report.manifest.contentScripts.map((script, index) => (
                    <li key={`${script.matches.join(",")}-${index}`} className="rounded-lg border border-slate-200 p-3 text-xs">
                      <p className="font-semibold text-slate-800">
                        {script.matches.join(", ") || t("common.none")}
                      </p>
                      <p className="mt-1 text-slate-500">
                        {script.js.length ? `JS: ${script.js.join(", ")}` : "JS: —"}
                      </p>
                      {script.css.length > 0 && <p className="text-slate-500">CSS: {script.css.join(", ")}</p>}
                      <p className="mt-1 text-slate-500">
                        {script.runAt ? `${t("report.runAt")}: ${script.runAt}` : ""}
                        {script.allFrames ? ` · ${t("report.allFrames")}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between gap-3 border-b border-slate-100 pb-1.5">
                <dt className="text-slate-500">{t("report.background")}</dt>
                <dd className="text-end font-medium text-slate-800">
                  {report.manifest.background
                    ? report.manifest.background.type
                    : t("common.none")}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-slate-100 pb-1.5">
                <dt className="text-slate-500">{t("report.serviceWorker")}</dt>
                <dd className="max-w-[14rem] break-all text-end font-medium text-slate-800">
                  {report.manifest.background?.serviceWorker ?? t("common.none")}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-slate-100 pb-1.5">
                <dt className="text-slate-500">{t("report.action")}</dt>
                <dd className="max-w-[14rem] break-all text-end font-medium text-slate-800">
                  {report.manifest.actionPopup ?? t("common.none")}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-slate-100 pb-1.5">
                <dt className="text-slate-500">{t("report.optionsPage")}</dt>
                <dd className="max-w-[14rem] break-all text-end font-medium text-slate-800">
                  {report.manifest.optionsPage ?? t("common.none")}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-slate-100 pb-1.5">
                <dt className="text-slate-500">{t("report.updateUrl")}</dt>
                <dd className="max-w-[14rem] break-all text-end font-medium text-slate-800">
                  {report.manifest.updateUrl ?? t("common.none")}
                </dd>
              </div>
              <div className="border-b border-slate-100 pb-1.5">
                <dt className="text-slate-500">{t("report.csp")}</dt>
                <dd className="mt-1 break-words font-mono text-xs text-slate-700">
                  {report.manifest.contentSecurityPolicy ?? t("common.none")}
                </dd>
              </div>
              <div className="border-b border-slate-100 pb-1.5">
                <dt className="text-slate-500">{t("report.externalConnections")}</dt>
                <dd className="mt-1 break-words font-mono text-xs text-slate-700">
                  {report.manifest.externallyConnectable
                    ? safeJsonPreview(report.manifest.externallyConnectable, 400)
                    : t("common.none")}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">{t("report.webAccessible")}</dt>
                <dd className="mt-1 break-words font-mono text-xs text-slate-700">
                  {report.manifest.webAccessibleResources
                    ? safeJsonPreview(report.manifest.webAccessibleResources, 400)
                    : t("common.none")}
                </dd>
              </div>
            </dl>
          </div>
        </SectionCard>

        <SectionCard
          icon={<Code2 aria-hidden="true" className="h-5 w-5" />}
          title={t("report.findings")}
          subtitle={t("report.findingsNote")}
        >
          <div className="no-print mt-4">
            <label htmlFor="finding-search" className="text-xs font-semibold text-slate-600">
              {t("report.searchFindings")}
            </label>
            <div className="relative mt-1">
              <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="finding-search"
                type="search"
                value={findingSearch}
                onChange={(event) => setFindingSearch(event.target.value)}
                placeholder={t("report.searchPlaceholder")}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pe-3 ps-9 text-sm text-slate-900 outline-none ring-teal-600 placeholder:text-slate-400 focus:border-teal-600 focus:ring-2"
              />
            </div>
          </div>

          <div className="no-print mt-3 flex flex-wrap gap-2">
            {(
              [
                ["all", counts.all],
                ["high", counts.high],
                ["medium", counts.medium],
                ["low", counts.low],
              ] as const
            ).map(([key, count]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFindingFilter(key)}
                aria-pressed={findingFilter === key}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition",
                  findingFilter === key
                    ? "border-teal-700 bg-teal-700 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-teal-500",
                )}
              >
                {key === "all"
                  ? t("report.findings")
                  : severityLabel(key === "high" ? "high" : key === "medium" ? "medium" : "low", t)}
                <span className="ms-1 opacity-70">{count}</span>
              </button>
            ))}
          </div>

          {findings.length === 0 ? (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              {t("report.noFindings")}
            </p>
          ) : filteredFindings.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">{t("report.noMatches")}</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {filteredFindings.map((finding) => (
                <li key={finding.id}>
                  <FindingRow finding={finding} locale={locale} t={t} />
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs leading-5 text-slate-500">{t("report.englishDetailsNote")}</p>
        </SectionCard>

        <SectionCard
          icon={<Globe2 aria-hidden="true" className="h-5 w-5" />}
          title={t("report.domains")}
          subtitle={t("report.domainsNote")}
        >
          {domains.length === 0 ? (
            <p className="text-sm text-slate-500">{t("report.noDomains")}</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[34rem] border-collapse text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 text-start font-semibold text-slate-700">
                      {t("domain.domain")}
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-start font-semibold text-slate-700">
                      {t("domain.category")}
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-end font-semibold text-slate-700">
                      {t("domain.references")}
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-start font-semibold text-slate-700">
                      {t("domain.files")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {domains.map((domain) => (
                    <tr key={domain.domain}>
                      <td className="px-4 py-2.5">
                        <code className="text-xs font-semibold text-slate-900">{domain.domain}</code>
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant={domain.category === "analytics" || domain.category === "advertising" ? "moderate" : "outline"}>
                          {t(`domain.${domain.category}` as MessageKey)}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 text-end tabular-nums text-slate-600">{domain.count}</td>
                      <td className="max-w-[16rem] px-4 py-2.5 text-xs text-slate-500">
                        {domain.files.slice(0, 2).join(", ")}
                        {domain.files.length > 2 && (
                          <span> (+{domain.files.length - 2} {t("report.moreFiles")})</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Link
            href={localizedPath(locale, `/learn/${DOMAIN_HELP_PAGE}`)}
            className="no-print mt-3 inline-flex text-xs font-semibold text-teal-800 hover:text-teal-950 hover:underline"
          >
            {t("common.learnMore")}
          </Link>
        </SectionCard>

        <SectionCard
          icon={<ShieldAlert aria-hidden="true" className="h-5 w-5" />}
          title={t("report.scoring")}
          subtitle={t("report.scoreFormula")}
        >
          <ul className="space-y-4">
            {report.score.categories.map((category) => (
              <li key={category.key}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    <Link
                      href={localizedPath(locale, `/learn/${categoryHelpPage(category.key)}`)}
                      className="no-print hover:text-teal-800 hover:underline"
                    >
                      {t(`category.${category.key}` as MessageKey)}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {category.score}/100 · {(category.weight)}% · {t("report.weighted")}: {category.weighted.toFixed(1)}
                  </p>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-700"
                    style={{ width: `${Math.max(2, category.score)}%` }}
                  />
                </div>
                <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-500" lang="en">
                  {category.evidence.map((line) => (
                    <li key={line} className="flex gap-1.5">
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-slate-900 px-4 py-3 text-white">
            <span className="text-sm font-semibold">{t("report.total")}</span>
            <span className="text-lg font-extrabold tabular-nums">
              {report.score.score}/100
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">{t("report.riskSummary")}</p>
            <p className="mt-1 text-sm leading-6 text-amber-900/90" lang="en">{report.score.summary}</p>
          </div>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{t("report.cannotProve")}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600" lang="en">{t("report.disclaimer")}</p>
          </div>
        </SectionCard>

        <SectionCard
          icon={<Wrench aria-hidden="true" className="h-5 w-5" />}
          title={t("report.priorityActions")}
          subtitle={t("report.riskSummary")}
        >
          {report.score.actions.length === 0 ? (
            <p className="text-sm text-slate-500">{t("report.noActions")}</p>
          ) : (
            <ol className="space-y-3">
              {report.score.actions.map((action, index) => (
                <li key={action.id} className="flex gap-3 rounded-xl border border-slate-200 p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <RiskBadge level={action.severity} label={severityLabel(action.severity, t)} />
                      <p className="text-sm font-semibold text-slate-900">{action.title}</p>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{action.detail}</p>
                    {action.rule && (
                      <Link
                        href={localizedPath(locale, `/learn/${findingHelpPage(action.rule)}`)}
                        className="no-print mt-2 inline-flex text-xs font-semibold text-teal-800 hover:text-teal-950 hover:underline"
                      >
                        {t("common.learnMore")}
                      </Link>
                    )}
                    {!action.rule && action.category && (
                      <Link
                        href={localizedPath(locale, `/learn/${categoryHelpPage(action.category)}`)}
                        className="no-print mt-2 inline-flex text-xs font-semibold text-teal-800 hover:text-teal-950 hover:underline"
                      >
                        {t("common.learnMore")}
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </SectionCard>

        <SectionCard
          icon={<FileText aria-hidden="true" className="h-5 w-5" />}
          title={t("report.stats")}
        >
          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-slate-500">{t("report.filesScanned")}</dt>
              <dd className="font-bold text-slate-900">{formatNumber(report.stats.filesScanned, locale)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">{t("report.entries")}</dt>
              <dd className="font-bold text-slate-900">{formatNumber(report.stats.entryCount, locale)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">{t("report.bytesScanned")}</dt>
              <dd className="font-bold text-slate-900">{formatNumber(report.stats.bytesScanned, locale)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">{t("report.fileSize")}</dt>
              <dd className="font-bold text-slate-900">{formatNumber(report.source.sizeBytes, locale)}</dd>
            </div>
          </dl>

          <div className="mt-5">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5" />
              {t("report.warnings")}
            </h3>
            {report.warnings.length === 0 ? (
              <p className="mt-1.5 text-sm text-slate-500">{t("report.noWarnings")}</p>
            ) : (
              <ul className="mt-1.5 list-inside list-disc space-y-1 text-sm text-slate-600" lang="en">
                {report.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <AlertOctagon aria-hidden="true" className="h-3.5 w-3.5" />
              {t("report.limits")}
            </h3>
            <ul className="mt-1.5 list-inside list-disc space-y-1 text-sm text-slate-600" lang="en">
              {report.limits.map((limit) => (
                <li key={limit}>{limit}</li>
              ))}
            </ul>
          </div>

          {report.manifest.raw && (
            <details className="no-print mt-5 rounded-xl border border-slate-200">
              <summary className="cursor-pointer px-4 py-2.5 text-sm font-semibold text-slate-800">
                {t("report.rawManifest")}
              </summary>
              <pre className="max-h-72 overflow-auto border-t border-slate-100 bg-slate-900 p-4 text-xs text-slate-100">
                <code>{JSON.stringify(report.manifest.raw, null, 2)}</code>
              </pre>
            </details>
          )}

          <p className="mt-4 text-center text-[11px] text-slate-400">{t("report.generatedBy")}</p>
        </SectionCard>
      </div>

      <div className="no-print flex flex-wrap justify-center gap-2">
        <Button type="button" onClick={onNewScan} variant="outline">
          <ArrowLeft aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
          {t("analyzer.newScan")}
        </Button>
        <Button type="button" onClick={handlePdf} disabled={pdfBusy} variant="outline">
          {pdfBusy ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Download aria-hidden="true" className="h-4 w-4" />}
          {t("report.exportPdf")}
        </Button>
      </div>
    </div>
  );
}

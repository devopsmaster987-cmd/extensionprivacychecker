import type { AnalysisReport } from "@/lib/analyze/types";
import { downloadBlob } from "@/lib/utils";

function safeName(value: string, fallback: string): string {
  const cleaned = value
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80);
  return cleaned || fallback;
}

export function reportBaseName(report: AnalysisReport): string {
  return safeName(report.manifest.name || report.source.name.replace(/\.(crx|xpi|zip)$/i, ""), "extension");
}

function csvCell(value: unknown): string {
  const text = String(value ?? "").replace(/\r?\n/g, " ").replace(/"/g, '""');
  return `"${text}"`;
}

export function reportSummary(report: AnalysisReport): string {
  const topFindings = report.findings
    .filter((finding) => finding.severity === "high" || finding.severity === "critical")
    .slice(0, 5)
    .map((finding) => `- ${finding.rule}: ${finding.file}${finding.line ? `:${finding.line}` : ""}`);
  const topDomains = report.domains.slice(0, 8).map((domain) => `- ${domain.domain} (${domain.category})`);
  return [
    `${report.manifest.name || report.source.name} ${report.manifest.version ?? ""}`.trim(),
    `Risk score: ${report.score.score}/100 (${report.score.level}, grade ${report.score.grade})`,
    `Permissions: ${report.permissions.length}; findings: ${report.findings.length}; domains: ${report.domains.length}`,
    "",
    "Priority actions:",
    ...report.score.actions.map((action) => `- ${action.title}: ${action.detail}`),
    "",
    "High-severity findings:",
    ...(topFindings.length ? topFindings : ["- None detected"]),
    "",
    "Referenced domains:",
    ...(topDomains.length ? topDomains : ["- None extracted"]),
    "",
    "Static analysis only. A score or finding is not proof of malicious behavior.",
  ].join("\n");
}

export function downloadCsvReport(report: AnalysisReport, locale: string): void {
  const rows: string[][] = [["type", "name", "severity", "category", "file", "line", "detail"]];
  for (const permission of report.permissions) {
    rows.push([
      "permission",
      permission.key,
      permission.level,
      permission.kind,
      "manifest.json",
      "",
      permission.description,
    ]);
  }
  for (const finding of report.findings) {
    rows.push([
      "finding",
      finding.rule,
      finding.severity,
      finding.category,
      finding.file,
      finding.line ? String(finding.line) : "",
      finding.explanation,
    ]);
  }
  for (const domain of report.domains) {
    rows.push([
      "domain",
      domain.domain,
      "",
      domain.category,
      domain.files.join("; "),
      "",
      `${domain.count} reference(s)`,
    ]);
  }
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, `${reportBaseName(report)}-privacy-report-${locale}.csv`);
}

export function downloadJsonReport(report: AnalysisReport, locale: string): void {
  const json = JSON.stringify(report, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  downloadBlob(blob, `${reportBaseName(report)}-privacy-report-${locale}.json`);
}

export async function downloadPdfReport(element: HTMLElement, report: AnalysisReport, locale: string): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(element, {
    scale: Math.min(1.5, Math.max(1, window.devicePixelRatio || 1)),
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: Math.max(element.scrollWidth, 900),
    onclone: (clonedDocument) => {
      clonedDocument.querySelectorAll<HTMLElement>(".no-print").forEach((node) => {
        node.style.display = "none";
      });
      clonedDocument.querySelectorAll("details").forEach((details) => {
        details.open = true;
      });
    },
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 24;
  const imageWidth = pageWidth - margin * 2;
  const imageHeight = (canvas.height * imageWidth) / canvas.width;
  const usableHeight = pageHeight - margin * 2;
  const imageData = canvas.toDataURL("image/png", 0.92);

  let heightLeft = imageHeight;
  let position = margin;
  pdf.addImage(imageData, "PNG", margin, position, imageWidth, imageHeight, undefined, "FAST");
  heightLeft -= usableHeight;

  while (heightLeft > 0) {
    position = margin - (imageHeight - heightLeft);
    pdf.addPage();
    pdf.addImage(imageData, "PNG", margin, position, imageWidth, imageHeight, undefined, "FAST");
    heightLeft -= usableHeight;
  }

  pdf.save(`${reportBaseName(report)}-privacy-report-${locale}.pdf`);
}

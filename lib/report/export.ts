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

import { extractArchive } from "../archive/zip";
import { extractZipFromCrx, isCrx, isZip } from "../archive/crx";
import { AnalysisError } from "../errors";
import { LIMITS } from "./limits";
import { extractDomains } from "./domains";
import { analyzeHostAccess, hostPatternsFromManifest } from "./host";
import { analyzeJavaScriptFile } from "./js";
import { emptyManifest, findManifestFile, manifestFindings, summarizeManifest } from "./manifest";
import { analyzeHostPermission, analyzePermissions } from "./permissions";
import { calculateRisk } from "./risk";
import type {
  AnalysisProgress,
  AnalysisReport,
  ExtractedTextFile,
  Finding,
  PermissionInfo,
  SourceInfo,
} from "./types";

const SEVERITY_ORDER: Record<Finding["severity"], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
};

const LIMIT_NOTES = [
  "Static analysis reads the files in the package. It does not execute the extension.",
  "A reference to a domain, API or pattern does not prove that the extension performed that action.",
  "Bundled or minified library code can produce findings that are not part of the extension author's own logic.",
  "The analysis only covers files included in this package; code loaded later from a server cannot be inspected.",
];

function sourceKind(filename: string, crx: boolean, zip: boolean): SourceInfo["kind"] {
  const lower = filename.toLowerCase();
  if (crx || lower.endsWith(".crx")) return "crx";
  if (lower.endsWith(".xpi")) return "xpi";
  if (lower.endsWith(".zip") || zip) return "zip";
  if (lower.endsWith(".json")) return "json";
  return "extension-package";
}

function htmlFindings(path: string, html: string): Finding[] {
  const findings: Finding[] = [];
  const pattern = /<script\b[^>]*\bsrc\s*=\s*["']((?:https?:)?\/\/[^"']+)["'][^>]*>/gi;
  for (const match of html.matchAll(pattern)) {
    const index = match.index ?? 0;
    const line = html.slice(0, index).split("\n").length;
    findings.push({
      id: `${path}:${line}:html-remote-script`,
      rule: "remote-script",
      category: "remote-code",
      file: path,
      line,
      column: null,
      severity: "high",
      confidence: "medium",
      evidence: match[0].slice(0, 180),
      explanation:
        "This HTML file loads a script from an external URL. The remote file could change after the extension was packaged.",
      recommendation:
        "Confirm that remote script loading is intentional and that the host is trusted. Manifest V3 extensions should bundle executable code.",
    });
  }
  return findings;
}

const RAW_IPV4 = /^\d{1,3}(?:\.\d{1,3}){3}$/;
const TEMPORARY_UPLOAD_HOSTS = [
  "pastebin.com",
  "paste.ee",
  "transfer.sh",
  "file.io",
  "0x0.st",
  "webhook.site",
  "requestbin.net",
  "pipedream.net",
  "ngrok.io",
  "ngrok-free.app",
];

function endpointFindings(domains: AnalysisReport["domains"]): Finding[] {
  const findings: Finding[] = [];
  for (const domain of domains) {
    const isIp = RAW_IPV4.test(domain.domain);
    const isTemporary = TEMPORARY_UPLOAD_HOSTS.some(
      (host) => domain.domain === host || domain.domain.endsWith(`.${host}`),
    );
    if (!isIp && !isTemporary) continue;
    findings.push({
      id: `domain:${domain.domain}:suspicious-endpoint`,
      rule: "suspicious-endpoint",
      category: "network",
      file: domain.files[0] ?? "manifest.json",
      line: null,
      column: null,
      severity: isTemporary ? "high" : "medium",
      confidence: "low",
      evidence: domain.domain,
      explanation: isIp
        ? "The package references a raw IP address instead of a named host. IP endpoints are harder to attribute and can change ownership."
        : "The package references a host commonly used for temporary file sharing, webhooks or tunnels. These services can receive data without a stable, identifiable destination.",
      recommendation:
        "Identify what is sent to this endpoint, who operates it and whether the destination is documented by the publisher.",
    });
  }
  return findings;
}

function exfiltrationFinding(input: {
  permissions: PermissionInfo[];
  hostAccess: AnalysisReport["hostAccess"];
  findings: Finding[];
}): Finding | null {
  const hasNetwork = input.findings.some((finding) =>
    ["network-request", "websocket", "suspicious-endpoint"].includes(finding.rule),
  );
  const hasSensitiveAccess =
    input.permissions.some((permission) =>
      ["cookies", "history", "clipboardRead", "debugger", "webRequest"].includes(permission.key),
    ) ||
    input.findings.some((finding) =>
      ["credential-access", "secret-token", "clipboard-access", "cookie-access"].includes(finding.rule),
    );
  const broadSiteAccess =
    input.hostAccess.broadness === "all-sites" || input.hostAccess.broadness === "broad";

  if (!hasNetwork || !hasSensitiveAccess || !broadSiteAccess) return null;

  return {
    id: "package:data-exfiltration",
    rule: "data-exfiltration",
    category: "sensitive-data",
    file: input.hostAccess.patterns[0] ?? "manifest.json",
    line: null,
    column: null,
    severity: "high",
    confidence: "low",
    evidence: "Network API + sensitive data access + broad site access",
    explanation:
      "The package combines a network request API, access to sensitive page or browser data, and broad website access. This combination does not prove data exfiltration, but it is the pattern reviewers should trace first.",
    recommendation:
      "Trace each request that carries page, cookie, credential, clipboard or history data. Confirm the destination, the encryption in transit and the retention policy.",
  };
}

function inlineScriptFindings(file: ExtractedTextFile): Finding[] {
  if (!/\.html?$/i.test(file.path)) return [];
  const findings: Finding[] = [];
  const pattern = /<script\b(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi;
  let index = 0;
  for (const match of file.text.matchAll(pattern)) {
    index += 1;
    if (index > 20) break;
    const code = match[1];
    if (!code.trim()) continue;
    const result = analyzeJavaScriptFile(`${file.path}#inline-${index}`, code);
    findings.push(...result.findings);
  }
  return findings;
}

export async function analyzePackage(
  bytes: Uint8Array,
  filename: string,
  onProgress?: (progress: AnalysisProgress) => void,
): Promise<AnalysisReport> {
  if (bytes.byteLength === 0) {
    throw new AnalysisError("EMPTY_FILE", "The uploaded file is empty.");
  }
  if (bytes.byteLength > LIMITS.maxUploadBytes) {
    throw new AnalysisError(
      "FILE_TOO_LARGE",
      `The file is ${(bytes.byteLength / 1024 / 1024).toFixed(1)} MB, above the ${Math.round(
        LIMITS.maxUploadBytes / 1024 / 1024,
      )} MB limit.`,
    );
  }

  onProgress?.({ stage: "reading", percent: 5 });

  const crx = isCrx(bytes);
  const zip = isZip(bytes);
  const lowerName = filename.toLowerCase();
  const text = new TextDecoder("utf-8", { fatal: false }).decode(
    bytes.subarray(0, Math.min(bytes.byteLength, 4)),
  );

  let files: ExtractedTextFile[] = [];
  let entryCount = 0;
  let totalUncompressedBytes = bytes.byteLength;
  let skipped: string[] = [];
  const warnings: string[] = [];

  if (crx) {
    onProgress?.({ stage: "unpacking", percent: 15, detail: "CRX" });
    const extracted = extractZipFromCrx(bytes);
    const archive = await extractArchive(extracted.zip);
    files = archive.files;
    entryCount = archive.entryCount;
    totalUncompressedBytes = archive.totalUncompressedBytes;
    skipped = archive.skipped;
    warnings.push(...archive.warnings);
    warnings.push(`CRX version ${extracted.version} header detected and removed before ZIP analysis.`);
  } else if (zip) {
    onProgress?.({ stage: "unpacking", percent: 15, detail: "ZIP/XPI" });
    const archive = await extractArchive(bytes);
    files = archive.files;
    entryCount = archive.entryCount;
    totalUncompressedBytes = archive.totalUncompressedBytes;
    skipped = archive.skipped;
    warnings.push(...archive.warnings);
  } else if (lowerName.endsWith(".json") || text.trimStart().startsWith("{")) {
    if (!lowerName.endsWith(".json")) {
      throw new AnalysisError(
        "UNSUPPORTED_TYPE",
        "The file is not a CRX, ZIP, XPI or manifest JSON file.",
      );
    }
    files = [{ path: "manifest.json", text: new TextDecoder("utf-8").decode(bytes), bytes: bytes.byteLength }];
    entryCount = 1;
    warnings.push("A standalone manifest JSON file was analyzed. Referenced script files are not included.");
  } else {
    throw new AnalysisError(
      "UNSUPPORTED_TYPE",
      "The file is not a CRX, ZIP, XPI or manifest JSON file.",
    );
  }

  onProgress?.({ stage: "manifest", percent: 30 });

  const manifestFile = findManifestFile(files);
  if (!manifestFile) {
    const manifest = emptyManifest();
    throw new AnalysisError(
      "MANIFEST_MISSING",
      `No manifest.json was found. ${manifest.errors[0]}`,
    );
  }

  let rawManifest: unknown;
  try {
    rawManifest = JSON.parse(manifestFile.text);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown JSON error";
    throw new AnalysisError("MANIFEST_INVALID", `manifest.json is not valid JSON: ${message}`);
  }

  if (!rawManifest || typeof rawManifest !== "object" || Array.isArray(rawManifest)) {
    throw new AnalysisError("MANIFEST_INVALID", "manifest.json must contain a JSON object.");
  }

  const { manifest, warnings: manifestWarnings } = summarizeManifest(rawManifest, manifestFile.path);
  warnings.push(...manifestWarnings);

  onProgress?.({ stage: "source", percent: 45 });

  const requiredHostPermissions = manifest.hostPermissions.map((raw) => ({
    ...analyzeHostPermission(raw),
    optional: false,
  }));
  const optionalHostPermissions = manifest.optionalHostPermissions.map((raw) => ({
    ...analyzeHostPermission(raw),
    optional: true,
  }));

  const seenPermissions = new Set<string>();
  const permissions: PermissionInfo[] = [];
  for (const permission of [
    ...analyzePermissions(manifest.permissions, manifest.optionalPermissions),
    ...requiredHostPermissions,
    ...optionalHostPermissions,
  ]) {
    const key = `${permission.optional ? "optional" : "required"}:${permission.key}`;
    if (seenPermissions.has(key)) continue;
    seenPermissions.add(key);
    permissions.push(permission);
  }

  const hostAccess = analyzeHostAccess(
    hostPatternsFromManifest({
      hostPermissions: manifest.hostPermissions,
      contentScripts: manifest.contentScripts,
      optionalHostPermissions: manifest.optionalHostPermissions,
    }),
  );

  const findings: Finding[] = [...manifestFindings(manifest)];
  const scriptFiles = files.filter((file) => /\.(js|mjs|cjs|jsx)$/i.test(file.path));
  let parseWarnings = 0;

  for (const file of scriptFiles) {
    const result = analyzeJavaScriptFile(file.path, file.text);
    findings.push(...result.findings);
    if (result.parseError) parseWarnings += 1;
  }

  for (const file of files) {
    if (/\.html?$/i.test(file.path)) {
      findings.push(...htmlFindings(file.path, file.text));
      findings.push(...inlineScriptFindings(file));
    }
  }

  if (parseWarnings > 0) {
    warnings.push(
      `${parseWarnings} JavaScript file(s) could not be fully parsed. Findings for those files may be incomplete.`,
    );
  }

  onProgress?.({ stage: "domains", percent: 70 });

  const domains = extractDomains(
    files.filter((file) => /\.(js|mjs|cjs|jsx|html?|json|txt)$/i.test(file.path)),
    manifest,
  );
  findings.push(...endpointFindings(domains));
  const exfiltration = exfiltrationFinding({ permissions, hostAccess, findings });
  if (exfiltration) findings.push(exfiltration);

  onProgress?.({ stage: "scoring", percent: 85 });

  const deduped = new Map<string, Finding>();
  for (const finding of findings) deduped.set(finding.id, finding);
  const sortedFindings = Array.from(deduped.values())
    .sort(
      (a, b) =>
        SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
        a.file.localeCompare(b.file) ||
        (a.line ?? 0) - (b.line ?? 0),
    )
    .slice(0, LIMITS.maxFindings);

  const score = calculateRisk({ permissions, hostAccess, findings: sortedFindings, domains });

  onProgress?.({ stage: "done", percent: 100 });

  return {
    schemaVersion: 1,
    analyzedAt: new Date().toISOString(),
    source: {
      name: filename,
      kind: sourceKind(filename, crx, zip),
      sizeBytes: bytes.byteLength,
    },
    manifest,
    permissions,
    hostAccess,
    findings: sortedFindings,
    domains,
    score,
    stats: {
      entryCount,
      filesScanned: files.length,
      jsFiles: scriptFiles.length,
      bytesScanned: files.reduce((total, file) => total + file.bytes, 0),
      totalUncompressedBytes,
      skipped: skipped.slice(0, 25),
    },
    warnings: Array.from(new Set(warnings)),
    limits: LIMIT_NOTES,
  };
}

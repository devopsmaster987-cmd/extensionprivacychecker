import type { AnalysisReport, DomainRef, Finding, PermissionInfo } from "./types";

export interface ReportComparison {
  scoreDelta: number;
  riskDirection: "improved" | "worse" | "same";
  permissions: { added: PermissionInfo[]; removed: PermissionInfo[] };
  hostPatterns: { added: string[]; removed: string[] };
  domains: { added: DomainRef[]; removed: DomainRef[] };
  findings: { added: Finding[]; removed: Finding[] };
  manifest: {
    versionChanged: boolean;
    manifestVersionChanged: boolean;
    contentScriptsChanged: boolean;
  };
}

function permissionKey(permission: PermissionInfo): string {
  return `${permission.kind}:${permission.optional ? "optional" : "required"}:${permission.key}`;
}

function findingKey(finding: Finding): string {
  return `${finding.rule}:${finding.file}:${finding.line ?? 0}:${finding.evidence}`;
}

function difference<T>(left: T[], right: T[], key: (item: T) => string): { added: T[]; removed: T[] } {
  const leftKeys = new Set(left.map(key));
  const rightKeys = new Set(right.map(key));
  return {
    added: right.filter((item) => !leftKeys.has(key(item))),
    removed: left.filter((item) => !rightKeys.has(key(item))),
  };
}

function stringDifference(left: string[], right: string[]): { added: string[]; removed: string[] } {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  return {
    added: right.filter((item) => !leftSet.has(item)),
    removed: left.filter((item) => !rightSet.has(item)),
  };
}

export function compareReports(left: AnalysisReport, right: AnalysisReport): ReportComparison {
  const scoreDelta = right.score.score - left.score.score;
  return {
    scoreDelta,
    riskDirection: scoreDelta < 0 ? "improved" : scoreDelta > 0 ? "worse" : "same",
    permissions: difference(left.permissions, right.permissions, permissionKey),
    hostPatterns: stringDifference(left.hostAccess.patterns, right.hostAccess.patterns),
    domains: difference(left.domains, right.domains, (domain) => domain.domain),
    findings: difference(left.findings, right.findings, findingKey),
    manifest: {
      versionChanged: left.manifest.version !== right.manifest.version,
      manifestVersionChanged: left.manifest.manifestVersion !== right.manifest.manifestVersion,
      contentScriptsChanged:
        JSON.stringify(left.manifest.contentScripts) !== JSON.stringify(right.manifest.contentScripts),
    },
  };
}

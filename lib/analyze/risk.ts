import type {
  DomainRef,
  Finding,
  FindingRule,
  HostAccessSummary,
  PermissionInfo,
  PrivacyGrade,
  RiskAction,
  RiskAssessment,
  ScoreCategory,
  Severity,
} from "./types";

const WEIGHTS = {
  permissionExposure: 25,
  websiteAccess: 20,
  dataCollection: 15,
  remoteCode: 20,
  externalDomains: 10,
  obfuscation: 10,
} as const;

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function permissionExposure(permissions: PermissionInfo[]): { score: number; evidence: string[] } {
  const required = permissions.filter((permission) => !permission.optional);
  const apiScore = required
    .filter((permission) => permission.kind === "api")
    .reduce((total, permission) => total + permission.score, 0);
  const broadCount = required.filter((permission) => permission.broad).length;
  const score = clamp(apiScore * 2.5 + broadCount * 2);
  const top = required
    .filter((permission) => permission.kind === "api")
    .slice(0, 5)
    .map((permission) => `${permission.key} (${permission.score})`);

  const evidence: string[] = [];
  if (apiScore === 0) {
    evidence.push("No required API permissions were found.");
  } else {
    evidence.push(`Required API permission weight total: ${apiScore}, multiplied by 2.5.`);
    evidence.push(`Highest-weight permissions: ${top.join(", ")}.`);
  }
  if (broadCount > 0) evidence.push(`${broadCount} permission(s) are marked as broad-access.`);

  return { score, evidence };
}

function remoteCode(findings: Finding[]): { score: number; evidence: string[] } {
  const count = (rules: string[]) => findings.filter((finding) => rules.includes(finding.rule)).length;
  const evalCount = count(["eval", "function-constructor"]);
  const remoteScriptCount = count(["remote-script"]);
  const importCount = count(["import-scripts"]);
  const timerCount = count(["timer-string"]);
  const miningCount = count(["crypto-mining"]);

  const score = clamp(
    Math.min(70, evalCount * 35) +
      Math.min(50, remoteScriptCount * 25) +
      Math.min(30, importCount * 20) +
      Math.min(10, timerCount * 5) +
      Math.min(30, miningCount * 30),
  );

  const evidence: string[] = [];
  evidence.push(`${evalCount} dynamic code execution indicator(s) (eval or Function constructor).`);
  evidence.push(`${remoteScriptCount} remote script loading indicator(s).`);
  evidence.push(`${importCount} runtime importScripts() indicator(s).`);
  if (timerCount) evidence.push(`${timerCount} timer string evaluation indicator(s).`);
  if (miningCount) evidence.push(`${miningCount} crypto-mining indicator(s).`);
  if (score === 0) evidence.push("No remote or dynamic code indicators were found.");

  return { score, evidence };
}

function dataCollection(
  permissions: PermissionInfo[],
  findings: Finding[],
  domains: DomainRef[],
): { score: number; evidence: string[] } {
  const categoryCount = (category: Finding["category"]) =>
    findings.filter((finding) => finding.category === category).length;

  const storage = categoryCount("storage");
  const network = findings.filter((finding) => finding.rule === "network-request" || finding.rule === "websocket").length;
  const sensitive = findings.filter((finding) => finding.category === "sensitive-data").length;
  const dataDomains = domains.filter((domain) =>
    ["analytics", "advertising", "unknown", "error-reporting"].includes(domain.category),
  ).length;
  const hasCookies = permissions.some((permission) => permission.key === "cookies" && !permission.optional);
  const hasHistory = permissions.some((permission) => permission.key === "history" && !permission.optional);

  const score = clamp(
    (storage > 0 ? 8 : 0) +
      Math.min(15, network * 3) +
      Math.min(25, sensitive * 10) +
      Math.min(25, dataDomains * 4) +
      (hasCookies ? 15 : 0) +
      (hasHistory ? 10 : 0),
  );

  const evidence: string[] = [
    `${storage} storage API reference(s); ${network} network request reference(s); ${sensitive} sensitive-data indicator(s).`,
    `${dataDomains} referenced domain(s) are analytics, advertising, error-reporting or unclassified.`,
  ];
  if (hasCookies) evidence.push("The extension requests the cookies permission.");
  if (hasHistory) evidence.push("The extension requests the history permission.");
  if (score === 0) evidence.push("No data-collection indicators were detected in the scanned files.");

  return { score, evidence };
}

function externalDomains(domains: DomainRef[]): { score: number; evidence: string[] } {
  const unique = domains.length;
  let score = 0;
  if (unique >= 41) score = 85;
  else if (unique >= 21) score = 70;
  else if (unique >= 11) score = 55;
  else if (unique >= 6) score = 40;
  else if (unique >= 3) score = 25;
  else if (unique >= 1) score = 10;

  const adTech = domains.filter((domain) =>
    ["analytics", "advertising"].includes(domain.category),
  ).length;
  const unknown = domains.filter((domain) => domain.category === "unknown").length;
  if (adTech > 0) score += 10;
  if (unique > 0 && unknown === unique) score += 5;

  const evidence = [
    `${unique} unique external domain reference(s) were extracted.`,
    `${adTech} domain(s) are associated with analytics or advertising; ${unknown} could not be classified.`,
    "A referenced domain does not prove that the extension contacted it.",
  ];

  return { score: clamp(score), evidence };
}

function obfuscation(findings: Finding[]): { score: number; evidence: string[] } {
  const matches = findings.filter((finding) => finding.rule === "obfuscation");
  const score = clamp(
    matches.reduce(
      (total, finding) => total + (finding.severity === "high" ? 75 : finding.severity === "medium" ? 55 : 30),
      0,
    ),
  );
  const evidence =
    matches.length === 0
      ? ["No obfuscation indicators were detected. Minified code can still be hard to read."]
      : matches.map((finding) => `${finding.file}: ${finding.evidence}`);
  return { score, evidence };
}

const SEVERITY_RANK: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
};

export function privacyGrade(score: number): PrivacyGrade {
  if (score <= 14) return "A";
  if (score <= 29) return "B";
  if (score <= 49) return "C";
  if (score <= 69) return "D";
  return "F";
}

function buildActions(input: {
  permissions: PermissionInfo[];
  hostAccess: HostAccessSummary;
  findings: Finding[];
  domains: DomainRef[];
}): RiskAction[] {
  const actions = new Map<string, RiskAction>();
  const add = (action: RiskAction) => {
    if (!actions.has(action.id)) actions.set(action.id, action);
  };

  if (input.hostAccess.broadness === "all-sites") {
    add({
      id: "host:all-sites",
      severity: "high",
      title: "Restrict access to every website",
      detail:
        "The extension can read or change content on any site, including signed-in pages. Prefer a build that requests only the sites it needs, or restrict site access in the browser.",
      category: "websiteAccess",
    });
  } else if (input.hostAccess.broadness === "broad") {
    add({
      id: "host:broad",
      severity: "medium",
      title: "Review broad website access",
      detail:
        "Several host patterns or wildcard domains give the extension a wide reach. Check that every pattern matches a documented feature.",
      category: "websiteAccess",
    });
  }

  for (const permission of input.permissions) {
    if (permission.optional) continue;
    if (permission.level !== "high" && permission.level !== "critical") continue;
    add({
      id: `permission:${permission.key}`,
      severity: permission.level,
      title: `Review the ${permission.key} permission`,
      detail: permission.recommendation,
    });
  }

  for (const finding of input.findings) {
    if (finding.severity !== "high" && finding.severity !== "critical") continue;
    add({
      id: `finding:${finding.rule}`,
      severity: finding.severity,
      title: finding.explanation.split(".")[0] || finding.rule,
      detail: finding.recommendation,
      rule: finding.rule as FindingRule,
    });
  }

  const trackingDomains = input.domains.filter((domain) =>
    ["analytics", "advertising"].includes(domain.category),
  );
  if (trackingDomains.length > 0) {
    add({
      id: "domains:tracking",
      severity: "medium",
      title: "Check analytics and advertising endpoints",
      detail: `${trackingDomains.length} referenced domain(s) are associated with analytics or advertising. Confirm what is sent and whether it matches the privacy policy.`,
      category: "externalDomains",
    });
  }

  const unknownDomains = input.domains.filter((domain) => domain.category === "unknown");
  if (unknownDomains.length >= 5) {
    add({
      id: "domains:unknown",
      severity: "low",
      title: "Identify unclassified external hosts",
      detail: `${unknownDomains.length} referenced domains could not be classified. Review the endpoints that handle user data first.`,
      category: "externalDomains",
    });
  }

  return Array.from(actions.values())
    .sort(
      (a, b) =>
        SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] ||
        a.title.localeCompare(b.title),
    )
    .slice(0, 6);
}

export function calculateRisk(input: {
  permissions: PermissionInfo[];
  hostAccess: HostAccessSummary;
  findings: Finding[];
  domains: DomainRef[];
}): RiskAssessment {
  const permissionResult = permissionExposure(input.permissions);
  const remoteResult = remoteCode(input.findings);
  const dataResult = dataCollection(input.permissions, input.findings, input.domains);
  const domainResult = externalDomains(input.domains);
  const obfuscationResult = obfuscation(input.findings);

  const categories: ScoreCategory[] = [
    {
      key: "permissionExposure",
      score: permissionResult.score,
      weight: WEIGHTS.permissionExposure,
      weighted: (permissionResult.score * WEIGHTS.permissionExposure) / 100,
      evidence: permissionResult.evidence,
    },
    {
      key: "websiteAccess",
      score: input.hostAccess.score,
      weight: WEIGHTS.websiteAccess,
      weighted: (input.hostAccess.score * WEIGHTS.websiteAccess) / 100,
      evidence: input.hostAccess.evidence,
    },
    {
      key: "dataCollection",
      score: dataResult.score,
      weight: WEIGHTS.dataCollection,
      weighted: (dataResult.score * WEIGHTS.dataCollection) / 100,
      evidence: dataResult.evidence,
    },
    {
      key: "remoteCode",
      score: remoteResult.score,
      weight: WEIGHTS.remoteCode,
      weighted: (remoteResult.score * WEIGHTS.remoteCode) / 100,
      evidence: remoteResult.evidence,
    },
    {
      key: "externalDomains",
      score: domainResult.score,
      weight: WEIGHTS.externalDomains,
      weighted: (domainResult.score * WEIGHTS.externalDomains) / 100,
      evidence: domainResult.evidence,
    },
    {
      key: "obfuscation",
      score: obfuscationResult.score,
      weight: WEIGHTS.obfuscation,
      weighted: (obfuscationResult.score * WEIGHTS.obfuscation) / 100,
      evidence: obfuscationResult.evidence,
    },
  ];

  const score = clamp(categories.reduce((total, category) => total + category.weighted, 0));
  const level: RiskAssessment["level"] =
    score >= 75 ? "critical" : score >= 50 ? "high" : score >= 25 ? "moderate" : "low";

  return {
    score,
    level,
    grade: privacyGrade(score),
    categories,
    actions: buildActions(input),
    summary:
      "This score estimates privacy and security exposure from static indicators. It is not a malware verdict. A high score can come from legitimate broad functionality, and a low score does not guarantee that an extension is safe.",
  };
}

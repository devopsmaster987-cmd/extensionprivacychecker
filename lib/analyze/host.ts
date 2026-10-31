import type { HostAccessSummary } from "./types";

const ALL_SITES = new Set(["<all_urls>", "*://*/*", "http://*/*", "https://*/*"]);

export function analyzeHostAccess(patterns: string[]): HostAccessSummary {
  const unique = Array.from(new Set(patterns.map((pattern) => pattern.trim()).filter(Boolean)));
  const allSites = unique.filter((pattern) => ALL_SITES.has(pattern));

  if (allSites.length > 0) {
    return {
      patterns: unique,
      broadness: "all-sites",
      score: 100,
      evidence: [
        `Requests access to every website (${allSites.join(", ")}).`,
        "Content on any page you visit, including logged-in pages, could be visible to the extension.",
      ],
    };
  }

  if (unique.length === 0) {
    return {
      patterns: [],
      broadness: "none",
      score: 0,
      evidence: ["No host permissions or content-script match patterns were found."],
    };
  }

  const evidence: string[] = [];
  let broadWildcards = 0;
  let domainWildcards = 0;
  let exactHosts = 0;
  let fileAccess = false;

  for (const pattern of unique) {
    if (pattern.startsWith("file://")) fileAccess = true;
    if (/^\*:\/\/\*\./.test(pattern) || /^https?:\/\/\*\./.test(pattern)) domainWildcards += 1;
    else if (/^[a-z*]+:\/\/[^/]+\//i.test(pattern) && pattern.includes("*.")) domainWildcards += 1;
    else if (/^\*:\/\//.test(pattern) || /^https?:\/\/[^/]*\*[^/]*\//.test(pattern)) broadWildcards += 1;
    else exactHosts += 1;
  }

  const breadthScore = Math.min(
    100,
    exactHosts * 6 + domainWildcards * 18 + broadWildcards * 35 + (fileAccess ? 15 : 0) + unique.length * 2,
  );

  if (broadWildcards > 0 || fileAccess) {
    evidence.push(
      `Includes broad match patterns${fileAccess ? " and local file access" : ""} that can reach many sites.`,
    );
  }
  if (domainWildcards > 0) {
    evidence.push(`Includes ${domainWildcards} wildcard subdomain pattern(s), which can cover many hosts.`);
  }
  if (exactHosts > 0) {
    evidence.push(`Targets ${exactHosts} specific host pattern(s).`);
  }
  evidence.push(`Total of ${unique.length} distinct host or content-script match pattern(s).`);

  return {
    patterns: unique,
    broadness: breadthScore >= 60 ? "broad" : "specific",
    score: breadthScore,
    evidence,
  };
}

export function hostPatternsFromManifest(input: {
  hostPermissions: string[];
  contentScripts: { matches: string[] }[];
  optionalHostPermissions: string[];
}): string[] {
  return [
    ...input.hostPermissions,
    ...input.optionalHostPermissions,
    ...input.contentScripts.flatMap((script) => script.matches),
  ];
}

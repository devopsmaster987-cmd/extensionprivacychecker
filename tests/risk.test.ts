import { describe, expect, it } from "vitest";
import { analyzeHostAccess } from "@/lib/analyze/host";
import { analyzePermissions } from "@/lib/analyze/permissions";
import { calculateRisk } from "@/lib/analyze/risk";
import type { Finding } from "@/lib/analyze/types";

function finding(overrides: Partial<Finding>): Finding {
  return {
    id: "id",
    rule: "network-request",
    category: "network",
    file: "a.js",
    line: 1,
    column: 1,
    severity: "info",
    confidence: "high",
    evidence: "fetch(...)",
    explanation: "",
    recommendation: "",
    ...overrides,
  };
}

describe("risk scoring", () => {
  it("returns a transparent weighted score with six categories", () => {
    const risk = calculateRisk({
      permissions: analyzePermissions(["tabs"]),
      hostAccess: analyzeHostAccess(["https://example.com/*"]),
      findings: [],
      domains: [],
    });
    expect(risk.categories).toHaveLength(6);
    expect(risk.categories.reduce((total, category) => total + category.weight, 0)).toBe(100);
    expect(risk.score).toBeGreaterThanOrEqual(0);
    expect(risk.score).toBeLessThanOrEqual(100);
    expect(risk.summary).toMatch(/not a malware verdict/i);
  });

  it("scores broad access and dynamic code higher", () => {
    const low = calculateRisk({
      permissions: analyzePermissions(["storage"]),
      hostAccess: analyzeHostAccess([]),
      findings: [],
      domains: [],
    });
    const high = calculateRisk({
      permissions: analyzePermissions(["debugger", "cookies", "nativeMessaging"]),
      hostAccess: analyzeHostAccess(["<all_urls>"]),
      findings: [
        finding({ rule: "eval", category: "dynamic-code", severity: "high" }),
        finding({ rule: "remote-script", category: "remote-code", severity: "high" }),
        finding({ rule: "obfuscation", category: "obfuscation", severity: "medium" }),
      ],
      domains: Array.from({ length: 30 }, (_, index) => ({
        domain: `site${index}.example.net`,
        category: "unknown" as const,
        count: 1,
        files: ["a.js"],
      })),
    });
    expect(high.score).toBeGreaterThan(low.score);
    expect(["high", "critical"]).toContain(high.level);
  });

  it("maps score thresholds to levels", () => {
    const risk = calculateRisk({
      permissions: analyzePermissions(["debugger", "nativeMessaging", "proxy"]),
      hostAccess: analyzeHostAccess(["<all_urls>"]),
      findings: [
        finding({ rule: "eval", category: "dynamic-code", severity: "high" }),
        finding({ rule: "remote-script", category: "remote-code", severity: "high" }),
        finding({ rule: "obfuscation", category: "obfuscation", severity: "medium" }),
      ],
      domains: Array.from({ length: 10 }, (_, index) => ({
        domain: `site${index}.example.net`,
        category: "unknown" as const,
        count: 1,
        files: ["a.js"],
      })),
    });
    expect(["moderate", "high", "critical"]).toContain(risk.level);
  });
});

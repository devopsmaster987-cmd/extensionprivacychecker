import { describe, expect, it } from "vitest";
import { analyzePackage } from "@/lib/analyze";
import { compareReports } from "@/lib/analyze/compare";
import { buildZip, sampleManifestV3 } from "./helpers/build";

async function reportFor(manifest: Record<string, unknown>, background = "console.log('ok');") {
  const zip = await buildZip({
    "manifest.json": JSON.stringify(manifest),
    "background.js": background,
  });
  return analyzePackage(zip, "sample.zip");
}

describe("compareReports", () => {
  it("reports permission, host, domain and finding changes", async () => {
    const before = await reportFor(
      {
        ...sampleManifestV3,
        version: "1.0.0",
        permissions: ["storage"],
        optional_permissions: ["history"],
        host_permissions: ["https://example.org/*"],
      },
    );
    const after = await reportFor(
      {
        ...sampleManifestV3,
        version: "2.0.0",
        permissions: ["storage", "cookies"],
        optional_permissions: [],
        host_permissions: ["<all_urls>"],
      },
      'fetch("https://api.example.org/collect"); eval("1");',
    );

    const comparison = compareReports(before, after);

    expect(comparison.permissions.added.some((permission) => permission.key === "cookies")).toBe(true);
    expect(comparison.permissions.removed.some((permission) => permission.key === "history")).toBe(true);
    expect(comparison.hostPatterns.added).toContain("<all_urls>");
    expect(comparison.hostPatterns.removed).toContain("https://example.org/*");
    expect(comparison.domains.added.some((domain) => domain.domain === "api.example.org")).toBe(true);
    expect(comparison.findings.added.some((finding) => finding.rule === "eval")).toBe(true);
    expect(comparison.manifest.versionChanged).toBe(true);
    expect(comparison.riskDirection).toBe("worse");
  });

  it("reports no changes for the same package", async () => {
    const report = await reportFor(sampleManifestV3);
    const comparison = compareReports(report, report);

    expect(comparison.scoreDelta).toBe(0);
    expect(comparison.riskDirection).toBe("same");
    expect(comparison.permissions.added).toHaveLength(0);
    expect(comparison.permissions.removed).toHaveLength(0);
    expect(comparison.findings.added).toHaveLength(0);
    expect(comparison.findings.removed).toHaveLength(0);
    expect(comparison.domains.added).toHaveLength(0);
    expect(comparison.domains.removed).toHaveLength(0);
  });
});

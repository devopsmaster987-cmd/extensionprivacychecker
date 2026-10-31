import { describe, expect, it } from "vitest";
import { analyzePackage } from "@/lib/analyze";
import { AnalysisError } from "@/lib/errors";
import { LIMITS } from "@/lib/analyze/limits";
import {
  buildZip,
  sampleBackgroundJs,
  sampleManifestV3,
  wrapCrx3,
} from "./helpers/build";

describe("analyzePackage", () => {
  it("produces a complete report for a ZIP extension", async () => {
    const zip = await buildZip({
      "manifest.json": JSON.stringify(sampleManifestV3),
      "background.js": sampleBackgroundJs,
      "popup.html": '<html><script src="https://cdn.example.net/app.js"></script></html>',
    });

    const report = await analyzePackage(zip, "sample.zip");

    expect(report.schemaVersion).toBe(1);
    expect(report.source.kind).toBe("zip");
    expect(report.manifest.name).toBe("Sample Privacy Extension");
    expect(report.manifest.manifestVersion).toBe(3);
    expect(report.manifest.browsers).toContain("Chrome");
    expect(report.manifest.background?.type).toBe("service-worker");
    expect(report.permissions.some((permission) => permission.key === "cookies")).toBe(true);
    expect(report.hostAccess.broadness).toBe("specific");
    expect(report.findings.some((finding) => finding.rule === "eval")).toBe(true);
    expect(report.findings.some((finding) => finding.rule === "remote-script")).toBe(true);
    expect(report.domains.some((domain) => domain.domain === "api.example.org")).toBe(true);
    expect(report.score.categories).toHaveLength(6);
    expect(report.score.score).toBeGreaterThanOrEqual(0);
    expect(report.score.score).toBeLessThanOrEqual(100);
    expect(report.limits.length).toBeGreaterThan(0);
  });

  it("produces the same report for a CRX3 package", async () => {
    const zip = await buildZip({
      "manifest.json": JSON.stringify(sampleManifestV3),
      "background.js": sampleBackgroundJs,
    });
    const report = await analyzePackage(wrapCrx3(zip), "sample.crx");
    expect(report.source.kind).toBe("crx");
    expect(report.stats.entryCount).toBe(2);
    expect(report.warnings.some((warning) => /CRX version 3/i.test(warning))).toBe(true);
  });

  it("analyzes a standalone manifest JSON file", async () => {
    const bytes = new TextEncoder().encode(JSON.stringify(sampleManifestV3));
    const report = await analyzePackage(bytes, "manifest.json");
    expect(report.source.kind).toBe("json");
    expect(report.manifest.found).toBe(true);
    expect(report.warnings.some((warning) => /standalone manifest/i.test(warning))).toBe(true);
  });

  it("fails when manifest.json is missing", async () => {
    const zip = await buildZip({ "background.js": "console.log(1);" });
    await expect(analyzePackage(zip, "no-manifest.zip")).rejects.toMatchObject({
      code: "MANIFEST_MISSING",
    });
  });

  it("fails on invalid manifest JSON", async () => {
    const zip = await buildZip({ "manifest.json": "{ invalid" });
    await expect(analyzePackage(zip, "bad.zip")).rejects.toBeInstanceOf(AnalysisError);
    await expect(analyzePackage(zip, "bad.zip")).rejects.toMatchObject({ code: "MANIFEST_INVALID" });
  });

  it("rejects empty and unsupported files", async () => {
    await expect(analyzePackage(new Uint8Array(0), "empty.zip")).rejects.toMatchObject({
      code: "EMPTY_FILE",
    });
    await expect(
      analyzePackage(new TextEncoder().encode("hello world"), "notes.txt"),
    ).rejects.toMatchObject({ code: "UNSUPPORTED_TYPE" });
  });

  it("rejects uploads above the size limit", async () => {
    await expect(
      analyzePackage(new Uint8Array(LIMITS.maxUploadBytes + 1), "huge.zip"),
    ).rejects.toMatchObject({ code: "FILE_TOO_LARGE" });
  });

  it("does not execute code from the uploaded package", async () => {
    const zip = await buildZip({
      "manifest.json": JSON.stringify(sampleManifestV3),
      "background.js": "globalThis.__EPC_EXECUTED__ = true; eval('globalThis.__EPC_EVAL__ = true');",
    });
    await analyzePackage(zip, "exec.zip");
    expect((globalThis as Record<string, unknown>).__EPC_EXECUTED__).toBeUndefined();
    expect((globalThis as Record<string, unknown>).__EPC_EVAL__).toBeUndefined();
  });

  it("scans inline HTML scripts", async () => {
    const zip = await buildZip({
      "manifest.json": JSON.stringify(sampleManifestV3),
      "page.html": "<script>eval('1')</script>",
    });
    const report = await analyzePackage(zip, "inline.zip");
    expect(report.findings.some((finding) => finding.file.includes("#inline-"))).toBe(true);
  });

  it("is deterministic in structure across runs", async () => {
    const zip = await buildZip({
      "manifest.json": JSON.stringify(sampleManifestV3),
      "background.js": sampleBackgroundJs,
    });
    const first = await analyzePackage(zip, "a.zip");
    const second = await analyzePackage(zip, "a.zip");
    expect(first.permissions).toEqual(second.permissions);
    expect(first.score.score).toBe(second.score.score);
    expect(first.findings.map((finding) => finding.rule)).toEqual(
      second.findings.map((finding) => finding.rule),
    );
  });
});

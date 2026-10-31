import { describe, expect, it } from "vitest";
import { extractZipFromCrx, isCrx, isZip } from "@/lib/archive/crx";
import { extractArchive } from "@/lib/archive/zip";
import { LIMITS } from "@/lib/analyze/limits";
import { buildZip, sampleBackgroundJs, sampleManifestV3, wrapCrx2, wrapCrx3 } from "./helpers/build";

describe("CRX parsing", () => {
  it("detects and strips a CRX3 header", async () => {
    const zip = await buildZip({ "manifest.json": JSON.stringify(sampleManifestV3) });
    const crx = wrapCrx3(zip);
    expect(isCrx(crx)).toBe(true);
    expect(isZip(crx)).toBe(false);
    const extracted = extractZipFromCrx(crx);
    expect(extracted.version).toBe(3);
    expect(isZip(extracted.zip)).toBe(true);
    const archive = await extractArchive(extracted.zip);
    expect(archive.files.some((file) => file.path === "manifest.json")).toBe(true);
  });

  it("detects and strips a CRX2 header", async () => {
    const zip = await buildZip({ "manifest.json": JSON.stringify(sampleManifestV3) });
    const crx = wrapCrx2(zip);
    const extracted = extractZipFromCrx(crx);
    expect(extracted.version).toBe(2);
    const archive = await extractArchive(extracted.zip);
    expect(archive.entryCount).toBe(1);
  });

  it("rejects a truncated CRX header", () => {
    const crx = new Uint8Array([0x43, 0x72, 0x32, 0x34, 3, 0, 0, 0]);
    expect(() => extractZipFromCrx(crx)).toThrow(/truncated|header/i);
  });

  it("rejects a CRX without a ZIP payload", () => {
    const bytes = new Uint8Array(32);
    bytes.set([0x43, 0x72, 0x32, 0x34], 0);
    new DataView(bytes.buffer).setUint32(4, 3, true);
    new DataView(bytes.buffer).setUint32(8, 4, true);
    expect(() => extractZipFromCrx(bytes)).toThrow(/ZIP/i);
  });
});

describe("ZIP extraction", () => {
  it("extracts text files and skips binary entries", async () => {
    const zip = await buildZip({
      "manifest.json": JSON.stringify(sampleManifestV3),
      "background.js": sampleBackgroundJs,
      "icon.png": new Uint8Array([0x89, 0x50, 0x4e, 0x47]),
      "nested/archive.zip": new Uint8Array([0x50, 0x4b, 0x03, 0x04]),
    });
    const archive = await extractArchive(zip);
    expect(archive.entryCount).toBe(4);
    expect(archive.files.map((file) => file.path)).toContain("background.js");
    expect(archive.skipped).toContain("nested/archive.zip");
    expect(archive.files.some((file) => file.path.endsWith(".png"))).toBe(false);
    expect(archive.warnings.length).toBeGreaterThan(0);
  });

  it("never produces traversal paths", async () => {
    const zip = await buildZip({
      "manifest.json": JSON.stringify(sampleManifestV3),
      "../../evil.js": "alert(1)",
    });
    const archive = await extractArchive(zip);
    expect(archive.files.every((file) => !file.path.includes(".."))).toBe(true);
  });

  it("rejects data that is not a ZIP", async () => {
    await expect(extractArchive(new TextEncoder().encode("not a zip"))).rejects.toThrow(/ZIP/i);
  });

  it("rejects archives with too many entries", async () => {
    const entries: Record<string, string> = {};
    for (let index = 0; index <= LIMITS.maxEntries; index += 1) {
      entries[`file-${index}.txt`] = "";
    }
    const zip = await buildZip(entries);
    await expect(extractArchive(zip)).rejects.toMatchObject({ code: "ZIP_LIMIT" });
  });

  it("skips single files that exceed the uncompressed size limit", async () => {
    const zip = await buildZip({
      "manifest.json": JSON.stringify(sampleManifestV3),
      "large.js": "a".repeat(LIMITS.maxSingleFileBytes + 1),
    });
    const archive = await extractArchive(zip);
    expect(archive.skipped).toContain("large.js");
    expect(archive.files.some((file) => file.path === "large.js")).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { allPages } from "@/content/registry";
import { allSourceUrls, getSources } from "@/content/sources";

const OFFICIAL_HOSTS = [
  "developer.chrome.com",
  "developer.mozilla.org",
  "extensionworkshop.com",
  "learn.microsoft.com",
  "chromium.googlesource.com",
];

describe("primary sources", () => {
  it("gives every content cluster at least two official sources", () => {
    for (const page of allPages) {
      const sources = getSources(page.cluster);
      expect(sources.length, page.slug).toBeGreaterThanOrEqual(2);
      for (const source of sources) {
        expect(source.label.trim()).not.toBe("");
        expect(source.url.startsWith("https://")).toBe(true);
      }
    }
  });

  it("only cites approved browser-vendor and standards domains", () => {
    for (const rawUrl of allSourceUrls()) {
      const host = new URL(rawUrl).hostname;
      expect(OFFICIAL_HOSTS, rawUrl).toContain(host);
    }
  });

  it("falls back to official documentation for an unknown cluster", () => {
    expect(getSources("unknown-cluster").length).toBeGreaterThanOrEqual(2);
  });
});

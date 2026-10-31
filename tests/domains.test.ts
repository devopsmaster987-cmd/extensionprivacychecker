import { describe, expect, it } from "vitest";
import { classifyDomain, extractDomains } from "@/lib/analyze/domains";
import type { ManifestSummary } from "@/lib/analyze/types";

const manifest = {
  found: true,
  path: "manifest.json",
  hostPermissions: ["https://*.example.org/*", "<all_urls>"],
  optionalHostPermissions: [],
  contentScripts: [{ matches: ["https://shop.example.com/*"], js: [], css: [], runAt: null, allFrames: false }],
  externallyConnectable: null,
  webAccessibleResources: ["https://cdn.example.net/*.js"],
  contentSecurityPolicy: "script-src https://cdn.example.net",
  updateUrl: "https://clients2.google.com/service/update2/crx",
  raw: {},
} as unknown as ManifestSummary;

describe("domain extraction", () => {
  it("classifies known services", () => {
    expect(classifyDomain("www.google-analytics.com")).toBe("analytics");
    expect(classifyDomain("doubleclick.net")).toBe("advertising");
    expect(classifyDomain("accounts.google.com")).toBe("authentication");
    expect(classifyDomain("o123.ingest.sentry.io")).toBe("error-reporting");
    expect(classifyDomain("s3.amazonaws.com")).toBe("cloud");
    expect(classifyDomain("personal-blog.dev")).toBe("unknown");
  });

  it("extracts domains from code and manifest fields", () => {
    const domains = extractDomains(
      [
        {
          path: "background.js",
          text: "fetch('https://api.example.org/v1/ping'); fetch('https://www.google-analytics.com/collect');",
        },
      ],
      manifest,
    );
    const names = domains.map((domain) => domain.domain);
    expect(names).toContain("api.example.org");
    expect(names).toContain("www.google-analytics.com");
    expect(names).toContain("example.org");
    expect(names).toContain("shop.example.com");
    expect(names).toContain("cdn.example.net");
    expect(names).not.toContain("all_urls");
    const analytics = domains.find((domain) => domain.domain === "www.google-analytics.com");
    expect(analytics?.category).toBe("analytics");
    expect(analytics?.files).toContain("background.js");
  });

  it("extracts protocol-relative and WebSocket URLs", () => {
    const domains = extractDomains(
      [{ path: "a.js", text: "const a = '//cdn.example.org/a.js'; const b = 'wss://socket.example.com/ws';" }],
      manifest,
    );
    expect(domains.map((domain) => domain.domain)).toContain("cdn.example.org");
    expect(domains.map((domain) => domain.domain)).toContain("socket.example.com");
  });

  it("ignores local and placeholder hosts", () => {
    const domains = extractDomains(
      [{ path: "a.js", text: "fetch('http://localhost:3000'); fetch('https://example.com');" }],
      manifest,
    );
    expect(domains.map((domain) => domain.domain)).not.toContain("localhost");
    expect(domains.map((domain) => domain.domain)).not.toContain("example.com");
  });
});

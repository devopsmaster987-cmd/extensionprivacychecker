import { describe, expect, it } from "vitest";
import { findManifestFile, manifestFindings, summarizeManifest } from "@/lib/analyze/manifest";

describe("manifest analysis", () => {
  it("summarizes a Manifest V3 extension", () => {
    const raw = {
      manifest_version: 3,
      name: "Test",
      version: "2.0.0",
      permissions: ["tabs", "storage"],
      optional_permissions: ["history"],
      host_permissions: ["<all_urls>"],
      background: { service_worker: "sw.js" },
      content_scripts: [{ matches: ["https://example.com/*"], js: ["c.js"] }],
      action: { default_popup: "popup.html" },
      externally_connectable: { matches: ["https://example.com/*"] },
      web_accessible_resources: [{ resources: ["*.js"], matches: ["<all_urls>"] }],
      content_security_policy: { extension_pages: "script-src 'self'" },
    };
    const { manifest, warnings } = summarizeManifest(raw, "manifest.json");
    expect(manifest.manifestVersion).toBe(3);
    expect(manifest.permissions).toEqual(["tabs", "storage"]);
    expect(manifest.optionalPermissions).toEqual(["history"]);
    expect(manifest.background?.type).toBe("service-worker");
    expect(manifest.actionPopup).toBe("popup.html");
    expect(manifest.contentSecurityPolicy).toContain("script-src");
    expect(warnings).toHaveLength(0);
  });

  it("summarizes a Manifest V2 background page and warns about deprecation", () => {
    const raw = {
      manifest_version: 2,
      name: "Legacy",
      version: "1.0",
      permissions: ["tabs", "http://*/*"],
      background: { scripts: ["bg.js"], persistent: false },
      browser_action: { default_popup: "popup.html" },
    };
    const { manifest, warnings } = summarizeManifest(raw, "manifest.json");
    expect(manifest.manifestVersion).toBe(2);
    expect(manifest.background?.type).toBe("scripts");
    expect(manifest.background?.persistent).toBe(false);
    expect(manifest.browsers).toContain("Firefox");
    expect(warnings.some((warning) => /Manifest V2/i.test(warning))).toBe(true);
  });

  it("flags unsafe CSP, broad external connections and HTTP update URLs", () => {
    const { manifest } = summarizeManifest(
      {
        manifest_version: 3,
        name: "Risky",
        version: "1",
        content_security_policy: {
          extension_pages: "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        },
        externally_connectable: { matches: ["<all_urls>"] },
        update_url: "http://updates.example.org/crx",
        web_accessible_resources: ["*"],
      },
      "manifest.json",
    );
    const findings = manifestFindings(manifest);
    const evidence = findings.map((finding) => finding.evidence.toLowerCase()).join(" ");
    expect(evidence).toContain("unsafe-eval");
    expect(evidence).toContain("all_urls");
    expect(evidence).toContain("http://updates");
  });

  it("records schema issues without throwing", () => {
    const { manifest } = summarizeManifest({ name: 42, manifest_version: "3" }, "manifest.json");
    expect(manifest.errors.length).toBeGreaterThan(0);
    expect(manifest.manifestVersion).toBeNull();
  });

  it("finds the shallowest manifest", () => {
    const files = [
      { path: "nested/manifest.json" },
      { path: "manifest.json" },
      { path: "deeper/nested/manifest.json" },
    ];
    expect(findManifestFile(files)?.path).toBe("manifest.json");
  });
});

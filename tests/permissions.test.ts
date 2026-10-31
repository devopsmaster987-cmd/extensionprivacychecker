import { describe, expect, it } from "vitest";
import { analyzeHostAccess } from "@/lib/analyze/host";
import { analyzeHostPermission, analyzePermissions, permissionScore } from "@/lib/analyze/permissions";

describe("permission analysis", () => {
  it("explains known permissions and sorts by weight", () => {
    const permissions = analyzePermissions(["tabs", "storage", "debugger"]);
    expect(permissions[0].key).toBe("debugger");
    expect(permissions[0].level).toBe("critical");
    expect(permissions.every((permission) => permission.description.length > 20)).toBe(true);
  });

  it("marks optional permissions", () => {
    const permissions = analyzePermissions(["tabs"], ["history"]);
    const optional = permissions.find((permission) => permission.key === "history");
    const required = permissions.find((permission) => permission.key === "tabs");
    expect(optional?.optional).toBe(true);
    expect(required?.optional).toBe(false);
  });

  it("handles unknown permissions without failing", () => {
    const [permission] = analyzePermissions(["totallyNewApi"]);
    expect(permission.level).toBe("low");
    expect(permission.description).toMatch(/not in our current catalog/i);
  });

  it("classifies host permissions", () => {
    expect(analyzeHostPermission("<all_urls>").broad).toBe(true);
    expect(analyzeHostPermission("https://*.example.com/*").score).toBeGreaterThan(
      analyzeHostPermission("https://example.com/*").score,
    );
  });

  it("caps the aggregate permission score", () => {
    const permissions = analyzePermissions([
      "debugger",
      "nativeMessaging",
      "proxy",
      "management",
      "history",
      "cookies",
    ]);
    expect(permissionScore(permissions)).toBe(100);
  });
});

describe("host access", () => {
  it("flags all-sites access", () => {
    const result = analyzeHostAccess(["<all_urls>"]);
    expect(result.broadness).toBe("all-sites");
    expect(result.score).toBe(100);
  });

  it("returns zero for no host patterns", () => {
    expect(analyzeHostAccess([]).score).toBe(0);
  });

  it("scores specific hosts lower than broad wildcards", () => {
    const specific = analyzeHostAccess(["https://example.com/*"]);
    const wildcard = analyzeHostAccess(["*://*/*"]);
    expect(specific.score).toBeLessThan(wildcard.score);
  });
});

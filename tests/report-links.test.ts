import { describe, expect, it } from "vitest";
import { getPage } from "@/content/registry";
import {
  DOMAIN_HELP_PAGE,
  allReportHelpPages,
  categoryHelpPage,
  findingHelpPage,
  permissionHelpPage,
} from "@/lib/report-links";

describe("report help links", () => {
  it("points every report link at a published explanation page", () => {
    for (const slug of allReportHelpPages()) {
      expect(getPage(slug), slug).toBeDefined();
    }
    expect(getPage(DOMAIN_HELP_PAGE)).toBeDefined();
  });

  it("maps permissions by API name and host breadth", () => {
    expect(
      permissionHelpPage({ kind: "api", key: "cookies", broad: true }),
    ).toBe("extension-asking-for-cookies-permission");
    expect(
      permissionHelpPage({ kind: "api", key: "notARealPermission", broad: false }),
    ).toBe("chrome-permissions-checker");
    expect(
      permissionHelpPage({ kind: "host", key: "<all_urls>", broad: true }),
    ).toBe("chrome-extension-reading-all-sites-permission");
    expect(
      permissionHelpPage({ kind: "host", key: "https://example.com/*", broad: false }),
    ).toBe("chrome-extension-host-permissions-checker");
  });

  it("maps findings and score categories to their closest guides", () => {
    expect(findingHelpPage("eval")).toBe("extension-javascript-behavior-analyzer");
    expect(findingHelpPage("remote-script")).toBe("remote-script-reference-detector");
    expect(categoryHelpPage("permissionExposure")).toBe("browser-extension-privacy-checker");
    expect(categoryHelpPage("unknown")).toBe("browser-extension-privacy-checker");
  });
});

import { describe, expect, it } from "vitest";
import {
  allContentPaths,
  allPages,
  getClusterPages,
  getRelatedPages,
  guidePages,
  hubPages,
  keywordPages,
  validateRegistry,
} from "@/content/registry";

describe("content registry", () => {
  it("has no duplicate keywords, titles, descriptions or broken links", () => {
    expect(validateRegistry()).toEqual([]);
  });

  it("contains all 11 hubs and 31 keyword pages", () => {
    expect(hubPages).toHaveLength(11);
    expect(keywordPages).toHaveLength(31);
    expect(allPages).toHaveLength(42);
  });

  it("assigns every keyword page to exactly one hub", () => {
    const hubTotals = hubPages.reduce(
      (total, hub) => total + getClusterPages(hub.slug).length,
      0,
    );
    expect(hubTotals).toBe(keywordPages.length);
  });

  it("resolves every related page", () => {
    for (const page of allPages) {
      expect(getRelatedPages(page).length).toBeGreaterThanOrEqual(3);
    }
  });

  it("has a meaningful guides index", () => {
    expect(guidePages.length).toBeGreaterThanOrEqual(8);
  });

  it("lists unique paths", () => {
    const paths = allContentPaths();
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toContain("/topics");
    expect(paths).toContain("/learn");
  });
});

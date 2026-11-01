import { describe, expect, it } from "vitest";
import { languageAlternates, localizedUrl } from "@/lib/seo";
import { localeInfo, locales } from "@/lib/i18n/config";
import { allContentPaths, routeFor, allPages } from "@/content/registry";
import { SITE } from "@/lib/site";
import sitemap from "@/app/sitemap";

const translatedPaths = ["", "/analyzer"];

describe("localized URLs", () => {
  it("never emits a trailing slash for page URLs", () => {
    expect(localizedUrl("en")).toBe(`${SITE.url}/en`);
    expect(localizedUrl("en", "/")).toBe(`${SITE.url}/en`);
    expect(localizedUrl("en", "/analyzer/")).toBe(`${SITE.url}/en/analyzer`);
  });
});

describe("SEO alternates", () => {
  it("lists every reviewed locale reciprocally on translated pages", () => {
    for (const path of translatedPaths) {
      for (const locale of locales) {
        const alternates = languageAlternates(path);
        expect(Object.keys(alternates).sort()).toEqual(
          [...locales.map((entry) => localeInfo[entry].bcp47), "x-default"].sort(),
        );
        for (const target of locales) {
          expect(alternates[localeInfo[target].bcp47]).toBe(localizedUrl(target, path));
        }
        expect(alternates["x-default"]).toBe(localizedUrl("en", path));
      }
    }
  });

  it("offers only English and x-default for English-only pages", () => {
    expect(languageAlternates("/learn/example")).toEqual({
      en: localizedUrl("en", "/learn/example"),
      "x-default": localizedUrl("en", "/learn/example"),
    });
  });
});

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);

  it("has no duplicate URLs", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("contains every indexable page with absolute URLs", () => {
    expect(urls).toHaveLength(77);
    for (const url of urls) expect(url.startsWith(SITE.url)).toBe(true);

    for (const locale of locales) {
      for (const path of translatedPaths) {
        expect(urls).toContain(localizedUrl(locale, path));
      }
    }

    for (const path of [
      ...allContentPaths(),
      "/compare",
      "/methodology",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
      "/disclaimer",
    ]) {
      expect(urls).toContain(localizedUrl("en", path));
    }
  });

  it("publishes reciprocal alternates for translated entries", () => {
    const home = entries.find((entry) => entry.url === localizedUrl("en", ""));
    expect(home?.alternates?.languages).toBeDefined();
    const languages = home?.alternates?.languages as Record<string, string>;
    for (const locale of locales) {
      expect(languages[localeInfo[locale].bcp47]).toBe(localizedUrl(locale, ""));
    }
    expect(languages["x-default"]).toBe(localizedUrl("en", ""));
  });

  it("keeps content routes canonical to their English pages", () => {
    for (const page of allPages) {
      const url = localizedUrl("en", routeFor(page));
      const entry = entries.find((candidate) => candidate.url === url);
      expect(entry, url).toBeDefined();
      expect(entry?.alternates?.languages).toEqual({
        en: url,
        "x-default": url,
      });
    }
  });
});

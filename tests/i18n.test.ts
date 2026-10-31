import { describe, expect, it } from "vitest";
import { en } from "@/lib/i18n/messages/en";
import { es } from "@/lib/i18n/messages/es";
import { fr } from "@/lib/i18n/messages/fr";
import { de } from "@/lib/i18n/messages/de";
import { it as italian } from "@/lib/i18n/messages/it";
import { pt } from "@/lib/i18n/messages/pt";
import { nl } from "@/lib/i18n/messages/nl";
import { pl } from "@/lib/i18n/messages/pl";
import { tr } from "@/lib/i18n/messages/tr";
import { ar } from "@/lib/i18n/messages/ar";
import { ur } from "@/lib/i18n/messages/ur";
import { hi } from "@/lib/i18n/messages/hi";
import { localeInfo, localizedPath, locales, translatedPaths } from "@/lib/i18n/config";

const dictionaries: Record<string, Record<string, string>> = {
  es,
  fr,
  de,
  it: italian,
  pt,
  nl,
  pl,
  tr,
  ar,
  ur,
  hi,
};

const englishKeys = Object.keys(en).sort();

describe("message dictionaries", () => {
  it("uses the reviewed translation set for every supported locale", () => {
    expect(Object.keys(localeInfo).sort()).toEqual([...locales].sort());
    expect(Object.keys(dictionaries).sort()).toEqual(
      locales.filter((locale) => locale !== "en").sort(),
    );
  });

  for (const [locale, dictionary] of Object.entries(dictionaries)) {
    it(`${locale} has exactly the English keys with non-empty translations`, () => {
      expect(Object.keys(dictionary).sort()).toEqual(englishKeys);
      for (const key of englishKeys) {
        expect(dictionary[key]?.trim(), `${locale}:${key}`).not.toBe("");
      }
    });
  }

  it("keeps long-form content English-only and only translates UI routes", () => {
    expect([...translatedPaths]).toEqual(["", "/analyzer"]);
  });

  it("marks Arabic and Urdu as right-to-left", () => {
    expect(localeInfo.ar.dir).toBe("rtl");
    expect(localeInfo.ur.dir).toBe("rtl");
    expect(localeInfo.hi.dir).toBe("ltr");
  });

  it("builds locale paths without a trailing slash", () => {
    expect(localizedPath("en")).toBe("/en");
    expect(localizedPath("en", "/")).toBe("/en");
    expect(localizedPath("en", "/analyzer/")).toBe("/en/analyzer");
  });
});

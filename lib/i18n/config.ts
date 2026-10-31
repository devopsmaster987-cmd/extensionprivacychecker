export const locales = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "pt",
  "nl",
  "pl",
  "tr",
  "ar",
  "ur",
  "hi",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export interface LocaleInfo {
  code: Locale;
  name: string;
  englishName: string;
  dir: "ltr" | "rtl";
  bcp47: string;
  dateLocale: string;
  reviewedUi: boolean;
  translatedContent: boolean;
}

export const localeInfo: Record<Locale, LocaleInfo> = {
  en: {
    code: "en",
    name: "English",
    englishName: "English",
    dir: "ltr",
    bcp47: "en",
    dateLocale: "en-US",
    reviewedUi: true,
    translatedContent: true,
  },
  es: {
    code: "es",
    name: "Español",
    englishName: "Spanish",
    dir: "ltr",
    bcp47: "es",
    dateLocale: "es-ES",
    reviewedUi: true,
    translatedContent: false,
  },
  fr: {
    code: "fr",
    name: "Français",
    englishName: "French",
    dir: "ltr",
    bcp47: "fr",
    dateLocale: "fr-FR",
    reviewedUi: true,
    translatedContent: false,
  },
  de: {
    code: "de",
    name: "Deutsch",
    englishName: "German",
    dir: "ltr",
    bcp47: "de",
    dateLocale: "de-DE",
    reviewedUi: true,
    translatedContent: false,
  },
  it: {
    code: "it",
    name: "Italiano",
    englishName: "Italian",
    dir: "ltr",
    bcp47: "it",
    dateLocale: "it-IT",
    reviewedUi: true,
    translatedContent: false,
  },
  pt: {
    code: "pt",
    name: "Português",
    englishName: "Portuguese",
    dir: "ltr",
    bcp47: "pt",
    dateLocale: "pt-PT",
    reviewedUi: true,
    translatedContent: false,
  },
  nl: {
    code: "nl",
    name: "Nederlands",
    englishName: "Dutch",
    dir: "ltr",
    bcp47: "nl",
    dateLocale: "nl-NL",
    reviewedUi: true,
    translatedContent: false,
  },
  pl: {
    code: "pl",
    name: "Polski",
    englishName: "Polish",
    dir: "ltr",
    bcp47: "pl",
    dateLocale: "pl-PL",
    reviewedUi: true,
    translatedContent: false,
  },
  tr: {
    code: "tr",
    name: "Türkçe",
    englishName: "Turkish",
    dir: "ltr",
    bcp47: "tr",
    dateLocale: "tr-TR",
    reviewedUi: true,
    translatedContent: false,
  },
  ar: {
    code: "ar",
    name: "العربية",
    englishName: "Arabic",
    dir: "rtl",
    bcp47: "ar",
    dateLocale: "ar-EG",
    reviewedUi: true,
    translatedContent: false,
  },
  ur: {
    code: "ur",
    name: "اردو",
    englishName: "Urdu",
    dir: "rtl",
    bcp47: "ur",
    dateLocale: "ur-PK",
    reviewedUi: true,
    translatedContent: false,
  },
  hi: {
    code: "hi",
    name: "हिन्दी",
    englishName: "Hindi",
    dir: "ltr",
    bcp47: "hi",
    dateLocale: "hi-IN",
    reviewedUi: true,
    translatedContent: false,
  },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function localeDirection(locale: Locale): "ltr" | "rtl" {
  return localeInfo[locale].dir;
}

export function detectLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale;
  const entries = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, quality] = part.trim().split(";q=");
      return { tag: (tag ?? "").trim().toLowerCase(), quality: Number(quality ?? 1) };
    })
    .filter((entry) => entry.tag)
    .sort((a, b) => b.quality - a.quality);

  for (const entry of entries) {
    const base = entry.tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

export const translatedPaths = new Set(["", "/analyzer"]);

export function isPathTranslated(pathname: string): boolean {
  return translatedPaths.has(pathname.replace(/\/$/, ""));
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(localeInfo[locale].dateLocale, options).format(value);
}

export function formatDate(value: string | Date, locale: Locale): string {
  const date = typeof value === "string" ? new Date(`${value}T00:00:00Z`) : value;
  return new Intl.DateTimeFormat(localeInfo[locale].dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateTime(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeInfo[locale].dateLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function localizedPath(locale: Locale, path = ""): string {
  const normalized = path.replace(/^\/+|\/+$/g, "");
  return normalized ? `/${locale}/${normalized}` : `/${locale}`;
}

export function stripLocale(pathname: string): { locale: Locale | null; rest: string } {
  const segments = pathname.split("/");
  const candidate = segments[1];
  if (isLocale(candidate)) {
    const rest = `/${segments.slice(2).join("/")}`;
    return { locale: candidate, rest: rest === "/" ? "" : rest.replace(/\/$/, "") };
  }
  return { locale: null, rest: pathname.replace(/\/$/, "") };
}

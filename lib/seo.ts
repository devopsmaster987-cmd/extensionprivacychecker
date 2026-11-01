import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./site";
import { isPathTranslated, localeInfo, locales, type Locale } from "./i18n/config";
import type { ContentPage } from "@/content/types";
import { routeFor } from "@/content/registry";
import { getSources } from "@/content/sources";

export function localizedUrl(locale: Locale, path = ""): string {
  const normalized = path.replace(/^\/+|\/+$/g, "");
  return normalized ? `${SITE.url}/${locale}/${normalized}` : `${SITE.url}/${locale}`;
}

export function languageAlternates(path: string): Record<string, string> {
  const normalized = path.replace(/\/$/, "");
  const translated = isPathTranslated(normalized);
  if (!translated) {
    return {
      en: localizedUrl("en", normalized),
      "x-default": localizedUrl("en", normalized),
    };
  }
  const alternates: Record<string, string> = {};
  for (const locale of locales) {
    alternates[localeInfo[locale].bcp47] = localizedUrl(locale, normalized);
  }
  alternates["x-default"] = localizedUrl("en", normalized);
  return alternates;
}

export function buildMetadata(input: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  translated?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const path = input.path === "/" ? "" : input.path;
  const translated = input.translated ?? isPathTranslated(path);
  const canonical = translated ? localizedUrl(input.locale, path) : localizedUrl("en", path);
  const indexable = translated || input.locale === "en";

  const languages = languageAlternates(path);
  const openGraphLocale = localeInfo[input.locale].bcp47.replace("-", "_");

  return {
    title: { absolute: input.title },
    description: input.description,
    authors:
      input.type === "article"
        ? [{ name: SITE.author.name, url: SITE.author.url }]
        : undefined,
    creator: input.type === "article" ? SITE.author.name : undefined,
    alternates: {
      canonical,
      languages,
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      type: input.type ?? "website",
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: SITE.name,
      locale: openGraphLocale,
      images: [
        {
          url: `${SITE.url}/og`,
          width: 1200,
          height: 630,
          alt: SITE.ogImageAlt,
        },
      ],
      alternateLocale: translated
        ? locales.filter((locale) => locale !== input.locale).map((locale) => localeInfo[locale].bcp47.replace("-", "_"))
        : undefined,
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [{ url: `${SITE.url}/og`, alt: SITE.ogImageAlt }],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description:
      "An independent, free static-analysis tool for inspecting browser extension permissions, code indicators and external domains.",
    email: SITE.email,
    logo: `${SITE.url}/icon.svg`,
    founder: personNode(),
    sameAs: [SITE.repository, ...SITE.author.sameAs],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.email,
      url: `${SITE.url}/en/contact`,
      availableLanguage: ["English"],
    },
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: localizedUrl(locale),
    inLanguage: localeInfo[locale].bcp47,
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };
}

function personNode() {
  return {
    "@type": "Person",
    name: SITE.author.name,
    url: SITE.author.url,
    email: SITE.author.email,
    sameAs: SITE.author.sameAs,
    knowsAbout: [
      "Browser extension security",
      "Extension permissions",
      "Manifest V2 and V3",
      "Static code analysis",
      "Privacy engineering",
    ],
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    ...personNode(),
  };
}

export function aboutPageJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${SITE.name}`,
    url: localizedUrl(locale, "/about"),
    inLanguage: localeInfo[locale].bcp47,
    mainEntity: personNode(),
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
  };
}

export function webApplicationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    url: localizedUrl(locale, "/analyzer"),
    applicationCategory: "SecurityApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and a modern browser with Web Worker support.",
    description:
      "Free static-analysis tool that inspects CRX, XPI, ZIP and manifest.json browser extension packages for permissions, code indicators, external domains and privacy risk.",
    inLanguage: localeInfo[locale].bcp47,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Manifest V2 and V3 analysis",
      "Permission and host access explanations",
      "Static JavaScript indicators",
      "External domain extraction",
      "Transparent risk scoring",
      "JSON and PDF reports",
    ],
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };
}

export interface BreadcrumbInput {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbInput[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: localizedUrl(locale, item.path),
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function articleJsonLd(page: ContentPage, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    inLanguage: "en",
    datePublished: page.lastReviewed,
    dateModified: page.lastReviewed,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": localizedUrl("en", routeFor(page)),
    },
    author: personNode(),
    reviewedBy: personNode(),
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: localizedUrl(locale),
    },
    citation: getSources(page.cluster).map((source) => source.url),
  };
}

export function howToJsonLd(page: ContentPage) {
  const steps = page.sections.flatMap((section) => section.steps ?? []);
  if (steps.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.h1,
    description: page.description,
    inLanguage: "en",
    totalTime: "PT5M",
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.body,
      url: `${localizedUrl("en", routeFor(page))}#step-${index + 1}`,
    })),
  };
}

export function itemListJsonLd(
  items: { name: string; path: string }[],
  locale: Locale,
  name: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    inLanguage: localeInfo[locale].bcp47,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: localizedUrl(locale, item.path),
    })),
  };
}

export function absoluteCanonical(locale: Locale, path: string): string {
  return localizedUrl(locale, path);
}

export { absoluteUrl };

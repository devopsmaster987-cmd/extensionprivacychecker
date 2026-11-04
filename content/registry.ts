import { hubs } from "./hubs";
import { tier1 } from "./keywords/tier1";
import { tier2 } from "./keywords/tier2";
import { tier3 } from "./keywords/tier3";
import { tier4 } from "./keywords/tier4";
import { tier5 } from "./keywords/tier5";
import type { ContentPage } from "./types";

export const allPages: ContentPage[] = [...hubs, ...tier1, ...tier2, ...tier3, ...tier4, ...tier5];

export const keywordPages = allPages.filter((page) => page.kind === "keyword");
export const hubPages = allPages.filter((page) => page.kind === "hub");

export const pageBySlug = new Map<string, ContentPage>(allPages.map((page) => [page.slug, page]));
export const hubBySlug = new Map<string, ContentPage>(hubs.map((page) => [page.slug, page]));

export const guidePages = keywordPages.filter((page) =>
  ["guide", "comparison", "reference"].includes(page.intent),
);

export function getPage(slug: string): ContentPage | undefined {
  return pageBySlug.get(slug);
}

export function getHubFor(page: ContentPage): ContentPage | undefined {
  if (!page.hub) return undefined;
  return hubBySlug.get(page.hub);
}

export function getClusterPages(hubSlug: string): ContentPage[] {
  return keywordPages.filter((page) => page.hub === hubSlug);
}

export function getRelatedPages(page: ContentPage): ContentPage[] {
  return page.related
    .map((slug) => pageBySlug.get(slug))
    .filter((related): related is ContentPage => Boolean(related));
}

export function getSiblingPages(page: ContentPage, limit = 4): ContentPage[] {
  if (!page.hub) return [];
  return getClusterPages(page.hub)
    .filter((sibling) => sibling.slug !== page.slug)
    .slice(0, limit);
}

export const contentRoutes = {
  hub: (slug: string) => `/topics/${slug}`,
  keyword: (slug: string) => `/learn/${slug}`,
} as const;

export function routeFor(page: ContentPage): string {
  return page.kind === "hub" ? contentRoutes.hub(page.slug) : contentRoutes.keyword(page.slug);
}

export function allContentPaths(): string[] {
  return [
    "/topics",
    "/learn",
    "/guides",
    ...hubs.map((page) => contentRoutes.hub(page.slug)),
    ...keywordPages.map((page) => contentRoutes.keyword(page.slug)),
  ];
}

export function validateRegistry(): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();
  const keywords = new Map<string, string>();
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();

  for (const page of allPages) {
    if (slugs.has(page.slug)) errors.push(`Duplicate slug: ${page.slug}`);
    slugs.add(page.slug);

    const keyword = page.primaryKeyword.toLowerCase().trim();
    const existingKeyword = keywords.get(keyword);
    if (existingKeyword) {
      errors.push(`Duplicate primary keyword "${page.primaryKeyword}" on ${existingKeyword} and ${page.slug}`);
    }
    keywords.set(keyword, page.slug);

    if (titles.has(page.title)) errors.push(`Duplicate title on ${titles.get(page.title)} and ${page.slug}`);
    titles.set(page.title, page.slug);

    if (descriptions.has(page.description)) {
      errors.push(`Duplicate meta description on ${descriptions.get(page.description)} and ${page.slug}`);
    }
    descriptions.set(page.description, page.slug);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(page.lastReviewed)) {
      errors.push(`Invalid lastReviewed date on ${page.slug}`);
    }
    if (page.faqs.length < 3 || page.faqs.length > 5) {
      errors.push(`FAQ count must be 3-5 on ${page.slug}`);
    }
    if (page.related.length < 3 || page.related.length > 5) {
      errors.push(`Related count must be 3-5 on ${page.slug}`);
    }
    for (const related of page.related) {
      if (related === page.slug) errors.push(`Self-related page on ${page.slug}`);
      if (!pageBySlug.has(related)) errors.push(`Missing related page "${related}" on ${page.slug}`);
    }
    if (page.related.length !== new Set(page.related).size) {
      errors.push(`Duplicate related page on ${page.slug}`);
    }

    if (page.kind === "keyword") {
      if (!page.hub) {
        errors.push(`Keyword page without hub: ${page.slug}`);
        continue;
      }
      const hub = hubBySlug.get(page.hub);
      if (!hub) {
        errors.push(`Unknown hub "${page.hub}" on ${page.slug}`);
        continue;
      }
      if (hub.cluster !== page.cluster) {
        errors.push(`Cluster mismatch between ${page.slug} and hub ${hub.slug}`);
      }
      if (hub.primaryKeyword.toLowerCase() === keyword) {
        errors.push(`Keyword duplicates its hub primary keyword: ${page.slug}`);
      }
    } else {
      if (page.hub !== null) errors.push(`Hub page must not have a parent hub: ${page.slug}`);
      if (getClusterPages(page.slug).length === 0) {
        errors.push(`Hub page has no keyword pages: ${page.slug}`);
      }
    }
  }

  for (const hub of hubPages) {
    for (const keyword of getClusterPages(hub.slug)) {
      if (keyword.hub !== hub.slug) errors.push(`Cluster link mismatch for ${keyword.slug}`);
    }
  }

  const answerWords = (page: ContentPage) => page.answer.trim().split(/\s+/).length;
  for (const page of allPages) {
    const words = answerWords(page);
    if (words < 35 || words > 90) {
      errors.push(`Answer-first block on ${page.slug} has ${words} words (expected 35-90)`);
    }
  }

  return errors;
}

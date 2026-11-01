import type { MetadataRoute } from "next";
import { localeInfo, locales } from "@/lib/i18n/config";
import { localizedUrl } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { allContentPaths, pageBySlug } from "@/content/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${SITE.lastReviewed}T00:00:00Z`);
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of ["", "/analyzer"]) {
      entries.push({
        url: localizedUrl(locale, path),
        lastModified,
        changeFrequency: "monthly",
        priority: path === "" ? 1 : 0.9,
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((entry) => [localeInfo[entry].bcp47, localizedUrl(entry, path)]),
            ),
            "x-default": localizedUrl("en", path),
          },
        },
      });
    }
  }

  const englishOnlyPages: { path: string; priority: number; lastModified: Date }[] = [
    { path: "/compare", priority: 0.8, lastModified },
    { path: "/link-to-us", priority: 0.5, lastModified },
    { path: "/topics", priority: 0.8, lastModified },
    { path: "/learn", priority: 0.8, lastModified },
    { path: "/guides", priority: 0.7, lastModified },
    { path: "/methodology", priority: 0.6, lastModified },
    { path: "/about", priority: 0.4, lastModified },
    { path: "/contact", priority: 0.3, lastModified },
    { path: "/privacy", priority: 0.3, lastModified },
    { path: "/terms", priority: 0.3, lastModified },
    { path: "/disclaimer", priority: 0.3, lastModified },
  ];

  for (const path of allContentPaths()) {
    if (["/topics", "/learn", "/guides"].includes(path)) continue;
    const page = pageBySlug.get(path.split("/").pop() ?? "");
    englishOnlyPages.push({
      path,
      priority: page?.kind === "hub" ? 0.7 : 0.6,
      lastModified: page ? new Date(`${page.lastReviewed}T00:00:00Z`) : lastModified,
    });
  }

  for (const entry of englishOnlyPages) {
    entries.push({
      url: localizedUrl("en", entry.path),
      lastModified: entry.lastModified,
      changeFrequency: "monthly",
      priority: entry.priority,
      alternates: {
        languages: {
          en: localizedUrl("en", entry.path),
          "x-default": localizedUrl("en", entry.path),
        },
      },
    });
  }

  return entries;
}

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const siteUrl = (configuredSiteUrl ?? "https://extensionprivacychecker.top").replace(/\/$/, "");

if (process.env.NODE_ENV === "production" && siteUrl.includes(".example")) {
  console.warn(
    "[seo] NEXT_PUBLIC_SITE_URL still points to a placeholder domain. Canonical URLs, hreflang, schema and the sitemap will be wrong.",
  );
}

export const SITE = {
  name: "Extension Privacy Checker",
  shortName: "Extension Privacy Checker",
  url: siteUrl,
  email: "ihsannaslam@gmail.com",
  repository: "https://github.com/devopsmaster987-cmd/extensionprivacychecker",
  author: {
    name: "Ihsan Naslam",
    email: "ihsannaslam@gmail.com",
    url: `${siteUrl}/en/about#author`,
    sameAs: ["https://github.com/devopsmaster987-cmd"],
  },
  lastReviewed: "2026-10-31",
  ogImageAlt: "Extension Privacy Checker - inspect browser extensions without running their code",
} as const;

export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) return `${SITE.url}/${path}`;
  return `${SITE.url}${path}`;
}

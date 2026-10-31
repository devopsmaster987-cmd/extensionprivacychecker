import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];

export default function robots(): MetadataRoute.Robots {
  const allowAiCrawlers = process.env.ALLOW_AI_CRAWLERS !== "false";

  const rules: MetadataRoute.Robots["rules"] = [
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
  ];

  const allowedCrawlers = new Set<string>();

  if (allowAiCrawlers) {
    for (const userAgent of AI_CRAWLERS) {
      allowedCrawlers.add(userAgent);
    }
  }

  for (const userAgent of (process.env.ALLOWED_CRAWLERS ?? "").split(",")) {
    const trimmed = userAgent.trim();
    if (trimmed) {
      allowedCrawlers.add(trimmed);
    }
  }

  for (const userAgent of allowedCrawlers) {
    rules.push({ userAgent, allow: "/", disallow: ["/api/"] });
  }

  if (!allowAiCrawlers) {
    for (const userAgent of AI_CRAWLERS) {
      if (!allowedCrawlers.has(userAgent)) {
        rules.push({ userAgent, disallow: "/" });
      }
    }
  }

  return {
    rules,
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}

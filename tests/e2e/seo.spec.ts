import { expect, test } from "@playwright/test";

const origin = "https://extensionprivacychecker.example";

test("home and analyzer advertise translated alternates", async ({ page }) => {
  await page.goto("/en/analyzer");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${origin}/en/analyzer`,
  );
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
    "href",
    `${origin}/es/analyzer`,
  );
  await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveAttribute(
    "href",
    `${origin}/ar/analyzer`,
  );
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
    "href",
    `${origin}/en/analyzer`,
  );
});

test("English-only pages canonicalize to English and mark translations noindex", async ({ page }) => {
  await page.goto("/es/privacy");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${origin}/en/privacy`,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(0);
});

test("English article pages are indexable and carry article metadata", async ({ page }) => {
  await page.goto("/en/learn/how-to-check-chrome-extension-permissions-before-installing");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${origin}/en/learn/how-to-check-chrome-extension-permissions-before-installing`,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index/);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");

  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const article = blocks
    .map((block) => JSON.parse(block) as Record<string, unknown>)
    .find((block) => block["@type"] === "Article");
  expect(Array.isArray(article?.citation)).toBe(true);
  expect((article?.citation as string[]).length).toBeGreaterThanOrEqual(2);
});

test("crawlers are sent to the default locale, not the browser language", async ({ request }) => {
  const response = await request.get("/learn/what-doorbell-cameras-see", {
    headers: {
      "accept-language": "de-DE,de;q=0.9",
      "user-agent":
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(307);
  expect(response.headers()["location"]).toContain("/en/learn/what-doorbell-cameras-see");
});

test("robots.txt, sitemap.xml and llms.txt are reachable", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  const robotsBody = await robots.text();
  expect(robotsBody).toContain("Sitemap:");
  expect(robotsBody).toContain("GPTBot");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const sitemapBody = await sitemap.text();
  expect(sitemapBody).toContain(`${origin}/en/analyzer`);
  expect(sitemapBody).toContain(`${origin}/en/learn/`);

  const llms = await request.get("/llms.txt");
  expect(llms.ok()).toBeTruthy();
  const llmsBody = await llms.text();
  expect(llmsBody).toContain("Extension Privacy Checker");
  expect(llmsBody).toContain("Scoring summary");
});

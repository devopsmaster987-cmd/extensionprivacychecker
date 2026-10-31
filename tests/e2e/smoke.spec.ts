import { expect, test } from "@playwright/test";

test("root redirects to the detected locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Know what a browser extension can see");
});

test("home exposes the analyzer and primary navigation", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator('input[type="file"]')).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Analyzer" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Topics", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Guides", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start a free scan", exact: true })).toBeVisible();
});

test("language selector switches to Spanish and preserves the path", async ({ page }) => {
  await page.goto("/en/analyzer");
  await page.getByRole("combobox", { name: "Language" }).selectOption("es");
  await expect(page).toHaveURL(/\/es\/analyzer$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Analizador de extensiones");
});

test("every supported language renders its translated interface", async ({ page }) => {
  const supported = [
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

  for (const locale of supported) {
    await page.goto(`/${locale}`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("combobox", { name: /language|idioma|langue|sprache|lingua|taal|język|dil|اللغة|زبان|भाषा/i })).toBeVisible();
  }
});

test("Arabic renders right-to-left", async ({ page }) => {
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
});

test("content hubs and guides render", async ({ page }) => {
  await page.goto("/en/topics");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Topics");

  await page.goto("/en/guides");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Guides");

  await page.goto("/en/methodology");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Methodology");

  await page.goto("/en/learn/what-does-all-urls-permission-mean");
  await expect(page.getByRole("heading", { name: "Primary sources" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Chrome extensions: permissions list" }),
  ).toHaveAttribute("href", /^https:\/\/developer\.chrome\.com\//);
});

test("unknown routes show the global 404 page", async ({ page }) => {
  const response = await page.goto("/en/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Page not found");
});

test("privacy page explains local processing", async ({ page }) => {
  await page.goto("/en/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Privacy policy");
  await expect(page.getByText("Extension files you select are read locally")).toBeVisible();
});

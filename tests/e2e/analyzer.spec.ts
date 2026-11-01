import { expect, test } from "@playwright/test";

test.describe("analyzer", () => {
  test("analyzes a ZIP package and renders the report", async ({ page }) => {
    await page.goto("/en/analyzer");
    await page.locator('input[type="file"]').setInputFiles("tests/fixtures/privacy-sample.zip");

    await expect(
      page.getByRole("heading", { name: "Privacy Sample Extension", level: 2 }),
    ).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole("heading", { name: "Code findings" })).toBeVisible();
    await expect(page.getByText("api.example.org").first()).toBeVisible();
    await expect(page.getByText("eval() dynamic code execution")).toBeVisible();
    await expect(page.getByRole("heading", { name: "External domains" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Risk score breakdown" }).first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Learn more" }).first(),
    ).toHaveAttribute("href", /^\/en\/learn\//);
  });

  test("exports the report as JSON", async ({ page }) => {
    await page.goto("/en/analyzer");
    await page.locator('input[type="file"]').setInputFiles("tests/fixtures/privacy-sample.crx");
    await expect(
      page.getByRole("heading", { name: "Privacy Sample Extension", level: 2 }),
    ).toBeVisible({ timeout: 20_000 });

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export JSON" }).first().click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/privacy-report-en\.json$/);
  });

  test("exports the report as PDF", async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto("/en/analyzer");
    await page.locator('input[type="file"]').setInputFiles("tests/fixtures/privacy-sample.zip");
    await expect(
      page.getByRole("heading", { name: "Privacy Sample Extension", level: 2 }),
    ).toBeVisible({ timeout: 20_000 });

    const downloadPromise = page.waitForEvent("download", { timeout: 60_000 });
    await page.getByRole("button", { name: "Download PDF" }).first().click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/privacy-report-en\.pdf$/);
  });

  test("rejects unsupported files", async ({ page }) => {
    await page.goto("/en/analyzer");
    await page.locator('input[type="file"]').setInputFiles({
      name: "notes.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("not an extension"),
    });
    await expect(page.locator("main").getByRole("alert")).toContainText(
      "Choose a CRX, XPI, ZIP or manifest.json file.",
    );
  });

  test("rejects a non-HTTPS store URL without a request", async ({ page }) => {
    await page.goto("/en/analyzer");
    await page.locator("#store-url").fill("http://chromewebstore.google.com/detail/example");
    await page.getByRole("button", { name: "Fetch and analyze" }).click();
    await expect(page.locator("main").getByRole("alert")).toContainText(
      "Enter a valid Chrome Web Store, Edge Add-ons or Firefox Add-ons URL.",
    );
  });

  test("starts a new scan from the report", async ({ page }) => {
    await page.goto("/en/analyzer");
    await page.locator('input[type="file"]').setInputFiles("tests/fixtures/privacy-sample.zip");
    await expect(
      page.getByRole("heading", { name: "Privacy Sample Extension", level: 2 }),
    ).toBeVisible({ timeout: 20_000 });

    await page.getByRole("button", { name: "Start a new scan" }).first().click();
    await expect(page.locator('input[type="file"]')).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Privacy Sample Extension", level: 2 })).toHaveCount(0);
  });
});

test.describe("version comparison", () => {
  test("compares two packages and shows the diff", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto("/en/compare");
    const inputs = page.locator('input[type="file"]');
    await inputs.nth(0).setInputFiles("tests/fixtures/privacy-sample.zip");
    await inputs.nth(1).setInputFiles("tests/fixtures/privacy-sample.crx");
    await expect(page.getByText(/Ready:/)).toHaveCount(2, { timeout: 30_000 });
    await page.getByRole("button", { name: "Compare packages" }).click();
    await expect(page.getByRole("heading", { name: "Permissions and website access" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Domains and code findings" })).toBeVisible();
    await expect(page.getByText("Score change:")).toBeVisible();
  });
});

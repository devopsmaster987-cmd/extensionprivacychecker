import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

function request(path: string, headers: Record<string, string>) {
  return new NextRequest(`https://extensionprivacychecker.example${path}`, {
    headers,
  });
}

describe("locale proxy", () => {
  it("never redirects crawlers based on Accept-Language", () => {
    const response = proxy(
      request("/learn/what-doorbell-cameras-see", {
        "accept-language": "de-DE,de;q=0.9",
        "user-agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        cookie: "epc_locale=fr",
      }),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://extensionprivacychecker.example/en/learn/what-doorbell-cameras-see",
    );
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("still detects the browser language for human visitors", () => {
    const response = proxy(
      request("/learn", {
        "accept-language": "es-MX,es;q=0.9,en;q=0.5",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      }),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://extensionprivacychecker.example/es/learn");
    expect(response.headers.get("set-cookie")).toContain("epc_locale=es");
  });

  it("marks non-English English-only content as noindex", () => {
    const content = proxy(request("/es/learn", { "user-agent": "Googlebot/2.1" }));
    expect(content.headers.get("x-robots-tag")).toBe("noindex, follow");

    const translated = proxy(request("/es/analyzer", { "user-agent": "Googlebot/2.1" }));
    expect(translated.headers.get("x-robots-tag")).toBeNull();

    const english = proxy(request("/en/learn", { "user-agent": "Googlebot/2.1" }));
    expect(english.headers.get("x-robots-tag")).toBeNull();
  });

  it("leaves prefixed routes and static files alone", () => {
    const prefixed = proxy(request("/ar/analyzer", { "user-agent": "Googlebot/2.1" }));
    expect(prefixed.headers.get("location")).toBeNull();

    const asset = proxy(request("/sitemap.xml", { "user-agent": "Googlebot/2.1" }));
    expect(asset.headers.get("location")).toBeNull();
  });
});

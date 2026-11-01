import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, detectLocale, isLocale, isPathTranslated } from "@/lib/i18n/config";

const PASSTHROUGH = [
  "/api",
  "/_next",
  "/_vercel",
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/icon.svg",
  "/favicon.ico",
  "/apple-icon",
  "/opengraph-image",
  "/twitter-image",
  "/og",
  "/manifest.webmanifest",
];

const PUBLIC_FILE = /\.[^/]+$/;

const CRAWLER_USER_AGENT =
  /(googlebot|google-inspectiontool|bingbot|bingpreview|yandex(?:bot|images)|duckduckbot|baiduspider|applebot|petalbot|ahrefsbot|semrushbot|mj12bot|dotbot|gptbot|oai-searchbot|chatgpt-user|claudebot|anthropic-ai|perplexitybot|google-extended)/i;

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (PASSTHROUGH.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/")[1];
  if (isLocale(firstSegment)) {
    const response = NextResponse.next();
    const pathWithoutLocale = pathname.slice(firstSegment.length + 1) || "/";
    if (firstSegment !== defaultLocale && !isPathTranslated(pathWithoutLocale)) {
      response.headers.set("X-Robots-Tag", "noindex, follow");
    }
    return response;
  }

  const cookieLocale = request.cookies.get("epc_locale")?.value;
  const isCrawler = CRAWLER_USER_AGENT.test(request.headers.get("user-agent") ?? "");
  const locale = isCrawler
    ? defaultLocale
    : isLocale(cookieLocale)
      ? cookieLocale
      : detectLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  url.search = search;

  const response = NextResponse.redirect(url, 307);
  if (!isLocale(cookieLocale) && !isCrawler) {
    response.cookies.set("epc_locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: false,
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

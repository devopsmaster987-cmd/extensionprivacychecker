import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, localeInfo, locales } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f766e",
  colorScheme: "light",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : "en";
  const messages = getMessages(safeLocale);

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: messages["meta.siteName"],
      template: `%s | ${SITE.name}`,
    },
    description: messages["meta.tagline"],
    applicationName: SITE.name,
    category: "technology",
    formatDetection: { telephone: false, email: false, address: false },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : undefined,
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: localeInfo[safeLocale].bcp47.replace("-", "_"),
      title: messages["meta.siteName"],
      description: messages["meta.tagline"],
      url: `${SITE.url}/${safeLocale}`,
      images: [
        {
          url: `${SITE.url}/og`,
          width: 1200,
          height: 630,
          alt: SITE.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: messages["meta.siteName"],
      description: messages["meta.tagline"],
      images: [{ url: `${SITE.url}/og`, alt: SITE.ogImageAlt }],
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const info = localeInfo[locale];
  const messages = getMessages(locale);

  return (
    <html lang={info.bcp47} dir={info.dir}>
      <body className="min-h-dvh bg-slate-50 text-slate-900 antialiased">
        <a href="#main-content" className="skip-link">
          {messages["common.skipToContent"]}
        </a>
        <div className="flex min-h-dvh flex-col">
          <SiteHeader locale={locale} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter locale={locale} />
        </div>
      </body>
    </html>
  );
}

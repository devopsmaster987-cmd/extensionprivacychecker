import Link from "next/link";
import type { Metadata } from "next";
import { Compass, SearchX } from "lucide-react";
import "./globals.css";
import { SITE } from "@/lib/site";
import { defaultLocale, localizedPath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { buttonVariants } from "@/components/ui/button";

const messages = getMessages(defaultLocale);

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    absolute: `${messages["legal.notFoundTitle"]} | ${SITE.name}`,
  },
  description: messages["legal.notFoundBody"],
  alternates: {
    canonical: `${SITE.url}/en`,
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${messages["legal.notFoundTitle"]} | ${SITE.name}`,
    description: messages["legal.notFoundBody"],
    url: `${SITE.url}/en`,
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
    title: `${messages["legal.notFoundTitle"]} | ${SITE.name}`,
    description: messages["legal.notFoundBody"],
    images: [{ url: `${SITE.url}/og`, alt: SITE.ogImageAlt }],
  },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-dvh bg-slate-50 text-slate-900 antialiased">
        <main className="container-page flex min-h-dvh flex-col items-center justify-center py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <SearchX aria-hidden="true" className="h-8 w-8" />
          </span>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
            404
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {messages["legal.notFoundTitle"]}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
            {messages["legal.notFoundBody"]}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href={localizedPath(defaultLocale)} className={buttonVariants({ variant: "default" })}>
              <Compass aria-hidden="true" className="h-4 w-4" />
              {messages["nav.home"]}
            </Link>
            <Link
              href={localizedPath(defaultLocale, "/analyzer")}
              className={buttonVariants({ variant: "outline" })}
            >
              {messages["nav.analyzer"]}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}

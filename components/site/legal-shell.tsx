import type { ReactNode } from "react";
import { CalendarDays, FileText } from "lucide-react";
import { formatDate, localizedPath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "./breadcrumbs";
import { EnglishFallbackNotice } from "./english-notice";
import { JsonLd } from "./json-ld";

export function LegalShell({
  locale,
  path,
  eyebrow,
  title,
  intro,
  updated = SITE.lastReviewed,
  children,
}: {
  locale: Locale;
  path: string;
  eyebrow: string;
  title: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
}) {
  const messages = getMessages(locale);
  const crumbs = [
    { label: messages["common.home"], href: localizedPath(locale) },
    { label: title },
  ];

  return (
    <div className="container-page py-10 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={crumbs} label={messages["common.breadcrumb"]} />
        {locale !== "en" && <EnglishFallbackNotice text={messages["legal.englishOnlyArticle"]} />}
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          <FileText aria-hidden="true" className="h-3.5 w-3.5" />
          {eyebrow}
        </span>
        <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>
        {intro && <p className="mt-3 text-base leading-7 text-slate-600">{intro}</p>}
        <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays aria-hidden="true" className="h-4 w-4" />
          {messages["legal.updated"]}: {formatDate(updated, locale)}
        </p>
        <article className="article-body mt-8" lang={locale === "en" ? undefined : "en"}>
          {children}
        </article>
      </div>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: messages["common.home"], path: "" },
            { name: title, path },
          ],
          locale,
        )}
      />
    </div>
  );
}

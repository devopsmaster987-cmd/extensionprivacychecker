import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Layers } from "lucide-react";
import { isLocale, localizedPath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { breadcrumbJsonLd, buildMetadata, itemListJsonLd } from "@/lib/seo";
import { keywordPages, routeFor } from "@/content/registry";
import { ContentCard } from "@/components/site/content-card";
import { EnglishFallbackNotice } from "@/components/site/english-notice";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : "en";
  const messages = getMessages(safeLocale);
  return buildMetadata({
    locale: safeLocale,
    path: "/learn",
    title: `${messages["learn.title"]} - ${messages["meta.siteName"]}`,
    description: messages["learn.subtitle"],
  });
}

export default async function LearnPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const crumbs = [
    { label: messages["common.home"], href: localizedPath(locale) },
    { label: messages["nav.learn"] },
  ];

  return (
    <div className="container-page py-10 sm:py-12">
      <Breadcrumbs items={crumbs} label={messages["common.breadcrumb"]} />
      {locale !== "en" && <EnglishFallbackNotice text={messages["common.englishFallback"]} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900">
            <BookOpen aria-hidden="true" className="h-3.5 w-3.5" />
            {messages["nav.learn"]}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {messages["learn.title"]}
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">{messages["learn.subtitle"]}</p>
        </div>
        <Link
          href={localizedPath(locale, "/topics")}
          className="inline-flex items-center gap-1 self-start text-sm font-semibold text-teal-800 hover:text-teal-950 sm:self-auto"
        >
          <Layers aria-hidden="true" className="h-4 w-4" />
          {messages["common.viewAllTopics"]}
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" lang={locale === "en" ? undefined : "en"}>
        {keywordPages.map((page) => (
          <ContentCard key={page.slug} page={page} locale={locale} />
        ))}
      </div>

      <JsonLd
        data={[
          itemListJsonLd(
            keywordPages.map((page) => ({ name: page.h1, path: routeFor(page) })),
            locale,
            messages["learn.title"],
          ),
          breadcrumbJsonLd(
            [
              { name: messages["common.home"], path: "" },
              { name: messages["nav.learn"], path: "/learn" },
            ],
            locale,
          ),
        ]}
      />
    </div>
  );
}

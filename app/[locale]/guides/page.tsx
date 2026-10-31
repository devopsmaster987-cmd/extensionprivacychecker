import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListChecks } from "lucide-react";
import { isLocale, localizedPath } from "@/lib/i18n/config";
import { getMessages, type MessageKey } from "@/lib/i18n";
import { breadcrumbJsonLd, buildMetadata, itemListJsonLd } from "@/lib/seo";
import { guidePages, routeFor } from "@/content/registry";
import type { ContentIntent } from "@/content/types";
import { ContentCard } from "@/components/site/content-card";
import { EnglishFallbackNotice } from "@/components/site/english-notice";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";

const GROUPS: { intent: ContentIntent; key: MessageKey }[] = [
  { intent: "guide", key: "guides.intent.guide" },
  { intent: "comparison", key: "guides.intent.comparison" },
  { intent: "reference", key: "guides.intent.reference" },
];

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
    path: "/guides",
    title: `${messages["guides.title"]} - ${messages["meta.siteName"]}`,
    description: messages["guides.subtitle"],
  });
}

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const crumbs = [
    { label: messages["common.home"], href: localizedPath(locale) },
    { label: messages["nav.guides"] },
  ];

  return (
    <div className="container-page py-10 sm:py-12">
      <Breadcrumbs items={crumbs} label={messages["common.breadcrumb"]} />
      {locale !== "en" && <EnglishFallbackNotice text={messages["common.englishFallback"]} />}
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900">
          <ListChecks aria-hidden="true" className="h-3.5 w-3.5" />
          {messages["nav.guides"]}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          {messages["guides.title"]}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">{messages["guides.subtitle"]}</p>
      </div>

      <div className="mt-10 space-y-12" lang={locale === "en" ? undefined : "en"}>
        {GROUPS.map((group) => {
          const pages = guidePages.filter((page) => page.intent === group.intent);
          if (pages.length === 0) return null;
          return (
            <section key={group.intent} aria-labelledby={`group-${group.intent}`}>
              <h2 id={`group-${group.intent}`} className="text-xl font-bold tracking-tight text-slate-900">
                {messages[group.key]}
              </h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pages.map((page) => (
                  <ContentCard key={page.slug} page={page} locale={locale} compact />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <JsonLd
        data={[
          itemListJsonLd(
            guidePages.map((page) => ({ name: page.h1, path: routeFor(page) })),
            locale,
            messages["guides.title"],
          ),
          breadcrumbJsonLd(
            [
              { name: messages["common.home"], path: "" },
              { name: messages["nav.guides"], path: "/guides" },
            ],
            locale,
          ),
        ]}
      />
    </div>
  );
}

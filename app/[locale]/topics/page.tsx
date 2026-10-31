import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Compass } from "lucide-react";
import { isLocale, localizedPath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { breadcrumbJsonLd, buildMetadata, itemListJsonLd } from "@/lib/seo";
import { hubPages, routeFor } from "@/content/registry";
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
    path: "/topics",
    title: `${messages["topics.title"]} - ${messages["meta.siteName"]}`,
    description: messages["topics.subtitle"],
  });
}

export default async function TopicsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const crumbs = [
    { label: messages["common.home"], href: localizedPath(locale) },
    { label: messages["nav.topics"] },
  ];

  return (
    <div className="container-page py-10 sm:py-12">
      <Breadcrumbs items={crumbs} label={messages["common.breadcrumb"]} />
      {locale !== "en" && <EnglishFallbackNotice text={messages["common.englishFallback"]} />}
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900">
          <Compass aria-hidden="true" className="h-3.5 w-3.5" />
          {messages["nav.topics"]}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          {messages["topics.title"]}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">{messages["topics.subtitle"]}</p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" lang={locale === "en" ? undefined : "en"}>
        {hubPages.map((hub) => (
          <ContentCard key={hub.slug} page={hub} locale={locale} />
        ))}
      </div>

      <JsonLd
        data={[
          itemListJsonLd(
            hubPages.map((hub) => ({ name: hub.h1, path: routeFor(hub) })),
            locale,
            messages["topics.title"],
          ),
          breadcrumbJsonLd(
            [
              { name: messages["common.home"], path: "" },
              { name: messages["nav.topics"], path: "/topics" },
            ],
            locale,
          ),
        ]}
      />
    </div>
  );
}

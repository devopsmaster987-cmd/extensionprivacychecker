import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata, faqJsonLd, howToJsonLd } from "@/lib/seo";
import { getHubFor, getPage, hubPages, routeFor } from "@/content/registry";
import { ContentPageView } from "@/components/site/content-page-view";
import { JsonLd } from "@/components/site/json-ld";

export function generateStaticParams() {
  return hubPages.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getPage(slug);
  if (!page || page.kind !== "hub") return {};
  const safeLocale = isLocale(locale) ? locale : "en";
  return buildMetadata({
    locale: safeLocale,
    path: routeFor(page),
    title: page.metaTitle,
    description: page.description,
    translated: false,
    type: "article",
    modifiedTime: page.lastReviewed,
  });
}

export default async function HubPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const page = getPage(slug);
  if (!page || page.kind !== "hub") notFound();
  const messages = getMessages(locale);
  const parent = getHubFor(page);
  const howTo = howToJsonLd(page);

  const crumbs = [
    { name: messages["common.home"], path: "" },
    { name: messages["nav.topics"], path: "/topics" },
    ...(parent ? [{ name: parent.h1, path: routeFor(parent) }] : []),
    { name: page.h1, path: routeFor(page) },
  ];

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd(page, locale),
          breadcrumbJsonLd(crumbs, locale),
          faqJsonLd(page.faqs),
          howTo,
        ]}
      />
      <ContentPageView page={page} locale={locale} />
    </>
  );
}

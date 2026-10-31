import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FileArchive, Lock, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { isLocale, localizedPath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { breadcrumbJsonLd, buildMetadata, webApplicationJsonLd } from "@/lib/seo";
import { AnalyzerPanel } from "@/components/analyzer/analyzer-panel";
import { JsonLd } from "@/components/site/json-ld";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Badge } from "@/components/ui/badge";

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
    path: "/analyzer",
    title: messages["analyzer.metaTitle"],
    description: messages["analyzer.metaDescription"],
    translated: true,
  });
}

export default async function AnalyzerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const crumbs = [
    { label: messages["common.home"], href: localizedPath(locale) },
    { label: messages["nav.analyzer"] },
  ];

  return (
    <>
      <JsonLd
        data={[
          webApplicationJsonLd(locale),
          breadcrumbJsonLd(
            [
              { name: messages["common.home"], path: "" },
              { name: messages["nav.analyzer"], path: "/analyzer" },
            ],
            locale,
          ),
        ]}
      />
      <section className="hero-mesh border-b border-slate-200">
        <div className="container-page py-10 sm:py-12">
          <Breadcrumbs items={crumbs} label={messages["common.breadcrumb"]} />
          <div className="mt-6 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Badge variant="teal">{messages["common.free"]}</Badge>
              <Badge variant="outline">
                <Lock aria-hidden="true" className="me-1 h-3 w-3" />
                {messages["analyzer.processedLocally"]}
              </Badge>
              <Badge variant="outline">
                <ShieldCheck aria-hidden="true" className="me-1 h-3 w-3" />
                {messages["analyzer.neverExecuted"]}
              </Badge>
            </div>
            <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              {messages["analyzer.title"]}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              {messages["analyzer.subtitle"]}
            </p>
          </div>

          <div className="mt-8">
            <AnalyzerPanel locale={locale} />
          </div>
        </div>
      </section>

      <section className="container-page grid gap-5 py-10 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <FileArchive aria-hidden="true" className="h-5 w-5 text-teal-700" />
            {messages["analyzer.emptyTitle"]}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{messages["analyzer.emptyBody"]}</p>
          <p className="mt-3 text-xs leading-5 text-slate-500">{messages["analyzer.supported"]}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <SlidersHorizontal aria-hidden="true" className="h-5 w-5 text-teal-700" />
            {messages["report.scoring"]}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{messages["analyzer.limitsNote"]}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link
              href={localizedPath(locale, "/methodology")}
              className="inline-flex items-center gap-1 font-semibold text-teal-800 hover:text-teal-950"
            >
              {messages["nav.methodology"]}
              <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link
              href={localizedPath(locale, "/guides")}
              className="inline-flex items-center gap-1 font-semibold text-teal-800 hover:text-teal-950"
            >
              {messages["common.viewAllGuides"]}
              <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

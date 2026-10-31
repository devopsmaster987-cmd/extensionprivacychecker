import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  FileArchive,
  Gauge,
  Globe2,
  Layers,
  Lock,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { isLocale, localizedPath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import {
  buildMetadata,
  faqJsonLd,
  organizationJsonLd,
  webApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { hubPages } from "@/content/registry";
import type { FaqItem } from "@/content/types";
import { AnalyzerPanel } from "@/components/analyzer/analyzer-panel";
import { ContentCard } from "@/components/site/content-card";
import { FaqList } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    path: "",
    title: messages["home.metaTitle"],
    description: messages["home.metaDescription"],
    translated: true,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const safeLocale = locale as Locale;

  const faqKeys = [
    ["home.faq1Q", "home.faq1A"],
    ["home.faq2Q", "home.faq2A"],
    ["home.faq3Q", "home.faq3A"],
    ["home.faq4Q", "home.faq4A"],
    ["home.faq5Q", "home.faq5A"],
  ] as const;
  const faqs: FaqItem[] = faqKeys.map(([question, answer]) => ({
    question: messages[question],
    answer: messages[answer],
  }));

  const formats = [
    { title: messages["home.formatCrx"], icon: <FileArchive aria-hidden="true" className="h-5 w-5" />, ext: ".crx" },
    { title: messages["home.formatXpi"], icon: <Layers aria-hidden="true" className="h-5 w-5" />, ext: ".xpi" },
    { title: messages["home.formatZip"], icon: <FileArchive aria-hidden="true" className="h-5 w-5" />, ext: ".zip" },
    { title: messages["home.formatManifest"], icon: <Code2 aria-hidden="true" className="h-5 w-5" />, ext: "manifest.json" },
  ];

  const steps = [
    { title: messages["home.how1Title"], body: messages["home.how1Body"] },
    { title: messages["home.how2Title"], body: messages["home.how2Body"] },
    { title: messages["home.how3Title"], body: messages["home.how3Body"] },
    { title: messages["home.how4Title"], body: messages["home.how4Body"] },
  ];

  const features = [
    { title: messages["home.feature1Title"], body: messages["home.feature1Body"], icon: <ShieldCheck aria-hidden="true" className="h-5 w-5" /> },
    { title: messages["home.feature2Title"], body: messages["home.feature2Body"], icon: <Code2 aria-hidden="true" className="h-5 w-5" /> },
    { title: messages["home.feature3Title"], body: messages["home.feature3Body"], icon: <Globe2 aria-hidden="true" className="h-5 w-5" /> },
    { title: messages["home.feature4Title"], body: messages["home.feature4Body"], icon: <Gauge aria-hidden="true" className="h-5 w-5" /> },
  ];

  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(),
          websiteJsonLd(safeLocale),
          webApplicationJsonLd(safeLocale),
          faqJsonLd(faqs),
        ]}
      />

      <section className="hero-mesh relative overflow-hidden border-b border-slate-200">
        <div aria-hidden="true" className="grid-fade pointer-events-none absolute inset-0" />
        <div className="container-page relative py-12 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1 text-xs font-semibold text-teal-900 shadow-sm">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              {messages["home.eyebrow"]}
            </span>
            <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl">
              {messages["home.title"]}{" "}
              <span className="bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">
                {messages["home.titleAccent"]}
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg">
              {messages["home.subtitle"]}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Lock aria-hidden="true" className="h-4 w-4 text-teal-700" />
                {messages["home.trustLocal"]}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck aria-hidden="true" className="h-4 w-4 text-teal-700" />
                {messages["home.trustNoCode"]}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-teal-700" />
                {messages["home.trustNoAccount"]}
              </span>
            </div>
          </div>

          <div id="analyzer" className="mx-auto mt-10 max-w-5xl scroll-mt-24">
            <AnalyzerPanel locale={safeLocale} />
          </div>
        </div>
      </section>

      <section className="container-page py-10" aria-labelledby="formats-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="formats-heading" className="text-xl font-bold tracking-tight text-slate-900">
              {messages["home.formatsTitle"]}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              {messages["home.formatsSubtitle"]}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900 sm:self-auto">
            <MousePointerClick aria-hidden="true" className="h-3.5 w-3.5" />
            {messages["common.supportedFormats"]}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {formats.map((format) => (
            <div key={format.ext} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-800">
                {format.icon}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{format.title}</p>
                <p className="text-xs text-slate-500">{format.ext}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white" aria-labelledby="how-heading">
        <div className="container-page py-14">
          <div className="max-w-2xl">
            <h2 id="how-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {messages["home.howTitle"]}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">{messages["home.howSubtitle"]}</p>
          </div>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-sm font-bold text-slate-900">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page py-14" aria-labelledby="features-heading">
        <div className="max-w-2xl">
          <h2 id="features-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {messages["home.featuresTitle"]}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">{messages["home.featuresSubtitle"]}</p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
                {feature.icon}
              </span>
              <h3 className="mt-4 text-base font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white" aria-labelledby="topics-heading">
        <div className="container-page py-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 id="topics-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {messages["home.topicsTitle"]}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">{messages["home.topicsSubtitle"]}</p>
            </div>
            <Link
              href={localizedPath(locale, "/topics")}
              className="inline-flex items-center gap-1 self-start text-sm font-semibold text-teal-800 hover:text-teal-950 sm:self-auto"
            >
              {messages["common.viewAllTopics"]}
              <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hubPages.slice(0, 6).map((hub) => (
              <ContentCard key={hub.slug} page={hub} locale={safeLocale} />
            ))}
          </div>
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
            {messages["home.englishNote"]}
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <FaqList items={faqs} title={messages["home.faqTitle"]} />
      </section>

      <section className="container-page pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-10 text-center text-white sm:px-12 sm:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(13,148,136,0.4),transparent_55%),radial-gradient(circle_at_80%_100%,rgba(8,145,178,0.35),transparent_50%)]"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{messages["home.ctaTitle"]}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base">{messages["home.ctaBody"]}</p>
            <Link
              href={localizedPath(locale, "/analyzer")}
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "mt-6 bg-teal-500 text-slate-950 hover:bg-teal-400")}
            >
              {messages["home.ctaButton"]}
              <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

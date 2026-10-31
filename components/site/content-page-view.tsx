import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, ExternalLink, ListChecks } from "lucide-react";
import type { ContentPage } from "@/content/types";
import { getClusterPages, getHubFor, getRelatedPages, routeFor } from "@/content/registry";
import { getSources } from "@/content/sources";
import { formatDate, localizedPath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "./breadcrumbs";
import { FaqList } from "./faq";
import { EnglishFallbackNotice } from "./english-notice";
import { AnalyzerPanel } from "@/components/analyzer/analyzer-panel";

export function ContentPageView({
  page,
  locale,
  headingLevel = "h1",
}: {
  page: ContentPage;
  locale: Locale;
  headingLevel?: "h1";
}) {
  const messages = getMessages(locale);
  const hub = getHubFor(page);
  const related = getRelatedPages(page);
  const cluster = page.kind === "hub" ? getClusterPages(page.slug) : [];
  const englishOnly = locale !== "en";
  const Heading = headingLevel;
  const sources = getSources(page.cluster);

  const crumbs = [
    { label: messages["common.home"], href: localizedPath(locale) },
    { label: messages["nav.topics"], href: localizedPath(locale, "/topics") },
    ...(hub ? [{ label: hub.h1, href: localizedPath(locale, routeFor(hub)) }] : []),
    { label: page.h1 },
  ];

  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumbs items={crumbs} label={messages["common.breadcrumb"]} />

      {englishOnly && (
        <EnglishFallbackNotice text={messages["common.englishFallback"]} />
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <article lang={englishOnly ? "en" : undefined}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={page.kind === "hub" ? "teal" : "default"}>
              {page.kind === "hub"
                ? messages["common.topic"]
                : page.intent === "guide"
                  ? messages["common.guide"]
                  : messages["common.article"]}
            </Badge>
            <Badge variant="outline">{page.primaryKeyword}</Badge>
          </div>

          <Heading className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {page.h1}
          </Heading>

          <div className="mt-5 rounded-2xl border border-teal-200 bg-teal-50/70 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
              {messages["common.answer"]}
            </p>
            <p className="mt-2 text-base leading-7 text-slate-800">{page.answer}</p>
          </div>

          {page.analyzerEmbed && (
            <div id="analyzer" className="mt-8 scroll-mt-20">
              <AnalyzerPanel locale={locale} />
            </div>
          )}

          <div className="article-body mt-10">
            {page.sections.map((section, sectionIndex) => (
              <section key={section.heading} className="mt-9" id={`section-${sectionIndex + 1}`}>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  {section.heading}
                </h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {section.list && (
                  <ul className="mt-3">
                    {section.list.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-700" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.steps && (
                  <ol className="mt-4 space-y-4">
                    {section.steps.map((step, index) => (
                      <li key={step.title} id={`step-${index + 1}`} className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900">{step.title}</p>
                          <p className="mt-0.5 text-sm leading-6 text-slate-600">{step.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}

                {section.table && (
                  <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full min-w-[32rem] border-collapse text-start text-sm">
                      <caption className="sr-only">{section.table.caption}</caption>
                      <thead className="bg-slate-50">
                        <tr>
                          {section.table.headers.map((header) => (
                            <th key={header} scope="col" className="px-4 py-3 text-start font-semibold text-slate-800">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {section.table.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-4 py-3 align-top text-slate-600">
                                {cellIndex === 0 ? <span className="font-medium text-slate-800">{cell}</span> : cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {section.callout && (
                  <aside className="mt-5 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                    {section.callout}
                  </aside>
                )}

                {section.links && section.links.length > 0 && (
                  <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                    <span className="font-semibold text-slate-800">{messages["common.related"]}:</span>
                    {section.links.map((link) => (
                      <Link
                        key={link.slug}
                        href={localizedPath(locale, `/learn/${link.slug}`)}
                        className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-2 hover:text-teal-950"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </p>
                )}
              </section>
            ))}
          </div>

          {cluster.length > 0 && (
            <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <ListChecks aria-hidden="true" className="h-5 w-5 text-teal-700" />
                {messages["nav.learn"]}
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {cluster.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={localizedPath(locale, routeFor(item))}
                      className="flex items-start gap-2 rounded-lg p-2 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                    >
                      <ArrowRight aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 rtl:rotate-180" />
                      <span>{item.h1}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="sources-heading" className="mt-12 border-t border-slate-200 pt-6">
            <h2 id="sources-heading" className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <ExternalLink aria-hidden="true" className="h-5 w-5 text-teal-700" />
              {messages["common.sources"]}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-2 hover:text-teal-950"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <FaqList items={page.faqs} title={messages["common.faq"]} lang={englishOnly ? "en" : undefined} />

          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <CalendarDays aria-hidden="true" className="h-4 w-4" />
            <span>
              {messages["common.lastReviewed"]}: {formatDate(page.lastReviewed, locale)}
            </span>
          </div>
        </article>

        <aside className="no-print space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <BookOpen aria-hidden="true" className="h-4 w-4 text-teal-700" />
              {messages["nav.analyzer"]}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{messages["analyzer.subtitle"]}</p>
            <Link
              href={localizedPath(locale, "/analyzer")}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-800 hover:text-teal-950"
            >
              {messages["common.tryAnalyzer"]}
              <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>

          {hub && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {messages["common.topic"]}
              </p>
              <Link
                href={localizedPath(locale, routeFor(hub))}
                className="mt-2 block text-sm font-semibold text-slate-900 hover:text-teal-800"
              >
                {hub.h1}
              </Link>
              <p className="mt-2 text-xs leading-5 text-slate-500">{hub.description}</p>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {messages["common.related"]}
            </p>
            <ul className="mt-3 space-y-2.5 text-sm">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={localizedPath(locale, routeFor(item))}
                    className="font-medium text-slate-700 hover:text-teal-800 hover:underline"
                  >
                    {item.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

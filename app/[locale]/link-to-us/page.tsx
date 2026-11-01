import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Code2, Link2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { isLocale, localizedPath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { EnglishFallbackNotice } from "@/components/site/english-notice";
import { FaqList } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { Badge } from "@/components/ui/badge";

const FAQS = [
  {
    question: "Can I link to Extension Privacy Checker from my website?",
    answer:
      "Yes. You can link to the home page, the analyzer, the methodology page or a relevant guide. Use a descriptive anchor such as “Extension Privacy Checker” or “browser extension analyzer” rather than “click here”.",
  },
  {
    question: "Can I use the badge on my extension's website or README?",
    answer:
      "Yes. The badge may be used on documentation, project pages and posts that reference the analyzer. Keep the alt text, link it to the analyzer, and do not imply that the site has certified or endorsed your extension.",
  },
  {
    question: "Do you offer a data citation for research or journalism?",
    answer:
      "Yes. Cite the methodology page for scoring and detection details, and link to the analyzer for the tool itself. The citation formats on this page can be adapted for articles, reports and academic work.",
  },
  {
    question: "Do you buy or exchange links?",
    answer:
      "No. We do not buy links, join link schemes or offer reciprocal-link requirements. Relevant editorial links, documentation links and directory listings are welcome.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : "en";
  return buildMetadata({
    locale: safeLocale,
    path: "/link-to-us",
    title: "Link to Extension Privacy Checker - Badges and Citation",
    description:
      "Link to Extension Privacy Checker with ready-made HTML and Markdown snippets, badges, citation formats and suggested pages for extension privacy guides.",
    translated: false,
  });
}

export default async function LinkToUsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const year = new Date().getFullYear();
  const home = `${SITE.url}/en`;
  const analyzer = `${SITE.url}/en/analyzer`;
  const methodology = `${SITE.url}/en/methodology`;
  const badge = `${SITE.url}/badges/extension-privacy-checker.svg`;
  const darkBadge = `${SITE.url}/badges/extension-privacy-checker-dark.svg`;

  const textLink = `<a href="${analyzer}">Extension Privacy Checker</a>`;
  const badgeEmbed = `<a href="${analyzer}" rel="noopener">
  <img src="${badge}" alt="Extension Privacy Checker - free static analysis for browser extensions" width="300" height="64" loading="lazy">
</a>`;
  const badgeMarkdown = `[![Extension Privacy Checker - free static analysis for browser extensions](${badge})](${analyzer})`;
  const darkBadgeMarkdown = `[![Extension Privacy Checker - free static analysis for browser extensions](${darkBadge})](${analyzer})`;
  const citation = `Extension Privacy Checker. (${year}). Static analysis methodology for browser extensions. ${methodology}`;
  const crumbs = [
    { label: messages["common.home"], href: localizedPath(locale) },
    { label: "Link to us" },
  ];

  return (
    <>
      <JsonLd
        data={[
          faqJsonLd(FAQS),
          breadcrumbJsonLd(
            [
              { name: messages["common.home"], path: "" },
              { name: "Link to us", path: "/link-to-us" },
            ],
            locale,
          ),
        ]}
      />
      <section className="hero-mesh border-b border-slate-200">
        <div className="container-page py-10 sm:py-12">
          <Breadcrumbs items={crumbs} label={messages["common.breadcrumb"]} />
          {locale !== "en" && <EnglishFallbackNotice text={messages["common.englishFallback"]} />}
          <div className="mt-6 max-w-3xl" lang={locale === "en" ? undefined : "en"}>
            <div className="flex flex-wrap gap-2">
              <Badge variant="teal">Free to link</Badge>
              <Badge variant="outline">
                <Link2 aria-hidden="true" className="me-1 h-3 w-3" />
                Editorial links welcome
              </Badge>
              <Badge variant="outline">
                <ShieldCheck aria-hidden="true" className="me-1 h-3 w-3" />
                No link schemes
              </Badge>
            </div>
            <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Link to Extension Privacy Checker
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Writing about extension permissions, privacy or version updates? Use a text link, an embeddable badge or a
              citation. Keep the anchor descriptive and link to the page that best matches your reader&apos;s question.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_19rem]" lang={locale === "en" ? undefined : "en"}>
        <article className="space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Link2 aria-hidden="true" className="h-5 w-5 text-teal-700" />
              Text link
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Link to the analyzer when your readers need to inspect a package. Link to the home page when you are
              introducing the tool.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
              <code>{textLink}</code>
            </pre>
            <p className="mt-3 text-xs text-slate-500">
              Suggested anchors: <strong>Extension Privacy Checker</strong>, <strong>browser extension analyzer</strong>,{" "}
              <strong>extension permission checker</strong>.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Code2 aria-hidden="true" className="h-5 w-5 text-teal-700" />
              Badge embeds
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use a badge on a project page, documentation site or README. The badge links to the analyzer and uses
              descriptive alt text.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/badges/extension-privacy-checker.svg" alt="Extension Privacy Checker badge" width={300} height={64} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/badges/extension-privacy-checker-dark.svg" alt="Extension Privacy Checker light badge" width={300} height={64} />
            </div>
            <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">HTML</h3>
            <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
              <code>{badgeEmbed}</code>
            </pre>
            <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">Markdown</h3>
            <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
              <code>{badgeMarkdown}</code>
            </pre>
            <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">Markdown, light badge</h3>
            <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
              <code>{darkBadgeMarkdown}</code>
            </pre>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Check aria-hidden="true" className="h-5 w-5 text-teal-700" />
              Citation
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              For articles, reports and academic work, cite the methodology page so readers can inspect the scoring
              rules and limits.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
              <code>{citation}</code>
            </pre>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Do not describe a generated report as an official audit, certification or endorsement. The analyzer
              produces static indicators, not a malware verdict.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold text-slate-900">Suggested link targets</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Match the link to the reader&apos;s intent instead of sending every link to the home page.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Analyzer", "/analyzer", "Upload a CRX, XPI, ZIP or manifest.json package."],
                ["Methodology", "/methodology", "Scoring weights, detection rules and limits."],
                ["Compare versions", "/compare", "Diff permissions, domains and findings."],
                ["Privacy checker hub", "/topics/browser-extension-privacy-checker", "Guides on extension privacy."],
                ["Permissions hub", "/topics/chrome-permissions-checker", "Understand API and host permissions."],
                ["Guides index", "/guides", "How-to, comparison and reference pages."],
              ].map(([label, href, description]) => (
                <Link
                  key={href}
                  href={localizedPath(locale, href)}
                  className="rounded-xl border border-slate-200 p-3 hover:border-teal-400 hover:bg-teal-50/40"
                >
                  <span className="block text-sm font-semibold text-slate-900">{label}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            <h2 className="font-bold">Linking guidelines</h2>
            <ul className="mt-2 space-y-1.5">
              <li>Use a descriptive anchor and link to a relevant page.</li>
              <li>Do not imply that Extension Privacy Checker certified, approved or audited your extension.</li>
              <li>No paid links, private blog networks, automated link drops or reciprocal-link requirements.</li>
              <li>Disclose sponsored or affiliate relationships as required by your jurisdiction.</li>
            </ul>
          </div>

          <FaqList items={FAQS} title={messages["common.faq"]} lang="en" />
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5">
            <h2 className="text-sm font-bold text-slate-900">Linkable assets</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>Transparent scoring and methodology</li>
              <li>Permission and host-access explainers</li>
              <li>Version comparison workflow</li>
              <li>Local, no-upload analysis model</li>
              <li>Exportable JSON, CSV and PDF reports</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-bold text-slate-900">Corrections</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Found an inaccurate finding or a broken link? Contact us so the page can be corrected and the review date
              updated.
            </p>
            <Link
              href={localizedPath(locale, "/contact")}
              className="mt-3 inline-flex text-sm font-semibold text-teal-800 hover:underline"
            >
              {messages["footer.contact"]}
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-bold text-slate-900">Canonical URL</h2>
            <p className="mt-2 break-all rounded-lg bg-slate-50 p-2 text-xs text-slate-600">{home}</p>
          </div>
        </aside>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, GitCompareArrows, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { isLocale, localizedPath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { ComparePanel } from "@/components/analyzer/compare-panel";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { EnglishFallbackNotice } from "@/components/site/english-notice";
import { FaqList } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { Badge } from "@/components/ui/badge";

const FAQS = [
  {
    question: "How do I compare two browser extension versions?",
    answer:
      "Upload the older package on the left and the newer package on the right. The tool analyzes both locally, then shows score changes, added or removed permissions, host patterns, external domains and code findings.",
  },
  {
    question: "Why compare extension versions instead of only scanning the latest build?",
    answer:
      "An extension can update after you install it. Comparing versions shows what changed in an update, which is useful when new permissions, domains or code patterns appear without a clear feature change.",
  },
  {
    question: "Does a new permission in an update prove that the extension is malicious?",
    answer:
      "No. A new permission shows new capability. Review whether the update explains the feature that needs it, whether the permission is optional and whether the destination domains match the publisher's privacy policy.",
  },
  {
    question: "Are the uploaded packages sent to a server?",
    answer:
      "No. Both packages are parsed in your browser by a Web Worker. The comparison report exists only in the page and is not uploaded.",
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
    path: "/compare",
    title: "Compare Browser Extension Versions - Permissions and Risk Diff",
    description:
      "Compare two browser extension packages side by side. See permission, host pattern, domain and code finding changes between versions. Free, local, and no code execution.",
    translated: false,
  });
}

export default async function ComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const crumbs = [
    { label: messages["common.home"], href: localizedPath(locale) },
    { label: messages["nav.compare"] },
  ];
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Extension Version Compare",
    url: `${SITE.url}/en/compare`,
    applicationCategory: "SecurityApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and a modern browser with Web Worker support.",
    description:
      "Compare two browser extension packages to see permission, host pattern, external domain and code finding changes between versions.",
    inLanguage: "en",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };

  return (
    <>
      <JsonLd
        data={[
          appJsonLd,
          faqJsonLd(FAQS),
          breadcrumbJsonLd(
            [
              { name: messages["common.home"], path: "" },
              { name: messages["nav.compare"], path: "/compare" },
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
              Compare two browser extension versions
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              See exactly what changed between an older and a newer package: permissions, website access, external
              domains, code findings and risk score. Both files stay in your browser.
            </p>
          </div>
          <div className="mt-8">
            <ComparePanel />
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_19rem]" lang={locale === "en" ? undefined : "en"}>
        <article className="article-body max-w-3xl">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Why extension updates deserve a separate check
          </h2>
          <p>
            Installing an extension is not a one-time decision. Extensions can update automatically, and an update can
            add permissions, content-script matches, remote endpoints or code patterns that were not present when you
            first reviewed the package. A version comparison turns a vague “it updated” message into a concrete list of
            changes.
          </p>

          <h2 className="mt-8 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            What the comparison checks
          </h2>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li>Added and removed API permissions, including optional permissions.</li>
            <li>New and removed host permissions and content-script match patterns.</li>
            <li>New and removed external domains, with the same category labels as a normal report.</li>
            <li>New and resolved code findings, including line numbers where available.</li>
            <li>The risk score and privacy grade before and after the update.</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            How to read a permission change
          </h2>
          <p>
            A new permission is a capability, not a verdict. Check the extension&apos;s release notes and the feature
            that needs the permission. A new <code>cookies</code> permission is more consequential than a new{" "}
            <code>alarms</code> permission. A new <code>&lt;all_urls&gt;</code> pattern is broader than a single host.
            Optional permissions are requested at runtime and can be declined.
          </p>
          <p>
            If an update adds a broad host pattern, a raw IP endpoint or a credential-related code finding, review the
            report evidence before updating. When the publisher does not explain the change, consider removing the
            extension until it does.
          </p>

          <h2 className="mt-8 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Limits of a version diff
          </h2>
          <p>
            Static analysis reads the files in each package. It does not execute either version, observe runtime
            behavior or prove that a domain was contacted. Minified or bundled library code can create findings that
            are not part of the publisher&apos;s own logic. Use the diff as a focused review list, not as a malware
            verdict.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={localizedPath(locale, "/analyzer")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Analyze a single package
              <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link
              href={localizedPath(locale, "/learn/compare-chrome-extension-versions")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-teal-500 hover:text-teal-900"
            >
              Read the version-comparison guide
            </Link>
          </div>

          <FaqList items={FAQS} title={messages["common.faq"]} lang="en" />
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <GitCompareArrows aria-hidden="true" className="h-4 w-4 text-teal-700" />
              Compare workflow
            </h2>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>1. Upload the version you already reviewed.</li>
              <li>2. Upload the update you are considering.</li>
              <li>3. Review added permissions, domains and findings.</li>
              <li>4. Read the evidence before accepting the update.</li>
            </ol>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-bold text-slate-900">Related reading</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                ["How to audit an extension before install", "/learn/how-to-audit-an-extension-before-install"],
                ["Chrome extension host permissions", "/learn/chrome-extension-host-permissions-checker"],
                ["Compare Chrome extension versions", "/learn/compare-chrome-extension-versions"],
                ["Browser extension privacy guide", "/learn/browser-extension-privacy-guide"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={localizedPath(locale, href)} className="font-medium text-slate-700 hover:text-teal-800 hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}

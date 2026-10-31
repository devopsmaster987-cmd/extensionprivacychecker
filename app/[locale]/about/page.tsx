import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localizedPath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { LegalShell } from "@/components/site/legal-shell";

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
    path: "/about",
    title: `${messages["footer.about"]} - ${messages["meta.siteName"]}`,
    description:
      "Why Extension Privacy Checker exists, how it stays independent, and the principles behind its static analysis reports.",
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <LegalShell
      locale={locale}
      path="/about"
      eyebrow="About"
      title="About Extension Privacy Checker"
      intro="A free, independent tool for understanding what a browser extension can access before it is installed."
    >
      <h2>Why this exists</h2>
      <p>
        Extension permission prompts are short and often technical. A prompt may say an add-on can
        read and change data on all websites without explaining what that means in practice, or
        which code and external services are involved. This project turns the contents of an
        extension package into a structured report: requested capabilities, website access, code
        indicators, referenced domains and a transparent risk score.
      </p>

      <h2>Principles</h2>
      <ul>
        <li>
          <strong>No code execution.</strong> The extension is parsed as data. It is not installed,
          evaluated or run in a browser context.
        </li>
        <li>
          <strong>Local by default.</strong> Selected files are processed in your browser. Reports
          stay in the page.
        </li>
        <li>
          <strong>Evidence over verdicts.</strong> Every finding shows the matched text and the
          reason it matters. The score is not presented as a malware verdict.
        </li>
        <li>
          <strong>Transparent scoring.</strong> The six categories, weights and contributions are
          published and shown in each report.
        </li>
        <li>
          <strong>Accessible explanations.</strong> Reports are written for nontechnical readers,
          with enough detail for developers and reviewers to verify the result.
        </li>
      </ul>

      <h2>Independence</h2>
      <p>
        Extension Privacy Checker is not affiliated with Google, Microsoft, Mozilla or any extension
        developer. Store names are used only to identify supported formats. There are no sponsored
        rankings, paid certifications or affiliate placements in reports.
      </p>

      <h2>Free and accountless</h2>
      <p>
        The analyzer, reports and exports are free. There is no account requirement and no paywall
        around the scan. If you find the tool useful, the best contribution is reporting a reproducible
        false positive or a missing detection.
      </p>

      <h2>How to use the site</h2>
      <p>
        Start with the <Link href={localizedPath(locale, "/analyzer")}>analyzer</Link>, read the{" "}
        <Link href={localizedPath(locale, "/methodology")}>methodology</Link> for scoring details, or
        browse <Link href={localizedPath(locale, "/topics")}>topics</Link> and{" "}
        <Link href={localizedPath(locale, "/guides")}>guides</Link> for background.
      </p>
    </LegalShell>
  );
}

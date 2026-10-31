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
    path: "/methodology",
    title: `${messages["methodology.title"]} - ${messages["meta.siteName"]}`,
    description:
      "How the analyzer validates archives, parses manifests, inspects JavaScript, classifies domains and calculates its transparent 0-100 risk score.",
  });
}

export default async function MethodologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <LegalShell
      locale={locale}
      path="/methodology"
      eyebrow="Transparency"
      title="Methodology"
      intro="The analyzer is deliberately explainable. This page documents the pipeline, the six scoring categories and the limits of the result."
    >
      <h2>1. Package intake</h2>
      <p>
        A package can be a Chrome CRX, a Firefox XPI, a ZIP or a standalone manifest.json. The
        browser applies a 25 MB upload limit before reading the file. The analyzer detects the CRX2
        and CRX3 container headers, strips the header, and treats the remainder as a ZIP archive. A
        bare manifest.json is analyzed as a single manifest with no source files.
      </p>

      <h2>2. Safe unpacking</h2>
      <p>
        Archive processing runs in a Web Worker. Before reading entries, the analyzer enforces entry
        count, per-file size and total uncompressed size limits. Path traversal segments, absolute
        paths and symlinks are rejected or skipped. Nested archives are not expanded beyond a small
        fixed limit. Skipped content is listed in the report so a result is never presented as more
        complete than it is.
      </p>

      <h2>3. Manifest analysis</h2>
      <p>
        The manifest is parsed as data and validated with a permissive schema so minor real-world
        variations do not break analysis. The analyzer collects the extension name, version,
        manifest version, browser-specific fields, required and optional API permissions, host
        permissions, content scripts, background configuration, CSP, update URL,
        externally_connectable, web-accessible resources, action popup and options page. Missing or
        malformed fields generate warnings rather than silent failures.
      </p>

      <h2>4. Static code inspection</h2>
      <p>
        JavaScript and HTML files are read as text within strict size limits. JavaScript is parsed
        with an ECMAScript parser to locate patterns such as <code>eval</code>, the Function
        constructor, string-based timers, remote script loading, <code>importScripts()</code>, DOM
        injection APIs, storage APIs, messaging, native messaging, cookie access, password-field
        references and keyboard event listeners. HTML is scanned for inline and remote script
        references. No code is executed, imported or installed. Findings include file, line, column,
        evidence, confidence and a plain-language explanation.
      </p>

      <h2>5. Domain extraction</h2>
      <p>
        URLs found in manifests, scripts and HTML are reduced to hostnames. Local, extension and
        placeholder hosts are removed. Each remaining domain is grouped as analytics, advertising,
        authentication, error reporting, cloud service or unknown. A referenced domain is a static
        reference only; it does not prove that the extension contacted it.
      </p>

      <h2>6. Risk scoring</h2>
      <p>
        Six category scores (0-100 each) are weighted and summed. Category scores are rounded before
        weighting. The final score is rounded to the nearest integer and mapped to a band.
      </p>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-4 py-2.5 text-start font-semibold">Category</th>
              <th scope="col" className="px-4 py-2.5 text-start font-semibold">Weight</th>
              <th scope="col" className="px-4 py-2.5 text-start font-semibold">What contributes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-2.5 font-medium">Permission exposure</td>
              <td className="px-4 py-2.5">25%</td>
              <td className="px-4 py-2.5">Required API permission weights, broad-access flags</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium">Website access</td>
              <td className="px-4 py-2.5">20%</td>
              <td className="px-4 py-2.5">Host patterns, all-sites access, content-script matches</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium">Data collection indicators</td>
              <td className="px-4 py-2.5">15%</td>
              <td className="px-4 py-2.5">Storage, network APIs, sensitive fields, cookies, history</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium">Remote code indicators</td>
              <td className="px-4 py-2.5">20%</td>
              <td className="px-4 py-2.5">Dynamic execution, remote scripts, runtime imports</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium">External domain exposure</td>
              <td className="px-4 py-2.5">10%</td>
              <td className="px-4 py-2.5">Unique external domains, ad-tech and unclassified hosts</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium">Source obfuscation</td>
              <td className="px-4 py-2.5">10%</td>
              <td className="px-4 py-2.5">Strong obfuscation indicators and their severity</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Bands: 0-24 low, 25-49 moderate, 50-74 high, 75-100 critical. Each category displays its
        score, weight, weighted contribution and the evidence used.
      </p>

      <h2>What the score is not</h2>
      <p>
        The score is not a malware verdict, a reputation score or a guarantee. Static analysis cannot
        observe runtime behavior, server-side logic, dynamic updates or future versions. Legitimate
        extensions can score high because they need broad access. Use the evidence and permissions
        list, not only the number.
      </p>

      <h2>Versioning and corrections</h2>
      <p>
        The report includes a schema version so exported JSON can be interpreted consistently.
        Scoring weights and detection rules may change as the tool improves. If you find a systematic
        false positive or a missed pattern, please{" "}
        <Link href={localizedPath(locale, "/contact")}>contact us</Link> with the package details.
      </p>
      <p>
        Ready to inspect a package? <Link href={localizedPath(locale, "/analyzer")}>Open the analyzer</Link>.
      </p>
    </LegalShell>
  );
}

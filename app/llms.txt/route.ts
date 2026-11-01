import { SITE } from "@/lib/site";
import { hubPages, keywordPages, routeFor } from "@/content/registry";

export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [
    `# ${SITE.name}`,
    "",
    "> Free, private static analysis for browser extensions. Inspect CRX, XPI, ZIP and manifest.json packages for permissions, host access, external domains, code indicators and a transparent risk score. Extension code is never executed; uploaded files are processed in the browser.",
    "",
    "## Key pages",
    "",
    `- [Home](${SITE.url}/en): Overview and embedded analyzer.`,
    `- [Analyzer](${SITE.url}/en/analyzer): Upload a package or fetch a public store URL.`,
    `- [Compare](${SITE.url}/en/compare): Compare two extension packages to see permission, domain and finding changes.`,
    `- [Methodology](${SITE.url}/en/methodology): Archive validation, detection rules, scoring weights and limits.`,
    `- [Topics](${SITE.url}/en/topics): In-depth hubs on extension privacy.`,
    `- [Guides](${SITE.url}/en/guides): How-to guides, comparisons and reference pages.`,
    `- [Disclaimer](${SITE.url}/en/disclaimer): What a static report can and cannot prove.`,
    `- [Privacy policy](${SITE.url}/en/privacy): Local processing, store fetching and cookies.`,
    "",
    "## Scoring summary",
    "",
    "The 0-100 risk score combines six weighted categories: permission exposure (25%), website access (20%), data-collection indicators (15%), remote-code indicators (20%), external-domain exposure (10%) and source obfuscation (10%). Bands: 0-24 low, 25-49 moderate, 50-74 high, 75-100 critical. The score is not a malware verdict.",
    "",
    "## Topic hubs",
    "",
  ];

  for (const hub of hubPages) {
    lines.push(`- [${hub.h1}](${SITE.url}/en${routeFor(hub)}): ${hub.description}`);
  }

  lines.push("", "## Articles", "");

  for (const page of keywordPages) {
    lines.push(`- [${page.h1}](${SITE.url}/en${routeFor(page)}): ${page.description}`);
  }

  lines.push(
    "",
    "## Languages",
    "",
    "The interface and the home/analyzer pages are available in English, Spanish, French, German, Italian, Portuguese, Dutch, Polish, Turkish, Arabic, Urdu and Hindi. Long-form articles are maintained in English and marked as English-only.",
    "",
    "## Use and attribution",
    "",
    `You may quote short excerpts with a link to the source page. Do not present a generated report as an official audit or endorsement. Contact: ${SITE.email}`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

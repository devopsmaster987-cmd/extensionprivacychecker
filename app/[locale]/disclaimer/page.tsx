import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
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
    path: "/disclaimer",
    title: `${messages["footer.disclaimer"]} - ${messages["meta.siteName"]}`,
    description:
      "What a static extension report can and cannot prove, and why a risk score is not a malware verdict.",
  });
}

export default async function DisclaimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <LegalShell
      locale={locale}
      path="/disclaimer"
      eyebrow="Legal"
      title="Disclaimer"
      intro="A static analysis report describes what is present in an extension package. It does not describe what the extension did on any device."
    >
      <h2>Not a malware verdict</h2>
      <p>
        The risk score is a transparent summary of static indicators such as requested permissions,
        host access, JavaScript patterns and referenced domains. A high score can come from
        legitimate broad functionality, and a low score does not guarantee that an extension is safe.
        Do not treat a score as a certification, reputation signal or official security assessment.
      </p>

      <h2>Static analysis limits</h2>
      <ul>
        <li>Code is read, never executed, so runtime behavior is not observed.</li>
        <li>Referenced domains are not proof that the extension contacted them.</li>
        <li>Permissions describe capability, not actual use of that capability.</li>
        <li>Minified, generated or bundled code can hide intent or produce misleading indicators.</li>
        <li>Server-side code, store updates and future versions are outside the analyzed package.</li>
        <li>Limits on file size, entry count and scanned bytes mean some content may be skipped.</li>
      </ul>

      <h2>Evidence and confidence</h2>
      <p>
        Findings show the matched evidence, a confidence level and an explanation. A medium or low
        confidence finding may be a false positive, especially in third-party libraries. Always read
        the evidence rather than relying on a single label.
      </p>

      <h2>Store data</h2>
      <p>
        Store descriptions, ratings and developer claims are not verified by this tool. A store
        listing can change after a package is analyzed. The analyzed package may not be the version
        currently offered to every user or region.
      </p>

      <h2>Your responsibility</h2>
      <p>
        Installing an extension is your decision. Consider the developer, the permission request,
        the store listing and independent reviews alongside this report. If an extension handles
        sensitive accounts or data, prefer a manual review by a qualified professional.
      </p>

      <h2>No warranty</h2>
      <p>
        The service is provided without warranties of any kind. We are not liable for decisions made
        in reliance on a report, to the extent permitted by law.
      </p>
    </LegalShell>
  );
}

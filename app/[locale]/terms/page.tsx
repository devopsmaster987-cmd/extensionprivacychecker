import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
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
    path: "/terms",
    title: `${messages["footer.terms"]} - ${messages["meta.siteName"]}`,
    description:
      "Terms of use for the free Extension Privacy Checker static analysis tool, including acceptable use and limitations.",
  });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <LegalShell
      locale={locale}
      path="/terms"
      eyebrow="Legal"
      title="Terms of use"
      intro="These terms govern your use of the Extension Privacy Checker website and analyzer."
    >
      <h2>Acceptance</h2>
      <p>
        By using this website you agree to these terms. If you do not agree, do not use the service.
      </p>

      <h2>The service</h2>
      <p>
        Extension Privacy Checker provides free static analysis of browser extension packages and
        explanatory content. The service is provided as-is, without a service-level commitment. We
        may change, suspend or discontinue any part of the site at any time.
      </p>

      <h2>No security guarantee</h2>
      <p>
        Results are estimates based on static indicators. They are not a malware verdict, a security
        audit, a legal opinion or a guarantee that an extension is safe or unsafe. You remain
        responsible for your own installation and browsing decisions.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not use the store endpoint to scrape, mirror or overload store services.</li>
        <li>Do not attempt to bypass rate limits, security controls or access restrictions.</li>
        <li>Do not use the service to distribute malware or to process content you are not allowed to access.</li>
        <li>Do not misrepresent a generated report as an official audit or endorsement.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        Site design, original text and the analyzer implementation are protected by applicable law.
        Extension packages you analyze remain the property of their respective owners. Third-party
        names such as Chrome, Edge and Firefox are trademarks of their owners and are used only for
        identification.
      </p>

      <h2>Third-party services</h2>
      <p>
        Optional store retrieval relies on official store endpoints. Your use of those stores is also
        governed by their own terms. We are not responsible for third-party availability, content or
        policies.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, we are not liable for indirect, incidental or
        consequential damages, or for decisions made in reliance on a report. Nothing in these terms
        excludes liability that cannot legally be excluded.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. The date at the top of this page shows the latest revision.
        Continued use after a change constitutes acceptance of the revised terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </LegalShell>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, ShieldAlert } from "lucide-react";
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
    path: "/contact",
    title: `${messages["footer.contact"]} - ${messages["meta.siteName"]}`,
    description:
      "Contact Extension Privacy Checker for corrections, false-positive reports, responsible disclosure or general questions.",
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <LegalShell
      locale={locale}
      path="/contact"
      eyebrow="Contact"
      title="Contact us"
      intro="Questions, corrections and responsible disclosure are welcome. We do not provide a guarantee that any extension is safe."
    >
      <div className="not-prose rounded-2xl border border-teal-200 bg-teal-50/60 p-5">
        <p className="flex items-center gap-2 text-sm font-bold text-teal-950">
          <Mail aria-hidden="true" className="h-4 w-4" />
          Email
        </p>
        <a
          href={`mailto:${SITE.email}`}
          className="mt-2 inline-block break-all text-lg font-semibold text-teal-800 underline decoration-teal-300 underline-offset-2"
        >
          {SITE.email}
        </a>
        <p className="mt-2 text-xs text-teal-900/80">We aim to reply within five business days.</p>
      </div>

      <h2>Reporting a problem with a report</h2>
      <p>
        To help us reproduce an issue, include the extension name and version, the store URL or file
        type, the finding or score you believe is wrong, and the evidence shown in the report. Do not
        send a full package unless requested; a link to the public store listing is usually enough.
      </p>

      <h2>Responsible disclosure</h2>
      <p>
        If you believe the site or API has a security issue, contact us before publishing details.
        Include steps to reproduce and the impact you observed. Please do not access other users&apos;
        data, disrupt the service or run destructive tests.
      </p>

      <div className="not-prose mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="flex items-center gap-2 text-sm font-bold text-amber-950">
          <ShieldAlert aria-hidden="true" className="h-4 w-4" />
          What we cannot do
        </p>
        <p className="mt-2 text-sm leading-6 text-amber-900">
          We cannot verify that an extension is safe, remove store listings, or provide legal or
          security certification. For suspected malware, report the extension to the relevant browser
          store and, where appropriate, to the relevant authorities.
        </p>
      </div>

      <h2>Corrections to articles</h2>
      <p>
        Content pages are reviewed periodically. If a technical statement is inaccurate or out of
        date, send the page URL and the correction with a supporting source. Reviewed corrections
        update the &quot;last reviewed&quot; date on the page.
      </p>

      <h2>Privacy</h2>
      <p>
        Do not include passwords, authentication tokens or personal data in an email. Our handling of
        site data is described in the privacy policy.
      </p>
    </LegalShell>
  );
}

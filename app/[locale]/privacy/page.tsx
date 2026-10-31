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
    path: "/privacy",
    title: `${messages["footer.privacy"]} - ${messages["meta.siteName"]}`,
    description:
      "How Extension Privacy Checker handles extension files, store URLs, cookies and logs. Files are analyzed locally and are not uploaded.",
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <LegalShell
      locale={locale}
      path="/privacy"
      eyebrow="Legal"
      title="Privacy policy"
      intro="This policy explains what the analyzer handles, what stays in your browser, and the limited data that reaches our server."
    >
      <h2>Summary</h2>
      <ul>
        <li>Extension files you select are read locally in your browser. They are not uploaded to us.</li>
        <li>Reports are generated in the page and are not stored on a server.</li>
        <li>There are no accounts, advertising scripts or third-party analytics on this site.</li>
        <li>If you submit a store URL, our server fetches the public package from the official store and returns it to your browser. That request may appear in short-lived server or hosting logs.</li>
      </ul>

      <h2>Files you upload</h2>
      <p>
        When you choose a CRX, XPI, ZIP or manifest.json file, the file is read by JavaScript in your
        browser. Parsing and static analysis run in a Web Worker. The extension code is treated as
        data and is never executed. The file never leaves your device through this website.
      </p>
      <p>
        Reports and exports (JSON or PDF) are created in your browser. Closing or reloading the page
        removes them. We cannot access, restore or delete a report because we never receive it.
      </p>

      <h2>Store URL requests</h2>
      <p>
        The optional store feature sends the URL you paste to our server endpoint. The server checks
        that the URL belongs to an official Chrome Web Store, Microsoft Edge Add-ons or Firefox
        Add-ons host, downloads the public package, and returns it to your browser for local
        analysis. We do not keep a copy of the package or the resulting report. Standard technical
        logs from our hosting provider may record the request time, IP address, requested URL and
        response status for security and rate limiting. These logs are retained only as long as
        necessary for those purposes.
      </p>
      <p>
        Store fetching is rate limited. We may block abusive requests. If a store blocks automated
        retrieval, you can download the package yourself and upload it directly.
      </p>

      <h2>Cookies and local storage</h2>
      <p>
        We set a single cookie, <code>epc_locale</code>, to remember your interface language. It
        contains a language code and expires after one year. We do not use advertising cookies,
        cross-site tracking pixels or third-party analytics. Your browser may store normal technical
        data such as cached assets.
      </p>

      <h2>Server logs and security</h2>
      <p>
        Like most websites, our hosting provider processes standard request data to deliver pages and
        protect the service. Security headers are applied to pages and API responses. We do not sell
        personal data and we do not build user profiles.
      </p>

      <h2>Children</h2>
      <p>
        The tool is intended for a general audience and is not directed at children under 13. We do
        not knowingly collect personal information from children.
      </p>

      <h2>Your choices</h2>
      <p>
        You can avoid all server contact by uploading a package file instead of using a store URL.
        You can clear the locale cookie in your browser settings at any time. Because we do not hold
        reports, there is no stored analysis to request or delete.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes, the updated date at the top of this page will change. Material
        changes will be reflected in the published text of this policy.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </LegalShell>
  );
}

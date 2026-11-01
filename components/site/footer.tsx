import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { hubPages, keywordPages, contentRoutes } from "@/content/registry";
import { SITE } from "@/lib/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const topHubs = hubPages;
  const topKeywords = keywordPages.slice(0, 6);

  return (
    <footer className="no-print mt-20 border-t border-slate-200 bg-white">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white">
                <ShieldCheck aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="text-sm font-bold text-slate-900">{SITE.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">{messages["footer.tagline"]}</p>
            <p className="mt-4 text-xs leading-5 text-slate-500">{messages["footer.builtFor"]}</p>
          </div>

          <FooterColumn title={messages["footer.tool"]}>
            <FooterLink href={localizedPath(locale, "/analyzer")}>{messages["nav.analyzer"]}</FooterLink>
            <FooterLink href={localizedPath(locale, "/compare")}>{messages["nav.compare"]}</FooterLink>
            <FooterLink href={localizedPath(locale, "/methodology")}>{messages["nav.methodology"]}</FooterLink>
            {topHubs.map((hub) => (
              <FooterLink key={hub.slug} href={localizedPath(locale, contentRoutes.hub(hub.slug))}>
                {hub.primaryKeyword}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={messages["footer.resources"]}>
            <FooterLink href={localizedPath(locale, "/topics")}>{messages["common.viewAllTopics"]}</FooterLink>
            <FooterLink href={localizedPath(locale, "/learn")}>{messages["nav.learn"]}</FooterLink>
            <FooterLink href={localizedPath(locale, "/guides")}>{messages["common.viewAllGuides"]}</FooterLink>
            {topKeywords.slice(0, 5).map((page) => (
              <FooterLink key={page.slug} href={localizedPath(locale, contentRoutes.keyword(page.slug))}>
                {page.primaryKeyword}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={messages["footer.legal"]}>
            <FooterLink href={localizedPath(locale, "/about")}>{messages["footer.about"]}</FooterLink>
            <FooterLink href={localizedPath(locale, "/contact")}>{messages["footer.contact"]}</FooterLink>
            <FooterLink href={localizedPath(locale, "/privacy")}>{messages["footer.privacy"]}</FooterLink>
            <FooterLink href={localizedPath(locale, "/terms")}>{messages["footer.terms"]}</FooterLink>
            <FooterLink href={localizedPath(locale, "/disclaimer")}>{messages["footer.disclaimer"]}</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-xs leading-5 text-slate-500">
          <p>
            © {new Date().getFullYear()} {SITE.name}. {messages["footer.notAffiliated"]}
          </p>
          <p className="mt-2">{messages["footer.englishOnly"]}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm text-slate-600">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="inline-block hover:text-teal-800 hover:underline">
        {children}
      </Link>
    </li>
  );
}

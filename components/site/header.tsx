import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getMessages, type MessageKey } from "@/lib/i18n";
import { buttonVariants } from "@/components/ui/button";
import { LanguageSelector } from "./language-selector";
import { MobileMenu } from "./mobile-menu";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { key: MessageKey; path: string }[] = [
  { key: "nav.analyzer", path: "/analyzer" },
  { key: "nav.compare", path: "/compare" },
  { key: "nav.topics", path: "/topics" },
  { key: "nav.learn", path: "/learn" },
  { key: "nav.guides", path: "/guides" },
  { key: "nav.methodology", path: "/methodology" },
];

export function SiteHeader({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);

  return (
    <header className="no-print sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link href={localizedPath(locale)} className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold leading-tight text-slate-900 sm:text-base">
              Extension Privacy Checker
            </span>
            <span className="hidden text-[11px] text-slate-500 sm:block">
              {messages["meta.tagline"]}
            </span>
          </span>
        </Link>

        <nav aria-label={messages["nav.main"]} className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={localizedPath(locale, item.path)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
            >
              {messages[item.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelector locale={locale} label={messages["common.language"]} />
          <Link
            href={localizedPath(locale, "/analyzer")}
            className={cn(buttonVariants({ size: "sm" }), "hidden md:inline-flex")}
          >
            {messages["nav.analyzer"]}
          </Link>
          <MobileMenu
            label={messages["nav.openMenu"]}
            navLabel={messages["nav.mobile"]}
            items={[
              ...NAV_ITEMS,
              { key: "nav.about" as MessageKey, path: "/about" },
              { key: "nav.contact" as MessageKey, path: "/contact" },
            ].map((item) => ({
              href: localizedPath(locale, item.path),
              label: messages[item.key],
            }))}
          />
        </div>
      </div>

      <nav aria-label={messages["nav.mobile"]} className="border-t border-slate-100 lg:hidden">
        <div className="container-page flex items-center gap-1 overflow-x-auto py-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={localizedPath(locale, item.path)}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            >
              {messages[item.key]}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

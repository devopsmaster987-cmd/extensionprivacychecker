import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ContentPage } from "@/content/types";
import { routeFor } from "@/content/registry";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";

export function ContentCard({
  page,
  locale,
  compact = false,
}: {
  page: ContentPage;
  locale: Locale;
  compact?: boolean;
}) {
  const messages = getMessages(locale);
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <Badge variant={page.kind === "hub" ? "teal" : "default"}>
          {page.kind === "hub"
            ? messages["common.topic"]
            : page.intent === "guide"
              ? messages["common.guide"]
              : messages["common.article"]}
        </Badge>
      </div>
      <h3 className="text-base font-semibold leading-snug text-slate-900">
        <Link href={localizedPath(locale, routeFor(page))} className="hover:text-teal-800">
          {page.h1}
        </Link>
      </h3>
      {!compact && <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{page.description}</p>}
      <Link
        href={localizedPath(locale, routeFor(page))}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-800 hover:text-teal-900"
      >
        {messages["common.readMore"]}
        <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
      </Link>
    </article>
  );
}

import Link from "next/link";
import { Compass, SearchX } from "lucide-react";
import { defaultLocale, localizedPath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { buttonVariants } from "@/components/ui/button";

export default function LocaleNotFound() {
  const messages = getMessages(defaultLocale);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <SearchX aria-hidden="true" className="h-8 w-8" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
        {messages["legal.notFoundTitle"]}
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
        {messages["legal.notFoundBody"]}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href={localizedPath(defaultLocale)} className={buttonVariants({ variant: "default" })}>
          <Compass aria-hidden="true" className="h-4 w-4" />
          {messages["nav.home"]}
        </Link>
        <Link
          href={localizedPath(defaultLocale, "/analyzer")}
          className={buttonVariants({ variant: "outline" })}
        >
          {messages["nav.analyzer"]}
        </Link>
      </div>
    </div>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { locales, localeInfo, stripLocale, type Locale } from "@/lib/i18n/config";

export function LanguageSelector({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const router = useRouter();

  function change(next: Locale) {
    document.cookie = `epc_locale=${next}; path=/; max-age=31536000; samesite=lax`;
    const { rest } = stripLocale(pathname);
    router.push(`/${next}${rest}`);
  }

  return (
    <label className="relative inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-slate-700 shadow-sm">
      <span className="sr-only">{label}</span>
      <Languages aria-hidden="true" className="h-4 w-4 shrink-0" />
      <select
        key={locale}
        defaultValue={locale}
        onChange={(event) => change(event.target.value as Locale)}
        aria-label={label}
        className="max-w-[8.5rem] cursor-pointer appearance-none bg-transparent pe-4 text-xs font-semibold outline-none"
        dir={localeInfo[locale].dir}
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {localeInfo[code].name}
          </option>
        ))}
      </select>
      <span aria-hidden="true" className="pointer-events-none absolute end-1.5 text-[10px] text-slate-500">
        ▾
      </span>
    </label>
  );
}

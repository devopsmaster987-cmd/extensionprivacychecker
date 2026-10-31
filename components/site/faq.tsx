import type { FaqItem } from "@/content/types";

export function FaqList({
  items,
  title,
  lang,
}: {
  items: FaqItem[];
  title: string;
  lang?: string;
}) {
  return (
    <section aria-labelledby="faq-heading" className="mt-12" lang={lang}>
      <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      <div className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {items.map((item) => (
          <details key={item.question} className="group px-5 py-4">
            <summary className="summary-row flex items-start justify-between gap-4 text-start text-sm font-semibold text-slate-900">
              <span>{item.question}</span>
            </summary>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

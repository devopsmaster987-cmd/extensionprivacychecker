import { Info } from "lucide-react";

export function EnglishFallbackNotice({ text }: { text: string }) {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{text}</p>
    </div>
  );
}

import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  label,
}: {
  value: number;
  className?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-slate-200", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label={label}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

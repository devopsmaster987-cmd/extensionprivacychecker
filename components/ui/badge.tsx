import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-slate-200 bg-slate-100 text-slate-700",
        low: "border-emerald-200 bg-emerald-50 text-emerald-800",
        moderate: "border-amber-200 bg-amber-50 text-amber-800",
        high: "border-orange-200 bg-orange-50 text-orange-800",
        critical: "border-rose-200 bg-rose-50 text-rose-800",
        info: "border-sky-200 bg-sky-50 text-sky-800",
        outline: "border-slate-300 bg-white text-slate-700",
        teal: "border-teal-200 bg-teal-50 text-teal-800",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

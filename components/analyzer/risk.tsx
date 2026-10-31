import { Badge } from "@/components/ui/badge";
import type { RiskAssessment, Severity } from "@/lib/analyze/types";
import { cn } from "@/lib/utils";

export type BadgeVariant = "low" | "moderate" | "high" | "critical" | "info" | "default";

export function riskVariant(level: RiskAssessment["level"] | Severity): BadgeVariant {
  if (level === "critical") return "critical";
  if (level === "high") return "high";
  if (level === "moderate" || level === "medium") return "moderate";
  if (level === "low") return "low";
  return "info";
}

export function RiskBadge({
  level,
  label,
  className,
}: {
  level: RiskAssessment["level"] | Severity;
  label: string;
  className?: string;
}) {
  return (
    <Badge variant={riskVariant(level)} className={className}>
      {label}
    </Badge>
  );
}

const COLORS: Record<RiskAssessment["level"], string> = {
  low: "#059669",
  moderate: "#d97706",
  high: "#ea580c",
  critical: "#dc2626",
};

export function RiskGauge({
  score,
  level,
  label,
  outOfLabel,
}: {
  score: number;
  level: RiskAssessment["level"];
  label: string;
  outOfLabel: string;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(100, score)) / 100);
  const color = COLORS[level];

  return (
    <div className="relative flex h-40 w-40 shrink-0 items-center justify-center" role="img" aria-label={`${label}: ${score} ${outOfLabel}`}>
      <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={cn("text-4xl font-extrabold leading-none")} style={{ color }}>
          {score}
        </span>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {outOfLabel}
        </span>
        <span className="mt-1 text-xs font-bold" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  );
}

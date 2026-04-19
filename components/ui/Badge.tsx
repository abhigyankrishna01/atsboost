import type { ReactNode } from "react";
import { cn } from "./cn";

type Tone = "neutral" | "primary" | "success" | "danger" | "warning";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-muted text-ink-muted border-ink-faint",
  primary: "bg-primary-soft text-primary-ink border-primary/20",
  success: "bg-success-soft text-success-ink border-success/20",
  danger:  "bg-danger-soft text-danger-ink border-danger-border",
  warning: "bg-warning-soft text-warning-ink border-warning/30",
};

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-caption font-medium",
      TONES[tone],
      className
    )}>
      {children}
    </span>
  );
}

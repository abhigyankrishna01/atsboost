import type { ReactNode } from "react";
import { cn } from "./cn";

type Variant = "surface" | "muted" | "accent";
type Padding = "none" | "sm" | "md" | "lg";

interface CardProps {
  variant?: Variant;
  padding?: Padding;
  className?: string;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  surface: "bg-surface border border-ink-faint/70 shadow-sm",
  muted:   "bg-surface-muted border border-ink-faint/50",
  accent:  "bg-primary-soft border border-primary/20",
};

const PADDING: Record<Padding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8 sm:p-10",
};

export function Card({ variant = "surface", padding = "md", className, children }: CardProps) {
  return (
    <div className={cn("rounded-2xl", VARIANTS[variant], PADDING[padding], className)}>
      {children}
    </div>
  );
}

interface HeaderProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: HeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 mb-4", className)}>
      <div>
        {title && <h3 className="text-h3 text-ink">{title}</h3>}
        {subtitle && <p className="text-caption text-ink-subtle mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

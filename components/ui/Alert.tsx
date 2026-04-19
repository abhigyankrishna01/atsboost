import type { ReactNode } from "react";
import { cn } from "./cn";

type Variant = "danger" | "info" | "success" | "warning";

interface Props {
  variant?: Variant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const STYLES: Record<Variant, string> = {
  danger:  "bg-danger-soft  text-danger-ink  border-danger-border",
  info:    "bg-info-soft    text-info-ink    border-info-border",
  success: "bg-success-soft text-success-ink border-success/30",
  warning: "bg-warning-soft text-warning-ink border-warning/30",
};

const ICONS: Record<Variant, string> = {
  danger: "!", info: "i", success: "✓", warning: "!",
};

export function Alert({ variant = "info", title, children, className }: Props) {
  return (
    <div
      role={variant === "danger" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-lg border px-4 py-3 text-small animate-fade-in",
        STYLES[variant],
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex-shrink-0 w-5 h-5 mt-0.5 rounded-full flex items-center justify-center text-caption font-bold",
          variant === "danger" && "bg-danger text-white",
          variant === "info" && "bg-info text-white",
          variant === "success" && "bg-success text-white",
          variant === "warning" && "bg-warning text-white"
        )}
      >
        {ICONS[variant]}
      </span>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

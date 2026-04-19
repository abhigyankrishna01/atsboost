"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "./cn";
import { Spinner } from "./Spinner";

type Variant = "primary" | "purchase" | "secondary" | "ghost" | "pill";
type Size = "sm" | "md" | "lg" | "xl";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  active?: boolean; // for pill variant
}

const BASE =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-white shadow-glow hover:bg-primary-hover hover:shadow-lg rounded-md",
  purchase:
    "bg-purchase text-white shadow-glow-purchase hover:bg-purchase-hover hover:shadow-lg rounded-md",
  secondary:
    "bg-surface text-ink border border-ink-faint hover:border-ink-subtle hover:bg-surface-muted rounded-md",
  ghost:
    "bg-transparent text-ink-muted hover:text-ink hover:bg-surface-muted rounded-md",
  pill:
    "rounded-full border text-small px-3 py-1 font-medium data-[active=true]:bg-ink data-[active=true]:text-white data-[active=true]:border-ink data-[active=false]:bg-surface data-[active=false]:text-ink-muted data-[active=false]:border-ink-faint data-[active=false]:hover:border-ink-subtle",
};

const SIZES: Record<Size, string> = {
  sm: "text-small px-3 py-1.5",
  md: "text-small px-4 py-2",
  lg: "text-body px-5 py-2.5",
  xl: "text-body px-6 py-3.5",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", loading, leftIcon, rightIcon, fullWidth, active, disabled, className, children, ...rest },
  ref
) {
  const isPill = variant === "pill";
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      data-active={active}
      className={cn(
        BASE,
        VARIANTS[variant],
        !isPill && SIZES[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {loading ? <Spinner size="sm" /> : leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
});

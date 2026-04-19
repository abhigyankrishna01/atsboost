"use client";

import { forwardRef, useId, type TextareaHTMLAttributes, type ReactNode } from "react";
import { cn } from "./cn";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: ReactNode;
  error?: string;
  charCount?: boolean;
  monospace?: boolean;
  action?: ReactNode; // optional element rendered to the right of the label
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(function TextArea(
  { label, hint, error, charCount, monospace, action, id, className, value = "", ...rest },
  ref
) {
  const reactId = useId();
  const inputId = id || `ta-${reactId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-err` : undefined;
  const countId = charCount ? `${inputId}-count` : undefined;
  const describedBy = [hintId, countId, errorId].filter(Boolean).join(" ") || undefined;
  const length = typeof value === "string" ? value.length : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-small font-semibold text-ink">
          {label}
        </label>
        {action}
      </div>

      {hint && !error && (
        <p id={hintId} className="text-caption text-ink-subtle">{hint}</p>
      )}

      <textarea
        ref={ref}
        id={inputId}
        value={value}
        aria-describedby={describedBy}
        aria-invalid={!!error || undefined}
        className={cn(
          "w-full bg-surface border rounded-md px-4 py-3 text-small text-ink placeholder:text-ink-subtle resize-y transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:border-primary",
          error ? "border-danger-border" : "border-ink-faint hover:border-ink-subtle",
          monospace && "font-mono",
          className
        )}
        {...rest}
      />

      <div className="flex items-center justify-between min-h-[1rem]">
        <div>
          {error && (
            <p id={errorId} role="alert" className="text-caption text-danger-ink">
              {error}
            </p>
          )}
        </div>
        {charCount && (
          <p id={countId} className="text-caption text-ink-subtle tabular-nums">
            {length.toLocaleString()} chars
          </p>
        )}
      </div>
    </div>
  );
});

"use client";

import { useState } from "react";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/components/ui/cn";
import type { OptimizeResponse } from "@/lib/types";

type Step = "input" | "loading" | "result";
const STEPS: { key: Step; label: string }[] = [
  { key: "input", label: "Input" },
  { key: "loading", label: "Optimizing" },
  { key: "result", label: "Download" },
];

export default function OptimizePage() {
  const [step, setStep] = useState<Step>("input");
  const [result, setResult] = useState<OptimizeResponse | null>(null);

  function handleResult(data: unknown) {
    setResult(data as OptimizeResponse);
    setStep("result");
  }
  function handleLoading(loading: boolean) { if (loading) setStep("loading"); }
  function handleBack() { setResult(null); setStep("input"); }

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="max-w-3xl mx-auto px-5 py-12 sm:py-16">
      <div className="text-center mb-10">
        <h1 className="text-h1 text-ink mb-2">ATS Resume Optimizer</h1>
        <p className="text-small text-ink-muted">
          Paste your resume + job description · AI rewrites in ~30 seconds · $9.99 to download
        </p>
      </div>

      {/* Stepper */}
      <nav aria-label="Progress" className="flex items-center justify-center gap-2 mb-10">
        {STEPS.map((s, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <div key={s.key} className="flex items-center gap-2">
              <div
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-caption font-medium transition-colors",
                  active && "bg-primary-soft text-primary-ink",
                  done && "text-success-ink",
                  !active && !done && "text-ink-subtle"
                )}
              >
                <span className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border",
                  active && "bg-primary text-white border-primary",
                  done && "bg-success text-white border-success",
                  !active && !done && "border-ink-faint text-ink-subtle"
                )}>
                  {done ? "✓" : i + 1}
                </span>
                {s.label}
              </div>
              {i < STEPS.length - 1 && (
                <span className={cn("w-6 h-px", done ? "bg-success/50" : "bg-ink-faint")} aria-hidden />
              )}
            </div>
          );
        })}
      </nav>

      <Card variant="surface" padding="lg" className="shadow-md">
        {step === "loading" && (
          <div className="py-20 text-center space-y-4 animate-fade-in">
            <div className="text-primary">
              <Spinner size="lg" label="Optimizing your resume" />
            </div>
            <p className="text-h3 text-ink">Optimizing your resume…</p>
            <p className="text-small text-ink-muted max-w-sm mx-auto">
              Claude is analyzing your resume against the job description.
              This usually takes 20–40 seconds.
            </p>
          </div>
        )}

        {step === "input" && (
          <ResumeForm onResult={handleResult} onLoading={handleLoading} loading={false} />
        )}

        {step === "result" && result && (
          <ResumePreview result={result} onBack={handleBack} />
        )}
      </Card>

      {step === "input" && (
        <div className="flex items-center justify-center gap-6 mt-6 text-caption text-ink-subtle">
          <span className="flex items-center gap-1.5"><span className="text-success">●</span> Secure & private</span>
          <span className="flex items-center gap-1.5"><span className="text-primary">●</span> Results in ~30s</span>
          <span className="flex items-center gap-1.5"><span className="text-warning">●</span> Pay only to download</span>
        </div>
      )}
    </div>
  );
}

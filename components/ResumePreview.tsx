"use client";

import { useState } from "react";
import type { OptimizeResponse } from "@/lib/types";
import { Button } from "./ui/Button";
import { Card, CardHeader } from "./ui/Card";
import { Alert } from "./ui/Alert";
import { Badge } from "./ui/Badge";
import { cn } from "./ui/cn";

interface Props {
  result: OptimizeResponse;
  onBack: () => void;
}

export default function ResumePreview({ result, onBack }: Props) {
  const { resume, improvements, keywordsAdded, atsScore } = result;
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setPaying(true);
    setError("");
    try {
      const id = crypto.randomUUID();
      localStorage.setItem(`resume_${id}`, JSON.stringify(resume));
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optimizeId: id }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Failed to start checkout.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      setPaying(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <Metric label="ATS Score" value={atsScore} tone={scoreTone(atsScore)} suffix="/100" emphasize />
        <Metric label="Keywords Added" value={keywordsAdded.length} tone="primary" />
        <Metric label="Improvements" value={improvements.length} tone="purchase" />
      </div>

      {/* What changed */}
      <Card variant="accent" padding="md">
        <div className="space-y-4">
          <div>
            <h3 className="text-h3 text-primary-ink mb-2">What changed</h3>
            <ul className="space-y-1.5">
              {improvements.map((imp, i) => (
                <li key={i} className="flex gap-2 text-small text-primary-ink/90">
                  <span className="text-primary mt-0.5" aria-hidden>✓</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-overline text-primary-ink/70 uppercase mb-2">Keywords Added</p>
            <div className="flex flex-wrap gap-1.5">
              {keywordsAdded.map((kw) => (
                <Badge key={kw} tone="primary">{kw}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Resume preview */}
      <Card variant="surface" padding="none" className="overflow-hidden">
        <CardHeader
          className="mb-0 px-5 py-3 border-b border-ink-faint/60 bg-surface-muted/60"
          title={<span className="text-small font-semibold">Resume Preview</span>}
          subtitle={<span className="text-caption">ATS-safe single-column layout</span>}
        />
        <div className="p-6 max-h-[560px] overflow-y-auto text-small text-ink leading-relaxed">
          {/* Header */}
          <div className="text-center pb-4 mb-4 border-b border-ink-faint">
            <p className="text-h2 font-bold uppercase tracking-wide">{resume.name}</p>
            <p className="text-caption text-ink-subtle mt-1">
              {[resume.contact.email, resume.contact.phone, resume.contact.location].filter(Boolean).join(" • ")}
            </p>
          </div>

          <Section title="Professional Summary">
            <p>{resume.summary}</p>
          </Section>

          <Section title="Professional Experience">
            {resume.experience.map((job, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <span className="font-bold text-ink">{job.title}</span>
                  <span className="text-caption text-ink-subtle tabular-nums">{job.startDate} – {job.endDate}</span>
                </div>
                <p className="text-small text-ink-muted italic">{job.company} — {job.location}</p>
                <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-small">
                  {job.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </Section>

          <Section title="Skills">
            <p className="text-small"><span className="font-semibold">Technical:</span> {resume.skills.technical.join(" • ")}</p>
            {resume.skills.soft?.length ? (
              <p className="text-small mt-1"><span className="font-semibold">Soft Skills:</span> {resume.skills.soft.join(" • ")}</p>
            ) : null}
          </Section>

          <Section title="Education">
            {resume.education.map((ed, i) => (
              <div key={i} className="flex justify-between items-baseline flex-wrap gap-1">
                <span><span className="font-bold">{ed.degree}</span> — {ed.school}, {ed.location}</span>
                <span className="text-caption text-ink-subtle">{ed.graduationYear}</span>
              </div>
            ))}
          </Section>

          {resume.certifications?.length ? (
            <Section title="Certifications">
              <p>{resume.certifications.join(" • ")}</p>
            </Section>
          ) : null}
        </div>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* CTA */}
      <div className="space-y-3">
        <Button variant="purchase" size="xl" fullWidth loading={paying} onClick={handleCheckout}>
          {paying ? "Redirecting to checkout…" : "Download PDF — $9.99"}
        </Button>
        <p className="text-center text-caption text-ink-subtle">
          Secure Stripe checkout · One-time fee · Instant download
        </p>
        <Button variant="ghost" size="md" fullWidth onClick={onBack}>
          ← Start over
        </Button>
      </div>
    </div>
  );
}

// ---------- internal helpers ----------

type MetricTone = "primary" | "purchase" | "success" | "warning" | "danger";
const METRIC_COLOR: Record<MetricTone, string> = {
  primary: "text-primary",
  purchase: "text-purchase",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

function Metric({ label, value, tone, emphasize, suffix }: { label: string; value: number; tone: MetricTone; emphasize?: boolean; suffix?: string }) {
  return (
    <div className={cn(
      "rounded-xl bg-surface border border-ink-faint/70 p-4 text-center transition-shadow hover:shadow-sm",
      emphasize && "bg-gradient-to-b from-surface to-surface-muted"
    )}>
      <p className={cn("text-h1 font-bold tabular-nums", METRIC_COLOR[tone])}>
        {value}{suffix && <span className="text-h3 text-ink-subtle font-medium ml-0.5">{suffix}</span>}
      </p>
      <p className="text-caption text-ink-subtle mt-1">{label}</p>
    </div>
  );
}

function scoreTone(score: number): MetricTone {
  if (score >= 85) return "success";
  if (score >= 70) return "warning";
  return "danger";
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <h3 className="text-overline uppercase text-ink border-b border-ink-faint pb-1 mb-2">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

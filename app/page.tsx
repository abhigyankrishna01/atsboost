import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    icon: "✦",
    title: "AI-Powered Rewrite",
    body: "Claude analyzes your resume against the job posting and rewrites every bullet to mirror the exact keywords recruiters search for.",
  },
  {
    icon: "◎",
    title: "ATS Score & Gap Analysis",
    body: "See your ATS compatibility score before and after, plus a complete list of missing keywords that were incorporated.",
  },
  {
    icon: "◆",
    title: "Clean ATS-Safe PDF",
    body: "Single-column, font-clean PDF that passes every major ATS parser. No tables, no graphics, no parsing errors.",
  },
  {
    icon: "⚡",
    title: "60-Second Turnaround",
    body: "No account, no setup. Paste, click, download. Your optimized resume is ready in under a minute.",
  },
];

const STEPS = [
  { n: "01", title: "Paste your resume", desc: "Copy-paste your current resume text, or drop in a PDF." },
  { n: "02", title: "Add the job posting", desc: "Paste the full job description you're targeting." },
  { n: "03", title: "AI optimizes instantly", desc: "Claude rewrites every bullet with matched keywords and measurable impact." },
  { n: "04", title: "Download your PDF", desc: "Pay $9.99 and instantly download your ATS-optimized resume." },
];

export default function LandingPage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-mesh" aria-hidden />
        <div className="absolute inset-0 bg-grain opacity-60" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-5 pt-20 pb-24 text-center">
          <Badge tone="primary" className="mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" /> Powered by Claude AI
          </Badge>

          <h1 className="text-display text-ink mb-6 animate-fade-in">
            Your resume gets rejected <br className="hidden sm:inline" />
            <span className="font-display italic text-primary">before</span> a human reads it.
          </h1>

          <p className="text-body text-ink-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            75% of resumes are filtered out by applicant tracking systems. ResumeAI rewrites yours to match the exact keywords and structure recruiters — and their bots — are looking for.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link href="/optimize">
              <Button variant="primary" size="xl" rightIcon={<span aria-hidden>→</span>}>
                Optimize My Resume — Free Preview
              </Button>
            </Link>
          </div>
          <p className="text-caption text-ink-subtle mt-4">
            No account needed · $9.99 one-time for PDF download
          </p>

          {/* Proof strip */}
          <div className="mt-14 inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-caption text-ink-subtle">
            <span className="flex items-center gap-1.5"><span className="text-success">●</span> 3× more interview callbacks</span>
            <span className="flex items-center gap-1.5"><span className="text-primary">●</span> Beats Greenhouse, Workday, Lever</span>
            <span className="flex items-center gap-1.5"><span className="text-warning">●</span> &lt; 60 second turnaround</span>
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="max-w-5xl mx-auto px-5 py-24">
        <div className="text-center mb-14">
          <p className="text-overline text-primary uppercase mb-2">Features</p>
          <h2 className="text-h1 text-ink">Everything you need to get past the bots</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {FEATURES.map((f) => (
            <Card key={f.title} variant="surface" padding="md" className="group transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="w-10 h-10 mb-4 rounded-lg bg-primary-soft text-primary flex items-center justify-center text-lg font-semibold group-hover:bg-primary group-hover:text-white transition-colors">
                {f.icon}
              </div>
              <h3 className="text-h3 text-ink mb-1.5">{f.title}</h3>
              <p className="text-small text-ink-muted leading-relaxed">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="bg-surface border-y border-ink-faint/60 py-24">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-overline text-primary uppercase mb-2">How it works</p>
            <h2 className="text-h1 text-ink">Four steps to a better resume</h2>
          </div>
          <ol className="space-y-2">
            {STEPS.map((s, i) => (
              <li key={s.n} className="flex gap-5 items-start group rounded-xl p-4 hover:bg-surface-subtle transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white flex items-center justify-center font-bold tabular-nums text-small shadow-glow">
                  {s.n}
                </div>
                <div className="pt-1">
                  <h3 className="text-h3 text-ink">{s.title}</h3>
                  <p className="text-small text-ink-muted mt-1">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block ml-auto self-center text-ink-faint" aria-hidden>→</div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Bottom CTA ---------- */}
      <section className="max-w-2xl mx-auto px-5 py-24 text-center">
        <h2 className="text-h1 text-ink mb-4">Ready to land more interviews?</h2>
        <p className="text-body text-ink-muted mb-8">
          60 seconds, no account. Free preview, then $9.99 to download.
        </p>
        <Link href="/optimize">
          <Button variant="primary" size="xl" rightIcon={<span aria-hidden>→</span>}>
            Get Started — It&apos;s Free to Preview
          </Button>
        </Link>
      </section>
    </>
  );
}

"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ResumeData } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";

type Status = "verifying" | "downloading" | "done" | "error";

export default function SuccessPage() {
  return (
    <Suspense fallback={<Wrapper><LoadingCard message="Loading…" /></Wrapper>}>
      <SuccessInner />
    </Suspense>
  );
}

function SuccessInner() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const optimizeId = params.get("oid");

  const [status, setStatus] = useState<Status>("verifying");
  const [error, setError] = useState("");
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current || !sessionId || !optimizeId) return;
    hasFired.current = true;

    const resume = getResumeFromStorage(optimizeId);
    if (!resume) {
      setError("Resume data not found. Please go back and optimize your resume again.");
      setStatus("error");
      return;
    }
    downloadPdf(sessionId, resume);
  }, [sessionId, optimizeId]);

  async function downloadPdf(sid: string, resume: ResumeData) {
    try {
      setStatus("downloading");
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, resume }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "PDF generation failed.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.name.replace(/\s+/g, "_")}_ATS_Resume.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      localStorage.removeItem(`resume_${optimizeId}`);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (!sessionId || !optimizeId) {
    return (
      <Wrapper>
        <ErrorCard message="Invalid link. Please complete checkout from the optimizer." />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {status === "verifying" && <LoadingCard message="Verifying your payment…" />}
      {status === "downloading" && <LoadingCard message="Generating your PDF…" sub="This takes about 15 seconds." />}
      {status === "done" && <DoneCard />}
      {status === "error" && <ErrorCard message={error} />}
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-lg mx-auto px-5 py-24">
      <Card variant="surface" padding="lg" className="shadow-md animate-fade-in">
        {children}
      </Card>
    </div>
  );
}

function LoadingCard({ message, sub }: { message: string; sub?: string }) {
  return (
    <div className="text-center space-y-4 py-6">
      <div className="text-primary">
        <Spinner size="lg" label={message} />
      </div>
      <p className="text-h3 text-ink">{message}</p>
      {sub && <p className="text-small text-ink-subtle">{sub}</p>}
    </div>
  );
}

function DoneCard() {
  return (
    <div className="text-center space-y-5 py-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-purchase-soft text-purchase flex items-center justify-center text-3xl shadow-glow-purchase">
        ✓
      </div>
      <h1 className="text-h1 text-ink">Your resume is downloaded</h1>
      <p className="text-small text-ink-muted">
        Check your Downloads folder for your ATS-optimized PDF.
      </p>
      <Alert variant="info" title="Tips for the best results">
        <ul className="list-disc list-inside space-y-0.5 mt-1">
          <li>Submit the PDF directly — don&apos;t convert to Word</li>
          <li>Customize the summary for each application</li>
          <li>Re-optimize for each new job posting</li>
        </ul>
      </Alert>
      <Button variant="primary" size="lg" fullWidth onClick={() => (window.location.href = "/optimize")} rightIcon={<span aria-hidden>→</span>}>
        Optimize another resume
      </Button>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="text-center space-y-5 py-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-danger-soft text-danger flex items-center justify-center text-3xl">
        !
      </div>
      <h1 className="text-h1 text-ink">Something went wrong</h1>
      <p className="text-small text-ink-muted">{message}</p>
      <Button variant="secondary" size="lg" fullWidth onClick={() => (window.location.href = "/optimize")}>
        ← Back to optimizer
      </Button>
    </div>
  );
}

function getResumeFromStorage(optimizeId: string): ResumeData | null {
  try {
    const raw = localStorage.getItem(`resume_${optimizeId}`);
    return raw ? (JSON.parse(raw) as ResumeData) : null;
  } catch {
    return null;
  }
}

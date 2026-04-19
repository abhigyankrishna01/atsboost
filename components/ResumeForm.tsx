"use client";

import { useRef, useState } from "react";
import { Button } from "./ui/Button";
import { TextArea } from "./ui/TextArea";
import { Alert } from "./ui/Alert";

interface Props {
  onResult: (result: unknown) => void;
  onLoading: (loading: boolean) => void;
  loading: boolean;
}

export default function ResumeForm({ onResult, onLoading, loading }: Props) {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [inputMode, setInputMode] = useState<"paste" | "upload">("paste");
  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadStatus("Parsing PDF…");
    setError("");

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/parse-pdf", { method: "POST", body: form });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to parse PDF.");
      setUploadStatus("");
      return;
    }

    setResumeText(data.text);
    setUploadStatus(`✓ Extracted ${data.text.length.toLocaleString()} characters`);
    setInputMode("paste");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!resumeText.trim()) return setError("Please provide your resume.");
    if (!jobDescription.trim()) return setError("Please paste the job description.");

    onLoading(true);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Optimization failed.");
      onResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      onLoading(false);
    }
  }

  const modeToggle = (
    <div role="tablist" aria-label="Resume input mode" className="flex gap-1.5">
      <Button
        type="button"
        variant="pill"
        role="tab"
        aria-selected={inputMode === "paste"}
        active={inputMode === "paste"}
        onClick={() => setInputMode("paste")}
      >
        Paste Text
      </Button>
      <Button
        type="button"
        variant="pill"
        role="tab"
        aria-selected={inputMode === "upload"}
        active={inputMode === "upload"}
        onClick={() => { setInputMode("upload"); fileRef.current?.click(); }}
      >
        Upload PDF
      </Button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        className="sr-only"
        onChange={handleFileUpload}
        aria-label="Upload resume PDF"
      />

      <TextArea
        label="Your Resume"
        hint={uploadStatus || "Paste your resume text, or upload a PDF to auto-extract"}
        action={modeToggle}
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="Paste your resume — work history, skills, education…"
        rows={11}
        monospace
        charCount
      />

      <TextArea
        label="Job Description"
        hint="Paste the complete job posting you're applying for"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the full job posting…"
        rows={9}
        charCount
      />

      {error && <Alert variant="danger">{error}</Alert>}

      <Button
        type="submit"
        variant="primary"
        size="xl"
        fullWidth
        loading={loading}
        rightIcon={!loading ? <span aria-hidden>→</span> : null}
      >
        {loading ? "Optimizing with AI…" : "Optimize My Resume"}
      </Button>
    </form>
  );
}

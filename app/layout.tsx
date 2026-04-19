import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "ResumeAI — ATS Resume Optimizer",
  description:
    "Paste your resume and the job posting. Our AI rewrites your resume to beat applicant tracking systems and land more interviews.",
  openGraph: {
    title: "ResumeAI — ATS Resume Optimizer",
    description: "AI-powered resume optimization that beats applicant tracking systems.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface-subtle min-h-screen font-sans text-ink text-body">
        <header className="sticky top-0 z-50 backdrop-blur-md bg-surface/80 border-b border-ink-faint/60">
          <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-ink font-bold tracking-tight">
              <span className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-primary-hover shadow-glow flex items-center justify-center text-white text-caption font-black">
                R
              </span>
              <span>ResumeAI</span>
            </Link>
            <Link href="/optimize">
              <Button variant="primary" size="sm" rightIcon={<span aria-hidden>→</span>}>
                Start Free
              </Button>
            </Link>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-ink-faint/60 mt-24 py-8 text-center text-caption text-ink-subtle">
          © {new Date().getFullYear()} ResumeAI · Built with Claude AI
        </footer>
      </body>
    </html>
  );
}

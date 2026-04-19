import { NextRequest, NextResponse } from "next/server";
import { optimizeResume } from "@/lib/claude";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText?.trim() || !jobDescription?.trim()) {
      return NextResponse.json(
        { error: "Resume text and job description are required." },
        { status: 400 }
      );
    }

    if (resumeText.length > 15_000 || jobDescription.length > 10_000) {
      return NextResponse.json(
        { error: "Input too long. Please trim your resume or job description." },
        { status: 400 }
      );
    }

    const result = await optimizeResume(resumeText, jobDescription);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Optimization failed.";
    console.error("[/api/optimize]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/stripe";
import { htmlToPdf } from "@/lib/pdf";
import { buildResumeHtml } from "@/lib/resume-template";
import type { ResumeData } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { sessionId, resume } = (await req.json()) as {
      sessionId: string;
      resume: ResumeData;
    };

    if (!sessionId || !resume) {
      return NextResponse.json(
        { error: "sessionId and resume data are required." },
        { status: 400 }
      );
    }

    const paid = await verifyPayment(sessionId);
    if (!paid) {
      return NextResponse.json(
        { error: "Payment not confirmed. Please complete checkout." },
        { status: 402 }
      );
    }

    const html = buildResumeHtml(resume);
    const pdfBuffer = await htmlToPdf(html);
    const body = new Uint8Array(pdfBuffer);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resume.name.replace(/\s+/g, "_")}_ATS_Resume.pdf"`,
        "Content-Length": body.byteLength.toString(),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF generation failed.";
    console.error("[/api/generate-pdf]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

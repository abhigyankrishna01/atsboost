import { NextRequest, NextResponse } from "next/server";
// Aliased in next.config.mjs to avoid pdf-parse loading test files at module time
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "A PDF file is required." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "PDF must be under 5 MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdfParse(buffer);
    const text = data.text?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. Try pasting your resume as text." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("[/api/parse-pdf]", err);
    return NextResponse.json({ error: "Failed to parse PDF." }, { status: 500 });
  }
}

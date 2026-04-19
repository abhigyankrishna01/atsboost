import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { optimizeId } = await req.json().catch(() => ({}));
    const id = optimizeId || uuidv4();

    const session = await createCheckoutSession(id);

    return NextResponse.json({ url: session.url, optimizeId: id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create checkout session.";
    console.error("[/api/create-checkout]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

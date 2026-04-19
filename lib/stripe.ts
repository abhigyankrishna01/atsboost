import Stripe from "stripe";

let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured.");
  _stripe = new Stripe(key, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  });
  return _stripe;
}

export async function createCheckoutSession(optimizeId: string) {
  const priceId = process.env.STRIPE_PRICE_ID;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!priceId) throw new Error("STRIPE_PRICE_ID is not configured.");
  if (!baseUrl) throw new Error("NEXT_PUBLIC_APP_URL is not configured.");

  return getStripe().checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { optimizeId },
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&oid=${optimizeId}`,
    cancel_url: `${baseUrl}/optimize`,
  });
}

export async function verifyPayment(sessionId: string): Promise<boolean> {
  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  return session.payment_status === "paid";
}

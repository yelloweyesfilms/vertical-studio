import { stripe } from "../../lib/stripe";
import { requireSub } from "../../lib/auth";

const RETURN_URL = process.env.NEXT_PUBLIC_URL
  ? `${process.env.NEXT_PUBLIC_URL}/app`
  : "https://studiovertical.app/app";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sub = await requireSub(req, res);
  if (!sub) return;
  const { customerId } = sub;

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: RETURN_URL,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

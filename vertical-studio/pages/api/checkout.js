import { stripe } from "../../lib/stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  const url = process.env.NEXT_PUBLIC_URL;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email || undefined,
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${url}/app?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${url}/?canceled=1`,
    allow_promotion_codes: true,
  });

  res.json({ url: session.url });
}

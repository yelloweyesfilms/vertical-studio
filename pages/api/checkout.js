import { stripe } from "../../lib/stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, plan } = req.body;
  const url = process.env.NEXT_PUBLIC_URL;
  const priceId = plan === "premium" ? process.env.STRIPE_PRICE_ID_PREMIUM : process.env.STRIPE_PRICE_ID;

  if (!priceId) return res.status(500).json({ error: "Plan non configuré" });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${url}/app?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}/?canceled=1`,
      allow_promotion_codes: true,
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error("checkout:", e.message);
    res.status(500).json({ error: "Erreur lors de la création de la session de paiement." });
  }
}

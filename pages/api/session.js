import { stripe } from "../../lib/stripe";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { session_id } = req.query;
  if (!session_id || typeof session_id !== "string") {
    return res.status(400).json({ error: "session_id requis" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ["line_items"] });
    if (session.payment_status !== "paid" && session.status !== "complete") {
      return res.status(402).json({ error: "Paiement incomplet" });
    }
    if (!session.customer) {
      return res.status(400).json({ error: "Aucun client associé à cette session" });
    }
    const priceId = session.line_items?.data[0]?.price?.id;
    const plan = priceId === process.env.STRIPE_PRICE_ID_PREMIUM ? "premium" : "standard";
    res.json({ customerId: session.customer, plan });
  } catch (e) {
    console.error("session.js:", e.message);
    res.status(500).json({ error: "Erreur lors de la vérification du paiement" });
  }
}

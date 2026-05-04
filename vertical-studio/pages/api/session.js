import { stripe } from "../../lib/stripe";

export default async function handler(req, res) {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: "session_id requis" });

  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return res.status(402).json({ error: "Paiement incomplet" });
  }

  res.json({ customerId: session.customer });
}

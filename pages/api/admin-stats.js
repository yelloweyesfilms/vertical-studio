import { stripe } from "../../lib/stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { token } = req.body || {};
  const adminToken = process.env.JETON_ADMIN;
  if (!adminToken || !token || token !== adminToken) {
    return res.status(401).json({ error: "Token invalide" });
  }

  try {
    const [subs, charges] = await Promise.all([
      stripe.subscriptions.list({ status: "active", limit: 100, expand: ["data.customer", "data.items.data.price"] }),
      stripe.charges.list({ limit: 10 }),
    ]);

    let standard = 0, premium = 0, mrr = 0;
    const abonnes = [];

    for (const sub of subs.data) {
      const priceId = sub.items.data[0]?.price?.id;
      const isPremium = priceId === process.env.STRIPE_PRICE_ID_PREMIUM;
      const amount = (sub.items.data[0]?.price?.unit_amount || 0) / 100;
      if (isPremium) premium++; else standard++;
      mrr += amount;
      abonnes.push({
        email: sub.customer?.email || "—",
        plan: isPremium ? "premium" : "standard",
        createdAt: sub.created,
        montant: amount,
        currency: sub.items.data[0]?.price?.currency || "eur",
      });
    }

    abonnes.sort((a, b) => b.createdAt - a.createdAt);

    return res.json({
      total: subs.data.length,
      standard,
      premium,
      mrr: Math.round(mrr * 100) / 100,
      abonnes: abonnes.slice(0, 50),
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

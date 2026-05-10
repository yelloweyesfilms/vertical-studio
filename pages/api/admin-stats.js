import { requireSub } from "../../lib/auth";
import { stripe } from "../../lib/stripe";
import { Redis } from "@upstash/redis";

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { token, days = 14 } = req.body || {};
  const adminToken = process.env.JETON_ADMIN;
  if (!adminToken || !token || token !== adminToken) {
    return res.status(401).json({ error: "Token invalide" });
  }

  const redis = getRedis();

  try {
    // Stripe stats
    const subs = await stripe.subscriptions.list({
      status: "active", limit: 100,
      expand: ["data.customer", "data.items.data.price"],
    });

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

    // Analytics Redis
    let analytics = { totaux: {}, jours: [] };
    if (redis) {
      const ACTIONS = ["bible", "script", "episodes", "traduction", "variations", "titres"];

      // Totaux
      const totalKeys = ACTIONS.map(a => `analytics:total:${a}`);
      const totalVals = await redis.mget(...totalKeys);
      const totaux = {};
      ACTIONS.forEach((a, i) => { totaux[a] = Number(totalVals[i] || 0); });

      // Par jour (derniers N jours)
      const today = new Date();
      const joursData = [];
      const dateKeys = [];
      const dates = [];

      for (let i = Number(days) - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        dates.push(dateStr);
        ACTIONS.forEach(a => dateKeys.push(`analytics:daily:${dateStr}:${a}`));
      }

      const dayVals = dateKeys.length > 0 ? await redis.mget(...dateKeys) : [];

      for (let i = 0; i < dates.length; i++) {
        const entry = { date: dates[i] };
        ACTIONS.forEach((a, j) => {
          entry[a] = Number(dayVals[i * ACTIONS.length + j] || 0);
        });
        entry.total = ACTIONS.reduce((s, a) => s + entry[a], 0);
        joursData.push(entry);
      }

      // Utilisateurs actifs aujourd'hui
      const todayStr = today.toISOString().slice(0, 10);
      const activeToday = await redis.scard(`analytics:users:${todayStr}`) || 0;
      totaux.activeToday = activeToday;

      analytics = { totaux, jours: joursData };
    }

    return res.json({
      total: subs.data.length, standard, premium,
      mrr: Math.round(mrr * 100) / 100,
      abonnes: abonnes.slice(0, 50),
      analytics,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

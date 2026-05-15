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

    let standard = 0, premium = 0, annuel = 0, mensuel = 0, mrr = 0;
    const abonnes = [];
    const PREMIUM_IDS = new Set([
      process.env.STRIPE_PRICE_ID_PREMIUM,
      process.env.STRIPE_PRICE_ID_PREMIUM_ANNUAL,
    ].filter(Boolean));
    for (const sub of subs.data) {
      const price = sub.items.data[0]?.price;
      const priceId = price?.id;
      const isPremium = PREMIUM_IDS.has(priceId);
      const isAnnual = price?.recurring?.interval === "year";
      const rawAmount = (price?.unit_amount || 0) / 100;
      const mrrAmount = isAnnual ? rawAmount / 12 : rawAmount;
      if (isPremium) premium++; else standard++;
      if (isAnnual) annuel++; else mensuel++;
      mrr += mrrAmount;
      abonnes.push({
        email: sub.customer?.email || "—",
        plan: isPremium ? "premium" : "standard",
        billing: isAnnual ? "annual" : "monthly",
        createdAt: sub.created,
        montant: rawAmount,
        mrrAmount,
        currency: price?.currency || "eur",
        status: sub.status,
        trialEnd: sub.trial_end,
      });
    }
    abonnes.sort((a, b) => b.createdAt - a.createdAt);
    const arr = Math.round(mrr * 12 * 100) / 100;

    // Analytics Redis
    let analytics = { totaux: {}, jours: [] };
    if (redis) {
      const ACTIONS = ["bible", "script", "episodes", "traduction", "variations", "titres", "poster"];

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

    // A/B test analytics from analytics:{YYYY-MM-DD} hashes
    let ab = { page_view: 0, page_view_A: 0, page_view_B: 0, checkout_started: 0, checkout_started_A: 0, checkout_started_B: 0, checkout_success: 0, jours: [] };
    if (redis) {
      const today2 = new Date();
      const abFields = ["page_view", "page_view:A", "page_view:B", "checkout_started", "checkout_started:A", "checkout_started:B", "checkout_success"];
      const abDates = [];
      for (let i = Number(days) - 1; i >= 0; i--) {
        const d = new Date(today2);
        d.setDate(d.getDate() - i);
        abDates.push(d.toISOString().slice(0, 10));
      }

      const abTotals = { page_view: 0, page_view_A: 0, page_view_B: 0, checkout_started: 0, checkout_started_A: 0, checkout_started_B: 0, checkout_success: 0 };
      const abJours = [];

      for (const dateStr of abDates) {
        const vals = await redis.hmget(`analytics:${dateStr}`, ...abFields);
        const entry = { date: dateStr };
        abFields.forEach((f, i) => {
          const key = f.replace(":", "_");
          entry[key] = Number(vals[i] || 0);
          abTotals[key] = (abTotals[key] || 0) + entry[key];
        });
        abJours.push(entry);
      }

      ab = { ...abTotals, jours: abJours };
    }

    // Newsletter
    let newsletter = { count: 0, emails: [] };
    if (redis) {
      newsletter.count = (await redis.scard("newsletter:emails")) || 0;
      newsletter.emails = (await redis.smembers("newsletter:emails")) || [];
    }

    return res.json({
      total: subs.data.length, standard, premium, annuel, mensuel,
      mrr: Math.round(mrr * 100) / 100,
      arr,
      abonnes: abonnes.slice(0, 50),
      analytics,
      ab,
      newsletter,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

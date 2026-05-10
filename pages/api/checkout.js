import { stripe } from "../../lib/stripe";
import { Redis } from "@upstash/redis";
import * as Sentry from "@sentry/nextjs";

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, plan, refCode } = req.body;
  const url = process.env.NEXT_PUBLIC_URL;
  const priceId = plan === "premium" ? process.env.STRIPE_PRICE_ID_PREMIUM : process.env.STRIPE_PRICE_ID;

  if (!priceId) return res.status(500).json({ error: "Plan non configuré" });

  // Valider le code parrainage si fourni
  let validRef = null;
  if (refCode) {
    const redis = getRedis();
    if (redis) {
      const normalized = refCode.trim().toUpperCase();
      const referrerId = await redis.get(`ref:code:${normalized}`);
      if (referrerId) validRef = { code: normalized, referrerId };
    }
  }

  try {
    const sessionParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${url}/app?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}/?canceled=1`,
      allow_promotion_codes: true,
    };

    // 30 jours offerts si code parrainage valide
    if (validRef) {
      sessionParams.subscription_data = { trial_period_days: 30 };
      sessionParams.metadata = { ref_code: validRef.code, referrer_id: validRef.referrerId };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Stocker le parrainage en attente
    if (validRef) {
      const redis = getRedis();
      if (redis) {
        await redis.set(`ref:pending:${session.id}`, JSON.stringify(validRef), { ex: 60 * 60 * 24 * 7 });
      }
    }

    res.json({ url: session.url });
  } catch (e) {
    Sentry.captureException(e);
    console.error("checkout:", e.message);
    res.status(500).json({ error: "Erreur lors de la création de la session de paiement." });
  }
}

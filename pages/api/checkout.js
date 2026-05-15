import { stripe } from "../../lib/stripe";
import { Redis } from "@upstash/redis";
import * as Sentry from "@sentry/nextjs";

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
}

const PRICE_MAP = {
  standard:         () => process.env.STRIPE_PRICE_ID,
  premium:          () => process.env.STRIPE_PRICE_ID_PREMIUM,
  standard_annual:  () => process.env.STRIPE_PRICE_ID_STANDARD_ANNUAL,
  premium_annual:   () => process.env.STRIPE_PRICE_ID_PREMIUM_ANNUAL,
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, plan = "standard", refCode, billing = "monthly", trial = false } = req.body;
  const url = process.env.NEXT_PUBLIC_URL;

  const planKey = billing === "annual" ? `${plan}_annual` : plan;
  const priceId = PRICE_MAP[planKey]?.() || PRICE_MAP[plan]?.();

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
      success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}${trial ? "&trial=1" : ""}`,
      cancel_url: `${url}/?canceled=1`,
      allow_promotion_codes: true,
      metadata: { plan, billing },
    };

    // Trial priorité : parrainage (30j) > essai gratuit (1j)
    if (validRef) {
      sessionParams.subscription_data = {
        trial_period_days: 30,
        metadata: { ref_code: validRef.code, referrer_id: validRef.referrerId },
      };
      sessionParams.metadata = { plan, billing, ref_code: validRef.code, referrer_id: validRef.referrerId };
    } else if (trial) {
      sessionParams.subscription_data = {
        trial_period_days: 1,
        trial_settings: { end_behavior: { missing_payment_method: "cancel" } },
      };
      sessionParams.payment_method_collection = "always";
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

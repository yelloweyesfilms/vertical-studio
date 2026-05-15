import { stripe } from "../../lib/stripe";
import * as Sentry from "@sentry/nextjs";

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

    if (trial) {
      sessionParams.subscription_data = {
        trial_period_days: 1,
        trial_settings: { end_behavior: { missing_payment_method: "cancel" } },
      };
      sessionParams.payment_method_collection = "always";
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url });
  } catch (e) {
    Sentry.captureException(e);
    console.error("checkout:", e.message);
    res.status(500).json({ error: "Erreur lors de la création de la session de paiement." });
  }
}

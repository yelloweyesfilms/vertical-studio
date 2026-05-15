import { stripe } from "../../lib/stripe";
import { buffer } from "micro";
import { Redis } from "@upstash/redis";
import { sendWelcomeEmail, sendReferralRewardEmail, sendCancelEmail } from "../../lib/email";
import * as Sentry from "@sentry/nextjs";

export const config = { api: { bodyParser: false } };

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
}

async function rewardReferrer(referrerId, plan) {
  try {
    const amount = plan === "premium" ? -1900 : -900;
    await stripe.customers.createBalanceTransaction(referrerId, {
      amount,
      currency: "eur",
      description: "Crédit parrainage — 1 mois offert",
    });
    const redis = getRedis();
    if (redis) await redis.incr(`ref:count:${referrerId}`);
    console.log("[parrainage] crédit appliqué au parrain:", referrerId, amount / 100, "€");

    // Email au parrain
    try {
      const referrer = await stripe.customers.retrieve(referrerId);
      if (referrer.email) {
        await sendReferralRewardEmail({ email: referrer.email, creditEuros: Math.abs(amount / 100) });
      }
    } catch (e) {
      console.error("[email] récupération parrain:", e.message);
    }
  } catch (e) {
    console.error("[parrainage] erreur récompense:", e.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  const obj = event.data.object;

  switch (event.type) {
    case "checkout.session.completed": {
      const email = obj.customer_details?.email || obj.customer_email;
      const plan = obj.metadata?.plan || "standard";
      const billing = obj.metadata?.billing || "monthly";

      // Email de bienvenue
      await sendWelcomeEmail({ email, plan });

      // Analytics
      try {
        const redis = getRedis();
        if (redis) {
          const date = new Date().toISOString().slice(0, 10);
          const suffix = plan === "premium" ? "_premium" : "_standard";
          const bSuffix = billing === "annual" ? "_annual" : "_monthly";
          await Promise.all([
            redis.incr(`analytics:total:checkout_success`),
            redis.hincrby(`analytics:${date}`, "checkout_success", 1),
            redis.incr(`analytics:total:checkout_success${suffix}`),
            redis.incr(`analytics:total:checkout_success${bSuffix}`),
          ]);
        }
      } catch (e) {
        console.error("[analytics] webhook:", e.message);
      }

      // Parrainage en attente
      const redis = getRedis();
      if (redis && obj.id) {
        const pending = await redis.get(`ref:pending:${obj.id}`);
        if (pending) {
          const { referrerId } = typeof pending === "string" ? JSON.parse(pending) : pending;
          await rewardReferrer(referrerId, plan);
          await redis.del(`ref:pending:${obj.id}`);
        }
      }
      console.log("[stripe] checkout complété:", obj.customer, email, plan, billing);
      break;
    }
    case "customer.subscription.deleted": {
      // Email de résiliation
      try {
        const customer = await stripe.customers.retrieve(obj.customer);
        if (customer.email) await sendCancelEmail({ email: customer.email });
      } catch (e) {
        console.error("[email] cancel:", e.message);
      }
      console.log("[stripe] abonnement résilié:", obj.customer);
      break;
    }
    case "customer.subscription.created":
      console.log("[stripe] nouvel abonné:", obj.customer, "status:", obj.status);
      break;
    case "customer.subscription.updated":
      console.log("[stripe] abonnement mis à jour:", obj.customer, "status:", obj.status);
      break;
    case "invoice.payment_failed":
      console.log("[stripe] paiement échoué:", obj.customer, "montant:", obj.amount_due);
      break;
    case "invoice.payment_succeeded":
      console.log("[stripe] paiement réussi:", obj.customer);
      break;
  }

  res.json({ received: true });
}

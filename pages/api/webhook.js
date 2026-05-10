import { stripe } from "../../lib/stripe";
import { buffer } from "micro";
import { Redis } from "@upstash/redis";

export const config = { api: { bodyParser: false } };

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
}

async function rewardReferrer(referrerId, plan) {
  try {
    const amount = plan === "premium" ? -1900 : -900; // crédit en centimes
    await stripe.customers.createBalanceTransaction(referrerId, {
      amount,
      currency: "eur",
      description: "Crédit parrainage — 1 mois offert",
    });
    const redis = getRedis();
    if (redis) await redis.incr(`ref:count:${referrerId}`);
    console.log("[parrainage] crédit appliqué au parrain:", referrerId, amount / 100, "€");
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
      // Vérifier si parrainage en attente
      const redis = getRedis();
      if (redis && obj.id) {
        const pending = await redis.get(`ref:pending:${obj.id}`);
        if (pending) {
          const { referrerId } = typeof pending === "string" ? JSON.parse(pending) : pending;
          const plan = obj.metadata?.plan || "standard";
          await rewardReferrer(referrerId, plan);
          await redis.del(`ref:pending:${obj.id}`);
        }
      }
      console.log("[stripe] checkout complété:", obj.customer);
      break;
    }
    case "customer.subscription.created":
      console.log("[stripe] nouvel abonné:", obj.customer, "status:", obj.status);
      break;
    case "customer.subscription.updated":
      console.log("[stripe] abonnement mis à jour:", obj.customer, "status:", obj.status);
      break;
    case "customer.subscription.deleted":
      console.log("[stripe] abonnement résilié:", obj.customer);
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

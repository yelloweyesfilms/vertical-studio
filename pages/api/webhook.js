import { stripe } from "../../lib/stripe";
import { buffer } from "micro";

export const config = { api: { bodyParser: false } };

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

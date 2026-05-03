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

  // Tu peux logger les événements ici ou envoyer des emails
  switch (event.type) {
    case "customer.subscription.created":
      console.log("Nouvel abonné:", event.data.object.customer);
      break;
    case "customer.subscription.deleted":
      console.log("Désabonnement:", event.data.object.customer);
      break;
    case "invoice.payment_failed":
      console.log("Paiement échoué:", event.data.object.customer);
      break;
  }

  res.json({ received: true });
}

// Vérifie qu'un customer Stripe a un abonnement actif
import { stripe } from "./stripe";

export async function checkSubscription(customerId) {
  if (!customerId) return false;
  try {
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    return subs.data.length > 0;
  } catch {
    return false;
  }
}

// Middleware API : vérifie le header Authorization: Bearer <customerId>
export async function requireSub(req, res) {
  const auth = req.headers.authorization || "";
  const customerId = auth.replace("Bearer ", "").trim();
  const ok = await checkSubscription(customerId);
  if (!ok) {
    res.status(401).json({ error: "Abonnement requis" });
    return null;
  }
  return customerId;
}

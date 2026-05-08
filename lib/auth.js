import { stripe } from "./stripe";

export async function getCustomerPlan(customerId) {
  if (!customerId) return null;
  try {
    const subs = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 1, expand: ["data.items.data.price"] });
    if (subs.data.length === 0) return null;
    const priceId = subs.data[0].items.data[0]?.price?.id;
    return priceId === process.env.STRIPE_PRICE_ID_PREMIUM ? "premium" : "standard";
  } catch {
    return null;
  }
}

export async function requireSub(req, res) {
  const auth = req.headers.authorization || "";
  const customerId = auth.replace("Bearer ", "").trim();
  const adminToken = process.env.JETON_ADMIN || process.env.NEXT_PUBLIC_JETON_ADMIN;
  if (adminToken && customerId === adminToken) return { customerId, plan: "premium" };
  const plan = await getCustomerPlan(customerId);
  if (!plan) {
    res.status(401).json({ error: "Abonnement requis" });
    return null;
  }
  return { customerId, plan };
}

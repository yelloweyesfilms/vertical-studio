import { getCustomerPlan } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const auth = req.headers.authorization || "";
  const customerId = auth.replace("Bearer ", "").trim();
  if (!customerId) return res.status(400).json({ error: "customerId requis" });

  const adminToken = process.env.JETON_ADMIN || process.env.NEXT_PUBLIC_JETON_ADMIN;
  if (adminToken && customerId === adminToken) {
    return res.json({ plan: "premium", active: true });
  }

  const plan = await getCustomerPlan(customerId);
  if (!plan) return res.json({ plan: null, active: false });
  return res.json({ plan, active: true });
}

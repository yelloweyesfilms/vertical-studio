import { requireSub } from "../../lib/auth";
import { Redis } from "@upstash/redis";

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
}

function makeCode(customerId) {
  return ("VS" + customerId.replace(/[^a-zA-Z0-9]/g, "").slice(-6)).toUpperCase();
}

export default async function handler(req, res) {
  const redis = getRedis();
  if (!redis) return res.status(503).json({ error: "Redis non configuré" });

  // GET : récupérer ou créer le code du user connecté
  if (req.method === "GET") {
    const sub = await requireSub(req, res);
    if (!sub) return;
    const { customerId } = sub;

    let code = await redis.get(`ref:customer:${customerId}`);
    if (!code) {
      code = makeCode(customerId);
      await redis.set(`ref:customer:${customerId}`, code);
      await redis.set(`ref:code:${code}`, customerId);
    }
    const count = (await redis.get(`ref:count:${customerId}`)) || 0;
    return res.json({ code, count: Number(count) });
  }

  // POST : valider un code (appelé avant checkout, retourne si valide)
  if (req.method === "POST") {
    const { code } = req.body || {};
    if (!code || typeof code !== "string") return res.status(400).json({ error: "Code manquant" });
    const normalized = code.trim().toUpperCase();
    const referrerId = await redis.get(`ref:code:${normalized}`);
    if (!referrerId) return res.status(404).json({ error: "Code invalide" });
    return res.json({ valid: true, code: normalized });
  }

  return res.status(405).end();
}

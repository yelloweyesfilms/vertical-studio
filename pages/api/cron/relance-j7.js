import { stripe } from "../../../lib/stripe";
import { sendRelanceJ7Email } from "../../../lib/email";
import { Redis } from "@upstash/redis";

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const redis = getRedis();
  const now = Math.floor(Date.now() / 1000);
  // Subscribers created between 7d+24h ago and 7d ago (24h window)
  const sevenDaysAgo = now - 7 * 86400;
  const eightDaysAgo = now - 8 * 86400;

  try {
    const subs = await stripe.subscriptions.list({
      status: "active",
      limit: 100,
      expand: ["data.customer"],
      created: { gte: eightDaysAgo, lte: sevenDaysAgo },
    });

    let sent = 0;
    const skipped = [];

    for (const sub of subs.data) {
      const email = sub.customer?.email;
      if (!email) continue;

      if (redis) {
        // Check if user has any recorded activity (any analytics:users key)
        const hasActivity = await checkUserActivity(redis, email);
        if (hasActivity) {
          skipped.push({ email, reason: "active" });
          continue;
        }

        // Deduplicate
        const key = `relance-j7:sent:${sub.id}`;
        const already = await redis.get(key);
        if (already) {
          skipped.push({ email, reason: "already-sent" });
          continue;
        }
        await redis.set(key, "1", { ex: 60 * 60 * 24 * 30 });
      }

      await sendRelanceJ7Email({ email });
      sent++;
    }

    return res.json({ ok: true, total: subs.data.length, sent, skipped: skipped.length });
  } catch (e) {
    console.error("[cron/relance-j7]", e.message);
    return res.status(500).json({ error: e.message });
  }
}

async function checkUserActivity(redis, email) {
  // Check last 14 days of analytics:users sets for this email
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const isMember = await redis.sismember(`analytics:users:${dateStr}`, email);
    if (isMember) return true;
  }
  return false;
}

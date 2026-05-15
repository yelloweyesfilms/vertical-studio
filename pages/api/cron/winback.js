import { stripe } from "../../../lib/stripe";
import { sendWinbackEmail } from "../../../lib/email";
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
  const windowStart = now - 86400; // last 24h

  try {
    // Fetch subscriptions cancelled in the last 24h
    const subs = await stripe.subscriptions.list({
      status: "canceled",
      limit: 100,
      expand: ["data.customer"],
    });

    const recent = subs.data.filter(
      (s) => s.canceled_at && s.canceled_at >= windowStart
    );

    let sent = 0;
    const skipped = [];

    for (const sub of recent) {
      const email = sub.customer?.email;
      if (!email) continue;

      // Deduplicate: skip if already sent a winback for this subscription
      if (redis) {
        const key = `winback:sent:${sub.id}`;
        const already = await redis.get(key);
        if (already) {
          skipped.push(email);
          continue;
        }
        await redis.set(key, "1", { ex: 60 * 60 * 24 * 30 }); // 30 days TTL
      }

      await sendWinbackEmail({ email });
      sent++;
    }

    return res.json({ ok: true, total: recent.length, sent, skipped: skipped.length });
  } catch (e) {
    console.error("[cron/winback]", e.message);
    return res.status(500).json({ error: e.message });
  }
}

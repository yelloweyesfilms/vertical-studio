import { Redis } from "@upstash/redis";

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
}

// Sliding window horaire : Standard 40/h, Premium 150/h
// Fail open si Redis non configuré
export async function checkRateLimit(customerId, plan) {
  const redis = getRedis();
  if (!redis) return { limited: false };

  const max = plan === "premium" ? 150 : 40;
  const hour = Math.floor(Date.now() / 3_600_000);
  const key = `rl:gen:${customerId}:${hour}`;

  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 7200);

  return { limited: count > max, count, max };
}

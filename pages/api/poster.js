import * as Sentry from "@sentry/nextjs";
import { requireSub } from "../../lib/auth";
import { Redis } from "@upstash/redis";

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sub = await requireSub(req, res);
  if (!sub) return;
  const { customerId } = sub;

  const { titre, logline, ambiance, personnages, mode, accroche, tension_centrale } = req.body || {};

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY non configuré" });
  }
  if (!titre || !logline) return res.status(400).json({ error: "titre et logline requis" });

  // Rate limit : 5 affiches par utilisateur par jour
  const redis = getRedis();
  if (redis) {
    const today = new Date().toISOString().slice(0, 10);
    const rateKey = `poster:rate:${customerId}:${today}`;
    const count = await redis.incr(rateKey);
    if (count === 1) await redis.expire(rateKey, 86400);
    if (count > 5) return res.status(429).json({ error: "Limite de 5 affiches par jour atteinte." });
  }

  const genreLabel = mode === "fast"
    ? "intense emotional drama, raw performances, high tension"
    : "psychological suspense thriller, cold atmosphere, deep shadows";

  const charDesc = (personnages || []).slice(0, 2)
    .map(p => `${p.nom} (${p.role})`)
    .join(" and ");

  const ambianceHint = ambiance || "";

  const prompt = [
    `Cinematic vertical movie poster, 9:16 portrait format.`,
    `Genre: ${genreLabel}.`,
    `Story: ${logline}`,
    charDesc ? `Lead characters: ${charDesc}.` : "",
    tension_centrale ? `Emotional core: ${tension_centrale}` : "",
    accroche ? `Tagline concept: ${accroche}` : "",
    ambianceHint ? `Visual atmosphere: ${ambianceHint}.` : "",
    `Style: professional Hollywood movie poster photography, dramatic cinematic lighting, deep blacks, film grain texture, moody color grading, photorealistic.`,
    `Composition: dramatic single-character or two-character shot, strong vertical framing, evocative background.`,
    `Important: NO text, NO typography, NO words, NO title, NO letters visible anywhere in the image.`,
  ].filter(Boolean).join(" ");

  try {
    const response = await fetch("https://api.openai.com/v1/images/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1792",
        quality: "standard",
        response_format: "b64_json",
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "OpenAI error");
    }

    const data = await response.json();
    const b64 = data.data[0].b64_json;

    // Track usage
    const redis = getRedis();
    if (redis) {
      const today = new Date().toISOString().slice(0, 10);
      await Promise.all([
        redis.incr(`analytics:daily:${today}:poster`),
        redis.incr(`analytics:total:poster`),
        redis.sadd(`analytics:users:${today}`, customerId),
      ]);
    }

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");
    res.send(Buffer.from(b64, "base64"));
  } catch (e) {
    Sentry.captureException(e);
    console.error("poster:", e.message);
    res.status(500).json({ error: e.message || "Erreur génération affiche" });
  }
}

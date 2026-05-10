import { requireSub } from "../../lib/auth";
import { Redis } from "@upstash/redis";

// Upstash Redis avec fallback silencieux si non configuré
function getKv() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  try {
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const sub = await requireSub(req, res);
  if (!sub) return;
  const { customerId } = sub;

  const kv = getKv();
  if (!kv) return res.status(503).json({ error: "Cloud storage non configuré" });

  const indexKey = `series_index:${customerId}`;

  if (req.method === "GET") {
    const index = (await kv.get(indexKey)) || [];
    return res.json({ series: index });
  }

  if (req.method === "POST") {
    const { bible, episodes, state } = req.body || {};
    if (!bible || !episodes) return res.status(400).json({ error: "Données manquantes" });

    const id = Date.now();
    const entry = { id, savedAt: new Date().toISOString(), bible, episodes, state };
    const serieKey = `serie:${customerId}:${id}`;
    await kv.set(serieKey, entry, { ex: 60 * 60 * 24 * 365 }); // 1 an

    const index = (await kv.get(indexKey)) || [];
    const newIndex = [
      { id, savedAt: entry.savedAt, titre: bible.titre, logline: bible.logline, mode: state?.mode, episodesCount: episodes.length },
      ...index,
    ].slice(0, 20);
    await kv.set(indexKey, newIndex, { ex: 60 * 60 * 24 * 365 });

    return res.json({ id });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID manquant" });
    await kv.del(`serie:${customerId}:${id}`);
    const index = (await kv.get(indexKey)) || [];
    await kv.set(indexKey, index.filter(s => String(s.id) !== String(id)), { ex: 60 * 60 * 24 * 365 });
    return res.json({ ok: true });
  }

  if (req.method === "PUT") {
    // Charger une série complète
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID manquant" });
    const serie = await kv.get(`serie:${customerId}:${id}`);
    if (!serie) return res.status(404).json({ error: "Série introuvable" });
    return res.json(serie);
  }

  return res.status(405).end();
}

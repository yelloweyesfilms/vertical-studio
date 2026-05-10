import { streamClaude } from "../../lib/anthropic";
import { requireSub } from "../../lib/auth";

export const config = { api: { responseLimit: false } };

const DUR_INSTR = {
  60: "Format 1 MINUTE: 4 à 5 échanges, max 20 mots par réplique, une seule révélation percutante.",
  90: "Format 1MIN30: 6 à 7 échanges, max 25 mots, montée progressive + retournement.",
  120: "Format 2 MINUTES: 8 à 10 échanges, deux temps forts, cliffhanger inattendu.",
};

const VALID_MODES = ["fast", "premium"];
const VALID_DUREES = [60, 90, 120];
const VALID_FORMATS = [10, 20, 40];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sub = await requireSub(req, res);
  if (!sub) return;
  const { plan } = sub;

  const { action, payload } = req.body || {};
  if (action !== "bible") return res.status(400).json({ error: "Seul l'action bible est streamable" });

  const { mode, casting, univers, secret, format, duree } = payload || {};
  if (!VALID_MODES.includes(mode)) return res.status(400).json({ error: "Mode invalide" });
  if (!VALID_DUREES.includes(duree)) return res.status(400).json({ error: "Durée invalide" });
  if (!VALID_FORMATS.includes(format)) return res.status(400).json({ error: "Format invalide" });
  if (plan === "standard" && mode === "premium") return res.status(403).json({ error: "Mode Premium réservé au plan Premium." });
  if (plan === "standard" && format > 10) return res.status(403).json({ error: "Le plan Standard est limité à 10 épisodes." });
  if (typeof casting !== "string" || casting.length > 100) return res.status(400).json({ error: "Casting invalide" });
  if (typeof univers !== "string" || univers.length > 100) return res.status(400).json({ error: "Univers invalide" });
  if (typeof secret !== "string" || secret.length > 100) return res.status(400).json({ error: "Secret invalide" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    const md = mode === "fast"
      ? "Fast Drama: viralité immédiate, émotions frontales, hooks agressifs, cliffhangers choc"
      : "Premium Suspense: tension psychologique, sous-texte, silences, réalisme";

    const result = await streamClaude(
      `Showrunner expert micro-dramas verticaux 9:16. ${md}. ${DUR_INSTR[duree]} JSON uniquement.`,
      `Bible. Casting: ${casting}. Univers: ${univers}. Secret: ${secret}. Format: ${format} épisodes.
JSON: {"titre":"","logline":"","pitch":"","personnages":[{"nom":"","age":25,"role":"","secret":""},{"nom":"","age":28,"role":"","secret":""}],"tension_centrale":""}`,
      1500,
      (chunk) => send({ chunk })
    );

    if (!result.titre) result.titre = result.title || result.name || "Série sans titre";
    if (!result.logline) result.logline = result.logLine || result.description || "";
    if (!result.pitch) result.pitch = result.synopsis || result.summary || "";
    if (!result.tension_centrale) result.tension_centrale = result.tension || result.central_tension || "";
    if (!result.personnages) result.personnages = result.characters || result.personages || [];
    result.titre = String(result.titre).slice(0, 199);
    result.logline = String(result.logline).slice(0, 499);

    send({ done: true, result });
  } catch (e) {
    send({ error: e.message });
  }

  res.end();
}

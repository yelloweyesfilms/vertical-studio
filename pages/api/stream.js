import { streamClaude } from "../../lib/anthropic";
import { requireSub } from "../../lib/auth";
import { checkRateLimit } from "../../lib/rateLimit";
import * as Sentry from "@sentry/nextjs";

export const config = { api: { responseLimit: false } };

const DUR_INSTR = {
  60: "DURÉE 1 MIN: 4-5 échanges, max 20 mots/réplique. Structure: CHOC d'ouverture → escalade → révélation unique → question sans réponse.",
  90: "DURÉE 1MIN30: 6-7 échanges, max 25 mots/réplique. Structure: hook → tension montante → faux pivot → vraie révélation → cliffhanger.",
  120: "DURÉE 2 MIN: 8-10 échanges, max 30 mots/réplique. Structure: hook → conflit → rebondissement mi-parcours → révélation → cliffhanger brutal.",
};

const VALID_MODES = ["fast", "premium"];
const VALID_DUREES = [60, 90, 120];
const VALID_FORMATS = [10, 20, 40];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sub = await requireSub(req, res);
  if (!sub) return;
  const { plan, customerId } = sub;

  const { limited, max } = await checkRateLimit(customerId, plan);
  if (limited) {
    return res.status(429).json({ error: `Limite atteinte (${max} générations/heure). Réessayez dans quelques minutes.` });
  }

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
      ? "Fast Drama: viralité immédiate, émotions explosives, hooks agressifs, cliffhangers choc"
      : "Premium Suspense: tension psychologique, sous-texte riche, silences éloquents, réalisme brut";

    const result = await streamClaude(
      `Tu es showrunner de micro-dramas 9:16 (TikTok, Reels, Shorts). ${md}. ${DUR_INSTR[duree]}
Titre: 2-4 mots, mystérieux, crée l'envie immédiate — jamais de sous-titre explicatif.
Logline: "[Personnage] cache [secret] jusqu'au jour où [déclencheur]" — 15 mots max, formule respectée.
Pitch: 3 lignes qui hookent un ado de 17 ans — commence par l'émotion, pas l'intrigue.
Secret de chaque personnage: doit CRÉER du conflit actif avec les autres, pas juste du backstory.
arc de chaque personnage: son évolution dramatique sur la série en 1 phrase ("passe de X à Y").
tension_centrale: la question dramatique unique qui traverse toute la série, commence par "Va-t-il/elle..." ou "Qui...".
accroche: 1 phrase choc de 10 mots max pour poster en légende TikTok — crée la curiosité immédiate.
JSON uniquement, aucun texte avant ou après.`,
      `Casting: ${casting}. Univers: ${univers}. Secret moteur: ${secret}. Série de ${format} épisodes.
JSON: {"titre":"","logline":"","pitch":"","personnages":[{"nom":"","age":25,"role":"","secret":"","arc":""},{"nom":"","age":28,"role":"","secret":"","arc":""}],"tension_centrale":"","accroche":""}`,
      1800,
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
    Sentry.captureException(e, { extra: { customerId, plan, mode, format } });
    send({ error: e.message });
  }

  res.end();
}

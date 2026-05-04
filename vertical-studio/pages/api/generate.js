import { callClaude } from "../../lib/anthropic";
import { requireSub } from "../../lib/auth";

const DUR_INSTR = {
  60: "Format 1 MINUTE: 4 à 5 échanges, max 20 mots par réplique, une seule révélation percutante.",
  90: "Format 1MIN30: 6 à 7 échanges, max 25 mots, montée progressive + retournement.",
  120: "Format 2 MINUTES: 8 à 10 échanges, deux temps forts, cliffhanger inattendu.",
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Vérifier l'abonnement
  const customerId = await requireSub(req, res);
  if (!customerId) return;

  const { action, payload } = req.body;

  try {
    if (action === "bible") {
      const { mode, casting, univers, secret, format, duree } = payload;
      const md = mode === "fast"
        ? "Fast Drama: viralité immédiate, émotions frontales, hooks agressifs, cliffhangers choc"
        : "Premium Suspense: tension psychologique, sous-texte, silences, réalisme";
      const result = await callClaude(
        `Showrunner expert micro-dramas verticaux 9:16. ${md}. ${DUR_INSTR[duree]} JSON uniquement.`,
        `Bible. Casting: ${casting}. Univers: ${univers}. Secret: ${secret}. Format: ${format} épisodes.
JSON: {"titre":"","logline":"","pitch":"","personnages":[{"nom":"","age":25,"role":"","secret":""},{"nom":"","age":28,"role":"","secret":""}],"tension_centrale":""}`,
        1500
      );
      return res.json(result);
    }

    if (action === "episodes") {
      const { titre, logline, mode, from, to, total } = payload;
      const md = mode === "fast"
        ? "Fast Drama: viralité immédiate, émotions frontales"
        : "Premium Suspense: tension psychologique, sous-texte";
      const tFrom = Math.max(1, Math.round(from * 10 / total));
      const tTo = Math.min(10, Math.round(to * 10 / total));
      const result = await callClaude(
        "Showrunner expert. JSON uniquement.",
        `Série "${titre}". ${logline}. Mode: ${md}. Épisodes ${from} à ${to} (sur ${total}), tension ${tFrom} à ${tTo}. Titres 3 mots max.
JSON: {"episodes":[{"numero":${from},"titre":"","cliffhanger":"","tension":${tFrom}}]}`,
        2500
      );
      return res.json(result);
    }

    if (action === "script") {
      const { ep, bible, mode, duree } = payload;
      const md = mode === "fast"
        ? "Fast Drama: émotions frontales, hooks agressifs, cliffhangers choc"
        : "Premium Suspense: sous-texte, silences, réalisme";
      const maxS = duree <= 60 ? 5 : duree <= 90 ? 7 : 10;
      const persos = (bible.personnages || []).map(p => `${p.nom} (${p.role})`).join(", ");
      const result = await callClaude(
        `Scénariste expert micro-dramas 9:16. ${DUR_INSTR[duree]} Mode: ${md}. JSON uniquement.`,
        `Script ép.${ep.numero} "${ep.titre}". Série: ${bible.titre}. Persos: ${persos}.
Cliffhanger: ${ep.cliffhanger}.
RÈGLES: hook 1 phrase choc, ${maxS} échanges max 25 mots, cliffhanger brutal, max 2 acteurs, gros plans 9:16.
JSON: {"hook_scene":{"texte":"","visuel_916":""},"scenes":[{"perso":"","dialogue":"","visuel_916":""}],"cliffhanger_scene":{"texte":"","visuel_916":"","label":""},"checklist":[""]}`,
        2000
      );
      return res.json(result);
    }

    if (action === "edit") {
      const { script, type, duree } = payload;
      const maxS = duree <= 60 ? 5 : duree <= 90 ? 7 : 10;
      const instr = {
        pimenter: `Intensifie. Chaque réplique choque. Max ${maxS} échanges. Même JSON.`,
        subtil: `Sous-texte fort, silences. Max ${maxS} échanges. Même JSON.`,
        simplifier: `Répliques courtes, 1 décor. Max ${maxS}. Même JSON.`,
      };
      const result = await callClaude(
        "Scénariste expert. JSON uniquement, même structure.",
        `${instr[type]}\n${JSON.stringify(script)}`,
        2000
      );
      return res.json(result);
    }

    res.status(400).json({ error: "Action inconnue" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

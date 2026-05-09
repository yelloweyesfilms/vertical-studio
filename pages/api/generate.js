import { callClaude } from "../../lib/anthropic";
import { requireSub } from "../../lib/auth";

// Rate limiting en mémoire : max 20 requêtes par minute par customerId
const rateLimitMap = new Map();
function isRateLimited(customerId) {
  const now = Date.now();
  const window = 60_000;
  const max = 20;
  const entry = rateLimitMap.get(customerId) || { count: 0, start: now };
  if (now - entry.start > window) {
    rateLimitMap.set(customerId, { count: 1, start: now });
    return false;
  }
  if (entry.count >= max) return true;
  entry.count++;
  rateLimitMap.set(customerId, entry);
  return false;
}

const VALID_ACTIONS = ["bible", "episodes", "script", "edit", "titres", "variations"];
const VALID_MODES = ["fast", "premium"];
const VALID_DUREES = [60, 90, 120];
const VALID_FORMATS = [10, 20, 40];
const VALID_EDIT_TYPES = ["pimenter", "subtil", "simplifier"];

function validatePayload(action, payload) {
  if (!payload || typeof payload !== "object") return "Payload invalide";
  if (action === "bible") {
    const { mode, casting, univers, secret, format, duree } = payload;
    if (!VALID_MODES.includes(mode)) return "Mode invalide";
    if (!VALID_DUREES.includes(duree)) return "Durée invalide";
    if (!VALID_FORMATS.includes(format)) return "Format invalide";
    if (mode === "fast" && format > 10) return "Le mode Fast est limité à 10 épisodes. Passez en Premium Suspense pour créer jusqu'à 40 épisodes.";
    if (typeof casting !== "string" || casting.length > 100) return "Casting invalide";
    if (typeof univers !== "string" || univers.length > 100) return "Univers invalide";
    if (typeof secret !== "string" || secret.length > 100) return "Secret invalide";
  } else if (action === "episodes") {
    const { titre, logline, mode, from, to, total } = payload;
    if (!VALID_MODES.includes(mode)) return "Mode invalide";
    if (typeof titre !== "string" || titre.length > 200) return "Titre invalide";
    if (typeof logline !== "string" || logline.length > 500) return "Logline invalide";
    if (!Number.isInteger(from) || !Number.isInteger(to) || !Number.isInteger(total)) return "Numéros d'épisodes invalides";
    if (from < 1 || to > 40 || from > to) return "Plage d'épisodes invalide";
  } else if (action === "script") {
    const { ep, bible, mode, duree } = payload;
    if (!VALID_MODES.includes(mode)) return "Mode invalide";
    if (!VALID_DUREES.includes(duree)) return "Durée invalide";
    if (!ep || typeof ep !== "object") return "Épisode invalide";
    if (!bible || typeof bible !== "object") return "Bible invalide";
  } else if (action === "edit") {
    const { script, type, duree } = payload;
    if (!VALID_EDIT_TYPES.includes(type)) return "Type d'édition invalide";
    if (!VALID_DUREES.includes(duree)) return "Durée invalide";
    if (!script || typeof script !== "object") return "Script invalide";
  } else if (action === "variations") {
    const { ep, bible, mode, duree } = payload;
    if (!VALID_MODES.includes(mode)) return "Mode invalide";
    if (!VALID_DUREES.includes(duree)) return "Durée invalide";
    if (!ep || typeof ep !== "object") return "Épisode invalide";
    if (!bible || typeof bible !== "object") return "Bible invalide";
  } else if (action === "titres") {
    const { titre, logline, pitch, mode } = payload;
    if (!VALID_MODES.includes(mode)) return "Mode invalide";
    if (typeof titre !== "string" || titre.length > 200) return "Titre invalide";
    if (typeof logline !== "string" || logline.length > 500) return "Logline invalide";
    if (pitch !== undefined && (typeof pitch !== "string" || pitch.length > 500)) return "Pitch invalide";
  }
  return null;
}

const DUR_INSTR = {
  60: "Format 1 MINUTE: 4 à 5 échanges, max 20 mots par réplique, une seule révélation percutante.",
  90: "Format 1MIN30: 6 à 7 échanges, max 25 mots, montée progressive + retournement.",
  120: "Format 2 MINUTES: 8 à 10 échanges, deux temps forts, cliffhanger inattendu.",
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sub = await requireSub(req, res);
  if (!sub) return;
  const { customerId, plan } = sub;

  if (isRateLimited(customerId)) {
    return res.status(429).json({ error: "Trop de requêtes, veuillez patienter une minute." });
  }

  const { action, payload } = req.body || {};

  if (!VALID_ACTIONS.includes(action)) {
    return res.status(400).json({ error: "Action inconnue" });
  }

  // Restrictions plan Standard
  const PREMIUM_ACTIONS = ["variations", "titres"];
  if (plan === "standard" && PREMIUM_ACTIONS.includes(action)) {
    return res.status(403).json({ error: "Cette fonctionnalité est réservée au plan Premium. Passez à Premium pour débloquer les variations et les titres viraux." });
  }
  if (plan === "standard" && action === "bible" && payload?.mode === "premium") {
    return res.status(403).json({ error: "Le mode Premium Suspense est réservé au plan Premium." });
  }
  if (plan === "standard" && action === "bible" && payload?.format > 10) {
    return res.status(403).json({ error: "Le plan Standard est limité à 10 épisodes. Passez à Premium pour créer jusqu'à 40 épisodes." });
  }

  const validationError = validatePayload(action, payload);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

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
      // Normalise les clés (Claude retourne parfois title/logLine en anglais)
      if (!result.titre) result.titre = result.title || result.name || "Série sans titre";
      if (!result.logline) result.logline = result.logLine || result.description || "";
      if (!result.pitch) result.pitch = result.synopsis || result.summary || "";
      if (!result.tension_centrale) result.tension_centrale = result.tension || result.central_tension || "";
      if (!result.personnages) result.personnages = result.characters || result.personages || [];
      // Tronque si trop long pour la validation episodes
      result.titre = String(result.titre).slice(0, 199);
      result.logline = String(result.logline).slice(0, 499);
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
Le champ "jeu" = indication de jeu d'acteur courte (ex: "voix brisée", "sourire forcé", "colère froide", "chuchote").
JSON: {"hook_scene":{"texte":"","visuel_916":""},"scenes":[{"perso":"","dialogue":"","jeu":"","visuel_916":""}],"cliffhanger_scene":{"texte":"","visuel_916":"","label":""},"checklist":[""]}`,
        2200
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

    if (action === "variations") {
      const { ep, bible, mode, duree } = payload;
      const maxS = duree <= 60 ? 5 : duree <= 90 ? 7 : 10;
      const persos = (bible.personnages || []).map(p => `${p.nom} (${p.role})`).join(", ");
      const base = `Script ép.${ep.numero} "${ep.titre}". Série: ${bible.titre}. Persos: ${persos}. Cliffhanger: ${ep.cliffhanger}. RÈGLES: hook 1 phrase choc, ${maxS} échanges max 25 mots, max 2 acteurs. Le champ "jeu" = indication courte de jeu d'acteur. JSON: {"hook_scene":{"texte":"","visuel_916":""},"scenes":[{"perso":"","dialogue":"","jeu":"","visuel_916":""}],"cliffhanger_scene":{"texte":"","visuel_916":"","label":""},"checklist":[""]}`;
      const styles = [
        { label: "🌶 Intense", instr: "Version INTENSE: émotions à fleur de peau, confrontation directe, chaque réplique choque." },
        { label: "🤫 Subtil", instr: "Version SUBTILE: sous-texte, non-dits, silences lourds, tension psychologique." },
        { label: "⚡ Rapide", instr: "Version RAPIDE: répliques ultra-courtes (max 10 mots), rythme haletant, 100% action." },
      ];
      const results = await Promise.all(styles.map(({ instr }) =>
        callClaude(`Scénariste expert micro-dramas 9:16. ${DUR_INSTR[duree]} JSON uniquement.`, `${instr}\n${base}`, 2000)
      ));
      return res.json({ variations: results.map((r, i) => ({ ...r, label: styles[i].label })) });
    }

    if (action === "titres") {
      const { titre, logline, pitch, mode } = payload;
      const result = await callClaude(
        "Expert en viralité des contenus courts (TikTok, Reels, Shorts). JSON uniquement.",
        `Série micro-drama 9:16. Titre actuel: "${titre}". Logline: ${logline}. Pitch: ${pitch}. Mode: ${mode}.
Génère 5 titres alternatifs ultra-viraux pour cette série. Chaque titre doit créer de la curiosité, du désir ou de la tension.
JSON: {"titres":[{"titre":"","score":95,"accroche":"","pourquoi":""}]}`
        , 1000
      );
      return res.json(result);
    }

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

import { callClaude } from "../../lib/anthropic";
import { requireSub } from "../../lib/auth";
import { checkRateLimit } from "../../lib/rateLimit";
import { Redis } from "@upstash/redis";
import * as Sentry from "@sentry/nextjs";

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
}

async function trackAction(action, customerId) {
  try {
    const redis = getRedis();
    if (!redis) return;
    const today = new Date().toISOString().slice(0, 10);
    await Promise.all([
      redis.incr(`analytics:daily:${today}:${action}`),
      redis.incr(`analytics:total:${action}`),
      redis.sadd(`analytics:users:${today}`, customerId),
      redis.expire(`analytics:users:${today}`, 60 * 60 * 24 * 60), // 60 jours
    ]);
  } catch {}
}

// Cache in-memory : bible et épisodes cachés 1h (même params = même résultat)
const genCache = new Map();
const CACHE_TTL = 60 * 60 * 1000;
function getCached(key) {
  const entry = genCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { genCache.delete(key); return null; }
  return entry.data;
}
function setCached(key, data) {
  if (genCache.size > 500) {
    const oldest = [...genCache.entries()].sort((a, b) => a[1].ts - b[1].ts)[0];
    genCache.delete(oldest[0]);
  }
  genCache.set(key, { data, ts: Date.now() });
}


const VALID_ACTIONS = ["bible", "episodes", "script", "edit", "titres", "variations", "traduire", "production"];
const VALID_MODES = ["fast", "premium"];
const VALID_DUREES = [60, 90, 120];
const VALID_FORMATS = [10, 20, 40, 90];
const VALID_EDIT_TYPES = ["pimenter", "subtil", "simplifier", "rewrite_hook", "rewrite_ending"];

function validatePayload(action, payload) {
  if (!payload || typeof payload !== "object") return "Payload invalide";
  if (action === "bible") {
    const { mode, casting, univers, secret, format, duree, genre, lieu } = payload;
    if (!VALID_MODES.includes(mode)) return "Mode invalide";
    if (!VALID_DUREES.includes(duree)) return "Durée invalide";
    if (!VALID_FORMATS.includes(format)) return "Format invalide";
    if (mode === "fast" && format > 10) return "Le mode Fast est limité à 10 épisodes. Passez en Premium Suspense pour créer jusqu'à 90 épisodes.";
    if (typeof casting !== "string" || casting.length > 100) return "Casting invalide";
    if (typeof univers !== "string" || univers.length > 100) return "Univers invalide";
    if (typeof secret !== "string" || secret.length > 100) return "Secret invalide";
    if (genre !== undefined && (typeof genre !== "string" || genre.length > 100)) return "Genre invalide";
    if (lieu !== undefined && (typeof lieu !== "string" || lieu.length > 100)) return "Lieu invalide";
    if (payload.ambiance !== undefined && (typeof payload.ambiance !== "string" || payload.ambiance.length > 100)) return "Ambiance invalide";
  } else if (action === "episodes") {
    const { titre, logline, mode, from, to, total } = payload;
    if (!VALID_MODES.includes(mode)) return "Mode invalide";
    if (typeof titre !== "string" || titre.length > 200) return "Titre invalide";
    if (typeof logline !== "string" || logline.length > 500) return "Logline invalide";
    if (!Number.isInteger(from) || !Number.isInteger(to) || !Number.isInteger(total)) return "Numéros d'épisodes invalides";
    if (from < 1 || to > 90 || from > to) return "Plage d'épisodes invalide";
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
  } else if (action === "traduire") {
    const { script, langue } = payload;
    if (!script || typeof script !== "object") return "Script invalide";
    const VALID_LANGUES = ["en", "es", "de", "pt", "it", "ar", "he", "zh"];
    if (!VALID_LANGUES.includes(langue)) return "Langue invalide";
  } else if (action === "production") {
    const { titre, logline, personnages } = payload;
    if (typeof titre !== "string" || titre.length > 200) return "Titre invalide";
    if (typeof logline !== "string" || logline.length > 500) return "Logline invalide";
    if (!Array.isArray(personnages)) return "Personnages invalides";
  }
  return null;
}

const DUR_INSTR = {
  60: "DURÉE 1 MIN: 4-5 échanges, max 20 mots/réplique. Structure: CHOC d'ouverture → escalade → révélation unique → question sans réponse.",
  90: "DURÉE 1MIN30: 6-7 échanges, max 25 mots/réplique. Structure: hook → tension montante → faux pivot → vraie révélation → cliffhanger.",
  120: "DURÉE 2 MIN: 8-10 échanges, max 30 mots/réplique. Structure: hook → conflit → rebondissement mi-parcours → révélation → cliffhanger brutal.",
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sub = await requireSub(req, res);
  if (!sub) return;
  const { customerId, plan } = sub;

  const { limited, count, max } = await checkRateLimit(customerId, plan);
  if (limited) {
    return res.status(429).json({ error: `Limite atteinte (${max} générations/heure). Réessayez dans quelques minutes.` });
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
    return res.status(403).json({ error: "Le plan Standard est limité à 10 épisodes. Passez à Premium pour créer jusqu'à 90 épisodes." });
  }

  const validationError = validatePayload(action, payload);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    if (action === "bible") {
      const { mode, casting, univers, secret, format, duree, genre, lieu, ambiance } = payload;
      const ck = `bible:${mode}:${casting}:${univers}:${secret}:${format}:${duree}:${genre || ""}:${lieu || ""}:${ambiance || ""}`;
      const cached = getCached(ck);
      if (cached) return res.json(cached);
      const md = mode === "fast"
        ? "Fast Drama: viralité immédiate, émotions explosives, hooks agressifs, cliffhangers choc"
        : "Premium Suspense: tension psychologique, sous-texte riche, silences éloquents, réalisme brut";
      const genreInstr = genre ? `Genre: ${genre} — respecte les codes émotionnels et narratifs de ce genre.` : "";
      const lieuInstr = lieu ? `Lieu principal: "${lieu}" — les scènes se déroulent dans ce lieu limité, exploite l'espace pour créer la tension et la claustrophobie dramatique.` : "";
      const ambianceMap = { "⚡ Intense & Direct": "Ton INTENSE ET DIRECT: dialogues percutants, confrontations frontales, émotions à fleur de peau, rythme rapide.", "💜 Émotionnel & Poétique": "Ton ÉMOTIONNEL ET POÉTIQUE: dialogues touchants, métaphores, profondeur des sentiments, moments de vulnérabilité.", "🧠 Psychologique & Lent": "Ton PSYCHOLOGIQUE ET LENT: sous-texte riche, silences significatifs, manipulation subtile, tension qui monte sans éclater." };
      const ambianceInstr = ambiance && ambianceMap[ambiance] ? ambianceMap[ambiance] : "";
      const result = await callClaude(
        `Tu es showrunner de micro-dramas 9:16 (TikTok, Reels, Shorts). ${md}. ${DUR_INSTR[duree]}\n${genreInstr}\n${lieuInstr}\n${ambianceInstr}\nTitre: 2-4 mots, mystérieux, crée l'envie immédiate — jamais de sous-titre explicatif.\nLogline: "[Personnage] cache [secret] jusqu'au jour où [déclencheur]" — 15 mots max, formule respectée.\nPitch: 3 lignes qui hookent un ado de 17 ans — commence par l'émotion, pas l'intrigue.\nSecret de chaque personnage: doit CRÉER du conflit actif avec les autres, pas juste du backstory.\narc de chaque personnage: son évolution dramatique sur la série en 1 phrase ("passe de X à Y").\ntension_centrale: la question dramatique unique qui traverse toute la série, commence par "Va-t-il/elle..." ou "Qui...".\naccroche: 1 phrase choc de 10 mots max pour poster en légende TikTok — crée la curiosité immédiate.\nJSON uniquement, aucun texte avant ou après.`,
        `Casting: ${casting}. Univers: ${univers}. Secret moteur: ${secret}. Série de ${format} épisodes.\nJSON: {"titre":"","logline":"","pitch":"","personnages":[{"nom":"","age":25,"role":"","secret":"","arc":""},{"nom":"","age":28,"role":"","secret":"","arc":""}],"tension_centrale":"","accroche":""}`,
        1800
      );
      if (!result.titre) result.titre = result.title || result.name || "Série sans titre";
      if (!result.logline) result.logline = result.logLine || result.description || "";
      if (!result.pitch) result.pitch = result.synopsis || result.summary || "";
      if (!result.tension_centrale) result.tension_centrale = result.tension || result.central_tension || "";
      if (!result.personnages) result.personnages = result.characters || result.personages || [];
      result.titre = String(result.titre).slice(0, 199);
      result.logline = String(result.logline).slice(0, 499);
      setCached(ck, result);
      trackAction("bible", customerId);
      return res.json(result);
    }

    if (action === "episodes") {
      const { titre, logline, mode, from, to, total } = payload;
      const ck = `episodes:${titre}:${mode}:${from}:${to}:${total}`;
      const cached = getCached(ck);
      if (cached) return res.json(cached);
      const md = mode === "fast"
        ? "Fast Drama: viralité immédiate, émotions frontales"
        : "Premium Suspense: tension psychologique, sous-texte";
      const tFrom = Math.max(1, Math.round(from * 10 / total));
      const tTo = Math.min(10, Math.round(to * 10 / total));
      const result = await callClaude(
        `Tu es showrunner expert. JSON uniquement.\nRègles pour chaque épisode:\n- titre: 2-3 mots max, teaser sans spoiler, crée la curiosité (ex: "Le mensonge", "Elle sait", "Trop tard")\n- cliffhanger: action ou révélation coupée net qui oblige à regarder l'épisode suivant — phrase incomplète ou question suspendue, jamais de résolution\n- tension: entier 1-10 en progression logique sur la série`,
        `Série "${titre}" — ${logline}. Mode: ${md}.\nÉpisodes ${from} à ${to} (série de ${total} épisodes). Tension globale: ${tFrom} → ${tTo}/10.\nJSON: {"episodes":[{"numero":${from},"titre":"","cliffhanger":"","tension":${tFrom}}]}`,
        2500
      );
      setCached(ck, result);
      trackAction("episodes", customerId);
      return res.json(result);
    }

    if (action === "script") {
      const { ep, bible, mode, duree, prevEps } = payload;
      const md = mode === "fast"
        ? "Fast Drama: émotions explosives, confrontations directes, cliffhangers choc"
        : "Premium Suspense: sous-texte intense, silences signifiants, tension qui monte progressivement";
      const maxS = duree <= 60 ? 5 : duree <= 90 ? 7 : 10;
      const persos = (bible.personnages || []).map(p => `${p.nom} (${p.role}${p.secret ? `, secret: ${p.secret}` : ""})`).join(", ");
      const prevEpsInstr = prevEps && prevEps.length > 0
        ? `\nCONTINUITÉ: Les épisodes précédents se sont terminés ainsi — ${prevEps.map(e => `ép.${e.numero} "${e.titre}": ${e.cliffhanger}`).join(" / ")}. Assure la cohérence narrative et fais des références implicites aux événements passés.`
        : "";
      const result = await callClaude(
        `Tu es scénariste de micro-dramas 9:16. ${DUR_INSTR[duree]} Mode: ${md}.\nRÈGLES ABSOLUES:\n• Commence IN MEDIAS RES — déjà en plein conflit, INTERDIT de commencer par "Bonjour", présentation ou question banale\n• Chaque réplique révèle OU cache quelque chose — aucune ligne neutre ou de remplissage\n• Max ${maxS} échanges, max 2 acteurs à l'écran, format 9:16 gros plans\n• visuel_916: NOM DU PLAN + émotion précise (ex: "gros plan yeux larmoyants", "contre-plongée regard dominant", "zoom lent sur main qui tremble", "cut rapide profil fuyant")\n• jeu: état interne ou physique court (ex: "retient ses larmes", "sourire qui cache la peur", "voix qui tremble de colère", "regarde ailleurs")\n• label du cliffhanger: la question que se pose le spectateur (ex: "Il sait?", "Elle va parler?", "C'était lui?")\n• checklist: 4 items évaluant "Hook percutant ✓/✗", "Tension qui monte ✓/✗", "Cliffhanger inattendu ✓/✗", "Max 2 acteurs ✓/✗"\nJSON uniquement.`,
        `Script ép.${ep.numero} "${ep.titre}". Série: "${bible.titre}". Personnages: ${persos}.\nTension de la série: ${bible.tension_centrale || ""}.\nCliffhanger à atteindre: ${ep.cliffhanger}.${prevEpsInstr}\nJSON: {"hook_scene":{"texte":"","visuel_916":""},"scenes":[{"perso":"","dialogue":"","jeu":"","visuel_916":""}],"cliffhanger_scene":{"texte":"","visuel_916":"","label":""},"checklist":[""]}`,
        2400
      );
      trackAction("script", customerId);
      return res.json(result);
    }

    if (action === "edit") {
      const { script, type, duree } = payload;
      const maxS = duree <= 60 ? 5 : duree <= 90 ? 7 : 10;
      const instr = {
        pimenter: `INTENSIFIE ce script au maximum. Remplace chaque réplique ordinaire par une révélation, une accusation ou une menace. Interdit: hésitations, politesse, questions vagues. Chaque ligne doit blesser ou exposer un secret. Max ${maxS} échanges. Retourne exactement la même structure JSON.`,
        subtil: `RENDS ce script subtil et psychologique. Aucun personnage ne dit ce qu'il veut vraiment — tout passe par le sous-texte, les silences (indique "(silence)" dans jeu), les métaphores et les regards. Remplace les confrontations directes par des non-dits lourds. Max ${maxS} échanges. Même structure JSON.`,
        simplifier: `SIMPLIFIE radicalement ce script. Un seul lieu. Une seule révélation centrale. Répliques 5-8 mots max, chaque mot compte. Supprime tout ce qui n'est pas essentiel à la tension principale. Max ${maxS} échanges. Même structure JSON.`,
        rewrite_hook: `RÉÉCRIS UNIQUEMENT le hook d'ouverture (hook_scene). Crée une nouvelle scène d'ouverture complètement différente — autre situation, autre dynamique, mais même tension et mêmes personnages. Le reste du script reste identique. Même structure JSON.`,
        rewrite_ending: `RÉÉCRIS UNIQUEMENT la fin (cliffhanger_scene). Crée un nouveau cliffhanger inattendu, plus choquant ou plus ambigu. Le hook et les scènes du milieu restent identiques. Même structure JSON.`,
      };
      const result = await callClaude(
        "Tu es scénariste expert en micro-dramas 9:16. JSON uniquement, structure identique à l'original.",
        `${instr[type]}\n\nScript original:\n${JSON.stringify(script)}`,
        2000
      );
      return res.json(result);
    }

    if (action === "variations") {
      const { ep, bible, mode, duree } = payload;
      const maxS = duree <= 60 ? 5 : duree <= 90 ? 7 : 10;
      const persos = (bible.personnages || []).map(p => `${p.nom} (${p.role}${p.secret ? `, secret: ${p.secret}` : ""})`).join(", ");
      const base = `Script ép.${ep.numero} "${ep.titre}". Série: "${bible.titre}". Persos: ${persos}. Tension: ${bible.tension_centrale || ""}. Cliffhanger: ${ep.cliffhanger}.\nRÈGLES: IN MEDIAS RES, ${maxS} échanges max 25 mots, max 2 acteurs, visuel_916 = nom du plan + émotion, jeu = état interne court.\nJSON: {"hook_scene":{"texte":"","visuel_916":""},"scenes":[{"perso":"","dialogue":"","jeu":"","visuel_916":""}],"cliffhanger_scene":{"texte":"","visuel_916":"","label":""},"checklist":[""]}`;
      const styles = [
        { label: "🌶 Intense", instr: "Version INTENSE: confrontation directe, accusations, révélations brutales. Chaque réplique choque ou blesse. Aucune politesse." },
        { label: "🤫 Subtil", instr: "Version SUBTILE: tout passe par le sous-texte, jamais de confrontation directe. Les personnages parlent D'AUTRE CHOSE mais le vrai conflit est partout. Silences ('(silence)' dans jeu) significatifs." },
        { label: "⚡ Rapide", instr: "Version RAPIDE: répliques 3-8 mots max, rythme haletant. Chaque échange coupe l'autre. Tension physique, mouvement, action." },
        { label: "🌙 Sombre", instr: "Version SOMBRE: atmosphère lourde et enfermée, dialogue murmuré ou retenu, révélation finale dévastatrice, fin ambiguë qui laisse une question ouverte." },
      ];
      const results = await Promise.all(styles.map(({ instr }) =>
        callClaude(`Tu es scénariste expert micro-dramas 9:16. ${DUR_INSTR[duree]} JSON uniquement.`, `${instr}\n\n${base}`, 2000)
      ));
      trackAction("variations", customerId);
      return res.json({ variations: results.map((r, i) => ({ ...r, label: styles[i].label })) });
    }

    if (action === "titres") {
      const { titre, logline, pitch, mode } = payload;
      const result = await callClaude(
        `Tu es expert en viralité des contenus courts (TikTok, Reels, Shorts). Tu maîtrises les 5 patterns de titres qui stoppent le scroll:\nRÉVÉLATION: expose un secret ("Il mentait depuis le début")\nQUESTION: pose une question impossible à ignorer ("Et si elle savait tout?")\nIDENTITÉ: menace l'identité d'un personnage ("Plus jamais sa femme")\nSECRET: suggère un secret explosif ("Ton patron sait tout")\nTWIST: annonce un retournement ("C'était elle")\nRègles: titre 2-5 mots, jamais de point d'exclamation, score = probabilité de stopper le scroll (1-100).\nJSON uniquement.`,
        `Série micro-drama 9:16. Titre actuel: "${titre}". Logline: ${logline}. Pitch: ${pitch || ""}.\nGénère 5 titres viraux — exactement un par pattern (RÉVÉLATION, QUESTION, IDENTITÉ, SECRET, TWIST).\nJSON: {"titres":[{"titre":"","score":95,"accroche":"en quoi ce titre arrête le scroll","pourquoi":"mécanisme psychologique exploité","pattern":"RÉVÉLATION"}]}`,
        1000
      );
      trackAction("titres", customerId);
      return res.json(result);
    }

    if (action === "traduire") {
      const { script, langue } = payload;
      const noms = { en: "English", es: "Español", de: "Deutsch", pt: "Português", it: "Italiano", ar: "العربية", he: "עברית", zh: "中文" };
      const result = await callClaude(
        `Tu es expert en adaptation de scripts micro-dramas 9:16 pour ${noms[langue]}.\nRègles strictes:\n• Préserve le ton, les émotions et l'intensité dramatique — pas de traduction littérale plate\n• Les indications de jeu (champ "jeu") doivent sonner naturel en ${noms[langue]}, adaptées culturellement\n• Les dialogues doivent avoir le même punch dans la langue cible — si nécessaire, reformule pour garder l'impact\n• Conserve exactement la même structure JSON, ne modifie aucune clé\n• JSON uniquement, aucun texte avant ou après`,
        JSON.stringify(script),
        2400
      );
      trackAction("traduction", customerId);
      return res.json(result);
    }

    if (action === "production") {
      const { titre, logline, personnages, mode } = payload;
      const persos = (personnages || []).map(p => `${p.nom} (${p.role}, ${p.age} ans)`).join(", ");
      const md = mode === "fast" ? "Fast Drama — décors minimalistes, émotions frontales" : "Premium Suspense — décors évocateurs, atmosphère soignée";
      const result = await callClaude(
        `Tu es directeur artistique expert en micro-dramas 9:16 tournés au smartphone. ${md}. JSON uniquement.`,
        `Série "${titre}". Logline: ${logline}. Personnages: ${persos}.\nGénère une fiche technique de production complète pour tourner avec un smartphone.\nJSON: {"decors":[{"nom":"","description":"","ambiance":"","conseil_tournage":""}],"costumes":[{"personnage":"","look":"","couleurs":"","symbolique":""}],"lieux":[{"type":"","exemples":[""],"lumiere":"","heure_ideale":""}]}`,
        1200
      );
      trackAction("production", customerId);
      return res.json(result);
    }

  } catch (e) {
    Sentry.captureException(e, { extra: { action: req.body?.action, customerId, plan } });
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

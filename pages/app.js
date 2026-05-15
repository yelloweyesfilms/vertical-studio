import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

// ── CONFIG ──────────────────────────────────────────────────
const OPTS = {
  casting: ["1 Femme + 1 Homme", "2 Femmes", "2 Hommes", "Trio mixte"],
  univers_fast: ["Hôpital privé", "Milieu corporate", "Famille recomposée", "Mode & Influence", "Sport élite", "École d'élite", "Backstage festival", "Maison de luxe"],
  univers_prem: ["Start-up IA", "Finance internationale", "Héritage familial", "Politique & Pouvoir", "Pharma & Biotech", "Diplomatie internationale", "Industrie musicale", "Justice & Tribunal"],
  secret_fast: ["Trahison amoureuse", "Double vie", "Vengeance planifiée", "Enfant caché", "Identité volée", "Addiction secrète", "Adoption cachée", "Crime passé"],
  secret_prem: ["Sabotage interne", "Espionnage industriel", "Héritage volé", "Manipulation psychologique", "Complot financier", "Corruption judiciaire", "Trahison d'État", "Chantage au sommet"],
  genre: ["Romance", "Revenge Story", "Thriller Social", "Teen Drama", "Fantasy", "Soap Premium"],
  lieu_fast: ["Ascenseur", "Chambre d'hôtel", "Voiture la nuit", "Couloir vide", "Toit d'immeuble", "Salle d'attente"],
  lieu_prem: ["Cabinet privé", "Parking souterrain", "Loge d'artiste", "Jet privé", "Bibliothèque fermée", "Terrasse au crépuscule"],
  ambiance: ["⚡ Intense & Direct", "💜 Émotionnel & Poétique", "🧠 Psychologique & Lent"],
};
const DUR_LABEL = { 60: "1 min", 90: "1 min 30", 120: "2 min" };
const DUR_SCENES = { 60: 5, 90: 7, 120: 10 };

const PACKS = [
  { emoji: "🏥", label: "Médical Secret",   mode: "fast",    casting: "1 Femme + 1 Homme", univers: "Hôpital privé",             secret: "Double vie" },
  { emoji: "💼", label: "Corporate War",    mode: "premium", casting: "2 Hommes",           univers: "Finance internationale",    secret: "Sabotage interne" },
  { emoji: "👨‍👩‍👧", label: "Famille Brisée",  mode: "fast",    casting: "Trio mixte",         univers: "Famille recomposée",        secret: "Enfant caché" },
  { emoji: "💕", label: "Amour Interdit",   mode: "fast",    casting: "1 Femme + 1 Homme", univers: "Mode & Influence",           secret: "Trahison amoureuse" },
  { emoji: "🔪", label: "Vengeance",        mode: "premium", casting: "2 Femmes",           univers: "Héritage familial",          secret: "Manipulation psychologique" },
  { emoji: "🤖", label: "IA & Pouvoir",     mode: "premium", casting: "1 Femme + 1 Homme", univers: "Start-up IA",                secret: "Espionnage industriel" },
  { emoji: "🏆", label: "Sport & Trahison", mode: "fast",    casting: "2 Hommes",           univers: "Sport élite",                secret: "Vengeance planifiée" },
  { emoji: "💊", label: "Pharma Noir",      mode: "premium", casting: "1 Femme + 1 Homme", univers: "Pharma & Biotech",           secret: "Complot financier" },
  { emoji: "🎓", label: "Élite Scolaire",   mode: "fast",    casting: "2 Femmes",           univers: "École d'élite",              secret: "Adoption cachée" },
  { emoji: "🎵", label: "Music Business",   mode: "premium", casting: "1 Femme + 1 Homme", univers: "Industrie musicale",         secret: "Chantage au sommet" },
  { emoji: "🌍", label: "Diplomatie",       mode: "premium", casting: "Trio mixte",         univers: "Diplomatie internationale",  secret: "Trahison d'État" },
  { emoji: "⚖️", label: "Au Tribunal",      mode: "premium", casting: "1 Femme + 1 Homme", univers: "Justice & Tribunal",         secret: "Corruption judiciaire" },
];

const CASTING_DESC = {
  "1 Femme + 1 Homme": "une femme et un homme",
  "2 Femmes": "deux femmes",
  "2 Hommes": "deux hommes",
  "Trio mixte": "un trio",
};

function buildPreview(state) {
  const raw = (key) => state[key]?.startsWith(CUSTOM_PREFIX) ? state[key].slice(CUSTOM_PREFIX.length) : state[key];
  const cast = CASTING_DESC[state.casting] || raw("casting")?.toLowerCase() || "des personnages";
  const univers = raw("univers")?.toLowerCase() || "un univers complexe";
  const secret = raw("secret")?.toLowerCase() || "un secret";
  const lieu = raw("lieu")?.toLowerCase();
  const ambiance = raw("ambiance")?.replace(/^[^\s]+ /, "").toLowerCase() || "";

  const templates = [
    `${cast?.charAt(0).toUpperCase() + cast?.slice(1)} dans ${univers}. Le secret : ${secret}${lieu ? ` — tout se joue dans ${lieu}` : ""}.`,
    `Un récit de ${secret} au cœur de ${univers}${lieu ? `, dans ${lieu}` : ""}. ${cast?.charAt(0).toUpperCase() + cast?.slice(1)}, face à face.`,
    `${univers?.charAt(0).toUpperCase() + univers?.slice(1)}. ${secret?.charAt(0).toUpperCase() + secret?.slice(1)}. ${cast?.charAt(0).toUpperCase() + cast?.slice(1)}${lieu ? ` — ${lieu}` : ""}.`,
  ];

  const idx = (state.casting?.length || 0) % 3;
  return { pitch: templates[idx], ambiance };
}

const LANGUES = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "pt", flag: "🇵🇹", label: "Português" },
  { code: "it", flag: "🇮🇹", label: "Italiano" },
  { code: "ar", flag: "🇸🇦", label: "العربية" },
  { code: "he", flag: "🇮🇱", label: "עברית" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
];

// ── API HELPERS ──────────────────────────────────────────────
async function gen(action, payload, customerId) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${customerId}` },
    body: JSON.stringify({ action, payload }),
  });
  const d = await res.json();
  if (d.error) throw new Error(d.error);
  return d;
}

async function genBibleStream(payload, customerId, onChunk) {
  const res = await fetch("/api/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${customerId}` },
    body: JSON.stringify({ action: "bible", payload }),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({ error: "Erreur serveur" }));
    throw new Error(d.error || "Erreur serveur");
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";
    for (const part of parts) {
      if (!part.startsWith("data: ")) continue;
      try {
        const data = JSON.parse(part.slice(6));
        if (data.error) throw new Error(data.error);
        if (data.chunk) onChunk(data.chunk);
        if (data.done) return data.result;
      } catch (e) {
        if (e.message && !e.message.includes("JSON")) throw e;
      }
    }
  }
  throw new Error("Stream terminé sans résultat");
}

// ── CLOUD SYNC ───────────────────────────────────────────────
async function cloudSave(bible, episodes, state, customerId) {
  try {
    const res = await fetch("/api/cloud-series", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${customerId}` },
      body: JSON.stringify({ bible, episodes, state }),
    });
    const d = await res.json();
    return d.id || null;
  } catch { return null; }
}

async function cloudList(customerId) {
  try {
    const res = await fetch("/api/cloud-series", { headers: { Authorization: `Bearer ${customerId}` } });
    const d = await res.json();
    return d.series || [];
  } catch { return []; }
}

async function cloudDelete(id, customerId) {
  try {
    await fetch(`/api/cloud-series?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${customerId}` } });
  } catch {}
}

async function cloudLoad(id, customerId) {
  try {
    const res = await fetch(`/api/cloud-series?id=${id}`, { method: "PUT", headers: { Authorization: `Bearer ${customerId}` } });
    return await res.json();
  } catch { return null; }
}

async function cloudRename(id, titre, customerId) {
  try {
    await fetch(`/api/cloud-series?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${customerId}` },
      body: JSON.stringify({ titre }),
    });
  } catch {}
}

// ── SAUVEGARDE LOCALE ────────────────────────────────────────
const SAVE_KEY = "vs_series";

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "[]"); } catch { return []; }
}

function saveSerie(bible, episodes, state) {
  const saved = loadSaved();
  const entry = { id: Date.now(), savedAt: new Date().toISOString(), bible, episodes, state };
  const updated = [entry, ...saved].slice(0, 20);
  localStorage.setItem(SAVE_KEY, JSON.stringify(updated));
  return entry.id;
}

function deleteSerie(id) {
  const updated = loadSaved().filter(s => s.id !== id);
  localStorage.setItem(SAVE_KEY, JSON.stringify(updated));
}

function renameSerieLocal(id, titre) {
  const updated = loadSaved().map(s => s.id === id ? { ...s, bible: { ...s.bible, titre } } : s);
  localStorage.setItem(SAVE_KEY, JSON.stringify(updated));
}

// ── STATS & REPRISE ──────────────────────────────────────────
const STATS_KEY = "vs_stats";
function getStats() {
  try { return JSON.parse(localStorage.getItem(STATS_KEY) || '{"series":0,"scripts":0,"minutes":0}'); } catch { return { series: 0, scripts: 0, minutes: 0 }; }
}
function incStats(patch) {
  const s = getStats();
  Object.keys(patch).forEach(k => s[k] = (s[k] || 0) + patch[k]);
  try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch {}
}
const LAST_KEY = "vs_last";
function saveLastOpen(bible, episodes, state) {
  try { localStorage.setItem(LAST_KEY, JSON.stringify({ bible, episodes, state })); } catch {}
}
function loadLastOpen() {
  try { return JSON.parse(localStorage.getItem(LAST_KEY) || "null"); } catch { return null; }
}

// ── ONBOARDING ───────────────────────────────────────────────
const ONBOARDING_PACKS = [
  { emoji: "🏥", label: "Médical Secret",  mode: "fast",    casting: "1 Femme + 1 Homme", univers: "Hôpital privé",          secret: "Double vie",        desc: "Une infirmière cache une erreur qui peut tout faire basculer." },
  { emoji: "👨‍👩‍👧", label: "Famille Brisée", mode: "fast",    casting: "Trio mixte",         univers: "Famille recomposée",     secret: "Enfant caché",      desc: "Un secret de famille remonte à la surface au pire moment." },
  { emoji: "💼", label: "Corporate War",   mode: "fast",    casting: "2 Hommes",           univers: "Milieu corporate",       secret: "Trahison amoureuse", desc: "Deux associés, un seul pouvait rester." },
];

function OnboardingModal({ onClose, onLaunch }) {
  const [step, setStep] = useState(0);

  if (step === 0) return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 0 }}>
      <div style={{ background: "var(--bg)", borderRadius: "24px 24px 0 0", padding: "36px 28px 48px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 -12px 64px rgba(0,0,0,.5)" }}>
        <div style={{ width: 40, height: 4, background: "var(--bo)", borderRadius: 2, margin: "0 auto 28px" }} />
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 900, marginBottom: 10, lineHeight: 1.2 }}>Ta première série<br/>en 30 secondes</h2>
        <p style={{ fontSize: 14, color: "var(--mt)", lineHeight: 1.7, marginBottom: 10 }}>Vertical Studio génère une bible complète, un séquencier d'épisodes et des scripts prêts à tourner.</p>
        <p style={{ fontSize: 13, color: "var(--mt)", lineHeight: 1.6, marginBottom: 32 }}>Choisis un thème et on s'occupe du reste.</p>
        <button onClick={() => setStep(1)} style={{ background: "var(--r)", color: "#fff", border: "none", padding: "16px 0", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "var(--sans)", marginBottom: 12 }}>
          Choisir mon thème →
        </button>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--mt)", fontSize: 13, cursor: "pointer", fontFamily: "var(--sans)" }}>
          Je préfère configurer moi-même
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "var(--bg)", borderRadius: "24px 24px 0 0", padding: "36px 28px 48px", maxWidth: 480, width: "100%", boxShadow: "0 -12px 64px rgba(0,0,0,.5)" }}>
        <div style={{ width: 40, height: 4, background: "var(--bo)", borderRadius: 2, margin: "0 auto 28px" }} />
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mt)", marginBottom: 16, textAlign: "center" }}>Choisis ton premier thème</p>
        {ONBOARDING_PACKS.map((pack, i) => (
          <button key={i} onClick={() => onLaunch(pack)}
            style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", background: "var(--card)", border: "1.5px solid var(--bo)", borderRadius: 16, padding: "16px 18px", marginBottom: 10, cursor: "pointer", textAlign: "left", fontFamily: "var(--sans)", transition: "border-color .15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--r)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--bo)"}>
            <span style={{ fontSize: 30, flexShrink: 0 }}>{pack.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{pack.label}</p>
              <p style={{ fontSize: 12, color: "var(--mt)", lineHeight: 1.4 }}>{pack.desc}</p>
            </div>
            <span style={{ color: "var(--r)", fontSize: 18, flexShrink: 0 }}>→</span>
          </button>
        ))}
        <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--mt)", fontSize: 13, cursor: "pointer", width: "100%", marginTop: 6, fontFamily: "var(--sans)" }}>
          ← Retour
        </button>
      </div>
    </div>
  );
}

// ── TOUR BEACON ──────────────────────────────────────────────
function TourBeacon({ text, side = "bottom", onDismiss }) {
  const sideStyle = {
    bottom: { top: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)" },
    top:    { bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)" },
    right:  { left: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)" },
    left:   { right: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)" },
  }[side] || {};

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <div style={{ position: "relative", zIndex: 10 }}>
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--r)", boxShadow: "0 0 0 4px rgba(232,92,58,0.2)", animation: "tour-pulse 1.5s ease-in-out infinite" }} />
      </div>
      <div style={{ position: "absolute", ...sideStyle, zIndex: 200, width: 220, background: "var(--bg)", border: "1.5px solid var(--r)", borderRadius: 12, padding: "12px 14px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", pointerEvents: "auto" }}>
        <div style={{ position: "absolute", ...(side === "bottom" ? { bottom: "100%", left: "50%", transform: "translateX(-50%)", borderBottom: "6px solid var(--r)", borderLeft: "6px solid transparent", borderRight: "6px solid transparent" } : side === "top" ? { top: "100%", left: "50%", transform: "translateX(-50%)", borderTop: "6px solid var(--r)", borderLeft: "6px solid transparent", borderRight: "6px solid transparent" } : {}) }} />
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)", lineHeight: 1.5, marginBottom: 8 }}>{text}</p>
        <button onClick={onDismiss} style={{ fontSize: 11, color: "var(--mt)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--sans)" }}>
          Compris ✓
        </button>
      </div>
    </div>
  );
}

// ── COMPONENTS ───────────────────────────────────────────────
function Dots({ t = 0 }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[...Array(10)].map((_, i) => (
        <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i < t ? "var(--r)" : "var(--bo)" }} />
      ))}
    </div>
  );
}

const UPSELL_CONTENT = {
  mode_premium: {
    icon: "🎭",
    title: "Premium Suspense",
    desc: "Tension psychologique, sous-texte, silences lourds. Des dialogues au niveau des meilleures séries Netflix — pour une audience qui veut plus que du divertissement.",
    feature: "Mode de génération Premium",
  },
  titres: {
    icon: "🔥",
    title: "Titres viraux",
    desc: "5 titres alternatifs avec score de viralité, accroche émotionnelle et analyse psychologique de l'impact. Choisis celui qui cartonne.",
    feature: "Générateur de titres viraux",
  },
  variations: {
    icon: "🎲",
    title: "4 variations du script",
    desc: "Intense, subtil ou rapide — 3 versions générées en parallèle pour la même scène. Plus jamais de blocage créatif sur le ton.",
    feature: "Variations de scripts",
  },
  episodes: {
    icon: "📺",
    title: "Jusqu'à 90 épisodes",
    desc: "Le plan Standard est limité à 10 épisodes par série. Premium permet d'aller jusqu'à 90 épisodes — pour des sagas longues qui fidélisent ton audience.",
    feature: "90 épisodes par série",
  },
};

function UpsellModal({ feature, onUpgrade, onClose }) {
  const c = UPSELL_CONTENT[feature] || UPSELL_CONTENT.mode_premium;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg)", borderRadius: "24px 24px 0 0", padding: "36px 28px 52px", maxWidth: 480, width: "100%", boxShadow: "0 -24px 80px rgba(0,0,0,.6)" }}>
        <div style={{ width: 40, height: 4, background: "var(--bo)", borderRadius: 2, margin: "0 auto 32px" }} />
        <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px" }}>{c.icon}</div>
        <p style={{ textAlign: "center", fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "#a855f7", marginBottom: 10, fontFamily: "var(--sans)" }}>Fonctionnalité Premium</p>
        <h2 style={{ textAlign: "center", fontFamily: "var(--serif)", fontSize: 26, fontWeight: 900, marginBottom: 12, color: "var(--tx)" }}>{c.title}</h2>
        <p style={{ textAlign: "center", fontSize: 14, color: "var(--mt)", lineHeight: 1.7, marginBottom: 28 }}>{c.desc}</p>
        <div style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.18)", borderRadius: 14, padding: "16px 18px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tx)", marginBottom: 2 }}>Plan Premium</p>
            <p style={{ fontSize: 12, color: "var(--mt)" }}>Fast Drama + Premium Suspense, 90 épisodes, 4 variations, titres viraux</p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 900, color: "var(--tx)", lineHeight: 1 }}>19€</p>
            <p style={{ fontSize: 11, color: "var(--mt)" }}>/mois</p>
          </div>
        </div>
        <button onClick={onUpgrade} style={{ width: "100%", background: "linear-gradient(135deg, #E85C3A, #a855f7)", color: "#fff", border: "none", padding: "16px 0", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)", marginBottom: 12, boxShadow: "0 0 28px rgba(168,85,247,0.3)" }}>
          Passer à Premium →
        </button>
        <button onClick={onClose} style={{ width: "100%", background: "none", border: "none", color: "var(--mt)", fontSize: 14, cursor: "pointer", padding: "8px 0", fontFamily: "var(--sans)" }}>
          Peut-être plus tard
        </button>
      </div>
    </div>
  );
}

function Chip({ label, active, onClick, block, sub }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "inline-flex", flexDirection: block ? "column" : "row",
        alignItems: "center", justifyContent: "center",
        padding: block ? "12px 8px" : "9px 16px",
        borderRadius: block ? 14 : 100,
        border: `1.5px solid ${active ? "var(--r)" : "var(--bo)"}`,
        background: active ? "var(--r)" : "var(--card)",
        color: active ? "#fff" : "var(--tx)",
        cursor: "pointer", userSelect: "none",
        fontSize: 13, fontWeight: 500,
        whiteSpace: "nowrap",
        transition: "all .15s",
        flex: block ? 1 : undefined, gap: 2,
      }}>
      <span style={{ fontSize: block ? 15 : 13, fontWeight: 700 }}>{label}</span>
      {sub && <span style={{ fontSize: 10, opacity: 0.75 }}>{sub}</span>}
    </div>
  );
}

// ── ÉCRAN PARRAINAGE ─────────────────────────────────────────
function ParrainageView({ customerId, onBack }) {
  const [code, setCode] = useState(null);
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referral", { headers: { Authorization: `Bearer ${customerId}` } })
      .then(r => r.json())
      .then(d => { setCode(d.code); setCount(d.count || 0); setLoading(false); })
      .catch(() => setLoading(false));
  }, [customerId]);

  const copy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <div style={{ background: "var(--tx)", padding: "28px 20px 24px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#3a5040", fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 14 }}>← Retour</button>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>Parrainage</h1>
        <p style={{ fontSize: 12, color: "#3a5040", marginTop: 4 }}>Gagne 1 mois offert par ami parrainé</p>
      </div>

      <div style={{ padding: "24px 20px", maxWidth: 520, margin: "0 auto" }}>
        {/* Comment ça marche */}
        <div style={{ background: "var(--card)", borderRadius: 16, padding: 20, marginBottom: 20, border: "1.5px solid var(--bo)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mt)", marginBottom: 14 }}>Comment ça marche</p>
          {[
            { n: "1", t: "Partage ton code", d: "Envoie ton code à un ami créateur de contenu." },
            { n: "2", t: "Il s'abonne", d: "Il entre ton code au moment du paiement → il reçoit 30 jours offerts." },
            { n: "3", t: "Tu gagnes 1 mois", d: "Un crédit d'1 mois est automatiquement appliqué à ton prochain paiement." },
          ].map(({ n, t, d }) => (
            <div key={n} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--r)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{n}</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{t}</p>
                <p style={{ fontSize: 13, color: "var(--mt)", lineHeight: 1.5 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Ton code */}
        <div style={{ background: "var(--tx)", borderRadius: 16, padding: 24, marginBottom: 20, textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--r)", marginBottom: 12 }}>Ton code de parrainage</p>
          {loading ? (
            <p style={{ color: "#3a5040", fontSize: 14 }}>Chargement…</p>
          ) : code ? (
            <>
              <div style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: 4, marginBottom: 16 }}>{code}</div>
              <button onClick={copy} style={{ background: copied ? "#2a6040" : "var(--r)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)", transition: "background .2s" }}>
                {copied ? "✓ Copié !" : "Copier le code"}
              </button>
            </>
          ) : (
            <p style={{ color: "var(--mt)", fontSize: 13 }}>Impossible de charger ton code</p>
          )}
        </div>

        {/* Stats */}
        <div style={{ background: "var(--card)", borderRadius: 14, padding: 20, border: "1.5px solid var(--bo)", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 48, fontWeight: 900, color: "var(--r)", lineHeight: 1 }}>{count}</div>
          <p style={{ fontSize: 14, color: "var(--mt)", marginTop: 6 }}>ami{count !== 1 ? "s" : ""} parrainé{count !== 1 ? "s" : ""}</p>
          {count > 0 && <p style={{ fontSize: 12, color: "var(--r)", fontWeight: 700, marginTop: 8 }}>{count} mois offert{count !== 1 ? "s" : ""} sur ton abonnement</p>}
        </div>
      </div>
    </div>
  );
}

// ── ÉCRAN MES SÉRIES ─────────────────────────────────────────
function MesSeriesView({ onLoad, onBack, customerId }) {
  const [local, setLocal] = useState(() => loadSaved());
  const [cloud, setCloud] = useState([]);
  const [loadingCloud, setLoadingCloud] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, source }
  const [renaming, setRenaming] = useState(null); // { id, source, value }
  const renameRef = useRef(null);

  useEffect(() => {
    cloudList(customerId).then(list => { setCloud(list); setLoadingCloud(false); });
  }, [customerId]);

  useEffect(() => {
    if (renaming) setTimeout(() => renameRef.current?.focus(), 50);
  }, [renaming]);

  // Liste unifiée : cloud en priorité, local dédupliqué par titre
  const cloudTitres = new Set(cloud.map(s => s.titre || s.bible?.titre));
  const localOnly = local.filter(s => !cloudTitres.has(s.bible?.titre || s.titre));
  const merged = [
    ...cloud.map(s => ({ ...s, _source: "cloud" })),
    ...localOnly.map(s => ({ ...s, _source: "local" })),
  ].sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

  const doLoad = async (entry) => {
    if (entry._source === "cloud") {
      const full = await cloudLoad(entry.id, customerId);
      if (full) onLoad(full);
    } else {
      onLoad(entry);
    }
  };

  const doDelete = async () => {
    const { id, source } = confirmDelete;
    if (source === "cloud") {
      await cloudDelete(id, customerId);
      setCloud(prev => prev.filter(s => String(s.id) !== String(id)));
    } else {
      deleteSerie(id);
      setLocal(loadSaved());
    }
    setConfirmDelete(null);
  };

  const doRename = async () => {
    const { id, source, value } = renaming;
    if (!value.trim()) { setRenaming(null); return; }
    if (source === "cloud") {
      await cloudRename(id, value.trim(), customerId);
      setCloud(prev => prev.map(s => String(s.id) === String(id) ? { ...s, titre: value.trim() } : s));
    } else {
      renameSerieLocal(id, value.trim());
      setLocal(loadSaved());
    }
    setRenaming(null);
  };

  const total = loadingCloud ? local.length : merged.length;

  return (
    <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <div style={{ background: "var(--tx)", padding: "28px 20px 24px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#3a5040", fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 14 }}>← Retour</button>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>
          Mes Séries {!loadingCloud && <span style={{ fontSize: 16, fontWeight: 400, color: "#3a5040" }}>({total})</span>}
        </h1>
        <p style={{ fontSize: 12, color: "#3a5040", marginTop: 6 }}>
          {loadingCloud ? "Chargement du cloud…" : `${cloud.length} cloud · ${localOnly.length} local`}
        </p>
      </div>

      <div style={{ padding: "20px", maxWidth: 520, margin: "0 auto" }}>
        {loadingCloud && local.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--mt)" }}>
            <p style={{ fontSize: 28, marginBottom: 12, animation: "pulse 1.2s infinite" }}>☁️</p>
            <p>Chargement…</p>
          </div>
        ) : merged.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--mt)" }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>📂</p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>Aucune série sauvegardée</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>Génère ta première série !</p>
          </div>
        ) : merged.map(s => {
          const id = s.id;
          const source = s._source;
          const titre = s.bible?.titre || s.titre || "Sans titre";
          const logline = s.bible?.logline || s.logline || "";
          const mode = s.state?.mode || s.mode;
          const epCount = s.episodes?.length || s.episodesCount || "?";
          const isRenaming = renaming?.id === id && renaming?.source === source;
          const isConfirming = confirmDelete?.id === id && confirmDelete?.source === source;

          return (
            <div key={`${source}-${id}`} style={{ background: "var(--card)", borderRadius: 16, padding: 16, marginBottom: 12, border: `1.5px solid ${isConfirming ? "var(--r)" : "var(--bo)"}`, transition: "border-color .2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {isRenaming ? (
                    <input
                      ref={renameRef}
                      value={renaming.value}
                      onChange={e => setRenaming(r => ({ ...r, value: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter") doRename(); if (e.key === "Escape") setRenaming(null); }}
                      onBlur={doRename}
                      style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 800, width: "100%", border: "none", borderBottom: "2px solid var(--r)", background: "transparent", color: "var(--tx)", outline: "none", padding: "2px 0", marginBottom: 6 }}
                    />
                  ) : (
                    <h3
                      onClick={() => setRenaming({ id, source, value: titre })}
                      title="Appuyer pour renommer"
                      style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 800, marginBottom: 6, cursor: "text", lineHeight: 1.3 }}>
                      {titre}
                    </h3>
                  )}
                  <p style={{ fontSize: 12, color: "var(--mt)", lineHeight: 1.5, marginBottom: 8, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{logline}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: 11, background: mode === "fast" ? "#fff0ec" : "#e8edf2", color: mode === "fast" ? "var(--r)" : "var(--n)", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                      {mode === "fast" ? "⚡ Fast" : "🎭 Premium"}
                    </span>
                    <span style={{ fontSize: 11, background: "var(--bo)", padding: "2px 8px", borderRadius: 4, color: "var(--mt)" }}>{epCount} ép.</span>
                    <span style={{ fontSize: 11, color: "var(--mt)" }}>{new Date(s.savedAt).toLocaleDateString("fr-FR")}</span>
                    <span style={{ fontSize: 11, color: source === "cloud" ? "#4ade80" : "var(--mt)", marginLeft: "auto" }}>{source === "cloud" ? "☁️" : "💾"}</span>
                  </div>
                </div>
              </div>

              {isConfirming ? (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <p style={{ fontSize: 13, color: "var(--r)", flex: 1, fontWeight: 600 }}>Supprimer définitivement ?</p>
                  <button onClick={doDelete} style={{ background: "var(--r)", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)" }}>Oui</button>
                  <button onClick={() => setConfirmDelete(null)} style={{ background: "var(--card)", border: "1.5px solid var(--bo)", color: "var(--tx)", padding: "10px 14px", borderRadius: 10, fontSize: 13, cursor: "pointer", fontFamily: "var(--sans)" }}>Non</button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => doLoad(s)} style={{ flex: 1, background: "var(--r)", color: "#fff", border: "none", padding: "11px 0", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)" }}>
                    Ouvrir →
                  </button>
                  <button onClick={() => setRenaming({ id, source, value: titre })} style={{ background: "var(--card)", border: "1.5px solid var(--bo)", color: "var(--mt)", padding: "11px 14px", borderRadius: 10, fontSize: 13, cursor: "pointer", fontFamily: "var(--sans)" }} title="Renommer">
                    ✏️
                  </button>
                  <button onClick={() => setConfirmDelete({ id, source })} style={{ background: "var(--card)", border: "1.5px solid var(--bo)", color: "var(--mt)", padding: "11px 14px", borderRadius: 10, fontSize: 13, cursor: "pointer", fontFamily: "var(--sans)" }} title="Supprimer">
                    🗑
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── SCREENS ──────────────────────────────────────────────────

// ── AFFICHE ──────────────────────────────────────────────────
function drawPoster(canvas, bible, episodes, mode) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const PAD = 52, RED = "#E85C3A", DARK = "#0F1A12", WHITE = "#fff", GRAY = "#6a7a6e", LGRAY = "#9aaa9e";

  // Fond
  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, W, H);

  // Grain de texture subtil
  for (let i = 0; i < 8000; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.018})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }

  // Barre rouge top
  ctx.fillStyle = RED;
  ctx.fillRect(0, 0, W, 7);

  // Gradient bas
  const grad = ctx.createLinearGradient(0, H * 0.6, 0, H);
  grad.addColorStop(0, "rgba(15,26,18,0)");
  grad.addColorStop(1, "rgba(5,8,6,0.95)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, H * 0.6, W, H * 0.4);

  const wrap = (text, x, y, maxW, lineH, font, color, align = "left") => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    const xPos = align === "center" ? W / 2 : x;
    const words = String(text || "").split(" ");
    let line = "", lines = [];
    for (const w of words) {
      const test = line + w + " ";
      if (ctx.measureText(test).width > maxW && line) { lines.push(line.trim()); line = w + " "; }
      else line = test;
    }
    lines.push(line.trim());
    lines.forEach((l, i) => ctx.fillText(l, xPos, y + i * lineH));
    return lines.length * lineH;
  };

  let y = 56;

  // Logo
  ctx.font = "600 11px sans-serif";
  ctx.fillStyle = GRAY;
  ctx.textAlign = "left";
  ctx.fillText("STUDIO  VERTICAL", PAD, y);

  // Épisodes badge
  ctx.font = "700 11px sans-serif";
  ctx.fillStyle = GRAY;
  ctx.textAlign = "right";
  ctx.fillText(`${episodes.length} ÉP.`, W - PAD, y);
  ctx.textAlign = "left";

  y += 50;

  // Mode badge
  const modeLabel = mode === "fast" ? "⚡ FAST DRAMA" : "🎭 PREMIUM SUSPENSE";
  const badgeW = ctx.measureText(modeLabel).width + 32;
  ctx.fillStyle = mode === "fast" ? "#2a1a14" : "#1a2030";
  roundRect(ctx, PAD, y - 16, badgeW, 28, 6);
  ctx.fill();
  ctx.font = "700 11px sans-serif";
  ctx.fillStyle = mode === "fast" ? RED : "#7090c0";
  ctx.fillText(modeLabel, PAD + 16, y + 4);

  y += 52;

  // Titre
  const titleSize = bible.titre.length > 16 ? 68 : 80;
  y += wrap(bible.titre.toUpperCase(), PAD, y, W - PAD * 2, titleSize * 1.1, `900 ${titleSize}px Georgia, serif`, WHITE);
  y += 10;

  // Ligne rouge
  ctx.fillStyle = RED;
  ctx.fillRect(PAD, y, 60, 4);
  y += 28;

  // Logline
  y += wrap(`« ${bible.logline} »`, PAD, y, W - PAD * 2, 30, "italic 19px Georgia, serif", LGRAY);
  y += 32;

  // Séparateur
  ctx.fillStyle = "#1e2e22";
  ctx.fillRect(PAD, y, W - PAD * 2, 1);
  y += 28;

  // Personnages
  ctx.font = "700 10px sans-serif";
  ctx.fillStyle = RED;
  ctx.fillText("PERSONNAGES", PAD, y);
  y += 22;

  for (const p of (bible.personnages || []).slice(0, 3)) {
    ctx.font = "700 16px Georgia, serif";
    ctx.fillStyle = WHITE;
    ctx.fillText(p.nom, PAD, y);
    ctx.font = "400 13px sans-serif";
    ctx.fillStyle = GRAY;
    ctx.fillText(`  ${p.role} · ${p.age} ans`, PAD + ctx.measureText(p.nom).width + 4, y);
    y += 26;
  }
  y += 16;

  // Séparateur
  ctx.fillStyle = "#1e2e22";
  ctx.fillRect(PAD, y, W - PAD * 2, 1);
  y += 28;

  // Tension centrale
  ctx.font = "700 10px sans-serif";
  ctx.fillStyle = RED;
  ctx.fillText("QUESTION CENTRALE", PAD, y);
  y += 22;
  y += wrap(bible.tension_centrale || "", PAD, y, W - PAD * 2, 26, "italic 17px Georgia, serif", LGRAY);
  y += 28;

  // Accroche TikTok (grande, en bas)
  const aY = H - 100;
  ctx.fillStyle = "#1e2e22";
  ctx.fillRect(PAD, aY - 20, W - PAD * 2, 1);
  ctx.font = "700 10px sans-serif";
  ctx.fillStyle = RED;
  ctx.textAlign = "left";
  ctx.fillText("ACCROCHE TIKTOK", PAD, aY);
  wrap(bible.accroche || "", PAD, aY + 22, W - PAD * 2, 30, "italic bold 20px Georgia, serif", WHITE);

  // Bas: studiovertical.app
  ctx.font = "400 11px sans-serif";
  ctx.fillStyle = "#2a3a2e";
  ctx.textAlign = "center";
  ctx.fillText("studiovertical.app", W / 2, H - 22);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function AfficheView({ bible, episodes, mode, onBack, customerId }) {
  const canvasRef = useRef(null);
  const [tab, setTab] = useState("canvas");
  const [aiState, setAiState] = useState("idle"); // idle | loading | done | error
  const [aiUrl, setAiUrl] = useState(null);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    if (canvasRef.current) drawPoster(canvasRef.current, bible, episodes, mode);
  }, [bible, episodes, mode]);

  const downloadCanvas = () => {
    canvasRef.current.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${bible.titre.replace(/\s+/g, "_")}_affiche.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const downloadAi = () => {
    if (!aiUrl) return;
    const a = document.createElement("a");
    a.href = aiUrl;
    a.download = `${bible.titre.replace(/\s+/g, "_")}_affiche_ia.png`;
    a.click();
  };

  const generateAi = async () => {
    setAiState("loading");
    setAiError(null);
    try {
      const res = await fetch("/api/poster", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${customerId}` },
        body: JSON.stringify({
          titre: bible.titre,
          logline: bible.logline,
          ambiance: bible.ambiance,
          personnages: bible.personnages,
          accroche: bible.accroche,
          tension_centrale: bible.tension_centrale,
          mode,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur génération");
      }
      const blob = await res.blob();
      setAiUrl(URL.createObjectURL(blob));
      setAiState("done");
    } catch (e) {
      setAiError(e.message);
      setAiState("error");
    }
  };

  const RED = "#E85C3A", VIO = "#a855f7", DARK = "#080e09", BORDER = "rgba(255,255,255,0.08)", MUTED = "#64748b", TEXT = "#f1f5f9";

  return (
    <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", background: DARK }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}` }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: MUTED, fontSize: 14, cursor: "pointer", padding: 0, fontFamily: "var(--sans)" }}>← Retour</button>
        {tab === "canvas"
          ? <button onClick={downloadCanvas} style={{ background: RED, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)" }}>↓ Télécharger</button>
          : aiState === "done"
            ? <button onClick={downloadAi} style={{ background: `linear-gradient(135deg, ${RED}, ${VIO})`, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)" }}>↓ Télécharger</button>
            : null
        }
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 0, padding: "16px 20px 0", maxWidth: 630, margin: "0 auto" }}>
        {[
          { key: "canvas", label: "📝 Typographique" },
          { key: "ai", label: "🎨 Affiche IA" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
            background: tab === key ? "rgba(255,255,255,0.06)" : "transparent",
            borderBottom: `2px solid ${tab === key ? RED : "transparent"}`,
            color: tab === key ? TEXT : MUTED,
            fontSize: 13, fontWeight: 700, fontFamily: "var(--sans)", transition: "all .15s",
          }}>{label}</button>
        ))}
      </div>

      {/* Canvas tab */}
      {tab === "canvas" && (
        <div style={{ display: "flex", justifyContent: "center", padding: "20px 20px 48px" }}>
          <canvas ref={canvasRef} width={630} height={1120} style={{ maxWidth: "100%", borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,.8)" }} />
        </div>
      )}

      {/* AI tab */}
      {tab === "ai" && (
        <div style={{ padding: "24px 20px 48px", maxWidth: 630, margin: "0 auto" }}>
          {aiState === "idle" && (
            <div style={{ textAlign: "center", padding: "48px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>🎬</div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 900, color: TEXT, marginBottom: 12, letterSpacing: -0.5 }}>
                Affiche cinématique IA
              </h3>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, marginBottom: 28, maxWidth: 320, margin: "0 auto 28px" }}>
                DALL-E 3 génère un visuel 9:16 basé sur l'univers, les personnages et l'ambiance de ta série.
              </p>
              <button onClick={generateAi} style={{
                background: `linear-gradient(135deg, ${RED}, ${VIO})`,
                color: "#fff", border: "none", padding: "16px 36px", borderRadius: 14,
                fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)",
                boxShadow: `0 0 32px rgba(168,85,247,0.3), 0 0 16px rgba(232,92,58,0.2)`,
              }}>
                ✦ Générer l'affiche IA
              </button>
              <p style={{ fontSize: 12, color: MUTED, marginTop: 16 }}>~15 secondes · 1 crédit IA</p>
            </div>
          )}

          {aiState === "loading" && (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", border: `3px solid ${BORDER}`, borderTop: `3px solid ${RED}`, animation: "spin 1s linear infinite", margin: "0 auto 24px" }} />
              <p style={{ fontSize: 15, color: MUTED, marginBottom: 8 }}>Génération en cours…</p>
              <p style={{ fontSize: 13, color: MUTED, opacity: 0.6 }}>DALL-E 3 crée ton affiche 9:16</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          )}

          {aiState === "error" && (
            <div style={{ textAlign: "center", padding: "48px 20px" }}>
              <p style={{ fontSize: 14, color: RED, marginBottom: 20 }}>⚠️ {aiError}</p>
              <button onClick={generateAi} style={{ background: RED, color: "#fff", border: "none", padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)" }}>
                Réessayer
              </button>
            </div>
          )}

          {aiState === "done" && aiUrl && (
            <div>
              {/* Poster image */}
              <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,.8)", marginBottom: 20 }}>
                <img src={aiUrl} alt={bible.titre} style={{ width: "100%", display: "block", borderRadius: 16 }} />
                {/* Title overlay */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 24px 24px", background: "linear-gradient(transparent, rgba(0,0,0,0.88))" }}>
                  <p style={{ fontSize: 10, fontWeight: 800, color: RED, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6, fontFamily: "var(--sans)" }}>
                    {mode === "fast" ? "⚡ FAST DRAMA" : "🎭 PREMIUM SUSPENSE"}
                  </p>
                  <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: -0.5, marginBottom: 8, lineHeight: 1.1 }}>
                    {bible.titre}
                  </h2>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontStyle: "italic", lineHeight: 1.5 }}>
                    {bible.accroche || bible.logline}
                  </p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 12, fontFamily: "var(--sans)", letterSpacing: 1 }}>
                    STUDIOVERTICAL.APP
                  </p>
                </div>
              </div>

              {/* Regenerate */}
              <div style={{ textAlign: "center" }}>
                <button onClick={generateAi} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, color: MUTED, padding: "10px 20px", borderRadius: 10, fontSize: 13, cursor: "pointer", fontFamily: "var(--sans)" }}>
                  ↻ Régénérer
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


const CUSTOM_PREFIX = "__custom__";

function Mixeur({ state, set, onGen, onMesSeries, hasSeries, plan, onShowOnboarding, onParrainage, darkMode, onDarkMode, onLogout, onUpgrade, onUpsell, stats, lastSerie, onResume }) {
  const univOpts = state.mode === "fast" ? OPTS.univers_fast : OPTS.univers_prem;
  const secOpts = state.mode === "fast" ? OPTS.secret_fast : OPTS.secret_prem;
  const totalMin = Math.round(state.format * state.duree / 60);
  const [customInputs, setCustomInputs] = useState({ casting: "", univers: "", secret: "" });

  const isCustom = (key) => state[key]?.startsWith(CUSTOM_PREFIX);
  const customValue = (key) => isCustom(key) ? state[key].slice(CUSTOM_PREFIX.length) : customInputs[key];

  const activateCustom = (key) => {
    const val = customInputs[key] || "";
    set({ [key]: CUSTOM_PREFIX + val });
  };
  const updateCustom = (key, val) => {
    setCustomInputs(p => ({ ...p, [key]: val }));
    set({ [key]: CUSTOM_PREFIX + val });
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <div style={{ background: "var(--tx)", padding: "28px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>VERTICAL STUDIO</h1>
            <p style={{ fontSize: 12, color: "#3a5040", marginTop: 2 }}>Micro-dramas · 1 à 2 min · 9:16</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={onShowOnboarding} style={{ background: "#1a2a1e", border: "1px solid #2a3a2e", color: "#3a5040", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)" }}>?</button>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--r)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: 0.5 }}>REC</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", background: "#1a2a1e", borderRadius: 12, padding: 4 }}>
          {[{ k: "fast", l: "⚡ Fast Drama" }, { k: "premium", l: "🎭 Premium Suspense" }].map(({ k, l }) => {
            const locked = k === "premium" && plan === "standard";
            return (
              <button key={k} onClick={() => { if (locked) { onUpsell?.("mode_premium"); } else set(prev => ({ mode: k, univers: k === "fast" ? OPTS.univers_fast[0] : OPTS.univers_prem[0], secret: k === "fast" ? OPTS.secret_fast[0] : OPTS.secret_prem[0], lieu: k === "fast" ? OPTS.lieu_fast[0] : OPTS.lieu_prem[0], format: k === "fast" && prev.format > 10 ? 10 : prev.format })); }}
                style={{ flex: 1, padding: "10px 12px", borderRadius: 9, border: "none", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, background: state.mode === k ? (k === "fast" ? "var(--r)" : "var(--n)") : "transparent", color: locked ? "#3a5040" : state.mode === k ? "#fff" : "#3a5040", transition: "all .2s", cursor: locked ? "not-allowed" : "pointer", opacity: locked ? 0.5 : 1 }}>
                {l}{locked && " 🔒"}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "24px 20px", maxWidth: 520, margin: "0 auto" }}>
        {plan === "standard" && (
          <div style={{ background: "var(--n)", borderRadius: 14, padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>🎭 Passer à Premium</p>
              <p style={{ fontSize: 12, color: "#8a9a8e", lineHeight: 1.4 }}>90 ép., 4 variations, titres viraux</p>
            </div>
            <button onClick={onUpgrade} style={{ background: "var(--r)", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "var(--sans)", flexShrink: 0 }}>
              Upgrade →
            </button>
          </div>
        )}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mt)", marginBottom: 10 }}>
            🎬 Packs rapides <span style={{ fontSize: 10, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— remplit tout en 1 clic</span>
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PACKS.map(p => {
              const locked = p.mode === "premium" && plan === "standard";
              return (
                <button key={p.label}
                  onClick={() => { if (!locked) set({ mode: p.mode, casting: p.casting, univers: p.univers, secret: p.secret, format: p.mode === "fast" ? 10 : state.format }); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 20, border: `1.5px solid ${p.mode === "premium" ? "var(--n)" : "var(--bo)"}`, background: p.mode === "premium" ? "var(--n)" : "var(--card)", color: p.mode === "premium" ? "#fff" : "var(--tx)", fontSize: 12, fontWeight: 600, cursor: locked ? "not-allowed" : "pointer", fontFamily: "var(--sans)", whiteSpace: "nowrap", opacity: locked ? 0.45 : 1 }}>
                  <span>{p.emoji}</span><span>{p.label}</span>
                  {p.mode === "premium" && <span style={{ fontSize: 9, background: "rgba(255,255,255,0.2)", padding: "1px 5px", borderRadius: 4, fontWeight: 700, letterSpacing: 0.5 }}>{locked ? "🔒" : "PRO"}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {[
          { label: "Casting", opts: OPTS.casting, key: "casting" },
          { label: "Univers", opts: univOpts, key: "univers" },
          { label: "Secret central", opts: secOpts, key: "secret" },
          { label: "Genre", opts: OPTS.genre, key: "genre" },
          { label: "Lieu unique", opts: state.mode === "fast" ? OPTS.lieu_fast : OPTS.lieu_prem, key: "lieu" },
          { label: "Ambiance narrative", opts: OPTS.ambiance, key: "ambiance" },
        ].map(({ label, opts, key }) => (
          <div key={key} style={{ marginBottom: 22 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mt)", marginBottom: 10 }}>{label}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {opts.map(o => <Chip key={o} label={o} active={state[key] === o} onClick={() => set({ [key]: o })} />)}
              <Chip label="✏️ Perso." active={isCustom(key)} onClick={() => activateCustom(key)} />
            </div>
            {isCustom(key) && (
              <input
                autoFocus
                value={customValue(key)}
                onChange={e => updateCustom(key, e.target.value)}
                placeholder={`Ton ${label.toLowerCase()} personnalisé…`}
                maxLength={100}
                style={{ marginTop: 10, width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--r)", background: "var(--bg)", color: "var(--tx)", fontFamily: "var(--sans)", fontSize: 14, outline: "none" }}
              />
            )}
          </div>
        ))}

        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mt)", marginBottom: 10 }}>Durée par épisode</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ v: 60, l: "1 min", s: "Standard" }, { v: 90, l: "1 min 30", s: "Intense" }, { v: 120, l: "2 min", s: "Épique" }].map(({ v, l, s }) => (
              <Chip key={v} label={l} sub={s} block active={state.duree === v} onClick={() => set({ duree: v })} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mt)", marginBottom: 10 }}>
            Nombre d'épisodes
            {state.mode === "fast" && <span style={{ marginLeft: 8, fontSize: 10, color: "var(--r)", fontWeight: 700 }}>max 10 · 90 ép. en Premium</span>}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {[10, 20, 40, 90].map(f => {
              const locked = state.mode === "fast" && f > 10;
              const premLocked = f === 90 && state.mode === "fast";
              return (
                <div key={f} style={{ flex: 1, position: "relative" }}>
                  <Chip label={`${f} ép.`} sub={locked ? "⚡ Fast" : f === 90 ? "🎭 Pro" : `${Math.round(f * state.duree / 60)} min`} block active={state.format === f && !locked} onClick={() => { if (!locked) set({ format: f }); }} />
                  {locked && <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: "rgba(var(--bg-rgb,242,237,230),0.6)", cursor: "not-allowed" }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* PREVIEW CARD */}
        {(() => {
          const { pitch, ambiance } = buildPreview(state);
          const modeLabel = state.mode === "fast" ? "Fast Drama" : "Premium Suspense";
          const modeColor = state.mode === "fast" ? "var(--r)" : "var(--n)";
          return (
            <div style={{ background: "var(--card)", border: "1.5px solid var(--bo)", borderRadius: 16, padding: "18px 18px 16px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: state.mode === "fast" ? "linear-gradient(90deg,var(--r),transparent)" : "linear-gradient(90deg,var(--n),transparent)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: modeColor, fontFamily: "monospace" }}>{modeLabel}</span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--bo)", display: "inline-block" }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--mt)" }}>{state.format} ép. · {DUR_LABEL[state.duree]} · {totalMin} min</span>
              </div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 15, fontWeight: 700, color: "var(--tx)", lineHeight: 1.6, margin: "0 0 8px" }}>
                {pitch}
              </p>
              {ambiance && (
                <p style={{ fontSize: 11, color: "var(--mt)", fontStyle: "italic" }}>{ambiance}</p>
              )}
            </div>
          );
        })()}

        <button onClick={onGen} style={{ background: "var(--r)", color: "#fff", border: "none", padding: 18, borderRadius: 14, width: "100%", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          ▶ Générer cette série
        </button>
        {lastSerie && (
          <button onClick={onResume} style={{ background: "var(--card)", border: "1.5px solid var(--r)", color: "var(--r)", padding: 14, borderRadius: 14, width: "100%", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 10, fontFamily: "var(--sans)" }}>
            ▶ Reprendre — {lastSerie.bible?.titre}
          </button>
        )}
        {stats?.series > 0 && (
          <p style={{ fontSize: 11, color: "var(--mt)", textAlign: "center", marginTop: 10 }}>
            🎬 {stats.series} série{stats.series > 1 ? "s" : ""} · {stats.scripts} script{stats.scripts > 1 ? "s" : ""} · {stats.minutes} min générés
          </p>
        )}
        {hasSeries && (
          <button onClick={onMesSeries} style={{ background: "none", border: "1.5px solid var(--bo)", color: "var(--tx)", padding: 14, borderRadius: 14, width: "100%", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 10, fontFamily: "var(--sans)" }}>
            📂 Mes séries sauvegardées
          </button>
        )}
        <button onClick={onParrainage} style={{ background: "none", border: "1.5px solid var(--bo)", color: "var(--tx)", padding: 14, borderRadius: 14, width: "100%", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 10, fontFamily: "var(--sans)" }}>
          🎁 Parrainer un ami — 1 mois offert
        </button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--bo)" }}>
          <button onClick={onDarkMode} style={{ background: "none", border: "none", fontSize: 18, color: "var(--mt)", padding: "8px 4px", cursor: "pointer", lineHeight: 1 }} title={darkMode ? "Mode jour" : "Mode nuit"}>{darkMode ? "☀️" : "🌙"}</button>
          <button onClick={onLogout} style={{ background: "none", border: "none", fontSize: 12, color: "var(--mt)", cursor: "pointer", padding: "8px 0" }}>Déconnexion</button>
        </div>
      </div>
    </div>
  );
}

function BibleView({ bible, episodes, mode, duree, onEp, onBack, onAffiche, customerId, plan, onUpsell, tourStep, onTourDismiss }) {
  const [tab, setTab] = useState("bible");
  const [titres, setTitres] = useState(null);
  const [loadingTitres, setLoadingTitres] = useState(false);
  const [prod, setProd] = useState(null);
  const [loadingProd, setLoadingProd] = useState(false);
  const [checked, setChecked] = useState({});
  const toggle = (key) => setChecked(p => ({ ...p, [key]: !p[key] }));

  const exportSerie = () => {
    const lines = [];
    const sep = (c = "─", n = 50) => lines.push(c.repeat(n));
    lines.push("VERTICAL STUDIO — Export série");
    lines.push(`Généré le ${new Date().toLocaleDateString("fr-FR")}`);
    sep("═");
    lines.push("");
    lines.push(`TITRE : ${bible.titre}`);
    lines.push(`MODE  : ${mode === "fast" ? "Fast Drama" : "Premium Suspense"} · ${DUR_LABEL[duree]}/épisode`);
    lines.push(`FORMAT: ${episodes.length} épisodes`);
    lines.push("");
    lines.push(`LOGLINE`);
    lines.push(`« ${bible.logline} »`);
    lines.push("");
    lines.push(`PITCH`);
    lines.push(bible.pitch || "");
    lines.push("");
    lines.push(`QUESTION CENTRALE`);
    lines.push(`« ${bible.tension_centrale} »`);
    lines.push("");
    lines.push(`ACCROCHE TIKTOK`);
    lines.push(bible.accroche || "");
    sep();
    lines.push("");
    lines.push("PERSONNAGES");
    lines.push("");
    (bible.personnages || []).forEach(p => {
      lines.push(`${p.nom.toUpperCase()} · ${p.role} · ${p.age} ans`);
      lines.push(`Secret : ${p.secret}`);
      if (p.arc) lines.push(`Arc    : ${p.arc}`);
      lines.push("");
    });
    sep();
    lines.push("");
    lines.push(`SÉQUENCIER — ${episodes.length} ÉPISODES`);
    lines.push("");
    episodes.forEach(ep => {
      lines.push(`ÉP. ${ep.numero} — ${ep.titre}`);
      if (ep.tension) lines.push(`Tension     : ${ep.tension}`);
      if (ep.cliffhanger) lines.push(`Cliffhanger : ${ep.cliffhanger}`);
      lines.push("");
    });
    sep("═");
    lines.push("studiovertical.app");

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bible.titre.replace(/\s+/g, "_")}_serie.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const genTitres = async () => {
    setTab("titres");
    setLoadingTitres(true);
    try {
      const r = await gen("titres", { titre: bible.titre, logline: bible.logline, pitch: bible.pitch, mode }, customerId);
      setTitres(r.titres || []);
    } catch (e) {
      console.error(e);
      setTitres([]);
    }
    setLoadingTitres(false);
  };

  const genProd = async () => {
    setTab("prod");
    if (prod) return;
    setLoadingProd(true);
    try {
      const r = await gen("production", { titre: bible.titre, logline: bible.logline, personnages: bible.personnages, mode }, customerId);
      setProd(r);
    } catch (e) {
      console.error(e);
      setProd({});
    }
    setLoadingProd(false);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <div style={{ padding: "16px 20px 0", maxWidth: 520, margin: "0 auto" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 14, color: "var(--mt)", marginBottom: 14, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 6 }}>← Mixeur</button>
        <div style={{ marginBottom: 10 }}>
          <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, background: mode === "fast" ? "#fff0ec" : "#e8edf2", color: mode === "fast" ? "var(--r)" : "var(--n)", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginRight: 6 }}>
            {mode === "fast" ? "⚡ Fast Drama" : "🎭 Premium Suspense"}
          </span>
          <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, background: "#e8edf2", color: "var(--n)", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
            ⏱ {DUR_LABEL[duree]}/ép.
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 900, letterSpacing: -1, lineHeight: 1.1, flex: 1, margin: 0 }}>{bible.titre}</h1>
          <button onClick={() => {
            const txt = `🎬 ${bible.titre}\n« ${bible.logline} »\n\nGénéré avec Vertical Studio — studiovertical.app`;
            if (navigator.share) { navigator.share({ title: bible.titre, text: txt }).catch(() => {}); }
            else { navigator.clipboard?.writeText(txt).then(() => alert("Copié !")); }
          }} style={{ background: "var(--card)", border: "1.5px solid var(--bo)", borderRadius: 10, padding: "8px 12px", fontSize: 13, cursor: "pointer", flexShrink: 0, fontFamily: "var(--sans)" }} title="Partager">
            🔗 Partager
          </button>
        </div>
        <p style={{ fontFamily: "var(--serif)", fontSize: 15, fontStyle: "italic", color: "var(--mt)", lineHeight: 1.5, marginBottom: 12 }}>« {bible.logline} »</p>
        <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{bible.pitch}</p>
        <div style={{ display: "flex", borderBottom: "2px solid var(--bo)", marginBottom: 0 }}>
          {[
            { k: "bible", l: "Bible" },
            { k: "seq", l: `${episodes.length} ép.` },
            { k: "titres", l: plan === "standard" ? "🔒 Titres" : "🔥 Titres" },
            { k: "prod", l: "🎬 Prod" },
          ].map(({ k, l }) => {
            const locked = k === "titres" && plan === "standard";
            const onClick = locked
              ? () => onUpsell?.("titres")
              : k === "titres" ? (titres ? () => setTab("titres") : genTitres)
              : k === "prod" ? genProd
              : () => setTab(k);
            return (
              <button key={k} onClick={onClick}
                style={{ flex: 1, padding: "12px 0", border: "none", background: "none", cursor: locked ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 700, color: locked ? "var(--bo)" : tab === k ? "var(--r)" : "var(--mt)", borderBottom: `2px solid ${tab === k && !locked ? "var(--r)" : "transparent"}`, marginBottom: -2, fontFamily: "var(--sans)" }}>{l}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "20px", maxWidth: 520, margin: "0 auto" }}>
        {tab === "bible" ? (
          <>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mt)", marginBottom: 12 }}>Personnages</p>
            {(bible.personnages || []).map((p, i) => (
              <div key={i} style={{ background: "var(--card)", borderRadius: 12, padding: 16, borderLeft: `4px solid ${i === 0 ? "var(--r)" : "var(--n)"}`, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 700 }}>{p.nom}</span>
                  <span style={{ fontSize: 11, color: i === 0 ? "var(--r)" : "var(--n)", fontWeight: 700, textTransform: "uppercase" }}>{p.role} · {p.age} ans</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--mt)", lineHeight: 1.5 }}>🔒 {p.secret}</p>
              </div>
            ))}
            <div style={{ background: "var(--tx)", borderRadius: 12, padding: 16, marginBottom: 20, marginTop: 4 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--r)", marginBottom: 8 }}>Question centrale</p>
              <p style={{ fontFamily: "var(--serif)", fontSize: 15, fontStyle: "italic", color: "#fff", lineHeight: 1.5 }}>« {bible.tension_centrale} »</p>
            </div>
            <button onClick={() => setTab("seq")} style={{ background: "var(--r)", color: "#fff", border: "none", padding: 18, borderRadius: 14, width: "100%", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
              Voir les {episodes.length} épisodes →
            </button>
            <button onClick={exportSerie} style={{ background: "var(--card)", color: "var(--tx)", border: "1.5px solid var(--bo)", padding: 14, borderRadius: 14, width: "100%", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)", marginBottom: 10 }}>
              ↓ Télécharger la série (.txt)
            </button>
            <div style={{ position: "relative" }}>
              <button onClick={onAffiche} style={{ background: tourStep === 1 ? "rgba(232,92,58,0.06)" : "var(--card)", color: "var(--tx)", border: `1.5px solid ${tourStep === 1 ? "var(--r)" : "var(--bo)"}`, padding: 14, borderRadius: 14, width: "100%", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)", transition: "all .2s" }}>
                🎨 Générer l'affiche IA
              </button>
              {tourStep === 1 && <div style={{ position: "absolute", top: 8, right: -8 }}><TourBeacon text="L'IA génère une affiche cinématique 9:16 pour ta série (DALL-E 3)" side="left" onDismiss={() => {}} /></div>}
            </div>
          </>
        ) : tab === "titres" ? (
          <>
            {loadingTitres ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--mt)" }}>
                <div style={{ fontSize: 28, marginBottom: 12, animation: "pulse 1.2s infinite" }}>🔥</div>
                <p>Analyse de la viralité…</p>
              </div>
            ) : (titres || []).map((t, i) => (
              <div key={i} style={{ background: "var(--card)", borderRadius: 14, padding: 16, marginBottom: 12, border: "1.5px solid var(--bo)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 800, flex: 1 }}>{t.titre}</h3>
                  <div style={{ background: t.score >= 90 ? "var(--r)" : t.score >= 80 ? "#f59e0b" : "var(--n)", color: "#fff", borderRadius: 8, padding: "4px 10px", fontSize: 13, fontWeight: 800, marginLeft: 10, flexShrink: 0 }}>
                    {t.score}
                  </div>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)", marginBottom: 4 }}>« {t.accroche} »</p>
                <p style={{ fontSize: 12, color: "var(--mt)", lineHeight: 1.5 }}>{t.pourquoi}</p>
              </div>
            ))}
          </>
        ) : tab === "prod" ? (
          loadingProd ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--mt)" }}>
              <div style={{ fontSize: 28, marginBottom: 12, animation: "pulse 1.2s infinite" }}>🎬</div>
              <p>Préparation de la fiche technique…</p>
            </div>
          ) : prod ? (
            <>
              {/* Checklist plateau */}
              <div style={{ background: "var(--tx)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--r)", margin: 0 }}>✅ Checklist plateau</p>
                <p style={{ fontSize: 11, color: "#3a5040", margin: 0 }}>{Object.values(checked).filter(Boolean).length}/{(prod.decors||[]).length + (prod.costumes||[]).length + (prod.lieux||[]).length} préparés</p>
              </div>

              {/* Décors */}
              {(prod.decors || []).length > 0 && (
                <>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mt)", marginBottom: 10 }}>🏗 Décors</p>
                  {(prod.decors || []).map((d, i) => {
                    const k = `d${i}`;
                    return (
                      <div key={i} onClick={() => toggle(k)} style={{ background: "var(--card)", borderRadius: 12, padding: 14, borderLeft: `4px solid ${checked[k] ? "#4ade80" : "var(--n)"}`, marginBottom: 10, cursor: "pointer", opacity: checked[k] ? 0.6 : 1, transition: "all .15s" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 16 }}>{checked[k] ? "✅" : "⬜"}</span>
                          <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{d.nom}</p>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--mt)", lineHeight: 1.5, marginBottom: 4, marginLeft: 26 }}>{d.description}</p>
                        {d.ambiance && <p style={{ fontSize: 12, fontStyle: "italic", color: "var(--r)", marginLeft: 26 }}>Ambiance : {d.ambiance}</p>}
                        {d.conseil_tournage && <p style={{ fontSize: 12, color: "var(--mt)", marginTop: 4, marginLeft: 26 }}>💡 {d.conseil_tournage}</p>}
                      </div>
                    );
                  })}
                </>
              )}

              {/* Costumes */}
              {(prod.costumes || []).length > 0 && (
                <>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mt)", margin: "20px 0 10px" }}>👗 Costumes</p>
                  {(prod.costumes || []).map((c, i) => {
                    const k = `c${i}`;
                    return (
                      <div key={i} onClick={() => toggle(k)} style={{ background: "var(--card)", borderRadius: 12, padding: 14, borderLeft: `4px solid ${checked[k] ? "#4ade80" : i === 0 ? "var(--r)" : "var(--n)"}`, marginBottom: 10, cursor: "pointer", opacity: checked[k] ? 0.6 : 1, transition: "all .15s" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <span style={{ fontSize: 16 }}>{checked[k] ? "✅" : "⬜"}</span>
                          <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{c.personnage}</p>
                          {c.couleurs && <span style={{ fontSize: 11, color: "var(--mt)", fontStyle: "italic" }}>{c.couleurs}</span>}
                        </div>
                        <p style={{ fontSize: 13, color: "var(--mt)", lineHeight: 1.5, marginBottom: c.symbolique ? 4 : 0, marginLeft: 26 }}>{c.look}</p>
                        {c.symbolique && <p style={{ fontSize: 12, color: "var(--r)", fontStyle: "italic", marginLeft: 26 }}>🎭 {c.symbolique}</p>}
                      </div>
                    );
                  })}
                </>
              )}

              {/* Lieux */}
              {(prod.lieux || []).length > 0 && (
                <>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mt)", margin: "20px 0 10px" }}>📍 Lieux de tournage</p>
                  {(prod.lieux || []).map((l, i) => {
                    const k = `l${i}`;
                    return (
                      <div key={i} onClick={() => toggle(k)} style={{ background: "var(--card)", borderRadius: 12, padding: 14, marginBottom: 10, border: `1.5px solid ${checked[k] ? "#4ade80" : "var(--bo)"}`, cursor: "pointer", opacity: checked[k] ? 0.6 : 1, transition: "all .15s" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <span style={{ fontSize: 16 }}>{checked[k] ? "✅" : "⬜"}</span>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--r)", margin: 0 }}>{l.type}</p>
                        </div>
                        {(l.exemples || []).map((e, j) => (
                          <p key={j} style={{ fontSize: 13, color: "var(--mt)", lineHeight: 1.4, marginBottom: 2, marginLeft: 26 }}>· {e}</p>
                        ))}
                        {l.lumiere && <p style={{ fontSize: 12, marginTop: 6, color: "var(--tx)", marginLeft: 26 }}>☀️ Lumière : {l.lumiere}</p>}
                        {l.heure_ideale && <p style={{ fontSize: 12, color: "var(--mt)", marginLeft: 26 }}>🕐 Idéal : {l.heure_ideale}</p>}
                      </div>
                    );
                  })}
                </>
              )}
            </>
          ) : null
        ) : (
          (episodes || []).map((ep, i) => (
            <div key={i} onClick={() => onEp(i)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, background: "var(--card)", cursor: "pointer", border: `1.5px solid ${tourStep === 1 && i === 0 ? "var(--r)" : "transparent"}`, marginBottom: 8, transition: "all .15s", position: "relative" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--r)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = tourStep === 1 && i === 0 ? "var(--r)" : "transparent"}>
              <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: "var(--r)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 14, fontWeight: 900, color: "#fff" }}>{ep.numero}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{ep.titre}</p>
                <Dots t={ep.tension} />
                <p style={{ fontSize: 12, color: "var(--mt)", marginTop: 4, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>🎬 {ep.cliffhanger}</p>
              </div>
              {tourStep === 1 && i === 0
                ? <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}><TourBeacon text="Clique pour générer le script de cet épisode →" side="left" onDismiss={onTourDismiss} /></div>
                : <span style={{ color: "var(--mt)", fontSize: 18, flexShrink: 0 }}>→</span>
              }
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StudioView({ bible, ep, script, loading, duree, onEdit, onTournage, onBack, onExport, onVariations, plan, customerId, onUpsell, tourStep, onTourDismiss }) {
  const [showTrad, setShowTrad] = useState(false);
  const [tradLoading, setTradLoading] = useState(false);
  const [tradScript, setTradScript] = useState(null);
  const [activeLang, setActiveLang] = useState(null);

  const displayScript = tradScript || script;

  const traduire = async (code) => {
    if (code === activeLang) { setTradScript(null); setActiveLang(null); return; }
    setTradLoading(true);
    try {
      const r = await gen("traduire", { script, langue: code }, customerId);
      setTradScript(r);
      setActiveLang(code);
    } catch (e) {
      console.error(e);
    }
    setTradLoading(false);
  };

  // Reset translation when script changes
  useEffect(() => {
    setTradScript(null);
    setActiveLang(null);
    setShowTrad(false);
  }, [script]);

  return (
    <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <div style={{ padding: "16px 20px 0", maxWidth: 520, margin: "0 auto" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 14, color: "var(--mt)", marginBottom: 14, cursor: "pointer", padding: 0 }}>← {bible?.titre}</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ background: "var(--r)", color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>ÉP. {ep?.numero}</span>
          <span style={{ background: "var(--n)", color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>⏱ {DUR_LABEL[duree]}</span>
          <span style={{ fontFamily: "var(--serif)", fontSize: 19, fontWeight: 700 }}>{ep?.titre}</span>
        </div>
        <Dots t={ep?.tension} />
      </div>
      <div style={{ padding: "16px 20px 60px", maxWidth: 520, margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 14, animation: "pulse 1.2s infinite" }}>📝</div>
            <p style={{ fontSize: 14, color: "var(--mt)" }}>Écriture du script ({DUR_LABEL[duree]})…</p>
          </div>
        ) : displayScript ? (
          <>
            {/* Traduction */}
            <div style={{ marginBottom: 14 }}>
              <button onClick={() => setShowTrad(s => !s)} style={{ background: showTrad ? "var(--n)" : "var(--card)", color: showTrad ? "#fff" : "var(--tx)", border: `1.5px solid ${showTrad ? "var(--n)" : "var(--bo)"}`, padding: "9px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)", display: "flex", alignItems: "center", gap: 6 }}>
                🌍 Traduire {activeLang && `· ${LANGUES.find(l => l.code === activeLang)?.flag}`}
              </button>
              {showTrad && (
                <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {LANGUES.map(({ code, flag, label }) => (
                    <button key={code} onClick={() => traduire(code)} disabled={tradLoading}
                      style={{ padding: "7px 12px", borderRadius: 20, border: `1.5px solid ${activeLang === code ? "var(--n)" : "var(--bo)"}`, background: activeLang === code ? "var(--n)" : "var(--card)", color: activeLang === code ? "#fff" : "var(--tx)", fontSize: 12, fontWeight: 600, cursor: tradLoading ? "wait" : "pointer", fontFamily: "var(--sans)" }}>
                      {flag} {label}
                    </button>
                  ))}
                  {activeLang && <button onClick={() => { setTradScript(null); setActiveLang(null); }} style={{ padding: "7px 12px", borderRadius: 20, border: "1.5px solid var(--bo)", background: "none", color: "var(--mt)", fontSize: 12, cursor: "pointer", fontFamily: "var(--sans)" }}>↩ Original</button>}
                </div>
              )}
              {tradLoading && <p style={{ fontSize: 12, color: "var(--mt)", marginTop: 6 }}>Traduction en cours…</p>}
            </div>

            <div style={{ background: "#fff5f2", border: "2px solid var(--r)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--r)", marginBottom: 8 }}>⚡ Hook — 3 premières secondes</p>
              <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>{displayScript.hook_scene?.texte}</p>
              <p style={{ fontSize: 12, color: "var(--r)", fontStyle: "italic" }}>[9:16] {displayScript.hook_scene?.visuel_916}</p>
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mt)", marginBottom: 10 }}>
              Script · {DUR_LABEL[duree]} · {(displayScript.scenes || []).length} répliques
            </p>
            {(displayScript.scenes || []).map((s, i) => (
              <div key={i} style={{ background: "var(--card)", borderRadius: 12, padding: 14, borderLeft: "3px solid var(--bo)", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--n)" }}>{s.perso}</p>
                  {s.jeu && <span style={{ fontSize: 10, background: "#f0f4f0", color: "var(--n)", padding: "2px 8px", borderRadius: 20, fontStyle: "italic" }}>{s.jeu}</span>}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 6, fontWeight: 500 }}>{s.dialogue}</p>
                <p style={{ fontSize: 12, color: "var(--mt)", fontStyle: "italic" }}>[9:16] {s.visuel_916}</p>
              </div>
            ))}
            <div style={{ background: "var(--tx)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--r)", marginBottom: 8 }}>🎬 Cliffhanger</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.4 }}>{displayScript.cliffhanger_scene?.texte}</p>
              <p style={{ fontSize: 12, color: "var(--r)", fontStyle: "italic", marginBottom: displayScript.cliffhanger_scene?.label ? 10 : 0 }}>[9:16] {displayScript.cliffhanger_scene?.visuel_916}</p>
              {displayScript.cliffhanger_scene?.label && (
                <span style={{ display: "inline-block", background: "var(--r)", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: 1, textTransform: "uppercase" }}>{displayScript.cliffhanger_scene.label}</span>
              )}
            </div>
            <div className="edit-row" style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              {[["pimenter", "🌶 Pimenter"], ["subtil", "🤫 Subtil"], ["simplifier", "🎬 Simple"]].map(([k, l]) => (
                <button key={k} onClick={() => onEdit(k)} disabled={loading} style={{ flex: 1, minWidth: 80, padding: "12px 6px", borderRadius: 10, border: "1.5px solid var(--bo)", background: "var(--card)", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "var(--sans)", transition: "all .15s" }}>{l}</button>
              ))}
            </div>
            <div className="edit-row" style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {[["rewrite_hook", "⚡ Nouveau hook"], ["rewrite_ending", "🔚 Nouvelle fin"]].map(([k, l]) => (
                <button key={k} onClick={() => onEdit(k)} disabled={loading} style={{ flex: 1, minWidth: 100, padding: "12px 6px", borderRadius: 10, border: "1.5px solid var(--bo)", background: "var(--card)", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "var(--sans)", transition: "all .15s" }}>{l}</button>
              ))}
            </div>
            <button onClick={plan === "standard" ? () => onUpsell?.("variations") : onVariations} disabled={loading} style={{ background: plan === "standard" ? "rgba(168,85,247,0.06)" : "var(--card)", color: plan === "standard" ? "#a855f7" : "var(--tx)", border: `1.5px solid ${plan === "standard" ? "rgba(168,85,247,0.25)" : "var(--bo)"}`, padding: 14, borderRadius: 12, width: "100%", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 10, fontFamily: "var(--sans)" }}>{plan === "standard" ? "✦ Générer 4 versions — Premium" : "🎲 Générer 4 versions"}</button>
            <div style={{ position: "relative" }}>
              <button onClick={onTournage} style={{ background: "var(--n)", color: "#fff", border: `2px solid ${tourStep === 3 ? "var(--r)" : "transparent"}`, padding: 15, borderRadius: 12, width: "100%", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10, fontFamily: "var(--sans)", transition: "border-color .2s" }}>📱 Mode Tournage</button>
              {tourStep === 3 && <div style={{ position: "absolute", top: 8, right: -8 }}><TourBeacon text="Tourne avec le téléprompteur auto-scroll →" side="left" onDismiss={onTourDismiss} /></div>}
            </div>
            <button onClick={onExport} style={{ background: "var(--card)", color: "var(--tx)", border: "1.5px solid var(--bo)", padding: 14, borderRadius: 12, width: "100%", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)" }}>📄 Exporter en PDF</button>
          </>
        ) : null}
      </div>
    </div>
  );
}

function VariationsView({ variations, loading, ep, onSelect, onBack }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <div style={{ padding: "16px 20px 0", maxWidth: 520, margin: "0 auto" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 14, color: "var(--mt)", marginBottom: 14, cursor: "pointer", padding: 0 }}>← Studio</button>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 900, marginBottom: 4 }}>4 versions</h2>
        <p style={{ fontSize: 13, color: "var(--mt)", marginBottom: 20 }}>Ép. {ep?.numero} · {ep?.titre} — Choisissez la meilleure</p>
      </div>
      <div style={{ padding: "0 20px 40px", maxWidth: 520, margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 16, animation: "pulse 1.2s infinite" }}>🎲</div>
            <p style={{ color: "var(--mt)" }}>Génération de 3 versions en parallèle…</p>
          </div>
        ) : (variations || []).map((v, i) => (
          <div key={i} style={{ background: "var(--card)", borderRadius: 16, padding: 18, marginBottom: 16, border: "1.5px solid var(--bo)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 16, fontWeight: 800 }}>{v.label}</span>
              <button onClick={() => onSelect(v)} style={{ background: "var(--r)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)" }}>
                Choisir →
              </button>
            </div>
            <div style={{ background: "#fff5f2", borderRadius: 10, padding: 12, marginBottom: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "var(--r)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>⚡ Hook</p>
              <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>{v.hook_scene?.texte}</p>
            </div>
            {(v.scenes || []).slice(0, 2).map((s, j) => (
              <div key={j} style={{ borderLeft: "2px solid var(--bo)", paddingLeft: 10, marginBottom: 8 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--n)", textTransform: "uppercase", marginBottom: 3 }}>{s.perso} {s.jeu && <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--mt)" }}>· {s.jeu}</span>}</p>
                <p style={{ fontSize: 13, lineHeight: 1.5 }}>{s.dialogue}</p>
              </div>
            ))}
            {(v.scenes || []).length > 2 && <p style={{ fontSize: 12, color: "var(--mt)", fontStyle: "italic" }}>+ {v.scenes.length - 2} réplique(s)…</p>}
            <div style={{ background: "var(--tx)", borderRadius: 10, padding: 12, marginTop: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "var(--r)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>🎬 Cliffhanger</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>{v.cliffhanger_scene?.texte}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TournageView({ script, ep, duree, onBack }) {
  const [playing, setPlaying] = useState(false);
  const [fontSize, setFontSize] = useState(28);
  const [speed, setSpeed] = useState(duree <= 60 ? 50 : duree <= 90 ? 70 : 90);
  const [showSettings, setShowSettings] = useState(false);
  const [darkBg, setDarkBg] = useState(true);
  const [animKey, setAnimKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (playing) {
      startTimeRef.current = Date.now() - progress * speed * 10;
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const pct = Math.min(100, (elapsed / speed) * 100);
        setProgress(pct);
        if (pct >= 100) { setPlaying(false); clearInterval(timerRef.current); }
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, speed]);

  const restart = () => {
    setPlaying(false);
    setProgress(0);
    setAnimKey(k => k + 1);
    startTimeRef.current = null;
  };

  const bg = darkBg ? "#000" : "#fff";
  const fg = darkBg ? "#fff" : "#111";
  const mutedFg = darkBg ? "#555" : "#aaa";

  if (!script) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#888", marginBottom: 20 }}>Script non disponible</p>
        <button onClick={onBack} style={{ background: "var(--r)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, cursor: "pointer", fontFamily: "var(--sans)", fontWeight: 700 }}>← Retour</button>
      </div>
    </div>
  );

  const lines = [];
  if (script.hook_scene) { lines.push({ t: "lbl", v: "⚡ HOOK" }); lines.push({ t: "txt", v: script.hook_scene.texte }); lines.push({ t: "stg", v: script.hook_scene.visuel_916 }); }
  (script.scenes || []).forEach(s => { lines.push({ t: "nm", v: s.perso, jeu: s.jeu }); lines.push({ t: "txt", v: s.dialogue }); lines.push({ t: "stg", v: s.visuel_916 }); });
  if (script.cliffhanger_scene) { lines.push({ t: "lbl", v: "🎬 CLIFFHANGER" }); lines.push({ t: "txt", v: script.cliffhanger_scene.texte }); if (script.cliffhanger_scene.label) lines.push({ t: "hi", v: script.cliffhanger_scene.label }); }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: bg, color: fg, overflow: "hidden", transition: "background .3s" }}>
      <style>{`
        @keyframes teleprompt-${animKey} { from { transform: translateY(100vh); } to { transform: translateY(-100%); } }
        .tp-content-${animKey} { animation: teleprompt-${animKey} ${speed}s linear; animation-play-state: ${playing ? "running" : "paused"}; animation-fill-mode: both; }
      `}</style>

      {/* Barre du haut */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", background: darkBg ? "#111" : "#f5f5f5", flexShrink: 0, zIndex: 10, gap: 6 }}>
        <button onClick={onBack} style={{ background: "none", border: `1px solid ${darkBg ? "#333" : "#ddd"}`, color: darkBg ? "#aaa" : "#666", cursor: "pointer", padding: "9px 10px", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1, flexShrink: 0 }}>←</button>
        <button onClick={restart} style={{ background: "none", border: `1px solid ${darkBg ? "#333" : "#ddd"}`, color: darkBg ? "#aaa" : "#666", cursor: "pointer", padding: "9px 10px", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1, flexShrink: 0 }}>⏮</button>
        <button onClick={() => setPlaying(p => !p)} style={{ background: playing ? "#333" : "var(--r)", border: "none", cursor: "pointer", padding: "10px 0", borderRadius: 8, fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "var(--sans)", flex: 1 }}>
          {playing ? "⏸" : "▶ Play"}
        </button>
        <button onClick={() => setDarkBg(d => !d)} style={{ background: "none", border: `1px solid ${darkBg ? "#333" : "#ddd"}`, color: darkBg ? "#aaa" : "#666", cursor: "pointer", padding: "9px 10px", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1, flexShrink: 0 }}>
          {darkBg ? "☀️" : "🌙"}
        </button>
        <button onClick={() => setShowSettings(s => !s)} style={{ background: showSettings ? "#333" : "none", border: `1px solid ${darkBg ? "#333" : "#ddd"}`, color: darkBg ? "#aaa" : "#666", cursor: "pointer", padding: "9px 10px", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1, flexShrink: 0 }}>⚙️</button>
      </div>

      {/* Barre de progression */}
      <div style={{ height: 3, background: darkBg ? "#222" : "#e0e0e0", flexShrink: 0 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "var(--r)", transition: "width .1s linear" }} />
      </div>

      {/* Panneau réglages */}
      {showSettings && (
        <div style={{ background: darkBg ? "#1a1a1a" : "#f0f0f0", padding: "14px 18px", flexShrink: 0, borderBottom: `1px solid ${darkBg ? "#333" : "#ddd"}` }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <p style={{ fontSize: 11, color: darkBg ? "#888" : "#999", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Taille — {fontSize}px</p>
              <input type="range" min={18} max={44} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--r)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <p style={{ fontSize: 11, color: darkBg ? "#888" : "#999", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Vitesse — {speed}s</p>
              <input type="range" min={20} max={150} value={speed} onChange={e => { setSpeed(Number(e.target.value)); restart(); }} style={{ width: "100%", accentColor: "var(--r)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: darkBg ? "#555" : "#bbb", marginTop: 4 }}>
                <span>⚡ Rapide</span><span>🐢 Lent</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zone téléprompteur */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <div className={`tp-content-${animKey}`} style={{ padding: "0 28px", willChange: "transform" }}>
          {lines.map((l, i) => {
            if (l.t === "lbl") return <p key={i} style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "var(--r)", marginBottom: 8, marginTop: 40, textAlign: "center" }}>{l.v}</p>;
            if (l.t === "nm") return <div key={i} style={{ textAlign: "center", marginTop: 32, marginBottom: 6 }}><p style={{ fontSize: Math.round(fontSize * 0.5), fontWeight: 700, color: "#facc15", letterSpacing: 2, textTransform: "uppercase" }}>{l.v}</p>{l.jeu && <p style={{ fontSize: 11, color: mutedFg, fontStyle: "italic", marginTop: 2 }}>{l.jeu}</p>}</div>;
            if (l.t === "txt") return <p key={i} style={{ fontFamily: "var(--serif)", fontSize, color: fg, lineHeight: 1.6, marginBottom: 12, fontWeight: 700, textAlign: "center" }}>{l.v}</p>;
            if (l.t === "stg") return <p key={i} style={{ fontSize: 12, color: mutedFg, fontStyle: "italic", marginBottom: 28, textAlign: "center" }}>[{l.v}]</p>;
            if (l.t === "hi") return <div key={i} style={{ textAlign: "center", marginTop: 10, marginBottom: 28 }}><span style={{ display: "inline-block", background: "var(--r)", borderRadius: 6, padding: "8px 20px", fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: 2, textTransform: "uppercase" }}>{l.v}</span></div>;
            return null;
          })}
          <div style={{ height: "100vh" }} />
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState(null);
  const [plan, setPlan] = useState("standard");
  const [checking, setChecking] = useState(true);
  const [screen, setScreen] = useState("mix");
  const [darkMode, setDarkMode] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [stats, setStats] = useState({ series: 0, scripts: 0, minutes: 0 });
  const [lastSerie, setLastSerie] = useState(null);
  const [upsell, setUpsell] = useState(null);

  // Streaming & loading
  const [loadProgress, setLoadProgress] = useState(0);
  const [streamBible, setStreamBible] = useState(null);
  const [rawStream, setRawStream] = useState("");

  useEffect(() => {
    try {
      if (localStorage.getItem("vs_theme") === "dark") setDarkMode(true);
      setSavedCount(JSON.parse(localStorage.getItem(SAVE_KEY) || "[]").length);
      const storedPlan = localStorage.getItem("vs_plan");
      if (storedPlan) setPlan(storedPlan);
      if (!localStorage.getItem("vs_onboarded")) setShowOnboarding(true);
      setStats(getStats());
      setLastSerie(loadLastOpen());
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "");
    try { localStorage.setItem("vs_theme", darkMode ? "dark" : "light"); } catch {}
  }, [darkMode]);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    try { localStorage.setItem("vs_onboarded", "1"); } catch {}
  };

  const launchOnboarding = (pack) => {
    setState(s => ({ ...s, mode: pack.mode, casting: pack.casting, univers: pack.univers, secret: pack.secret }));
    dismissOnboarding();
    setTimeout(() => generate(pack), 50);
  };

  const [state, setState] = useState({ mode: "fast", casting: OPTS.casting[0], univers: OPTS.univers_fast[0], secret: OPTS.secret_fast[0], genre: OPTS.genre[0], lieu: OPTS.lieu_fast[0], ambiance: OPTS.ambiance[0], format: 10, duree: 60 });
  const [bible, setBible] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [epIdx, setEpIdx] = useState(0);
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("Initialisation…");
  const [err, setErr] = useState(null);

  const set = (patch) => setState(prev => ({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) }));
  const cleanState = (s) => ({
    ...s,
    casting: s.casting?.startsWith(CUSTOM_PREFIX) ? s.casting.slice(CUSTOM_PREFIX.length) : s.casting,
    univers: s.univers?.startsWith(CUSTOM_PREFIX) ? s.univers.slice(CUSTOM_PREFIX.length) : s.univers,
    secret: s.secret?.startsWith(CUSTOM_PREFIX) ? s.secret.slice(CUSTOM_PREFIX.length) : s.secret,
  });

  // Auth
  useEffect(() => {
    if (!router.isReady) return;
    const stored = localStorage.getItem("vs_customer");
    const { session_id, admin } = router.query;
    if (admin && admin === process.env.NEXT_PUBLIC_JETON_ADMIN) {
      localStorage.setItem("vs_customer", admin);
      setCustomerId(admin);
      setChecking(false);
      router.replace("/app");
      return;
    }
    if (session_id) {
      fetch(`/api/session?session_id=${session_id}`)
        .then(r => r.json())
        .then(d => {
          if (d.customerId) {
            localStorage.setItem("vs_customer", d.customerId);
            localStorage.setItem("vs_plan", d.plan || "standard");
            setCustomerId(d.customerId);
            setPlan(d.plan || "standard");
            router.replace("/app");
          }
        })
        .finally(() => setChecking(false));
    } else if (stored) {
      fetch("/api/verify-plan", {
        method: "POST",
        headers: { Authorization: `Bearer ${stored}` },
      })
        .then(r => r.json())
        .then(d => {
          if (d.active) {
            setCustomerId(stored);
            setPlan(d.plan || "standard");
            localStorage.setItem("vs_plan", d.plan || "standard");
          } else {
            localStorage.removeItem("vs_customer");
            localStorage.removeItem("vs_plan");
          }
        })
        .catch(() => { setCustomerId(stored); })
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [router.isReady, router.query]);

  // Apply preset from /exemples "Générer une série similaire"
  useEffect(() => {
    if (!customerId) return;
    try {
      const raw = sessionStorage.getItem("vs_preset");
      if (!raw) return;
      sessionStorage.removeItem("vs_preset");
      const preset = JSON.parse(raw);
      setState(prev => ({
        ...prev,
        ...(preset.mode ? { mode: preset.mode } : {}),
        ...(preset.casting ? { casting: preset.casting } : {}),
        ...(preset.univers ? { univers: preset.univers } : {}),
        ...(preset.secret ? { secret: preset.secret } : {}),
        ...(preset.lieu ? { lieu: preset.lieu } : {}),
      }));
      setScreen("mix");
    } catch {}
  }, [customerId]);

  const logout = () => { localStorage.removeItem("vs_customer"); localStorage.removeItem("vs_plan"); setCustomerId(null); setPlan("standard"); };

  const openPortal = async () => {
    try {
      const res = await fetch("/api/portal", { method: "POST", headers: { Authorization: `Bearer ${customerId}` } });
      const { url, error } = await res.json();
      if (error) { alert(error); return; }
      window.location.href = url;
    } catch (e) { alert("Impossible d'ouvrir le portail. Réessaie."); }
  };

  // Generation avec streaming bible
  const generate = async (overrideState) => {
    setErr(null);
    setScreen("load");
    setLoadMsg("Connexion au générateur…");
    setStreamBible(null);
    setRawStream("");
    setLoadProgress(0);

    const activeState = overrideState ? { ...state, mode: overrideState.mode, casting: overrideState.casting, univers: overrideState.univers, secret: overrideState.secret } : state;

    try {
      setLoadMsg("Création de la bible…");
      let accumulated = "";

      const b = await genBibleStream(cleanState(activeState), customerId, (chunk) => {
        accumulated += chunk;
        setRawStream(accumulated);
        // Extraire les champs visibles au fur et à mesure
        const titre = /"titre"\s*:\s*"([^"]{3,})"/.exec(accumulated)?.[1];
        const logline = /"logline"\s*:\s*"([^"]{10,})"/.exec(accumulated)?.[1];
        if (titre || logline) setStreamBible({ titre, logline });
      });

      setBible(b);
      setStreamBible(b);

      const totalBatches = Math.ceil(activeState.format / 10);
      let completedBatches = 0;
      const batches = [];
      for (let i = 0; i < state.format; i += 10) {
        const from = i + 1, to = Math.min(i + 10, activeState.format);
        const batchNum = Math.floor(i / 10) + 1;
        batches.push(
          gen("episodes", { titre: b.titre, logline: b.logline, mode: activeState.mode, from, to, total: activeState.format }, customerId)
            .then(result => {
              completedBatches++;
              setLoadProgress(Math.round((completedBatches / totalBatches) * 100));
              setLoadMsg(`Épisodes ${from}–${to} générés… (${batchNum}/${totalBatches})`);
              return result;
            })
        );
      }
      setLoadMsg(`Génération des ${activeState.format} épisodes…`);
      const results = await Promise.all(batches);
      const eps = results.flatMap(r => r.episodes || []);
      setEpisodes(eps);

      saveSerie(b, eps, activeState);
      saveLastOpen(b, eps, activeState);
      incStats({ series: 1, minutes: Math.round(activeState.format * activeState.duree / 60) });
      setSavedCount(loadSaved().length);
      setStats(getStats());
      setLastSerie({ bible: b, episodes: eps, state: activeState });
      // Sync cloud (fire and forget)
      cloudSave(b, eps, activeState, customerId);

      setScreen("bible");
      // Tour : montrer le tip "ouvre un épisode" si première génération
      try { if (!localStorage.getItem("vs_tour_done")) setTourStep(1); } catch {}
    } catch (e) {
      setErr(e.message);
    }
  };

  const loadSerie = (s) => {
    setBible(s.bible);
    setEpisodes(s.episodes);
    setState(prev => ({ ...prev, ...s.state }));
    saveLastOpen(s.bible, s.episodes, s.state);
    setLastSerie(s);
    setScript(null);
    setScreen("bible");
  };

  const openEp = async (idx) => {
    setEpIdx(idx);
    setScript(null);
    setScreen("studio");
    setLoading(true);
    setErr(null);
    try {
      const prevEps = episodes.slice(0, idx).map(e => ({ numero: e.numero, titre: e.titre, cliffhanger: e.cliffhanger }));
      const s = await gen("script", { ep: episodes[idx], bible, mode: state.mode, duree: state.duree, prevEps }, customerId);
      setScript(s);
      incStats({ scripts: 1 });
      setStats(getStats());
      // Tour : avancer au tip "mode tournage" après le premier script
      setTourStep(t => t === 2 ? 3 : t);
    } catch (e) {
      console.error(e);
      setErr(e.message);
      setScreen("bible");
    }
    setLoading(false);
  };

  const editScript = async (type) => {
    setLoading(true);
    try {
      const u = await gen("edit", { script, type, duree: state.duree }, customerId);
      setScript(u);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const [variations, setVariations] = useState(null);
  const [loadingVariations, setLoadingVariations] = useState(false);

  const genVariations = async () => {
    setVariations(null);
    setLoadingVariations(true);
    setScreen("variations");
    try {
      const r = await gen("variations", { ep: episodes[epIdx], bible, mode: state.mode, duree: state.duree }, customerId);
      setVariations(r.variations || []);
    } catch (e) { console.error(e); }
    setLoadingVariations(false);
  };

  const selectVariation = (v) => { setScript(v); setScreen("studio"); };

  const exportScript = async () => {
    const b = bible, ep = episodes[epIdx], s = script;
    if (!s) return;

    const jsPDF = window.jspdf?.jsPDF;
    if (!jsPDF) { alert("PDF non disponible, réessayez dans quelques secondes."); return; }
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210, margin = 20, contentW = W - margin * 2;
    const RED = [232, 92, 58], DARK = [15, 26, 18], GRAY = [120, 120, 120];
    let y = margin;

    const addText = (text, opts = {}) => {
      const { size = 11, bold = false, color = [0, 0, 0], italic = false, align = "left", maxWidth = contentW } = opts;
      doc.setFontSize(size);
      doc.setFont("helvetica", bold && italic ? "bolditalic" : bold ? "bold" : italic ? "italic" : "normal");
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(String(text || ""), maxWidth);
      const lineH = size * 0.4;
      if (y + lines.length * lineH > 280) { doc.addPage(); y = margin; }
      doc.text(lines, align === "center" ? W / 2 : margin, y, { align });
      y += lines.length * lineH + 2;
      return lines.length * lineH + 2;
    };
    const addSpace = (h = 4) => { y += h; };
    const addLine = (color = [220, 220, 220]) => { doc.setDrawColor(...color); doc.line(margin, y, W - margin, y); addSpace(4); };
    const addWatermark = () => {
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.07 }));
        doc.setFontSize(38); doc.setFont("helvetica", "bold"); doc.setTextColor(232, 92, 58);
        doc.text("VERTICAL STUDIO", W / 2, 148, { align: "center", angle: 45 });
        doc.restoreGraphicsState();
        doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(180, 180, 180);
        doc.text("vertical-studio.app", W / 2, 293, { align: "center" });
      }
    };

    doc.setFillColor(...RED);
    doc.rect(0, 0, W, 12, "F");
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
    doc.text("VERTICAL STUDIO", margin, 8);
    doc.text(`${b.titre} — Ép. ${ep.numero}`, W - margin, 8, { align: "right" });
    y = 22;

    addText(b.titre.toUpperCase(), { size: 9, bold: true, color: GRAY });
    addText(ep.titre, { size: 22, bold: true });
    addSpace(2);
    addText(`« ${b.logline} »`, { size: 11, italic: true, color: GRAY });
    addSpace(2);
    addText(`Épisode ${ep.numero} · ${DUR_LABEL[state.duree]}`, { size: 10, bold: true, color: RED });
    addSpace(4); addLine(RED);

    addText("⚡ HOOK — 3 PREMIÈRES SECONDES", { size: 8, bold: true, color: RED });
    addSpace(2);
    doc.setFillColor(255, 245, 242);
    const hookH = doc.splitTextToSize(String(s.hook_scene?.texte || ""), contentW - 8).length * 4.5 + 12;
    doc.roundedRect(margin, y, contentW, hookH, 3, 3, "F");
    y += 4;
    addText(s.hook_scene?.texte, { size: 13, bold: true, maxWidth: contentW - 8 });
    addText(`[9:16] ${s.hook_scene?.visuel_916}`, { size: 9, italic: true, color: RED, maxWidth: contentW - 8 });
    y = Math.max(y, margin + 22 + hookH + 4);
    addSpace(6);

    addText(`SCRIPT · ${DUR_LABEL[state.duree]}`, { size: 8, bold: true, color: RED });
    addSpace(3);
    (s.scenes || []).forEach(sc => {
      addText(sc.perso, { size: 9, bold: true, color: DARK });
      addText(sc.dialogue, { size: 12 });
      addText(`[9:16] ${sc.visuel_916}`, { size: 9, italic: true, color: GRAY });
      addSpace(4); addLine();
    });

    addSpace(2);
    doc.setFillColor(...DARK);
    const cliffH = doc.splitTextToSize(String(s.cliffhanger_scene?.texte || ""), contentW - 8).length * 5.5 + 16;
    doc.roundedRect(margin, y, contentW, Math.max(cliffH, 24), 3, 3, "F");
    y += 5;
    addText("🎬 CLIFFHANGER", { size: 8, bold: true, color: RED });
    addSpace(1);
    addText(s.cliffhanger_scene?.texte, { size: 13, bold: true, color: [255, 255, 255], maxWidth: contentW - 8 });
    addText(s.cliffhanger_scene?.visuel_916, { size: 9, italic: true, color: RED, maxWidth: contentW - 8 });
    addSpace(12);
    addWatermark();
    doc.save(`${b.titre.replace(/\s+/g, "_")}_ep${ep.numero}.pdf`);
  };

  // ── Render ──
  if (checking) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#E85C3A", animation: "pulse 1.5s infinite" }} />
    </div>
  );

  if (!customerId) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 40, textAlign: "center", background: "var(--bg)" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Vertical Studio</h1>
          <p style={{ color: "var(--mt)", marginBottom: 28, lineHeight: 1.6 }}>Un abonnement est requis pour accéder à l'application.</p>
          <a href="/" style={{ display: "inline-block", background: "var(--r)", color: "#fff", padding: "16px 32px", borderRadius: 12, fontWeight: 700, fontSize: 15 }}>Voir les tarifs →</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden", background: "var(--bg)" }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes tour-pulse{0%,100%{box-shadow:0 0 0 4px rgba(232,92,58,0.25)}50%{box-shadow:0 0 0 8px rgba(232,92,58,0.08)}}
        @media (max-width: 380px) {
          .edit-row button { font-size: 12px !important; padding: 11px 4px !important; }
        }
        input, textarea, select { font-size: 16px !important; }
      `}</style>

      {showOnboarding && <OnboardingModal onClose={dismissOnboarding} onLaunch={launchOnboarding} />}

      {/* Loading */}
      {screen === "load" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
          {err ? (
            <>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#2a3a2e", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 26 }}>⚠️</div>
              <p style={{ color: "var(--r)", fontSize: 14, lineHeight: 1.7, marginBottom: 28, maxWidth: 340 }}>{err}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                <button onClick={() => { setErr(null); generate(); }} style={{ background: "var(--r)", color: "#fff", border: "none", padding: "14px 24px", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14 }}>↻ Réessayer</button>
                <button onClick={() => { setErr(null); setScreen("mix"); }} style={{ background: "none", border: "1.5px solid var(--bo)", color: "var(--mt)", padding: "14px 24px", borderRadius: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14 }}>← Retour</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--r)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, animation: "pulse 1.5s infinite" }}>
                <span style={{ color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>REC</span>
              </div>
              {streamBible?.titre && (
                <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5, maxWidth: 320 }}>{streamBible.titre}</h2>
              )}
              {streamBible?.logline && (
                <p style={{ fontFamily: "var(--serif)", fontSize: 14, fontStyle: "italic", color: "var(--mt)", lineHeight: 1.5, marginBottom: 16, maxWidth: 300 }}>« {streamBible.logline} »</p>
              )}
              <p style={{ fontSize: 14, color: "var(--mt)", marginBottom: loadProgress > 0 ? 16 : 0 }}>{loadMsg}</p>
              {loadProgress > 0 && (
                <div style={{ width: 200, height: 4, background: "var(--bo)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${loadProgress}%`, background: "var(--r)", transition: "width .3s", borderRadius: 2 }} />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {screen === "mix" && <Mixeur state={state} set={set} onGen={generate} onMesSeries={() => setScreen("mes-series")} hasSeries={savedCount > 0} plan={plan} onShowOnboarding={() => setShowOnboarding(true)} onParrainage={() => setScreen("parrainage")} darkMode={darkMode} onDarkMode={() => setDarkMode(d => !d)} onLogout={logout} onUpgrade={openPortal} onUpsell={setUpsell} stats={stats} lastSerie={lastSerie} onResume={() => lastSerie && loadSerie(lastSerie)} />}
      {screen === "parrainage" && <ParrainageView customerId={customerId} onBack={() => setScreen("mix")} />}
      {screen === "mes-series" && <MesSeriesView onLoad={loadSerie} onBack={() => setScreen("mix")} customerId={customerId} />}
      {screen === "bible" && bible && <BibleView bible={bible} episodes={episodes} mode={state.mode} duree={state.duree} onEp={(idx) => { setTourStep(t => t === 1 ? 2 : t); openEp(idx); }} onBack={() => setScreen("mix")} onAffiche={() => setScreen("affiche")} customerId={customerId} plan={plan} onUpsell={setUpsell} tourStep={tourStep} onTourDismiss={() => setTourStep(0)} />}
      {screen === "affiche" && bible && <AfficheView bible={bible} episodes={episodes} mode={state.mode} onBack={() => setScreen("bible")} customerId={customerId} />}
      {screen === "studio" && <StudioView bible={bible} ep={episodes[epIdx]} script={script} loading={loading} duree={state.duree} onEdit={editScript} onTournage={() => { setTourStep(t => t === 3 ? 4 : t); try { localStorage.setItem("vs_tour_done","1"); } catch {} setScreen("tour"); }} onBack={() => setScreen("bible")} onExport={exportScript} onVariations={genVariations} plan={plan} customerId={customerId} onUpsell={setUpsell} tourStep={tourStep} onTourDismiss={() => setTourStep(0)} />}
      {screen === "variations" && <VariationsView variations={variations} loading={loadingVariations} ep={episodes[epIdx]} onSelect={selectVariation} onBack={() => setScreen("studio")} />}
      {screen === "tour" && <TournageView script={script} ep={episodes[epIdx]} duree={state.duree} onBack={() => setScreen("studio")} />}

      {upsell && <UpsellModal feature={upsell} onUpgrade={() => { setUpsell(null); openPortal(); }} onClose={() => setUpsell(null)} />}

      {/* Logout + dark mode (hidden on mix — gérés dans Mixeur) */}
      {screen !== "tour" && screen !== "mix" && (
        <div style={{ position: "fixed", top: 14, right: 20, zIndex: 100, display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setDarkMode(d => !d)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", lineHeight: 1 }} title={darkMode ? "Mode jour" : "Mode nuit"}>{darkMode ? "☀️" : "🌙"}</button>
          <button onClick={logout} style={{ background: "none", border: "none", fontSize: 12, color: "var(--mt)", cursor: "pointer" }}>Déconnexion</button>
        </div>
      )}
    </div>
  );
}

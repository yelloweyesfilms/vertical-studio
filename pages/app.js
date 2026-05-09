import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

// ── CONFIG ──────────────────────────────────────────────────
const OPTS = {
  casting: ["1 Femme + 1 Homme", "2 Femmes", "2 Hommes", "Trio mixte"],
  univers_fast: ["Hôpital privé", "Milieu corporate", "Famille recomposée", "Mode & Influence", "Sport élite"],
  univers_prem: ["Start-up IA", "Finance internationale", "Héritage familial", "Politique & Pouvoir", "Pharma & Biotech"],
  secret_fast: ["Trahison amoureuse", "Double vie", "Vengeance planifiée", "Enfant caché", "Identité volée"],
  secret_prem: ["Sabotage interne", "Espionnage industriel", "Héritage volé", "Manipulation psychologique", "Complot financier"],
};
const DUR_LABEL = { 60: "1 min", 90: "1 min 30", 120: "2 min" };
const DUR_SCENES = { 60: 5, 90: 7, 120: 10 };

const PACKS = [
  { emoji: "🏥", label: "Médical Secret",   mode: "fast",    casting: "1 Femme + 1 Homme", univers: "Hôpital privé",          secret: "Double vie" },
  { emoji: "💼", label: "Corporate War",    mode: "premium", casting: "2 Hommes",           univers: "Finance internationale", secret: "Sabotage interne" },
  { emoji: "👨‍👩‍👧", label: "Famille Brisée",  mode: "fast",    casting: "Trio mixte",         univers: "Famille recomposée",     secret: "Enfant caché" },
  { emoji: "💕", label: "Amour Interdit",   mode: "fast",    casting: "1 Femme + 1 Homme", univers: "Mode & Influence",        secret: "Trahison amoureuse" },
  { emoji: "🔪", label: "Vengeance",        mode: "premium", casting: "2 Femmes",           univers: "Héritage familial",       secret: "Manipulation psychologique" },
  { emoji: "🤖", label: "IA & Pouvoir",     mode: "premium", casting: "1 Femme + 1 Homme", univers: "Start-up IA",             secret: "Espionnage industriel" },
  { emoji: "🏆", label: "Sport & Trahison", mode: "fast",    casting: "2 Hommes",           univers: "Sport élite",             secret: "Vengeance planifiée" },
  { emoji: "💊", label: "Pharma Noir",      mode: "premium", casting: "1 Femme + 1 Homme", univers: "Pharma & Biotech",        secret: "Complot financier" },
];

// ── API HELPER ───────────────────────────────────────────────
async function gen(action, payload, customerId) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${customerId}`,
    },
    body: JSON.stringify({ action, payload }),
  });
  const d = await res.json();
  if (d.error) throw new Error(d.error);
  return d;
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
      }}
    >
      <span style={{ fontSize: block ? 15 : 13, fontWeight: 700 }}>{label}</span>
      {sub && <span style={{ fontSize: 10, opacity: 0.75 }}>{sub}</span>}
    </div>
  );
}

// ── SAUVEGARDE ───────────────────────────────────────────────
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

// ── ÉCRAN MES SÉRIES ─────────────────────────────────────────
function MesSeriesView({ onLoad, onBack }) {
  const [series, setSeries] = useState(() => loadSaved());

  const handleDelete = (id) => {
    deleteSerie(id);
    setSeries(loadSaved());
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <div style={{ background: "var(--tx)", padding: "28px 20px 24px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#3a5040", fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 14 }}>← Retour</button>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>Mes Séries</h1>
        <p style={{ fontSize: 12, color: "#3a5040", marginTop: 4 }}>{series.length} série{series.length !== 1 ? "s" : ""} sauvegardée{series.length !== 1 ? "s" : ""}</p>
      </div>
      <div style={{ padding: "20px", maxWidth: 520, margin: "0 auto" }}>
        {series.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--mt)" }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>📂</p>
            <p style={{ fontSize: 15 }}>Aucune série sauvegardée</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>Générez votre première série !</p>
          </div>
        ) : series.map(s => (
          <div key={s.id} style={{ background: "var(--card)", borderRadius: 14, padding: 16, marginBottom: 12, border: "1.5px solid var(--bo)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{s.bible.titre}</h3>
                <p style={{ fontSize: 12, color: "var(--mt)", lineHeight: 1.5, marginBottom: 6 }}>{s.bible.logline}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, background: s.state.mode === "fast" ? "#fff0ec" : "#e8edf2", color: s.state.mode === "fast" ? "var(--r)" : "var(--n)", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                    {s.state.mode === "fast" ? "⚡ Fast" : "🎭 Premium"}
                  </span>
                  <span style={{ fontSize: 11, background: "var(--bo)", padding: "2px 8px", borderRadius: 4, color: "var(--mt)" }}>
                    {s.episodes.length} ép.
                  </span>
                  <span style={{ fontSize: 11, color: "var(--mt)" }}>
                    {new Date(s.savedAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => onLoad(s)} style={{ flex: 1, background: "var(--r)", color: "#fff", border: "none", padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)" }}>
                Ouvrir →
              </button>
              <button onClick={() => handleDelete(s.id)} style={{ background: "none", border: "1.5px solid var(--bo)", color: "var(--mt)", padding: "10px 14px", borderRadius: 10, fontSize: 13, cursor: "pointer", fontFamily: "var(--sans)" }}>
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SCREENS ──────────────────────────────────────────────────

const CUSTOM_PREFIX = "__custom__";

function Mixeur({ state, set, onGen, onMesSeries, hasSeries, plan }) {
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
      {/* Header */}
      <div style={{ background: "var(--tx)", padding: "28px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>VERTICAL STUDIO</h1>
            <p style={{ fontSize: 12, color: "#3a5040", marginTop: 2 }}>Micro-dramas · 1 à 2 min · 9:16</p>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--r)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: 0.5 }}>REC</span>
          </div>
        </div>
        <div style={{ display: "flex", background: "#1a2a1e", borderRadius: 12, padding: 4 }}>
          {[{ k: "fast", l: "⚡ Fast Drama" }, { k: "premium", l: "🎭 Premium Suspense" }].map(({ k, l }) => {
            const locked = k === "premium" && plan === "standard";
            return (
              <button key={k} onClick={() => { if (!locked) set(prev => ({ mode: k, univers: k === "fast" ? OPTS.univers_fast[0] : OPTS.univers_prem[0], secret: k === "fast" ? OPTS.secret_fast[0] : OPTS.secret_prem[0], format: k === "fast" && prev.format > 10 ? 10 : prev.format })); }}
                style={{ flex: 1, padding: "10px 12px", borderRadius: 9, border: "none", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, background: state.mode === k ? (k === "fast" ? "var(--r)" : "var(--n)") : "transparent", color: locked ? "#3a5040" : state.mode === k ? "#fff" : "#3a5040", transition: "all .2s", cursor: locked ? "not-allowed" : "pointer", opacity: locked ? 0.5 : 1 }}>
                {l}{locked && " 🔒"}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "24px 20px", maxWidth: 520, margin: "0 auto" }}>

        {/* Packs thématiques */}
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
            {state.mode === "fast" && <span style={{ marginLeft: 8, fontSize: 10, color: "var(--r)", fontWeight: 700 }}>max 10 en Fast</span>}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {[10, 20, 40].map(f => {
              const locked = state.mode === "fast" && f > 10;
              return (
                <div key={f} style={{ flex: 1, position: "relative" }}>
                  <Chip
                    label={`${f} ép.`}
                    sub={locked ? "🎭 Premium" : `${Math.round(f * state.duree / 60)} min`}
                    block
                    active={state.format === f && !locked}
                    onClick={() => { if (!locked) set({ format: f }); }}
                  />
                  {locked && <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: "rgba(var(--bg-rgb,242,237,230),0.6)", cursor: "not-allowed" }} />}
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={onGen} style={{ background: "var(--r)", color: "#fff", border: "none", padding: 18, borderRadius: 14, width: "100%", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          ▶ Générer la série
        </button>
        <p style={{ fontSize: 12, color: "var(--mt)", textAlign: "center", marginTop: 12 }}>
          {state.format} épisodes · {DUR_LABEL[state.duree]} · {totalMin} min de contenu
        </p>
        {hasSeries && (
          <button onClick={onMesSeries} style={{ background: "none", border: "1.5px solid var(--bo)", color: "var(--tx)", padding: 14, borderRadius: 14, width: "100%", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 10, fontFamily: "var(--sans)" }}>
            📂 Mes séries sauvegardées
          </button>
        )}
      </div>
    </div>
  );
}

function BibleView({ bible, episodes, mode, duree, onEp, onBack, customerId, plan }) {
  const [tab, setTab] = useState("bible");
  const [titres, setTitres] = useState(null);
  const [loadingTitres, setLoadingTitres] = useState(false);

  const genTitres = async () => {
    setLoadingTitres(true);
    try {
      const r = await gen("titres", { titre: bible.titre, logline: bible.logline, pitch: bible.pitch, mode }, customerId);
      setTitres(r.titres || []);
      setTab("titres");
    } catch (e) { console.error(e); }
    setLoadingTitres(false);
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
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 900, letterSpacing: -1, lineHeight: 1.1, marginBottom: 10 }}>{bible.titre}</h1>
        <p style={{ fontFamily: "var(--serif)", fontSize: 15, fontStyle: "italic", color: "var(--mt)", lineHeight: 1.5, marginBottom: 12 }}>« {bible.logline} »</p>
        <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{bible.pitch}</p>
        <div style={{ display: "flex", borderBottom: "2px solid var(--bo)", marginBottom: 0 }}>
          {[{ k: "bible", l: "Bible" }, { k: "seq", l: `${episodes.length} ép.` }, { k: "titres", l: plan === "standard" ? "🔒 Titres" : "🔥 Titres" }].map(({ k, l }) => {
            const locked = k === "titres" && plan === "standard";
            return (
              <button key={k} onClick={() => locked ? alert("Les titres viraux sont réservés au plan Premium. Passez à Premium pour débloquer cette fonctionnalité.") : k === "titres" ? (titres ? setTab("titres") : genTitres()) : setTab(k)}
                style={{ flex: 1, padding: "12px 0", border: "none", background: "none", cursor: locked ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700, color: locked ? "var(--bo)" : tab === k ? "var(--r)" : "var(--mt)", borderBottom: `2px solid ${tab === k && !locked ? "var(--r)" : "transparent"}`, marginBottom: -2, fontFamily: "var(--sans)" }}>{l}
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
            <button onClick={() => setTab("seq")} style={{ background: "var(--r)", color: "#fff", border: "none", padding: 18, borderRadius: 14, width: "100%", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Voir les {episodes.length} épisodes →
            </button>
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
        ) : (
          (episodes || []).map((ep, i) => (
            <div key={i} onClick={() => onEp(i)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, background: "var(--card)", cursor: "pointer", border: "1.5px solid transparent", marginBottom: 8, transition: "all .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--r)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
              <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: "var(--r)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 14, fontWeight: 900, color: "#fff" }}>{ep.numero}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{ep.titre}</p>
                <Dots t={ep.tension} />
                <p style={{ fontSize: 12, color: "var(--mt)", marginTop: 4, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>🎬 {ep.cliffhanger}</p>
              </div>
              <span style={{ color: "var(--mt)", fontSize: 18, flexShrink: 0 }}>→</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StudioView({ bible, ep, script, loading, duree, onEdit, onTournage, onBack, onExport, onVariations, plan }) {
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
        ) : script ? (
          <>
            <div style={{ background: "#fff5f2", border: "2px solid var(--r)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--r)", marginBottom: 8 }}>⚡ Hook — 3 premières secondes</p>
              <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>{script.hook_scene?.texte}</p>
              <p style={{ fontSize: 12, color: "var(--r)", fontStyle: "italic" }}>[9:16] {script.hook_scene?.visuel_916}</p>
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mt)", marginBottom: 10 }}>
              Script · {DUR_LABEL[duree]} · {(script.scenes || []).length} répliques
            </p>
            {(script.scenes || []).map((s, i) => (
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
              <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.4 }}>{script.cliffhanger_scene?.texte}</p>
              <p style={{ fontSize: 12, color: "var(--r)", fontStyle: "italic", marginBottom: script.cliffhanger_scene?.label ? 10 : 0 }}>[9:16] {script.cliffhanger_scene?.visuel_916}</p>
              {script.cliffhanger_scene?.label && (
                <span style={{ display: "inline-block", background: "var(--r)", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: 1, textTransform: "uppercase" }}>{script.cliffhanger_scene.label}</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[["pimenter", "🌶 Pimenter"], ["subtil", "🤫 Plus subtil"], ["simplifier", "🎬 Simplifier"]].map(([k, l]) => (
                <button key={k} onClick={() => onEdit(k)} disabled={loading} style={{ flex: 1, padding: "11px 6px", borderRadius: 10, border: "1.5px solid var(--bo)", background: "var(--card)", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "var(--sans)", transition: "all .15s" }}>{l}</button>
              ))}
            </div>
            <button onClick={plan === "standard" ? () => alert("Les variations sont réservées au plan Premium.") : onVariations} disabled={loading} style={{ background: "var(--card)", color: plan === "standard" ? "var(--mt)" : "var(--tx)", border: "1.5px solid var(--bo)", padding: 14, borderRadius: 12, width: "100%", fontSize: 14, fontWeight: 600, cursor: plan === "standard" ? "not-allowed" : "pointer", marginBottom: 10, fontFamily: "var(--sans)", opacity: plan === "standard" ? 0.6 : 1 }}>{plan === "standard" ? "🔒 Générer 3 versions" : "🎲 Générer 3 versions"}</button>
            <button onClick={onTournage} style={{ background: "var(--n)", color: "#fff", border: "none", padding: 15, borderRadius: 12, width: "100%", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10, fontFamily: "var(--sans)" }}>📱 Mode Tournage</button>
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
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 900, marginBottom: 4 }}>3 versions</h2>
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
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#000", color: "#fff", overflow: "hidden" }}>
      <style>{`
        @keyframes teleprompt { from { transform: translateY(100vh); } to { transform: translateY(-100%); } }
        .tp-content { animation: teleprompt ${speed}s linear infinite; animation-play-state: ${playing ? "running" : "paused"}; }
      `}</style>

      {/* Barre du haut */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#111", flexShrink: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #333", color: "#aaa", cursor: "pointer", padding: "8px 12px", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 13 }}>← Retour</button>
        <button onClick={() => setPlaying(p => !p)} style={{ background: playing ? "#333" : "var(--r)", border: "none", cursor: "pointer", padding: "10px 18px", borderRadius: 8, fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "var(--sans)", minWidth: 100 }}>
          {playing ? "⏸ Pause" : "▶ Démarrer"}
        </button>
        <button onClick={() => setShowSettings(s => !s)} style={{ background: showSettings ? "#333" : "none", border: "1px solid #333", color: "#aaa", cursor: "pointer", padding: "8px 12px", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 16 }}>⚙️</button>
      </div>

      {/* Panneau réglages */}
      {showSettings && (
        <div style={{ background: "#1a1a1a", padding: "16px 20px", flexShrink: 0, borderBottom: "1px solid #333" }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <p style={{ fontSize: 11, color: "#888", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Taille du texte — {fontSize}px</p>
              <input type="range" min={18} max={44} value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--r)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", marginTop: 4 }}>
                <span>A</span><span style={{ fontSize: 16 }}>A</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <p style={{ fontSize: 11, color: "#888", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Vitesse — {speed}s</p>
              <input type="range" min={20} max={150} value={speed} onChange={e => setSpeed(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--r)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", marginTop: 4 }}>
                <span>⚡ Rapide</span><span>🐢 Lent</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zone téléprompteur */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <div className="tp-content" style={{ padding: "0 28px", willChange: "transform" }}>
          {lines.map((l, i) => {
            if (l.t === "lbl") return <p key={i} style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "var(--r)", marginBottom: 8, marginTop: 40, textAlign: "center" }}>{l.v}</p>;
            if (l.t === "nm") return <div key={i} style={{ textAlign: "center", marginTop: 32, marginBottom: 6 }}><p style={{ fontSize: Math.round(fontSize * 0.5), fontWeight: 700, color: "#facc15", letterSpacing: 2, textTransform: "uppercase" }}>{l.v}</p>{l.jeu && <p style={{ fontSize: 11, color: "#888", fontStyle: "italic", marginTop: 2 }}>{l.jeu}</p>}</div>;
            if (l.t === "txt") return <p key={i} style={{ fontFamily: "var(--serif)", fontSize, color: "#fff", lineHeight: 1.6, marginBottom: 12, fontWeight: 700, textAlign: "center" }}>{l.v}</p>;
            if (l.t === "stg") return <p key={i} style={{ fontSize: 12, color: "#555", fontStyle: "italic", marginBottom: 28, textAlign: "center" }}>[{l.v}]</p>;
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

  useEffect(() => {
    try {
      if (localStorage.getItem("vs_theme") === "dark") setDarkMode(true);
      setSavedCount(JSON.parse(localStorage.getItem(SAVE_KEY) || "[]").length);
      const storedPlan = localStorage.getItem("vs_plan");
      if (storedPlan) setPlan(storedPlan);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "");
    try { localStorage.setItem("vs_theme", darkMode ? "dark" : "light"); } catch {}
  }, [darkMode]);

  const [state, setState] = useState({ mode: "fast", casting: OPTS.casting[0], univers: OPTS.univers_fast[0], secret: OPTS.secret_fast[0], format: 10, duree: 60 });
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

  // ── Auth: check Stripe session or stored customerId ──
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
        .catch(() => {
          // En cas d'erreur réseau, on fait confiance au localStorage
          setCustomerId(stored);
        })
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [router.isReady, router.query]);

  const logout = () => { localStorage.removeItem("vs_customer"); localStorage.removeItem("vs_plan"); setCustomerId(null); setPlan("standard"); };

  // ── Generation ──
  const generate = async () => {
    setErr(null);
    setScreen("load");
    try {
      setLoadMsg("Création de la bible de la série…");
      const b = await gen("bible", cleanState(state), customerId);
      setBible(b);

      const totalBatches = Math.ceil(state.format / 10);
      const batches = [];
      for (let i = 0; i < state.format; i += 10) {
        const from = i + 1, to = Math.min(i + 10, state.format);
        const batchNum = Math.floor(i / 10) + 1;
        const batchPromise = gen("episodes", { titre: b.titre, logline: b.logline, mode: state.mode, from, to, total: state.format }, customerId)
          .then(result => {
            setLoadMsg(`Épisodes ${from}–${to} générés… (${batchNum}/${totalBatches})`);
            return result;
          });
        batches.push(batchPromise);
      }
      setLoadMsg(`Génération des ${state.format} épisodes…`);
      const results = await Promise.all(batches);
      const eps = results.flatMap(r => r.episodes || []);
      setEpisodes(eps);
      saveSerie(b, eps, state);
      setSavedCount(loadSaved().length);
      setScreen("bible");
    } catch (e) {
      setErr(e.message);
    }
  };

  const loadSerie = (s) => {
    setBible(s.bible);
    setEpisodes(s.episodes);
    setState(prev => ({ ...prev, ...s.state }));
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
      const s = await gen("script", { ep: episodes[idx], bible, mode: state.mode, duree: state.duree }, customerId);
      setScript(s);
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
    } catch (e) {
      console.error(e);
    }
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

  const selectVariation = (v) => {
    setScript(v);
    setScreen("studio");
  };

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
        doc.setFontSize(38);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(232, 92, 58);
        doc.text("VERTICAL STUDIO", W / 2, 148, { align: "center", angle: 45 });
        doc.restoreGraphicsState();
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(180, 180, 180);
        doc.text("vertical-studio.app", W / 2, 293, { align: "center" });
      }
    };

    // En-tête
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
    addSpace(4);
    addLine(RED);

    // Hook
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

    // Scènes
    addText(`SCRIPT · ${DUR_LABEL[state.duree]}`, { size: 8, bold: true, color: RED });
    addSpace(3);
    (s.scenes || []).forEach(sc => {
      addText(sc.perso, { size: 9, bold: true, color: DARK });
      addText(sc.dialogue, { size: 12 });
      addText(`[9:16] ${sc.visuel_916}`, { size: 9, italic: true, color: GRAY });
      addSpace(4);
      addLine();
    });

    // Cliffhanger
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
  if (checking) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}><div style={{ width: 48, height: 48, borderRadius: "50%", background: "#E85C3A", animation: "pulse 1.5s infinite" }} /></div>;

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
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}`}</style>

      {/* Loading */}
      {screen === "load" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
          {err ? (
            <>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#999", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}><span style={{ color: "#fff", fontSize: 20 }}>!</span></div>
              <p style={{ color: "var(--r)", fontSize: 14, lineHeight: 1.7, marginBottom: 24, maxWidth: 340 }}>{err}</p>
              <button onClick={() => setScreen("mix")} style={{ background: "var(--r)", color: "#fff", border: "none", padding: "14px 28px", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)" }}>← Retour</button>
            </>
          ) : (
            <>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--r)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, animation: "pulse 1.5s infinite" }}><span style={{ color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>REC</span></div>
              <p style={{ fontSize: 15, color: "var(--mt)" }}>{loadMsg}</p>
            </>
          )}
        </div>
      )}

      {screen === "mix" && <Mixeur state={state} set={set} onGen={generate} onMesSeries={() => setScreen("mes-series")} hasSeries={savedCount > 0} plan={plan} />}
      {screen === "mes-series" && <MesSeriesView onLoad={loadSerie} onBack={() => setScreen("mix")} />}
      {screen === "bible" && bible && <BibleView bible={bible} episodes={episodes} mode={state.mode} duree={state.duree} onEp={openEp} onBack={() => setScreen("mix")} customerId={customerId} plan={plan} />}
      {screen === "studio" && <StudioView bible={bible} ep={episodes[epIdx]} script={script} loading={loading} duree={state.duree} onEdit={editScript} onTournage={() => setScreen("tour")} onBack={() => setScreen("bible")} onExport={exportScript} onVariations={genVariations} plan={plan} />}
      {screen === "variations" && <VariationsView variations={variations} loading={loadingVariations} ep={episodes[epIdx]} onSelect={selectVariation} onBack={() => setScreen("studio")} />}
      {screen === "tour" && <TournageView script={script} ep={episodes[epIdx]} duree={state.duree} onBack={() => setScreen("studio")} />}

      {/* Logout */}
      {screen !== "tour" && (
        <div style={{ position: "fixed", top: 14, right: 20, zIndex: 100, display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setDarkMode(d => !d)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", lineHeight: 1 }} title={darkMode ? "Mode jour" : "Mode nuit"}>{darkMode ? "☀️" : "🌙"}</button>
          <button onClick={logout} style={{ background: "none", border: "none", fontSize: 12, color: "var(--mt)", cursor: "pointer" }}>Déconnexion</button>
        </div>
      )}
    </div>
  );
}

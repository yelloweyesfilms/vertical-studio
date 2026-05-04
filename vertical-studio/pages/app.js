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

// ── SCREENS ──────────────────────────────────────────────────

function Mixeur({ state, set, onGen }) {
  const univOpts = state.mode === "fast" ? OPTS.univers_fast : OPTS.univers_prem;
  const secOpts = state.mode === "fast" ? OPTS.secret_fast : OPTS.secret_prem;
  const totalMin = Math.round(state.format * state.duree / 60);

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
          {[{ k: "fast", l: "⚡ Fast Drama" }, { k: "premium", l: "🎭 Premium Suspense" }].map(({ k, l }) => (
            <button key={k} onClick={() => set({ mode: k, univers: k === "fast" ? OPTS.univers_fast[0] : OPTS.univers_prem[0], secret: k === "fast" ? OPTS.secret_fast[0] : OPTS.secret_prem[0] })}
              style={{ flex: 1, padding: "10px 12px", borderRadius: 9, border: "none", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, background: state.mode === k ? (k === "fast" ? "var(--r)" : "var(--n)") : "transparent", color: state.mode === k ? "#fff" : "#3a5040", transition: "all .2s", cursor: "pointer" }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 20px", maxWidth: 520, margin: "0 auto" }}>
        {[
          { label: "Casting", opts: OPTS.casting, key: "casting" },
          { label: "Univers", opts: univOpts, key: "univers" },
          { label: "Secret central", opts: secOpts, key: "secret" },
        ].map(({ label, opts, key }) => (
          <div key={key} style={{ marginBottom: 22 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mt)", marginBottom: 10 }}>{label}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {opts.map(o => <Chip key={o} label={o} active={state[key] === o} onClick={() => set({ [key]: o })} />)}
            </div>
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
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mt)", marginBottom: 10 }}>Nombre d'épisodes</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[10, 20, 40].map(f => (
              <Chip key={f} label={`${f} ép.`} sub={`${Math.round(f * state.duree / 60)} min`} block active={state.format === f} onClick={() => set({ format: f })} />
            ))}
          </div>
        </div>

        <button onClick={onGen} style={{ background: "var(--r)", color: "#fff", border: "none", padding: 18, borderRadius: 14, width: "100%", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          ▶ Générer la série
        </button>
        <p style={{ fontSize: 12, color: "var(--mt)", textAlign: "center", marginTop: 12 }}>
          {state.format} épisodes · {DUR_LABEL[state.duree]} · {totalMin} min de contenu
        </p>
      </div>
    </div>
  );
}

function BibleView({ bible, episodes, mode, duree, onEp, onBack }) {
  const [tab, setTab] = useState("bible");
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
          {[{ k: "bible", l: "Bible" }, { k: "seq", l: `${episodes.length} épisodes` }].map(({ k, l }) => (
            <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "12px 0", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: tab === k ? "var(--r)" : "var(--mt)", borderBottom: `2px solid ${tab === k ? "var(--r)" : "transparent"}`, marginBottom: -2, fontFamily: "var(--sans)" }}>{l}</button>
          ))}
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

function StudioView({ bible, ep, script, loading, duree, onEdit, onTournage, onBack, onExport }) {
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
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--n)", marginBottom: 6 }}>{s.perso}</p>
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
            <button onClick={onTournage} style={{ background: "var(--n)", color: "#fff", border: "none", padding: 15, borderRadius: 12, width: "100%", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10, fontFamily: "var(--sans)" }}>📱 Mode Tournage</button>
            <button onClick={onExport} style={{ background: "var(--card)", color: "var(--tx)", border: "1.5px solid var(--bo)", padding: 14, borderRadius: 12, width: "100%", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)" }}>📄 Exporter en PDF</button>
          </>
        ) : null}
      </div>
    </div>
  );
}

function TournageView({ script, ep, duree, onBack }) {
  const [playing, setPlaying] = useState(true);
  const [showList, setShowList] = useState(false);
  const ref = useRef(null);
  const iv = useRef(null);
  const spd = duree <= 60 ? 1.0 : duree <= 90 ? 0.8 : 0.6;

  useEffect(() => {
    if (playing && ref.current) iv.current = setInterval(() => { if (ref.current) ref.current.scrollTop += spd; }, 55);
    else clearInterval(iv.current);
    return () => clearInterval(iv.current);
  }, [playing, spd]);

  const lines = [];
  if (script?.hook_scene) { lines.push({ t: "lbl", v: "⚡ HOOK" }); lines.push({ t: "txt", v: script.hook_scene.texte }); lines.push({ t: "stg", v: script.hook_scene.visuel_916 }); }
  (script?.scenes || []).forEach(s => { lines.push({ t: "nm", v: s.perso }); lines.push({ t: "txt", v: s.dialogue }); lines.push({ t: "stg", v: s.visuel_916 }); });
  if (script?.cliffhanger_scene) { lines.push({ t: "lbl", v: "🎬 CLIFFHANGER" }); lines.push({ t: "txt", v: script.cliffhanger_scene.texte }); if (script.cliffhanger_scene.label) lines.push({ t: "hi", v: script.cliffhanger_scene.label }); }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#080E0B", color: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #1a2320", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #1a2320", color: "#5a7060", cursor: "pointer", padding: "8px 14px", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 13 }}>← Studio</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--r)", animation: "pulse 1s infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: "var(--r)", letterSpacing: 2 }}>REC</span>
          <span style={{ fontSize: 11, color: "#3a5040", fontWeight: 700 }}>· {DUR_LABEL[duree]}</span>
        </div>
        <button onClick={() => setShowList(!showList)} style={{ background: showList ? "#1a2320" : "none", border: "1px solid #1a2320", color: showList ? "#fff" : "#5a7060", cursor: "pointer", padding: "8px 14px", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 13 }}>📋</button>
      </div>
      <div style={{ padding: "8px 20px", background: "#0d1610", borderBottom: "1px solid #1a2320", flexShrink: 0 }}>
        <p style={{ fontSize: 11, color: "#3a5040", textTransform: "uppercase", letterSpacing: 1 }}>Ép. {ep?.numero} · {ep?.titre}</p>
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 18, zIndex: 10, opacity: 0.2 }}>
          {["♥", "💬", "↗", "⋮"].map((ic, i) => <div key={i} style={{ width: 38, height: 38, background: "#1a2320", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{ic}</div>)}
        </div>
        <div ref={ref} onClick={() => setPlaying(!playing)} style={{ height: "100%", overflowY: "scroll", padding: "0 70px 0 24px", cursor: "pointer", scrollbarWidth: "none" }}>
          <div style={{ height: "22vh" }} />
          {lines.map((l, i) => {
            if (l.t === "lbl") return <p key={i} style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--r)", marginBottom: 6, marginTop: 26 }}>{l.v}</p>;
            if (l.t === "nm") return <p key={i} style={{ fontSize: 11, fontWeight: 700, color: "#3a5040", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4, marginTop: 18 }}>{l.v}</p>;
            if (l.t === "txt") return <p key={i} style={{ fontFamily: "var(--serif)", fontSize: 23, color: "#fff", lineHeight: 1.5, marginBottom: 6, fontWeight: 700 }}>{l.v}</p>;
            if (l.t === "stg") return <p key={i} style={{ fontSize: 12, color: "#2a3a32", fontStyle: "italic", marginBottom: 18 }}>[{l.v}]</p>;
            if (l.t === "hi") return <div key={i} style={{ display: "inline-block", background: "var(--r)", borderRadius: 6, padding: "8px 16px", marginTop: 6, marginBottom: 18 }}><span style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: 2, textTransform: "uppercase" }}>{l.v}</span></div>;
            return null;
          })}
          <div style={{ height: "50vh" }} />
        </div>
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <button onClick={() => setPlaying(!playing)} style={{ background: playing ? "#1a2320" : "var(--r)", border: "none", cursor: "pointer", width: 50, height: 50, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff", transition: "all .2s" }}>{playing ? "⏸" : "▶"}</button>
          <span style={{ fontSize: 10, color: "#2a3a32" }}>Appuie pour {playing ? "pause" : "play"}</span>
        </div>
      </div>
      {showList && (
        <div style={{ background: "#0d1610", borderTop: "2px solid var(--r)", padding: 20, maxHeight: "40vh", overflowY: "auto", flexShrink: 0 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "var(--r)", marginBottom: 14 }}>Checklist Tournage</p>
          {(script?.checklist || []).map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, border: "2px solid #1a2320", flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: "#5a7a62" }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState(null);
  const [checking, setChecking] = useState(true);
  const [screen, setScreen] = useState("mix");
  const [state, setState] = useState({ mode: "fast", casting: OPTS.casting[0], univers: OPTS.univers_fast[0], secret: OPTS.secret_fast[0], format: 10, duree: 60 });
  const [bible, setBible] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [epIdx, setEpIdx] = useState(0);
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("Initialisation…");
  const [err, setErr] = useState(null);

  const set = (patch) => setState(prev => ({ ...prev, ...patch }));

  // ── Auth: check Stripe session or stored customerId ──
  useEffect(() => {
    const stored = localStorage.getItem("vs_customer");
    const { session_id } = router.query;
    if (session_id) {
      fetch(`/api/session?session_id=${session_id}`)
        .then(r => r.json())
        .then(d => {
          if (d.customerId) {
            localStorage.setItem("vs_customer", d.customerId);
            setCustomerId(d.customerId);
            router.replace("/app");
          }
        })
        .finally(() => setChecking(false));
    } else if (stored) {
      setCustomerId(stored);
      setChecking(false);
    } else {
      setChecking(false);
    }
  }, [router.query]);

  const logout = () => { localStorage.removeItem("vs_customer"); setCustomerId(null); };

  // ── Generation ──
  const generate = async () => {
    setErr(null);
    setScreen("load");
    try {
      setLoadMsg("Création de la bible…");
      const b = await gen("bible", state, customerId);
      setBible(b);
      setLoadMsg("Découpage des épisodes…");
      const batches = [];
      for (let i = 0; i < state.format; i += 10) {
        const from = i + 1, to = Math.min(i + 10, state.format);
        batches.push(gen("episodes", { titre: b.titre, logline: b.logline, mode: state.mode, from, to, total: state.format }, customerId));
      }
      const results = await Promise.all(batches);
      setEpisodes(results.flatMap(r => r.episodes || []));
      setScreen("bible");
    } catch (e) {
      setErr(e.message);
    }
  };

  const openEp = async (idx) => {
    setEpIdx(idx);
    setScript(null);
    setScreen("studio");
    setLoading(true);
    try {
      const s = await gen("script", { ep: episodes[idx], bible, mode: state.mode, duree: state.duree }, customerId);
      setScript(s);
    } catch (e) { console.error(e); }
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

  const exportScript = () => {
    const b = bible, ep = episodes[epIdx], s = script;
    if (!s) return;
    const scenes = (s.scenes || []).map(sc =>
      `<div style="border-left:3px solid #ddd;padding-left:14px;margin-bottom:14px">
        <p style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0F2236;margin-bottom:5px">${sc.perso}</p>
        <p style="font-size:15px;line-height:1.55;font-weight:500;margin-bottom:5px">${sc.dialogue}</p>
        <p style="font-size:11px;color:#888;font-style:italic">[9:16] ${sc.visuel_916}</p>
      </div>`).join("");
    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>${b.titre} — Ép.${ep.numero}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'DM Sans',sans-serif;color:#0F1A12;padding:52px 60px;max-width:720px;margin:0 auto;}h1{font-family:'Playfair Display',serif;font-size:30px;font-weight:900;letter-spacing:-1px;line-height:1.1;margin:10px 0 8px;}@media print{.np{display:none!important;}}</style>
</head><body>
<button class="np" onclick="window.print()" style="margin-bottom:28px;padding:12px 28px;background:#E85C3A;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">🖨 Imprimer / PDF</button>
<div style="border-bottom:3px solid #E85C3A;padding-bottom:20px;margin-bottom:24px">
  <p style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px">${b.titre}</p>
  <h1>${ep.titre}</h1>
  <p style="font-family:'Playfair Display',serif;font-size:14px;font-style:italic;color:#888">« ${b.logline} »</p>
  <p style="font-size:12px;font-weight:700;color:#E85C3A;text-transform:uppercase;letter-spacing:1px;margin-top:8px">Épisode ${ep.numero} · ${DUR_LABEL[state.duree]}</p>
</div>
<p style="font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#E85C3A;margin-bottom:10px">⚡ Hook — 3 premières secondes</p>
<div style="background:#fff5f2;border:2px solid #E85C3A;border-radius:12px;padding:16px;margin-bottom:20px">
  <p style="font-size:16px;font-weight:700;line-height:1.4;margin-bottom:8px">${s.hook_scene?.texte}</p>
  <p style="font-size:12px;color:#E85C3A;font-style:italic">[9:16] ${s.hook_scene?.visuel_916}</p>
</div>
<p style="font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#E85C3A;margin-bottom:14px">Script · ${DUR_LABEL[state.duree]}</p>
${scenes}
<div style="background:#0F1A12;border-radius:12px;padding:18px;margin-top:18px;color:#fff">
  <p style="font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#E85C3A;margin-bottom:10px">🎬 Cliffhanger</p>
  <p style="font-size:16px;font-weight:700;line-height:1.4;margin-bottom:8px">${s.cliffhanger_scene?.texte}</p>
  <p style="font-size:12px;color:#E85C3A;font-style:italic">${s.cliffhanger_scene?.visuel_916}</p>
</div>
<div style="margin-top:36px;padding-top:14px;border-top:1px solid #eee;display:flex;justify-content:space-between;font-size:12px">
  <span style="font-weight:700;color:#E85C3A">VERTICAL STUDIO</span>
  <span style="color:#888">${b.titre} — Ép.${ep.numero}</span>
</div>
</body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${b.titre.replace(/\s+/g, "_")}_ep${ep.numero}.html`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
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

      {screen === "mix" && <Mixeur state={state} set={set} onGen={generate} />}
      {screen === "bible" && bible && <BibleView bible={bible} episodes={episodes} mode={state.mode} duree={state.duree} onEp={openEp} onBack={() => setScreen("mix")} />}
      {screen === "studio" && <StudioView bible={bible} ep={episodes[epIdx]} script={script} loading={loading} duree={state.duree} onEdit={editScript} onTournage={() => setScreen("tour")} onBack={() => setScreen("bible")} onExport={exportScript} />}
      {screen === "tour" && <TournageView script={script} ep={episodes[epIdx]} duree={state.duree} onBack={() => setScreen("studio")} />}

      {/* Logout */}
      {screen !== "tour" && (
        <div style={{ position: "fixed", top: 14, right: 20, zIndex: 100 }}>
          <button onClick={logout} style={{ background: "none", border: "none", fontSize: 12, color: "var(--mt)", cursor: "pointer" }}>Déconnexion</button>
        </div>
      )}
    </div>
  );
}

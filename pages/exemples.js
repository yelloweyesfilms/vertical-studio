import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { SERIES as SERIES_DATA } from "../lib/series";

const RED = "#E85C3A";
const VIO = "#a855f7";
const DARK = "#09090f";
const SURFACE = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#f1f5f9";
const MUTED = "#64748b";

const SERIES = SERIES_DATA;

const PLATFORM_COLORS = { TikTok: "#69C9D0", Reels: VIO, Shorts: RED };
const PLATFORM_ICONS = { TikTok: "♪", Reels: "◈", Shorts: "▶" };

const Logo = ({ size = "md" }) => {
  const sm = size === "sm";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: sm ? 8 : 10, userSelect: "none" }}>
      <svg width={sm ? 20 : 26} height={sm ? 29 : 37} viewBox="0 0 26 37" fill="none">
        <rect x="0.5" y="0.5" width="25" height="36" rx="5.5" fill={RED} />
        <rect x="0.5" y="0.5" width="25" height="36" rx="5.5" stroke="rgba(255,255,255,0.15)" />
        <rect x="4" y="4" width="18" height="29" rx="3" fill="rgba(0,0,0,0.25)" />
        <polygon points="10,13 10,24 20,18.5" fill="white" />
        <rect x="4" y="31" width="6" height="1.5" rx="0.75" fill="rgba(255,255,255,0.4)" />
        <rect x="12" y="31" width="10" height="1.5" rx="0.75" fill="rgba(255,255,255,0.2)" />
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: sm ? 9 : 11, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", color: MUTED, marginBottom: 2 }}>Studio</div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: sm ? 14 : 18, fontWeight: 900, letterSpacing: -0.5, color: TEXT, lineHeight: 1 }}>Vertical</div>
      </div>
    </div>
  );
};

function TensionBar({ t = 0 }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[...Array(10)].map((_, i) => (
        <div key={i} style={{
          width: 5, height: 5, borderRadius: "50%",
          background: i < t
            ? `linear-gradient(135deg, ${RED}, ${VIO})`
            : BORDER,
          transition: "background .2s",
        }} />
      ))}
    </div>
  );
}

function ModeBadge({ mode }) {
  return (
    <span style={{
      display: "inline-block", padding: "4px 12px", borderRadius: 6,
      background: mode === "fast" ? "rgba(232,92,58,0.12)" : "rgba(168,85,247,0.12)",
      border: `1px solid ${mode === "fast" ? "rgba(232,92,58,0.25)" : "rgba(168,85,247,0.25)"}`,
      color: mode === "fast" ? RED : VIO,
      fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase",
    }}>
      {mode === "fast" ? "⚡ Fast Drama" : "🎭 Premium Suspense"}
    </span>
  );
}

function PlatformBadge({ platform }) {
  const color = PLATFORM_COLORS[platform] || MUTED;
  const icon = PLATFORM_ICONS[platform] || "▶";
  return (
    <span style={{
      display: "inline-block", padding: "4px 12px", borderRadius: 6,
      background: `${color}18`,
      border: `1px solid ${color}30`,
      color, fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase",
    }}>
      {icon} {platform}
    </span>
  );
}

function SerieCard({ serie }) {
  const { bible, episodes, script, mode, platform, mixeurParams, slug } = serie;
  const [showScript, setShowScript] = useState(false);
  const router = useRouter();

  const handleGenerate = () => {
    try { sessionStorage.setItem("vs_preset", JSON.stringify(mixeurParams)); } catch {}
    router.push("/app");
  };

  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 24, overflow: "hidden", marginBottom: 28, backdropFilter: "blur(12px)" }}>
      {/* Header */}
      <div style={{ padding: "28px 32px", borderBottom: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${mode === "fast" ? RED : VIO}, transparent)` }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, background: `radial-gradient(circle, ${mode === "fast" ? "rgba(232,92,58,0.06)" : "rgba(168,85,247,0.06)"} 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <ModeBadge mode={mode} />
          <PlatformBadge platform={platform} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, color: TEXT, letterSpacing: -1, marginBottom: 8, lineHeight: 1.1 }}>
          {bible.titre}
        </h2>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontStyle: "italic", color: MUTED, lineHeight: 1.6, marginBottom: 16 }}>
          « {bible.logline} »
        </p>
        <div style={{ display: "inline-block", background: "rgba(232,92,58,0.1)", border: "1px solid rgba(232,92,58,0.2)", borderRadius: 10, padding: "10px 16px" }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: RED, marginBottom: 4 }}>Hook TikTok</p>
          <p style={{ fontSize: 14, color: TEXT, fontWeight: 700 }}>{bible.accroche}</p>
        </div>
      </div>

      <div style={{ padding: "28px 32px" }}>
        {/* Pitch */}
        <p style={{ fontSize: 14, lineHeight: 1.75, color: MUTED, marginBottom: 28 }}>{bible.pitch}</p>

        {/* Characters */}
        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: MUTED, marginBottom: 12 }}>Personnages</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 28 }}>
          {bible.personnages.map((p, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px", borderLeft: `3px solid ${i === 0 ? RED : VIO}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: TEXT }}>{p.nom}</span>
                <span style={{ fontSize: 11, color: i === 0 ? RED : VIO, fontWeight: 700 }}>{p.age} ans</span>
              </div>
              <p style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>{p.role}</p>
              <p style={{ fontSize: 12, color: TEXT, opacity: 0.7 }}>🔒 {p.secret}</p>
            </div>
          ))}
        </div>

        {/* Tension centrale */}
        <div style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.15)", borderRadius: 14, padding: "14px 18px", marginBottom: 28 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: VIO, marginBottom: 6 }}>Question centrale</p>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontStyle: "italic", color: TEXT }}>« {bible.tension_centrale} »</p>
        </div>

        {/* Episodes */}
        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: MUTED, marginBottom: 12 }}>{episodes.length} épisodes</p>
        <div style={{ marginBottom: 28 }}>
          {episodes.map((ep, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, marginBottom: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${RED}, ${VIO})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, fontWeight: 900, color: "#fff" }}>{ep.numero}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 6 }}>{ep.titre}</p>
                <TensionBar t={ep.tension} />
                <p style={{ fontSize: 12, color: MUTED, marginTop: 6, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>🎬 {ep.cliffhanger}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA — Générer une série similaire */}
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <button
            onClick={handleGenerate}
            style={{
              flex: 1, padding: "15px 20px", borderRadius: 14, fontSize: 14, fontWeight: 700,
              background: `linear-gradient(135deg, ${mode === "fast" ? RED : VIO}, ${mode === "fast" ? "rgba(232,92,58,0.7)" : "rgba(168,85,247,0.7)"})`,
              border: "none", color: "#fff", cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
              boxShadow: `0 0 24px ${mode === "fast" ? "rgba(232,92,58,0.3)" : "rgba(168,85,247,0.3)"}`,
              letterSpacing: -0.3,
            }}>
            ✦ Générer similaire →
          </button>
          {slug && (
            <a href={`/exemples/${slug}`} style={{
              display: "flex", alignItems: "center", padding: "15px 18px", borderRadius: 14, fontSize: 14, fontWeight: 700,
              background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT,
              textDecoration: "none", whiteSpace: "nowrap",
            }}>
              Voir la page →
            </a>
          )}
        </div>

        {/* Script toggle */}
        <button
          onClick={() => setShowScript(s => !s)}
          style={{
            width: "100%", padding: "14px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700,
            background: showScript ? "rgba(232,92,58,0.1)" : SURFACE,
            border: `1px solid ${showScript ? "rgba(232,92,58,0.3)" : BORDER}`,
            color: showScript ? RED : TEXT,
            cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
            transition: "all .2s", marginBottom: showScript ? 20 : 0,
          }}>
          {showScript ? "Masquer le script ↑" : "📝 Voir le script de l'épisode 1 →"}
        </button>

        {showScript && (
          <div>
            {/* Hook */}
            <div style={{ background: "rgba(232,92,58,0.06)", border: `1px solid rgba(232,92,58,0.2)`, borderRadius: 16, padding: 20, marginBottom: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: RED, marginBottom: 10 }}>⚡ Hook — 3 premières secondes</p>
              <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5, color: TEXT, marginBottom: 10 }}>{script.hook_scene.texte}</p>
              <p style={{ fontSize: 12, color: RED, fontStyle: "italic" }}>[9:16] {script.hook_scene.visuel_916}</p>
            </div>

            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: MUTED, marginBottom: 10 }}>Script · {script.scenes.length} répliques</p>
            {script.scenes.map((sc, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16, borderLeft: `3px solid ${BORDER}`, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: VIO }}>{sc.perso}</p>
                  {sc.jeu && <span style={{ fontSize: 10, background: "rgba(168,85,247,0.1)", color: VIO, padding: "2px 10px", borderRadius: 20, fontStyle: "italic" }}>{sc.jeu}</span>}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: TEXT, marginBottom: 8, fontWeight: 500 }}>{sc.dialogue}</p>
                <p style={{ fontSize: 12, color: MUTED, fontStyle: "italic" }}>[9:16] {sc.visuel_916}</p>
              </div>
            ))}

            {/* Cliffhanger */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(232,92,58,0.2)`, borderRadius: 16, padding: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${RED}, ${VIO})` }} />
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: RED, marginBottom: 10 }}>🎬 Cliffhanger</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 10, lineHeight: 1.5 }}>{script.cliffhanger_scene.texte}</p>
              <p style={{ fontSize: 12, color: RED, fontStyle: "italic", marginBottom: 14 }}>[9:16] {script.cliffhanger_scene.visuel_916}</p>
              <span style={{ display: "inline-block", background: `linear-gradient(135deg, ${RED}, ${VIO})`, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: 1, textTransform: "uppercase" }}>
                {script.cliffhanger_scene.label}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Exemples() {
  const [activeFilter, setActiveFilter] = useState("all");
  const SITE = "https://studiovertical.app";
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Exemples de micro-dramas générés par Studio Vertical",
    "url": `${SITE}/exemples`,
    "numberOfItems": SERIES.length,
    "itemListElement": SERIES.map((s, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": s.bible.titre,
      "description": s.bible.logline,
      "url": `${SITE}/exemples`,
    })),
  };

  return (
    <>
    <Head>
      <title>Exemples de micro-dramas — Studio Vertical</title>
      <meta name="description" content={`Découvrez ${SERIES.length} exemples complets de micro-dramas 9:16 générés par l'IA : bible, scripts, hooks et cliffhangers prêts à tourner sur TikTok, Reels et Shorts.`} />
      <link rel="canonical" href={`${SITE}/exemples`} />
      <meta property="og:url" content={`${SITE}/exemples`} />
      <meta property="og:title" content="Exemples de micro-dramas — Studio Vertical" />
      <meta property="og:description" content={`${SERIES.length} séries complètes générées par l'IA : suspense médical, drame familial, thriller financier. Scripts prêts à tourner en 9:16.`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </Head>
    <div style={{ minHeight: "100vh", background: DARK, color: TEXT, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        button { cursor: pointer; -webkit-tap-highlight-color: transparent; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        @media (max-width: 640px) {
          .examples-grid { padding: 20px 16px !important; }
          .hero-examples { padding: 48px 20px 40px !important; }
          nav { padding: 12px 16px !important; }
        }
      `}</style>

      {/* NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: `1px solid ${BORDER}`, background: "rgba(9,9,15,0.85)", backdropFilter: "blur(20px)" }}>
        <nav style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/"><Logo /></a>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, color: RED, letterSpacing: 2 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: RED, animation: "pulse 1.5s infinite" }} />
            REC
          </div>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `linear-gradient(135deg, ${RED}, ${VIO})`, color: "#fff", padding: "10px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700, boxShadow: `0 0 24px rgba(232,92,58,0.3)`, letterSpacing: -0.3 }}>
            Créer ma série →
          </a>
        </nav>
      </div>

      {/* HERO */}
      <div style={{ padding: "80px 40px 56px", textAlign: "center", position: "relative", overflow: "hidden" }} className="hero-examples">
        <div style={{ position: "absolute", top: 0, left: "20%", width: 400, height: 400, background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 60, right: "15%", width: 300, height: 300, background: "radial-gradient(circle, rgba(232,92,58,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Platform badges */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
            {[
              { name: "TikTok", color: "#69C9D0", icon: "♪" },
              { name: "Instagram Reels", color: VIO, icon: "◈" },
              { name: "YouTube Shorts", color: RED, icon: "▶" },
            ].map(({ name, color, icon }) => (
              <span key={name} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, background: `${color}12`, border: `1px solid ${color}25`, color, fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
                {icon} {name}
              </span>
            ))}
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: TEXT, letterSpacing: -2, lineHeight: 1.05, marginBottom: 20 }}>
            Ce que l'IA crée<br />
            <span style={{ background: `linear-gradient(135deg, ${RED} 30%, ${VIO})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>
              en 5 minutes
            </span>
            .
          </h1>

          <p style={{ fontSize: 16, color: MUTED, maxWidth: 480, margin: "0 auto 0", lineHeight: 1.65 }}>
            Bible complète, séquencier, scripts 9:16 tournables. {SERIES.length} séries pour TikTok, Reels, Shorts et DramaBox.
          </p>
        </div>
      </div>

      {/* FILTRES */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 32px 8px" }} className="examples-grid">
        {(() => {
          const FILTERS = [
            { id: "all", label: "Tous", color: TEXT },
            { id: "fast", label: "⚡ Fast Drama", color: RED },
            { id: "premium", label: "🎭 Premium", color: VIO },
            { id: "TikTok", label: "♪ TikTok", color: "#69C9D0" },
            { id: "Reels", label: "◈ Reels", color: VIO },
            { id: "Shorts", label: "▶ Shorts", color: RED },
            ...Array.from(new Set(SERIES.map(s => s.genre))).map(g => ({ id: `genre:${g}`, label: g, color: MUTED })),
          ];
          const filtered = SERIES.filter(s => {
            if (activeFilter === "all") return true;
            if (activeFilter === "fast" || activeFilter === "premium") return s.mode === activeFilter;
            if (activeFilter.startsWith("genre:")) return s.genre === activeFilter.replace("genre:", "");
            return s.platform === activeFilter;
          });
          return (
            <>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 24 }}>
                {FILTERS.map(({ id, label, color }) => {
                  const active = activeFilter === id;
                  return (
                    <button key={id} onClick={() => setActiveFilter(id)} style={{
                      padding: "7px 16px", borderRadius: 100, fontSize: 12, fontWeight: 700,
                      background: active ? `${color}18` : "transparent",
                      border: `1px solid ${active ? color : BORDER}`,
                      color: active ? color : MUTED,
                      cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
                      transition: "all .15s", letterSpacing: 0.3,
                    }}>
                      {label}
                    </button>
                  );
                })}
                {activeFilter !== "all" && (
                  <span style={{ display: "flex", alignItems: "center", fontSize: 12, color: MUTED, paddingLeft: 4 }}>
                    {filtered.length} série{filtered.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: MUTED, fontSize: 14 }}>Aucune série pour ce filtre.</div>
              ) : (
                filtered.map((serie, i) => <SerieCard key={serie.bible.titre} serie={serie} />)
              )}
            </>
          );
        })()}


        {/* CTA */}
        <div style={{ borderRadius: 28, padding: "56px 40px", textAlign: "center", position: "relative", overflow: "hidden", background: SURFACE, border: `1px solid ${BORDER}` }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(168,85,247,0.07) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: VIO, marginBottom: 20 }}>Prêt à tourner ?</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 900, color: TEXT, letterSpacing: -1.5, marginBottom: 16, lineHeight: 1.1 }}>
              Ta première série,<br />
              <span style={{ background: `linear-gradient(135deg, ${RED}, ${VIO})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>
                dans 5 minutes
              </span>
              .
            </h2>
            <p style={{ color: MUTED, fontSize: 15, marginBottom: 36, lineHeight: 1.6 }}>
              Bible, épisodes, scripts 9:16, mode tournage, traduction en 8 langues.
            </p>
            <a href="/" style={{
              display: "inline-block", background: `linear-gradient(135deg, ${RED}, ${VIO})`, color: "#fff",
              padding: "16px 40px", borderRadius: 16, fontSize: 16, fontWeight: 700,
              boxShadow: `0 0 40px rgba(168,85,247,0.3), 0 0 20px rgba(232,92,58,0.2)`,
              letterSpacing: -0.3,
            }}>
              Commencer — dès 7,50€/mois →
            </a>
            <p style={{ color: MUTED, fontSize: 13, marginTop: 14 }}>Annulable à tout moment · Sans engagement</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "32px 40px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Logo size="sm" />
        </div>
        <p style={{ color: MUTED, fontSize: 13 }}>
          © 2026 Studio Vertical ·{" "}
          <a href="/" style={{ color: MUTED }}>Accueil</a> ·{" "}
          <a href="mailto:hello@studiovertical.app" style={{ color: MUTED }}>Contact</a>
        </p>
      </footer>
    </div>
    </>
  );
}

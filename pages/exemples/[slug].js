import Head from "next/head";
import { useRouter } from "next/router";
import { SERIES } from "../../lib/series";

const RED = "#E85C3A";
const VIO = "#a855f7";
const DARK = "#09090f";
const SURFACE = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#f1f5f9";
const MUTED = "#64748b";
const SITE = "https://studiovertical.app";

const PLATFORM_COLORS = { TikTok: "#69C9D0", Reels: VIO, Shorts: RED };
const PLATFORM_ICONS = { TikTok: "♪", Reels: "◈", Shorts: "▶" };

function TensionBar({ t = 0 }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[...Array(10)].map((_, i) => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: "50%",
          background: i < t ? `linear-gradient(135deg, ${RED}, ${VIO})` : BORDER,
        }} />
      ))}
    </div>
  );
}

export default function SeriePage({ serie }) {
  const router = useRouter();

  if (!serie) return null;

  const { bible, episodes, script, mode, platform, genre, mixeurParams, slug } = serie;
  const modeColor = mode === "fast" ? RED : VIO;
  const platColor = PLATFORM_COLORS[platform] || MUTED;
  const platIcon = PLATFORM_ICONS[platform] || "▶";

  const handleGenerate = () => {
    try { sessionStorage.setItem("vs_preset", JSON.stringify(mixeurParams)); } catch {}
    router.push("/app");
  };

  const schemaArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${bible.titre} — Exemple de micro-drama 9:16`,
    "description": bible.logline,
    "url": `${SITE}/exemples/${slug}`,
    "author": { "@type": "Organization", "name": "Studio Vertical" },
    "publisher": { "@type": "Organization", "name": "Studio Vertical", "url": SITE },
  };

  return (
    <>
      <Head>
        <title>{bible.titre} — Exemple micro-drama 9:16 · Studio Vertical</title>
        <meta name="description" content={`${bible.logline} ${bible.accroche} Script complet pour TikTok, Reels et Shorts généré par IA.`} />
        <link rel="canonical" href={`${SITE}/exemples/${slug}`} />
        <meta property="og:url" content={`${SITE}/exemples/${slug}`} />
        <meta property="og:title" content={`${bible.titre} — Micro-drama 9:16 · Studio Vertical`} />
        <meta property="og:description" content={bible.pitch} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: "100vh", background: DARK, color: TEXT, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } a { text-decoration: none; color: inherit; }`}</style>

        {/* NAV */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: `1px solid ${BORDER}`, background: "rgba(9,9,15,0.9)", backdropFilter: "blur(20px)" }}>
          <nav style={{ maxWidth: 860, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <a href="/" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 900, color: TEXT }}>Vertical</a>
              <span style={{ color: BORDER }}>›</span>
              <a href="/exemples" style={{ fontSize: 13, color: MUTED }}>Exemples</a>
              <span style={{ color: BORDER }}>›</span>
              <span style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{bible.titre}</span>
            </div>
            <button onClick={handleGenerate} style={{
              background: `linear-gradient(135deg, ${modeColor}, ${VIO})`,
              border: "none", color: "#fff", padding: "10px 20px", borderRadius: 12,
              fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Générer similaire →
            </button>
          </nav>
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 32px 80px" }}>

          {/* Badges */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            <span style={{ padding: "5px 14px", borderRadius: 6, background: `${modeColor}15`, border: `1px solid ${modeColor}30`, color: modeColor, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" }}>
              {mode === "fast" ? "⚡ Fast Drama" : "🎭 Premium Suspense"}
            </span>
            <span style={{ padding: "5px 14px", borderRadius: 6, background: `${platColor}15`, border: `1px solid ${platColor}30`, color: platColor, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" }}>
              {platIcon} {platform}
            </span>
            <span style={{ padding: "5px 14px", borderRadius: 6, background: SURFACE, border: `1px solid ${BORDER}`, color: MUTED, fontSize: 11, fontWeight: 700 }}>
              {genre}
            </span>
          </div>

          {/* Titre + accroche */}
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, letterSpacing: -2, lineHeight: 1.05, marginBottom: 16 }}>
            {bible.titre}
          </h1>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, marginBottom: 8, maxWidth: 640 }}>{bible.logline}</p>
          <p style={{ fontSize: 14, fontStyle: "italic", color: modeColor, marginBottom: 40, fontWeight: 600 }}>« {bible.accroche} »</p>

          {/* Pitch */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 18, padding: "28px 32px", marginBottom: 32, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${modeColor}, transparent)` }} />
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: modeColor, marginBottom: 12 }}>Pitch</p>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: TEXT }}>{bible.pitch}</p>
            <p style={{ fontSize: 13, color: MUTED, marginTop: 16, fontWeight: 600 }}>Tension centrale : <em>{bible.tension_centrale}</em></p>
          </div>

          {/* Personnages */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>Personnages</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
              {bible.personnages.map((p, i) => (
                <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 20px", borderLeft: `3px solid ${i === 0 ? modeColor : VIO}` }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: TEXT }}>{p.nom}</span>
                    <span style={{ fontSize: 12, color: MUTED }}>{p.age} ans</span>
                  </div>
                  <p style={{ fontSize: 13, color: modeColor, fontWeight: 600, marginBottom: 8 }}>{p.role}</p>
                  <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>🔒 {p.secret}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Séquencier */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>Séquencier — {episodes.length} épisodes</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {episodes.map((ep) => (
                <div key={ep.numero} style={{ display: "flex", gap: 16, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 20px", alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${modeColor}15`, border: `1px solid ${modeColor}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 800, color: modeColor }}>E{ep.numero}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 12, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{ep.titre}</span>
                      <TensionBar t={ep.tension} />
                    </div>
                    <p style={{ fontSize: 12, color: MUTED, fontStyle: "italic" }}>🎬 {ep.cliffhanger}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Script épisode 1 */}
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>Script — Épisode 1</p>

            <div style={{ background: "rgba(232,92,58,0.06)", border: `1px solid rgba(232,92,58,0.2)`, borderRadius: 16, padding: 24, marginBottom: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: RED, marginBottom: 10 }}>⚡ Hook — 3 premières secondes</p>
              <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.55, color: TEXT, marginBottom: 10 }}>{script.hook_scene.texte}</p>
              <p style={{ fontSize: 12, color: RED, fontStyle: "italic" }}>[9:16] {script.hook_scene.visuel_916}</p>
            </div>

            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: MUTED, marginBottom: 10 }}>Dialogue · {script.scenes.length} répliques</p>
            {script.scenes.map((sc, i) => (
              <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${BORDER}`, borderRadius: 14, padding: 16, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: VIO }}>{sc.perso}</span>
                  {sc.jeu && <span style={{ fontSize: 10, background: "rgba(168,85,247,0.1)", color: VIO, padding: "2px 10px", borderRadius: 20, fontStyle: "italic" }}>{sc.jeu}</span>}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: TEXT, marginBottom: 8, fontWeight: 500 }}>{sc.dialogue}</p>
                <p style={{ fontSize: 12, color: MUTED, fontStyle: "italic" }}>[9:16] {sc.visuel_916}</p>
              </div>
            ))}

            <div style={{ background: SURFACE, border: `1px solid rgba(232,92,58,0.2)`, borderRadius: 16, padding: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${RED}, ${VIO})` }} />
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: RED, marginBottom: 10 }}>🎬 Cliffhanger</p>
              <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.55, color: TEXT, marginBottom: 10 }}>{script.cliffhanger_scene.texte}</p>
              <p style={{ fontSize: 12, color: RED, fontStyle: "italic" }}>[9:16] {script.cliffhanger_scene.visuel_916}</p>
              {script.cliffhanger_scene.label && (
                <div style={{ display: "inline-block", marginTop: 10, background: `${RED}15`, border: `1px solid ${RED}30`, borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 800, color: RED }}>{script.cliffhanger_scene.label}</div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 24, padding: "40px 36px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(168,85,247,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: VIO, marginBottom: 14 }}>Générer ta version</p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, letterSpacing: -1, marginBottom: 12, lineHeight: 1.1 }}>
                Une série similaire,<br />
                <span style={{ background: `linear-gradient(135deg, ${RED}, ${VIO})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>en 5 minutes</span>.
              </h2>
              <p style={{ color: MUTED, fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>Le Mixeur est pré-configuré avec l'univers et le casting de cette série.<br />Change ce que tu veux, génère le reste.</p>
              <button onClick={handleGenerate} style={{
                background: `linear-gradient(135deg, ${modeColor}, ${VIO})`, border: "none",
                color: "#fff", padding: "16px 40px", borderRadius: 16, fontSize: 16, fontWeight: 700,
                cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
                boxShadow: `0 0 40px rgba(168,85,247,0.25)`, letterSpacing: -0.3,
              }}>
                ✦ Générer une série similaire →
              </button>
              <p style={{ color: MUTED, fontSize: 12, marginTop: 14 }}>Essai 24h gratuit · Sans engagement · Dès 7,50€/mois</p>
            </div>
          </div>

          {/* Autres séries */}
          <div style={{ marginTop: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: MUTED, marginBottom: 20 }}>Autres exemples</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {SERIES.filter(s => s.slug !== slug).map(s => {
                const c = s.mode === "fast" ? RED : VIO;
                return (
                  <a key={s.slug} href={`/exemples/${s.slug}`} style={{ display: "block", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px", transition: "border-color .2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = c}
                    onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: c, background: `${c}12`, border: `1px solid ${c}25`, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                        {s.mode === "fast" ? "⚡ Fast" : "🎭 Premium"}
                      </span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: MUTED, background: SURFACE, border: `1px solid ${BORDER}`, padding: "3px 8px", borderRadius: 4 }}>{s.genre}</span>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 6 }}>{s.bible.titre}</p>
                    <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>{s.bible.accroche}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "24px 32px", textAlign: "center" }}>
          <p style={{ color: MUTED, fontSize: 13 }}>
            © 2026 Studio Vertical ·{" "}
            <a href="/exemples" style={{ color: MUTED }}>Exemples</a> ·{" "}
            <a href="/" style={{ color: MUTED }}>Accueil</a>
          </p>
        </footer>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: SERIES.map(s => ({ params: { slug: s.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const serie = SERIES.find(s => s.slug === params.slug) || null;
  return { props: { serie } };
}

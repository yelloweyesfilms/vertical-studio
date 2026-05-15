import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { POSTS } from "../../lib/posts";

const RED = "#E85C3A";
const VIO = "#a855f7";
const DARK = "#09090f";
const SURFACE = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#f1f5f9";
const MUTED = "#64748b";
const SITE = "https://studiovertical.app";

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, userSelect: "none" }}>
      <svg width="26" height="37" viewBox="0 0 26 37" fill="none">
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="26" y2="37" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E85C3A" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <clipPath id="logo-clip">
            <rect x="0.5" y="0.5" width="25" height="36" rx="5.5" />
          </clipPath>
        </defs>
        <rect x="0.5" y="0.5" width="25" height="36" rx="5.5" fill="url(#logo-grad)" />
        <rect x="0.5" y="0.5" width="25" height="36" rx="5.5" stroke="rgba(255,255,255,0.18)" />
        <rect x="4" y="4" width="18" height="29" rx="3" fill="rgba(0,0,0,0.22)" />
        <polygon points="10,13 10,24 20,18.5" fill="white" />
        <rect x="4" y="31" width="6" height="1.5" rx="0.75" fill="rgba(255,255,255,0.4)" />
        <rect x="12" y="31" width="10" height="1.5" rx="0.75" fill="rgba(255,255,255,0.2)" />
        <polygon points="0.5,0.5 25.5,0.5 25.5,12 0.5,20" fill="rgba(255,255,255,0.13)" clipPath="url(#logo-clip)" />
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", color: MUTED, marginBottom: 2 }}>Studio</div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900, letterSpacing: -0.5, color: TEXT, lineHeight: 1 }}>Vertical</div>
      </div>
    </div>
  );
}

const blogListSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Blog Studio Vertical",
  "url": `${SITE}/blog`,
  "description": "Guides et ressources sur le micro-drama vertical, l'écriture de scripts et les plateformes TikTok, DramaBox, ReelShort.",
};

export default function BlogIndex() {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("vs_customer")) router.replace("/tarifs");
  }, []);

  return (
    <>
      <Head>
        <title>Blog Studio Vertical — Guides micro-drama et écriture verticale</title>
        <meta name="description" content="Guides pratiques sur le micro-drama vertical : comment écrire un hook TikTok, structurer vos épisodes, choisir vos plateformes et générer des séries avec l'IA." />
        <link rel="canonical" href={`${SITE}/blog`} />
        <meta property="og:title" content="Blog Studio Vertical — Guides micro-drama et écriture verticale" />
        <meta property="og:url" content={`${SITE}/blog`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }} />
      </Head>

      <div style={{ minHeight: "100vh", background: DARK, color: TEXT, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          a { text-decoration: none; color: inherit; }
          a:hover { opacity: 0.85; }
          @media (max-width: 640px) { nav { padding: 14px 20px !important; } .page-pad { padding: 60px 20px !important; } }
        `}</style>

        {/* NAV */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: `1px solid ${BORDER}`, background: "rgba(9,9,15,0.9)", backdropFilter: "blur(20px)" }}>
          <nav style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <a href="/"><Logo /></a>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <a href="/exemples" style={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>Exemples</a>
              <a href="/tarifs" style={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>Tarifs</a>
              <a href="/app" style={{ fontSize: 14, color: TEXT, fontWeight: 700, background: SURFACE, border: `1px solid ${BORDER}`, padding: "8px 16px", borderRadius: 10 }}>Se connecter →</a>
            </div>
          </nav>
        </div>

        {/* HERO */}
        <div className="page-pad" style={{ padding: "72px 40px 56px", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: `radial-gradient(ellipse, rgba(168,85,247,0.07) 0%, transparent 65%)`, pointerEvents: "none" }} />
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: VIO, marginBottom: 16 }}>Blog</p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 900, letterSpacing: -2, lineHeight: 1.05, marginBottom: 16, color: TEXT }}>
            Guides & ressources<br />
            <span style={{ fontStyle: "italic", color: MUTED }}>micro-drama.</span>
          </h1>
          <p style={{ color: MUTED, fontSize: 16, maxWidth: 440, margin: "0 auto" }}>
            Écriture, hooks, plateformes, IA — tout ce qu'il faut pour créer des séries verticales qui performent.
          </p>
        </div>

        {/* ARTICLES */}
        <div className="page-pad" style={{ padding: "0 40px 96px" }}>
          <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
            {POSTS.map((post) => (
              <a key={post.slug} href={`/blog/${post.slug}`} style={{ display: "block", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 24, padding: "32px 36px", transition: "border-color .2s", textDecoration: "none", color: "inherit" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: post.categoryColor, background: `${post.categoryColor}12`, border: `1px solid ${post.categoryColor}25`, padding: "3px 10px", borderRadius: 6 }}>{post.category}</span>
                  <span style={{ fontSize: 12, color: MUTED }}>{new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span style={{ fontSize: 12, color: MUTED }}>· {post.readTime} de lecture</span>
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 900, color: TEXT, letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 12 }}>{post.title}</h2>
                <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>{post.description}</p>
                <span style={{ fontSize: 14, fontWeight: 700, color: VIO }}>Lire l'article →</span>
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "64px 40px", textAlign: "center" }}>
          <p style={{ color: MUTED, fontSize: 15, marginBottom: 24 }}>Prêt à générer ta première série ?</p>
          <a href="/tarifs" style={{ display: "inline-block", background: `linear-gradient(135deg, ${RED}, ${VIO})`, color: "#fff", padding: "15px 32px", borderRadius: 14, fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", boxShadow: `0 0 28px rgba(168,85,247,0.25)`, textDecoration: "none" }}>
            Commencer →
          </a>
        </div>

        {/* FOOTER */}
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "28px 40px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
          <Logo />
          <div style={{ display: "flex", gap: 20, fontSize: 13, color: MUTED }}>
            <a href="/">Accueil</a>
            <a href="/exemples">Exemples</a>
            <a href="/tarifs">Tarifs</a>
            <a href="/cgu">CGU</a>
          </div>
        </div>
      </div>
    </>
  );
}

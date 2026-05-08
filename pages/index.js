import { useState } from "react";
import { useRouter } from "next/router";

const s = {
  page: { minHeight: "100vh", background: "#fff", color: "#1A1A18", fontFamily: "var(--sans)" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 40px", borderBottom: "1px solid #E8E4DC", maxWidth: 1100, margin: "0 auto", width: "100%", background: "#fff" },
  logo: { fontFamily: "var(--serif)", fontSize: 15, fontWeight: 900, letterSpacing: -0.3, display: "flex", alignItems: "center" },
  rec: { display: "flex", alignItems: "center", gap: 6 },
  recDot: { width: 8, height: 8, borderRadius: "50%", background: "#E85C3A", animation: "pulse 1.5s infinite" },
  recLabel: { fontSize: 10, fontWeight: 800, color: "#E85C3A", letterSpacing: 2 },
  hero: { maxWidth: 1100, margin: "0 auto", padding: "80px 40px 60px", textAlign: "center", background: "#fff" },
  tag: { display: "inline-block", background: "#FFF0EC", border: "1px solid #FBD5C8", color: "#E85C3A", padding: "6px 14px", borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 32 },
  h1: { fontFamily: "var(--serif)", fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24 },
  accent: { color: "#E85C3A" },
  sub: { fontSize: "clamp(16px, 2vw, 20px)", color: "#6B6B68", maxWidth: 540, margin: "0 auto 48px", lineHeight: 1.6 },
  ctaRow: { display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" },
  btnRed: { background: "#E85C3A", color: "#fff", border: "none", padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700, transition: "all .2s" },
  btnGhost: { background: "transparent", color: "#6B6B68", border: "1px solid #2a3a2e", padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 600 },
  phone: { maxWidth: 340, margin: "60px auto 0", background: "#1A1A18", borderRadius: 40, border: "6px solid #DDD8D0", padding: "28px 16px", position: "relative", boxShadow: "0 40px 80px rgba(0,0,0,.5)" },
  phoneNotch: { width: 80, height: 6, background: "#DDD8D0", borderRadius: 10, margin: "0 auto 20px" },
  features: { background: "#1A1A18", padding: "80px 40px" },
  featGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 },
  featCard: { background: "#fff", border: "none", borderLeft: "4px solid #E85C3A", borderRadius: 16, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,.3)" },
  featIcon: { fontSize: 32, marginBottom: 16 },
  featTitle: { fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#1A1A18" },
  featDesc: { color: "#6B6B68", lineHeight: 1.65, fontSize: 14 },
  pricing: { maxWidth: 480, margin: "0 auto", padding: "80px 40px", textAlign: "center", background: "#fff" },
  pCard: { background: "#1A1A18", border: "2px solid #E85C3A", borderRadius: 24, padding: "40px 40px 40px" },
  price: { fontFamily: "var(--serif)", fontSize: 56, fontWeight: 900, color: "#E85C3A", lineHeight: 1, marginTop: 8 },
  perMonth: { color: "#aaa", fontSize: 15, marginBottom: 32 },
  checkList: { textAlign: "left", marginBottom: 36 },
  checkItem: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12, fontSize: 15 },
  footer: { background: "#0D0D0D", borderTop: "1px solid #222", padding: "24px 40px", textAlign: "center", color: "#444", fontSize: 13 },
};

export default function Landing() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const canceled = router.query.canceled;

  const startCheckout = async (plan = "standard") => {
    if (!email) { alert("Entre ton email pour continuer"); return; }
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, plan }),
    });
    const { url, error } = await res.json();
    if (error) { alert(error); setLoading(false); return; }
    window.location.href = url;
  };

  const FEATURES = [
    { icon: "🎲", title: "Le Mixeur", desc: "Choisis ton casting, ton univers et ton secret central. La série se génère en quelques secondes." },
    { icon: "📖", title: "La Bible Express", desc: "Personnages, logline, séquencier complet. De l'idée floue à la bible structurée automatiquement." },
    { icon: "🎬", title: "Scripts prêts à tourner", desc: "Chaque épisode de 1 à 2 minutes avec hook, dialogues et directives de cadrage 9:16." },
    { icon: "📱", title: "Mode Tournage", desc: "Téléprompteur auto-scroll, checklist décors, directives caméra. Tout ce qu'il faut sur le plateau." },
  ];

  return (
    <div style={s.page}>
      {/* NAV */}
      <div style={{ borderBottom: "1px solid #E8E4DC" }}>
        <nav style={s.nav}>
          <div style={s.logo}>
          <svg width="28" height="28" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight:8,verticalAlign:"middle"}}>
            <rect width="30" height="30" rx="7" fill="#E85C3A"/>
            <rect x="6" y="14" width="18" height="11" rx="2" fill="white"/>
            <rect x="6" y="10" width="18" height="5" rx="1" fill="white" opacity="0.9"/>
            <line x1="10" y1="10" x2="8" y2="15" stroke="#E85C3A" strokeWidth="1.5"/>
            <line x1="15" y1="10" x2="13" y2="15" stroke="#E85C3A" strokeWidth="1.5"/>
            <line x1="20" y1="10" x2="18" y2="15" stroke="#E85C3A" strokeWidth="1.5"/>
            <polygon points="13,17 13,23 20,20" fill="#E85C3A"/>
          </svg>
          <span style={{verticalAlign:"middle"}}>STUDIO VERTICAL</span>
        </div>
          <div style={s.rec}>
            <div style={s.recDot} />
            <span style={s.recLabel}>REC</span>
          </div>
          <a href="/app" style={{ fontSize: 14, color: "#6B6B68" }}>Se connecter</a>
        </nav>
      </div>

      {/* HERO */}
      <div style={s.hero}>
        <div style={s.tag}>🎬 Le studio mobile des séries verticales</div>
        <h1 style={s.h1}>
          De l'idée<br />au <span style={s.accent}>cliffhanger</span>.<br />En 5 minutes.
        </h1>
        <p style={s.sub}>
          Écris, structure et prépare tes micro-dramas 9:16 avec l'IA. Scripts complets, hooks percutants, prêts à tourner sur mobile.
        </p>
        {canceled && <p style={{ color: "#E85C3A", marginBottom: 16, fontSize: 14 }}>Paiement annulé. Réessaie quand tu veux.</p>}
        <div style={s.ctaRow}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && startCheckout()}
              style={{ padding: "16px 20px", borderRadius: 12, border: "1px solid #2a3a2e", background: "#fff", color: "#1A1A18", fontSize: 15, width: 240, outline: "none" }}
            />
            <button style={{ ...s.btnRed, opacity: loading ? .7 : 1 }} onClick={startCheckout} disabled={loading}>
              {loading ? "Redirection…" : "Commencer →"}
            </button>
          </div>
        </div>
        <p style={{ color: "#AAA8A4", fontSize: 13, marginTop: 14 }}>9€/mois · Annulable à tout moment · Aucun engagement</p>
      </div>

      {/* MOCK PHONE */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 60px" }}>
        <div style={s.phone}>
          <div style={s.phoneNotch} />
          {["⚡ HOOK — 3 PREMIÈRES SECONDES", "MAYA", "Si vous regardez ça... c'est que j'ai pas réussi.", "[9:16] Gros plan face caméra", "LUCA", "Tu as réussi. Regarde ce que j'ai trouvé.", "[9:16] Insert téléphone, notification", "🎬 CLIFFHANGER", "L'écran s'allume. ACCESS GRANTED."].map((line, i) => (
            <p key={i} style={{
              fontSize: line.startsWith("⚡") || line.startsWith("🎬") ? 9 : line === line.toUpperCase() && !line.includes("[") ? 10 : line.startsWith("[") ? 10 : 13,
              fontWeight: line === line.toUpperCase() && !line.startsWith("[") ? 800 : line.startsWith("[") ? 400 : 500,
              color: line.startsWith("⚡") || line.startsWith("🎬") ? "#E85C3A" : line.startsWith("[") ? "#E8E4DC" : line === line.toUpperCase() && !line.startsWith("[") ? "#E85C3A" : "#1A1A18",
              marginBottom: 8, letterSpacing: line.startsWith("⚡") || line.startsWith("🎬") ? 1.5 : 0,
              textTransform: line === line.toUpperCase() && !line.startsWith("[") ? "uppercase" : "none",
              fontFamily: line.startsWith("⚡") || line.startsWith("🎬") ? "monospace" : "inherit",
              lineHeight: 1.5
            }}>{line}</p>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={s.features}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 900, textAlign: "center", marginBottom: 48, color: "#fff" }}>
          Le pipeline créatif complet
        </h2>
        <div style={s.featGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} style={s.featCard}>
              <div style={s.featIcon}>{f.icon}</div>
              <h3 style={s.featTitle}>{f.title}</h3>
              <p style={s.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ ...s.pricing, maxWidth: 860 }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 34, fontWeight: 900, marginBottom: 12, color: "#1A1A18" }}>Choisissez votre plan</h2>
        <p style={{ color: "#6B6B68", marginBottom: 36, fontSize: 15 }}>Annulable à tout moment · Sans engagement</p>
        <input type="email" placeholder="ton@email.com" value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", padding: "14px 18px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", color: "#1A1A18", fontSize: 15, marginBottom: 24, outline: "none", maxWidth: 400, display: "block", margin: "0 auto 28px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {/* Standard */}
          <div style={{ background: "#1A1A18", borderRadius: 24, padding: "36px 32px" }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: "#888", textTransform: "uppercase", marginBottom: 8 }}>Standard</p>
            <div style={{ fontFamily: "var(--serif)", fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1 }}>9€</div>
            <p style={{ color: "#888", fontSize: 14, marginBottom: 28, marginTop: 4 }}>/mois</p>
            <div style={{ marginBottom: 28 }}>
              {["⚡ Fast Drama uniquement", "10 épisodes max", "Scripts 1min – 2min", "Mode Tournage + Téléprompteur", "Export PDF", "Sauvegardes illimitées"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ color: "#E85C3A", fontSize: 16 }}>✓</span>
                  <span style={{ color: "#ddd", fontSize: 14 }}>{item}</span>
                </div>
              ))}
            </div>
            <button style={{ ...s.btnRed, width: "100%", fontSize: 15, padding: 16 }} onClick={() => startCheckout("standard")} disabled={loading}>
              {loading ? "Redirection…" : "Commencer →"}
            </button>
          </div>
          {/* Premium */}
          <div style={{ background: "#1A1A18", border: "2px solid #E85C3A", borderRadius: 24, padding: "36px 32px", position: "relative" }}>
            <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#E85C3A", color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 14px", borderRadius: 20, letterSpacing: 1, whiteSpace: "nowrap" }}>⭐ RECOMMANDÉ</div>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: "#E85C3A", textTransform: "uppercase", marginBottom: 8 }}>Premium</p>
            <div style={{ fontFamily: "var(--serif)", fontSize: 52, fontWeight: 900, color: "#E85C3A", lineHeight: 1 }}>19€</div>
            <p style={{ color: "#888", fontSize: 14, marginBottom: 28, marginTop: 4 }}>/mois</p>
            <div style={{ marginBottom: 28 }}>
              {["⚡ Fast Drama + 🎭 Premium Suspense", "Jusqu'à 40 épisodes", "Scripts 1min – 2min", "Mode Tournage + Téléprompteur", "🎲 3 variations par script", "🔥 Générateur de titres viraux", "Export PDF", "Sauvegardes illimitées"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ color: "#E85C3A", fontSize: 16 }}>✓</span>
                  <span style={{ color: "#ddd", fontSize: 14 }}>{item}</span>
                </div>
              ))}
            </div>
            <button style={{ ...s.btnRed, width: "100%", fontSize: 15, padding: 16 }} onClick={() => startCheckout("premium")} disabled={loading}>
              {loading ? "Redirection…" : "Commencer Premium →"}
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={s.footer}>
        <p>© 2026 Studio Vertical · Tous droits réservés · <a href="mailto:hello@studiovertical.app" style={{ color: "#666" }}>Contact</a> · <a href="/cgu" style={{ color: "#666" }}>CGU</a> · <a href="/confidentialite" style={{ color: "#666" }}>Confidentialité</a></p>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        input::placeholder { color: #AAA8A4; }
        button:hover { opacity: .9; }
      `}</style>
    </div>
  );
}

import { useState } from "react";
import { useRouter } from "next/router";

const s = {
  page: { minHeight: "100vh", background: "#0F1A12", color: "#fff", fontFamily: "var(--sans)" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: "1px solid #1a2a1e", maxWidth: 1100, margin: "0 auto", width: "100%" },
  logo: { fontFamily: "var(--serif)", fontSize: 20, fontWeight: 900, letterSpacing: -0.5 },
  rec: { display: "flex", alignItems: "center", gap: 6 },
  recDot: { width: 8, height: 8, borderRadius: "50%", background: "#E85C3A", animation: "pulse 1.5s infinite" },
  recLabel: { fontSize: 10, fontWeight: 800, color: "#E85C3A", letterSpacing: 2 },
  hero: { maxWidth: 1100, margin: "0 auto", padding: "80px 40px 60px", textAlign: "center" },
  tag: { display: "inline-block", background: "#1a2a1e", border: "1px solid #2a4a2e", color: "#5a9a6a", padding: "6px 14px", borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 32 },
  h1: { fontFamily: "var(--serif)", fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24 },
  accent: { color: "#E85C3A" },
  sub: { fontSize: "clamp(16px, 2vw, 20px)", color: "#5a7060", maxWidth: 540, margin: "0 auto 48px", lineHeight: 1.6 },
  ctaRow: { display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" },
  btnRed: { background: "#E85C3A", color: "#fff", border: "none", padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700, transition: "all .2s" },
  btnGhost: { background: "transparent", color: "#5a7060", border: "1px solid #2a3a2e", padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 600 },
  phone: { maxWidth: 340, margin: "60px auto 0", background: "#0d1610", borderRadius: 40, border: "6px solid #1a2a1e", padding: "28px 16px", position: "relative", boxShadow: "0 40px 80px rgba(0,0,0,.5)" },
  phoneNotch: { width: 80, height: 6, background: "#1a2a1e", borderRadius: 10, margin: "0 auto 20px" },
  features: { maxWidth: 1100, margin: "0 auto", padding: "80px 40px" },
  featGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 },
  featCard: { background: "#0d1610", border: "1px solid #1a2a1e", borderRadius: 20, padding: 32 },
  featIcon: { fontSize: 32, marginBottom: 16 },
  featTitle: { fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, marginBottom: 10 },
  featDesc: { color: "#5a7060", lineHeight: 1.6, fontSize: 15 },
  pricing: { maxWidth: 480, margin: "0 auto", padding: "60px 40px 80px", textAlign: "center" },
  pCard: { background: "#0d1610", border: "2px solid #E85C3A", borderRadius: 24, padding: 40 },
  price: { fontFamily: "var(--serif)", fontSize: 56, fontWeight: 900, color: "#E85C3A", lineHeight: 1 },
  perMonth: { color: "#5a7060", fontSize: 15, marginBottom: 32 },
  checkList: { textAlign: "left", marginBottom: 36 },
  checkItem: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12, fontSize: 15 },
  footer: { borderTop: "1px solid #1a2a1e", padding: "24px 40px", textAlign: "center", color: "#3a5040", fontSize: 13 },
};

export default function Landing() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const canceled = router.query.canceled;

  const startCheckout = async () => {
    if (!email) { alert("Entre ton email pour continuer"); return; }
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const { url } = await res.json();
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
      <div style={{ borderBottom: "1px solid #1a2a1e" }}>
        <nav style={s.nav}>
          <div style={s.logo}>VERTICAL STUDIO</div>
          <div style={s.rec}>
            <div style={s.recDot} />
            <span style={s.recLabel}>REC</span>
          </div>
          <a href="/app" style={{ fontSize: 14, color: "#5a7060" }}>Se connecter</a>
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
              style={{ padding: "16px 20px", borderRadius: 12, border: "1px solid #2a3a2e", background: "#0d1610", color: "#fff", fontSize: 15, width: 240, outline: "none" }}
            />
            <button style={{ ...s.btnRed, opacity: loading ? .7 : 1 }} onClick={startCheckout} disabled={loading}>
              {loading ? "Redirection…" : "Commencer →"}
            </button>
          </div>
        </div>
        <p style={{ color: "#3a5040", fontSize: 13, marginTop: 14 }}>9€/mois · Annulable à tout moment · Aucun engagement</p>
      </div>

      {/* MOCK PHONE */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 60px" }}>
        <div style={s.phone}>
          <div style={s.phoneNotch} />
          {["⚡ HOOK — 3 PREMIÈRES SECONDES", "MAYA", "Si vous regardez ça... c'est que j'ai pas réussi.", "[9:16] Gros plan face caméra", "LUCA", "Tu as réussi. Regarde ce que j'ai trouvé.", "[9:16] Insert téléphone, notification", "🎬 CLIFFHANGER", "L'écran s'allume. ACCESS GRANTED."].map((line, i) => (
            <p key={i} style={{
              fontSize: line.startsWith("⚡") || line.startsWith("🎬") ? 9 : line === line.toUpperCase() && !line.includes("[") ? 10 : line.startsWith("[") ? 10 : 13,
              fontWeight: line === line.toUpperCase() && !line.startsWith("[") ? 800 : line.startsWith("[") ? 400 : 500,
              color: line.startsWith("⚡") || line.startsWith("🎬") ? "#E85C3A" : line.startsWith("[") ? "#2a4a2e" : line === line.toUpperCase() && !line.startsWith("[") ? "#5a9a6a" : "#c8d8c0",
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
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 900, textAlign: "center", marginBottom: 48 }}>
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
      <div style={s.pricing}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 900, marginBottom: 32 }}>Un seul tarif, tout inclus</h2>
        <div style={s.pCard}>
          <div style={s.price}>9€</div>
          <p style={s.perMonth}>/mois · Sans engagement</p>
          <div style={s.checkList}>
            {[
              "Séries illimitées",
              "Scripts 1min, 1min30, 2min",
              "Fast Drama + Premium Suspense",
              "Mode Tournage + Téléprompteur",
              "Export PDF",
              "Mises à jour incluses",
            ].map((item, i) => (
              <div key={i} style={s.checkItem}>
                <span style={{ color: "#E85C3A", fontSize: 18 }}>✓</span>
                <span style={{ color: "#c8d8c0" }}>{item}</span>
              </div>
            ))}
          </div>
          <input
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: "14px 18px", borderRadius: 10, border: "1px solid #2a3a2e", background: "#0F1A12", color: "#fff", fontSize: 15, marginBottom: 12, outline: "none" }}
          />
          <button style={{ ...s.btnRed, width: "100%", fontSize: 16, padding: 18 }} onClick={startCheckout} disabled={loading}>
            {loading ? "Redirection…" : "Commencer maintenant →"}
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={s.footer}>
        <p>© 2025 Vertical Studio · <a href="mailto:hello@verticalstudio.app" style={{ color: "#5a7060" }}>Contact</a></p>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        input::placeholder { color: #3a5040; }
        button:hover { opacity: .9; }
      `}</style>
    </div>
  );
}

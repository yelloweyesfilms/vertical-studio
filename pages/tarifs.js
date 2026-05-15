import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const RED = "#E85C3A";
const VIO = "#a855f7";
const DARK = "#09090f";
const SURFACE = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#f1f5f9";
const MUTED = "#64748b";
const SITE = "https://studiovertical.app";

const Check = ({ color = RED }) => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="9" fill={color} opacity="0.2" />
    <path d="M5 9l3 3 5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Cross = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, opacity: 0.3 }}>
    <circle cx="9" cy="9" r="9" fill={MUTED} opacity="0.2" />
    <path d="M6 6l6 6M12 6l-6 6" stroke={MUTED} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Logo = () => (
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

const FEATURES = [
  { label: "Mode Fast Drama", std: true, prem: true },
  { label: "Mode Premium Suspense", std: false, prem: true },
  { label: "Épisodes par série", std: "10 max", prem: "90 max" },
  { label: "Scripts prêts à tourner (9:16)", std: true, prem: true },
  { label: "Hook 3 secondes + Cliffhanger", std: true, prem: true },
  { label: "3 variations par script (Intense / Subtil / Rapide)", std: false, prem: true },
  { label: "Générateur de titres viraux", std: false, prem: true },
  { label: "Fiche technique de production", std: false, prem: true },
  { label: "Affiche IA (9:16)", std: true, prem: true },
  { label: "Mode Tournage + Téléprompteur", std: true, prem: true },
  { label: "Traduction en 8 langues", std: true, prem: true },
  { label: "Mixeur de séries (12 univers, 16 secrets)", std: true, prem: true },
  { label: "Packs thématiques (12 packs)", std: true, prem: true },
  { label: "Sauvegarde cloud multi-appareils", std: true, prem: true },
  { label: "Export PDF", std: true, prem: true },
];

const FAQ = [
  { q: "Quelle est la différence entre Fast Drama et Premium Suspense ?", r: "Fast Drama génère des dialogues directs, des hooks agressifs et un rythme maximal — parfait pour TikTok. Premium Suspense travaille la tension psychologique, les non-dits et les sous-textes. Disponible uniquement en Premium." },
  { q: "Puis-je passer de Standard à Premium à tout moment ?", r: "Oui, en un clic depuis ton espace Stripe. La différence de prix est proratisée automatiquement." },
  { q: "L'essai 24h débite-t-il ma carte ?", r: "Non. Aucun débit pendant l'essai. Si tu n'annules pas avant minuit, l'abonnement démarre automatiquement." },
  { q: "Puis-je annuler mon abonnement ?", r: "Oui, à tout moment depuis ton espace Stripe. Aucun engagement. Tu gardes l'accès jusqu'à la fin de la période payée." },
  { q: "L'abonnement annuel est-il remboursable ?", r: "Oui, dans les 7 jours suivant le débit annuel. Contacte-nous via le chat." },
];

export default function Tarifs() {
  const [billing, setBilling] = useState("monthly");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const track = () => fetch("/api/analytics", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "page_view_tarifs" }),
    }).catch(() => {});
    track();
  }, []);

  const startCheckout = async (plan, position) => {
    if (!email) { alert("Entre ton email pour continuer"); return; }
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, plan, billing }),
    });
    const { url, error } = await res.json();
    if (error) { alert(error); setLoading(false); return; }
    window.location.href = url;
  };

  const startTrial = async (plan) => {
    if (!email) { alert("Entre ton email pour continuer"); return; }
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, plan, billing: "monthly", trial: true }),
    });
    const { url, error } = await res.json();
    if (error) { alert(error); setLoading(false); return; }
    window.location.href = url;
  };

  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Studio Vertical",
    "url": SITE,
    "applicationCategory": "CreativeApplication",
    "operatingSystem": "Web",
    "offers": [
      { "@type": "Offer", "price": "9", "priceCurrency": "EUR", "name": "Standard mensuel", "billingIncrement": "P1M" },
      { "@type": "Offer", "price": "90", "priceCurrency": "EUR", "name": "Standard annuel", "billingIncrement": "P1Y" },
      { "@type": "Offer", "price": "19", "priceCurrency": "EUR", "name": "Premium mensuel", "billingIncrement": "P1M" },
      { "@type": "Offer", "price": "179", "priceCurrency": "EUR", "name": "Premium annuel", "billingIncrement": "P1Y" },
    ],
  };

  return (
    <>
      <Head>
        <title>Tarifs Studio Vertical — Micro-drama IA dès 7,50€/mois</title>
        <meta name="description" content="Comparez les plans Standard (9€/mois) et Premium (19€/mois) de Studio Vertical. Générez des micro-dramas 9:16 complets pour TikTok, Reels, Shorts et DramaBox. Essai 24h sans engagement." />
        <link rel="canonical" href={`${SITE}/tarifs`} />
        <meta property="og:title" content="Tarifs Studio Vertical — Micro-drama IA dès 7,50€/mois" />
        <meta property="og:description" content="Standard 9€/mois ou Premium 19€/mois. Générez des séries complètes pour TikTok, DramaBox, ReelShort. Essai 24h gratuit." />
        <meta property="og:url" content={`${SITE}/tarifs`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }} />
      </Head>

      <div style={{ minHeight: "100vh", background: DARK, color: TEXT, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          input { font-size: 16px !important; }
          a { text-decoration: none; color: inherit; }
          button:hover { opacity: .88 !important; }
          .glass { background: ${SURFACE}; border: 1px solid ${BORDER}; }
          @media (max-width: 900px) {
            .plans-grid { grid-template-columns: 1fr !important; max-width: 420px !important; margin: 0 auto !important; }
            .compare-table { display: none !important; }
            .faq-grid { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 640px) {
            .page-pad { padding: 60px 20px !important; }
            nav { padding: 14px 16px !important; }
          }
        `}</style>

        {/* NAV */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: `1px solid ${BORDER}`, background: "rgba(9,9,15,0.9)", backdropFilter: "blur(20px)" }}>
          <nav style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <a href="/"><Logo /></a>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <a href="/exemples" style={{ fontSize: 14, color: MUTED, fontWeight: 600 }}>Exemples</a>
              <a href="/app" style={{ fontSize: 14, color: TEXT, fontWeight: 700, background: SURFACE, border: `1px solid ${BORDER}`, padding: "8px 16px", borderRadius: 10 }}>Se connecter →</a>
            </div>
          </nav>
        </div>

        {/* HERO */}
        <div className="page-pad" style={{ padding: "80px 40px 48px", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: `radial-gradient(ellipse, rgba(168,85,247,0.08) 0%, transparent 70%)`, pointerEvents: "none" }} />
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: VIO, marginBottom: 20 }}>Tarifs</p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, letterSpacing: -2, lineHeight: 1.0, marginBottom: 20, color: TEXT }}>
            Simple.<br />
            <span style={{ background: `linear-gradient(135deg, ${RED} 30%, ${VIO})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>
              Transparent.
            </span>
          </h1>
          <p style={{ color: MUTED, fontSize: 17, maxWidth: 460, margin: "0 auto 48px", lineHeight: 1.7 }}>
            Deux plans, zéro surprise. Annulable à tout moment.
          </p>

          {/* Email */}
          <div style={{ maxWidth: 360, margin: "0 auto 32px" }}>
            <input
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", padding: "15px 18px", borderRadius: 12, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, fontSize: 15, outline: "none", backdropFilter: "blur(8px)" }}
            />
          </div>

          {/* Billing toggle */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <div style={{ display: "inline-flex", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 4, gap: 4 }}>
              {[
                { k: "monthly", l: "Mensuel" },
                { k: "annual", l: "Annuel", badge: "-17%" },
              ].map(({ k, l, badge }) => (
                <button key={k} onClick={() => setBilling(k)} style={{
                  padding: "9px 22px", borderRadius: 10, border: "none",
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", transition: "all .2s",
                  background: billing === k ? TEXT : "transparent",
                  color: billing === k ? DARK : MUTED,
                  display: "flex", alignItems: "center", gap: 7,
                }}>
                  {l}
                  {badge && (
                    <span style={{
                      fontSize: 10, fontWeight: 800,
                      background: billing === k ? `linear-gradient(135deg,${RED},${VIO})` : "transparent",
                      WebkitBackgroundClip: billing === k ? "text" : "initial",
                      WebkitTextFillColor: billing === k ? "transparent" : MUTED,
                      backgroundClip: billing === k ? "text" : "initial",
                      color: billing !== k ? MUTED : undefined,
                    }}>{badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          {billing === "annual" && (
            <p style={{ textAlign: "center", fontSize: 13, color: "#4ade80", fontWeight: 600, marginBottom: 4 }}>
              🎉 2 mois offerts par rapport au mensuel
            </p>
          )}
        </div>

        {/* PLANS */}
        <div className="page-pad" style={{ padding: "0 40px 80px" }}>
          <div className="plans-grid" style={{ maxWidth: 860, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            {/* STANDARD */}
            <div className="glass" style={{ borderRadius: 28, padding: "40px 36px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${RED}, transparent)` }} />
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: MUTED, textTransform: "uppercase", marginBottom: 16 }}>Standard</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 4 }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 64, fontWeight: 900, color: TEXT, lineHeight: 1, letterSpacing: -2 }}>
                  {billing === "annual" ? "7.5€" : "9€"}
                </div>
                {billing === "annual" && <span style={{ fontSize: 15, color: MUTED, marginBottom: 12, textDecoration: "line-through" }}>9€</span>}
              </div>
              <p style={{ color: MUTED, fontSize: 14, marginBottom: billing === "annual" ? 6 : 32 }}>/mois</p>
              {billing === "annual" && <p style={{ fontSize: 13, color: "#4ade80", fontWeight: 600, marginBottom: 28 }}>facturé 90€/an</p>}
              <button onClick={() => startCheckout("standard", "tarifs")} disabled={loading}
                style={{ width: "100%", background: RED, color: "#fff", border: "none", padding: "15px 0", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10, fontFamily: "'Space Grotesk', sans-serif", boxShadow: `0 0 24px rgba(232,92,58,0.35)`, transition: "all .2s" }}>
                {loading ? "Redirection…" : "Commencer Standard →"}
              </button>
              <button onClick={() => startTrial("standard")} disabled={loading}
                style={{ width: "100%", background: "none", border: `1px solid ${BORDER}`, color: MUTED, padding: "11px 0", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" }}>
                Essayer 24h gratuitement →
              </button>
              <div style={{ height: 1, background: BORDER, margin: "28px 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  "Fast Drama uniquement",
                  "10 épisodes par série",
                  "Scripts prêts à tourner (9:16)",
                  "Affiche IA incluse",
                  "Mode Tournage + Téléprompteur",
                  "Traduction en 8 langues",
                  "Sauvegarde cloud",
                  "Export PDF",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ marginTop: 1 }}><Check /></div>
                    <span style={{ color: MUTED, fontSize: 14, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PREMIUM */}
            <div style={{ borderRadius: 28, padding: "40px 36px", position: "relative", overflow: "hidden", background: "rgba(168,85,247,0.05)", border: "1.5px solid rgba(168,85,247,0.28)", boxShadow: "0 0 60px rgba(168,85,247,0.10)" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${VIO}, ${RED})` }} />
              <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${RED}, ${VIO})`, color: "#fff", fontSize: 10, fontWeight: 800, padding: "4px 18px", borderRadius: 20, letterSpacing: 1.5, whiteSpace: "nowrap" }}>⭐ RECOMMANDÉ</div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: VIO, textTransform: "uppercase", marginBottom: 16 }}>Premium</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 4 }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 64, fontWeight: 900, color: TEXT, lineHeight: 1, letterSpacing: -2 }}>
                  {billing === "annual" ? "14.9€" : "19€"}
                </div>
                {billing === "annual" && <span style={{ fontSize: 15, color: MUTED, marginBottom: 12, textDecoration: "line-through" }}>19€</span>}
              </div>
              <p style={{ color: MUTED, fontSize: 14, marginBottom: billing === "annual" ? 6 : 32 }}>/mois</p>
              {billing === "annual" && <p style={{ fontSize: 13, color: "#4ade80", fontWeight: 600, marginBottom: 28 }}>facturé 179€/an</p>}
              <button onClick={() => startCheckout("premium", "tarifs")} disabled={loading}
                style={{ width: "100%", background: `linear-gradient(135deg, ${RED}, ${VIO})`, color: "#fff", border: "none", padding: "15px 0", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10, fontFamily: "'Space Grotesk', sans-serif", boxShadow: `0 0 32px rgba(168,85,247,0.3), 0 0 16px rgba(232,92,58,0.2)`, transition: "all .2s" }}>
                {loading ? "Redirection…" : "Commencer Premium →"}
              </button>
              <button onClick={() => startTrial("premium")} disabled={loading}
                style={{ width: "100%", background: "none", border: "1px solid rgba(168,85,247,0.25)", color: VIO, padding: "11px 0", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" }}>
                Essayer 24h gratuitement →
              </button>
              <div style={{ height: 1, background: "rgba(168,85,247,0.15)", margin: "28px 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { t: "Fast Drama + Premium Suspense", highlight: true },
                  { t: "Jusqu'à 90 épisodes par série", highlight: true },
                  { t: "Scripts prêts à tourner (9:16)", highlight: false },
                  { t: "Affiche IA incluse", highlight: false },
                  { t: "Mode Tournage + Téléprompteur", highlight: false },
                  { t: "3 variations par script", highlight: true },
                  { t: "Générateur de titres viraux", highlight: true },
                  { t: "Fiche technique de production", highlight: true },
                  { t: "Traduction en 8 langues", highlight: false },
                  { t: "Sauvegarde cloud", highlight: false },
                  { t: "Export PDF", highlight: false },
                ].map(({ t, highlight }, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ marginTop: 1 }}><Check color={VIO} /></div>
                    <span style={{ color: highlight ? TEXT : MUTED, fontSize: 14, lineHeight: 1.5, fontWeight: highlight ? 600 : 400 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust row */}
          <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap", marginTop: 28 }}>
            {[
              { icon: "🔒", label: "Stripe · Paiement sécurisé" },
              { icon: "✓", label: "Annulable en 1 clic" },
              { icon: "⚡", label: "Accès immédiat" },
              { icon: "🛡️", label: "Données chiffrées" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: MUTED }}>
                <span style={{ color: "#4ade80", fontSize: 14 }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 12, color: MUTED, marginTop: 12 }}>
            Essai 24h : carte bancaire requise, aucun débit pendant l'essai. Annulable avant minuit.
          </p>
        </div>

        {/* COMPARISON TABLE */}
        <div className="compare-table" style={{ borderTop: `1px solid ${BORDER}`, padding: "80px 40px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: VIO, marginBottom: 12 }}>Comparaison</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, textAlign: "center", marginBottom: 48, letterSpacing: -1.5, lineHeight: 1.1, color: TEXT }}>
              Standard vs Premium<br /><span style={{ fontStyle: "italic", color: MUTED }}>en détail.</span>
            </h2>
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 20, overflow: "hidden" }}>
              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 140px", borderBottom: `1px solid ${BORDER}`, padding: "18px 24px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: 2, textTransform: "uppercase" }}>Fonctionnalité</div>
                <div style={{ textAlign: "center", fontSize: 12, fontWeight: 800, color: TEXT }}>Standard</div>
                <div style={{ textAlign: "center", fontSize: 12, fontWeight: 800, color: VIO }}>Premium</div>
              </div>
              {FEATURES.map(({ label, std, prem }, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 140px 140px", padding: "14px 24px", borderBottom: i < FEATURES.length - 1 ? `1px solid ${BORDER}` : "none", background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                  <span style={{ fontSize: 14, color: MUTED, lineHeight: 1.5 }}>{label}</span>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {std === true ? <Check /> : std === false ? <Cross /> : <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{std}</span>}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {prem === true ? <Check color={VIO} /> : prem === false ? <Cross /> : <span style={{ fontSize: 12, fontWeight: 700, color: VIO }}>{prem}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "80px 40px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: RED, marginBottom: 12 }}>FAQ</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, textAlign: "center", marginBottom: 48, letterSpacing: -1.5, lineHeight: 1.1, color: TEXT }}>
              Questions fréquentes.
            </h2>
            {FAQ.map((item, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'Space Grotesk', sans-serif" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: TEXT, paddingRight: 16 }}>{item.q}</span>
                  <span style={{ color: VIO, fontSize: 22, flexShrink: 0, transition: "transform .2s", display: "inline-block", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                {openFaq === i && <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.75, paddingBottom: 20 }}>{item.r}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* CTA FINAL */}
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "80px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, rgba(168,85,247,0.06) 0%, transparent 60%)`, pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(30px, 5vw, 58px)", fontWeight: 900, marginBottom: 16, letterSpacing: -2, lineHeight: 1.1, color: TEXT }}>
              Ta première série<br />
              dans{" "}
              <span style={{ background: `linear-gradient(135deg, ${RED}, ${VIO})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>
                5 minutes.
              </span>
            </h2>
            <p style={{ color: MUTED, fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>
              Voir les <a href="/exemples" style={{ color: VIO, fontWeight: 600 }}>séries exemples →</a>
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <input type="email" placeholder="ton@email.com" value={email} onChange={e => setEmail(e.target.value)}
                style={{ padding: "16px 20px", borderRadius: 14, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, fontSize: 15, width: 240, outline: "none" }} />
              <button onClick={() => startCheckout("standard", "cta_final")} disabled={loading}
                style={{ background: `linear-gradient(135deg, ${RED}, ${VIO})`, color: "#fff", border: "none", padding: "16px 32px", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", boxShadow: `0 0 32px rgba(168,85,247,0.3)` }}>
                {loading ? "Redirection…" : "Commencer →"}
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER minimal */}
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "28px 40px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
          <Logo />
          <div style={{ display: "flex", gap: 20, fontSize: 13, color: MUTED }}>
            <a href="/">Accueil</a>
            <a href="/exemples">Exemples</a>
            <a href="/cgu">CGU</a>
            <a href="/confidentialite">Confidentialité</a>
          </div>
        </div>
      </div>
    </>
  );
}

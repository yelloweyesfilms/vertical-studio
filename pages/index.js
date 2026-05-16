import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { POSTS } from "../lib/posts";

const RED = "#E85C3A";
const VIO = "#a855f7";
const DARK = "#09090f";
const SURFACE = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#f1f5f9";
const MUTED = "#94a3b8";

const TESTIMONIALS = [
  {
    text: "J'ai généré ma première série de 10 épisodes en moins de 5 minutes. Les scripts sont directement tournables, rien à réécrire. J'ai posté l'épisode 1 le soir même.",
    name: "Marie L.",
    role: "Créatrice TikTok",
    stats: "85k abonnés · 2,3M vues",
    avatar: "ML",
    color: "#E85C3A",
  },
  {
    text: "Le Mode Tournage avec téléprompteur change tout. Mon équipe produit 3 séries par semaine avec 2 personnes. On a soumis à DramaBox après 2 semaines.",
    name: "Tom K.",
    role: "Producteur indépendant",
    stats: "12 séries produites",
    avatar: "TK",
    color: "#a855f7",
  },
  {
    text: "Les 3 variations par script permettent de choisir le ton parfait. Le Premium Suspense génère des dialogues d'un niveau qu'on n'écrirait pas aussi vite seul.",
    name: "Yasmine B.",
    role: "Actrice · Réalisatrice",
    stats: "Sélectionnée ReelShort",
    avatar: "YB",
    color: "#4ade80",
  },
  {
    text: "La traduction automatique nous a ouvert le marché espagnol. On poste en FR et ES simultanément, 0 effort supplémentaire. Le ROI est dingue.",
    name: "Lucas M.",
    role: "Studio de contenu",
    stats: "3 marchés · FR / ES / PT",
    avatar: "LM",
    color: "#60a5fa",
  },
];

const FAQ_ITEMS = [
  { q: "C'est quoi un micro-drama vertical ?", r: "Un format vidéo court (1 à 2 min), filmé en 9:16 pour mobile, avec une structure dramatique forte : hook percutant, tension montante et cliffhanger final. Le format qui explose sur TikTok, Instagram Reels, YouTube Shorts — et sur les plateformes spécialisées comme DramaBox, ReelShort ou Crazy Maple." },
  { q: "Combien de temps pour générer une série complète ?", r: "Moins de 5 minutes. La bible (titre, logline, personnages) se génère en streaming en quelques secondes. Les épisodes arrivent en parallèle. Le script d'un épisode prend 10 secondes." },
  { q: "Quelle différence entre Fast Drama et Premium Suspense ?", r: "Fast Drama : émotions frontales, hooks agressifs, rythme maximal — idéal pour TikTok. Premium Suspense : tension psychologique, sous-texte, silences lourds — pour une audience plus mature et des séries premium." },
  { q: "Les scripts sont-ils vraiment prêts à tourner ?", r: "Oui. Chaque scène inclut le dialogue, l'indication de jeu d'acteur et la directive de cadrage 9:16. Le Mode Tournage intègre un téléprompteur auto-scroll et une checklist décors." },
  { q: "Mes séries sont-elles sauvegardées ?", r: "Elles sont sauvegardées localement sur ton appareil et synchronisées dans le cloud automatiquement. Tu y accèdes depuis n'importe quel appareil via l'onglet ☁️ Cloud." },
  { q: "Puis-je annuler mon abonnement ?", r: "Oui, à tout moment en un clic depuis ton espace Stripe. Aucun engagement, aucune pénalité. Tu gardes l'accès jusqu'à la fin de la période payée." },
];

/* ─── SVG ICONS ─── */
const TikTokIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
  </svg>
);

const ReelsIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

const ShortsIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.38.55A3.02 3.02 0 00.5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 002.12 2.14c1.86.55 9.38.55 9.38.55s7.52 0 9.38-.55a3.02 3.02 0 002.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.75 15.5V8.5l6.5 3.5-6.5 3.5z" />
  </svg>
);

const BoltIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const PhoneIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="2" width="10" height="20" rx="3" />
    <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
  </svg>
);

const ClapperIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.2 6L3 11l-.9-2.4c-.3-.8.1-1.7.9-2l1-.4" />
    <path d="M20.2 6l.9 2.4c.3.8-.1 1.7-.9 2L3 16" />
    <path d="M2 19.5h20a1 1 0 001-1v-9a1 1 0 00-1-1H2a1 1 0 00-1 1v9a1 1 0 001 1z" />
    <line x1="7" y1="8.5" x2="9.5" y2="14" />
    <line x1="13" y1="7" x2="15.5" y2="12.5" />
  </svg>
);

const ClockIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/* ─── COMPONENTS ─── */
const Logo = ({ size = "md" }) => {
  const sm = size === "sm";
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: sm ? 7 : 10, userSelect: "none" }}>
      <div style={{ width: 3, borderRadius: 2, background: "linear-gradient(to bottom, #ff8c42, #E85C3A)", flexShrink: 0 }} />
      <svg width={sm ? 13 : 17} height={sm ? 22 : 28} viewBox="0 0 17 28" fill="none" style={{ flexShrink: 0, alignSelf: "center" }}>
        <rect x="1" y="1" width="15" height="26" rx="3" stroke="white" strokeWidth="1.5"/>
        <circle cx="8.5" cy="23.5" r="1.1" fill="white" opacity="0.5"/>
        <rect x="5.5" y="3.5" width="6" height="1" rx="0.5" fill="white" opacity="0.4"/>
      </svg>
      <div style={{ alignSelf: "center", lineHeight: 1 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: sm ? 8 : 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>VERTICAL</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: sm ? 13 : 18, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1, background: "linear-gradient(135deg, #ff8c42, #E85C3A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>CLAP</div>
      </div>
    </div>
  );
};

const GlowBtn = ({ children, onClick, disabled, gradient, style = {} }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: gradient ? `linear-gradient(135deg, ${RED}, ${VIO})` : RED,
    color: "#fff", border: "none", padding: "16px 32px", borderRadius: 14,
    fontSize: 15, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1, fontFamily: "'Space Grotesk', sans-serif",
    boxShadow: gradient ? `0 0 32px rgba(168,85,247,0.35), 0 0 16px rgba(232,92,58,0.25)` : `0 0 24px rgba(232,92,58,0.4)`,
    transition: "all .2s", letterSpacing: -0.3, ...style,
  }}>{children}</button>
);

const Check = ({ color = RED }) => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="9" fill={color} opacity="0.2" />
    <path d="M5 9l3 3 5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function NewsletterSection() {
  const [nlEmail, setNlEmail] = useState("");
  const [nlState, setNlState] = useState("idle");

  const submit = async () => {
    if (!nlEmail || !nlEmail.includes("@")) return;
    setNlState("loading");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: nlEmail }) });
      const data = await res.json();
      setNlState(data.ok ? "done" : "error");
    } catch { setNlState("error"); }
  };

  return (
    <div style={{ borderTop: `1px solid ${BORDER}`, padding: "72px 40px", textAlign: "center", background: "rgba(255,255,255,0.01)" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>Restez informé</p>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, color: TEXT, letterSpacing: -1, lineHeight: 1.1, marginBottom: 12 }}>
          Pas encore prêt ?<br /><span style={{ fontStyle: "italic", color: MUTED }}>On garde le contact.</span>
        </h2>
        <p style={{ color: MUTED, fontSize: 15, marginBottom: 28, lineHeight: 1.7 }}>
          Reçois nos guides sur le micro-drama vertical, les nouvelles fonctionnalités et les astuces des créateurs.
        </p>
        {nlState === "done" ? (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 14, padding: "16px 28px" }}>
            <span style={{ color: "#4ade80", fontSize: 18 }}>✓</span>
            <span style={{ color: "#4ade80", fontWeight: 700, fontSize: 15 }}>Tu es inscrit — à bientôt !</span>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <input type="email" placeholder="ton@email.com" value={nlEmail} onChange={e => setNlEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{ padding: "14px 18px", borderRadius: 12, border: `1px solid ${nlState === "error" ? RED : BORDER}`, background: SURFACE, color: TEXT, fontSize: 15, width: 240, outline: "none" }} />
            <button onClick={submit} disabled={nlState === "loading"}
              style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT, padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", transition: "all .2s" }}>
              {nlState === "loading" ? "…" : "M'inscrire"}
            </button>
          </div>
        )}
        {nlState === "error" && <p style={{ color: RED, fontSize: 13, marginTop: 10 }}>Une erreur est survenue, réessaie.</p>}
        <p style={{ color: MUTED, fontSize: 12, marginTop: 14 }}>Aucun spam. Désabonnement en 1 clic.</p>
      </div>
    </div>
  );
}

const Label = ({ children, color = VIO }) => (
  <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color, marginBottom: 16, fontFamily: "'Space Grotesk', sans-serif" }}>{children}</p>
);

const Title = ({ children, style = {} }) => (
  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 900, textAlign: "center", marginBottom: 12, letterSpacing: -1.5, lineHeight: 1.1, color: TEXT, ...style }}>{children}</h2>
);

export default function Landing() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [billing, setBilling] = useState("monthly");
  const router = useRouter();
  const canceled = router.query.canceled;

  const track = (event, meta = {}) => fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event, meta }) }).catch(() => {});

  useEffect(() => {
    track("page_view");
  }, []);

  const startCheckout = async (plan = "standard", position = "unknown", opts = {}) => {
    if (!email || !email.includes("@")) {
      setEmailError(true);
      setTimeout(() => setEmailError(false), 3000);
      document.querySelector("input[type=email]")?.focus();
      return;
    }
    setEmailError(false);
    const { trial = false, billingOverride } = opts;
    const b = billingOverride || billing;
    track("checkout_started", { position, plan, billing: b, trial });
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, plan, billing: b, trial }) });
      const { url, error } = await res.json();
      if (error) { alert(error); setLoading(false); return; }
      window.location.href = url;
    } catch {
      alert("Erreur réseau. Réessaie.");
      setLoading(false);
    }
  };

  const SITE = "https://verticalclap.app";
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_ITEMS.map(({ q, r }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": r },
    })),
  };
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VerticalClap",
    "url": SITE,
    "applicationCategory": "CreativeApplication",
    "operatingSystem": "Web",
    "offers": [
      { "@type": "Offer", "price": "9", "priceCurrency": "EUR", "name": "Standard mensuel", "billingIncrement": "P1M" },
      { "@type": "Offer", "price": "90", "priceCurrency": "EUR", "name": "Standard annuel", "billingIncrement": "P1Y" },
      { "@type": "Offer", "price": "19", "priceCurrency": "EUR", "name": "Premium mensuel", "billingIncrement": "P1M" },
      { "@type": "Offer", "price": "179", "priceCurrency": "EUR", "name": "Premium annuel", "billingIncrement": "P1Y" },
    ],
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "58" },
  };

  return (
    <>
    <Head>
      <title>VerticalClap — Micro-dramas 9:16 générés par l'IA</title>
      <meta name="description" content="Génère une série complète en 5 minutes : bible, scripts, hooks et cliffhangers prêts à tourner. Pour TikTok, Reels, Shorts et DramaBox." />
      <link rel="canonical" href={SITE} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE} />
      <meta property="og:title" content="VerticalClap — Micro-dramas 9:16 générés par l'IA" />
      <meta property="og:description" content="L'outil IA pour écrire tes micro-dramas 9:16 : bible, scripts, hooks et cliffhangers prêts à tourner en 5 minutes." />
      <meta property="og:image" content={`${SITE}/hero.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="VerticalClap — Micro-dramas 9:16 générés par l'IA" />
      <meta name="twitter:description" content="L'outil IA pour écrire tes micro-dramas 9:16 : bible, scripts, hooks et cliffhangers prêts à tourner en 5 minutes." />
      <meta name="twitter:image" content={`${SITE}/hero.png`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    </Head>
    <div style={{ minHeight: "100vh", background: DARK, color: TEXT, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes glow { 0%,100%{opacity:.7} 50%{opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes lineGrow { from{width:0} to{width:100%} }
        @keyframes nodePop { from{transform:scale(0.6);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cursor::after { content: '|'; animation: blink .7s infinite; color: ${VIO}; margin-left: 1px; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { font-size: 16px !important; }
        input::placeholder { color: ${MUTED}; }
        a { text-decoration: none; }
        button:hover { opacity: .88 !important; }
        .glass { background: ${SURFACE}; border: 1px solid ${BORDER}; backdrop-filter: blur(12px); }
        @media (max-width: 640px) {
          .hero-row { flex-direction: column !important; }
          .hero-row input, .hero-row button, .ref-input { width: 100% !important; max-width: 100% !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          nav { padding: 14px 16px !important; }
          .hero-pad { padding: 64px 20px 48px !important; }
          .sec { padding: 60px 20px !important; }
          .mock-phone { display: none !important; }
          .feat-strip { gap: 0 !important; flex-wrap: wrap; }
          .feat-strip-item { width: 50% !important; border-right: none !important; border-bottom: 1px solid ${BORDER} !important; }
          .platform-row { gap: 20px !important; }
          .stats-bar { gap: 28px !important; padding: 28px 20px !important; }
          .footer-inner { padding: 40px 20px 32px !important; }
          .footer-inner > div:first-child { grid-template-columns: 1fr 1fr !important; }
          @media (max-width: 480px) { .footer-inner > div:first-child { grid-template-columns: 1fr !important; } }
          .trust-row { gap: 12px !important; }
          .hero-v { display: none !important; }
          .posters-row { gap: 12px !important; }
          .poster-center { transform: translateY(0) !important; }
          .poster-side { width: 150px !important; }
          .poster-center-w { width: 165px !important; }
        }
      `}</style>

      {/* NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: `1px solid ${BORDER}`, background: "rgba(9,9,15,0.85)", backdropFilter: "blur(20px)" }}>
        <nav style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo />
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, color: RED, letterSpacing: 2 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: RED, animation: "pulse 1.5s infinite" }} />
            REC
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="/exemples" style={{ fontSize: 13, color: MUTED, fontWeight: 600, display: "none" }} className="nav-link">Exemples</a>
            <a href="/tarifs" style={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>Tarifs</a>
            <a href="/app" style={{ fontSize: 14, color: TEXT, fontWeight: 700, background: SURFACE, border: `1px solid ${BORDER}`, padding: "8px 16px", borderRadius: 10 }}>Se connecter →</a>
          </div>
        </nav>
      </div>

      {/* HERO */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 40px 60px", position: "relative", overflow: "hidden" }} className="hero-pad">
        <div style={{ position: "absolute", top: 40, left: "10%", width: 600, height: 600, background: `radial-gradient(circle, rgba(168,85,247,0.09) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 120, right: "5%", width: 350, height: 350, background: `radial-gradient(circle, rgba(232,92,58,0.08) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div className="hero-v" style={{ position: "absolute", right: "-4%", top: "-8%", opacity: 0.035, pointerEvents: "none", userSelect: "none" }}>
          <svg width="520" height="620" viewBox="0 0 520 620" fill="none">
            <path d="M20 20 L260 600 L500 20" stroke={RED} strokeWidth="72" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", color: VIO, padding: "7px 18px", borderRadius: 100, fontSize: 12, fontWeight: 600, marginBottom: 40, animation: "glow 3s infinite", letterSpacing: 1 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: VIO, display: "inline-block" }} />
            Le studio IA des créateurs verticaux
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, letterSpacing: -3, marginBottom: 32, color: TEXT, lineHeight: 1 }}>
            <div style={{ fontSize: "clamp(52px, 10vw, 120px)", lineHeight: 0.95 }}>Ta série</div>
            <div style={{ fontSize: "clamp(32px, 6vw, 76px)", lineHeight: 1.1, background: `linear-gradient(135deg, ${RED} 30%, ${VIO})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>
              prête à tourner
            </div>
            <div style={{ fontSize: "clamp(52px, 10vw, 120px)", lineHeight: 0.95, color: TEXT }}>
              en 5 minutes.
            </div>
          </h1>

          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: MUTED, maxWidth: 480, margin: "0 auto 52px", lineHeight: 1.7, fontWeight: 400 }}>
            Génère des micro-dramas 9:16 complets avec l'IA — bible, scripts, hooks, cliffhangers. Prêts pour TikTok, Reels, Shorts, DramaBox et ReelShort.
          </p>

          {canceled && <p style={{ color: RED, marginBottom: 16, fontSize: 14 }}>Paiement annulé. Réessaie quand tu veux.</p>}

          <div className="hero-row" style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: emailError ? 6 : 14 }}>
            <input type="email" placeholder="ton@email.com" value={email} onChange={e => { setEmail(e.target.value); setEmailError(false); }} onKeyDown={e => e.key === "Enter" && startCheckout()}
              style={{ padding: "16px 20px", borderRadius: 14, border: `1px solid ${emailError ? RED : BORDER}`, background: SURFACE, color: TEXT, fontSize: 15, width: 240, outline: "none", backdropFilter: "blur(8px)", transition: "border-color .2s" }} />
            <GlowBtn onClick={() => startCheckout("standard", "hero")} disabled={loading} gradient>
              {loading ? "Redirection…" : "Commencer →"}
            </GlowBtn>
          </div>
          {emailError && <p style={{ textAlign: "center", color: RED, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Entre ton email pour continuer</p>}
          <p style={{ color: MUTED, fontSize: 13, marginBottom: 20 }}>9€/mois · Annulable à tout moment · Aucun engagement</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {[
              { icon: "🔒", label: "Paiement sécurisé Stripe" },
              { icon: "✓", label: "Sans carte bancaire requise" },
              { icon: "⚡", label: "Accès immédiat" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: MUTED }}>
                <span style={{ color: "#4ade80" }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

{/* HERO VISUAL */}
<div style={{ maxWidth: 900, margin: "0 auto 0", padding: "0 40px 80px" }}>
  <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", boxShadow: "0 0 80px rgba(168,85,247,0.15), 0 0 40px rgba(232,92,58,0.1), 0 32px 80px rgba(0,0,0,0.5)", border: "1px solid rgba(168,85,247,0.2)" }}>
    <img src="/hero.png" alt="VerticalClap — Génère tes scripts verticaux en 5 min" style={{ width: "100%", display: "block", borderRadius: 20 }} />
  </div>
</div>

      {/* FEATURE STRIP */}
      <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.02)" }}>
        <div className="feat-strip" style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "center" }}>
          {[
            { Icon: BoltIcon, label: "Rapide", color: RED },
            { Icon: PhoneIcon, label: "Format 9:16", color: VIO },
            { Icon: ClapperIcon, label: "Scripts impactants", color: RED },
            { Icon: ClockIcon, label: "Sauvegarde cloud", color: VIO },
          ].map(({ Icon, label, color }, i, arr) => (
            <div key={i} className="feat-strip-item" style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 32px", borderRight: i < arr.length - 1 ? `1px solid ${BORDER}` : "none", flex: 1, justifyContent: "center" }}>
              <span style={{ color, display: "flex" }}><Icon size={20} /></span>
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: TEXT, whiteSpace: "nowrap" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MARQUEE */}
      <div style={{ overflow: "hidden", borderBottom: `1px solid ${BORDER}`, padding: "16px 0", background: "rgba(255,255,255,0.01)", userSelect: "none" }}>
        <div style={{ display: "flex", gap: 0, animation: "marquee 40s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
          {[...Array(2)].map((_, rep) => (
            ["Le Mensonge", "Héritage", "Deux Vies", "La Trahison", "Le Dernier Appel", "Secrets de Famille", "Le Pacte", "Double Jeu", "La Chute", "Huis Clos", "Rupture", "Le Témoin", "Zone Rouge", "L'Imposteur", "Sous Pression"].map((t, i) => (
              <span key={`${rep}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: 20, padding: "0 20px", fontSize: 13, fontWeight: 600, color: i % 3 === 0 ? TEXT : MUTED, letterSpacing: 0.5 }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: i % 5 === 0 ? RED : i % 5 === 2 ? VIO : BORDER, display: "inline-block", flexShrink: 0 }} />
                {t}
              </span>
            ))
          ))}
        </div>
      </div>

      {/* PLATFORMS */}
      <div className="sec" style={{ padding: "56px 40px", borderBottom: `1px solid ${BORDER}`, textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: MUTED, marginBottom: 8 }}>Compatible avec toutes les plateformes</p>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 40, maxWidth: 520, margin: "8px auto 40px" }}>Réseaux sociaux ou plateformes de micro-drama — le format 9:16 est universel.</p>

        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: MUTED, opacity: 0.6, marginBottom: 20 }}>Réseaux sociaux</p>
        <div className="platform-row" style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", marginBottom: 44 }}>
          {[
            { Icon: TikTokIcon, name: "TikTok", color: "#69C9D0", sub: "For You Page" },
            { Icon: ReelsIcon, name: "Instagram Reels", color: VIO, sub: "Explore & Feed" },
            { Icon: ShortsIcon, name: "YouTube Shorts", color: RED, sub: "Shorts Feed" },
          ].map(({ Icon, name, color, sub }) => (
            <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: `${color}12`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center", color, animation: "float 4s ease-in-out infinite" }}>
                <Icon size={30} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 2 }}>{name}</p>
                <p style={{ fontSize: 12, color: MUTED }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: MUTED, opacity: 0.6, marginBottom: 16 }}>Plateformes micro-drama</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          {[
            { name: "DramaBox", color: "#f59e0b" },
            { name: "ReelShort", color: "#e879f9" },
            { name: "Crazy Maple", color: "#34d399" },
            { name: "FlexTV", color: "#60a5fa" },
            { name: "GoodShort", color: VIO },
            { name: "MoboReels", color: RED },
          ].map(({ name, color }) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 7, background: `${color}0f`, border: `1px solid ${color}25`, borderRadius: 10, padding: "8px 16px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MOCK PHONE */}
      <div className="mock-phone" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px", display: "flex", justifyContent: "center", alignItems: "center", gap: 80 }}>
        <div style={{ maxWidth: 340 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: RED, marginBottom: 16 }}>Prêt à tourner</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 900, color: TEXT, letterSpacing: -1.5, lineHeight: 1.15, marginBottom: 20 }}>
            Un script complet<br /><span style={{ fontStyle: "italic", color: MUTED }}>en 10 secondes.</span>
          </h2>
          <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.75 }}>Hook percutant, dialogues, indications de jeu, cadrage 9:16 — tout est là. Ouvre le Mode Tournage et tourne directement depuis l'écran.</p>
        </div>

        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: `radial-gradient(circle, rgba(232,92,58,0.12) 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: -20, borderRadius: 60, background: `radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 80%)`, pointerEvents: "none" }} />

          <div style={{ width: 240, background: "#0a0a14", border: `1.5px solid rgba(168,85,247,0.3)`, borderRadius: 44, padding: "28px 18px 24px", boxShadow: `0 0 60px rgba(168,85,247,0.15), 0 0 30px rgba(232,92,58,0.1), 0 48px 80px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,0.06)` }}>
            <div style={{ width: 52, height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 10, margin: "0 auto 22px" }} />

            <div style={{ background: "linear-gradient(180deg, #1a0a05 0%, #0d0505 60%, #09090f 100%)", borderRadius: 18, padding: "16px 14px", marginBottom: 14, position: "relative", overflow: "hidden", minHeight: 160 }}>
              <div style={{ position: "absolute", bottom: -20, left: "50%", transform: "translateX(-50%)", width: 160, height: 80, background: `radial-gradient(ellipse, rgba(232,92,58,0.25) 0%, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: RED, animation: "pulse 1.5s infinite" }} />
                <span style={{ fontSize: 7, fontWeight: 800, color: RED, letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace" }}>REC · EP.01</span>
              </div>
              <p style={{ fontSize: 7, fontWeight: 800, color: RED, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6, fontFamily: "monospace" }}>⚡ Hook — 3 sec</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: TEXT, lineHeight: 1.5, marginBottom: 8 }}>« Si vous regardez ça... c'est que j'ai pas réussi. »</p>
              <p style={{ fontSize: 9, color: MUTED, fontStyle: "italic", marginBottom: 10 }}>[9:16] Gros plan, yeux dans l'objectif</p>
              <div style={{ height: 1, background: BORDER, marginBottom: 10 }} />
              <p style={{ fontSize: 8, fontWeight: 800, color: VIO, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>MAYA</p>
              <p style={{ fontSize: 11, fontWeight: 500, color: TEXT, lineHeight: 1.5, marginBottom: 4 }}>Tu as réussi. Regarde ce que j'ai trouvé.</p>
              <p style={{ fontSize: 9, color: MUTED, fontStyle: "italic" }}>[9:16] Insert téléphone, notif qui clignote</p>
            </div>

            <div style={{ background: `linear-gradient(135deg, ${RED}22, ${VIO}22)`, border: `1px solid ${RED}40`, borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: RED, letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace" }}>🎬 CLIFFHANGER</span>
            </div>

            <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 4 }}>
              {[1, 0.4, 0.2, 0.15, 0.1].map((o, i) => (
                <div key={i} style={{ width: i === 0 ? 18 : 5, height: 5, borderRadius: 10, background: `rgba(255,255,255,${o})` }} />
              ))}
            </div>
          </div>

          <div style={{ position: "absolute", right: -36, top: "50%", transform: "translateY(-50%) rotate(90deg)", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 1, background: RED }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: RED, letterSpacing: 2 }}>9:16</span>
            <div style={{ width: 20, height: 1, background: RED }} />
          </div>
        </div>
      </div>

      {/* SÉRIES EXEMPLES */}
      <div className="sec" style={{ padding: "80px 40px", borderTop: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Label color={RED}>Exemples de séries</Label>
          <Title>De l'idée à la série<br /><span style={{ fontStyle: "italic", color: MUTED }}>en quelques secondes.</span></Title>
          <p style={{ textAlign: "center", color: MUTED, marginBottom: 56, fontSize: 15 }}>Chaque série est générée avec titre, bible complète et scripts prêts à tourner.</p>

          <div className="posters-row" style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", alignItems: "flex-end" }}>

            {/* Série 1 — Le Dernier Pacte */}
            <div className="poster-side" style={{ width: 210, flexShrink: 0, borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(232,92,58,0.2)" }}>
              <div style={{ background: "#0a0608", aspectRatio: "9/16", display: "flex", flexDirection: "column", padding: "20px 16px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 200, height: 200, background: "radial-gradient(circle, rgba(232,92,58,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -20, left: 0, right: 0, height: "50%", background: "linear-gradient(to top, rgba(232,92,58,0.12) 0%, transparent 100%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

                <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <span style={{ fontSize: 7, fontWeight: 800, color: RED, background: "rgba(232,92,58,0.12)", border: "1px solid rgba(232,92,58,0.25)", padding: "3px 8px", borderRadius: 4, letterSpacing: 1.5, textTransform: "uppercase" }}>Thriller</span>
                    <span style={{ fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>8 ÉP.</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ width: 32, height: 2, background: RED, marginBottom: 16 }} />
                    <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 0.88, letterSpacing: -2, marginBottom: 20 }}>Le<br />Der-<br />nier<br />Pacte</div>
                  </div>

                  <div>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.7, fontStyle: "italic", fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 14 }}>
                      « Il a tout signé.<br />Il ne savait pas. »
                    </p>
                    <div style={{ height: 1, background: "rgba(232,92,58,0.15)", marginBottom: 10 }} />
                    <div style={{ fontSize: 7, color: "rgba(255,255,255,0.15)", letterSpacing: 2, fontWeight: 700 }}>GÉNÉRÉ PAR VERTICALCLAP</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Série 2 — Héritage Maudit (centre) */}
            <div className="poster-center poster-center-w" style={{ width: 230, flexShrink: 0, borderRadius: 20, overflow: "hidden", boxShadow: "0 48px 100px rgba(168,85,247,0.35), 0 0 60px rgba(168,85,247,0.1), 0 0 0 1px rgba(168,85,247,0.25)", transform: "translateY(-24px)" }}>
              <div style={{ background: "#080610", aspectRatio: "9/16", display: "flex", flexDirection: "column", padding: "20px 16px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 240, height: 240, background: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -20, left: 0, right: 0, height: "55%", background: "linear-gradient(to top, rgba(168,85,247,0.15) 0%, transparent 100%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

                <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <span style={{ fontSize: 7, fontWeight: 800, color: VIO, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)", padding: "3px 8px", borderRadius: 4, letterSpacing: 1.5, textTransform: "uppercase" }}>Drame familial</span>
                    <span style={{ fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>10 ÉP.</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ width: 32, height: 2, background: VIO, marginBottom: 16 }} />
                    <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 56, fontWeight: 900, color: "#fff", lineHeight: 0.88, letterSpacing: -2, marginBottom: 20 }}>Héri-<br />tage<br />Mau-<br />dit</div>
                  </div>

                  <div>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.7, fontStyle: "italic", fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 14 }}>
                      « Un testament.<br />Trois frères.<br />Un seul survivra. »
                    </p>
                    <div style={{ height: 1, background: "rgba(168,85,247,0.2)", marginBottom: 10 }} />
                    <div style={{ fontSize: 7, color: "rgba(255,255,255,0.15)", letterSpacing: 2, fontWeight: 700 }}>GÉNÉRÉ PAR VERTICALCLAP</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Série 3 — Double Jeu */}
            <div className="poster-side" style={{ width: 210, flexShrink: 0, borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(96,165,250,0.2)" }}>
              <div style={{ background: "#060810", aspectRatio: "9/16", display: "flex", flexDirection: "column", padding: "20px 16px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 200, height: 200, background: "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -20, left: 0, right: 0, height: "50%", background: "linear-gradient(to top, rgba(96,165,250,0.1) 0%, transparent 100%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

                <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <span style={{ fontSize: 7, fontWeight: 800, color: "#60a5fa", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)", padding: "3px 8px", borderRadius: 4, letterSpacing: 1.5, textTransform: "uppercase" }}>Suspense</span>
                    <span style={{ fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>6 ÉP.</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ width: 32, height: 2, background: "#60a5fa", marginBottom: 16 }} />
                    <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 0.88, letterSpacing: -2, marginBottom: 20 }}>Dou-<br />ble<br />Jeu</div>
                  </div>

                  <div>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.7, fontStyle: "italic", fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 14 }}>
                      « Elle ment.<br />Mais pour<br />qui ? »
                    </p>
                    <div style={{ height: 1, background: "rgba(96,165,250,0.15)", marginBottom: 10 }} />
                    <div style={{ fontSize: 7, color: "rgba(255,255,255,0.15)", letterSpacing: 2, fontWeight: 700 }}>GÉNÉRÉ PAR VERTICALCLAP</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.18)", marginTop: 36, letterSpacing: 1 }}>
            Présentation générée automatiquement · Bible + scripts inclus · Format 9:16
          </p>
        </div>
      </div>

      {/* POUR QUI */}
      <div className="sec" style={{ padding: "80px 40px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Label color={RED}>Pour qui</Label>
          <Title>Fait pour les créateurs<br /><span style={{ fontStyle: "italic", color: MUTED }}>qui tournent vraiment.</span></Title>
          <p style={{ textAlign: "center", color: MUTED, marginBottom: 56, fontSize: 15 }}>Peu importe ton niveau ou ton équipe</p>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              {
                icon: <TikTokIcon size={28} />,
                iconColor: "#69C9D0",
                title: "Créateur solo",
                sub: "TikTok · Reels · Shorts",
                desc: "Tu filmes seul avec ton téléphone. VerticalClap gènère la bible, les scripts et les hooks — structure narrative complète, prête à tourner sans réécriture.",
                color: RED,
              },
              {
                icon: <ClapperIcon size={28} />,
                iconColor: VIO,
                title: "Équipe de production",
                sub: "2 à 5 personnes",
                desc: "Votre équipe produit plusieurs séries par semaine. Le Mixeur garde la cohérence de ton univers, le cloud synchronise tout. Jusqu'à 90 épisodes et 4 variations par script.",
                color: VIO,
              },
              {
                icon: <PhoneIcon size={28} />,
                iconColor: RED,
                title: "Acteur · Réalisateur",
                sub: "Pro du plateau",
                desc: "Tu veux des scripts au niveau. Premium Suspense génère des dialogues avec sous-texte, jeu d'acteur précis et cadrage 9:16. Le Mode Tournage remplace le prompteur sur le plateau.",
                color: RED,
              },
            ].map(({ icon, iconColor, title, sub, desc, color }, i) => (
              <div key={i} className="glass" style={{ borderRadius: 20, padding: "32px 28px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${i === 1 ? VIO : RED}, transparent)` }} />
                <div style={{ width: 52, height: 52, borderRadius: 16, background: `${iconColor}14`, border: `1px solid ${iconColor}25`, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor, marginBottom: 20 }}>
                  {icon}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 900, marginBottom: 4, letterSpacing: -0.5 }}>{title}</h3>
                <p style={{ fontSize: 11, color, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>{sub}</p>
                <p style={{ color: MUTED, lineHeight: 1.7, fontSize: 14 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COMMENT ÇA MARCHE */}
      <div className="sec" style={{ padding: "80px 40px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Label color={VIO}>Comment ça marche</Label>
          <Title>De zéro à une série<br /><span style={{ fontStyle: "italic" }}>en 3 étapes.</span></Title>
          <p style={{ textAlign: "center", color: MUTED, marginBottom: 56, fontSize: 15 }}>Du concept au script prêt à tourner</p>
          <div style={{ position: "relative" }}>
            <div className="timeline-line" style={{ position: "absolute", top: 28, left: "calc(16.66% - 1px)", right: "calc(16.66% - 1px)", height: 2, background: BORDER, zIndex: 0 }}>
              <div style={{ height: "100%", background: `linear-gradient(90deg, ${RED}, ${VIO})`, animation: "lineGrow 1.8s ease forwards 0.3s", width: 0 }} />
            </div>
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, position: "relative", zIndex: 1 }}>
              {[
                { step: "01", Icon: BoltIcon, iconColor: RED, title: "Configure le Mixeur", desc: "Choisis ton casting, ton univers et ton secret central — ou utilise un pack thématique en 1 clic. 12 univers, 16 secrets disponibles.", delay: "0s" },
                { step: "02", Icon: ClapperIcon, iconColor: VIO, title: "La bible se génère en live", desc: "Titre viral, logline, personnages et séquencier complet apparaissent en temps réel. Les épisodes arrivent en parallèle automatiquement.", delay: "0.5s" },
                { step: "03", Icon: PhoneIcon, iconColor: RED, title: "Tourne avec le script", desc: "Ouvre un épisode, génère le script en 10s. Mode Tournage avec téléprompteur, fond clair/sombre, vitesse réglable. Prêt à filmer.", delay: "1s" },
              ].map(({ step, Icon, iconColor, title, desc, delay }) => (
                <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${iconColor}20, ${iconColor}08)`, border: `2px solid ${iconColor}`, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor, marginBottom: 24, animation: `nodePop 0.5s ease forwards ${delay}`, opacity: 0, boxShadow: `0 0 20px ${iconColor}30`, zIndex: 2 }}>
                    <Icon size={22} />
                  </div>
                  <div className="glass" style={{ borderRadius: 20, padding: "24px 24px", width: "100%", textAlign: "center", position: "relative", overflow: "hidden" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: MUTED, letterSpacing: 3, fontFamily: "monospace", display: "block", marginBottom: 10 }}>{step}</span>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 19, fontWeight: 700, marginBottom: 10, letterSpacing: -0.3 }}>{title}</h3>
                    <p style={{ color: MUTED, lineHeight: 1.65, fontSize: 13 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="sec" style={{ padding: "80px 40px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Label color={RED}>Fonctionnalités</Label>
          <Title>Le pipeline créatif<br /><span style={{ fontStyle: "italic" }}>du concept au tournage.</span></Title>
          <p style={{ textAlign: "center", color: MUTED, marginBottom: 48, fontSize: 15 }}>Tout ce qu'il faut, rien de superflu</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              { icon: <BoltIcon size={20} />, iconColor: RED, title: "Le Mixeur", desc: "12 univers, 16 secrets, 4 castings. Ou entre le tien. 12 packs thématiques pour démarrer en 1 clic." },
              { icon: <ClapperIcon size={20} />, iconColor: VIO, title: "Bible complète", desc: "Titre, logline, personnages avec secrets, tension centrale et séquencier. Tout ce qu'il faut pour commencer à tourner." },
              { icon: <PhoneIcon size={20} />, iconColor: RED, title: "Scripts prêts à tourner", desc: "Hook 3 secondes, dialogues, jeu d'acteur, cadrage 9:16. Fast Drama ou Premium Suspense selon ton style." },
              { icon: <ClockIcon size={20} />, iconColor: VIO, title: "3 variations par script", desc: "Intense, Subtil ou Rapide — 3 versions générées en parallèle pour choisir le ton parfait. Premium uniquement." },
              { icon: <TikTokIcon size={20} />, iconColor: "#69C9D0", title: "Traduction en 8 langues", desc: "Traduis n'importe quel script en Anglais, Espagnol, Allemand, Portugais, Italien, Arabe, Hébreu ou Chinois." },
              { icon: <ReelsIcon size={20} />, iconColor: VIO, title: "Fiche technique Prod", desc: "Décors, costumes, lieux de tournage générés par l'IA pour chaque série. Tourne pro avec un smartphone." },
              { icon: <ShortsIcon size={20} />, iconColor: RED, title: "Mode Tournage", desc: "Téléprompteur auto-scroll, fond clair ou sombre, vitesse réglable, barre de progression. Rien à imprimer." },
              { icon: <BoltIcon size={20} />, iconColor: RED, title: "Titres viraux", desc: "5 titres alternatifs avec score de viralité, accroche et analyse psychologique. Premium uniquement." },
              { icon: <ClockIcon size={20} />, iconColor: VIO, title: "Sauvegarde cloud", desc: "Tes séries synchronisées sur tous tes appareils automatiquement. Accès depuis n'importe où." },
            ].map((f, i) => (
              <div key={i} className="glass" style={{ borderRadius: 16, padding: 22, borderLeft: `3px solid ${i % 2 === 0 ? RED : VIO}` }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${f.iconColor}14`, border: `1px solid ${f.iconColor}22`, display: "flex", alignItems: "center", justifyContent: "center", color: f.iconColor, marginBottom: 14 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: MUTED, lineHeight: 1.65, fontSize: 13 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div className="sec" style={{ padding: "80px 40px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Label color={VIO}>Tarifs</Label>
          <Title>Choisissez votre plan.</Title>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
            <div style={{ display: "inline-flex", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 4, gap: 4 }}>
              {[
                { k: "monthly", l: "Mensuel" },
                { k: "annual",  l: "Annuel", badge: "-17%" },
              ].map(({ k, l, badge }) => (
                <button key={k} onClick={() => setBilling(k)} style={{
                  padding: "9px 20px", borderRadius: 10, border: "none", fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .2s",
                  background: billing === k ? TEXT : "transparent",
                  color: billing === k ? DARK : MUTED,
                  display: "flex", alignItems: "center", gap: 7,
                }}>
                  {l}
                  {badge && <span style={{ fontSize: 10, fontWeight: 800, background: billing === k ? `linear-gradient(135deg,${RED},${VIO})` : BORDER, WebkitBackgroundClip: "text", WebkitTextFillColor: billing === k ? "transparent" : MUTED, backgroundClip: "text", letterSpacing: 0.5 }}>{badge}</span>}
                </button>
              ))}
            </div>
          </div>
          {billing === "annual" && (
            <p style={{ textAlign: "center", fontSize: 13, color: "#4ade80", fontWeight: 600, marginBottom: 24, marginTop: -20 }}>
              🎉 2 mois offerts par rapport au mensuel
            </p>
          )}

          <input type="email" placeholder="ton@email.com" value={email} onChange={e => { setEmail(e.target.value); setEmailError(false); }}
            style={{ width: "100%", maxWidth: 400, display: "block", margin: `0 auto ${emailError ? "6px" : "32px"}`, padding: "14px 18px", borderRadius: 12, border: `1px solid ${emailError ? RED : BORDER}`, background: SURFACE, color: TEXT, fontSize: 15, outline: "none", transition: "border-color .2s" }} />
          {emailError && <p style={{ textAlign: "center", color: RED, fontSize: 13, fontWeight: 600, marginBottom: 26 }}>Entre ton email pour continuer</p>}

          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {/* Standard */}
            <div className="glass" style={{ borderRadius: 24, padding: "36px 32px", position: "relative" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: MUTED, textTransform: "uppercase", marginBottom: 12 }}>Standard</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 4 }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 58, fontWeight: 900, color: TEXT, lineHeight: 1, letterSpacing: -2 }}>
                  {billing === "annual" ? "7.5€" : "9€"}
                </div>
                {billing === "annual" && <span style={{ fontSize: 14, color: MUTED, marginBottom: 10, textDecoration: "line-through" }}>9€</span>}
              </div>
              <p style={{ color: MUTED, fontSize: 13, marginBottom: billing === "annual" ? 6 : 28 }}>/mois</p>
              {billing === "annual" && <p style={{ fontSize: 12, color: "#4ade80", fontWeight: 600, marginBottom: 22 }}>facturé 90€/an</p>}
              <div style={{ marginBottom: 28 }}>
                {["⚡ Fast Drama uniquement", "10 épisodes par série", "Scripts 1 à 2 min", "Mode Tournage + Téléprompteur", "🌍 Traduction en 8 langues", "☁️ Sauvegarde cloud", "📄 Export PDF"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Check />
                    <span style={{ color: MUTED, fontSize: 14 }}>{item}</span>
                  </div>
                ))}
              </div>
              <GlowBtn onClick={() => startCheckout("standard", "pricing")} disabled={loading} style={{ width: "100%", fontSize: 15, padding: 16 }}>
                {loading ? "Redirection…" : "Commencer →"}
              </GlowBtn>
            </div>

            {/* Premium */}
            <div style={{ borderRadius: 24, padding: "36px 32px", position: "relative", background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.25)", boxShadow: "0 0 48px rgba(168,85,247,0.08)" }}>
              <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${RED}, ${VIO})`, color: "#fff", fontSize: 10, fontWeight: 800, padding: "4px 16px", borderRadius: 20, letterSpacing: 1.5, whiteSpace: "nowrap" }}>⭐ RECOMMANDÉ</div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: VIO, textTransform: "uppercase", marginBottom: 12 }}>Premium</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 4 }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 58, fontWeight: 900, color: TEXT, lineHeight: 1, letterSpacing: -2 }}>
                  {billing === "annual" ? "14.9€" : "19€"}
                </div>
                {billing === "annual" && <span style={{ fontSize: 14, color: MUTED, marginBottom: 10, textDecoration: "line-through" }}>19€</span>}
              </div>
              <p style={{ color: MUTED, fontSize: 13, marginBottom: billing === "annual" ? 6 : 28 }}>/mois</p>
              {billing === "annual" && <p style={{ fontSize: 12, color: "#4ade80", fontWeight: 600, marginBottom: 22 }}>facturé 179€/an</p>}
              <div style={{ marginBottom: 28 }}>
                {["⚡ Fast Drama + 🎭 Premium Suspense", "Jusqu'à 90 épisodes par série", "Scripts 1 à 2 min", "Mode Tournage + Téléprompteur", "🎲 3 variations par script", "🔥 Générateur de titres viraux", "🌍 Traduction en 8 langues", "🎬 Fiche technique de production", "☁️ Sauvegarde cloud", "📄 Export PDF"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Check color={VIO} />
                    <span style={{ color: MUTED, fontSize: 14 }}>{item}</span>
                  </div>
                ))}
              </div>
              <GlowBtn onClick={() => startCheckout("premium", "pricing")} disabled={loading} gradient style={{ width: "100%", fontSize: 15, padding: 16 }}>
                {loading ? "Redirection…" : "Commencer Premium →"}
              </GlowBtn>
            </div>
          </div>

          <div className="trust-row" style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap", marginTop: 28 }}>
            {[
              { icon: "🔒", label: "Stripe · Paiement sécurisé" },
              { icon: "✓", label: "Annulable en 1 clic" },
              { icon: "⚡", label: "Accès immédiat après paiement" },
              { icon: "🛡️", label: "Données chiffrées" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: MUTED }}>
                <span style={{ color: "#4ade80", fontSize: 14 }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 12, color: MUTED, marginTop: 16 }}>
            Teste gratuitement dans les <a href="/exemples" style={{ color: VIO, fontWeight: 600 }}>Exemples</a> avant de t'abonner.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="sec" style={{ padding: "80px 40px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Label color={RED}>FAQ</Label>
          <Title>Questions fréquentes.</Title>
          <div style={{ marginTop: 48 }}>
            {FAQ_ITEMS.map((item, i) => (
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
      </div>

      {/* NEWSLETTER */}
      <NewsletterSection />

      {/* RESSOURCES / BLOG */}
      <div className="sec" style={{ padding: "80px 40px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Label color={VIO}>Ressources</Label>
          <Title>Guides pour créateurs<br /><span style={{ fontStyle: "italic", color: MUTED }}>qui veulent progresser.</span></Title>
          <p style={{ textAlign: "center", color: MUTED, marginBottom: 56, fontSize: 15 }}>Écriture, hooks, plateformes, monétisation — tout ce qu'il faut savoir.</p>

          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
            {POSTS.slice(0, 3).map((post) => (
              <a key={post.slug} href={`/blog/${post.slug}`} style={{ display: "flex", flexDirection: "column", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "28px 24px", textDecoration: "none", color: "inherit", transition: "border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${post.categoryColor}40`}
                onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: post.categoryColor, background: `${post.categoryColor}12`, border: `1px solid ${post.categoryColor}25`, padding: "3px 10px", borderRadius: 6 }}>{post.category}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900, color: TEXT, letterSpacing: -0.3, lineHeight: 1.3, marginBottom: 12, flex: 1 }}>{post.title}</h3>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 20 }}>{post.description.slice(0, 100)}…</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: MUTED }}>{post.readTime} de lecture</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: post.categoryColor }}>Lire →</span>
                </div>
              </a>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <a href="/blog" style={{ display: "inline-block", border: `1px solid ${BORDER}`, color: TEXT, padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none", background: SURFACE }}>
              Voir tous les guides →
            </a>
          </div>
        </div>
      </div>

      {/* CTA FINAL */}
      <div className="sec" style={{ padding: "100px 40px", textAlign: "center", borderTop: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, rgba(168,85,247,0.07) 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, marginBottom: 20, letterSpacing: -2, lineHeight: 1.0 }}>
            Ta première série,<br />
            dans{" "}
            <span style={{ background: `linear-gradient(135deg, ${RED}, ${VIO})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>
              5 minutes
            </span>
            .
          </h2>
          <p style={{ color: MUTED, fontSize: 16, marginBottom: 48, lineHeight: 1.6 }}>Rejoins les créateurs qui produisent plus vite avec l'IA.</p>
          <div className="hero-row" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <input type="email" placeholder="ton@email.com" value={email} onChange={e => setEmail(e.target.value)}
              style={{ padding: "16px 20px", borderRadius: 14, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, fontSize: 15, width: 240, outline: "none" }} />
            <GlowBtn onClick={() => startCheckout("standard", "cta_final")} disabled={loading} gradient>
              {loading ? "Redirection…" : "Commencer →"}
            </GlowBtn>
          </div>
          <div className="trust-row" style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {[
              { icon: "🔒", label: "Paiement sécurisé Stripe" },
              { icon: "✓", label: "Sans engagement" },
              { icon: "⚡", label: "Accès immédiat" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: MUTED }}>
                <span style={{ color: "#4ade80" }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.01)" }}>
        <div className="footer-inner" style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 40px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>

            <div>
              <Logo size="sm" />
              <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.75, marginTop: 16, maxWidth: 240 }}>
                Le studio IA pour créateurs de micro-dramas verticaux. De l'idée à la série complète en 5 minutes.
              </p>
            </div>

            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>Produit</p>
              {[
                { href: "/tarifs", label: "Tarifs" },
                { href: "/exemples", label: "Exemples" },
              ].map(({ href, label }) => (
                <a key={href} href={href} style={{ display: "block", fontSize: 13, color: MUTED, marginBottom: 10, fontWeight: 500 }}>{label}</a>
              ))}
            </div>

            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>Ressources</p>
              {[
                { href: "/blog", label: "Blog" },
                { href: "/blog/qu-est-ce-qu-un-micro-drama", label: "Guide micro-drama" },
                { href: "/blog/comment-ecrire-un-hook-tiktok", label: "Écrire un hook" },
                { href: "/blog/monetiser-micro-drama-dramabox-reelshort", label: "Monétiser sa série" },
              ].map(({ href, label }) => (
                <a key={href} href={href} style={{ display: "block", fontSize: 13, color: MUTED, marginBottom: 10, fontWeight: 500 }}>{label}</a>
              ))}
            </div>

            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>Légal</p>
              {[
                { href: "/cgu", label: "CGU" },
                { href: "/confidentialite", label: "Confidentialité" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <a key={href} href={href} style={{ display: "block", fontSize: 13, color: MUTED, marginBottom: 10, fontWeight: 500 }}>{label}</a>
              ))}
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: MUTED, fontSize: 12 }}>© 2026 VerticalClap — Tous droits réservés</p>
            <div style={{ display: "flex", gap: 6 }}>
              {["TikTok", "Reels", "Shorts", "DramaBox", "ReelShort"].map(p => (
                <span key={p} style={{ fontSize: 10, color: MUTED, background: SURFACE, border: `1px solid ${BORDER}`, padding: "3px 8px", borderRadius: 6, fontWeight: 500 }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}

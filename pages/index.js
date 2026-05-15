import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

const RED = "#E85C3A";
const VIO = "#a855f7";
const DARK = "#09090f";
const SURFACE = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#f1f5f9";
const MUTED = "#64748b";

const TESTIMONIALS = [
  { text: "J'ai généré ma première série de 10 épisodes en moins de 5 minutes. Les scripts sont directement tournables, rien à réécrire.", name: "Marie L.", role: "Créatrice de contenu · 85k abonnés" },
  { text: "Le Mode Tournage avec téléprompteur change tout sur le plateau. Mon équipe de 2 produit maintenant 3 séries par semaine.", name: "Tom K.", role: "Producteur indépendant" },
  { text: "Les 3 variations par script permettent de choisir le ton parfait. Le Premium Suspense donne des dialogues vraiment au niveau.", name: "Yasmine B.", role: "Actrice · Réalisatrice" },
];

const FAQ_ITEMS = [
  { q: "C'est quoi un micro-drama vertical ?", r: "Un format vidéo court (1 à 2 min), filmé en 9:16 pour mobile, avec une structure dramatique forte : hook percutant, tension montante et cliffhanger final. Le format qui explose sur TikTok, Instagram Reels et YouTube Shorts." },
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

const Label = ({ children, color = VIO }) => (
  <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color, marginBottom: 16, fontFamily: "'Space Grotesk', sans-serif" }}>{children}</p>
);

const Title = ({ children, style = {} }) => (
  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 900, textAlign: "center", marginBottom: 12, letterSpacing: -1.5, lineHeight: 1.1, color: TEXT, ...style }}>{children}</h2>
);

export default function Landing() {
  const [email, setEmail] = useState("");
  const [refCode, setRefCode] = useState("");
  const [refValid, setRefValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [demoPhase, setDemoPhase] = useState(0);
  const [demoText, setDemoText] = useState("");
  const demoRef = useRef(null);
  const router = useRouter();
  const canceled = router.query.canceled;

  const DEMO_SEQUENCES = [
    { label: "TITRE", full: "Le Mensonge", color: TEXT },
    { label: "LOGLINE", full: "Une infirmière cache une erreur médicale jusqu'au jour où la victime revient comme interne.", color: MUTED },
    { label: "ACCROCHE", full: "Elle l'a presque tué. Il ne sait pas encore.", color: RED },
    { label: "ÉP. 1", full: "Première garde · Tension ●●●○○○○○○○", color: VIO },
    { label: "ÉP. 2", full: "Il sait · Tension ●●●●●●○○○○", color: VIO },
    { label: "ÉP. 3", full: "Le chef de service · Tension ●●●●●●●●○○", color: VIO },
    { label: "ÉP. 4", full: "Trop tard · Tension ●●●●●●●●●●", color: RED },
  ];

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { obs.disconnect(); runDemo(0, 0); }
    }, { threshold: 0.3 });
    if (demoRef.current) obs.observe(demoRef.current);
    return () => obs.disconnect();
  }, []);

  function runDemo(phaseIdx, charIdx) {
    if (phaseIdx >= DEMO_SEQUENCES.length) {
      setTimeout(() => { setDemoPhase(0); setDemoText(""); runDemo(0, 0); }, 3000);
      return;
    }
    const seq = DEMO_SEQUENCES[phaseIdx];
    if (charIdx <= seq.full.length) {
      setDemoPhase(phaseIdx);
      setDemoText(seq.full.slice(0, charIdx));
      const delay = charIdx === 0 ? 600 : 28;
      setTimeout(() => runDemo(phaseIdx, charIdx + 1), delay);
    } else {
      setTimeout(() => runDemo(phaseIdx + 1, 0), 300);
    }
  }

  const checkRefCode = async (code) => {
    setRefCode(code);
    if (code.length < 4) { setRefValid(null); return; }
    try {
      const res = await fetch("/api/referral", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      setRefValid(res.ok);
    } catch { setRefValid(false); }
  };

  const startCheckout = async (plan = "standard") => {
    if (!email) { alert("Entre ton email pour continuer"); return; }
    setLoading(true);
    const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, plan, refCode: refValid ? refCode : undefined }) });
    const { url, error } = await res.json();
    if (error) { alert(error); setLoading(false); return; }
    window.location.href = url;
  };

  return (
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
        @media (max-width:640px) { .avant-apres { grid-template-columns:1fr !important; } .roi-grid { grid-template-columns:1fr !important; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { font-size: 16px !important; }
        input::placeholder { color: ${MUTED}; }
        a { text-decoration: none; }
        button:hover { opacity: .88 !important; }
        .glass { background: ${SURFACE}; border: 1px solid ${BORDER}; backdrop-filter: blur(12px); }
        @media (max-width: 640px) {
          .hero-row { flex-direction: column !important; }
          .hero-row input, .hero-row button { width: 100% !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          nav { padding: 14px 16px !important; }
          .hero-pad { padding: 64px 20px 48px !important; }
          .sec { padding: 60px 20px !important; }
          .mock-phone { display: none !important; }
          .feat-strip { gap: 0 !important; flex-wrap: wrap; }
          .feat-strip-item { width: 50% !important; border-right: none !important; border-bottom: 1px solid ${BORDER} !important; }
          .platform-row { gap: 20px !important; }
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
          <a href="/app" style={{ fontSize: 14, color: TEXT, fontWeight: 700, background: SURFACE, border: `1px solid ${BORDER}`, padding: "8px 16px", borderRadius: 10 }}>Se connecter →</a>
        </nav>
      </div>

      {/* HERO */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 40px 60px", position: "relative", overflow: "hidden" }} className="hero-pad">

        {/* Decorative background elements */}
        <div style={{ position: "absolute", top: 40, left: "10%", width: 600, height: 600, background: `radial-gradient(circle, rgba(168,85,247,0.09) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 120, right: "5%", width: 350, height: 350, background: `radial-gradient(circle, rgba(232,92,58,0.08) 0%, transparent 70%)`, pointerEvents: "none" }} />
        {/* Giant decorative V */}
        <div style={{ position: "absolute", right: "-4%", top: "-8%", opacity: 0.035, pointerEvents: "none", userSelect: "none" }}>
          <svg width="520" height="620" viewBox="0 0 520 620" fill="none">
            <path d="M20 20 L260 600 L500 20" stroke={RED} strokeWidth="72" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", color: VIO, padding: "7px 18px", borderRadius: 100, fontSize: 12, fontWeight: 600, marginBottom: 40, animation: "glow 3s infinite", letterSpacing: 1 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: VIO, display: "inline-block" }} />
            Le studio IA des créateurs verticaux
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 900, lineHeight: 0.95, letterSpacing: -3, marginBottom: 32, color: TEXT }}>
            De l'idée<br />
            au{" "}
            <span style={{ background: `linear-gradient(135deg, ${RED} 30%, ${VIO})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>
              cliffhanger
            </span>
            .<br />
            En 5 minutes.
          </h1>

          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: MUTED, maxWidth: 480, margin: "0 auto 52px", lineHeight: 1.7, fontWeight: 400 }}>
            Génère des micro-dramas 9:16 complets avec l'IA — bible, scripts, hooks, cliffhangers. Prêts à tourner sur TikTok, Reels et Shorts.
          </p>

          {canceled && <p style={{ color: RED, marginBottom: 16, fontSize: 14 }}>Paiement annulé. Réessaie quand tu veux.</p>}

          <div className="hero-row" style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
            <input type="email" placeholder="ton@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && startCheckout()}
              style={{ padding: "16px 20px", borderRadius: 14, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, fontSize: 15, width: 240, outline: "none", backdropFilter: "blur(8px)" }} />
            <GlowBtn onClick={() => startCheckout()} disabled={loading} gradient>
              {loading ? "Redirection…" : "Commencer →"}
            </GlowBtn>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <div style={{ position: "relative" }}>
              <input type="text" placeholder="Code parrainage (optionnel)" value={refCode} onChange={e => checkRefCode(e.target.value.toUpperCase())} maxLength={12}
                style={{ padding: "10px 36px 10px 14px", borderRadius: 10, border: `1.5px solid ${refValid === true ? "#4ade80" : refValid === false ? RED : BORDER}`, background: SURFACE, color: TEXT, fontSize: 13, width: 220, outline: "none", fontFamily: "monospace", letterSpacing: 2 }} />
              {refValid === true && <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#4ade80" }}>✓</span>}
              {refValid === false && <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: RED }}>✗</span>}
            </div>
          </div>
          {refValid === true && <p style={{ color: "#4ade80", fontSize: 13, marginBottom: 8, fontWeight: 600 }}>Code valide — 30 jours offerts !</p>}
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

      {/* FEATURE STRIP — inspired by the banner */}
      <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.02)" }}>
        <div className="feat-strip" style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "center" }}>
          {[
            { Icon: BoltIcon, label: "Rapide", color: RED },
            { Icon: PhoneIcon, label: "Format 9:16", color: VIO },
            { Icon: ClapperIcon, label: "Scripts impactants", color: RED },
            { Icon: ClockIcon, label: "5 min chrono", color: VIO },
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
      <div style={{ padding: "56px 40px", borderBottom: `1px solid ${BORDER}`, textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: MUTED, marginBottom: 36 }}>Conçu pour les 3 grandes plateformes</p>
        <div className="platform-row" style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
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
      </div>

      {/* STATS BAR */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "28px 40px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "center", gap: 56, flexWrap: "wrap" }}>
          {[["2 000+", "séries générées"], ["50+", "créateurs actifs"], ["< 5 min", "par série complète"], ["8 langues", "de traduction"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 900, color: TEXT, lineHeight: 1, letterSpacing: -1 }}>{val}</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 6, fontWeight: 500, letterSpacing: 1 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MOCK PHONE — cinematic */}
      <div className="mock-phone" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px", display: "flex", justifyContent: "center", alignItems: "center", gap: 80 }}>
        {/* Left text */}
        <div style={{ maxWidth: 340 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: RED, marginBottom: 16 }}>Prêt à tourner</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 900, color: TEXT, letterSpacing: -1.5, lineHeight: 1.15, marginBottom: 20 }}>
            Un script complet<br /><span style={{ fontStyle: "italic", color: MUTED }}>en 10 secondes.</span>
          </h2>
          <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.75 }}>Hook percutant, dialogues, indications de jeu, cadrage 9:16 — tout est là. Ouvre le Mode Tournage et tourne directement depuis l'écran.</p>
        </div>

        {/* Phone mockup */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          {/* Glow rings */}
          <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: `radial-gradient(circle, rgba(232,92,58,0.12) 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: -20, borderRadius: 60, background: `radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 80%)`, pointerEvents: "none" }} />

          <div style={{ width: 240, background: "#0a0a14", border: `1.5px solid rgba(168,85,247,0.3)`, borderRadius: 44, padding: "28px 18px 24px", boxShadow: `0 0 60px rgba(168,85,247,0.15), 0 0 30px rgba(232,92,58,0.1), 0 48px 80px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,0.06)` }}>
            {/* Notch */}
            <div style={{ width: 52, height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 10, margin: "0 auto 22px" }} />

            {/* Cinematic screen content */}
            <div style={{ background: "linear-gradient(180deg, #1a0a05 0%, #0d0505 60%, #09090f 100%)", borderRadius: 18, padding: "16px 14px", marginBottom: 14, position: "relative", overflow: "hidden", minHeight: 160 }}>
              {/* Orange glow from bottom */}
              <div style={{ position: "absolute", bottom: -20, left: "50%", transform: "translateX(-50%)", width: 160, height: 80, background: `radial-gradient(ellipse, rgba(232,92,58,0.25) 0%, transparent 70%)`, pointerEvents: "none" }} />
              {/* Scene label */}
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

            {/* Cliffhanger chip */}
            <div style={{ background: `linear-gradient(135deg, ${RED}22, ${VIO}22)`, border: `1px solid ${RED}40`, borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: RED, letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace" }}>🎬 CLIFFHANGER</span>
            </div>

            {/* Bottom bar */}
            <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 4 }}>
              {[1, 0.4, 0.2, 0.15, 0.1].map((o, i) => (
                <div key={i} style={{ width: i === 0 ? 18 : 5, height: 5, borderRadius: 10, background: `rgba(255,255,255,${o})` }} />
              ))}
            </div>
          </div>

          {/* 9:16 label */}
          <div style={{ position: "absolute", right: -36, top: "50%", transform: "translateY(-50%) rotate(90deg)", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 1, background: RED }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: RED, letterSpacing: 2 }}>9:16</span>
            <div style={{ width: 20, height: 1, background: RED }} />
          </div>
        </div>
      </div>

      {/* AVANT / APRÈS */}
      <div className="sec" style={{ padding: "80px 40px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Label color={VIO}>La transformation</Label>
          <Title>Avant. <span style={{ fontStyle: "italic", color: MUTED }}>Après.</span></Title>
          <p style={{ textAlign: "center", color: MUTED, marginBottom: 56, fontSize: 15 }}>Ce que tu écrivais. Ce que l'IA génère.</p>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* AVANT */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: 20, padding: "28px 28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.06)" }} />
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: MUTED, marginBottom: 20 }}>✗ Sans Studio Vertical</p>
              <div style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 2, color: MUTED }}>
                {[
                  { t: "idée : infirmière qui cache un secret", strike: false },
                  { t: "le gars revient ? ou la fille ?", strike: true },
                  { t: "→ faut un truc fort au début", strike: false },
                  { t: "genre elle cache qqchose", strike: true },
                  { t: "épisode 1... faire quoi ?", strike: false },
                  { t: "hook = lui montrer le dossier ??", strike: false },
                  { t: "ou il arrive et elle flippe", strike: true },
                  { t: "fin episode = cliffhanger... lequel", strike: false },
                ].map((l, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, opacity: l.strike ? 0.35 : 0.6 }}>
                    {l.strike && <span style={{ position: "absolute", left: 28, width: "calc(100% - 56px)", height: 1, background: MUTED, opacity: 0.4 }} />}
                    <span style={{ textDecoration: l.strike ? "line-through" : "none" }}>{l.t}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8 }}>
                <ClockIcon size={14} />
                <span style={{ fontSize: 12, color: MUTED }}>3 à 8 heures de travail</span>
              </div>
            </div>

            {/* APRÈS */}
            <div style={{ background: "rgba(168,85,247,0.04)", border: `1px solid rgba(168,85,247,0.2)`, borderRadius: 20, padding: "28px 28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${RED}, ${VIO})` }} />
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: VIO, marginBottom: 20 }}>✓ Avec Studio Vertical</p>
              <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 10 }}>
                <div style={{ background: "rgba(232,92,58,0.08)", border: `1px solid rgba(232,92,58,0.18)`, borderRadius: 10, padding: "10px 14px" }}>
                  <p style={{ fontSize: 9, fontWeight: 800, color: RED, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>⚡ Hook — 3 sec</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, lineHeight: 1.5 }}>Clara tient le dossier. Le nom sur la couverture : JULIEN MOREAU.</p>
                  <p style={{ fontSize: 10, color: MUTED, fontStyle: "italic", marginTop: 4 }}>[9:16] Gros plan mains crispées, bague qui claque</p>
                </div>
                <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 14px" }}>
                  <p style={{ fontSize: 9, fontWeight: 800, color: VIO, letterSpacing: 2, marginBottom: 6 }}>JULIEN</p>
                  <p style={{ fontSize: 13, color: TEXT, lineHeight: 1.5 }}>Infirmière Bertin. On se connaît ?</p>
                  <p style={{ fontSize: 10, color: MUTED, fontStyle: "italic", marginTop: 4 }}>sourire innocent, regard qui cherche</p>
                </div>
                <div style={{ background: "rgba(232,92,58,0.06)", border: `1px solid rgba(232,92,58,0.15)`, borderRadius: 10, padding: "10px 14px" }}>
                  <p style={{ fontSize: 9, fontWeight: 800, color: RED, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>🎬 Cliffhanger</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, lineHeight: 1.5 }}>Julien tient un dossier de 2021. Il sait.</p>
                </div>
              </div>
              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <BoltIcon size={14} />
                <span style={{ fontSize: 12, color: VIO, fontWeight: 700 }}>Généré en 10 secondes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE DEMO */}
      <div className="sec" style={{ padding: "80px 40px", borderTop: `1px solid ${BORDER}` }} ref={demoRef}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Label color={VIO}>En direct</Label>
          <Title>Regarde l'IA écrire<br /><span style={{ fontStyle: "italic" }}>ta série en temps réel.</span></Title>
          <p style={{ textAlign: "center", color: MUTED, marginBottom: 48, fontSize: 15 }}>C'est exactement ce que tu vois dans l'app</p>

          <div style={{ background: "#0a0a14", border: `1px solid rgba(168,85,247,0.25)`, borderRadius: 24, overflow: "hidden", boxShadow: `0 0 60px rgba(168,85,247,0.08)` }}>
            {/* Terminal header */}
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#E85C3A", "#f59e0b", "#22c55e"].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
              </div>
              <span style={{ fontSize: 12, color: MUTED, fontFamily: "monospace", marginLeft: 8 }}>Studio Vertical · Génération en cours…</span>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: RED, animation: "pulse 1.5s infinite" }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: RED, letterSpacing: 2 }}>REC</span>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "28px 28px", minHeight: 280 }}>
              {DEMO_SEQUENCES.map((seq, i) => {
                const done = i < demoPhase;
                const active = i === demoPhase;
                if (i > demoPhase) return null;
                return (
                  <div key={i} style={{ display: "flex", gap: 16, marginBottom: 18, opacity: done ? 0.6 : 1, transition: "opacity .3s" }}>
                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: done ? MUTED : seq.color, fontFamily: "monospace", flexShrink: 0, paddingTop: 2, minWidth: 60 }}>{seq.label}</span>
                    <p style={{ fontSize: 15, color: done ? MUTED : seq.color, lineHeight: 1.6, fontFamily: i < 2 ? "'Playfair Display', Georgia, serif" : "'Space Grotesk', sans-serif", fontWeight: i < 2 ? 700 : 500 }} className={active ? "cursor" : ""}>
                      {active ? demoText : seq.full}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Footer bar */}
            <div style={{ padding: "14px 28px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 24 }}>
              {[["Univers", "Hôpital"], ["Secret", "Erreur médicale"], ["Mode", "Fast Drama"], ["Épisodes", "10"]].map(([k, v]) => (
                <div key={k}>
                  <span style={{ fontSize: 10, color: MUTED, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{k} </span>
                  <span style={{ fontSize: 11, color: TEXT, fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
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
                desc: "Tu filmes seul avec ton téléphone. Studio Vertical génère toute la structure narrative — tu n'as plus qu'à tourner. Tes concurrents passent des jours sur un script. Toi, 5 minutes.",
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
          <p style={{ textAlign: "center", color: MUTED, marginBottom: 56, fontSize: 15 }}>Moins de 5 minutes, chrono</p>
          {/* Timeline */}
          <div style={{ position: "relative" }}>
            {/* Connecting line */}
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
                  {/* Node */}
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${iconColor}20, ${iconColor}08)`, border: `2px solid ${iconColor}`, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor, marginBottom: 24, animation: `nodePop 0.5s ease forwards ${delay}`, opacity: 0, boxShadow: `0 0 20px ${iconColor}30`, zIndex: 2 }}>
                    <Icon size={22} />
                  </div>
                  {/* Card */}
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
              { icon: <ClapperIcon size={20} />, iconColor: VIO, title: "Bible express", desc: "Titre, logline, personnages avec secrets, tension centrale. Généré en streaming — tu vois la série prendre vie." },
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

      {/* TESTIMONIALS */}
      {/* ROI */}
      <div className="sec" style={{ padding: "80px 40px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Label color={RED}>Gain de temps</Label>
          <Title>8 heures.<br /><span style={{ fontStyle: "italic", background: `linear-gradient(135deg, ${RED}, ${VIO})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Réduit à 5 minutes.</span></Title>
          <p style={{ textAlign: "center", color: MUTED, marginBottom: 48, fontSize: 15 }}>Chaque tâche d'écriture, accélérée ×96</p>

          <div className="roi-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 20, alignItems: "center" }}>
            {/* Sans IA */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: 20, padding: "28px 28px" }}>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: MUTED, marginBottom: 20 }}>✗ Sans IA</p>
              {[
                ["Brainstorming", "2–3 heures"],
                ["Bible complète", "3–4 heures"],
                ["Script d'un épisode", "2 heures"],
                ["Fiche de production", "1 heure"],
              ].map(([task, time]) => (
                <div key={task} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 14, color: MUTED }}>{task}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: MUTED, fontFamily: "monospace" }}>{time}</span>
                </div>
              ))}
              <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: MUTED }}>Total</span>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 900, color: MUTED, letterSpacing: -1 }}>8h+</span>
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "0 8px" }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 900, background: `linear-gradient(135deg, ${RED}, ${VIO})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>×96</div>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={VIO} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              <span style={{ fontSize: 10, color: MUTED, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>plus rapide</span>
            </div>

            {/* Avec Studio Vertical */}
            <div style={{ background: "rgba(168,85,247,0.04)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 20, padding: "28px 28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${RED}, ${VIO})` }} />
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: VIO, marginBottom: 20 }}>✓ Studio Vertical</p>
              {[
                ["Brainstorming", "10 sec"],
                ["Bible complète", "30 sec"],
                ["Script d'un épisode", "10 sec"],
                ["Fiche de production", "20 sec"],
              ].map(([task, time]) => (
                <div key={task} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid rgba(168,85,247,0.1)` }}>
                  <span style={{ fontSize: 14, color: TEXT }}>{task}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: RED, fontFamily: "monospace" }}>⚡ {time}</span>
                </div>
              ))}
              <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Total</span>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 900, background: `linear-gradient(135deg, ${RED}, ${VIO})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: -1 }}>&lt; 5 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sec" style={{ padding: "80px 40px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Label color={VIO}>Témoignages</Label>
          <Title>Ils créent déjà<br /><span style={{ fontStyle: "italic" }}>avec Studio Vertical.</span></Title>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 48 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass" style={{ borderRadius: 20, padding: 28, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${i === 1 ? VIO : RED}, transparent)` }} />
                <p style={{ fontSize: 13, color: RED, fontWeight: 800, marginBottom: 18, letterSpacing: 3 }}>★★★★★</p>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, lineHeight: 1.75, marginBottom: 24, color: TEXT, fontStyle: "italic" }}>« {t.text} »</p>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: MUTED }}>{t.role}</p>
                </div>
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
          <p style={{ textAlign: "center", color: MUTED, marginBottom: 36, fontSize: 15 }}>Annulable à tout moment · Sans engagement</p>
          <input type="email" placeholder="ton@email.com" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", maxWidth: 400, display: "block", margin: "0 auto 32px", padding: "14px 18px", borderRadius: 12, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, fontSize: 15, outline: "none" }} />
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            <div className="glass" style={{ borderRadius: 24, padding: "36px 32px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: MUTED, textTransform: "uppercase", marginBottom: 12 }}>Standard</p>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 58, fontWeight: 900, color: TEXT, lineHeight: 1, letterSpacing: -2, marginBottom: 4 }}>9€</div>
              <p style={{ color: MUTED, fontSize: 13, marginBottom: 28 }}>/mois</p>
              <div style={{ marginBottom: 28 }}>
                {["⚡ Fast Drama uniquement", "10 épisodes par série", "Scripts 1 à 2 min", "Mode Tournage + Téléprompteur", "🌍 Traduction en 8 langues", "☁️ Sauvegarde cloud", "📄 Export PDF"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Check />
                    <span style={{ color: MUTED, fontSize: 14 }}>{item}</span>
                  </div>
                ))}
              </div>
              <GlowBtn onClick={() => startCheckout("standard")} disabled={loading} style={{ width: "100%", fontSize: 15, padding: 16 }}>
                {loading ? "Redirection…" : "Commencer →"}
              </GlowBtn>
            </div>
            <div style={{ borderRadius: 24, padding: "36px 32px", position: "relative", background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.25)", boxShadow: "0 0 48px rgba(168,85,247,0.08)" }}>
              <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${RED}, ${VIO})`, color: "#fff", fontSize: 10, fontWeight: 800, padding: "4px 16px", borderRadius: 20, letterSpacing: 1.5, whiteSpace: "nowrap" }}>⭐ RECOMMANDÉ</div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: VIO, textTransform: "uppercase", marginBottom: 12 }}>Premium</p>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 58, fontWeight: 900, color: TEXT, lineHeight: 1, letterSpacing: -2, marginBottom: 4 }}>19€</div>
              <p style={{ color: MUTED, fontSize: 13, marginBottom: 28 }}>/mois</p>
              <div style={{ marginBottom: 28 }}>
                {["⚡ Fast Drama + 🎭 Premium Suspense", "Jusqu'à 90 épisodes par série", "Scripts 1 à 2 min", "Mode Tournage + Téléprompteur", "🎲 3 variations par script", "🔥 Générateur de titres viraux", "🌍 Traduction en 8 langues", "🎬 Fiche technique de production", "☁️ Sauvegarde cloud", "📄 Export PDF"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Check color={VIO} />
                    <span style={{ color: MUTED, fontSize: 14 }}>{item}</span>
                  </div>
                ))}
              </div>
              <GlowBtn onClick={() => startCheckout("premium")} disabled={loading} gradient style={{ width: "100%", fontSize: 15, padding: 16 }}>
                {loading ? "Redirection…" : "Commencer Premium →"}
              </GlowBtn>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap", marginTop: 28 }}>
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
            <GlowBtn onClick={() => startCheckout()} disabled={loading} gradient>
              {loading ? "Redirection…" : "Commencer →"}
            </GlowBtn>
          </div>
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
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
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "32px 40px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Logo size="sm" />
        </div>
        <p style={{ color: MUTED, fontSize: 13 }}>
          © 2026 Studio Vertical · Tous droits réservés ·{" "}
          <a href="mailto:hello@studiovertical.app" style={{ color: MUTED }}>Contact</a> ·{" "}
          <a href="/cgu" style={{ color: MUTED }}>CGU</a> ·{" "}
          <a href="/confidentialite" style={{ color: MUTED }}>Confidentialité</a>
        </p>
      </footer>
    </div>
  );
}

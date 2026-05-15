import { useState, useEffect } from "react";
import Head from "next/head";

const RED = "#E85C3A";
const VIO = "#a855f7";
const DARK = "#09090f";
const SURFACE = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#f1f5f9";
const MUTED = "#64748b";
const GREEN = "#4ade80";
const SITE = "https://studiovertical.app";

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

function CodeDisplay({ code }) {
  const [copied, setCopied] = useState(false);
  const [shareOk, setShareOk] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const share = async () => {
    const text = `Rejoins Studio Vertical avec mon code ${code} — tu as 30 jours offerts ! ${SITE}`;
    if (navigator.share) {
      try { await navigator.share({ text }); setShareOk(true); setTimeout(() => setShareOk(false), 2000); }
      catch {}
    } else {
      navigator.clipboard.writeText(text);
      setShareOk(true);
      setTimeout(() => setShareOk(false), 2000);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>Ton code de parrainage</p>
      <div style={{ display: "inline-block", background: "rgba(255,255,255,0.03)", border: `2px solid ${GREEN}30`, borderRadius: 20, padding: "20px 40px", marginBottom: 20 }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 52, fontWeight: 900, color: TEXT, letterSpacing: 8, lineHeight: 1 }}>{code}</div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={copy} style={{ background: copied ? GREEN : RED, color: copied ? DARK : "#fff", border: "none", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", transition: "all .2s", minWidth: 140 }}>
          {copied ? "✓ Copié !" : "📋 Copier le code"}
        </button>
        <button onClick={share} style={{ background: shareOk ? GREEN : SURFACE, color: shareOk ? DARK : TEXT, border: `1px solid ${BORDER}`, padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", transition: "all .2s", minWidth: 140 }}>
          {shareOk ? "✓ Partagé !" : "↗ Partager"}
        </button>
      </div>
      <p style={{ color: MUTED, fontSize: 13, marginTop: 16 }}>Partage aussi ton lien : <span style={{ color: VIO, fontWeight: 600 }}>{SITE}/?ref={code}</span></p>
    </div>
  );
}

function AppSection() {
  const [customerId, setCustomerId] = useState(null);
  const [code, setCode] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notLogged, setNotLogged] = useState(false);

  useEffect(() => {
    const id = typeof window !== "undefined" ? localStorage.getItem("vs_customer_id") : null;
    if (!id) { setNotLogged(true); setLoading(false); return; }
    setCustomerId(id);
    fetch("/api/referral", { headers: { Authorization: `Bearer ${id}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setCode(d.code); setCount(d.count || 0); setLoading(false); })
      .catch(() => { setNotLogged(true); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: `3px solid ${BORDER}`, borderTopColor: RED, animation: "spin 1s linear infinite", margin: "0 auto" }} />
      </div>
    );
  }

  if (notLogged || !code) {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ color: MUTED, fontSize: 15, marginBottom: 24, lineHeight: 1.7 }}>
          Connecte-toi à ton compte pour accéder à ton code de parrainage.
        </p>
        <a href="/app" style={{ display: "inline-block", background: `linear-gradient(135deg, ${RED}, ${VIO})`, color: "#fff", padding: "15px 32px", borderRadius: 14, fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", boxShadow: `0 0 28px rgba(168,85,247,0.3)`, textDecoration: "none" }}>
          Accéder à mon compte →
        </a>
        <p style={{ color: MUTED, fontSize: 13, marginTop: 16 }}>
          Pas encore abonné ? <a href="/tarifs" style={{ color: VIO, fontWeight: 600 }}>Voir les tarifs →</a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <CodeDisplay code={code} />
      {count > 0 && (
        <div style={{ marginTop: 28, padding: "16px 24px", background: `${GREEN}0a`, border: `1px solid ${GREEN}25`, borderRadius: 14, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: GREEN, fontWeight: 700 }}>
            🎉 {count} ami{count > 1 ? "s" : ""} parrainé{count > 1 ? "s" : ""} — {count} mois de crédit gagné{count > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Parrainage() {
  return (
    <>
      <Head>
        <title>Parrainage Studio Vertical — 30 jours offerts pour ton filleul</title>
        <meta name="description" content="Parraine un créateur avec ton code Studio Vertical : il reçoit 30 jours gratuits, tu gagnes 1 mois de crédit. Programme de parrainage illimité." />
        <link rel="canonical" href={`${SITE}/parrainage`} />
      </Head>

      <div style={{ minHeight: "100vh", background: DARK, color: TEXT, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          a { text-decoration: none; color: inherit; }
          button:hover { opacity: .88 !important; }
          @media (max-width: 640px) {
            .page-pad { padding: 60px 20px !important; }
            nav { padding: 14px 16px !important; }
            .steps-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* NAV */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: `1px solid ${BORDER}`, background: "rgba(9,9,15,0.9)", backdropFilter: "blur(20px)" }}>
          <nav style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <a href="/"><Logo /></a>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <a href="/tarifs" style={{ fontSize: 14, color: MUTED, fontWeight: 600 }}>Tarifs</a>
              <a href="/app" style={{ fontSize: 14, color: TEXT, fontWeight: 700, background: SURFACE, border: `1px solid ${BORDER}`, padding: "8px 16px", borderRadius: 10 }}>Mon compte →</a>
            </div>
          </nav>
        </div>

        {/* HERO */}
        <div className="page-pad" style={{ padding: "80px 40px 64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 700, height: 350, background: `radial-gradient(ellipse, rgba(74,222,128,0.06) 0%, transparent 65%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 80, right: "10%", width: 300, height: 300, background: `radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)`, pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}25`, color: GREEN, padding: "7px 18px", borderRadius: 100, fontSize: 12, fontWeight: 600, marginBottom: 36, letterSpacing: 1 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: GREEN, display: "inline-block", animation: "pulse 1.5s infinite" }} />
              Programme de parrainage
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(38px, 7vw, 82px)", fontWeight: 900, lineHeight: 0.95, letterSpacing: -3, marginBottom: 28, color: TEXT }}>
              Partage.<br />
              <span style={{ background: `linear-gradient(135deg, ${GREEN} 20%, ${VIO})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Gagnez
              </span>{" "}tous.
            </h1>

            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: MUTED, maxWidth: 480, margin: "0 auto 20px", lineHeight: 1.7 }}>
              Chaque créateur que tu paraines reçoit <strong style={{ color: TEXT }}>30 jours gratuits</strong>. Toi tu gagnes <strong style={{ color: TEXT }}>1 mois offert</strong>. Sans limite.
            </p>
          </div>
        </div>

        {/* COMMENT ÇA MARCHE */}
        <div className="page-pad" style={{ padding: "0 40px 80px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 64 }}>
              {[
                {
                  num: "01",
                  emoji: "🔗",
                  color: GREEN,
                  title: "Partage ton code",
                  desc: "Récupère ton code unique ci-dessous et envoie-le à tes amis créateurs — SMS, DM, story Instagram.",
                },
                {
                  num: "02",
                  emoji: "🎬",
                  color: VIO,
                  title: "Ton filleul s'abonne",
                  desc: "Il entre ton code au moment du paiement sur Studio Vertical. Il reçoit automatiquement 30 jours offerts.",
                },
                {
                  num: "03",
                  emoji: "🎁",
                  color: RED,
                  title: "Tu gagnes 1 mois",
                  desc: "Un crédit d'1 mois est appliqué sur ton prochain paiement. Sans limite — 5 filleuls = 5 mois gratuits.",
                },
              ].map(({ num, emoji, color, title, desc }) => (
                <div key={num} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 24, padding: "32px 28px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color, opacity: 0.6 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: `${color}14`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, animation: "float 4s ease-in-out infinite" }}>
                      {emoji}
                    </div>
                    <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 800, color: MUTED, letterSpacing: 2 }}>{num}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 900, marginBottom: 10, letterSpacing: -0.5, color: TEXT }}>{title}</h3>
                  <p style={{ color: MUTED, lineHeight: 1.7, fontSize: 14 }}>{desc}</p>
                </div>
              ))}
            </div>

            {/* Récap visuel gains */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 64 }}>
              <div style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}20`, borderRadius: 20, padding: "28px 32px", textAlign: "center" }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: GREEN, marginBottom: 12 }}>Ton filleul reçoit</p>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 52, fontWeight: 900, color: TEXT, lineHeight: 1, letterSpacing: -2, marginBottom: 8 }}>30j</div>
                <p style={{ color: MUTED, fontSize: 14 }}>d'abonnement offerts</p>
              </div>
              <div style={{ background: `${VIO}08`, border: `1px solid ${VIO}20`, borderRadius: 20, padding: "28px 32px", textAlign: "center" }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: VIO, marginBottom: 12 }}>Tu gagnes</p>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 52, fontWeight: 900, color: TEXT, lineHeight: 1, letterSpacing: -2, marginBottom: 8 }}>1 mois</div>
                <p style={{ color: MUTED, fontSize: 14 }}>de crédit par filleul · sans limite</p>
              </div>
            </div>

            {/* MON CODE */}
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 28, padding: "48px 40px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${GREEN}, ${VIO})` }} />
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${GREEN}06 0%, transparent 60%)`, pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: GREEN, marginBottom: 8 }}>Mon code</p>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, textAlign: "center", marginBottom: 40, letterSpacing: -1, color: TEXT }}>
                  Ton code personnel.
                </h2>
                <AppSection />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "64px 40px" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: RED, marginBottom: 40 }}>Questions</p>
            {[
              { q: "Mon filleul doit-il être un nouvel abonné ?", r: "Oui, le code n'est valable qu'à la première inscription. Un abonné existant ne peut pas l'utiliser pour renouveler." },
              { q: "Quand est appliqué mon crédit d'1 mois ?", r: "Automatiquement sur ton prochain paiement, dès que ton filleul confirme son abonnement (après la période d'essai si applicable)." },
              { q: "Combien de fois puis-je parrainer ?", r: "Autant que tu veux. Il n'y a aucune limite. 10 filleuls = 10 mois gratuits." },
              { q: "Mon code expirera-t-il ?", r: "Non. Ton code est permanent et lié à ton compte tant que tu es abonné." },
            ].map((item, i) => {
              const [open, setOpen] = useState(false);
              return (
                <div key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <button onClick={() => setOpen(o => !o)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'Space Grotesk', sans-serif" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: TEXT, paddingRight: 16 }}>{item.q}</span>
                    <span style={{ color: VIO, fontSize: 20, flexShrink: 0, transition: "transform .2s", display: "inline-block", transform: open ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {open && <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.75, paddingBottom: 18 }}>{item.r}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "72px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${GREEN}05 0%, transparent 60%)`, pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, marginBottom: 16, letterSpacing: -2, lineHeight: 1.1, color: TEXT }}>
              Pas encore abonné ?
            </h2>
            <p style={{ color: MUTED, fontSize: 16, marginBottom: 36, lineHeight: 1.6 }}>Commence à créer tes micro-dramas. Puis invite tes amis.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/tarifs" style={{ display: "inline-block", background: `linear-gradient(135deg, ${RED}, ${VIO})`, color: "#fff", padding: "16px 32px", borderRadius: 14, fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", boxShadow: `0 0 28px rgba(168,85,247,0.3)` }}>
                Voir les tarifs →
              </a>
              <a href="/exemples" style={{ display: "inline-block", background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT, padding: "16px 32px", borderRadius: 14, fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                Voir les exemples
              </a>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "28px 40px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
          <Logo />
          <div style={{ display: "flex", gap: 20, fontSize: 13, color: MUTED }}>
            <a href="/">Accueil</a>
            <a href="/tarifs">Tarifs</a>
            <a href="/exemples">Exemples</a>
            <a href="/cgu">CGU</a>
          </div>
        </div>
      </div>
    </>
  );
}

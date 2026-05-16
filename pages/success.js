import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const RED = "#E85C3A";
const VIO = "#a855f7";
const DARK = "#09090f";
const SURFACE = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#f1f5f9";
const MUTED = "#64748b";

const Logo = () => (
  <div style={{ display: "flex", alignItems: "stretch", gap: 10, userSelect: "none" }}>
    <div style={{ width: 3, borderRadius: 2, background: "linear-gradient(to bottom, #ff8c42, #E85C3A)", flexShrink: 0 }} />
    <svg width="17" height="28" viewBox="0 0 17 28" fill="none" style={{ flexShrink: 0, alignSelf: "center" }}>
      <rect x="1" y="1" width="15" height="26" rx="3" stroke="white" strokeWidth="1.5"/>
      <circle cx="8.5" cy="23.5" r="1.1" fill="white" opacity="0.5"/>
      <rect x="5.5" y="3.5" width="6" height="1" rx="0.5" fill="white" opacity="0.4"/>
    </svg>
    <div style={{ alignSelf: "center", lineHeight: 1 }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>VERTICAL</div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 800, letterSpacing: -0.5, background: "linear-gradient(135deg, #ff8c42, #E85C3A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 }}>CLAP</div>
    </div>
  </div>
);

const STEPS = [
  {
    n: "01",
    color: RED,
    title: "Ouvre le Mixeur",
    desc: "Choisis un univers, un secret et un casting — ou tape directement ton idée. 12 packs thématiques disponibles en 1 clic.",
    action: "Dans l'app → onglet 🎲 Mixeur",
  },
  {
    n: "02",
    color: VIO,
    title: "Génère ta bible",
    desc: "Clique sur Générer. Le titre, la logline, les personnages et les 10 épisodes apparaissent en streaming en moins de 30 secondes.",
    action: "Dans l'app → bouton Générer la bible",
  },
  {
    n: "03",
    color: RED,
    title: "Lance le script & tourne",
    desc: "Ouvre un épisode, génère le script en 10 sec. Active le Mode Tournage pour le téléprompteur auto-scroll. Ton téléphone devient ton plateau.",
    action: "Dans l'app → épisode → Script → Mode Tournage",
  },
];

export default function Success() {
  const router = useRouter();
  const { session_id, plan, trial } = router.query;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "checkout_success", meta: { plan: plan || "standard" } }),
    }).catch(() => {});
  }, []);

  const appUrl = session_id ? `/app?session_id=${session_id}` : "/app";

  return (
    <>
      <Head>
        <title>Bienvenue sur VerticalClap 🎬</title>
        <meta name="robots" content="noindex" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: "100vh", background: DARK, color: TEXT, fontFamily: "'Space Grotesk', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
          @keyframes confetti { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(80px) rotate(360deg);opacity:0} }
          .fade { animation: fadeUp .5s ease forwards; opacity: 0; }
          a { color: inherit; text-decoration: none; }
        `}</style>

        {/* Confetti particles */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
          {visible && [...Array(20)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              top: `${Math.random() * 30}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              borderRadius: i % 3 === 0 ? "50%" : 2,
              background: i % 2 === 0 ? RED : VIO,
              animation: `confetti ${Math.random() * 2 + 1.5}s ease-out ${Math.random() * 1}s forwards`,
              opacity: 0,
            }} />
          ))}
        </div>

        {/* Nav */}
        <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(9,9,15,0.9)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 10 }}>
          <Logo />
          <a href={appUrl} style={{ fontSize: 14, fontWeight: 700, color: TEXT, background: SURFACE, border: `1px solid ${BORDER}`, padding: "8px 16px", borderRadius: 10 }}>Ouvrir l'app →</a>
        </div>

        {/* Content */}
        <div style={{ flex: 1, maxWidth: 720, margin: "0 auto", padding: "80px 40px", width: "100%", position: "relative", zIndex: 1 }}>

          {/* Trial notice */}
          {trial === "1" && (
            <div className="fade" style={{ animationDelay: "0s", background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.25)", borderRadius: 14, padding: "14px 20px", marginBottom: 28, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>⏱</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", marginBottom: 4 }}>Essai 24h en cours</p>
                <p style={{ fontSize: 13, color: "#92400e", color: "#fcd34d", lineHeight: 1.6, opacity: 0.8 }}>
                  Aucun débit avant demain. Si tu veux annuler, va dans l'app → <strong>Mon compte → Gérer l'abonnement</strong> avant minuit.
                </p>
              </div>
            </div>
          )}

          {/* Success badge */}
          <div className="fade" style={{ animationDelay: trial === "1" ? "0.1s" : "0s", textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-flex", width: 72, height: 72, borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "2px solid rgba(74,222,128,0.3)", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "#4ade80", marginBottom: 16 }}>Paiement confirmé</p>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, letterSpacing: -2, lineHeight: 1.05, marginBottom: 16 }}>
              Bienvenue dans<br />
              <span style={{ background: `linear-gradient(135deg, ${RED}, ${VIO})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>
                VerticalClap.
              </span>
            </h1>
            <p style={{ color: MUTED, fontSize: 16, lineHeight: 1.7 }}>
              Ton accès est actif. Ta première série est à 5 minutes.
            </p>
          </div>

          {/* Onboarding steps */}
          <div className="fade" style={{ animationDelay: "0.2s", marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: MUTED, marginBottom: 24, textAlign: "center" }}>Par où commencer</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {STEPS.map(({ n, color, title, desc, action }, i) => (
                <div key={i} style={{ display: "flex", gap: 20, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 18, padding: "24px 24px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${color}, transparent)` }} />
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: `${color}14`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 800, color }}>{n}</span>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 19, fontWeight: 700, marginBottom: 8, letterSpacing: -0.3 }}>{title}</h3>
                    <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7, marginBottom: 10 }}>{desc}</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color, fontFamily: "monospace", letterSpacing: 0.5 }}>→ {action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="fade" style={{ animationDelay: "0.4s", textAlign: "center" }}>
            <a href={appUrl} style={{
              display: "inline-block",
              background: `linear-gradient(135deg, ${RED}, ${VIO})`,
              color: "#fff", padding: "18px 48px", borderRadius: 16, fontSize: 17, fontWeight: 700,
              boxShadow: `0 0 40px rgba(168,85,247,0.3), 0 0 20px rgba(232,92,58,0.2)`,
              letterSpacing: -0.3,
            }}>
              Créer ma première série →
            </a>
            <p style={{ color: MUTED, fontSize: 13, marginTop: 16 }}>
              Un doute ? <a href="mailto:hello@verticalclap.app" style={{ color: VIO, fontWeight: 600 }}>hello@verticalclap.app</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

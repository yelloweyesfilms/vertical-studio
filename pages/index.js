import { useState } from "react";
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
  const router = useRouter();
  const canceled = router.query.canceled;

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
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a href="/exemples" style={{ fontSize: 14, color: MUTED, fontWeight: 600, transition: "color .15s" }} onMouseEnter={e => e.target.style.color = TEXT} onMouseLeave={e => e.target.style.color = MUTED}>Exemples</a>
            <a href="/app" style={{ fontSize: 14, color: TEXT, fontWeight: 700, background: SURFACE, border: `1px solid ${BORDER}`, padding: "8px 16px", borderRadius: 10 }}>Se connecter →</a>
          </div>
        </nav>
      </div>

      {/* HERO */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 40px 80px", textAlign: "center", position: "relative" }} className="hero-pad">
        <div style={{ position: "absolute", top: 40, left: "15%", width: 500, height: 500, background: `radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 120, right: "10%", width: 350, height: 350, background: `radial-gradient(circle, rgba(232,92,58,0.08) 0%, transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
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
          <p style={{ color: MUTED, fontSize: 13 }}>9€/mois · Annulable à tout moment · Aucun engagement</p>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "28px 40px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "center", gap: 56, flexWrap: "wrap" }}>
          {[["2 000+", "séries générées"], ["50+", "créateurs actifs"], ["< 5 min", "par série complète"], ["8 langues", "de traduction"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 900, color: TEXT, lineHeight: 1, letterSpacing: -1 }}>{val}</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 6, fontWeight: 500, letterSpacing: 1 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MOCK PHONE */}
      <div className="mock-phone" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: 280, width: "100%", background: "#0a0a14", border: `1px solid rgba(168,85,247,0.25)`, borderRadius: 44, padding: "32px 22px", boxShadow: `0 0 80px rgba(168,85,247,0.12), 0 0 32px rgba(232,92,58,0.08), 0 48px 80px rgba(0,0,0,.7)` }}>
          <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 10, margin: "0 auto 28px" }} />
          {[
            { text: "⚡ HOOK — 3 PREMIÈRES SECONDES", s: { fontSize: 8, fontWeight: 800, color: RED, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace" } },
            { text: "MAYA", s: { fontSize: 9, fontWeight: 800, color: VIO, letterSpacing: 3, textTransform: "uppercase" } },
            { text: "Si vous regardez ça... c'est que j'ai pas réussi.", s: { fontSize: 13, fontWeight: 600, color: TEXT, lineHeight: 1.5 } },
            { text: "[9:16] Gros plan face caméra, yeux dans l'objectif", s: { fontSize: 10, color: MUTED, fontStyle: "italic" } },
            { text: "LUCA", s: { fontSize: 9, fontWeight: 800, color: VIO, letterSpacing: 3, textTransform: "uppercase" } },
            { text: "Tu as réussi. Regarde ce que j'ai trouvé.", s: { fontSize: 13, fontWeight: 600, color: TEXT, lineHeight: 1.5 } },
            { text: "[9:16] Insert téléphone, notification qui clignote", s: { fontSize: 10, color: MUTED, fontStyle: "italic" } },
            { text: "🎬 CLIFFHANGER", s: { fontSize: 8, fontWeight: 800, color: RED, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace" } },
            { text: "L'écran s'allume. ACCESS GRANTED.", s: { fontSize: 14, fontWeight: 700, color: TEXT, lineHeight: 1.4 } },
          ].map((l, i) => <p key={i} style={{ ...l.s, marginBottom: 10 }}>{l.text}</p>)}
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
                icon: "📱",
                title: "Créateur solo",
                sub: "TikTok · Reels · Shorts",
                desc: "Tu filmes seul avec ton téléphone. Studio Vertical génère toute la structure narrative — tu n'as plus qu'à tourner. Tes concurrents passent des jours sur un script. Toi, 5 minutes.",
                color: RED,
              },
              {
                icon: "🎬",
                title: "Équipe de production",
                sub: "2 à 5 personnes",
                desc: "Votre équipe produit plusieurs séries par semaine. Le Mixeur garde la cohérence de ton univers, le cloud synchronise tout. Jusqu'à 90 épisodes et 4 variations par script.",
                color: VIO,
              },
              {
                icon: "🎭",
                title: "Acteur · Réalisateur",
                sub: "Pro du plateau",
                desc: "Tu veux des scripts au niveau. Premium Suspense génère des dialogues avec sous-texte, jeu d'acteur précis et cadrage 9:16. Le Mode Tournage remplace le prompteur sur le plateau.",
                color: RED,
              },
            ].map(({ icon, title, sub, desc, color }, i) => (
              <div key={i} className="glass" style={{ borderRadius: 20, padding: "32px 28px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${i === 1 ? VIO : RED}, transparent)` }} />
                <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
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
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { step: "01", icon: "🎲", title: "Configure le Mixeur", desc: "Choisis ton casting, ton univers et ton secret central — ou utilise un pack thématique en 1 clic. 12 univers, 16 secrets disponibles." },
              { step: "02", icon: "📖", title: "La bible se génère en live", desc: "Titre viral, logline, personnages et séquencier complet apparaissent en temps réel. Les épisodes arrivent en parallèle automatiquement." },
              { step: "03", icon: "📱", title: "Tourne avec le script", desc: "Ouvre un épisode, génère le script en 10s. Mode Tournage avec téléprompteur, fond clair/sombre, vitesse réglable. Prêt à filmer." },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="glass" style={{ borderRadius: 20, padding: 28, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${RED}, ${VIO})`, opacity: 0.5 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: MUTED, letterSpacing: 3, fontFamily: "monospace" }}>{step}</span>
                  <span style={{ fontSize: 28 }}>{icon}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                <p style={{ color: MUTED, lineHeight: 1.65, fontSize: 14 }}>{desc}</p>
              </div>
            ))}
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
              { icon: "🎲", title: "Le Mixeur", desc: "12 univers, 16 secrets, 4 castings. Ou entre le tien. 12 packs thématiques pour démarrer en 1 clic." },
              { icon: "📖", title: "Bible express", desc: "Titre, logline, personnages avec secrets, tension centrale. Généré en streaming — tu vois la série prendre vie." },
              { icon: "🎬", title: "Scripts prêts à tourner", desc: "Hook 3 secondes, dialogues, jeu d'acteur, cadrage 9:16. Fast Drama ou Premium Suspense selon ton style." },
              { icon: "🎲", title: "3 variations par script", desc: "Intense, Subtil ou Rapide — 3 versions générées en parallèle pour choisir le ton parfait. Premium uniquement." },
              { icon: "🌍", title: "Traduction en 8 langues", desc: "Traduis n'importe quel script en Anglais, Espagnol, Allemand, Portugais, Italien, Arabe, Hébreu ou Chinois." },
              { icon: "🎬", title: "Fiche technique Prod", desc: "Décors, costumes, lieux de tournage générés par l'IA pour chaque série. Tourne pro avec un smartphone." },
              { icon: "📱", title: "Mode Tournage", desc: "Téléprompteur auto-scroll, fond clair ou sombre, vitesse réglable, barre de progression. Rien à imprimer." },
              { icon: "🔥", title: "Titres viraux", desc: "5 titres alternatifs avec score de viralité, accroche et analyse psychologique. Premium uniquement." },
              { icon: "☁️", title: "Sauvegarde cloud", desc: "Tes séries synchronisées sur tous tes appareils automatiquement. Accès depuis n'importe où." },
            ].map((f, i) => (
              <div key={i} className="glass" style={{ borderRadius: 16, padding: 22, borderLeft: `3px solid ${i % 2 === 0 ? RED : VIO}` }}>
                <div style={{ fontSize: 22, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: MUTED, lineHeight: 1.65, fontSize: 13 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
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
          <p style={{ color: MUTED, fontSize: 13, marginTop: 16 }}>9€/mois · Annulable à tout moment</p>
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

import { useState } from "react";
import { useRouter } from "next/router";

const RED = "#E85C3A";
const DARK = "#1A1A18";
const GRAY = "#6B6B68";
const LIGHT = "#F7F4EF";

const s = {
  page: { minHeight: "100vh", background: "#fff", color: DARK, fontFamily: "var(--sans)" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 40px", borderBottom: "1px solid #E8E4DC", maxWidth: 1100, margin: "0 auto", width: "100%" },
  logo: { fontFamily: "var(--serif)", fontSize: 15, fontWeight: 900, letterSpacing: -0.3, display: "flex", alignItems: "center" },
  btnRed: { background: RED, color: "#fff", border: "none", padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" },
  footer: { background: "#0D0D0D", borderTop: "1px solid #222", padding: "32px 40px", textAlign: "center", color: "#444", fontSize: 13 },
};

const Logo = () => (
  <div style={s.logo}>
    <svg width="28" height="28" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8, verticalAlign: "middle" }}>
      <rect width="30" height="30" rx="7" fill={RED} />
      <rect x="6" y="14" width="18" height="11" rx="2" fill="white" />
      <rect x="6" y="10" width="18" height="5" rx="1" fill="white" opacity="0.9" />
      <line x1="10" y1="10" x2="8" y2="15" stroke={RED} strokeWidth="1.5" />
      <line x1="15" y1="10" x2="13" y2="15" stroke={RED} strokeWidth="1.5" />
      <line x1="20" y1="10" x2="18" y2="15" stroke={RED} strokeWidth="1.5" />
      <polygon points="13,17 13,23 20,20" fill={RED} />
    </svg>
    <span style={{ verticalAlign: "middle" }}>STUDIO VERTICAL</span>
  </div>
);

const Check = ({ color = RED }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="9" fill={color} opacity="0.15" />
    <path d="M5 9l3 3 5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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

export default function Landing() {
  const [email, setEmail] = useState("");
  const [refCode, setRefCode] = useState("");
  const [refValid, setRefValid] = useState(null); // null | true | false
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const router = useRouter();
  const canceled = router.query.canceled;

  const checkRefCode = async (code) => {
    setRefCode(code);
    if (code.length < 4) { setRefValid(null); return; }
    try {
      const res = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      setRefValid(res.ok);
    } catch { setRefValid(false); }
  };

  const startCheckout = async (plan = "standard") => {
    if (!email) { alert("Entre ton email pour continuer"); return; }
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, plan, refCode: refValid ? refCode : undefined }),
    });
    const { url, error } = await res.json();
    if (error) { alert(error); setLoading(false); return; }
    window.location.href = url;
  };

  return (
    <div style={s.page}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        input::placeholder { color: #AAA8A4; }
        button:hover { opacity: .88; }
        * { box-sizing: border-box; }
        input { font-size: 16px; }
        @media (max-width: 640px) {
          .hero-input-row { flex-direction: column !important; }
          .hero-input-row input { width: 100% !important; max-width: 100% !important; }
          .hero-input-row button { width: 100% !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .testi-grid { grid-template-columns: 1fr !important; }
          nav { padding: 14px 16px !important; }
          .hero { padding: 48px 20px 32px !important; }
          .section { padding: 48px 20px !important; }
          .stats-bar { gap: 24px !important; padding: 16px 20px !important; }
          .pricing-input { width: 100% !important; max-width: 100% !important; }
          .ref-input { width: 100% !important; }
          .mock-phone { display: none !important; }
          .footer-inner { padding: 24px 20px !important; }
        }
      `}</style>

      {/* NAV */}
      <div style={{ borderBottom: "1px solid #E8E4DC", position: "sticky", top: 0, background: "#fff", zIndex: 50 }}>
        <nav style={{ ...s.nav, padding: "14px 40px" }} className="nav">
          <Logo />
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, color: RED, letterSpacing: 2 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: RED, animation: "pulse 1.5s infinite" }} />
            REC
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="/exemples" style={{ fontSize: 14, color: GRAY, textDecoration: "none", fontWeight: 600 }}>Exemples</a>
            <a href="/app" style={{ fontSize: 14, color: GRAY, textDecoration: "none", fontWeight: 600 }}>Se connecter →</a>
          </div>
        </nav>
      </div>

      {/* HERO */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px 60px", textAlign: "center" }} className="hero">
        <div style={{ display: "inline-block", background: "#FFF0EC", border: "1px solid #FBD5C8", color: RED, padding: "6px 14px", borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 32 }}>
          🎬 Le studio mobile des séries verticales
        </div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24 }}>
          De l'idée<br />au <span style={{ color: RED }}>cliffhanger</span>.<br />En 5 minutes.
        </h1>
        <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: GRAY, maxWidth: 540, margin: "0 auto 48px", lineHeight: 1.6 }}>
          Génère des micro-dramas 9:16 complets avec l'IA — bible, scripts, hooks, cliffhangers. Prêts à tourner sur mobile.
        </p>
        {canceled && <p style={{ color: RED, marginBottom: 16, fontSize: 14 }}>Paiement annulé. Réessaie quand tu veux.</p>}
        <div className="hero-input-row" style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && startCheckout()}
            style={{ padding: "16px 20px", borderRadius: 12, border: "1px solid #ddd", background: "#fff", color: DARK, fontSize: 15, width: 240, outline: "none" }}
          />
          <button style={{ ...s.btnRed, opacity: loading ? .7 : 1 }} onClick={() => startCheckout()} disabled={loading}>
            {loading ? "Redirection…" : "Commencer →"}
          </button>
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Code parrainage (optionnel)"
              value={refCode}
              onChange={e => checkRefCode(e.target.value.toUpperCase())}
              maxLength={12}
              style={{ padding: "10px 36px 10px 14px", borderRadius: 10, border: `1.5px solid ${refValid === true ? "#4ade80" : refValid === false ? "#E85C3A" : "#ddd"}`, background: "#fff", color: DARK, fontSize: 13, width: 220, outline: "none", fontFamily: "monospace", letterSpacing: 2 }}
            />
            {refValid === true && <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#4ade80", fontSize: 16 }}>✓</span>}
            {refValid === false && <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: RED, fontSize: 14 }}>✗</span>}
          </div>
        </div>
        {refValid === true && <p style={{ color: "#4ade80", fontSize: 13, marginTop: 8, fontWeight: 600 }}>Code valide — 30 jours offerts !</p>}
        <p style={{ color: "#AAA8A4", fontSize: 13, marginTop: 10 }}>9€/mois · Annulable à tout moment · Aucun engagement</p>
      </div>

      {/* STATS BAR */}
      <div className="stats-bar" style={{ background: DARK, padding: "20px 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
          {[["2 000+", "séries générées"], ["50+", "créateurs actifs"], ["< 5 min", "par série complète"], ["8 langues", "de traduction"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 900, color: RED, lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MOCK PHONE */}
      <div className="mock-phone section" style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 40px" }}>
        <div style={{ maxWidth: 320, margin: "0 auto", background: DARK, borderRadius: 40, border: "6px solid #DDD8D0", padding: "28px 16px", boxShadow: "0 40px 80px rgba(0,0,0,.5)" }}>
          <div style={{ width: 80, height: 6, background: "#DDD8D0", borderRadius: 10, margin: "0 auto 20px" }} />
          {[
            { text: "⚡ HOOK — 3 PREMIÈRES SECONDES", style: { fontSize: 9, fontWeight: 800, color: RED, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace" } },
            { text: "MAYA", style: { fontSize: 10, fontWeight: 800, color: RED, letterSpacing: 2, textTransform: "uppercase" } },
            { text: "Si vous regardez ça... c'est que j'ai pas réussi.", style: { fontSize: 13, fontWeight: 500, color: "#1A1A18" } },
            { text: "[9:16] Gros plan face caméra, yeux dans l'objectif", style: { fontSize: 10, color: "#E8E4DC" } },
            { text: "LUCA", style: { fontSize: 10, fontWeight: 800, color: RED, letterSpacing: 2, textTransform: "uppercase" } },
            { text: "Tu as réussi. Regarde ce que j'ai trouvé.", style: { fontSize: 13, fontWeight: 500, color: "#1A1A18" } },
            { text: "[9:16] Insert téléphone, notification qui clignote", style: { fontSize: 10, color: "#E8E4DC" } },
            { text: "🎬 CLIFFHANGER", style: { fontSize: 9, fontWeight: 800, color: RED, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace" } },
            { text: "L'écran s'allume. ACCESS GRANTED.", style: { fontSize: 13, fontWeight: 700, color: "#1A1A18" } },
          ].map((l, i) => <p key={i} style={{ ...l.style, marginBottom: 8, lineHeight: 1.5 }}>{l.text}</p>)}
        </div>
      </div>

      {/* COMMENT ÇA MARCHE */}
      <div style={{ background: LIGHT, padding: "80px 40px" }} className="section">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 34, fontWeight: 900, textAlign: "center", marginBottom: 12 }}>Comment ça marche</h2>
          <p style={{ textAlign: "center", color: GRAY, marginBottom: 56, fontSize: 16 }}>De zéro à une série complète en 3 étapes</p>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {[
              { step: "01", icon: "🎲", title: "Configure le Mixeur", desc: "Choisis ton casting, ton univers et ton secret central — ou utilise un pack thématique en 1 clic. 12 univers, 16 secrets disponibles." },
              { step: "02", icon: "📖", title: "La bible se génère en live", desc: "Titre viral, logline, personnages et séquencier complet apparaissent en temps réel. Les épisodes arrivent en parallèle automatiquement." },
              { step: "03", icon: "📱", title: "Tourne avec le script", desc: "Ouvre un épisode, génère le script en 10s. Mode Tournage avec téléprompteur, fond clair/sombre, vitesse réglable. Prêt à filmer." },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: RED, letterSpacing: 2 }}>{step}</span>
                  <span style={{ fontSize: 28 }}>{icon}</span>
                </div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                <p style={{ color: GRAY, lineHeight: 1.65, fontSize: 14 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ background: DARK, padding: "80px 40px" }} className="section">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 34, fontWeight: 900, textAlign: "center", marginBottom: 12, color: "#fff" }}>Le pipeline créatif complet</h2>
          <p style={{ textAlign: "center", color: "#888", marginBottom: 48, fontSize: 15 }}>Tout ce qu'il faut du concept au tournage</p>
          <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { icon: "🎲", title: "Le Mixeur", desc: "12 univers, 16 secrets, 4 castings. Ou entre le tien. 12 packs thématiques pour démarrer en 1 clic." },
              { icon: "📖", title: "Bible express", desc: "Titre, logline, personnages avec secrets, tension centrale. Généré en streaming — tu vois la série prendre vie." },
              { icon: "🎬", title: "Scripts prêts à tourner", desc: "Hook 3 secondes, dialogues, jeu d'acteur, cadrage 9:16. Fast Drama ou Premium Suspense selon ton style." },
              { icon: "🎲", title: "3 variations par script", desc: "Intense, Subtil ou Rapide — 3 versions générées en parallèle pour choisir le ton parfait. Premium uniquement." },
              { icon: "🌍", title: "Traduction en 8 langues", desc: "Traduis n'importe quel script en Anglais, Espagnol, Allemand, Portugais, Italien, Arabe, Hébreu ou Chinois en un clic." },
              { icon: "🎬", title: "Fiche technique Prod", desc: "Décors, costumes, lieux de tournage générés par l'IA pour chaque série. Tourne pro avec un smartphone." },
              { icon: "📱", title: "Mode Tournage", desc: "Téléprompteur auto-scroll, fond clair ou sombre, vitesse réglable, barre de progression. Rien à imprimer." },
              { icon: "🔥", title: "Titres viraux", desc: "5 titres alternatifs avec score de viralité, accroche et analyse. Pour maximiser tes clics. Premium uniquement." },
              { icon: "☁️", title: "Sauvegarde cloud", desc: "Tes séries synchronisées sur tous tes appareils automatiquement. Accès depuis n'importe où." },
            ].map((f, i) => (
              <div key={i} style={{ background: "#fff", borderLeft: `4px solid ${RED}`, borderRadius: 16, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.25)" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 700, marginBottom: 8, color: DARK }}>{f.title}</h3>
                <p style={{ color: GRAY, lineHeight: 1.65, fontSize: 13 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ background: "#fff", padding: "80px 40px" }} className="section">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 34, fontWeight: 900, textAlign: "center", marginBottom: 48 }}>Ils créent déjà avec Studio Vertical</h2>
          <div className="testi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: LIGHT, borderRadius: 20, padding: 28 }}>
                <p style={{ fontSize: 13, color: RED, fontWeight: 800, marginBottom: 16, letterSpacing: 1 }}>{"★★★★★"}</p>
                <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 20, color: DARK }}>« {t.text} »</p>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: GRAY }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EXEMPLES */}
      <div style={{ background: LIGHT, padding: "80px 40px" }} className="section">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 34, fontWeight: 900, textAlign: "center", marginBottom: 8 }}>Vois ce que ça donne</h2>
          <p style={{ textAlign: "center", color: GRAY, marginBottom: 48, fontSize: 16 }}>Des séries générées en moins de 5 minutes — prêtes à tourner</p>
          <div className="testi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { genre: "Revenge Story", titre: "Le Contrat", logline: "Une stagiaire découvre que son patron l'a ruinée. Elle a 30 jours pour tout récupérer.", eps: 10, mode: "⚡ Fast Drama" },
              { genre: "Premium Suspense", titre: "Chambre 412", logline: "Deux inconnus bloqués dans un hôtel pendant une tempête. L'un d'eux est un meurtrier.", eps: 20, mode: "🎭 Premium" },
              { genre: "Teen Drama", titre: "Hors Cadre", logline: "Une lycéenne filme tout en secret. Jusqu'au jour où elle capte quelque chose qu'elle n'aurait pas dû voir.", eps: 10, mode: "⚡ Fast Drama" },
            ].map((ex, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,.06)", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: RED, letterSpacing: 1.5, textTransform: "uppercase" }}>{ex.genre}</span>
                  <span style={{ fontSize: 11, color: GRAY, fontWeight: 600 }}>{ex.eps} éps.</span>
                </div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 900, color: DARK, margin: 0 }}>{ex.titre}</h3>
                <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.6, margin: 0 }}>{ex.logline}</p>
                <div style={{ marginTop: "auto", paddingTop: 8, borderTop: "1px solid #E8E4DC", fontSize: 12, color: GRAY, fontWeight: 600 }}>{ex.mode}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a href="/exemples" style={{ display: "inline-block", background: DARK, color: "#fff", padding: "16px 36px", borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: "none", letterSpacing: -0.3 }}>
              Voir tous les exemples →
            </a>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div style={{ background: LIGHT, padding: "80px 40px" }} className="section">
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 34, fontWeight: 900, textAlign: "center", marginBottom: 8 }}>Choisissez votre plan</h2>
          <p style={{ textAlign: "center", color: GRAY, marginBottom: 36, fontSize: 15 }}>Annulable à tout moment · Sans engagement</p>
          <input type="email" placeholder="ton@email.com" value={email} onChange={e => setEmail(e.target.value)}
            className="pricing-input"
            style={{ width: "100%", maxWidth: 400, display: "block", margin: "0 auto 32px", padding: "14px 18px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", color: DARK, fontSize: 15, outline: "none" }} />
          <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {/* Standard */}
            <div style={{ background: DARK, borderRadius: 24, padding: "36px 32px" }}>
              <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: "#888", textTransform: "uppercase", marginBottom: 8 }}>Standard</p>
              <div style={{ fontFamily: "var(--serif)", fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1 }}>9€</div>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 28, marginTop: 4 }}>/mois</p>
              <div style={{ marginBottom: 28 }}>
                {["⚡ Fast Drama uniquement", "10 épisodes par série", "Scripts 1 à 2 min", "Mode Tournage + Téléprompteur", "🌍 Traduction en 8 langues", "☁️ Sauvegarde cloud", "📄 Export PDF"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Check />
                    <span style={{ color: "#ddd", fontSize: 14 }}>{item}</span>
                  </div>
                ))}
              </div>
              <button style={{ ...s.btnRed, width: "100%", fontSize: 15, padding: 16 }} onClick={() => startCheckout("standard")} disabled={loading}>
                {loading ? "Redirection…" : "Commencer →"}
              </button>
            </div>
            {/* Premium */}
            <div style={{ background: DARK, border: `2px solid ${RED}`, borderRadius: 24, padding: "36px 32px", position: "relative" }}>
              <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: RED, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 14px", borderRadius: 20, letterSpacing: 1, whiteSpace: "nowrap" }}>⭐ RECOMMANDÉ</div>
              <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: RED, textTransform: "uppercase", marginBottom: 8 }}>Premium</p>
              <div style={{ fontFamily: "var(--serif)", fontSize: 52, fontWeight: 900, color: RED, lineHeight: 1 }}>19€</div>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 28, marginTop: 4 }}>/mois</p>
              <div style={{ marginBottom: 28 }}>
                {["⚡ Fast Drama + 🎭 Premium Suspense", "Jusqu'à 90 épisodes par série", "Scripts 1 à 2 min", "Mode Tournage + Téléprompteur", "🎲 3 variations par script", "🔥 Générateur de titres viraux", "🌍 Traduction en 8 langues", "🎬 Fiche technique de production", "☁️ Sauvegarde cloud", "📄 Export PDF"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Check color={RED} />
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
      </div>

      {/* FAQ */}
      <div style={{ background: "#fff", padding: "80px 40px" }} className="section">
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 34, fontWeight: 900, textAlign: "center", marginBottom: 48 }}>Questions fréquentes</h2>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} style={{ borderBottom: "1px solid #E8E4DC", marginBottom: 0 }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--sans)" }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: DARK, paddingRight: 16 }}>{item.q}</span>
                <span style={{ color: RED, fontSize: 20, flexShrink: 0, transition: "transform .2s", display: "inline-block", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              {openFaq === i && (
                <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.75, paddingBottom: 20, marginTop: -4 }}>{item.r}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{ background: DARK, padding: "80px 40px", textAlign: "center" }} className="section">
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: "#fff", marginBottom: 20, letterSpacing: -1 }}>
          Ta première série,<br />dans <span style={{ color: RED }}>5 minutes</span>.
        </h2>
        <p style={{ color: "#888", fontSize: 16, marginBottom: 40 }}>Rejoins les créateurs qui produisent plus vite avec l'IA.</p>
        <div className="hero-input-row" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <input type="email" placeholder="ton@email.com" value={email} onChange={e => setEmail(e.target.value)}
            style={{ padding: "16px 20px", borderRadius: 12, border: "none", background: "#fff", color: DARK, fontSize: 15, width: 240, outline: "none" }} />
          <button style={{ ...s.btnRed, opacity: loading ? .7 : 1 }} onClick={() => startCheckout()} disabled={loading}>
            {loading ? "Redirection…" : "Commencer →"}
          </button>
        </div>
        <p style={{ color: "#555", fontSize: 13, marginTop: 16 }}>9€/mois · Annulable à tout moment</p>
      </div>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div className="footer-inner" style={{ padding: "32px 40px" }}>
        <Logo />
        <p style={{ marginTop: 16 }}>
          © 2026 Studio Vertical · Tous droits réservés ·{" "}
          <a href="mailto:hello@studiovertical.app" style={{ color: "#666" }}>Contact</a> ·{" "}
          <a href="/cgu" style={{ color: "#666" }}>CGU</a> ·{" "}
          <a href="/confidentialite" style={{ color: "#666" }}>Confidentialité</a>
        </p>
        </div>
      </footer>
    </div>
  );
}

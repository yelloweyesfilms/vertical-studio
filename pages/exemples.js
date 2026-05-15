import { useState } from "react";
import { useRouter } from "next/router";

const RED = "#E85C3A";
const VIO = "#a855f7";
const DARK = "#09090f";
const SURFACE = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#f1f5f9";
const MUTED = "#64748b";

const SERIES = [
  {
    mode: "fast",
    platform: "TikTok",
    mixeurParams: { mode: "fast", casting: "1 Femme + 1 Homme", univers: "Hôpital privé", secret: "Double vie", lieu: "Couloir vide" },
    bible: {
      titre: "Le Mensonge",
      logline: "Une infirmière cache une erreur médicale jusqu'au jour où la victime revient comme interne.",
      pitch: "À l'hôpital Saint-Luc, personne ne sait que la meilleure infirmière a commis l'irréparable. Quand le patient qu'elle a blessé revient en blouse blanche, chaque couloir devient un piège. Jusqu'où ira-t-elle pour protéger sa vie ?",
      tension_centrale: "Va-t-elle avouer avant qu'il ne découvre tout seul ?",
      accroche: "Elle l'a presque tué. Il ne sait pas encore.",
      personnages: [
        { nom: "Clara", age: 34, role: "Infirmière cheffe", secret: "A falsifié un dossier médical après une erreur de dosage" },
        { nom: "Julien", age: 28, role: "Interne en médecine", secret: "Est le patient qu'elle a blessé 3 ans plus tôt" },
      ],
    },
    episodes: [
      { numero: 1, titre: "Première garde", cliffhanger: "Julien ouvre le dossier 2021...", tension: 3 },
      { numero: 2, titre: "Il sait", cliffhanger: "Clara trouve son téléphone déverrouillé sur son propre dossier.", tension: 6 },
      { numero: 3, titre: "Le chef de service", cliffhanger: "Le directeur convoque Clara. Et Julien est déjà dans son bureau.", tension: 8 },
      { numero: 4, titre: "Trop tard", cliffhanger: "Clara signe sa démission — mais Julien déchire la feuille.", tension: 10 },
    ],
    script: {
      hook_scene: {
        texte: "Clara tient le dossier. Ses mains tremblent. Le nom sur la couverture : JULIEN MOREAU.",
        visuel_916: "Gros plan mains crispées sur dossier, bague qui claque contre le carton",
      },
      scenes: [
        { perso: "JULIEN", dialogue: "Infirmière Bertin. On se connaît ?", jeu: "sourire innocent, regard qui cherche", visuel_916: "Plan américain, couloir désert derrière lui" },
        { perso: "CLARA", dialogue: "Non. Bienvenue dans le service.", jeu: "voix trop calme, yeux qui fuient", visuel_916: "Contre-champ serré, elle tourne le dos" },
        { perso: "JULIEN", dialogue: "Bizarre. J'ai l'impression qu'on s'est déjà vus.", jeu: "penche la tête, observe", visuel_916: "Zoom lent sur son visage" },
        { perso: "CLARA", dialogue: "On voit beaucoup de monde ici.", jeu: "force un sourire, repart vite", visuel_916: "Plan large, elle s'éloigne dans le couloir" },
      ],
      cliffhanger_scene: {
        texte: "Clara referme la porte de la réserve. Julien est de l'autre côté — il tient un dossier de 2021.",
        visuel_916: "Cut brutal profil Clara, porte qui se ferme, silence",
        label: "Il sait ?",
      },
    },
  },
  {
    mode: "premium",
    platform: "Reels",
    mixeurParams: { mode: "premium", casting: "1 Femme + 1 Homme", univers: "Finance internationale", secret: "Complot financier", lieu: "Cabinet privé" },
    bible: {
      titre: "Héritage",
      logline: "Un directeur financier cache un détournement jusqu'au jour où sa propre fille rejoint le cabinet d'audit.",
      pitch: "Dans les hauteurs de la finance parisienne, Marc Delorme a tout construit sur un mensonge. Quand Chloé, sa fille, débarque comme auditrice mandatée par le conseil, le silence entre eux devient plus dangereux que les chiffres. Qui trahira l'autre en premier ?",
      tension_centrale: "Va-t-elle sacrifier son père pour sa carrière ?",
      accroche: "Il a volé pour elle. Elle est là pour le trouver.",
      personnages: [
        { nom: "Marc", age: 52, role: "Directeur financier", secret: "Détourne 2M€ depuis 4 ans pour payer les études de sa fille" },
        { nom: "Chloé", age: 26, role: "Auditrice externe", secret: "Sait depuis 6 mois — et n'a rien dit" },
      ],
    },
    episodes: [
      { numero: 1, titre: "L'auditrice", cliffhanger: "Marc reconnaît l'écriture dans le rapport. C'est la sienne.", tension: 4 },
      { numero: 2, titre: "Le silence", cliffhanger: "Chloé laisse volontairement une page blanche dans son rapport.", tension: 6 },
      { numero: 3, titre: "Le conseil", cliffhanger: "Marc comprend : elle le protège. Mais pourquoi maintenant ?", tension: 8 },
      { numero: 4, titre: "La vérité", cliffhanger: "Chloé pose sa démission sur le bureau. Et une clé USB.", tension: 10 },
    ],
    script: {
      hook_scene: {
        texte: "Chloé entre dans le bureau. Marc se lève. Ils ne se sont pas vus depuis Noël. Elle pose son badge d'auditrice sur son bureau.",
        visuel_916: "Plan séquence lent, badge qui glisse sur le bois, leurs mains qui ne se touchent pas",
      },
      scenes: [
        { perso: "MARC", dialogue: "Tu aurais pu me prévenir.", jeu: "voix basse, mâchoire serrée", visuel_916: "Gros plan profil, regard vers la fenêtre" },
        { perso: "CHLOÉ", dialogue: "C'est exactement pour ça que je ne l'ai pas fait.", jeu: "calme absolu, ouvre son ordinateur", visuel_916: "Plan poitrine, doigts sur clavier" },
        { perso: "MARC", dialogue: "Tu sais ce que tu fais ?", jeu: "s'approche, baisse la voix", visuel_916: "Deux shot serré, très peu d'espace entre eux" },
        { perso: "CHLOÉ", dialogue: "Mon travail.", jeu: "lève les yeux, soutient son regard", visuel_916: "Contre-plongée légère sur elle" },
      ],
      cliffhanger_scene: {
        texte: "Chloé fait défiler les colonnes. Elle s'arrête. Ligne 47. Le virement porte la date de son inscription en master.",
        visuel_916: "Insert écran, curseur qui s'immobilise, reflet de Chloé dans le moniteur",
        label: "Elle savait.",
      },
    },
  },
  {
    mode: "fast",
    platform: "Shorts",
    mixeurParams: { mode: "fast", casting: "1 Femme + 1 Homme", univers: "Famille recomposée", secret: "Double vie", lieu: "Salle d'attente" },
    bible: {
      titre: "Deux Vies",
      logline: "Une mère de famille cache une double vie jusqu'au jour où son fils trouve son second téléphone.",
      pitch: "En apparence, Sophie est la mère parfaite. Mais depuis 2 ans, elle mène une autre vie le mercredi soir. Quand Lucas, 19 ans, trouve le téléphone qu'elle croyait bien caché, il doit choisir : protéger sa mère ou la vérité.",
      tension_centrale: "Va-t-il parler à son père avant qu'elle ne lui avoue ?",
      accroche: "Mercredi soir, elle ment. Il l'a su ce matin.",
      personnages: [
        { nom: "Sophie", age: 43, role: "Mère / Directrice RH", secret: "Mène une seconde vie comme entrepreneuse sous fausse identité" },
        { nom: "Lucas", age: 19, role: "Fils étudiant", secret: "A lu tous ses messages — depuis 3 semaines" },
      ],
    },
    episodes: [
      { numero: 1, titre: "Le téléphone", cliffhanger: "Lucas répond à un message à la place de sa mère.", tension: 4 },
      { numero: 2, titre: "Mercredi", cliffhanger: "Sophie rentre à 23h. Lucas l'attend dans le noir.", tension: 6 },
      { numero: 3, titre: "La question", cliffhanger: "Lucas demande : 'C'est qui Emma ?' Sophie pâlit.", tension: 8 },
      { numero: 4, titre: "Tout dire", cliffhanger: "Sophie avoue tout. Lucas sort son propre téléphone — il a tout enregistré.", tension: 10 },
    ],
    script: {
      hook_scene: {
        texte: "Le téléphone vibre sous le coussin du canapé. Lucas le retourne. Le contact s'appelle 'Emma'. Photo : sa mère, cheveux courts.",
        visuel_916: "Gros plan écran qui s'allume, visage de Lucas dans le reflet",
      },
      scenes: [
        { perso: "LUCAS", dialogue: "Maman, t'as oublié quelque chose.", jeu: "voix neutre, téléphone dans le dos", visuel_916: "Plan taille, couloir d'entrée" },
        { perso: "SOPHIE", dialogue: "Je rentrais juste chercher mes clés.", jeu: "pose son manteau, ne regarde pas", visuel_916: "Plan américain, elle de dos" },
        { perso: "LUCAS", dialogue: "Emma t'a envoyé quelque chose.", jeu: "sort le téléphone lentement", visuel_916: "Insert main qui tend le téléphone" },
        { perso: "SOPHIE", dialogue: "...", jeu: "se fige, se retourne très lentement", visuel_916: "Zoom lent sur son visage" },
      ],
      cliffhanger_scene: {
        texte: "Sophie tend la main pour prendre le téléphone. Lucas le referme. Il ne le lâche pas.",
        visuel_916: "Deux mains sur le téléphone, plan serré, ni l'un ni l'autre ne cède",
        label: "Il veut quoi ?",
      },
    },
  },
];

const PLATFORM_COLORS = { TikTok: "#69C9D0", Reels: VIO, Shorts: RED };
const PLATFORM_ICONS = { TikTok: "♪", Reels: "◈", Shorts: "▶" };

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

function TensionBar({ t = 0 }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[...Array(10)].map((_, i) => (
        <div key={i} style={{
          width: 5, height: 5, borderRadius: "50%",
          background: i < t
            ? `linear-gradient(135deg, ${RED}, ${VIO})`
            : BORDER,
          transition: "background .2s",
        }} />
      ))}
    </div>
  );
}

function ModeBadge({ mode }) {
  return (
    <span style={{
      display: "inline-block", padding: "4px 12px", borderRadius: 6,
      background: mode === "fast" ? "rgba(232,92,58,0.12)" : "rgba(168,85,247,0.12)",
      border: `1px solid ${mode === "fast" ? "rgba(232,92,58,0.25)" : "rgba(168,85,247,0.25)"}`,
      color: mode === "fast" ? RED : VIO,
      fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase",
    }}>
      {mode === "fast" ? "⚡ Fast Drama" : "🎭 Premium Suspense"}
    </span>
  );
}

function PlatformBadge({ platform }) {
  const color = PLATFORM_COLORS[platform] || MUTED;
  const icon = PLATFORM_ICONS[platform] || "▶";
  return (
    <span style={{
      display: "inline-block", padding: "4px 12px", borderRadius: 6,
      background: `${color}18`,
      border: `1px solid ${color}30`,
      color, fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase",
    }}>
      {icon} {platform}
    </span>
  );
}

function SerieCard({ serie }) {
  const { bible, episodes, script, mode, platform, mixeurParams } = serie;
  const [showScript, setShowScript] = useState(false);
  const router = useRouter();

  const handleGenerate = () => {
    try { sessionStorage.setItem("vs_preset", JSON.stringify(mixeurParams)); } catch {}
    router.push("/app");
  };

  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 24, overflow: "hidden", marginBottom: 28, backdropFilter: "blur(12px)" }}>
      {/* Header */}
      <div style={{ padding: "28px 32px", borderBottom: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${mode === "fast" ? RED : VIO}, transparent)` }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, background: `radial-gradient(circle, ${mode === "fast" ? "rgba(232,92,58,0.06)" : "rgba(168,85,247,0.06)"} 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <ModeBadge mode={mode} />
          <PlatformBadge platform={platform} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, color: TEXT, letterSpacing: -1, marginBottom: 8, lineHeight: 1.1 }}>
          {bible.titre}
        </h2>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontStyle: "italic", color: MUTED, lineHeight: 1.6, marginBottom: 16 }}>
          « {bible.logline} »
        </p>
        <div style={{ display: "inline-block", background: "rgba(232,92,58,0.1)", border: "1px solid rgba(232,92,58,0.2)", borderRadius: 10, padding: "10px 16px" }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: RED, marginBottom: 4 }}>Hook TikTok</p>
          <p style={{ fontSize: 14, color: TEXT, fontWeight: 700 }}>{bible.accroche}</p>
        </div>
      </div>

      <div style={{ padding: "28px 32px" }}>
        {/* Pitch */}
        <p style={{ fontSize: 14, lineHeight: 1.75, color: MUTED, marginBottom: 28 }}>{bible.pitch}</p>

        {/* Characters */}
        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: MUTED, marginBottom: 12 }}>Personnages</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 28 }}>
          {bible.personnages.map((p, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px", borderLeft: `3px solid ${i === 0 ? RED : VIO}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: TEXT }}>{p.nom}</span>
                <span style={{ fontSize: 11, color: i === 0 ? RED : VIO, fontWeight: 700 }}>{p.age} ans</span>
              </div>
              <p style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>{p.role}</p>
              <p style={{ fontSize: 12, color: TEXT, opacity: 0.7 }}>🔒 {p.secret}</p>
            </div>
          ))}
        </div>

        {/* Tension centrale */}
        <div style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.15)", borderRadius: 14, padding: "14px 18px", marginBottom: 28 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: VIO, marginBottom: 6 }}>Question centrale</p>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontStyle: "italic", color: TEXT }}>« {bible.tension_centrale} »</p>
        </div>

        {/* Episodes */}
        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: MUTED, marginBottom: 12 }}>{episodes.length} épisodes</p>
        <div style={{ marginBottom: 28 }}>
          {episodes.map((ep, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, marginBottom: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${RED}, ${VIO})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, fontWeight: 900, color: "#fff" }}>{ep.numero}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 6 }}>{ep.titre}</p>
                <TensionBar t={ep.tension} />
                <p style={{ fontSize: 12, color: MUTED, marginTop: 6, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>🎬 {ep.cliffhanger}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA — Générer une série similaire */}
        <button
          onClick={handleGenerate}
          style={{
            width: "100%", padding: "15px 20px", borderRadius: 14, fontSize: 14, fontWeight: 700,
            background: `linear-gradient(135deg, ${mode === "fast" ? RED : VIO}, ${mode === "fast" ? "rgba(232,92,58,0.7)" : "rgba(168,85,247,0.7)"})`,
            border: "none", color: "#fff", cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
            boxShadow: `0 0 24px ${mode === "fast" ? "rgba(232,92,58,0.3)" : "rgba(168,85,247,0.3)"}`,
            marginBottom: 12, letterSpacing: -0.3,
          }}>
          ✦ Générer une série similaire →
        </button>

        {/* Script toggle */}
        <button
          onClick={() => setShowScript(s => !s)}
          style={{
            width: "100%", padding: "14px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700,
            background: showScript ? "rgba(232,92,58,0.1)" : SURFACE,
            border: `1px solid ${showScript ? "rgba(232,92,58,0.3)" : BORDER}`,
            color: showScript ? RED : TEXT,
            cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
            transition: "all .2s", marginBottom: showScript ? 20 : 0,
          }}>
          {showScript ? "Masquer le script ↑" : "📝 Voir le script de l'épisode 1 →"}
        </button>

        {showScript && (
          <div>
            {/* Hook */}
            <div style={{ background: "rgba(232,92,58,0.06)", border: `1px solid rgba(232,92,58,0.2)`, borderRadius: 16, padding: 20, marginBottom: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: RED, marginBottom: 10 }}>⚡ Hook — 3 premières secondes</p>
              <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5, color: TEXT, marginBottom: 10 }}>{script.hook_scene.texte}</p>
              <p style={{ fontSize: 12, color: RED, fontStyle: "italic" }}>[9:16] {script.hook_scene.visuel_916}</p>
            </div>

            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: MUTED, marginBottom: 10 }}>Script · {script.scenes.length} répliques</p>
            {script.scenes.map((sc, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16, borderLeft: `3px solid ${BORDER}`, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: VIO }}>{sc.perso}</p>
                  {sc.jeu && <span style={{ fontSize: 10, background: "rgba(168,85,247,0.1)", color: VIO, padding: "2px 10px", borderRadius: 20, fontStyle: "italic" }}>{sc.jeu}</span>}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: TEXT, marginBottom: 8, fontWeight: 500 }}>{sc.dialogue}</p>
                <p style={{ fontSize: 12, color: MUTED, fontStyle: "italic" }}>[9:16] {sc.visuel_916}</p>
              </div>
            ))}

            {/* Cliffhanger */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(232,92,58,0.2)`, borderRadius: 16, padding: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${RED}, ${VIO})` }} />
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: RED, marginBottom: 10 }}>🎬 Cliffhanger</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 10, lineHeight: 1.5 }}>{script.cliffhanger_scene.texte}</p>
              <p style={{ fontSize: 12, color: RED, fontStyle: "italic", marginBottom: 14 }}>[9:16] {script.cliffhanger_scene.visuel_916}</p>
              <span style={{ display: "inline-block", background: `linear-gradient(135deg, ${RED}, ${VIO})`, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: 1, textTransform: "uppercase" }}>
                {script.cliffhanger_scene.label}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Exemples() {
  return (
    <div style={{ minHeight: "100vh", background: DARK, color: TEXT, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        button { cursor: pointer; -webkit-tap-highlight-color: transparent; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        @media (max-width: 640px) {
          .examples-grid { padding: 20px 16px !important; }
          .hero-examples { padding: 48px 20px 40px !important; }
          nav { padding: 12px 16px !important; }
        }
      `}</style>

      {/* NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: `1px solid ${BORDER}`, background: "rgba(9,9,15,0.85)", backdropFilter: "blur(20px)" }}>
        <nav style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/"><Logo /></a>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, color: RED, letterSpacing: 2 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: RED, animation: "pulse 1.5s infinite" }} />
            REC
          </div>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `linear-gradient(135deg, ${RED}, ${VIO})`, color: "#fff", padding: "10px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700, boxShadow: `0 0 24px rgba(232,92,58,0.3)`, letterSpacing: -0.3 }}>
            Créer ma série →
          </a>
        </nav>
      </div>

      {/* HERO */}
      <div style={{ padding: "80px 40px 56px", textAlign: "center", position: "relative", overflow: "hidden" }} className="hero-examples">
        <div style={{ position: "absolute", top: 0, left: "20%", width: 400, height: 400, background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 60, right: "15%", width: 300, height: 300, background: "radial-gradient(circle, rgba(232,92,58,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Platform badges */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
            {[
              { name: "TikTok", color: "#69C9D0", icon: "♪" },
              { name: "Instagram Reels", color: VIO, icon: "◈" },
              { name: "YouTube Shorts", color: RED, icon: "▶" },
            ].map(({ name, color, icon }) => (
              <span key={name} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, background: `${color}12`, border: `1px solid ${color}25`, color, fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
                {icon} {name}
              </span>
            ))}
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: TEXT, letterSpacing: -2, lineHeight: 1.05, marginBottom: 20 }}>
            Ce que l'IA crée<br />
            <span style={{ background: `linear-gradient(135deg, ${RED} 30%, ${VIO})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>
              en 5 minutes
            </span>
            .
          </h1>

          <p style={{ fontSize: 16, color: MUTED, maxWidth: 440, margin: "0 auto 0", lineHeight: 1.65 }}>
            Bible complète, séquencier, scripts 9:16 tournables. 3 séries générées pour TikTok, Reels et Shorts.
          </p>
        </div>
      </div>

      {/* SERIES */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 32px" }} className="examples-grid">
        {SERIES.map((serie, i) => (
          <SerieCard key={i} serie={serie} />
        ))}

        {/* CTA */}
        <div style={{ borderRadius: 28, padding: "56px 40px", textAlign: "center", position: "relative", overflow: "hidden", background: SURFACE, border: `1px solid ${BORDER}` }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(168,85,247,0.07) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: VIO, marginBottom: 20 }}>Prêt à tourner ?</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 900, color: TEXT, letterSpacing: -1.5, marginBottom: 16, lineHeight: 1.1 }}>
              Ta première série,<br />
              <span style={{ background: `linear-gradient(135deg, ${RED}, ${VIO})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>
                dans 5 minutes
              </span>
              .
            </h2>
            <p style={{ color: MUTED, fontSize: 15, marginBottom: 36, lineHeight: 1.6 }}>
              Bible, épisodes, scripts 9:16, mode tournage, traduction en 8 langues.
            </p>
            <a href="/" style={{
              display: "inline-block", background: `linear-gradient(135deg, ${RED}, ${VIO})`, color: "#fff",
              padding: "16px 40px", borderRadius: 16, fontSize: 16, fontWeight: 700,
              boxShadow: `0 0 40px rgba(168,85,247,0.3), 0 0 20px rgba(232,92,58,0.2)`,
              letterSpacing: -0.3,
            }}>
              Commencer — 9€/mois →
            </a>
            <p style={{ color: MUTED, fontSize: 13, marginTop: 14 }}>Annulable à tout moment · Sans engagement</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "32px 40px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Logo size="sm" />
        </div>
        <p style={{ color: MUTED, fontSize: 13 }}>
          © 2026 Studio Vertical ·{" "}
          <a href="/" style={{ color: MUTED }}>Accueil</a> ·{" "}
          <a href="mailto:hello@studiovertical.app" style={{ color: MUTED }}>Contact</a>
        </p>
      </footer>
    </div>
  );
}

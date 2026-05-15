import { useState } from "react";

const RED = "#E85C3A";
const DARK = "#1A1A18";
const GRAY = "#6B6B68";
const LIGHT = "#F7F4EF";

const SERIES = [
  {
    mode: "fast",
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
        texte: "Clara tient le dossier. Ses mains tremblent. Le nom sur la couverture : JULIEN MOREAU.",
        visuel_916: "Gros plan mains crispées sur dossier, bague qui claque contre le carton",
      },
      scenes: [
        { perso: "JULIEN", dialogue: "Infirmière Bertin. On se connaît ?", jeu: "sourire innocent, regard qui cherche", visuel_916: "Plan américain, couloir désert derrière lui" },
        { perso: "CLARA", dialogue: "Non. Bienvenue dans le service.", jeu: "voix trop calme, yeux qui fuient", visuel_916: "Contre-champ serré, elle tourne le dos" },
        { perso: "JULIEN", dialogue: "Bizarre. J'ai l'impression qu'on s'est déjà vus.", jeu: "penche la tête, observe", visuel_916: "Zoom lent sur son visage" },
        { perso: "CLARA", dialogue: "On voit beaucoup de monde ici.", jeu: "force un sourire, repart vite", visuel_916: "Plan large, elle s'éloigne dans le couloir" },
      ],
      cliffhanger_scene: {
        texte: "Clara referme la porte de la réserve. Julien est de l'autre côté — il tient un dossier de 2021.",
        visuel_916: "Cut brutal profil Clara, porte qui se ferme, silence",
        label: "Il sait ?",
      },
    },
  },
  {
    mode: "premium",
    bible: {
      titre: "Héritage",
      logline: "Un directeur financier cache un détournement jusqu'au jour où sa propre fille rejoint le cabinet d'audit.",
      pitch: "Dans les hauteurs de la finance parisienne, Marc Delorme a tout construit sur un mensonge. Quand Chloé, sa fille, débarque comme auditrice mandatée par le conseil, le silence entre eux devient plus dangereux que les chiffres. Qui trahira l'autre en premier ?",
      tension_centrale: "Va-t-elle sacrifier son père pour sa carrière ?",
      accroche: "Il a volé pour elle. Elle est là pour le trouver.",
      personnages: [
        { nom: "Marc", age: 52, role: "Directeur financier", secret: "Détourne 2M€ depuis 4 ans pour payer les études de sa fille" },
        { nom: "Chloé", age: 26, role: "Auditrice externe", secret: "Sait depuis 6 mois — et n'a rien dit" },
      ],
    },
    episodes: [
      { numero: 1, titre: "L'auditrice", cliffhanger: "Marc reconnaît l'écriture dans le rapport. C'est la sienne.", tension: 4 },
      { numero: 2, titre: "Le silence", cliffhanger: "Chloé laisse volontairement une page blanche dans son rapport.", tension: 6 },
      { numero: 3, titre: "Le conseil", cliffhanger: "Marc comprend : elle le protège. Mais pourquoi maintenant ?", tension: 8 },
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
        { perso: "MARC", dialogue: "Tu sais ce que tu fais ?", jeu: "s'approche, baisse la voix", visuel_916: "Deux shot serré, très peu d'espace entre eux" },
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
    bible: {
      titre: "Deux Vies",
      logline: "Une mère de famille cache une double vie jusqu'au jour où son fils trouve son second téléphone.",
      pitch: "En apparence, Sophie est la mère parfaite. Mais depuis 2 ans, elle mène une autre vie le mercredi soir. Quand Lucas, 19 ans, trouve le téléphone qu'elle croyait bien caché, il doit choisir : protéger sa mère ou la vérité.",
      tension_centrale: "Va-t-il parler à son père avant qu'elle ne lui avoue ?",
      accroche: "Mercredi soir, elle ment. Il l'a su ce matin.",
      personnages: [
        { nom: "Sophie", age: 43, role: "Mère / Directrice RH", secret: "Mène une seconde vie comme entrepreneuse sous fausse identité" },
        { nom: "Lucas", age: 19, role: "Fils étudiant", secret: "A lu tous ses messages — depuis 3 semaines" },
      ],
    },
    episodes: [
      { numero: 1, titre: "Le téléphone", cliffhanger: "Lucas répond à un message à la place de sa mère.", tension: 4 },
      { numero: 2, titre: "Mercredi", cliffhanger: "Sophie rentre à 23h. Lucas l'attend dans le noir.", tension: 6 },
      { numero: 3, titre: "La question", cliffhanger: "Lucas demande : 'C'est qui Emma ?' Sophie pâlit.", tension: 8 },
      { numero: 4, titre: "Tout dire", cliffhanger: "Sophie avoue tout. Lucas sort son propre téléphone — il a tout enregistré.", tension: 10 },
    ],
    script: {
      hook_scene: {
        texte: "Le téléphone vibre sous le coussin du canapé. Lucas le retourne. Le contact s'appelle 'Emma'. Photo : sa mère, cheveux courts.",
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
        label: "Il veut quoi ?",
      },
    },
  },
];

function ModeBadge({ mode }) {
  return (
    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 6, background: mode === "fast" ? "#fff0ec" : "#e8edf2", color: mode === "fast" ? RED : "#0F2236", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
      {mode === "fast" ? "⚡ Fast Drama" : "🎭 Premium Suspense"}
    </span>
  );
}

function Dots({ t = 0 }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[...Array(10)].map((_, i) => (
        <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i < t ? RED : "#DDD8D0" }} />
      ))}
    </div>
  );
}

function SerieCard({ serie }) {
  const { bible, episodes, script, mode } = serie;
  const [showScript, setShowScript] = useState(false);

  return (
    <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,.08)", marginBottom: 32 }}>
      <div style={{ background: DARK, padding: "28px 32px" }}>
        <ModeBadge mode={mode} />
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, color: "#fff", letterSpacing: -1, marginTop: 10, marginBottom: 8 }}>{bible.titre}</h2>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontStyle: "italic", color: "#6a7a6e", lineHeight: 1.5 }}>« {bible.logline} »</p>
        <div style={{ marginTop: 20, background: "#1a2a1e", borderRadius: 12, padding: "14px 18px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: RED, marginBottom: 6 }}>Accroche TikTok</p>
          <p style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{bible.accroche}</p>
        </div>
      </div>

      <div style={{ padding: "28px 32px" }}>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: GRAY, marginBottom: 24 }}>{bible.pitch}</p>

        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: GRAY, marginBottom: 12 }}>Personnages</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 24 }}>
          {bible.personnages.map((p, i) => (
            <div key={i} style={{ background: LIGHT, borderRadius: 12, padding: 16, borderLeft: `4px solid ${i === 0 ? RED : "#0F2236"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700 }}>{p.nom}</span>
                <span style={{ fontSize: 11, color: i === 0 ? RED : "#0F2236", fontWeight: 700 }}>{p.age} ans</span>
              </div>
              <p style={{ fontSize: 12, color: GRAY, marginBottom: 4 }}>{p.role}</p>
              <p style={{ fontSize: 12, color: DARK }}>🔒 {p.secret}</p>
            </div>
          ))}
        </div>

        <div style={{ background: DARK, borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: RED, marginBottom: 6 }}>Question centrale</p>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontStyle: "italic", color: "#fff" }}>« {bible.tension_centrale} »</p>
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: GRAY, marginBottom: 12 }}>{episodes.length} épisodes</p>
        <div style={{ marginBottom: 24 }}>
          {episodes.map((ep, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: LIGHT, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: RED, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, fontWeight: 900, color: "#fff" }}>{ep.numero}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{ep.titre}</p>
                <Dots t={ep.tension} />
                <p style={{ fontSize: 12, color: GRAY, marginTop: 4, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>🎬 {ep.cliffhanger}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setShowScript(s => !s)}
          style={{ background: showScript ? DARK : "none", color: showScript ? "#fff" : DARK, border: `1.5px solid ${showScript ? DARK : "#DDD8D0"}`, padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: showScript ? 20 : 0, width: "100%" }}>
          {showScript ? "Masquer le script" : "📝 Voir le script de l'épisode 1 →"}
        </button>

        {showScript && (
          <div>
            <div style={{ background: "#fff5f2", border: `2px solid ${RED}`, borderRadius: 14, padding: 18, marginBottom: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: RED, marginBottom: 8 }}>⚡ Hook — 3 premières secondes</p>
              <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>{script.hook_scene.texte}</p>
              <p style={{ fontSize: 12, color: RED, fontStyle: "italic" }}>[9:16] {script.hook_scene.visuel_916}</p>
            </div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: GRAY, marginBottom: 10 }}>Script · {script.scenes.length} répliques</p>
            {script.scenes.map((sc, i) => (
              <div key={i} style={{ background: LIGHT, borderRadius: 12, padding: 14, borderLeft: "3px solid #DDD8D0", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#0F2236" }}>{sc.perso}</p>
                  {sc.jeu && <span style={{ fontSize: 10, background: "#e8edf2", color: "#0F2236", padding: "2px 8px", borderRadius: 20, fontStyle: "italic" }}>{sc.jeu}</span>}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 6, fontWeight: 500 }}>{sc.dialogue}</p>
                <p style={{ fontSize: 12, color: GRAY, fontStyle: "italic" }}>[9:16] {sc.visuel_916}</p>
              </div>
            ))}
            <div style={{ background: DARK, borderRadius: 14, padding: 18 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: RED, marginBottom: 8 }}>🎬 Cliffhanger</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.4 }}>{script.cliffhanger_scene.texte}</p>
              <p style={{ fontSize: 12, color: RED, fontStyle: "italic", marginBottom: 10 }}>[9:16] {script.cliffhanger_scene.visuel_916}</p>
              <span style={{ display: "inline-block", background: RED, borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: 1, textTransform: "uppercase" }}>{script.cliffhanger_scene.label}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Exemples() {
  return (
    <div style={{ minHeight: "100vh", background: LIGHT, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        button { cursor: pointer; }
        @media (max-width: 640px) {
          .examples-grid { padding: 20px 16px !important; }
          .hero-examples { padding: 48px 20px 32px !important; }
        }
      `}</style>

      <div style={{ background: "#fff", borderBottom: "1px solid #E8E4DC", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 900, letterSpacing: -0.3 }}>
            STUDIO <span style={{ color: RED }}>VERTICAL</span>
          </a>
          <a href="/" style={{ background: RED, color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700 }}>
            Créer ma série →
          </a>
        </div>
      </div>

      <div style={{ background: DARK, padding: "64px 32px 48px", textAlign: "center" }} className="hero-examples">
        <div style={{ display: "inline-block", background: "rgba(232,92,58,0.15)", border: "1px solid rgba(232,92,58,0.3)", color: RED, padding: "6px 14px", borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
          🃽 Exemples générés avec Studio Vertical
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, color: "#fff", letterSpacing: -2, lineHeight: 1.05, marginBottom: 16 }}>
          Ce que l'IA<br />peut créer <span style={{ color: RED }}>en 5 minutes</span>
        </h1>
        <p style={{ fontSize: 16, color: "#6a7a6e", maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
          Bible complète, séquencier, scripts tournables. Voici 3 séries générées avec Studio Vertical — du concept au cliffhanger.
        </p>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 32px" }} className="examples-grid">
        {SERIES.map((serie, i) => (
          <SerieCard key={i} serie={serie} />
        ))}

        <div style={{ background: DARK, borderRadius: 24, padding: "48px 32px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, color: "#fff", letterSpacing: -1, marginBottom: 16 }}>
            Crée ta propre série.<br /><span style={{ color: RED }}>En 5 minutes.</span>
          </h2>
          <p style={{ color: "#6a7a6e", fontSize: 15, marginBottom: 32 }}>
            Bible, épisodes, scripts 9:16, mode tournage, traduction en 6 langues.
          </p>
          <a href="/" style={{ display: "inline-block", background: RED, color: "#fff", padding: "16px 36px", borderRadius: 14, fontSize: 16, fontWeight: 700 }}>
            Commencer — 9€/mois →
          </a>
          <p style={{ color: "#3a5040", fontSize: 13, marginTop: 14 }}>Annulable à tout moment · Sans engagement</p>
        </div>
      </div>
    </div>
  );
}

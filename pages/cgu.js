import Head from "next/head";

const RED = "#E85C3A";
const VIO = "#a855f7";
const DARK = "#09090f";

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

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: "0 0 12px", letterSpacing: -0.3 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function P({ children }) {
  return <p style={{ fontSize: 15, lineHeight: 1.8, color: "#94a3b8", margin: "0 0 10px" }}>{children}</p>;
}

function Li({ children }) {
  return (
    <p style={{ fontSize: 15, lineHeight: 1.8, color: "#94a3b8", margin: "0 0 6px", paddingLeft: 16 }}>
      <span style={{ color: RED, marginRight: 8 }}>—</span>{children}
    </p>
  );
}

export default function CGU() {
  return (
    <>
      <Head>
        <title>CGU — VerticalClap</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{ minHeight: "100vh", background: DARK, color: "#f1f5f9", fontFamily: "'Space Grotesk',system-ui,sans-serif" }}>
        {/* Nav */}
        <nav style={{ borderBottom: "1px solid #1e1e2e", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ textDecoration: "none" }}><Logo /></a>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <a href="/tarifs" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>Tarifs</a>
            <a href="/app" style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", background: RED, padding: "7px 18px", borderRadius: 8, textDecoration: "none" }}>App →</a>
          </div>
        </nav>

        {/* Content */}
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 100px" }}>
          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: RED }}>Légal</span>
            <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 36, fontWeight: 900, color: "#f1f5f9", margin: "10px 0 8px", letterSpacing: -1 }}>
              Conditions Générales d'Utilisation
            </h1>
            <p style={{ fontSize: 13, color: "#475569" }}>Dernière mise à jour : 15 mai 2026</p>
          </div>

          <Section title="1. Objet">
            <P>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du service VerticalClap, accessible à l'adresse verticalclap.app, édité par Sophie Attelann.</P>
            <P>En accédant au service, vous acceptez sans réserve les présentes CGU.</P>
          </Section>

          <Section title="2. Description du service">
            <P>VerticalClap est un outil de création assistée par intelligence artificielle permettant aux créateurs de contenu de générer des scripts, bibles de séries et séquenciers pour des micro-dramas au format vertical 9:16, destinés aux plateformes TikTok, Instagram Reels, YouTube Shorts et DramaBox.</P>
          </Section>

          <Section title="3. Accès au service">
            <P>L'accès au service est conditionné à la souscription d'un abonnement mensuel (Standard à 9€/mois ou Premium à 19€/mois) ou annuel (Standard à 90€/an ou Premium à 179€/an). L'abonnement est sans engagement et peut être résilié à tout moment.</P>
            <P>Vous devez être âgé(e) d'au moins 18 ans pour souscrire un abonnement.</P>
          </Section>

          <Section title="4. Propriété intellectuelle">
            <P>Les contenus générés via VerticalClap (scripts, bibles, séquenciers) vous appartiennent intégralement. VerticalClap ne revendique aucun droit sur vos créations.</P>
            <P>La plateforme VerticalClap (code, design, marque) est protégée par le droit de la propriété intellectuelle et appartient à Sophie Attelann.</P>
          </Section>

          <Section title="5. Responsabilité">
            <P>VerticalClap est un outil d'aide à la création. Les contenus générés par l'IA peuvent contenir des erreurs ou imprécisions. L'utilisateur est seul responsable de l'usage qu'il fait des contenus générés.</P>
            <P>VerticalClap ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation du service.</P>
          </Section>

          <Section title="6. Résiliation">
            <P>Vous pouvez résilier votre abonnement à tout moment depuis votre espace client Stripe. La résiliation prend effet à la fin de la période de facturation en cours. Vos séries restent sauvegardées dans le cloud.</P>
          </Section>

          <Section title="7. Droit applicable">
            <P>Les présentes CGU sont soumises au droit français. Tout litige relève de la compétence exclusive des tribunaux français.</P>
          </Section>

          <Section title="8. Contact">
            <P>Pour toute question : <a href="mailto:hello@verticalclap.app" style={{ color: RED, textDecoration: "none" }}>hello@verticalclap.app</a></P>
          </Section>
        </div>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid #1e1e2e", padding: "24px 32px", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
            © 2026 VerticalClap ·{" "}
            <a href="/confidentialite" style={{ color: "#475569", textDecoration: "none" }}>Confidentialité</a>
            {" "}·{" "}
            <a href="mailto:hello@verticalclap.app" style={{ color: "#475569", textDecoration: "none" }}>Contact</a>
          </p>
        </footer>
      </div>
    </>
  );
}

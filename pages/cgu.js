import Head from "next/head";

const RED = "#E85C3A";
const VIO = "#a855f7";
const DARK = "#09090f";

const Logo = () => (
  <svg width="120" height="28" viewBox="0 0 120 28" fill="none">
    <defs>
      <linearGradient id="lg-cgu" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={RED} />
        <stop offset="100%" stopColor={VIO} />
      </linearGradient>
    </defs>
    <rect width="28" height="28" rx="7" fill="url(#lg-cgu)" />
    <text x="14" y="20" textAnchor="middle" fontFamily="Georgia,serif" fontSize="15" fontWeight="900" fill="#fff">▶</text>
    <text x="38" y="20" fontFamily="Georgia,serif" fontSize="17" fontWeight="900" fill="#f1f5f9" letterSpacing="-0.5">Vertical</text>
  </svg>
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
        <title>CGU — Studio Vertical</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{ minHeight: "100vh", background: DARK, color: "#f1f5f9", fontFamily: "'Space Grotesk',system-ui,sans-serif" }}>
        {/* Nav */}
        <nav style={{ borderBottom: "1px solid #1e1e2e", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ textDecoration: "none" }}><Logo /></a>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <a href="/tarifs" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>Tarifs</a>
            <a href="/app" style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", background: RED, padding: "7px 18px", borderRadius: 8, textDecoration: "none" }}>Studio →</a>
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
            <p style={{ fontSize: 13, color: "#475569" }}>Dernière mise à jour : 4 mai 2026</p>
          </div>

          <Section title="1. Objet">
            <P>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du service Studio Vertical, accessible à l'adresse studiovertical.app, édité par Sophie Attelann.</P>
            <P>En accédant au service, vous acceptez sans réserve les présentes CGU.</P>
          </Section>

          <Section title="2. Description du service">
            <P>Studio Vertical est un outil de création assistée par intelligence artificielle permettant aux créateurs de contenu de générer des scripts, bibles de séries et séquenciers pour des micro-dramas au format vertical 9:16, destinés aux plateformes TikTok, Instagram Reels, YouTube Shorts et DramaBox.</P>
          </Section>

          <Section title="3. Accès au service">
            <P>L'accès au service est conditionné à la souscription d'un abonnement mensuel (Standard à 14€/mois ou Premium à 29€/mois) ou annuel. L'abonnement est sans engagement et peut être résilié à tout moment.</P>
            <P>Vous devez être âgé(e) d'au moins 18 ans pour souscrire un abonnement.</P>
          </Section>

          <Section title="4. Propriété intellectuelle">
            <P>Les contenus générés via Studio Vertical (scripts, bibles, séquenciers) vous appartiennent intégralement. Studio Vertical ne revendique aucun droit sur vos créations.</P>
            <P>La plateforme Studio Vertical (code, design, marque) est protégée par le droit de la propriété intellectuelle et appartient à Sophie Attelann.</P>
          </Section>

          <Section title="5. Responsabilité">
            <P>Studio Vertical est un outil d'aide à la création. Les contenus générés par l'IA peuvent contenir des erreurs ou imprécisions. L'utilisateur est seul responsable de l'usage qu'il fait des contenus générés.</P>
            <P>Studio Vertical ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation du service.</P>
          </Section>

          <Section title="6. Résiliation">
            <P>Vous pouvez résilier votre abonnement à tout moment depuis votre espace client Stripe. La résiliation prend effet à la fin de la période de facturation en cours. Vos séries restent sauvegardées dans le cloud.</P>
          </Section>

          <Section title="7. Droit applicable">
            <P>Les présentes CGU sont soumises au droit français. Tout litige relève de la compétence exclusive des tribunaux français.</P>
          </Section>

          <Section title="8. Contact">
            <P>Pour toute question : <a href="mailto:hello@studiovertical.app" style={{ color: RED, textDecoration: "none" }}>hello@studiovertical.app</a></P>
          </Section>
        </div>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid #1e1e2e", padding: "24px 32px", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
            © 2026 Studio Vertical ·{" "}
            <a href="/confidentialite" style={{ color: "#475569", textDecoration: "none" }}>Confidentialité</a>
            {" "}·{" "}
            <a href="mailto:hello@studiovertical.app" style={{ color: "#475569", textDecoration: "none" }}>Contact</a>
          </p>
        </footer>
      </div>
    </>
  );
}

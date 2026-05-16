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

export default function Confidentialite() {
  return (
    <>
      <Head>
        <title>Politique de confidentialité — VerticalClap</title>
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
              Politique de confidentialité
            </h1>
            <p style={{ fontSize: 13, color: "#475569" }}>Dernière mise à jour : 4 mai 2026</p>
          </div>

          <Section title="1. Responsable du traitement">
            <P>
              Le responsable du traitement des données personnelles est Sophie Attelann, éditrice de VerticalClap (verticalclap.app).
              Contact : <a href="mailto:hello@verticalclap.app" style={{ color: RED, textDecoration: "none" }}>hello@verticalclap.app</a>
            </P>
          </Section>

          <Section title="2. Données collectées">
            <P><strong style={{ color: "#f1f5f9" }}>Données de compte :</strong> adresse email, fournie lors de l'abonnement via Stripe.</P>
            <P><strong style={{ color: "#f1f5f9" }}>Données de paiement :</strong> gérées exclusivement par Stripe. VerticalClap ne stocke aucune donnée bancaire.</P>
            <P><strong style={{ color: "#f1f5f9" }}>Données d'utilisation :</strong> compteurs anonymes d'utilisation des fonctionnalités (via Upstash Redis). Aucun contenu généré n'est conservé sur nos serveurs au-delà de la session.</P>
            <P><strong style={{ color: "#f1f5f9" }}>Séries sauvegardées :</strong> si vous activez la sauvegarde cloud, vos bibles et scripts sont stockés de façon chiffrée et associés à votre identifiant Stripe.</P>
          </Section>

          <Section title="3. Finalités du traitement">
            <P>Vos données sont utilisées pour :</P>
            <P style={{ paddingLeft: 16 }}><span style={{ color: RED, marginRight: 8 }}>—</span>Gérer votre abonnement et accès au service</P>
            <P style={{ paddingLeft: 16 }}><span style={{ color: RED, marginRight: 8 }}>—</span>Traiter vos paiements via Stripe</P>
            <P style={{ paddingLeft: 16 }}><span style={{ color: RED, marginRight: 8 }}>—</span>Vous envoyer des emails transactionnels liés au service (bienvenue, rappels, résiliation)</P>
            <P style={{ paddingLeft: 16 }}><span style={{ color: RED, marginRight: 8 }}>—</span>Améliorer le service via des métriques d'usage anonymes</P>
          </Section>

          <Section title="4. Base légale">
            <P>Le traitement de vos données est fondé sur l'exécution du contrat d'abonnement souscrit avec VerticalClap (art. 6.1.b RGPD). L'envoi d'emails marketing repose sur votre intérêt légitime et/ou votre consentement.</P>
          </Section>

          <Section title="5. Durée de conservation">
            <P>Vos données sont conservées pendant la durée de votre abonnement et 3 ans après sa résiliation, conformément aux obligations légales comptables et fiscales.</P>
          </Section>

          <Section title="6. Partage des données">
            <P><strong style={{ color: "#f1f5f9" }}>Stripe</strong> — pour le traitement des paiements et la gestion des abonnements.</P>
            <P><strong style={{ color: "#f1f5f9" }}>Anthropic</strong> — pour la génération de contenu par IA (Claude). Les prompts sont traités sans être conservés conformément à leur politique enterprise.</P>
            <P><strong style={{ color: "#f1f5f9" }}>Resend</strong> — pour l'envoi d'emails transactionnels.</P>
            <P>VerticalClap ne vend aucune donnée personnelle à des tiers.</P>
          </Section>

          <Section title="7. Vos droits (RGPD)">
            <P>Conformément au RGPD, vous disposez des droits suivants :</P>
            <P style={{ paddingLeft: 16 }}><span style={{ color: RED, marginRight: 8 }}>—</span>Droit d'accès à vos données personnelles</P>
            <P style={{ paddingLeft: 16 }}><span style={{ color: RED, marginRight: 8 }}>—</span>Droit de rectification</P>
            <P style={{ paddingLeft: 16 }}><span style={{ color: RED, marginRight: 8 }}>—</span>Droit à l'effacement (droit à l'oubli)</P>
            <P style={{ paddingLeft: 16 }}><span style={{ color: RED, marginRight: 8 }}>—</span>Droit à la portabilité</P>
            <P style={{ paddingLeft: 16 }}><span style={{ color: RED, marginRight: 8 }}>—</span>Droit d'opposition</P>
            <P>
              Pour exercer ces droits :{" "}
              <a href="mailto:hello@verticalclap.app" style={{ color: RED, textDecoration: "none" }}>hello@verticalclap.app</a>
            </P>
          </Section>

          <Section title="8. Cookies">
            <P>VerticalClap utilise uniquement des cookies techniques nécessaires au fonctionnement du service (session, préférences). Aucun cookie publicitaire ou de tracking tiers n'est déposé.</P>
          </Section>

          <Section title="9. Sécurité">
            <P>VerticalClap met en œuvre des mesures techniques appropriées : HTTPS, chiffrement des données au repos, accès restreints aux bases de données. Les incidents de sécurité sont notifiés à la CNIL dans les 72h si requis.</P>
          </Section>

          <Section title="10. Contact et réclamations">
            <P>
              Pour toute question :{" "}
              <a href="mailto:hello@verticalclap.app" style={{ color: RED, textDecoration: "none" }}>hello@verticalclap.app</a>
            </P>
            <P>
              Vous avez le droit d'introduire une réclamation auprès de la CNIL :{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: RED, textDecoration: "none" }}>www.cnil.fr</a>
            </P>
          </Section>
        </div>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid #1e1e2e", padding: "24px 32px", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
            © 2026 VerticalClap ·{" "}
            <a href="/cgu" style={{ color: "#475569", textDecoration: "none" }}>CGU</a>
            {" "}·{" "}
            <a href="mailto:hello@verticalclap.app" style={{ color: "#475569", textDecoration: "none" }}>Contact</a>
          </p>
        </footer>
      </div>
    </>
  );
}

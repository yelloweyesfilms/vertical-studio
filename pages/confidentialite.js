import Head from "next/head";

const s = {
  page: { minHeight: "100vh", background: "#fff", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#1A1A18" },
  nav: { borderBottom: "1px solid #E8E4DC", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 900, color: "#1A1A18", textDecoration: "none" },
  container: { maxWidth: 720, margin: "0 auto", padding: "60px 40px 80px" },
  h1: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 900, marginBottom: 12, letterSpacing: -1 },
  date: { fontSize: 13, color: "#888", marginBottom: 40 },
  h2: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, marginTop: 40, marginBottom: 12 },
  p: { fontSize: 15, lineHeight: 1.8, color: "#444", marginBottom: 16 },
  footer: { borderTop: "1px solid #E8E4DC", padding: "20px 40px", textAlign: "center", fontSize: 12, color: "#888" },
};

export default function Confidentialite() {
  return (
    <>
      <Head><title>Politique de confidentialité — Studio Vertical</title></Head>
      <div style={s.page}>
        <nav style={s.nav}>
          <a href="/" style={s.logo}>STUDIO VERTICAL</a>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#E85C3A", letterSpacing: 2 }}>● REC</span>
        </nav>
        <div style={s.container}>
          <h1 style={s.h1}>Politique de confidentialité</h1>
          <p style={s.date}>Dernière mise à jour : 4 mai 2026</p>

          <h2 style={s.h2}>1. Responsable du traitement</h2>
          <p style={s.p}>Le responsable du traitement des données personnelles est Sophie Attelann, éditrice de Studio Vertical (studiovertical.app). Contact : <a href="mailto:hello@studiovertical.app" style={{ color: "#E85C3A" }}>hello@studiovertical.app</a></p>

          <h2 style={s.h2}>2. Données collectées</h2>
          <p style={s.p}>Studio Vertical collecte les données suivantes :</p>
          <p style={s.p}><strong>Données de compte :</strong> adresse email, fournies lors de l'inscription.</p>
          <p style={s.p}><strong>Données de paiement :</strong> gérées exclusivement par Stripe. Studio Vertical ne stocke aucune donnée bancaire.</p>
          <p style={s.p}><strong>Données d'utilisation :</strong> contenus générés via l'IA (scripts, bibles). Ces données sont traitées en temps réel et ne sont pas conservées sur nos serveurs.</p>

          <h2 style={s.h2}>3. Finalités du traitement</h2>
          <p style={s.p}>Vos données sont utilisées pour :</p>
          <p style={s.p}>— Gérer votre abonnement et accès au service</p>
          <p style={s.p}>— Traiter vos paiements via Stripe</p>
          <p style={s.p}>— Vous envoyer des communications relatives au service</p>

          <h2 style={s.h2}>4. Base légale</h2>
          <p style={s.p}>Le traitement de vos données est fondé sur l'exécution du contrat d'abonnement que vous avez souscrit avec Studio Vertical.</p>

          <h2 style={s.h2}>5. Durée de conservation</h2>
          <p style={s.p}>Vos données sont conservées pendant la durée de votre abonnement et 3 ans après sa résiliation, conformément aux obligations légales.</p>

          <h2 style={s.h2}>6. Partage des données</h2>
          <p style={s.p}>Vos données sont partagées avec :</p>
          <p style={s.p}><strong>Stripe</strong> — pour le traitement des paiements.</p>
          <p style={s.p}><strong>Anthropic</strong> — pour la génération de contenu par IA. Les données sont traitées conformément à leur politique de confidentialité.</p>
          <p style={s.p}>Studio Vertical ne vend aucune donnée personnelle à des tiers.</p>

          <h2 style={s.h2}>7. Vos droits (RGPD)</h2>
          <p style={s.p}>Conformément au RGPD, vous disposez des droits suivants :</p>
          <p style={s.p}>— Droit d'accès à vos données personnelles</p>
          <p style={s.p}>— Droit de rectification</p>
          <p style={s.p}>— Droit à l'effacement (droit à l'oubli)</p>
          <p style={s.p}>— Droit à la portabilité</p>
          <p style={s.p}>— Droit d'opposition</p>
          <p style={s.p}>Pour exercer ces droits, contactez-nous à : <a href="mailto:hello@studiovertical.app" style={{ color: "#E85C3A" }}>hello@studiovertical.app</a></p>

          <h2 style={s.h2}>8. Cookies</h2>
          <p style={s.p}>Studio Vertical utilise uniquement des cookies techniques nécessaires au fonctionnement du service. Aucun cookie publicitaire ou de tracking n'est utilisé.</p>

          <h2 style={s.h2}>9. Sécurité</h2>
          <p style={s.p}>Studio Vertical met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou destruction.</p>

          <h2 style={s.h2}>10. Contact et réclamations</h2>
          <p style={s.p}>Pour toute question relative à vos données : <a href="mailto:hello@studiovertical.app" style={{ color: "#E85C3A" }}>hello@studiovertical.app</a></p>
          <p style={s.p}>Vous avez également le droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: "#E85C3A" }}>www.cnil.fr</a></p>
        </div>
        <footer style={s.footer}>
          <p>© 2026 Studio Vertical · Tous droits réservés · <a href="/cgu" style={{ color: "#888" }}>CGU</a></p>
        </footer>
      </div>
    </>
  );
}

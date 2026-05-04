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

export default function CGU() {
  return (
    <>
      <Head><title>CGU — Studio Vertical</title></Head>
      <div style={s.page}>
        <nav style={s.nav}>
          <a href="/" style={s.logo}>STUDIO VERTICAL</a>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#E85C3A", letterSpacing: 2 }}>● REC</span>
        </nav>
        <div style={s.container}>
          <h1 style={s.h1}>Conditions Générales d'Utilisation</h1>
          <p style={s.date}>Dernière mise à jour : 4 mai 2026</p>

          <h2 style={s.h2}>1. Objet</h2>
          <p style={s.p}>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du service Studio Vertical, accessible à l'adresse studiovertical.app, édité par Sophie Attelann.</p>
          <p style={s.p}>En accédant au service, vous acceptez sans réserve les présentes CGU.</p>

          <h2 style={s.h2}>2. Description du service</h2>
          <p style={s.p}>Studio Vertical est un outil de création assistée par intelligence artificielle permettant aux créateurs de contenu de générer des scripts, bibles de séries et séquenciers pour des micro-dramas au format vertical 9:16.</p>

          <h2 style={s.h2}>3. Accès au service</h2>
          <p style={s.p}>L'accès au service est conditionné à la souscription d'un abonnement mensuel de 9€ TTC. L'abonnement est sans engagement et peut être résilié à tout moment.</p>
          <p style={s.p}>Vous devez être âgé(e) d'au moins 18 ans pour souscrire un abonnement.</p>

          <h2 style={s.h2}>4. Propriété intellectuelle</h2>
          <p style={s.p}>Les contenus générés via Studio Vertical (scripts, bibles, séquenciers) vous appartiennent intégralement. Studio Vertical ne revendique aucun droit sur vos créations.</p>
          <p style={s.p}>La plateforme Studio Vertical (code, design, marque) est protégée par le droit de la propriété intellectuelle et appartient à Sophie Attelann.</p>

          <h2 style={s.h2}>5. Responsabilité</h2>
          <p style={s.p}>Studio Vertical est un outil d'aide à la création. Les contenus générés par l'IA peuvent contenir des erreurs ou imprécisions. L'utilisateur est seul responsable de l'usage qu'il fait des contenus générés.</p>
          <p style={s.p}>Studio Vertical ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation du service.</p>

          <h2 style={s.h2}>6. Résiliation</h2>
          <p style={s.p}>Vous pouvez résilier votre abonnement à tout moment depuis votre espace client Stripe. La résiliation prend effet à la fin de la période de facturation en cours.</p>

          <h2 style={s.h2}>7. Droit applicable</h2>
          <p style={s.p}>Les présentes CGU sont soumises au droit français. Tout litige relève de la compétence exclusive des tribunaux français.</p>

          <h2 style={s.h2}>8. Contact</h2>
          <p style={s.p}>Pour toute question : <a href="mailto:hello@studiovertical.app" style={{ color: "#E85C3A" }}>hello@studiovertical.app</a></p>
        </div>
        <footer style={s.footer}>
          <p>© 2026 Studio Vertical · Tous droits réservés · <a href="/confidentialite" style={{ color: "#888" }}>Politique de confidentialité</a></p>
        </footer>
      </div>
    </>
  );
}

const RED = "#E85C3A";
const DARK = "#0F1A12";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "var(--sans)" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=DM+Sans:wght@400;600;700&display=swap');`}</style>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(80px,20vw,140px)", fontWeight: 900, color: RED, lineHeight: 1, marginBottom: 8 }}>
          404
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,5vw,32px)", fontWeight: 900, color: "#fff", marginBottom: 16, letterSpacing: -0.5 }}>
          Cette page n'existe pas
        </h1>
        <p style={{ fontSize: 15, color: "#6a7a6e", lineHeight: 1.7, marginBottom: 36 }}>
          Le lien est peut-être cassé, ou la page a été déplacée.<br />
          Retourne au studio pour continuer à créer.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/" style={{ display: "inline-block", background: RED, color: "#fff", textDecoration: "none", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700 }}>
            Accueil →
          </a>
          <a href="/app" style={{ display: "inline-block", background: "transparent", color: "#6a7a6e", textDecoration: "none", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, border: "1px solid #2a3a2e" }}>
            Mon studio
          </a>
        </div>
        <p style={{ marginTop: 48, fontSize: 11, color: "#2a3a2e", fontWeight: 800, letterSpacing: 3, textTransform: "uppercase" }}>
          Studio Vertical
        </p>
      </div>
    </div>
  );
}

import { ImageResponse } from "next/og";

export const config = { runtime: "edge" };

export default function handler(req) {
  const { searchParams } = new URL(req.url, "https://verticalclap.app");
  const title = searchParams.get("title") || null;
  const sub = searchParams.get("sub") || null;
  const category = searchParams.get("category") || null;
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#09090f",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glows */}
        <div style={{ position: "absolute", top: -120, left: 80, width: 520, height: 520, background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -100, right: 220, width: 420, height: 420, background: "radial-gradient(circle, rgba(232,92,58,0.09) 0%, transparent 70%)", display: "flex" }} />

        {/* Giant decorative V */}
        <div style={{ position: "absolute", right: 260, top: -50, opacity: 0.045, display: "flex" }}>
          <svg width="440" height="540" viewBox="0 0 520 620" fill="none">
            <path d="M20 20 L260 600 L500 20" stroke="#E85C3A" strokeWidth="72" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Left: text */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 620, zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 44 }}>
            <div style={{ width: 34, height: 48, background: "#E85C3A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderLeft: "14px solid white", marginLeft: 3, display: "flex" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 4, textTransform: "uppercase" }}>Vertical</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#f1f5f9", letterSpacing: -1 }}>Clap</span>
            </div>
          </div>

          {/* Headline — article ou default */}
          {title ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {category && (
                <span style={{ fontSize: 14, fontWeight: 800, color: "#a855f7", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16, display: "flex" }}>{category}</span>
              )}
              <span style={{ fontSize: title.length > 40 ? 52 : 68, fontWeight: 900, color: "#f1f5f9", letterSpacing: -2, lineHeight: 1.05, display: "flex", flexWrap: "wrap" }}>{title}</span>
              {sub && <span style={{ fontSize: 22, color: "#64748b", marginTop: 20, display: "flex", lineHeight: 1.5 }}>{sub}</span>}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <span style={{ fontSize: 80, fontWeight: 900, color: "#f1f5f9", letterSpacing: -4, lineHeight: 0.88, display: "flex" }}>De l'idée</span>
              <div style={{ display: "flex", lineHeight: 0.88, marginTop: 4 }}>
                <span style={{ fontSize: 80, fontWeight: 900, color: "#f1f5f9", letterSpacing: -4 }}>à la&nbsp;</span>
                <span style={{ fontSize: 80, fontWeight: 900, letterSpacing: -4, background: "linear-gradient(135deg, #E85C3A 30%, #a855f7)", backgroundClip: "text", color: "transparent" }}>série complète</span>
                <span style={{ fontSize: 80, fontWeight: 900, color: "#f1f5f9", letterSpacing: -4 }}>.</span>
              </div>
              <span style={{ fontSize: 80, fontWeight: 900, color: "#3a3a50", letterSpacing: -4, lineHeight: 0.88, marginTop: 4, display: "flex" }}>En 5 minutes.</span>
            </div>
          )}

          {/* Platform + price badges */}
          <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 12 }}>
            {[
              { label: "TikTok", color: "#69C9D0" },
              { label: "Reels", color: "#a855f7" },
              { label: "Shorts", color: "#E85C3A" },
            ].map(({ label, color }) => (
              <div key={label} style={{ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 700, color, display: "flex" }}>
                {label}
              </div>
            ))}
            <span style={{ fontSize: 14, color: "#475569", marginLeft: 8 }}>· 9€/mois · Sans engagement</span>
          </div>
        </div>

        {/* Right: phone mockup */}
        <div style={{ display: "flex", position: "relative", zIndex: 1, flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: -36, background: "radial-gradient(circle, rgba(232,92,58,0.16) 0%, transparent 70%)", display: "flex", borderRadius: "50%" }} />
          <div style={{ width: 210, background: "#0a0a14", border: "2px solid rgba(168,85,247,0.4)", borderRadius: 40, padding: "24px 16px 20px", display: "flex", flexDirection: "column", boxShadow: "0 0 60px rgba(168,85,247,0.18), 0 0 30px rgba(232,92,58,0.12)", position: "relative" }}>
            {/* Notch */}
            <div style={{ width: 48, height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 10, alignSelf: "center", marginBottom: 20, display: "flex" }} />
            {/* Screen area */}
            <div style={{ background: "linear-gradient(180deg, #1a0805 0%, #0d0404 55%, #09090f 100%)", borderRadius: 16, padding: "14px 12px", marginBottom: 12, display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#E85C3A", display: "flex" }} />
                <span style={{ fontSize: 8, fontWeight: 800, color: "#E85C3A", letterSpacing: 2, textTransform: "uppercase" }}>REC · EP.01</span>
              </div>
              <span style={{ fontSize: 8, fontWeight: 800, color: "#E85C3A", letterSpacing: 1.5, textTransform: "uppercase" }}>⚡ HOOK — 3 SEC</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9", lineHeight: 1.45 }}>« Si vous regardez ça... c'est que j'ai pas réussi. »</span>
              <span style={{ fontSize: 9, color: "#64748b", fontStyle: "italic" }}>[9:16] Gros plan, yeux dans l'objectif</span>
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", display: "flex" }} />
              <span style={{ fontSize: 9, fontWeight: 800, color: "#a855f7", letterSpacing: 2 }}>MAYA</span>
              <span style={{ fontSize: 12, color: "#f1f5f9", lineHeight: 1.45 }}>Tu as réussi. Regarde ce que j'ai trouvé.</span>
              <span style={{ fontSize: 9, color: "#64748b", fontStyle: "italic" }}>[9:16] Insert téléphone, notif</span>
            </div>
            {/* Cliffhanger chip */}
            <div style={{ background: "rgba(232,92,58,0.1)", border: "1px solid rgba(232,92,58,0.28)", borderRadius: 10, padding: "8px 12px", display: "flex" }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: "#E85C3A", letterSpacing: 1, textTransform: "uppercase" }}>🎬 CLIFFHANGER</span>
            </div>
            {/* 9:16 label */}
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ width: 16, height: 1, background: "#E85C3A", display: "flex" }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: "#E85C3A", letterSpacing: 2 }}>9:16</span>
              <div style={{ width: 16, height: 1, background: "#E85C3A", display: "flex" }} />
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

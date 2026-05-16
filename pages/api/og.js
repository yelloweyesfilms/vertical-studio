import { ImageResponse } from "next/og";

export const config = { runtime: "edge" };

export default function handler(req) {
  const { searchParams } = new URL(req.url, "https://verticalclap.app");
  const title = searchParams.get("title") || null;
  const sub = searchParams.get("sub") || null;

  return new ImageResponse(
    (
      <div style={{
        width: "1200px", height: "630px",
        background: "#09090f",
        display: "flex", alignItems: "stretch",
        fontFamily: "sans-serif",
        position: "relative", overflow: "hidden",
      }}>
        {/* Orange glow bottom right */}
        <div style={{ position: "absolute", bottom: -80, right: 180, width: 600, height: 600, background: "radial-gradient(circle, rgba(232,92,58,0.25) 0%, transparent 65%)", display: "flex" }} />
        {/* Violet glow top left */}
        <div style={{ position: "absolute", top: -80, left: -60, width: 500, height: 500, background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 65%)", display: "flex" }} />
        {/* Subtle violet bottom left */}
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 300, height: 300, background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)", display: "flex" }} />

        {/* Left: content */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 0 60px 72px", flex: 1, zIndex: 1 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 4, height: 40, borderRadius: 2, background: "linear-gradient(to bottom, #ff8c42, #E85C3A)", display: "flex" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 4 }}>VERTICAL</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#E85C3A", letterSpacing: -0.5 }}>CLAP</span>
            </div>
          </div>

          {/* Main headline */}
          {title ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: title.length > 30 ? 64 : 82, fontWeight: 900, color: "#f1f5f9", letterSpacing: -3, lineHeight: 0.9, display: "flex", flexWrap: "wrap", maxWidth: 580 }}>{title}</span>
              {sub && <span style={{ fontSize: 22, color: "#94a3b8", marginTop: 20, display: "flex" }}>{sub}</span>}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <span style={{ fontSize: 110, fontWeight: 900, color: "#ffffff", letterSpacing: -5, lineHeight: 0.85, display: "flex" }}>VERTICAL</span>
              <span style={{ fontSize: 110, fontWeight: 900, color: "#E85C3A", letterSpacing: -5, lineHeight: 0.85, display: "flex" }}>CLAP</span>
              <div style={{ width: 80, height: 3, background: "linear-gradient(to right, #E85C3A, #a855f7)", marginTop: 24, marginBottom: 20, display: "flex" }} />
              <span style={{ fontSize: 26, fontWeight: 700, color: "#a855f7", letterSpacing: 0, display: "flex" }}>Génère tes scripts verticaux en 5 min</span>
            </div>
          )}

          {/* Bottom features */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {[
              { icon: "✍️", label: "ÉCRITURE IA" },
              { icon: "📖", label: "BIBLE + SCRIPTS" },
              { icon: "🎬", label: "PRÊT À TOURNER" },
              { icon: "⏱", label: "5 MIN CHRONO" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: phone */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 340, position: "relative", zIndex: 1, flexShrink: 0 }}>
          {/* Glow behind phone */}
          <div style={{ position: "absolute", inset: -20, background: "radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(232,92,58,0.15) 50%, transparent 70%)", display: "flex" }} />
          {/* Phone shell */}
          <div style={{
            width: 220, height: 480,
            background: "#111",
            border: "2.5px solid rgba(168,85,247,0.7)",
            borderRadius: 44,
            display: "flex", flexDirection: "column", alignItems: "center",
            boxShadow: "0 0 80px rgba(168,85,247,0.4), 0 0 40px rgba(232,92,58,0.25), inset 0 0 30px rgba(168,85,247,0.05)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Screen gradient simulating cinematic scene */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg, #0d0520 0%, #1a0800 30%, #1a0500 55%, #0a0318 80%, #060108 100%)",
              display: "flex",
            }} />
            {/* Orange atmosphere */}
            <div style={{ position: "absolute", top: "20%", left: "10%", width: "80%", height: "50%", background: "radial-gradient(ellipse, rgba(232,92,58,0.6) 0%, transparent 70%)", display: "flex" }} />
            {/* Silhouette figure */}
            <div style={{ position: "absolute", bottom: "18%", left: "50%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#1a0800", display: "flex", marginBottom: 2 }} />
              <div style={{ width: 18, height: 28, background: "#1a0800", borderRadius: "3px 3px 0 0", display: "flex" }} />
              <div style={{ display: "flex", gap: 3 }}>
                <div style={{ width: 7, height: 20, background: "#1a0800", borderRadius: "0 0 3px 3px", display: "flex" }} />
                <div style={{ width: 7, height: 20, background: "#1a0800", borderRadius: "0 0 3px 3px", display: "flex" }} />
              </div>
            </div>
            {/* Notch */}
            <div style={{ width: 60, height: 6, background: "#000", borderRadius: 10, marginTop: 14, zIndex: 2, display: "flex" }} />
            {/* REC badge */}
            <div style={{ position: "absolute", top: 36, right: 14, background: "rgba(232,92,58,0.9)", borderRadius: 6, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4, zIndex: 2 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", display: "flex" }} />
              <span style={{ fontSize: 8, fontWeight: 800, color: "#fff", letterSpacing: 1 }}>REC</span>
            </div>
            {/* 9:16 label */}
            <div style={{ position: "absolute", bottom: 20, right: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 2 }}>
              <div style={{ width: 1, height: 16, background: "#E85C3A", display: "flex" }} />
              <span style={{ fontSize: 9, fontWeight: 800, color: "#E85C3A", letterSpacing: 1, writingMode: "vertical-rl" }}>9:16</span>
              <div style={{ width: 1, height: 16, background: "#E85C3A", display: "flex" }} />
            </div>
          </div>
          {/* V shape behind phone */}
          <div style={{ position: "absolute", zIndex: 0, display: "flex" }}>
            <svg width="300" height="500" viewBox="0 0 300 500" fill="none">
              <defs>
                <linearGradient id="vgrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7"/>
                  <stop offset="100%" stopColor="#E85C3A" stopOpacity="0.5"/>
                </linearGradient>
              </defs>
              <path d="M10 10 L150 490 L290 10" stroke="url(#vgrad)" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

import { ImageResponse } from "next/og";

export const config = { runtime: "edge" };

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "#0F1A12",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ width: 60, height: 6, background: "#E85C3A", borderRadius: 3, marginBottom: 40, display: "flex" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
          <div style={{ width: 48, height: 48, background: "#E85C3A", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ color: "#fff", fontSize: 24, fontWeight: 900, display: "flex" }}>V</div>
          </div>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", display: "flex" }}>
            STUDIO <span style={{ color: "#E85C3A", marginLeft: 8, display: "flex" }}>VERTICAL</span>
          </div>
        </div>
        <div style={{ color: "#fff", fontSize: 64, fontWeight: 900, lineHeight: 1.1, marginBottom: 24, display: "flex", flexDirection: "column" }}>
          <span style={{ display: "flex" }}>Micro-dramas 9:16</span>
          <span style={{ color: "#E85C3A", display: "flex" }}>en 5 minutes.</span>
        </div>
        <div style={{ color: "#6a7a6e", fontSize: 26, lineHeight: 1.5, maxWidth: 700, display: "flex" }}>
          Bible · Scripts · Hooks · Cliffhangers — prêts à tourner sur TikTok, Reels & Shorts.
        </div>
        <div style={{ position: "absolute", bottom: 60, right: 80, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#1a2a1e", border: "1px solid #2a3a2e", borderRadius: 20, padding: "8px 20px", display: "flex" }}>
            <span style={{ color: "#4ade80", fontSize: 16, fontWeight: 700, display: "flex" }}>✶ Propulsé par l'IA</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

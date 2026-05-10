import { ImageResponse } from "next/og";

export const config = { runtime: "edge" };

export default async function handler(req) {
  const host = req.headers.get("host") || "studiovertical.app";
  const proto = host.includes("localhost") ? "http" : "https";

  // Fetch og.png et convertir en data URL pour Satori
  const imgRes = await fetch(`${proto}://${host}/og.png`);
  const imgBuffer = await imgRes.arrayBuffer();
  const bytes = new Uint8Array(imgBuffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  const dataUrl = `data:image/png;base64,${btoa(binary)}`;

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", position: "relative" }}>
        {/* Image originale en fond */}
        <img src={dataUrl} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0 }} />

        {/* CTA rouge en bas à gauche */}
        <div style={{
          position: "absolute",
          bottom: 52,
          left: 72,
          display: "flex",
          alignItems: "center",
          background: "#E85C3A",
          borderRadius: 14,
          padding: "18px 36px",
        }}>
          <span style={{ color: "#fff", fontSize: 30, fontWeight: 800, fontFamily: "sans-serif", display: "flex" }}>
            Commencer gratuitement →
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

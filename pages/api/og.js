import { ImageResponse } from "next/og";

export const config = { runtime: "edge" };

export default function handler(req) {
  const host = req.headers.get("host") || "studiovertical.app";
  const proto = host.includes("localhost") ? "http" : "https";
  const imageUrl = `${proto}://${host}/og.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
        }}
      >
        <img
          src={imageUrl}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 72,
            display: "flex",
            alignItems: "center",
            background: "#E85C3A",
            borderRadius: "14px",
            padding: "16px 32px",
            boxShadow: "0 8px 32px rgba(232,92,58,0.5)",
          }}
        >
          <span style={{ color: "#fff", fontSize: 28, fontWeight: 800, fontFamily: "sans-serif", display: "flex" }}>
            Commencer gratuitement →
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

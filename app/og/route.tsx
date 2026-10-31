import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #134e4a 55%, #0e7490 100%)",
          padding: 64,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              background: "#0f766e",
              fontSize: 38,
              fontWeight: 800,
              border: "2px solid rgba(94, 234, 212, 0.5)",
            }}
          >
            EP
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 28, fontWeight: 700 }}>{SITE.name}</span>
            <span style={{ fontSize: 20, color: "#99f6e4" }}>Free static analysis</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.1 }}>
            Know what an extension can see
          </span>
          <span style={{ fontSize: 30, color: "#a5f3fc", marginTop: 18 }}>
            Permissions · Website access · Domains · Code indicators
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#ccfbf1",
          }}
        >
          <span>CRX · XPI · ZIP · manifest.json</span>
          <span>No code execution · Processed locally</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
      },
    },
  );
}

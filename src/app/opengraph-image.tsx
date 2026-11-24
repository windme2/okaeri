import { ImageResponse } from "next/og";

export const alt = "Okaeri: hand-picked flights, stays and experiences around the world";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Link preview for LINE, Facebook, X and Slack. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #152451 0%, #164bdd 55%, #59a3ff 100%)",
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* dashed flight path */}
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          <path
            d="M760 660 C 800 560, 860 470, 945 350"
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="4"
            strokeDasharray="14 16"
            strokeLinecap="round"
          />
        </svg>

        {/* the logo's paper plane, large */}
        <svg width="360" height="330" viewBox="0 0 24 22" style={{ position: "absolute", right: 70, top: 60, transform: "rotate(-12deg)" }}>
          <path d="M22 2 2 9.5l7.5 3L22 2Z" fill="#ffffff" />
          <path d="m22 2-12.5 10.5V20l3.6-4.4L17 19 22 2Z" fill="#ffffff" fillOpacity="0.72" />
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "rgba(255,255,255,0.16)",
              border: "2px solid rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="38" height="38" viewBox="0 0 24 24" style={{ transform: "rotate(-12deg)" }}>
              <path d="M22 2 2 9.5l7.5 3L22 2Z" fill="#ffffff" />
              <path d="m22 2-12.5 10.5V20l3.6-4.4L17 19 22 2Z" fill="#ffffff" fillOpacity="0.7" />
            </svg>
          </div>
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>okaeri</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 0.95, letterSpacing: -3 }}>TRAVEL</div>
          <div style={{ fontSize: 56, fontWeight: 700, marginTop: 8 }}>AROUND THE WORLD</div>
          <div style={{ fontSize: 28, marginTop: 28, color: "rgba(255,255,255,0.82)", maxWidth: 640 }}>
            Hand-picked flights, stays and experiences in a single booking.
          </div>
        </div>
      </div>
    ),
    size,
  );
}

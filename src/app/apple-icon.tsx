import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iOS (Safari ignores SVG favicons there). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #337ffc, #164bdd)",
        }}
      >
        <svg width="104" height="104" viewBox="0 0 24 24" style={{ transform: "rotate(-12deg)" }}>
          <path d="M22 2 2 9.5l7.5 3L22 2Z" fill="#ffffff" />
          <path d="m22 2-12.5 10.5V20l3.6-4.4L17 19 22 2Z" fill="#ffffff" fillOpacity="0.72" />
        </svg>
      </div>
    ),
    size,
  );
}

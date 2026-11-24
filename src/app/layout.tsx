import type { Metadata } from "next";
import { Caveat, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { BookingProvider } from "@/components/booking";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });

// Absolute base for share images. On Vercel the production URL is picked up automatically;
// set NEXT_PUBLIC_SITE_URL when hosting elsewhere.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const description = "Hand-picked flights, stays and experiences to the world's most breathtaking places, in a single booking.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Okaeri | Travel around the world",
  description,
  applicationName: "Okaeri",
  openGraph: {
    type: "website",
    siteName: "Okaeri",
    title: "Okaeri | Travel around the world",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Okaeri | Travel around the world",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${outfit.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full overflow-x-clip font-sans">
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  );
}

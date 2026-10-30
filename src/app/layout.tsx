import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Great_Vibes } from "next/font/google";
import { coupleNames } from "@/config/event";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${coupleNames} · Nuestra boda`,
  description: `Invitación a la boda de ${coupleNames}.`,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f3efe9",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" className={`${serif.variable} ${script.variable}`}>
      <body className="bg-paper font-serif text-ink antialiased">{children}</body>
    </html>
  );
}

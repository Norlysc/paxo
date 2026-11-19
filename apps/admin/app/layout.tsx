import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

// El favicon sale de app/icon.svg (el isotipo del logo) y app/apple-icon.png.
export const metadata: Metadata = {
  title: {
    default: "Panel | Soluciones PAXO",
    template: "%s | Panel PAXO",
  },
  description: "Panel administrativo interno de SOLUCIONES PAXO C.A.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-VE" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}

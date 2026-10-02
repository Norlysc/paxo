import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Panel Administrativo | PAXO",
    template: "%s | PAXO Admin",
  },
  description: "Panel administrativo interno de SOLUCIONES PAXO C.A.",
  icons: {
    icon: "/icon.svg",
  },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-VE" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}

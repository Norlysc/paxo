import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.solucionespaxo.com"),
  // Los iconos los resuelve Next.js desde app/icon.jpg y app/apple-icon.jpg.
  // No declarar `icons` aqui: un override manual gana sobre esos archivos.
  title: {
    default: "SOLUCIONES PAXO C.A. | Construcción, Mantenimiento y Seguridad Electrónica",
    template: "%s | PAXO",
  },
  description:
    "Construcción, remodelaciones, electricidad, plomería, CCTV, control de acceso y mantenimiento industrial en Venezuela. Solicita tu asesoría personalizada gratis.",
  keywords: [
    "construcción Venezuela",
    "remodelaciones",
    "CCTV",
    "control de acceso",
    "mantenimiento industrial",
    "PAXO",
  ],
  openGraph: {
    type: "website",
    locale: "es_VE",
    siteName: "SOLUCIONES PAXO C.A.",
    title: "SOLUCIONES PAXO C.A. — Construcción y Seguridad Electrónica",
    description:
      "Construcción, remodelaciones, electricidad, CCTV, control de acceso y mantenimiento industrial. Solicita tu asesoría personalizada.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-VE" className={inter.variable}>
      <body>
        {children}

        {GA4_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_ID}');
              `}
            </Script>
          </>
        )}

        {META_PIXEL_ID && (
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </body>
    </html>
  );
}

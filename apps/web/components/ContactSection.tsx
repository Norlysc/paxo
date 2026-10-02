"use client";

import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY } from "@paxo/shared";
import { Card, CardContent } from "@paxo/ui";
import { QuoteForm } from "./QuoteForm";
import { trackEvent } from "@/lib/analytics";

export function ContactSection() {
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? COMPANY.phoneNumber;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? COMPANY.email;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? COMPANY.whatsappNumber;
  const mapEmbedUrl =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
    "https://www.google.com/maps?q=Calle%20Zuloaga%2C%20Los%20Chaguaramos%2C%20Caracas%2C%20Venezuela&output=embed";
  const whatsappMessage = encodeURIComponent("Hola, quisiera solicitar una asesoría personalizada de SOLUCIONES PAXO.");

  const contactIcons = [
    { name: "WhatsApp", href: `whatsapp://send?phone=${whatsapp}&text=${whatsappMessage}`, Icon: WhatsAppIcon, event: "whatsapp_click" as const, external: false },
    { name: "Llamar", href: `tel:${phone.replace(/\s/g, "")}`, Icon: Phone, event: "call_click" as const, external: false },
    { name: "Correo", href: `mailto:${email}`, Icon: Mail, event: "email_click" as const, external: false },
  ];

  return (
    <section id="cotizar" className="relative overflow-hidden bg-paxo-blue-dark py-20 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full border-[30px] border-white/5" />
      <div aria-hidden className="pointer-events-none absolute -bottom-48 -right-28 h-[30rem] w-[30rem] rounded-full border-[24px] border-paxo-red/20" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-16">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-paxo-red">Conversemos sobre tu proyecto</p>
          <h2 className="mt-4 flex items-center gap-3 font-display text-3xl font-bold text-white sm:text-4xl">
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white p-1.5 sm:h-10 sm:w-10">
              <Image src="/brand/logo-icon.jpg" alt="" fill sizes="40px" className="rounded-full object-contain p-1.5" />
            </span>
            Solicita tu Asesoría Personalizada
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
            Cuéntanos qué necesitas y te contactaremos en menos de 24 horas.
          </p>
          <Card className="mt-8 rounded-3xl border-0 shadow-2xl shadow-[#061d46]/35">
            <CardContent className="p-5 sm:p-7">
              <QuoteForm />
            </CardContent>
          </Card>
        </div>

        <div id="contacto" className="rounded-3xl border border-white/15 bg-white/[0.07] p-5 shadow-2xl shadow-[#061d46]/20 backdrop-blur-sm sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-paxo-red">Atención directa</p>
              <h3 className="mt-2 text-2xl font-bold text-white">Estamos para ayudarte</h3>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-paxo-blue-dark">
              <MapPin className="h-5 w-5" strokeWidth={2} />
            </span>
          </div>
          <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-4">
            {contactIcons.map(({ name, href, Icon, event, external }) => (
              <a
                key={name}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                onClick={() => trackEvent(event, { metadata: { source: "contact_section" } })}
                className="group flex flex-col items-center gap-2"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/25 transition-colors group-hover:bg-white group-hover:text-paxo-blue-dark">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span className="text-xs font-medium text-white/80">{name}</span>
              </a>
            ))}
          </div>

          <div className="relative mt-7 overflow-hidden rounded-2xl border border-white/20 shadow-lg shadow-[#061d46]/25">
            {mapEmbedUrl ? (
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="320"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de SOLUCIONES PAXO C.A."
              />
            ) : (
              <div className="relative flex h-80 flex-col items-center justify-center gap-3 bg-white/5 px-8 text-center">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.45]"
                  style={{
                    backgroundImage: "radial-gradient(#334155 10px, transparent 10px)",
                    backgroundSize: "34px 34px",
                  }}
                />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-paxo-blue-dark">
                  <MapPin className="h-6 w-6" strokeWidth={2} />
                </span>
                <p className="relative text-sm font-medium text-white">{COMPANY.address}</p>
                <p className="relative text-xs text-white/60">{COMPANY.coverageNote}</p>
              </div>
            )}
          </div>
          <p className="mt-4 text-center text-sm text-white/70">{COMPANY.address}</p>
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.42a9.87 9.87 0 0 0 4.62 1.18h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.13c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.15.07.15.11.32.02.51-.09.2-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.17-.2.71-.83.9-1.11.19-.28.38-.23.63-.14.26.1 1.63.77 1.9.91.28.14.46.21.53.33.07.12.07.68-.17 1.36z" />
    </svg>
  );
}

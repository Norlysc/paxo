import Image from "next/image";
import { BadgeCheck, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Carlos Delgado",
    role: "Centro Comercial Demo C.A.",
    quote:
      "El equipo de PAXO instaló todo nuestro sistema de CCTV sin detener la operación del centro comercial. Trabajo impecable y a tiempo.",
  },
  {
    name: "Ana María Rojas",
    role: "Residencia privada, Valencia",
    quote:
      "Remodelaron completamente nuestra cocina y baños. La comunicación fue clara desde la cotización hasta la entrega.",
  },
  {
    name: "Ing. Roberto Salas",
    role: "Planta industrial, Carabobo",
    quote:
      "Contratamos mantenimiento industrial preventivo con PAXO y hemos reducido nuestras paradas no planificadas significativamente.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 2 || /^[A-ZÁÉÍÓÚ]/.test(w))
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  return (
    <section id="testimonios" className="relative overflow-hidden bg-[#0d469d] py-20">
      <div aria-hidden className="pointer-events-none absolute -left-20 -top-28 h-56 w-[38rem] rounded-[50%] border-[18px] border-white/10" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-48 w-[32rem] rounded-[50%] border-[14px] border-paxo-red/35" />
      <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full opacity-25" viewBox="0 0 1440 160" preserveAspectRatio="none">
        <path d="M0 94C250 22 450 155 724 117C1005 79 1210 20 1440 71V160H0V94Z" fill="white" />
      </svg>
      <div className="relative mx-auto max-w-6xl px-4">
        <h2 className="flex items-center justify-center gap-3 font-display text-3xl font-bold text-white sm:text-4xl">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-white/30 sm:h-9 sm:w-9">
            <Image src="/brand/logo-icon.jpg" alt="" fill sizes="36px" className="object-contain" />
          </span>
          Lo que dicen nuestros clientes
        </h2>
        <p className="mt-3 text-center text-sm text-white/70 md:hidden">Desliza para ver más opiniones</p>
        <div className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-10 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="group relative w-[86%] shrink-0 snap-center overflow-hidden rounded-2xl border border-paxo-blue/10 bg-white p-6 shadow-[0_14px_34px_-22px_rgba(8,40,94,0.42)] transition-all duration-300 hover:-translate-y-1 hover:border-paxo-red/35 hover:shadow-[0_20px_40px_-22px_rgba(8,40,94,0.5)] md:w-auto md:shrink"
              style={{
                backgroundImage: "linear-gradient(145deg, rgba(33,88,181,0.055), transparent 46%)",
              }}
            >
              <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-paxo-red via-paxo-red/70 to-paxo-blue" />

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-paxo-blue/70">
                  <BadgeCheck className="h-3.5 w-3.5 text-paxo-red" />
                  Cliente verificado
                </span>
              </div>

              <p className="mt-5 text-[0.94rem] leading-7 text-paxo-ink">{t.quote}</p>

              <div className="mt-7 flex items-center gap-3 border-t border-paxo-blue/10 pt-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-paxo-blue text-sm font-bold text-white shadow-md shadow-paxo-blue/20">
                  {initials(t.name)}
                </span>
                <div>
                  <p className="font-semibold text-paxo-ink">{t.name}</p>
                  <p className="text-xs text-paxo-ink-light">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

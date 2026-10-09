import { Quote, Star } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

// Pendiente: reemplazar por testimonios reales con autorizacion del cliente.
// No agregar insignias de "verificado" mientras sean de ejemplo.
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
    <section id="testimonios" className="relative scroll-mt-24 overflow-hidden bg-paxo-blue-dark py-20 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full border-[28px] border-white/5" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full border-[22px] border-paxo-red/20" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading tone="dark" eyebrow="Testimonios" title="Lo que dicen nuestros clientes" />
        <p className="mt-3 text-center text-sm text-white/60 md:hidden">Desliza para ver más opiniones</p>
        <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-12 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="relative flex w-[86%] shrink-0 snap-center flex-col rounded-2xl bg-white p-7 shadow-[0_24px_48px_-28px_rgba(3,15,40,0.7)] md:w-auto md:shrink"
            >
              <Quote aria-hidden className="h-8 w-8 fill-paxo-red/10 text-paxo-red" strokeWidth={1.5} />
              <div className="mt-4 flex gap-0.5 text-amber-400" aria-label="5 de 5 estrellas">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[0.95rem] leading-7 text-paxo-ink">{t.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paxo-blue text-sm font-bold text-white">
                  {initials(t.name)}
                </span>
                <div>
                  <p className="font-semibold text-paxo-ink">{t.name}</p>
                  <p className="text-xs text-paxo-ink-light">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

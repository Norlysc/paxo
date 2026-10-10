"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheck2, ClipboardCheck, HardHat, MessageSquareText, type LucideIcon } from "lucide-react";
import { cn } from "@paxo/ui";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/**
 * Proceso de trabajo en cuatro pasos. Ocupa el lugar de la galeria de
 * proyectos mientras no haya fotografias reales de obras: una galeria con
 * recuadros vacios restaba mas credibilidad de la que aportaba.
 */
const STEPS: { title: string; text: string; Icon: LucideIcon }[] = [
  {
    title: "Cuéntanos tu necesidad",
    text: "Por el formulario o WhatsApp. Un asesor revisa tu solicitud y te contacta en menos de 24 horas.",
    Icon: MessageSquareText,
  },
  {
    title: "Visita técnica sin costo",
    text: "Evaluamos el sitio, tomamos medidas y definimos contigo el alcance real del trabajo.",
    Icon: CalendarCheck2,
  },
  {
    title: "Cotización detallada",
    text: "Recibes un presupuesto claro por partidas, con materiales, plazos y condiciones.",
    Icon: ClipboardCheck,
  },
  {
    title: "Ejecución y entrega",
    text: "Nuestro equipo ejecuta según el cronograma acordado y entrega con garantía de mano de obra.",
    Icon: HardHat,
  },
];

/**
 * En pantallas tactiles no hay hover: la tarjeta que pasa por el centro de
 * la pantalla se activa sola (se agranda y se pone azul) mientras se hace
 * scroll. En escritorio el estado activo lo da el hover.
 */
function useActiveOnScroll(count: number) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.slice(0, count).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  return { refs, active };
}

export function Process() {
  const { refs, active } = useActiveOnScroll(STEPS.length);

  return (
    <section id="proceso" className="relative scroll-mt-24 overflow-hidden bg-paxo-neutral py-20 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgb(33_88_181/0.09)_1.5px,transparent_1.5px)] [background-size:22px_22px] [mask-image:linear-gradient(180deg,black,transparent_70%)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Cómo trabajamos"
            title="De la primera llamada a la entrega"
            lead="Un proceso claro y sin sorpresas, con un solo interlocutor durante todo el proyecto."
          />
        </Reveal>

        <ol className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ title, text, Icon }, i) => {
            const on = active === i;
            return (
              <Reveal as="li" key={title} delay={i * 0.08}>
                <div
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  data-index={i}
                  data-active={on}
                  className={cn(
                    "group relative h-full overflow-hidden rounded-3xl bg-white p-7 shadow-card ring-1 ring-slate-200/80 transition-all duration-500 ease-out",
                    "hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_32px_60px_-24px_rgba(24,67,142,0.6)] hover:ring-transparent",
                    "data-[active=true]:-translate-y-1 data-[active=true]:scale-[1.03] data-[active=true]:shadow-[0_32px_60px_-24px_rgba(24,67,142,0.6)] data-[active=true]:ring-transparent"
                  )}
                >
                  {/* Capa azul que aparece en el estado activo (un degradado no se puede transicionar directo). */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-br from-paxo-blue to-paxo-blue-dark opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-data-[active=true]:opacity-100"
                  />
                  <span
                    aria-hidden
                    className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[14px] border-paxo-red/0 transition-colors duration-500 group-hover:border-paxo-red/40 group-data-[active=true]:border-paxo-red/40"
                  />
                  <span
                    aria-hidden
                    className="absolute right-6 top-5 text-5xl font-black text-paxo-blue/10 transition-colors duration-500 group-hover:text-white/15 group-data-[active=true]:text-white/15"
                  >
                    0{i + 1}
                  </span>

                  <div className="relative">
                    <span
                      className="process-icon relative flex h-16 w-16 items-center justify-center rounded-2xl bg-paxo-blue/10 text-paxo-blue transition-colors duration-500 group-hover:bg-white group-data-[active=true]:bg-white"
                      style={{ "--delay": `${i * 0.45}s` } as React.CSSProperties}
                    >
                      <span aria-hidden className="process-icon__ring absolute inset-0 rounded-2xl border-2 border-paxo-blue/40" />
                      <Icon className="process-icon__glyph h-7 w-7" strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-6 text-lg font-bold text-paxo-ink transition-colors duration-500 group-hover:text-white group-data-[active=true]:text-white">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-paxo-ink-light transition-colors duration-500 group-hover:text-white/80 group-data-[active=true]:text-white/80">
                      {text}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

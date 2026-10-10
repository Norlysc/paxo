import Image from "next/image";
import { Award, CalendarClock, HardHat, Headset, type LucideIcon } from "lucide-react";
import { Button } from "@paxo/ui";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const REASONS: { title: string; text: string; Icon: LucideIcon }[] = [
  { title: "Equipo propio", text: "Personal certificado y de planta, no subcontratado.", Icon: HardHat },
  { title: "Calidad garantizada", text: "Materiales de proveedores aliados y procesos controlados.", Icon: Award },
  { title: "Plazos que se cumplen", text: "Trabajamos sobre el cronograma acordado contigo.", Icon: CalendarClock },
  { title: "Atención directa", text: "Hablas con quien ejecuta, sin intermediarios.", Icon: Headset },
];

export function WhyUsSection() {
  return (
    <section className="relative bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative h-72 overflow-hidden rounded-3xl shadow-xl ring-1 ring-slate-200 sm:h-[26rem]">
            <Image
              src="/brand/why-us-team.jpg"
              alt="Equipo de SOLUCIONES PAXO C.A. en obra"
              fill
              sizes="(max-width: 1023px) 100vw, 36rem"
              className="object-cover"
            />
          </div>
          {/* Acento de marca: escuadra roja que enmarca la foto. */}
          <span
            aria-hidden
            className="absolute -bottom-3 -left-3 -z-0 h-24 w-24 rounded-bl-3xl border-b-4 border-l-4 border-paxo-red sm:-bottom-4 sm:-left-4"
          />
        </div>

        <div>
          <SectionHeading
            align="left"
            eyebrow="Por qué elegir PAXO"
            title="Un aliado que responde por todo el proyecto"
            lead="Construcción, remodelación, mantenimiento y seguridad electrónica con un solo responsable, de principio a fin."
          />
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {REASONS.map(({ title, text, Icon }, i) => (
              <Reveal
                as="li"
                key={title}
                delay={i * 0.06}
                className="group flex gap-3.5 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-200/80 transition-all duration-300 hover:-translate-y-0.5 hover:ring-paxo-blue/25"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-paxo-blue/10 text-paxo-blue transition-colors duration-300 group-hover:bg-paxo-blue group-hover:text-white">
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <div>
                  <p className="font-semibold text-paxo-ink">{title}</p>
                  <p className="mt-0.5 text-sm leading-6 text-paxo-ink-light">{text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <a href="#cotizar" className="mt-9 inline-block">
            <Button size="lg">Solicitar Asesoría Personalizada</Button>
          </a>
        </div>
      </div>
    </section>
  );
}

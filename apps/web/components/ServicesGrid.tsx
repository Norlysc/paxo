"use client";

import {
  AirVent,
  ArrowRight,
  Building2,
  Camera,
  Droplets,
  Hammer,
  HardHat,
  KeyRound,
  Landmark,
  LayoutGrid,
  Layers,
  Paintbrush,
  PlugZap,
  Ruler,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Square,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { SERVICE_CATEGORIES, type ServiceCategorySlug } from "@paxo/shared";
import { trackEvent } from "@/lib/analytics";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const SERVICE_ICONS: Record<ServiceCategorySlug, LucideIcon> = {
  construccion: Building2,
  remodelaciones: Hammer,
  "infraestructura-civil": Landmark,
  electricidad: Zap,
  plomeria: Droplets,
  carpinteria: Ruler,
  herreria: Wrench,
  cristaleria: Square,
  "aire-acondicionado": AirVent,
  ducteria: Wind,
  pintura: Paintbrush,
  drywall: LayoutGrid,
  plycem: Layers,
  cctv: Camera,
  "cercos-electricos": ShieldAlert,
  "control-acceso": KeyRound,
  "seguridad-electronica": ShieldCheck,
  "mantenimiento-industrial": Settings,
};

/**
 * Las 18 especialidades agrupadas en cuatro lineas de negocio. Mostradas
 * sueltas eran 18 tarjetas identicas (en movil, casi dos pantallas de
 * scroll) y el visitante no distinguia que hace PAXO de un vistazo.
 */
const SERVICE_GROUPS: {
  title: string;
  description: string;
  Icon: LucideIcon;
  slugs: ServiceCategorySlug[];
}[] = [
  {
    title: "Construcción y obra civil",
    description: "Obras nuevas, ampliaciones y remodelaciones integrales, de la fundación a la entrega.",
    Icon: HardHat,
    slugs: ["construccion", "remodelaciones", "infraestructura-civil", "drywall", "plycem"],
  },
  {
    title: "Instalaciones y mantenimiento",
    description: "Sistemas eléctricos, sanitarios y de climatización, con planes preventivos y correctivos.",
    Icon: PlugZap,
    slugs: ["electricidad", "plomeria", "aire-acondicionado", "ducteria", "mantenimiento-industrial"],
  },
  {
    title: "Acabados y carpintería",
    description: "Terminaciones a medida en madera, metal y vidrio para espacios residenciales y comerciales.",
    Icon: Paintbrush,
    slugs: ["carpinteria", "herreria", "cristaleria", "pintura"],
  },
  {
    title: "Seguridad electrónica",
    description: "Protección perimetral, videovigilancia y control de acceso para hogares, comercios e industrias.",
    Icon: ShieldCheck,
    slugs: ["cctv", "cercos-electricos", "control-acceso", "seguridad-electronica"],
  },
];

const LABELS = Object.fromEntries(SERVICE_CATEGORIES.map((s) => [s.slug, s.label])) as Record<
  ServiceCategorySlug,
  string
>;

export function ServicesGrid() {
  return (
    <section id="servicios" className="relative scroll-mt-24 bg-gradient-to-b from-white via-paxo-neutral to-paxo-neutral py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Especialidades"
            title="Todos tus proyectos, un solo equipo"
            lead="Dieciocho especialidades bajo un mismo techo: no tienes que coordinar contratistas por separado."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {SERVICE_GROUPS.map(({ title, description, Icon, slugs }, i) => (
            <Reveal
              as="article"
              key={title}
              delay={(i % 2) * 0.08}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-card ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-28px_rgba(24,67,142,0.5)] sm:p-7"
            >
              {/* Franja de marca: azul a rojo, se ensancha al pasar el cursor. */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-paxo-blue via-paxo-blue to-paxo-red transition-all duration-300 group-hover:h-1.5"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-paxo-blue/[0.05]"
              />
              <div className="flex items-start gap-4">
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-paxo-blue to-paxo-blue-dark text-white shadow-lg shadow-paxo-blue/30">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-paxo-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-paxo-ink-light">{description}</p>
                </div>
              </div>

              <ul className="mt-5 grid grid-cols-2 gap-x-2 gap-y-1 border-t border-slate-100 pt-4">
                {slugs.map((slug) => {
                  const ServiceIcon = SERVICE_ICONS[slug];
                  return (
                    <li key={slug}>
                      <a
                        href="#cotizar"
                        onClick={() => trackEvent("service_view", { metadata: { service: slug } })}
                        className="group/item flex items-center gap-2 rounded-lg px-1.5 py-1.5 text-[0.8rem] sm:gap-2.5 sm:px-2 sm:text-sm font-medium text-slate-700 transition-colors hover:bg-paxo-neutral hover:text-paxo-blue"
                      >
                        <ServiceIcon className="h-4 w-4 shrink-0 text-paxo-blue/70" strokeWidth={1.9} />
                        {LABELS[slug]}
                        <ArrowRight
                          aria-hidden
                          className="ml-auto h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

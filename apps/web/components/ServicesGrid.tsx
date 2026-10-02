"use client";

import Image from "next/image";
import {
  AirVent,
  Building2,
  Camera,
  Droplets,
  Hammer,
  KeyRound,
  Landmark,
  LayoutGrid,
  Layers,
  Paintbrush,
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
import { Card, CardContent, CardTitle } from "@paxo/ui";
import { trackEvent } from "@/lib/analytics";

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

export function ServicesGrid() {
  return (
    <section id="servicios" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-paxo-red">Especialidades</p>
          <h2 className="mt-3 flex items-center justify-center gap-3 text-3xl font-black text-paxo-blue sm:text-4xl">
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-paxo-blue/10 sm:h-9 sm:w-9">
              <Image src="/brand/logo-icon.jpg" alt="" fill sizes="36px" className="object-contain" />
            </span>
            Nuestros Servicios
          </h2>
          <p className="mt-4 text-base leading-7 text-paxo-ink-light">
            Un equipo, todas las especialidades: construcción, mantenimiento y seguridad electrónica bajo un mismo
            techo.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((service) => {
            const Icon = SERVICE_ICONS[service.slug];
            return (
              <Card
                key={service.slug}
                className="group cursor-pointer border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-paxo-blue/20 hover:shadow-card"
                onClick={() => trackEvent("service_view", { metadata: { service: service.slug } })}
              >
                <CardContent className="flex items-center gap-4 pt-5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-paxo-blue/10 via-white to-paxo-red/10 text-paxo-blue ring-1 ring-paxo-blue/10 transition-all group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-paxo-blue group-hover:to-paxo-blue-dark group-hover:text-white"
                    style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 10px 20px -18px rgba(17,24,39,0.35)" }}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <CardTitle className="text-base font-semibold text-slate-800">{service.label}</CardTitle>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

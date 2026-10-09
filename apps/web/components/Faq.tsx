"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/contact";
import { SectionHeading } from "./SectionHeading";

const FAQS = [
  {
    q: "¿En qué zonas de Venezuela trabajan?",
    a: "Atendemos proyectos residenciales, comerciales e industriales a nivel nacional, con base operativa en la región central del país.",
  },
  {
    q: "¿Cómo funciona el proceso de cotización?",
    a: "Completas el formulario o nos escribes por WhatsApp, un asesor evalúa tu solicitud y coordinamos una visita técnica sin costo para entregarte una cotización detallada.",
  },
  {
    q: "¿Ofrecen garantía en sus trabajos?",
    a: "Sí, todos nuestros proyectos incluyen garantía sobre mano de obra y, según el fabricante, sobre los materiales y equipos instalados.",
  },
  {
    q: "¿Trabajan con proyectos industriales de mantenimiento continuo?",
    a: "Sí, contamos con planes de mantenimiento preventivo y correctivo para plantas industriales y comercios.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-24 overflow-hidden bg-paxo-neutral py-20 sm:py-24">
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <SectionHeading align="left" eyebrow="Preguntas frecuentes" title="Resolvemos tus dudas" />
          <div className="mt-8 space-y-3">
            {FAQS.map((item, i) => (
              <details
                key={item.q}
                open={i === 0}
                className="group rounded-2xl border border-slate-200 bg-white px-5 transition-colors open:border-paxo-blue/25 open:shadow-soft"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-paxo-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paxo-neutral text-paxo-blue transition-all group-open:rotate-180 group-open:bg-paxo-blue group-open:text-white">
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <p className="-mt-1 pb-5 pr-12 text-sm leading-6 text-paxo-ink-light">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-sm text-paxo-ink-light">
            ¿Tienes otra pregunta?{" "}
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { metadata: { source: "faq" } })}
              className="font-semibold text-paxo-blue underline-offset-4 hover:underline"
            >
              Escríbenos por WhatsApp
            </a>
          </p>
        </div>

        <div className="relative mx-auto hidden h-80 w-full max-w-sm lg:block lg:h-[29rem] lg:max-w-md">
          <div aria-hidden className="absolute inset-x-6 bottom-0 top-16 rounded-full bg-paxo-blue/10" />
          <Image
            src="/brand/paxo-worker.png"
            alt="Profesional de SOLUCIONES PAXO C.A. disponible para responder tus preguntas"
            fill
            sizes="(max-width: 1023px) 24rem, 32rem"
            className="object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
}

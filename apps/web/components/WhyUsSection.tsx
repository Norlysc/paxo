import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const REASONS = [
  "Equipo propio y personal certificado",
  "Materiales y procesos de calidad garantizada",
  "Cumplimiento del cronograma acordado",
  "Atención directa, sin intermediarios",
];

export function WhyUsSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div className="relative h-72 overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-paxo-neutral-dark sm:h-96">
          <Image
            src="/brand/why-us-team.jpg"
            alt="Equipo de SOLUCIONES PAXO C.A. en obra"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="flex items-center gap-3 font-display text-3xl font-bold text-paxo-blue sm:text-4xl">
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-paxo-blue/10 sm:h-9 sm:w-9">
              <Image src="/brand/logo-icon.jpg" alt="" fill sizes="36px" className="object-contain" />
            </span>
            Por qué elegir PAXO
          </h2>
          <p className="mt-4 text-paxo-ink-light">
            Somos un solo equipo para todo el ciclo de tu proyecto: construcción, remodelación, mantenimiento y
            seguridad electrónica, sin tener que coordinar contratistas por separado.
          </p>
          <ul className="mt-6 space-y-3">
            {REASONS.map((reason) => (
              <li key={reason} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-paxo-blue" strokeWidth={1.75} />
                <span className="text-paxo-ink">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

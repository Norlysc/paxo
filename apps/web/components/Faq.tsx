import Image from "next/image";

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
    <section id="faq" className="relative overflow-hidden bg-paxo-neutral py-20">
      <div aria-hidden className="pointer-events-none absolute -right-32 top-12 h-80 w-80 rounded-full border-[28px] border-paxo-blue/5" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <h2 className="flex items-center gap-3 font-display text-3xl font-bold text-paxo-blue sm:text-4xl">
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-paxo-blue/10 sm:h-9 sm:w-9">
              <Image src="/brand/logo-icon.jpg" alt="" fill sizes="36px" className="object-contain" />
            </span>
            Preguntas Frecuentes
          </h2>
          <div className="mt-8 divide-y divide-paxo-neutral-dark rounded-2xl border border-paxo-neutral-dark bg-white shadow-sm">
            {FAQS.map((item) => (
              <details key={item.q} className="group p-5">
                <summary className="cursor-pointer list-none font-semibold text-paxo-ink marker:content-none">
                  <span className="flex items-center justify-between">
                    {item.q}
                    <span className="ml-4 text-paxo-red transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-paxo-ink-light">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="relative mx-auto hidden h-80 w-full max-w-sm lg:block lg:h-[29rem] lg:max-w-md">
          <Image
            src="/brand/paxo-worker.png"
            alt="Profesional de SOLUCIONES PAXO C.A. disponible para responder tus preguntas"
            fill
            sizes="(max-width: 1023px) 24rem, 32rem"
            className="object-contain object-right-bottom"
          />
        </div>
      </div>
    </section>
  );
}

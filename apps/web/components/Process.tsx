import { CalendarCheck2, ClipboardCheck, HardHat, MessageSquareText, type LucideIcon } from "lucide-react";
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

export function Process() {
  return (
    <section id="proceso" className="scroll-mt-24 bg-paxo-neutral py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Cómo trabajamos"
          title="De la primera llamada a la entrega"
          lead="Un proceso claro y sin sorpresas, con un solo interlocutor durante todo el proyecto."
        />

        <ol className="relative mt-12 grid grid-cols-1 gap-7 sm:mt-14 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-6">
          {/* Linea que une los pasos en escritorio. */}
          <span
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-paxo-blue/30 via-paxo-red/40 to-paxo-blue/30 lg:block"
          />
          {STEPS.map(({ title, text, Icon }, i) => (
            <li key={title} className="relative flex gap-5 sm:block sm:text-center">
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-paxo-blue shadow-card ring-1 ring-slate-200 sm:mx-auto">
                <Icon className="h-6 w-6" strokeWidth={1.75} />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-paxo-red text-[0.7rem] font-bold text-white ring-2 ring-paxo-neutral">
                  {i + 1}
                </span>
              </span>
              {/* En movil el paso va en fila (icono + texto) para no alargar la pagina. */}
              <div>
                <h3 className="text-base font-bold text-paxo-ink sm:mt-5">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-paxo-ink-light sm:mx-auto sm:mt-2 sm:max-w-[16rem]">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

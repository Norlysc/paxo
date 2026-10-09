import { cn } from "@paxo/ui";

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "center" | "left";
  /** Para secciones con fondo azul oscuro. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Encabezado unico para todas las secciones: etiqueta superior con la barra
 * roja de marca, titulo y bajada opcional. Centralizarlo evita que cada
 * seccion invente su propio peso, tamano o adorno.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl", className)}>
      <p
        className={cn(
          "inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em]",
          // El rojo de marca no alcanza contraste sobre el azul oscuro; ahi se
          // usa un tinte claro del mismo rojo.
          dark ? "text-[#ffc2c7]" : "text-paxo-red"
        )}
      >
        <span aria-hidden className={cn("h-0.5 w-6 rounded-full", dark ? "bg-[#ffc2c7]" : "bg-paxo-red")} />
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-3 text-balance text-3xl font-extrabold leading-tight sm:text-4xl",
          dark ? "text-white" : "text-paxo-blue-dark"
        )}
      >
        {title}
      </h2>
      {lead && (
        <p className={cn("mt-4 text-base leading-7", dark ? "text-white/75" : "text-paxo-ink-light")}>{lead}</p>
      )}
    </div>
  );
}

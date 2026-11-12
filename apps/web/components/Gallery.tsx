"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { ChevronLeft, ChevronRight, Expand, Pause, Play, X } from "lucide-react";
import { GALLERY_CATEGORIES, OBRAS, type Obra } from "@/lib/gallery";
import { SectionHeading } from "./SectionHeading";

const nombre = (o: Obra) =>
  o.titulo ?? (o.categoria ? `Trabajo de ${GALLERY_CATEGORIES[o.categoria].toLowerCase()} realizado por PAXO` : "Trabajo realizado por PAXO");

/**
 * Galeria de obras como cinta continua: las fotos pasan solas sin parar y en
 * bucle. Se puede arrastrar con el mouse o deslizar con el dedo, y la cinta
 * retoma sola al soltar. Se detiene con el cursor encima, con el boton de
 * pausa, mientras hay una foto ampliada y con prefers-reduced-motion.
 * Todas las tarjetas son 4:5 (las prepara scripts/preparar-fotos-obras.mjs).
 */
export function Gallery() {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  const autoScroll = useRef(
    AutoScroll({
      speed: 0.9,
      startDelay: 600,
      stopOnInteraction: false,
      // Solo con mouse real: en pantallas tactiles el navegador simula la
      // entrada del cursor al tocar pero nunca su salida, y la cinta quedaba
      // detenida para siempre despues de deslizar.
      stopOnMouseEnter: typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches,
      stopOnFocusIn: false,
    })
  );
  const [viewportRef, embla] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    reduceMotion ? [] : [autoScroll.current]
  );
  const [pausada, setPausada] = useState(false);
  const [ampliada, setAmpliada] = useState<number | null>(null);
  // Quieta mientras alguien recorre las fotos con el teclado. No se usa
  // stopOnFocusIn del plugin: tras un toque la foto queda con foco y la cinta
  // no volvia a arrancar en movil.
  const [conTeclado, setConTeclado] = useState(false);

  // La cinta solo corre si nadie la pauso y no hay una foto ampliada.
  const detenida = pausada || ampliada !== null || conTeclado;
  const detenidaRef = useRef(detenida);
  detenidaRef.current = detenida;

  useEffect(() => {
    const plugin = embla?.plugins().autoScroll;
    if (!plugin) return;
    if (detenida) plugin.stop();
    else plugin.play();
  }, [embla, detenida]);

  // El plugin se reanuda solo tras cada toque, arrastre o salida del cursor
  // (p. ej. al abrir una foto): si debe estar quieta, se vuelve a detener. El
  // stop va diferido porque el plugin termina de arrancar despues de avisar.
  useEffect(() => {
    if (!embla) return;
    const alReanudar = () => {
      if (detenidaRef.current) setTimeout(() => detenidaRef.current && embla.plugins().autoScroll?.stop(), 0);
    };
    embla.on("autoScroll:play", alReanudar);
    return () => {
      embla.off("autoScroll:play", alReanudar);
    };
  }, [embla]);

  // Las flechas mueven una foto y la cinta sigue desde ahi.
  const mover = useCallback(
    (paso: 1 | -1) => {
      if (!embla) return;
      if (paso === 1) embla.scrollNext();
      else embla.scrollPrev();
    },
    [embla]
  );

  if (OBRAS.length === 0) return null;
  const total = OBRAS.length;

  return (
    <section id="obras" className="relative scroll-mt-24 overflow-hidden bg-[#071d45] py-20 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_100%,rgba(33,88,181,0.45),transparent_70%)]"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          align="left"
          tone="dark"
          eyebrow="Obras realizadas"
          title="Nuestro trabajo en obra"
          lead="Fotos reales de trabajos hechos por nuestro equipo. Toca una para verla en grande."
        />
        <div className="flex gap-2">
          {!reduceMotion && (
            <BotonRedondo label={pausada ? "Reanudar galería" : "Pausar galería"} onClick={() => setPausada((p) => !p)}>
              {pausada ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </BotonRedondo>
          )}
          <BotonRedondo label="Foto anterior" onClick={() => mover(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </BotonRedondo>
          <BotonRedondo label="Foto siguiente" onClick={() => mover(1)}>
            <ChevronRight className="h-5 w-5" />
          </BotonRedondo>
        </div>
      </div>

      <div className="relative mt-10 sm:mt-12" role="region" aria-roledescription="carrusel" aria-label="Fotos de obras realizadas">
        <div
          ref={viewportRef}
          onFocus={(e) => setConTeclado(e.target.matches(":focus-visible"))}
          onBlur={() => setConTeclado(false)}
          className="cursor-grab overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] active:cursor-grabbing"
        >
          <div className="flex touch-pan-y">
            {OBRAS.map((obra, i) => (
              <div
                key={obra.id}
                role="group"
                aria-roledescription="diapositiva"
                aria-label={`${i + 1} de ${total}`}
                className="min-w-0 shrink-0 grow-0 basis-[62%] px-2 sm:basis-[38%] md:basis-[28%] lg:basis-[22%] xl:basis-[19%]"
              >
                <button
                  type="button"
                  // Embla descarta el clic que sigue a un arrastre: esto solo corre con un toque real.
                  onClick={() => setAmpliada(i)}
                  aria-label={`Ver en grande: ${nombre(obra)}`}
                  className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-[#0b2a5e] shadow-[0_30px_50px_-30px_rgba(0,0,0,0.8)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
                >
                  <Image
                    src={obra.foto}
                    alt={nombre(obra)}
                    fill
                    draggable={false}
                    sizes="(max-width: 639px) 62vw, (max-width: 767px) 38vw, (max-width: 1023px) 28vw, 22vw"
                    className="select-none object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/65 via-black/20 to-transparent p-3 pt-14 sm:p-4 sm:pt-16">
                    {obra.categoria && (
                      <span className="rounded-full bg-white/15 px-2.5 py-1 text-[0.7rem] font-semibold text-white ring-1 ring-white/25 backdrop-blur-md sm:text-xs">
                        {GALLERY_CATEGORIES[obra.categoria]}
                      </span>
                    )}
                    <span className="ml-auto flex h-8 w-8 scale-75 items-center justify-center rounded-full bg-white text-paxo-blue-dark opacity-0 shadow-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                      <Expand className="h-4 w-4" aria-hidden />
                    </span>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <VistaAmpliada indice={ampliada} onCambiar={setAmpliada} />
    </section>
  );
}

function BotonRedondo({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors hover:bg-white hover:text-paxo-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      {children}
    </button>
  );
}

function VistaAmpliada({ indice, onCambiar }: { indice: number | null; onCambiar: (i: number | null) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const obra = indice === null ? undefined : OBRAS[indice];

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (obra && !d.open) d.showModal();
    if (!obra && d.open) d.close();
  }, [obra]);

  const mover = (paso: number) => {
    if (indice === null) return;
    onCambiar((indice + paso + OBRAS.length) % OBRAS.length);
  };

  return (
    <dialog
      ref={ref}
      onClose={() => onCambiar(null)}
      onClick={(e) => e.target === ref.current && onCambiar(null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") mover(1);
        if (e.key === "ArrowLeft") mover(-1);
      }}
      aria-label={obra ? nombre(obra) : "Foto"}
      className="m-auto w-fit max-w-[calc(100vw-1.5rem)] overflow-visible bg-transparent p-0 backdrop:bg-[#030d22]/90 backdrop:backdrop-blur-sm"
    >
      {obra && indice !== null && (
        <div className="relative">
          {/* img nativo: la vista toma el tamano real de cada foto (vertical u
              horizontal) y los controles quedan pegados a ella. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={obra.fotoGrande}
            alt={nombre(obra)}
            className="mx-auto block max-h-[78vh] w-auto max-w-full rounded-2xl shadow-2xl"
          />
          <div className="mt-3 flex items-center justify-between gap-4 text-white">
            <p className="text-sm font-semibold">
              {obra.categoria ? GALLERY_CATEGORIES[obra.categoria] : "Trabajo realizado"}
              <span className="ml-3 tabular-nums text-white/60">
                {indice + 1} / {OBRAS.length}
              </span>
            </p>
            <div className="flex gap-2">
              <BotonRedondo label="Foto anterior" onClick={() => mover(-1)}>
                <ChevronLeft className="h-5 w-5" />
              </BotonRedondo>
              <BotonRedondo label="Foto siguiente" onClick={() => mover(1)}>
                <ChevronRight className="h-5 w-5" />
              </BotonRedondo>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onCambiar(null)}
            aria-label="Cerrar"
            autoFocus
            className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-paxo-blue-dark shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paxo-red"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </dialog>
  );
}

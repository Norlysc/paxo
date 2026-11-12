"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@paxo/ui";
import { GALLERY_CATEGORIES, OBRAS, type Obra } from "@/lib/gallery";
import { SectionHeading } from "./SectionHeading";

const nombre = (o: Obra) =>
  o.titulo ?? (o.categoria ? `Trabajo de ${GALLERY_CATEGORIES[o.categoria].toLowerCase()} realizado por PAXO` : "Trabajo realizado por PAXO");

/**
 * Galeria de obras en bucle: se arrastra con el mouse o se desliza con el
 * dedo, avanza sola despacio y se detiene en cuanto alguien interactua. La
 * foto central se ve completa; las vecinas quedan mas chicas y atenuadas.
 * Todas las tarjetas son 4:5 (las prepara scripts/preparar-fotos-obras.mjs).
 */
export function Gallery() {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  const autoplay = useRef(Autoplay({ delay: 4500, stopOnInteraction: true, stopOnMouseEnter: true }));
  const [viewportRef, embla] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false, duration: 32 },
    reduceMotion ? [] : [autoplay.current]
  );
  const [actual, setActual] = useState(0);
  const [ampliada, setAmpliada] = useState<number | null>(null);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setActual(embla.selectedScrollSnap());
    onSelect();
    embla.on("select", onSelect).on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect).off("reInit", onSelect);
    };
  }, [embla]);

  const anterior = useCallback(() => embla?.scrollPrev(), [embla]);
  const siguiente = useCallback(() => embla?.scrollNext(), [embla]);

  // Embla ya descarta el clic que sigue a un arrastre, asi que esto solo
  // corre con un toque real: la foto central se amplia, una lateral se centra.
  const alTocar = (i: number) => {
    if (i === actual) setAmpliada(i);
    else embla?.scrollTo(i);
  };

  if (OBRAS.length === 0) return null;
  const total = OBRAS.length;
  const pad = (n: number) => String(n).padStart(2, "0");

  const controles = (
    <div className="flex items-center gap-4">
      <span className="text-sm font-semibold tabular-nums text-white/70" aria-live="polite">
        <span className="text-white">{pad(actual + 1)}</span> / {pad(total)}
      </span>
      <div className="flex gap-2">
        <BotonRedondo label="Foto anterior" onClick={anterior}>
          <ChevronLeft className="h-5 w-5" />
        </BotonRedondo>
        <BotonRedondo label="Foto siguiente" onClick={siguiente}>
          <ChevronRight className="h-5 w-5" />
        </BotonRedondo>
      </div>
    </div>
  );

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
          lead="Fotos reales de trabajos hechos por nuestro equipo. Desliza para ver más."
        />
        <div className="hidden md:block">{controles}</div>
      </div>

      <div
        className="relative mt-10 sm:mt-12"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Fotos de obras realizadas"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") anterior();
          if (e.key === "ArrowRight") siguiente();
        }}
      >
        <div ref={viewportRef} className="cursor-grab overflow-hidden active:cursor-grabbing">
          <div className="flex touch-pan-y">
            {OBRAS.map((obra, i) => {
              const activa = i === actual;
              return (
                <div
                  key={obra.id}
                  role="group"
                  aria-roledescription="diapositiva"
                  aria-label={`${i + 1} de ${total}`}
                  className="min-w-0 shrink-0 grow-0 basis-[74%] px-2 sm:basis-[46%] md:basis-[36%] lg:basis-[30%] xl:basis-[27%]"
                >
                  <button
                    type="button"
                    onClick={() => alTocar(i)}
                    aria-label={activa ? `Ver en grande: ${nombre(obra)}` : `Ir a la foto ${i + 1}`}
                    tabIndex={activa ? 0 : -1}
                    className={cn(
                      "group relative block aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-[#0b2a5e] transition-[transform,opacity,box-shadow] duration-500 ease-out",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70",
                      activa
                        ? "scale-100 opacity-100 shadow-[0_40px_70px_-30px_rgba(0,0,0,0.85)]"
                        : "scale-[0.86] opacity-45 hover:opacity-70"
                    )}
                  >
                    <Image
                      src={obra.foto}
                      alt={nombre(obra)}
                      fill
                      draggable={false}
                      sizes="(max-width: 639px) 74vw, (max-width: 767px) 46vw, (max-width: 1023px) 36vw, 30vw"
                      className="select-none object-cover"
                    />
                    <span
                      className={cn(
                        "pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-4 pt-16 transition-opacity duration-500",
                        activa ? "opacity-100" : "opacity-0"
                      )}
                    >
                      {obra.categoria && (
                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur-md">
                          {GALLERY_CATEGORIES[obra.categoria]}
                        </span>
                      )}
                      <span className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-paxo-blue-dark shadow-md transition-transform duration-300 group-hover:scale-110">
                        <Expand className="h-4 w-4" aria-hidden />
                      </span>
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        {/* Avance: la barra roja recorre el total de fotos. */}
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-paxo-red transition-[width] duration-500 ease-out"
            style={{ width: `${((actual + 1) / total) * 100}%` }}
          />
        </div>
        <div className="mt-6 flex justify-center md:hidden">{controles}</div>
      </div>

      <VistaAmpliada
        indice={ampliada}
        onCambiar={(i) => {
          setAmpliada(i);
          if (i !== null) embla?.scrollTo(i, true);
        }}
      />
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

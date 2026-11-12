"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Expand, Pause, Play, X } from "lucide-react";
import { cn } from "@paxo/ui";
import { GALLERY_CATEGORIES, OBRAS, type Obra } from "@/lib/gallery";
import { SectionHeading } from "./SectionHeading";

const nombre = (o: Obra) =>
  o.titulo ?? (o.categoria ? `Trabajo de ${GALLERY_CATEGORIES[o.categoria].toLowerCase()} realizado por PAXO` : "Trabajo realizado por PAXO");

/** Tiempo que la foto central queda quieta antes de pasar a la siguiente. */
const PAUSA_MS = 2000;
/** Lo que tarda el deslizamiento (duration: 38 de Embla), medido en pantalla. */
const DESLIZAMIENTO_MS = 650;
/** Escala y opacidad de las fotos laterales (la central va a 1). */
const ESCALA_LATERAL = 0.84;
const OPACIDAD_LATERAL = 0.4;
/** Con 0.9 las vecinas inmediatas quedan casi en la escala/opacidad lateral. */
const TWEEN_BASE = 0.9;

type EmblaCarouselType = NonNullable<UseEmblaCarouselType[1]>;

/**
 * Escala y atenua cada foto segun su distancia al centro, en cada cuadro del
 * desplazamiento: la foto crece y se aclara mientras llega al centro en vez
 * de cambiar de golpe. Adaptado del ejemplo "tween scale" de Embla,
 * incluyendo la correccion de distancia para las copias del bucle.
 */
function aplicarFoco(embla: EmblaCarouselType, nodos: HTMLElement[]) {
  const engine = embla.internalEngine();
  const progreso = embla.scrollProgress();
  const factor = TWEEN_BASE * embla.scrollSnapList().length;

  embla.scrollSnapList().forEach((snap, snapIndex) => {
    for (const slideIndex of engine.slideRegistry[snapIndex] ?? []) {
      let distancia = snap - progreso;
      if (engine.options.loop) {
        for (const loopItem of engine.slideLooper.loopPoints) {
          const target = loopItem.target();
          if (slideIndex === loopItem.index && target !== 0) {
            distancia = Math.sign(target) === -1 ? snap - (1 + progreso) : snap + (1 - progreso);
          }
        }
      }
      const cercania = Math.min(Math.max(1 - Math.abs(distancia * factor), 0), 1);
      const nodo = nodos[slideIndex];
      if (!nodo) continue;
      nodo.style.transform = `scale(${ESCALA_LATERAL + (1 - ESCALA_LATERAL) * cercania})`;
      nodo.style.opacity = String(OPACIDAD_LATERAL + (1 - OPACIDAD_LATERAL) * cercania);
    }
  });
}

/**
 * Galeria de obras en bucle con foco central: la foto del medio queda 2 s
 * destacada y las laterales mas chicas y atenuadas; luego se desliza a la
 * siguiente. Se arrastra con el mouse o se desliza con el dedo y retoma sola
 * al soltar. Se detiene con el cursor encima (solo con mouse real), con el
 * boton de pausa, al recorrerla con teclado, mientras hay una foto ampliada
 * y con prefers-reduced-motion. Tarjetas 4:5 (scripts/preparar-fotos-obras.mjs).
 */
export function Gallery() {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  const autoplay = useRef(
    Autoplay({
      // El retardo de Autoplay cuenta desde que empieza el deslizamiento:
      // se le suma su duracion para que la foto quede quieta PAUSA_MS completos.
      delay: PAUSA_MS + DESLIZAMIENTO_MS,
      stopOnInteraction: false,
      // Solo con mouse real: en pantallas tactiles el navegador simula la
      // entrada del cursor al tocar pero nunca su salida, y quedaba detenida.
      stopOnMouseEnter: typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches,
      stopOnFocusIn: false,
    })
  );
  const [viewportRef, embla] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false, duration: 38 },
    reduceMotion ? [] : [autoplay.current]
  );
  const nodos = useRef<HTMLElement[]>([]);
  const [actual, setActual] = useState(0);
  const [pausada, setPausada] = useState(false);
  const [ampliada, setAmpliada] = useState<number | null>(null);
  // Quieta mientras alguien recorre las fotos con el teclado (no se usa
  // stopOnFocusIn: tras un toque la foto queda con foco y no volvia a arrancar).
  const [conTeclado, setConTeclado] = useState(false);

  // Foco central fluido + indice actual.
  useEffect(() => {
    if (!embla) return;
    const alMover = () => aplicarFoco(embla, nodos.current);
    const alElegir = () => setActual(embla.selectedScrollSnap());
    alMover();
    alElegir();
    embla.on("scroll", alMover).on("reInit", alMover).on("select", alElegir).on("reInit", alElegir);
    return () => {
      embla.off("scroll", alMover).off("reInit", alMover).off("select", alElegir).off("reInit", alElegir);
    };
  }, [embla]);

  const detenida = pausada || ampliada !== null || conTeclado;
  const detenidaRef = useRef(detenida);
  detenidaRef.current = detenida;

  useEffect(() => {
    const plugin = embla?.plugins().autoplay;
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
      if (detenidaRef.current) setTimeout(() => detenidaRef.current && embla.plugins().autoplay?.stop(), 0);
    };
    embla.on("autoplay:play", alReanudar);
    return () => {
      embla.off("autoplay:play", alReanudar);
    };
  }, [embla]);

  const anterior = useCallback(() => embla?.scrollPrev(), [embla]);
  const siguiente = useCallback(() => embla?.scrollNext(), [embla]);

  // Embla descarta el clic que sigue a un arrastre: esto solo corre con un
  // toque real. La foto central se amplia; una lateral se centra.
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
        {!reduceMotion && (
          <BotonRedondo label={pausada ? "Reanudar galería" : "Pausar galería"} onClick={() => setPausada((p) => !p)}>
            {pausada ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </BotonRedondo>
        )}
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
          lead="Fotos reales de trabajos hechos por nuestro equipo. Toca la foto del centro para verla en grande."
        />
        <div className="hidden md:block">{controles}</div>
      </div>

      <div className="relative mt-10 sm:mt-12" role="region" aria-roledescription="carrusel" aria-label="Fotos de obras realizadas">
        <div
          ref={viewportRef}
          onFocus={(e) => setConTeclado(e.target.matches(":focus-visible"))}
          onBlur={() => setConTeclado(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") anterior();
            if (e.key === "ArrowRight") siguiente();
          }}
          className="cursor-grab overflow-hidden active:cursor-grabbing"
        >
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
                    ref={(el) => {
                      if (el) nodos.current[i] = el;
                    }}
                    type="button"
                    onClick={() => alTocar(i)}
                    aria-label={activa ? `Ver en grande: ${nombre(obra)}` : `Ir a la foto ${i + 1}`}
                    tabIndex={activa ? 0 : -1}
                    // Escala y opacidad las fija aplicarFoco en cada cuadro;
                    // aqui no hay transicion para no desfasarlas del arrastre.
                    className={cn(
                      "group relative block aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-[#0b2a5e] will-change-transform",
                      "transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70",
                      activa && "shadow-[0_40px_70px_-30px_rgba(0,0,0,0.85)]"
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

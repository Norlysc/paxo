"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ChevronsLeftRight, Expand, MapPin, X } from "lucide-react";
import { cn } from "@paxo/ui";
import { GALLERY_CATEGORIES, OBRAS, type GalleryCategory, type Obra } from "@/lib/gallery";
import { SectionHeading } from "./SectionHeading";

const CATEGORY_LABEL = Object.fromEntries(GALLERY_CATEGORIES.map((c) => [c.id, c.label])) as Record<GalleryCategory, string>;

/**
 * Galeria de obras: filtro por categoria, una obra destacada con comparador
 * antes/despues y vista ampliada. No se renderiza mientras no haya obras
 * cargadas en lib/gallery.ts.
 */
export function Gallery() {
  const [filtro, setFiltro] = useState<GalleryCategory | "todas">("todas");
  const [abierta, setAbierta] = useState<number | null>(null);

  const categorias = useMemo(() => GALLERY_CATEGORIES.filter((c) => OBRAS.some((o) => o.categoria === c.id)), []);
  const visibles = useMemo(() => (filtro === "todas" ? OBRAS : OBRAS.filter((o) => o.categoria === filtro)), [filtro]);
  // La destacada es la primera con "antes": es la que mejor cuenta el trabajo.
  const destacada = useMemo(() => {
    const i = visibles.findIndex((o) => o.antes);
    return i === -1 ? 0 : i;
  }, [visibles]);

  if (OBRAS.length === 0) return null;

  const orden = visibles.map((_, i, arr) => arr[i === 0 ? destacada : i <= destacada ? i - 1 : i]!);

  return (
    <section id="obras" className="scroll-mt-24 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Proyectos"
          title="Nuestras obras"
          lead="Trabajos ejecutados por nuestro equipo. Toca una foto para verla en grande."
        />

        {categorias.length > 1 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Filtrar obras por categoría">
            {[{ id: "todas" as const, label: "Todas" }, ...categorias].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={filtro === c.id}
                onClick={() => setFiltro(c.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paxo-blue focus-visible:ring-offset-2",
                  filtro === c.id
                    ? "bg-paxo-blue-dark text-white"
                    : "bg-paxo-neutral text-paxo-ink-light ring-1 ring-slate-200 hover:text-paxo-blue"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 grid auto-rows-[10.5rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] md:grid-cols-4 md:gap-4 lg:auto-rows-[13.5rem]">
          {orden.map((obra, i) =>
            i === 0 ? (
              <ObraDestacada key={obra.id} obra={obra} onAbrir={() => setAbierta(OBRAS.indexOf(obra))} />
            ) : (
              <button
                key={obra.id}
                type="button"
                onClick={() => setAbierta(OBRAS.indexOf(obra))}
                className="group relative overflow-hidden rounded-2xl bg-slate-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paxo-blue focus-visible:ring-offset-2"
              >
                <Image
                  src={obra.foto}
                  alt={obra.titulo}
                  fill
                  sizes="(max-width: 767px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Pie obra={obra} />
              </button>
            )
          )}
        </div>
      </div>

      <VistaAmpliada indice={abierta} onCambiar={setAbierta} />
    </section>
  );
}

function Pie({ obra, grande = false }: { obra: Obra; grande?: boolean }) {
  return (
    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071d45]/90 via-[#071d45]/45 to-transparent p-3 pt-10 sm:p-4 sm:pt-12">
      <span className={cn("block font-bold leading-snug text-white", grande ? "text-lg sm:text-xl" : "text-sm sm:text-base")}>
        {obra.titulo}
      </span>
      {obra.ubicacion && (
        <span className="mt-0.5 flex items-center gap-1 text-xs text-white/75">
          <MapPin className="h-3 w-3" aria-hidden />
          {obra.ubicacion}
        </span>
      )}
      {obra.antes && !grande && (
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[0.68rem] font-semibold text-white ring-1 ring-white/25">
          <ChevronsLeftRight className="h-3 w-3" aria-hidden />
          Antes y después
        </span>
      )}
    </span>
  );
}

function ObraDestacada({ obra, onAbrir }: { obra: Obra; onAbrir: () => void }) {
  return (
    <div className="relative col-span-2 row-span-2 overflow-hidden rounded-3xl bg-slate-200 shadow-card">
      {obra.antes ? (
        <Comparador antes={obra.antes} despues={obra.foto} titulo={obra.titulo} />
      ) : (
        <button type="button" onClick={onAbrir} className="group absolute inset-0" aria-label={`Ver ${obra.titulo} en grande`}>
          <Image src={obra.foto} alt={obra.titulo} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        </button>
      )}
      <Pie obra={obra} grande />
      <button
        type="button"
        onClick={onAbrir}
        aria-label={`Ver ${obra.titulo} en grande`}
        className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-paxo-blue-dark shadow-md transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paxo-blue"
      >
        <Expand className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * Comparador antes/despues: la foto "antes" se recorta sobre la "despues".
 * El control es un input range real, asi que funciona con teclado y lector
 * de pantalla, ademas de arrastrar con el dedo o el mouse.
 */
function Comparador({ antes, despues, titulo, contain = false }: { antes: string; despues: string; titulo: string; contain?: boolean }) {
  const [pos, setPos] = useState(50);
  const fit = contain ? "object-contain" : "object-cover";
  return (
    <div className="absolute inset-0 select-none">
      <Image src={despues} alt={`${titulo}, después`} fill sizes="(max-width: 767px) 100vw, 60vw" className={fit} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={antes} alt={`${titulo}, antes`} fill sizes="(max-width: 767px) 100vw, 60vw" className={fit} />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white">Antes</span>
      <span className="pointer-events-none absolute right-14 top-3 rounded-full bg-paxo-red px-2.5 py-1 text-xs font-semibold text-white">Después</span>

      <div className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.45)]" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-paxo-blue-dark shadow-lg ring-4 ring-white/40">
          <ChevronsLeftRight className="h-5 w-5" />
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Comparar antes y después: ${titulo}`}
        className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
      />
      <span className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] ring-inset peer-focus-visible:ring-4 peer-focus-visible:ring-paxo-blue" />
    </div>
  );
}

function VistaAmpliada({ indice, onCambiar }: { indice: number | null; onCambiar: (i: number | null) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const obra = indice === null ? null : OBRAS[indice];

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
        // En el comparador las flechas mueven la barra, no cambian de obra.
        if ((e.target as HTMLElement).tagName === "INPUT") return;
        if (e.key === "ArrowRight") mover(1);
        if (e.key === "ArrowLeft") mover(-1);
      }}
      aria-label={obra ? obra.titulo : "Obra"}
      className="m-auto w-[min(64rem,calc(100vw-1.5rem))] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-[#030d22]/85 backdrop:backdrop-blur-sm"
    >
      {obra && (
        <div className="relative overflow-hidden rounded-2xl bg-[#071d45] text-white shadow-2xl">
          <div className="relative aspect-[4/3] max-h-[70vh] w-full bg-black">
            {obra.antes ? (
              <Comparador key={obra.id} antes={obra.antes} despues={obra.foto} titulo={obra.titulo} contain />
            ) : (
              <Image src={obra.foto} alt={obra.titulo} fill sizes="100vw" className="object-contain" />
            )}
          </div>
          <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
            <div>
              <p className="text-xs font-semibold text-[#ffc2c7]">{CATEGORY_LABEL[obra.categoria]}</p>
              <h3 className="mt-1 text-lg font-bold sm:text-xl">{obra.titulo}</h3>
              {obra.ubicacion && (
                <p className="mt-1 flex items-center gap-1 text-sm text-white/70">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {obra.ubicacion}
                </p>
              )}
              {obra.descripcion && <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">{obra.descripcion}</p>}
            </div>
            {OBRAS.length > 1 && (
              <div className="flex shrink-0 gap-2">
                <BotonVista label="Obra anterior" onClick={() => mover(-1)}>
                  <ChevronLeft className="h-5 w-5" />
                </BotonVista>
                <BotonVista label="Obra siguiente" onClick={() => mover(1)}>
                  <ChevronRight className="h-5 w-5" />
                </BotonVista>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => onCambiar(null)}
            aria-label="Cerrar"
            autoFocus
            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-paxo-blue-dark shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paxo-red"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </dialog>
  );
}

function BotonVista({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors hover:bg-white hover:text-paxo-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      {children}
    </button>
  );
}

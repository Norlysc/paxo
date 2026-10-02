"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@paxo/ui";

const PROJECT_PHOTOS = Array.from({ length: 8 }, (_, i) => i + 1);

/**
 * Empresas clientes de PAXO.
 *
 * Para mostrar el logo real de una empresa, coloca el archivo en
 * apps/web/public/clientes/ y escribe su ruta en `logo`. Formato preferido:
 * PNG o SVG con fondo transparente, alto minimo 120 px. Mientras `logo` sea
 * null se muestra el nombre compuesto (`destacado` + `complemento`), que
 * mantiene la seccion presentable sin parecer un marcador de posicion.
 */
type Cliente = {
  nombre: string;
  logo: string;
  /**
   * Altura maxima del logo dentro de la tarjeta, como clase de Tailwind.
   * Se ajusta por marca y no de forma uniforme: a igual altura, un logo
   * apaisado ocupa el triple de ancho que uno cuadrado y lo hace parecer
   * diminuto. Los cuadrados suben a 64 px y los alargados bajan a 40 px
   * para que todos pesen visualmente parecido.
   */
  alto: string;
};

const CLIENTES: Cliente[] = [
  // Proporcion 1.08 — casi cuadrado, necesita mas altura.
  { nombre: "Estar Seguros", logo: "/clientes/estar-seguros.png", alto: "max-h-16" },
  // Proporcion 1.38 — icono sobre texto, es el mas vertical del conjunto.
  { nombre: "Proseguros", logo: "/clientes/proseguros.png", alto: "max-h-16" },
  // Proporcion 3.32 — apaisado.
  { nombre: "Seguros Quálitas", logo: "/clientes/qualitas.png", alto: "max-h-10" },
  // Proporcion 2.69.
  { nombre: "Seguros Altamira", logo: "/clientes/seguros-altamira.png", alto: "max-h-11" },
  // Proporcion 3.19.
  { nombre: "Seguros Caracas", logo: "/clientes/seguros-caracas.png", alto: "max-h-10" },
  // Proporcion 3.74 — el mas apaisado.
  { nombre: "Seguros Corporativos", logo: "/clientes/seguros-corporativos.png", alto: "max-h-10" },
];

export function Gallery() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function scrollToIndex(index: number) {
    const scroller = scrollerRef.current;
    const slide = scroller?.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  function handleScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slide = scroller.children[0] as HTMLElement | undefined;
    if (!slide) return;
    const gap = 16;
    const index = Math.round(scroller.scrollLeft / (slide.clientWidth + gap));
    setActive(Math.min(Math.max(index, 0), PROJECT_PHOTOS.length - 1));
  }

  return (
    <section id="proyectos" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="flex items-center justify-center gap-3 font-display text-3xl font-bold text-paxo-blue sm:text-4xl">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-paxo-blue/10 sm:h-9 sm:w-9">
            <Image src="/brand/logo-icon.jpg" alt="" fill sizes="36px" className="object-contain" />
          </span>
          Proyectos y Antes/Después
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-paxo-ink-light">
          Galería de proyectos ejecutados — se completará con fotografías reales de obras PAXO.
        </p>

        <div className="relative mt-10">
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {PROJECT_PHOTOS.map((n) => (
              <div
                key={n}
                className="flex aspect-[4/3] w-[78%] shrink-0 snap-start items-center justify-center rounded-2xl bg-paxo-neutral text-sm font-medium text-paxo-ink-light shadow-sm ring-1 ring-paxo-neutral-dark sm:w-[46%] lg:w-[31%]"
              >
                Foto de proyecto {n}
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Proyecto anterior"
            onClick={() => scrollToIndex(Math.max(active - 1, 0))}
            className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2.5 text-paxo-ink-light shadow-lg ring-1 ring-paxo-neutral-dark transition-colors hover:text-paxo-blue sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Siguiente proyecto"
            onClick={() => scrollToIndex(Math.min(active + 1, PROJECT_PHOTOS.length - 1))}
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white p-2.5 text-paxo-ink-light shadow-lg ring-1 ring-paxo-neutral-dark transition-colors hover:text-paxo-blue sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {PROJECT_PHOTOS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir al proyecto ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                active === i ? "w-6 bg-paxo-blue" : "w-2 bg-paxo-neutral-dark"
              )}
            />
          ))}
        </div>

        <div className="mt-16">
          <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-paxo-ink-light">
            Empresas que confían en PAXO
          </p>
          <div
            className="mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          >
            <div className="animate-marquee flex w-max items-center gap-6">
              {/* La lista va duplicada: la animacion desplaza -50%, de modo que
                  al terminar el primer juego el segundo queda calzado y el
                  bucle se ve continuo. aria-hidden en el duplicado evita que
                  los lectores de pantalla lean los nombres dos veces. */}
              {[...CLIENTES, ...CLIENTES].map((cliente, i) => (
                <div
                  key={`${cliente.nombre}-${i}`}
                  aria-hidden={i >= CLIENTES.length}
                  title={cliente.nombre}
                  className="group flex h-24 w-48 shrink-0 items-center justify-center rounded-xl border border-paxo-neutral-dark bg-white px-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-paxo-blue/30 hover:shadow-card"
                >
                  <Image
                    src={cliente.logo}
                    alt={cliente.nombre}
                    width={240}
                    height={120}
                    className={cn(
                      "w-auto object-contain transition-transform duration-300 group-hover:scale-105",
                      cliente.alto
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

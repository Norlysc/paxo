import Image from "next/image";
import { cn } from "@paxo/ui";

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

/**
 * Empresas clientes de PAXO. Para sumar una, coloca el logo en
 * apps/web/public/clientes/ (PNG o SVG con fondo transparente, alto minimo
 * 120 px) y agregalo aqui.
 */
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

/** Franja de prueba social inmediatamente despues del hero. */
export function Clients() {
  return (
    <section aria-labelledby="clientes-titulo" className="bg-white pb-6 pt-4 sm:pt-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p
          id="clientes-titulo"
          className="text-center text-xs font-bold uppercase tracking-[0.2em] text-paxo-ink-light"
        >
          Empresas que confían en PAXO
        </p>
        <div className="mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-5">
            {/* La lista va duplicada: la animacion desplaza -50%, de modo que
                al terminar el primer juego el segundo queda calzado y el
                bucle se ve continuo. Con movimiento reducido no hay
                animacion y el duplicado se oculta para no repetir logos. */}
            {[...CLIENTES, ...CLIENTES].map((cliente, i) => {
              const duplicado = i >= CLIENTES.length;
              return (
                <div
                  key={`${cliente.nombre}-${i}`}
                  aria-hidden={duplicado}
                  title={cliente.nombre}
                  className={cn(
                    "flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 transition-colors duration-300 hover:border-paxo-blue/30",
                    duplicado && "motion-reduce:hidden"
                  )}
                >
                  <Image
                    src={cliente.logo}
                    alt={duplicado ? "" : cliente.nombre}
                    width={240}
                    height={120}
                    className={cn("w-auto object-contain", cliente.alto)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

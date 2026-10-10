/**
 * Franja discreta de proveedores aliados, antes del pie de pagina.
 *
 * Deliberadamente sin logos ni carrusel (solo etiquetas): esa forma esta reservada para el
 * muro de clientes de Clients.tsx, que es el que aporta prueba social. Aqui
 * el valor para el visitante no son los nombres sino lo que la red significa
 * —material disponible y plazos que se cumplen—, de ahi la linea de entrada.
 */
const PROVEEDORES = [
  "Hidromateriales",
  "Diploelca",
  "Ferreterías EPA",
  "Ferreima",
  "Mato Suplidores",
  "Venyesa",
  "Materiales Guayabal",
  "Ferreconstrucciones",
  "Lámparas El Márquez",
  "Multiservicios Firestar",
  "Sovica Electronic",
  "Extinsa",
  "Walco",
  "Ofiservicios 911",
  "Ducto Limpio",
];

export function Suppliers() {
  return (
    <section className="bg-paxo-neutral py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-paxo-red">
          Proveedores aliados
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-paxo-ink-light">
          Una red de suministro consolidada que nos permite garantizar la disponibilidad de
          materiales y cumplir los plazos de obra.
        </p>
        <ul className="mx-auto mt-7 flex max-w-5xl flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {PROVEEDORES.map((proveedor) => (
            <li
              key={proveedor}
              className="rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-paxo-ink-light shadow-sm ring-1 ring-slate-200 sm:px-4 sm:py-2 sm:text-sm"
            >
              {proveedor}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

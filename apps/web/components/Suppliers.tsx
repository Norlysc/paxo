/**
 * Franja discreta de proveedores aliados, antes del pie de pagina.
 *
 * Deliberadamente sin logos ni carrusel: esa forma esta reservada para el
 * muro de clientes de Gallery.tsx, que es el que aporta prueba social. Aqui
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
    <section className="bg-white py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-paxo-red">
          Proveedores aliados
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-paxo-ink-light">
          Una red de suministro consolidada que nos permite garantizar la disponibilidad de
          materiales y cumplir los plazos de obra.
        </p>
        <ul className="mx-auto mt-7 flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {PROVEEDORES.map((proveedor) => (
            <li key={proveedor} className="text-sm font-medium text-paxo-ink-light">
              {proveedor}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

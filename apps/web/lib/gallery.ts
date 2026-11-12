/**
 * Obras que se muestran en la galeria de la landing.
 *
 * Para agregar una obra: coloca las fotos en apps/web/public/obras/
 * (preferible .webp de ~1600 px de ancho) y suma una entrada aqui. Con
 * `antes`, la obra muestra el comparador antes/despues. La seccion completa
 * se oculta mientras esta lista este vacia.
 */
export type GalleryCategory = "construccion" | "instalaciones" | "acabados" | "seguridad";

export type Obra = {
  /** Identificador unico, sin espacios (p. ej. "remodelacion-oficina-chacao"). */
  id: string;
  titulo: string;
  categoria: GalleryCategory;
  /** Ciudad o zona, sin direccion exacta del cliente. */
  ubicacion?: string;
  /** Foto principal (el resultado final). */
  foto: string;
  /** Foto del estado previo; activa el comparador. */
  antes?: string;
  /** Descripcion breve del trabajo realizado. */
  descripcion?: string;
};

export const GALLERY_CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: "construccion", label: "Construcción" },
  { id: "instalaciones", label: "Instalaciones" },
  { id: "acabados", label: "Acabados" },
  { id: "seguridad", label: "Seguridad electrónica" },
];

export const OBRAS: Obra[] = [];

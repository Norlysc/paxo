/**
 * Obras que se muestran en la galeria de la landing.
 *
 * Son fotos reales de trabajos, tomadas con telefono: titulo, categoria y
 * ubicacion son opcionales. Las fotos van en apps/web/public/obras/ como
 * .webp de ~1600 px (se preparan con scripts/preparar-fotos-obras.mjs).
 * Con `antes`, la foto muestra el comparador antes/despues. La seccion
 * completa se oculta mientras esta lista este vacia.
 */
import { OBRAS_GENERADAS } from "./obras.generated";

export type GalleryCategory = "construccion" | "instalaciones" | "acabados" | "seguridad";

export type Obra = {
  /** Identificador unico, sin espacios (p. ej. "remodelacion-oficina-chacao"). */
  id: string;
  titulo?: string;
  categoria?: GalleryCategory;
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

export const OBRAS: Obra[] = OBRAS_GENERADAS;

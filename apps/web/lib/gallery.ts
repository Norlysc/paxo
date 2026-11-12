import { OBRAS_GENERADAS } from "./obras.generated";

/**
 * Fotos de trabajos que se muestran en la galeria de la landing.
 *
 * Son fotos reales tomadas con telefono. Se generan con
 * scripts/preparar-fotos-obras.mjs, que deja cada una en dos versiones: una
 * tarjeta 4:5 (todas del mismo tamano) y la foto completa para la vista
 * ampliada. La seccion se oculta mientras la lista este vacia.
 */
export type GalleryCategory = "construccion" | "instalaciones" | "acabados" | "seguridad";

export type Obra = {
  id: string;
  categoria?: GalleryCategory;
  /** Tarjeta 4:5 recortada. */
  foto: string;
  /** Foto completa, sin recortar. */
  fotoGrande: string;
  titulo?: string;
};

export const GALLERY_CATEGORIES: Record<GalleryCategory, string> = {
  construccion: "Construcción",
  instalaciones: "Instalaciones",
  acabados: "Acabados",
  seguridad: "Seguridad electrónica",
};

export const OBRAS: Obra[] = OBRAS_GENERADAS;

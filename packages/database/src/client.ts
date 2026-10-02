import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Cliente Supabase para uso en navegador (Next.js client components, Expo).
 * Requiere NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
 * (o EXPO_PUBLIC_* en la app móvil — ver createBrowserSupabaseClient).
 */
export function createBrowserSupabaseClient(url: string, anonKey: string): SupabaseClient<Database> {
  if (!url || !anonKey) {
    throw new Error(
      "Faltan las variables de entorno de Supabase (URL / anon key). Revisa docs/SETUP.md."
    );
  }
  return createClient<Database>(url, anonKey);
}

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@paxo/database/types";

/**
 * Cliente Supabase del navegador para el panel administrativo.
 * Usa cookies (vía @supabase/ssr) para compartir la sesión con el servidor.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

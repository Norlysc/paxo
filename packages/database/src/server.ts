import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Cliente Supabase con `service_role` — SOLO para código de servidor
 * (Route Handlers, Edge Functions). Ignora RLS: nunca exponer al cliente
 * ni importar desde código que se ejecute en el navegador.
 */
export function createServiceRoleClient(url: string, serviceRoleKey: string): SupabaseClient<Database> {
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en el entorno del servidor. Revisa docs/SETUP.md."
    );
  }
  return createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

import { createBrowserSupabaseClient } from "@paxo/database/client";

/**
 * Cliente Supabase del lado del navegador para la landing pública.
 * Usa exclusivamente la anon key — las tablas públicas (quote_requests,
 * web_analytics_events, service_catalog) tienen políticas RLS que permiten
 * inserción/lectura anónima explícitamente (ver supabase/migrations/0001_init.sql).
 */
export function getSupabaseBrowserClient() {
  return createBrowserSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
}

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@paxo/database/types";

/**
 * Cliente Supabase para Server Components / Route Handlers / Server Actions.
 * Lee y escribe la sesión desde las cookies de la petición actual.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Se llama desde un Server Component: el middleware ya refresca la sesión.
          }
        },
      },
    }
  );
}

import { redirect } from "next/navigation";
import type { StaffRole } from "@paxo/shared";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CurrentStaff = {
  id: string;
  role: StaffRole;
  fullName: string | null;
};

/**
 * Carga el perfil del usuario autenticado y exige que sea staff
 * (admin/supervisor/comercial/tecnico). El middleware ya garantiza sesión
 * válida; aquí se valida el rol y, opcionalmente, se restringe a un subconjunto.
 */
export async function requireStaff(allowedRoles?: StaffRole[]): Promise<CurrentStaff> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role === "cliente") {
    redirect("/login?error=unauthorized");
  }

  const role = profile.role as StaffRole;
  if (allowedRoles && !allowedRoles.includes(role)) {
    redirect("/?error=forbidden");
  }

  return { id: profile.id, role, fullName: profile.full_name };
}

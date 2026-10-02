import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/ProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const supabase = await createSupabaseServerClient();
  const { data: clients } = await supabase.from("clients").select("id, full_name").order("full_name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-paxo-blue">Nuevo proyecto</h1>
        <p className="text-sm text-paxo-ink-light">Registra un proyecto asociado a un cliente.</p>
      </div>
      <ProjectForm clients={clients ?? []} />
    </div>
  );
}

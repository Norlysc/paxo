import { createSupabaseServerClient } from "@/lib/supabase/server";
import { QuoteForm } from "@/components/QuoteForm";

export const dynamic = "force-dynamic";

export default async function NewQuotePage() {
  const supabase = await createSupabaseServerClient();
  const { data: clients } = await supabase.from("clients").select("id, full_name").order("full_name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-paxo-blue">Nueva cotización</h1>
        <p className="text-sm text-paxo-ink-light">Genera una cotización para un cliente existente.</p>
      </div>
      <QuoteForm clients={clients ?? []} />
    </div>
  );
}

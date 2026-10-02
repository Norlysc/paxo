import { Card, CardContent, CardHeader, CardTitle } from "@paxo/ui";
import { requireStaff } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { AiAssistantForm } from "@/components/AiAssistantForm";

export const dynamic = "force-dynamic";

export default async function AiAssistantPage() {
  await requireStaff(["admin", "supervisor"]);
  const supabase = await createSupabaseServerClient();
  const { data: insights } = await supabase
    .from("ai_insights")
    .select("id, question, answer, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-paxo-blue">Asistente Empresarial IA</h1>
        <p className="text-sm text-paxo-ink-light">
          Analiza ventas, gastos, clientes y proyectos, y genera recomendaciones a partir de los datos actuales del
          negocio.
        </p>
      </div>

      <Card>
        <CardContent className="pt-5">
          <AiAssistantForm />
        </CardContent>
      </Card>

      {(insights ?? []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de consultas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(insights ?? []).map((i) => (
              <div key={i.id} className="border-b border-paxo-neutral-dark pb-4 last:border-0">
                <p className="text-sm font-medium text-paxo-ink">{i.question}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-paxo-ink-light">{i.answer}</p>
                <p className="mt-1 text-xs text-paxo-ink-light">{formatDate(i.created_at)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

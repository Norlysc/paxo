import Link from "next/link";
import { Badge, Button, Card } from "@paxo/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_VARIANT = {
  planificado: "neutral",
  activo: "info",
  pausado: "warning",
  terminado: "success",
  cancelado: "danger",
} as const;

export default async function ProjectsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, status, estimated_budget, actual_cost, start_date, clients(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-paxo-blue">Proyectos</h1>
          <p className="text-sm text-paxo-ink-light">Cronograma, presupuesto y avance de obras.</p>
        </div>
        <Link href="/projects/new">
          <Button>Nuevo proyecto</Button>
        </Link>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-paxo-neutral-dark text-paxo-ink-light">
            <tr>
              <th className="px-5 py-3 font-medium">Proyecto</th>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium">Presupuesto</th>
              <th className="px-5 py-3 font-medium">Costo real</th>
              <th className="px-5 py-3 font-medium">Inicio</th>
            </tr>
          </thead>
          <tbody>
            {(projects ?? []).map((p) => (
              <tr key={p.id} className="border-b border-paxo-neutral-dark last:border-0 hover:bg-paxo-neutral">
                <td className="px-5 py-3 font-medium text-paxo-ink">{p.name}</td>
                <td className="px-5 py-3 text-paxo-ink-light">
                  {(p.clients as unknown as { full_name: string } | null)?.full_name ?? "—"}
                </td>
                <td className="px-5 py-3">
                  <Badge variant={STATUS_VARIANT[p.status as keyof typeof STATUS_VARIANT]}>{p.status}</Badge>
                </td>
                <td className="px-5 py-3">{p.estimated_budget ? formatCurrency(Number(p.estimated_budget)) : "—"}</td>
                <td className="px-5 py-3">{formatCurrency(Number(p.actual_cost))}</td>
                <td className="px-5 py-3 text-paxo-ink-light">{p.start_date ? formatDate(p.start_date) : "—"}</td>
              </tr>
            ))}
            {(projects ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-paxo-ink-light">
                  Aún no hay proyectos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

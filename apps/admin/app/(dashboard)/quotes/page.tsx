import Link from "next/link";
import { Badge, Button, Card } from "@paxo/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_VARIANT = {
  borrador: "neutral",
  enviada: "info",
  aceptada: "success",
  rechazada: "danger",
  vencida: "warning",
} as const;

export default async function QuotesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, status, total, valid_until, created_at, clients(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-paxo-blue">Cotizaciones</h1>
          <p className="text-sm text-paxo-ink-light">Control de estados y seguimiento comercial.</p>
        </div>
        <Link href="/quotes/new">
          <Button>Nueva cotización</Button>
        </Link>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-paxo-neutral-dark text-paxo-ink-light">
            <tr>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Válida hasta</th>
              <th className="px-5 py-3 font-medium">Creada</th>
            </tr>
          </thead>
          <tbody>
            {(quotes ?? []).map((q) => (
              <tr key={q.id} className="border-b border-paxo-neutral-dark last:border-0 hover:bg-paxo-neutral">
                <td className="px-5 py-3 font-medium text-paxo-ink">
                  {(q.clients as unknown as { full_name: string } | null)?.full_name ?? "—"}
                </td>
                <td className="px-5 py-3">
                  <Badge variant={STATUS_VARIANT[q.status as keyof typeof STATUS_VARIANT]}>{q.status}</Badge>
                </td>
                <td className="px-5 py-3">{formatCurrency(Number(q.total))}</td>
                <td className="px-5 py-3 text-paxo-ink-light">{q.valid_until ? formatDate(q.valid_until) : "—"}</td>
                <td className="px-5 py-3 text-paxo-ink-light">{formatDate(q.created_at)}</td>
              </tr>
            ))}
            {(quotes ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-paxo-ink-light">
                  Aún no hay cotizaciones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

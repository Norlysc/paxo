import { Badge, Card, CardContent, CardHeader, CardTitle, KpiTile } from "@paxo/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/format";
import { TransactionForm } from "@/components/TransactionForm";
import { requireStaff } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  await requireStaff(["admin", "supervisor"]);
  const supabase = await createSupabaseServerClient();
  const { data: transactions } = await supabase
    .from("financial_transactions")
    .select("id, type, amount, category, description, date")
    .order("date", { ascending: false })
    .limit(50);

  const rows = transactions ?? [];
  const income = rows.filter((t) => t.type === "ingreso").reduce((acc, t) => acc + Number(t.amount), 0);
  const expense = rows.filter((t) => t.type === "gasto").reduce((acc, t) => acc + Number(t.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-paxo-blue">Gestión Financiera</h1>
        <p className="text-sm text-paxo-ink-light">Ingresos, gastos y utilidad (últimos 50 movimientos).</p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiTile label="Ingresos" value={formatCurrency(income)} />
        <KpiTile label="Gastos" value={formatCurrency(expense)} />
        <KpiTile label="Utilidad" value={formatCurrency(income - expense)} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Registrar movimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionForm />
        </CardContent>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-paxo-neutral-dark text-paxo-ink-light">
            <tr>
              <th className="px-5 py-3 font-medium">Fecha</th>
              <th className="px-5 py-3 font-medium">Tipo</th>
              <th className="px-5 py-3 font-medium">Categoría</th>
              <th className="px-5 py-3 font-medium">Descripción</th>
              <th className="px-5 py-3 font-medium">Monto</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-b border-paxo-neutral-dark last:border-0 hover:bg-paxo-neutral">
                <td className="px-5 py-3 text-paxo-ink-light">{formatDate(t.date)}</td>
                <td className="px-5 py-3">
                  <Badge variant={t.type === "ingreso" ? "success" : "danger"}>{t.type}</Badge>
                </td>
                <td className="px-5 py-3">{t.category}</td>
                <td className="px-5 py-3 text-paxo-ink-light">{t.description ?? "—"}</td>
                <td className="px-5 py-3 font-medium text-paxo-ink">{formatCurrency(Number(t.amount))}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-paxo-ink-light">
                  Aún no hay movimientos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

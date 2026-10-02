import { KpiTile } from "@paxo/ui";
import { getDashboardCharts, getDashboardMetrics } from "@/lib/dashboard";
import { formatCurrency } from "@/lib/format";
import { RevenueTrendChart } from "@/components/charts/RevenueTrendChart";
import { ProjectStatusChart } from "@/components/charts/ProjectStatusChart";
import { QuoteStatusChart } from "@/components/charts/QuoteStatusChart";

export const dynamic = "force-dynamic";

function profitDelta(current: number, previous: number) {
  if (previous === 0) return undefined;
  const change = ((current - previous) / Math.abs(previous)) * 100;
  return {
    value: `${change >= 0 ? "+" : ""}${change.toFixed(1)}% vs. mes anterior`,
    direction: (change > 0.5 ? "up" : change < -0.5 ? "down" : "flat") as "up" | "down" | "flat",
  };
}

export default async function DashboardPage() {
  const [m, charts] = await Promise.all([getDashboardMetrics(), getDashboardCharts()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-paxo-blue">Dashboard Ejecutivo</h1>
        <p className="text-sm text-paxo-ink-light">Resumen operativo y financiero del mes en curso.</p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile label="Ingresos del mes" value={formatCurrency(m.monthlyIncome)} />
        <KpiTile label="Gastos del mes" value={formatCurrency(m.monthlyExpense)} />
        <KpiTile
          label="Utilidad neta"
          value={formatCurrency(m.monthlyProfit)}
          delta={profitDelta(m.monthlyProfit, m.previousMonthProfit)}
        />
        <KpiTile label="Facturación anual" value={formatCurrency(m.annualRevenue)} />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile label="Trabajos activos" value={String(m.projectsActive)} />
        <KpiTile label="Trabajos terminados" value={String(m.projectsFinished)} />
        <KpiTile label="Trabajos pendientes" value={String(m.projectsPending)} />
        <KpiTile label="Clientes nuevos (mes)" value={String(m.newClientsThisMonth)} />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile label="Cotizaciones enviadas" value={String(m.quotesSent)} />
        <KpiTile label="Cotizaciones aceptadas" value={String(m.quotesAccepted)} />
        <KpiTile label="Conversión" value={`${m.conversionRate.toFixed(1)}%`} />
        <KpiTile label="Clientes frecuentes" value={String(m.frequentClients)} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueTrendChart data={charts.monthlySeries} />
        </div>
        <ProjectStatusChart data={charts.projectStatus} />
      </section>

      <section>
        <QuoteStatusChart data={charts.quoteStatus} />
      </section>
    </div>
  );
}

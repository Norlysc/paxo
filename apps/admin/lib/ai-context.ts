import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDashboardMetrics } from "@/lib/dashboard";

/** Resumen compacto del negocio, usado como contexto del Asistente Empresarial IA. */
export async function getBusinessSnapshot(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const metrics = await getDashboardMetrics();

  const [{ data: requests }, { data: projects }] = await Promise.all([
    supabase.from("quote_requests").select("service_slug"),
    supabase.from("projects").select("name, status, estimated_budget, actual_cost").in("status", ["activo", "pausado"]),
  ]);

  const serviceCounts = new Map<string, number>();
  for (const r of requests ?? []) {
    serviceCounts.set(r.service_slug, (serviceCounts.get(r.service_slug) ?? 0) + 1);
  }
  const topServices = [...serviceCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([slug, count]) => `${slug} (${count} solicitudes)`)
    .join(", ") || "sin datos suficientes";

  const projectsAtRisk = (projects ?? [])
    .filter((p) => p.estimated_budget != null && Number(p.actual_cost) > Number(p.estimated_budget))
    .map((p) => `${p.name} (costo real $${p.actual_cost} vs. presupuesto $${p.estimated_budget})`);

  return [
    `Ingresos del mes: $${metrics.monthlyIncome.toFixed(2)}`,
    `Gastos del mes: $${metrics.monthlyExpense.toFixed(2)}`,
    `Utilidad neta del mes: $${metrics.monthlyProfit.toFixed(2)} (mes anterior: $${metrics.previousMonthProfit.toFixed(2)})`,
    `Facturación anual acumulada: $${metrics.annualRevenue.toFixed(2)}`,
    `Trabajos activos: ${metrics.projectsActive}, terminados: ${metrics.projectsFinished}, pendientes: ${metrics.projectsPending}`,
    `Cotizaciones enviadas: ${metrics.quotesSent}, aceptadas: ${metrics.quotesAccepted}, conversión: ${metrics.conversionRate.toFixed(1)}%`,
    `Clientes nuevos este mes: ${metrics.newClientsThisMonth}, clientes frecuentes: ${metrics.frequentClients}`,
    `Servicios más solicitados: ${topServices}`,
    `Proyectos con costo por encima del presupuesto: ${projectsAtRisk.length > 0 ? projectsAtRisk.join("; ") : "ninguno detectado"}`,
  ].join("\n");
}

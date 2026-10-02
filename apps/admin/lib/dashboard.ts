import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProjectStatus, QuoteStatus } from "@paxo/database/types";

export type DashboardMetrics = {
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyProfit: number;
  previousMonthProfit: number;
  annualRevenue: number;
  projectsActive: number;
  projectsFinished: number;
  projectsPending: number;
  quotesSent: number;
  quotesAccepted: number;
  conversionRate: number;
  newClientsThisMonth: number;
  frequentClients: number;
};

function monthRange(offset = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

function yearRange() {
  const now = new Date();
  return {
    start: `${now.getFullYear()}-01-01`,
    end: `${now.getFullYear() + 1}-01-01`,
  };
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createSupabaseServerClient();
  const thisMonth = monthRange(0);
  const lastMonth = monthRange(-1);
  const year = yearRange();

  const [transactionsThisMonth, transactionsLastMonth, transactionsThisYear, projects, quotes, clients] =
    await Promise.all([
      supabase.from("financial_transactions").select("type, amount").gte("date", thisMonth.start).lt("date", thisMonth.end),
      supabase.from("financial_transactions").select("type, amount").gte("date", lastMonth.start).lt("date", lastMonth.end),
      supabase.from("financial_transactions").select("type, amount").gte("date", year.start).lt("date", year.end),
      supabase.from("projects").select("status"),
      supabase.from("quotes").select("status, client_id"),
      supabase.from("clients").select("id, created_at"),
    ]);

  const sumByType = (rows: { type: string; amount: number }[] | null, type: "ingreso" | "gasto") =>
    (rows ?? []).filter((r) => r.type === type).reduce((acc, r) => acc + Number(r.amount), 0);

  const monthlyIncome = sumByType(transactionsThisMonth.data, "ingreso");
  const monthlyExpense = sumByType(transactionsThisMonth.data, "gasto");
  const lastMonthIncome = sumByType(transactionsLastMonth.data, "ingreso");
  const lastMonthExpense = sumByType(transactionsLastMonth.data, "gasto");
  const annualRevenue = sumByType(transactionsThisYear.data, "ingreso");

  const projectRows = projects.data ?? [];
  const quoteRows = quotes.data ?? [];
  const clientRows = clients.data ?? [];

  const quotesSent = quoteRows.filter((q) => q.status === "enviada" || q.status === "aceptada").length;
  const quotesAccepted = quoteRows.filter((q) => q.status === "aceptada").length;

  const quotesPerClient = new Map<string, number>();
  for (const q of quoteRows) {
    quotesPerClient.set(q.client_id, (quotesPerClient.get(q.client_id) ?? 0) + 1);
  }
  const frequentClients = [...quotesPerClient.values()].filter((count) => count >= 2).length;

  return {
    monthlyIncome,
    monthlyExpense,
    monthlyProfit: monthlyIncome - monthlyExpense,
    previousMonthProfit: lastMonthIncome - lastMonthExpense,
    annualRevenue,
    projectsActive: projectRows.filter((p) => p.status === "activo").length,
    projectsFinished: projectRows.filter((p) => p.status === "terminado").length,
    projectsPending: projectRows.filter((p) => p.status === "planificado" || p.status === "pausado").length,
    quotesSent,
    quotesAccepted,
    conversionRate: quotesSent > 0 ? (quotesAccepted / quotesSent) * 100 : 0,
    newClientsThisMonth: clientRows.filter((c) => c.created_at >= thisMonth.start && c.created_at < thisMonth.end).length,
    frequentClients,
  };
}

export type DashboardCharts = {
  monthlySeries: { month: string; ingresos: number; gastos: number }[];
  projectStatus: { label: string; count: number }[];
  quoteStatus: { label: string; count: number }[];
};

const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planificado: "Planificado",
  activo: "Activo",
  pausado: "Pausado",
  terminado: "Terminado",
  cancelado: "Cancelado",
};

const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  borrador: "Borrador",
  enviada: "Enviada",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
  vencida: "Vencida",
};

function countByStatus<T extends string>(
  rows: { status: T }[],
  labels: Record<T, string>
): { label: string; count: number }[] {
  const counts = new Map<T, number>();
  for (const row of rows) {
    counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
  }
  return (Object.keys(labels) as T[])
    .map((status) => ({ label: labels[status], count: counts.get(status) ?? 0 }))
    .filter((entry) => entry.count > 0);
}

export async function getDashboardCharts(): Promise<DashboardCharts> {
  const supabase = await createSupabaseServerClient();
  const now = new Date();
  const seriesStart = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().slice(0, 10);

  const [transactions, projects, quotes] = await Promise.all([
    supabase.from("financial_transactions").select("type, amount, date").gte("date", seriesStart),
    supabase.from("projects").select("status"),
    supabase.from("quotes").select("status"),
  ]);

  const months: { key: string; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("es-VE", { month: "short" }).replace(".", ""),
    });
  }

  const buckets = new Map(months.map((m) => [m.key, { ingresos: 0, gastos: 0 }]));
  for (const t of transactions.data ?? []) {
    const bucket = buckets.get(String(t.date).slice(0, 7));
    if (!bucket) continue;
    if (t.type === "ingreso") bucket.ingresos += Number(t.amount);
    else bucket.gastos += Number(t.amount);
  }

  return {
    monthlySeries: months.map((m) => ({ month: m.label, ...buckets.get(m.key)! })),
    projectStatus: countByStatus((projects.data ?? []) as { status: ProjectStatus }[], PROJECT_STATUS_LABELS),
    quoteStatus: countByStatus((quotes.data ?? []) as { status: QuoteStatus }[], QUOTE_STATUS_LABELS),
  };
}

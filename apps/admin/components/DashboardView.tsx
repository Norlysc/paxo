import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  HardHat,
  Percent,
  Repeat,
  Send,
  TrendingDown,
  TrendingUp,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@paxo/ui";
import type { DashboardCharts, DashboardMetrics } from "@/lib/dashboard";
import { formatCurrency } from "@/lib/format";
import { RevenueTrendChart } from "./charts/RevenueTrendChart";
import { ProjectStatusChart } from "./charts/ProjectStatusChart";
import { QuoteStatusChart } from "./charts/QuoteStatusChart";

function profitDelta(current: number, previous: number) {
  if (previous === 0) return null;
  const change = ((current - previous) / Math.abs(previous)) * 100;
  return { text: `${change >= 0 ? "+" : ""}${change.toFixed(1)}% vs. mes anterior`, up: change >= 0 };
}

/** Vista del dashboard; recibe los datos ya calculados. */
export function DashboardView({ m, charts }: { m: DashboardMetrics; charts: DashboardCharts }) {
  const mes = new Intl.DateTimeFormat("es-VE", { month: "long", year: "numeric" }).format(new Date());
  const delta = profitDelta(m.monthlyProfit, m.previousMonthProfit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-paxo-ink sm:text-[1.75rem]">Dashboard</h1>
        <p className="mt-1 text-sm text-paxo-ink-light">Cómo va la empresa este mes: dinero, trabajos y cotizaciones.</p>
      </div>

      {/* Finanzas del mes: el bloque principal de la pantalla. */}
      <section className="hex-pattern relative overflow-hidden rounded-2xl bg-paxo-navy p-6 text-white shadow-card sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-paxo-blue/50 blur-3xl"
        />
        <div className="relative flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-base font-bold first-letter:uppercase">Finanzas de {mes}</h2>
          <p className="text-xs text-white/60">En dólares (USD)</p>
        </div>

        <div className="relative mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/10">
          <FinanzaCifra label="Utilidad neta" valor={formatCurrency(m.monthlyProfit)} destacada>
            {delta ? (
              <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", delta.up ? "text-emerald-300" : "text-rose-300")}>
                {delta.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {delta.text}
              </span>
            ) : (
              <span className="text-xs text-white/55">Sin datos del mes anterior</span>
            )}
          </FinanzaCifra>
          <FinanzaCifra label="Ingresos del mes" valor={formatCurrency(m.monthlyIncome)} marca="bg-sky-300" />
          <FinanzaCifra label="Gastos del mes" valor={formatCurrency(m.monthlyExpense)} marca="bg-rose-400" />
          <FinanzaCifra label="Facturación del año" valor={formatCurrency(m.annualRevenue)} />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Grupo titulo="Trabajos">
          <Cifra icon={HardHat} label="Activos" valor={m.projectsActive} tono="blue" />
          <Cifra icon={Clock3} label="Pendientes" valor={m.projectsPending} tono="amber" />
          <Cifra icon={CheckCircle2} label="Terminados" valor={m.projectsFinished} tono="green" />
          <Cifra icon={UserPlus} label="Clientes nuevos" valor={m.newClientsThisMonth} tono="blue" />
        </Grupo>
        <Grupo titulo="Cotizaciones">
          <Cifra icon={Send} label="Enviadas" valor={m.quotesSent} tono="blue" />
          <Cifra icon={FileCheck2} label="Aceptadas" valor={m.quotesAccepted} tono="green" />
          <Cifra icon={Percent} label="Conversión" valor={`${m.conversionRate.toFixed(0)}%`} tono="red" />
          <Cifra icon={Repeat} label="Clientes frecuentes" valor={m.frequentClients} tono="amber" />
        </Grupo>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueTrendChart data={charts.monthlySeries} />
        </div>
        <ProjectStatusChart data={charts.projectStatus} />
      </div>

      <QuoteStatusChart data={charts.quoteStatus} />
    </div>
  );
}

function FinanzaCifra({
  label,
  valor,
  destacada,
  marca,
  children,
}: {
  label: string;
  valor: string;
  destacada?: boolean;
  marca?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="lg:px-6 lg:first:pl-0 lg:last:pr-0">
      <p className="flex items-center gap-2 text-sm text-white/70">
        {marca && <span aria-hidden className={cn("h-2 w-2 rounded-full", marca)} />}
        {label}
      </p>
      <p className={cn("cifra mt-2 font-extrabold tracking-tight", destacada ? "text-3xl sm:text-4xl" : "text-2xl")}>{valor}</p>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-paxo-neutral-dark bg-white shadow-sm">
      <h2 className="border-b border-paxo-neutral-dark px-5 py-4 text-sm font-bold text-paxo-ink">{titulo}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4">{children}</div>
    </section>
  );
}

const TONOS = {
  blue: "bg-paxo-blue-soft text-paxo-blue",
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-paxo-red-soft text-paxo-red",
} as const;

function Cifra({ icon: Icon, label, valor, tono }: { icon: LucideIcon; label: string; valor: number | string; tono: keyof typeof TONOS }) {
  return (
    <div className="border-paxo-neutral-dark p-5 [&:nth-child(-n+2)]:border-b sm:border-l sm:first:border-l-0 sm:[&:nth-child(-n+2)]:border-b-0 [&:nth-child(even)]:border-l">
      <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", TONOS[tono])}>
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </span>
      <p className="cifra mt-4 text-2xl font-extrabold text-paxo-ink">{valor}</p>
      <p className="mt-0.5 text-sm text-paxo-ink-light">{label}</p>
    </div>
  );
}

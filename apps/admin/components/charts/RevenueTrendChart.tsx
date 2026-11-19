"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/format";
import { CHART_GRID, CHART_INK, ChartCard, ChartTooltip } from "./ChartCard";

const AZUL = "#2150A2";
const ROJO = "#BF1F2E";

function abreviar(v: number) {
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
  return `$${v}`;
}

export function RevenueTrendChart({ data }: { data: { month: string; ingresos: number; gastos: number }[] }) {
  const leyenda = (
    <div className="flex items-center gap-4 text-xs font-semibold text-paxo-ink-light">
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: AZUL }} /> Ingresos
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: ROJO }} /> Gastos
      </span>
    </div>
  );

  return (
    <ChartCard title="Ingresos y gastos" subtitle="Últimos 6 meses" aside={leyenda}>
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="relleno-ingresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={AZUL} stopOpacity={0.22} />
                <stop offset="100%" stopColor={AZUL} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="relleno-gastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ROJO} stopOpacity={0.12} />
                <stop offset="100%" stopColor={ROJO} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={CHART_GRID} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: CHART_INK }}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tickFormatter={(m: string) => m.replace(".", "").slice(0, 3)}
            />
            <YAxis tick={{ fontSize: 12, fill: CHART_INK }} axisLine={false} tickLine={false} tickFormatter={abreviar} width={48} />
            <Tooltip
              cursor={{ stroke: "#C9D3E3", strokeDasharray: "4 4" }}
              content={<ChartTooltip format={(v) => formatCurrency(v)} />}
            />
            <Area
              type="monotoneX"
              dataKey="ingresos"
              name="Ingresos"
              stroke={AZUL}
              strokeWidth={2.5}
              fill="url(#relleno-ingresos)"
              activeDot={{ r: 5, strokeWidth: 3, stroke: "#fff" }}
              dot={false}
              isAnimationActive={false}
            />
            <Area
              type="monotoneX"
              dataKey="gastos"
              name="Gastos"
              stroke={ROJO}
              strokeWidth={2}
              strokeDasharray="5 4"
              fill="url(#relleno-gastos)"
              activeDot={{ r: 5, strokeWidth: 3, stroke: "#fff" }}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

"use client";

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/format";

export function RevenueTrendChart({ data }: { data: { month: string; ingresos: number; gastos: number }[] }) {
  return (
    <div className="rounded-2xl border border-paxo-neutral-dark bg-white p-5 shadow-sm">
      <p className="font-display text-base font-semibold text-paxo-ink">Ingresos vs. gastos</p>
      <p className="text-xs text-paxo-ink-light">Últimos 6 meses</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2158B5" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2158B5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D32F2F" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D32F2F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#D9DEE5" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#4B5563" }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12, fill: "#4B5563" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
              width={44}
            />
            <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: 12, border: "1px solid #D9DEE5", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#2158B5" strokeWidth={2} fill="url(#incomeGradient)" />
            <Area type="monotone" dataKey="gastos" name="Gastos" stroke="#D32F2F" strokeWidth={2} fill="url(#expenseGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS: Record<string, string> = {
  Borrador: "#4B5563",
  Enviada: "#0EA5E9",
  Aceptada: "#22C55E",
  Rechazada: "#DC2626",
  Vencida: "#F59E0B",
};

export function QuoteStatusChart({ data }: { data: { label: string; count: number }[] }) {
  const total = data.reduce((acc, d) => acc + d.count, 0);

  return (
    <div className="rounded-2xl border border-paxo-neutral-dark bg-white p-5 shadow-sm">
      <p className="font-display text-base font-semibold text-paxo-ink">Cotizaciones por estado</p>
      <p className="text-xs text-paxo-ink-light">
        {total} cotizaci{total === 1 ? "ón" : "ones"} registrada{total === 1 ? "" : "s"}
      </p>
      <div className="mt-4 h-56">
        {total === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-paxo-ink-light">Sin datos todavía</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D9DEE5" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#4B5563" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: "#4B5563" }} axisLine={false} tickLine={false} width={78} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #D9DEE5", fontSize: 12 }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                {data.map((entry) => (
                  <Cell key={entry.label} fill={COLORS[entry.label] ?? "#2158B5"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

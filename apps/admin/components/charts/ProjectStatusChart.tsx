"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS: Record<string, string> = {
  Planificado: "#0EA5E9",
  Activo: "#2158B5",
  Pausado: "#F59E0B",
  Terminado: "#22C55E",
  Cancelado: "#DC2626",
};

export function ProjectStatusChart({ data }: { data: { label: string; count: number }[] }) {
  const total = data.reduce((acc, d) => acc + d.count, 0);

  return (
    <div className="rounded-2xl border border-paxo-neutral-dark bg-white p-5 shadow-sm">
      <p className="font-display text-base font-semibold text-paxo-ink">Estado de proyectos</p>
      <p className="text-xs text-paxo-ink-light">
        {total} proyecto{total === 1 ? "" : "s"} en total
      </p>
      <div className="mt-4 h-64">
        {total === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-paxo-ink-light">Sin datos todavía</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="count" nameKey="label" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {data.map((entry) => (
                  <Cell key={entry.label} fill={COLORS[entry.label] ?? "#4B5563"} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #D9DEE5", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

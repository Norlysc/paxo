"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard, ChartTooltip, EmptyChart } from "./ChartCard";

const COLORES: Record<string, string> = {
  Planificado: "#7FA3DD",
  Activo: "#2150A2",
  Pausado: "#E5A33B",
  Terminado: "#1F9D6B",
  Cancelado: "#BF1F2E",
};

export function ProjectStatusChart({ data }: { data: { label: string; count: number }[] }) {
  const total = data.reduce((acc, d) => acc + d.count, 0);
  const conDatos = data.filter((d) => d.count > 0);

  return (
    <ChartCard title="Estado de proyectos" subtitle={`${total} proyecto${total === 1 ? "" : "s"} en total`}>
      {total === 0 ? (
        <div className="mt-6 h-64">
          <EmptyChart>Cuando registres proyectos, verás aquí su estado.</EmptyChart>
        </div>
      ) : (
        <>
          <div className="relative mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conDatos}
                  dataKey="count"
                  nameKey="label"
                  innerRadius="68%"
                  outerRadius="92%"
                  paddingAngle={conDatos.length > 1 ? 3 : 0}
                  cornerRadius={6}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                  isAnimationActive={false}
                >
                  {conDatos.map((d) => (
                    <Cell key={d.label} fill={COLORES[d.label] ?? "#5A6478"} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold tabular-nums text-paxo-ink">{total}</span>
              <span className="text-xs text-paxo-ink-light">proyectos</span>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {data.map((d) => (
              <li key={d.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-paxo-ink-light">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORES[d.label] ?? "#5A6478" }} />
                  {d.label}
                </span>
                <span className="font-bold tabular-nums text-paxo-ink">{d.count}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </ChartCard>
  );
}

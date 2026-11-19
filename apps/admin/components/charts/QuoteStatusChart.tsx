"use client";

import { ChartCard, EmptyChart } from "./ChartCard";

const COLORES: Record<string, string> = {
  Borrador: "#8A93A6",
  Enviada: "#2150A2",
  Aceptada: "#1F9D6B",
  Rechazada: "#BF1F2E",
  Vencida: "#E5A33B",
};

/**
 * Cotizaciones por estado como barras con riel: con pocas cotizaciones una
 * grafica con ejes se ve vacia; asi cada estado se lee de un vistazo.
 */
export function QuoteStatusChart({ data }: { data: { label: string; count: number }[] }) {
  const total = data.reduce((acc, d) => acc + d.count, 0);
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <ChartCard
      title="Cotizaciones por estado"
      subtitle={`${total} cotizaci${total === 1 ? "ón registrada" : "ones registradas"}`}
    >
      {total === 0 ? (
        <div className="mt-6 h-40">
          <EmptyChart>Cuando crees cotizaciones, verás aquí en qué estado están.</EmptyChart>
        </div>
      ) : (
        <ul className="mt-6 grid gap-x-10 gap-y-4 md:grid-cols-2">
          {data.map((d) => {
            const pct = total ? Math.round((d.count / total) * 100) : 0;
            return (
              <li key={d.label}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold text-paxo-ink">{d.label}</span>
                  <span className="tabular-nums text-paxo-ink-light">
                    <span className="font-bold text-paxo-ink">{d.count}</span> · {pct}%
                  </span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-paxo-neutral">
                  <div
                    className="h-full rounded-full transition-[width] duration-700 ease-out"
                    style={{ width: `${(d.count / max) * 100}%`, background: COLORES[d.label] ?? "#2150A2" }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </ChartCard>
  );
}

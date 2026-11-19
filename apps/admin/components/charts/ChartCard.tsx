/** Marco comun de las graficas: titulo, subtitulo y accion opcional. */
export function ChartCard({
  title,
  subtitle,
  aside,
  children,
}: {
  title: string;
  subtitle?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="h-full rounded-2xl border border-paxo-neutral-dark bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-paxo-ink">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-paxo-ink-light">{subtitle}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function EmptyChart({ children = "Todavía no hay datos para mostrar." }: { children?: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-paxo-neutral-dark text-sm text-paxo-ink-light">
      {children}
    </div>
  );
}

export const CHART_INK = "#5A6478";
export const CHART_GRID = "#EDF0F5";

/** Tooltip de recharts con el estilo del panel. */
export function ChartTooltip({
  active,
  payload,
  label,
  format = (v) => String(v),
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; payload?: { fill?: string } }[];
  label?: string;
  format?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-36 rounded-xl border border-paxo-neutral-dark bg-white px-3 py-2.5 text-xs shadow-card">
      {label && <p className="mb-1.5 font-bold capitalize text-paxo-ink">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="flex items-center justify-between gap-4 py-0.5 text-paxo-ink-light">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color ?? p.payload?.fill }} />
            {p.name}
          </span>
          <span className="font-bold tabular-nums text-paxo-ink">{format(Number(p.value ?? 0))}</span>
        </p>
      ))}
    </div>
  );
}

import { cn } from "../lib/cn";

export interface KpiTileProps {
  label: string;
  value: string;
  delta?: { value: string; direction: "up" | "down" | "flat" };
  className?: string;
}

export function KpiTile({ label, value, delta, className }: KpiTileProps) {
  return (
    <div className={cn("rounded-2xl border border-paxo-neutral-dark bg-white p-5 shadow-sm", className)}>
      <p className="text-sm font-medium text-paxo-ink-light">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-paxo-blue">{value}</p>
      {delta && (
        <p
          className={cn(
            "mt-1 text-xs font-semibold",
            delta.direction === "up" && "text-emerald-600",
            delta.direction === "down" && "text-red-600",
            delta.direction === "flat" && "text-paxo-ink-light"
          )}
        >
          {delta.direction === "up" ? "▲" : delta.direction === "down" ? "▼" : "—"} {delta.value}
        </p>
      )}
    </div>
  );
}

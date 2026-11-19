import { getDashboardCharts, getDashboardMetrics } from "@/lib/dashboard";
import { DashboardView } from "@/components/DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [m, charts] = await Promise.all([getDashboardMetrics(), getDashboardCharts()]);
  return <DashboardView m={m} charts={charts} />;
}

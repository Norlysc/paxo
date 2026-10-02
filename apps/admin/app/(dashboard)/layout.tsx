import { requireStaff } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/roles";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();

  return (
    <div className="flex min-h-screen">
      <Sidebar role={staff.role} />
      <div className="flex flex-1 flex-col">
        <Topbar fullName={staff.fullName} roleLabel={ROLE_LABELS[staff.role]} />
        <main className="flex-1 bg-paxo-neutral p-6">{children}</main>
      </div>
    </div>
  );
}

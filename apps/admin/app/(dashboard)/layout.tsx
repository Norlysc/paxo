import { requireStaff } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/roles";
import { MobileNav, Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();

  return (
    <div className="flex min-h-screen">
      <Sidebar role={staff.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar fullName={staff.fullName} roleLabel={ROLE_LABELS[staff.role]} />
        <MobileNav role={staff.role} />
        <main className="mx-auto w-full max-w-[1400px] flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

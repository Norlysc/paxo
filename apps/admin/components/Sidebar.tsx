import Image from "next/image";
import Link from "next/link";
import { COMPANY, type StaffRole } from "@paxo/shared";

const NAV_ITEMS: { href: string; label: string; roles?: StaffRole[] }[] = [
  { href: "/", label: "Dashboard" },
  { href: "/clients", label: "Clientes", roles: ["admin", "supervisor", "comercial"] },
  { href: "/quotes", label: "Cotizaciones", roles: ["admin", "supervisor", "comercial"] },
  { href: "/projects", label: "Proyectos" },
  { href: "/finance", label: "Finanzas", roles: ["admin", "supervisor"] },
  { href: "/ai", label: "Asistente IA", roles: ["admin", "supervisor"] },
];

export function Sidebar({ role }: { role: StaffRole }) {
  const items = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-[linear-gradient(180deg,#163d7a_0%,#112d5d_100%)] px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <span className="relative h-9 w-9 shrink-0 rounded-xl bg-white p-1.5 shadow-soft">
          <Image src="/brand/logo-icon.jpg" alt="" fill sizes="36px" className="object-contain" />
        </span>
        <p className="font-display text-lg font-bold tracking-[-0.04em] text-white">{COMPANY.brandName}</p>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl px-3 py-2 text-sm font-medium text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

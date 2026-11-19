"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  FileText,
  HardHat,
  LayoutDashboard,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@paxo/ui";
import type { StaffRole } from "@paxo/shared";

type NavItem = { href: string; label: string; icon: LucideIcon; roles?: StaffRole[] };

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clientes", icon: Users, roles: ["admin", "supervisor", "comercial"] },
  { href: "/quotes", label: "Cotizaciones", icon: FileText, roles: ["admin", "supervisor", "comercial"] },
  { href: "/projects", label: "Proyectos", icon: HardHat },
  { href: "/finance", label: "Finanzas", icon: Wallet, roles: ["admin", "supervisor"] },
  { href: "/ai", label: "Asistente IA", icon: Bot, roles: ["admin", "supervisor"] },
];

function itemsFor(role: StaffRole) {
  return NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));
}

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
}

/** Menu lateral de escritorio: logo completo y secciones segun el rol. */
export function Sidebar({ role }: { role: StaffRole }) {
  const isActive = useIsActive();

  return (
    <aside className="hex-pattern sticky top-0 hidden h-screen w-72 shrink-0 flex-col overflow-hidden bg-paxo-navy text-white md:flex">
      {/* Mismo fondo que la galeria de la landing y el bloque de finanzas. */}
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-paxo-blue/45 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-paxo-blue/30 blur-3xl" />

      <Link href="/" className="relative flex h-24 items-center px-7" aria-label="Soluciones PAXO — inicio del panel">
        <Image src="/brand/paxo-logo-white.svg" alt="Soluciones PAXO C.A." width={1963} height={598} priority className="h-14 w-auto" />
      </Link>

      <nav className="relative flex flex-1 flex-col gap-1.5 px-4 pt-4" aria-label="Secciones del panel">
        {itemsFor(role).map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-[0.95rem] font-semibold transition-colors",
                active ? "bg-white/[0.12] text-white" : "text-white/70 hover:bg-white/[0.07] hover:text-white"
              )}
            >
              {active && <span aria-hidden className="absolute -left-4 top-2.5 bottom-2.5 w-1 rounded-r-full bg-paxo-red" />}
              <Icon className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative m-5 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
        <p className="text-sm font-bold">Panel interno</p>
        <p className="mt-1 text-xs leading-relaxed text-white/65">Solo para el equipo de PAXO. No compartas tu acceso.</p>
      </div>
    </aside>
  );
}

/** En movil el menu lateral se vuelve una fila de secciones deslizable. */
export function MobileNav({ role }: { role: StaffRole }) {
  const isActive = useIsActive();

  return (
    <nav
      className="flex gap-2 overflow-x-auto border-b border-paxo-neutral-dark bg-white px-4 py-2.5 [scrollbar-width:none] md:hidden"
      aria-label="Secciones del panel"
    >
      {itemsFor(role).map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
              active ? "bg-paxo-blue text-white" : "bg-paxo-neutral text-paxo-ink-light"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

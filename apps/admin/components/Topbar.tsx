"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://paxo-sand.vercel.app";

function iniciales(nombre: string | null) {
  if (!nombre) return "P";
  const partes = nombre.trim().split(/\s+/);
  return ((partes[0]?.[0] ?? "") + (partes[1]?.[0] ?? "")).toUpperCase() || "P";
}

export function Topbar({ fullName, roleLabel }: { fullName: string | null; roleLabel: string }) {
  const router = useRouter();
  const hoy = new Intl.DateTimeFormat("es-VE", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-paxo-neutral-dark bg-white/85 px-4 backdrop-blur-md sm:px-6 md:h-20">
      <div className="flex items-center gap-3">
        <Image src="/brand/paxo-mark.svg" alt="PAXO" width={40} height={40} className="h-8 w-8 md:hidden" />
        <p suppressHydrationWarning className="text-sm font-medium first-letter:uppercase text-paxo-ink-light">{hoy}</p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-paxo-blue transition-colors hover:bg-paxo-blue-soft sm:inline-flex"
        >
          Ver sitio web
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>

        <div className="flex items-center gap-3 border-l border-paxo-neutral-dark pl-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paxo-blue text-xs font-bold text-white ring-4 ring-paxo-blue-soft">
            {iniciales(fullName)}
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-bold text-paxo-ink">{fullName ?? "Usuario"}</p>
            <p className="text-xs text-paxo-ink-light">{roleLabel}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-xl text-paxo-ink-light transition-colors hover:bg-paxo-red-soft hover:text-paxo-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paxo-blue"
          >
            <LogOut className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}

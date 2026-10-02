"use client";

import { useRouter } from "next/navigation";
import { Button } from "@paxo/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function Topbar({ fullName, roleLabel }: { fullName: string | null; roleLabel: string }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-paxo-neutral-dark bg-white px-6">
      <div>
        <p className="text-sm font-medium text-paxo-ink">{fullName ?? "Usuario"}</p>
        <p className="text-xs text-paxo-ink-light">{roleLabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-paxo-blue transition-colors hover:bg-paxo-neutral"
        >
          Ver sitio web
          <ExternalLinkIcon className="h-3.5 w-3.5" />
        </a>
        <Button variant="outline" size="sm" onClick={signOut}>
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
}

function ExternalLinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  );
}

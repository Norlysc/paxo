"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@paxo/ui";
import { COMPANY } from "@paxo/shared";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#faq", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
];

export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Bloquea el scroll del fondo mientras el menu movil esta desplegado.
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:h-24">
        <a href="#" className="flex shrink-0 items-center" aria-label={COMPANY.legalName}>
          <Image
            src="/brand/logo-full.jpg"
            alt={COMPANY.legalName}
            width={1000}
            height={500}
            priority
            className="h-14 w-auto object-contain sm:h-16 lg:h-20"
          />
        </a>

        {/* El menu completo aparece desde lg y no desde md: a 768px no caben
            el logo, los cinco enlaces y el boton sin solaparse. Las tablets
            usan el menu desplegable. */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 text-sm font-medium text-slate-700 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-paxo-red after:transition-all after:duration-300 hover:text-paxo-blue hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#cotizar" className="hidden sm:block">
            <Button size="sm" className="rounded-xl shadow-soft">
              Solicitar Asesoría
            </Button>
          </a>

          <button
            type="button"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-paxo-blue transition-colors hover:bg-paxo-neutral lg:hidden"
          >
            {menuAbierto ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuAbierto && (
        <nav
          id="menu-movil"
          className="border-t border-slate-200 bg-white px-4 pb-5 pt-2 shadow-lg sm:px-6 lg:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuAbierto(false)}
              className="block border-b border-slate-100 py-3.5 text-base font-medium text-slate-700 transition-colors last:border-b-0 hover:text-paxo-blue"
            >
              {link.label}
            </a>
          ))}
          <a href="#cotizar" onClick={() => setMenuAbierto(false)} className="mt-4 block">
            <Button size="lg" className="w-full rounded-xl">
              Solicitar Asesoría
            </Button>
          </a>
        </nav>
      )}
    </header>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

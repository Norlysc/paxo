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
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_-22px_rgba(15,23,42,0.3)]">
      <div className="mx-auto flex h-24 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center">
          <Image
            src="/brand/logo-full.jpg"
            alt={COMPANY.legalName}
            width={1000}
            height={500}
            priority
            className="h-16 w-auto object-contain sm:h-20"
          />
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-paxo-blue"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a href="#cotizar">
          <Button size="sm" className="rounded-xl shadow-soft">Solicitar Asesoría</Button>
        </a>
      </div>
    </header>
  );
}

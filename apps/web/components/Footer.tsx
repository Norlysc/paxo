import Image from "next/image";
import { COMPANY, SERVICE_CATEGORIES } from "@paxo/shared";

const SOCIAL_LINKS = [
  { name: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL, Icon: InstagramIcon },
  { name: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK_URL, Icon: FacebookIcon },
  { name: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL, Icon: LinkedinIcon },
  { name: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK_URL, Icon: TiktokIcon },
].filter((link): link is typeof link & { href: string } => Boolean(link.href));

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#f7f9fc] pt-16 pb-7 text-paxo-ink">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-r from-paxo-red via-paxo-red/80 to-paxo-blue" />
      <div aria-hidden className="pointer-events-none absolute -bottom-44 -left-24 h-[28rem] w-[28rem] rounded-full border border-paxo-red/20" />
      <div className="pointer-events-none absolute -top-10 right-2 h-80 w-80 opacity-[0.08]">
        <Image src="/brand/logo-icon-mono.png" alt="" fill sizes="320px" className="object-contain" />
      </div>
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-6">
        <div>
          <div className="inline-flex rounded-xl bg-white px-4 py-2 shadow-lg shadow-black/15">
            <Image src="/brand/logo-full.jpg" alt={COMPANY.legalName} width={1000} height={500} className="h-14 w-auto object-contain" />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-6 text-paxo-ink-light">
            Construcción, mantenimiento y seguridad electrónica integral en Venezuela.
          </p>
          <div className="mt-4 flex gap-2">
            {SOCIAL_LINKS.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                aria-label={name}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-paxo-neutral-dark bg-white text-paxo-ink-light transition-colors hover:border-paxo-red hover:bg-paxo-red hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-paxo-ink">Servicios</p>
          <ul className="mt-4 space-y-2 text-sm text-paxo-ink-light">
            {SERVICE_CATEGORIES.slice(0, 6).map((s) => (
              <li key={s.slug}>{s.label}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-paxo-ink">Contacto</p>
          <ul className="mt-4 space-y-2 text-sm text-paxo-ink-light">
            <li>{COMPANY.phoneNumber}</li>
            <li>{COMPANY.email}</li>
            <li>Venezuela</li>
          </ul>
        </div>
      </div>
      <div className="relative mx-auto mt-12 max-w-6xl border-t border-paxo-neutral-dark px-4 pt-5 sm:px-6">
      <p className="text-center text-xs text-paxo-ink-light">
        © {new Date().getFullYear()} SOLUCIONES PAXO C.A. Todos los derechos reservados.
      </p>
      </div>
    </footer>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H9Z" />
    </svg>
  );
}

function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 3c.4 2.2 2 3.9 4.2 4.2v3.3c-1.5 0-2.9-.4-4.2-1.2v6.4c0 3.4-2.8 6.3-6.3 6.3S4 19.1 4 15.7s2.8-6.3 6.3-6.3c.4 0 .8 0 1.2.1v3.4c-.4-.1-.8-.2-1.2-.2-1.7 0-3 1.4-3 3s1.4 3 3 3 3-1.4 3-3V3h3.2Z" />
    </svg>
  );
}

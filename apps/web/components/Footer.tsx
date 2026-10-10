import Image from "next/image";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { COMPANY } from "@paxo/shared";
import { Button } from "@paxo/ui";
import { whatsappUrl } from "@/lib/contact";

const SOCIAL_LINKS = [
  { name: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL, Icon: InstagramIcon },
  { name: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK_URL, Icon: FacebookIcon },
  { name: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL, Icon: LinkedinIcon },
  { name: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK_URL, Icon: TiktokIcon },
].filter((link): link is typeof link & { href: string } => Boolean(link.href));

const SERVICE_LINKS = [
  "Construcción y obra civil",
  "Instalaciones y mantenimiento",
  "Acabados y carpintería",
  "Seguridad electrónica",
];

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Cómo trabajamos" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#faq", label: "Preguntas frecuentes" },
  { href: "#cotizar", label: "Solicitar asesoría" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#071d45] text-white">
      <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-paxo-red via-paxo-red to-paxo-blue" />
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 opacity-[0.06]">
        <Image src="/brand/logo-icon-mono.png" alt="" fill sizes="384px" className="object-contain mix-blend-screen invert" />
      </div>
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 h-[26rem] w-[26rem] rounded-full border-[26px] border-paxo-blue/20" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Llamado final antes de los enlaces */}
        <div className="flex flex-col gap-6 border-b border-white/10 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-2xl font-extrabold leading-tight sm:text-3xl">¿Listo para empezar tu proyecto?</p>
            <p className="mt-2 text-sm text-white/65 sm:text-base">Visita técnica y presupuesto sin costo, en toda Venezuela.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#cotizar" className="group">
              <Button size="lg" className="btn-shine w-full rounded-xl">
                Solicitar Asesoría
                <ArrowRight aria-hidden className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </a>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="whatsapp" className="w-full rounded-xl">
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div className="col-span-2 md:col-span-1">
            <div className="inline-flex rounded-2xl bg-white px-4 py-2.5 shadow-lg shadow-black/30">
              <Image src="/brand/logo-full.jpg" alt={COMPANY.legalName} width={1000} height={500} className="h-14 w-auto object-contain" />
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/65">
              Construcción, mantenimiento y seguridad electrónica integral en Venezuela.
            </p>
            {SOCIAL_LINKS.length > 0 && (
              <div className="mt-5 flex gap-2">
                {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    aria-label={name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-colors hover:bg-paxo-red hover:ring-paxo-red"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <FooterColumn title="Servicios">
            {SERVICE_LINKS.map((label) => (
              <li key={label}>
                <a href="#servicios" className="transition-colors hover:text-white">
                  {label}
                </a>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Navegación">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Contacto" className="col-span-2 md:col-span-1">
            <ContactItem Icon={Phone} href={`tel:+${COMPANY.whatsappNumber}`}>
              {COMPANY.phoneNumber}
            </ContactItem>
            <ContactItem Icon={Mail} href={`mailto:${COMPANY.email}`}>
              {COMPANY.email}
            </ContactItem>
            <ContactItem Icon={MapPin}>{COMPANY.address}</ContactItem>
          </FooterColumn>
        </div>

        <div className="flex flex-col items-center gap-2 border-t border-white/10 py-6 text-center text-xs text-white/50 sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} SOLUCIONES PAXO C.A. Todos los derechos reservados.</p>
          <p>RIF J-40735075-7</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ffc2c7]">
        <span aria-hidden className="h-0.5 w-4 rounded-full bg-[#ffc2c7]" />
        {title}
      </p>
      <ul className="mt-5 space-y-3 text-sm text-white/70">{children}</ul>
    </div>
  );
}

function ContactItem({
  Icon,
  href,
  children,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children: React.ReactNode;
}) {
  const body = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
        <Icon className="h-4 w-4" />
      </span>
      <span className="pt-1.5 leading-5">{children}</span>
    </>
  );
  return (
    <li>
      {href ? (
        <a href={href} className="flex items-start gap-3 transition-colors hover:text-white">
          {body}
        </a>
      ) : (
        <div className="flex items-start gap-3">{body}</div>
      )}
    </li>
  );
}

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.42a9.87 9.87 0 0 0 4.62 1.18h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.13c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.15.07.15.11.32.02.51-.09.2-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.17-.2.71-.83.9-1.11.19-.28.38-.23.63-.14.26.1 1.63.77 1.9.91.28.14.46.21.53.33.07.12.07.68-.17 1.36z" />
    </svg>
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

import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="hex-pattern relative hidden overflow-hidden bg-paxo-navy p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-paxo-blue/60 blur-3xl" />
        <Image src="/brand/paxo-logo-white.svg" alt="Soluciones PAXO C.A." width={1963} height={598} priority className="relative h-14 w-auto self-start" />
        <div className="relative max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">Panel del equipo PAXO</h1>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            Clientes, cotizaciones, proyectos y finanzas de la empresa en un solo lugar.
          </p>
        </div>
        <p className="relative text-xs text-white/50">Acceso solo para personal autorizado de Soluciones PAXO C.A.</p>
      </section>

      <section className="flex flex-col items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <Image src="/brand/paxo-logo.svg" alt="Soluciones PAXO C.A." width={1963} height={598} priority className="mb-10 h-11 w-auto lg:hidden" />
          <h2 className="text-2xl font-extrabold text-paxo-ink">Inicia sesión</h2>
          <p className="mt-1.5 text-sm text-paxo-ink-light">Usa el correo y la contraseña de tu cuenta del equipo.</p>
          <div className="mt-8">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}

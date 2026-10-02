import Image from "next/image";
import { Suspense } from "react";
import { COMPANY } from "@paxo/shared";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-paxo-blue-dark px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="relative h-16 w-16 rounded-2xl bg-white p-2.5 shadow-lg">
          <Image src="/brand/logo-icon.jpg" alt="" fill sizes="64px" className="object-contain" priority />
        </span>
        <div>
          <p className="font-display text-2xl font-bold text-white">{COMPANY.brandName}</p>
          <p className="text-sm text-white/70">Panel Administrativo</p>
        </div>
      </div>
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

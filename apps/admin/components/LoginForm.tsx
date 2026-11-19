"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@paxo/shared";
import { Button, Input, Label } from "@paxo/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const MISSING_SUPABASE_ENV_MESSAGE =
  "Falta la configuración de Supabase en .env.local. Completa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para iniciar sesión.";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(
    searchParams.get("error") === "unauthorized"
      ? "Tu cuenta no tiene acceso al panel administrativo."
      : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setServerError(null);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setServerError(MISSING_SUPABASE_ENV_MESSAGE);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setServerError(
        error.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos."
          : error.message === "Email not confirmed"
            ? "Tu correo aún no está confirmado. Revisa tu bandeja de entrada."
            : "No pudimos iniciar sesión. Inténtalo de nuevo en unos segundos."
      );
      return;
    }

    router.push(searchParams.get("next") ?? "/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-5">
      <div>
        <Label htmlFor="email">Correo</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-paxo-red">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
        {errors.password && <p className="mt-1 text-xs text-paxo-red">{errors.password.message}</p>}
      </div>
      {serverError && (
        <p role="alert" className="rounded-xl bg-paxo-red-soft px-3 py-2.5 text-sm font-medium text-paxo-red">
          {serverError}
        </p>
      )}
      <Button type="submit" variant="secondary" size="lg" className="w-full text-sm" disabled={isSubmitting}>
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}

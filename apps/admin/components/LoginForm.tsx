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
    const { data, error } = await supabase.auth.signInWithPassword(values);

    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);

    if (error) {
      console.error(error);
      setServerError(error.message);
      return;
    }

    router.push(searchParams.get("next") ?? "/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
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
      {serverError && <p className="text-sm text-paxo-red">{serverError}</p>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}

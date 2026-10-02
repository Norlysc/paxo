"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, type ClientInput } from "@paxo/shared";
import { Button, Input, Label, Textarea } from "@paxo/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ClientForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientInput>({ resolver: zodResolver(clientSchema) });

  async function onSubmit(values: ClientInput) {
    setServerError(null);
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("clients")
      .insert({
        full_name: values.fullName,
        company_name: values.companyName || null,
        email: values.email || null,
        phone: values.phone,
        address: values.address || null,
        source: values.source || null,
      })
      .select("id")
      .single();

    if (error || !data) {
      setServerError("No se pudo crear el cliente. Intenta de nuevo.");
      return;
    }

    router.push(`/clients/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
      <div>
        <Label htmlFor="fullName">Nombre completo</Label>
        <Input id="fullName" {...register("fullName")} />
        {errors.fullName && <p className="mt-1 text-xs text-paxo-red">{errors.fullName.message}</p>}
      </div>
      <div>
        <Label htmlFor="companyName">Empresa (opcional)</Label>
        <Input id="companyName" {...register("companyName")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" {...register("phone")} />
          {errors.phone && <p className="mt-1 text-xs text-paxo-red">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Correo (opcional)</Label>
          <Input id="email" type="email" {...register("email")} />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Dirección (opcional)</Label>
        <Textarea id="address" {...register("address")} />
      </div>
      <div>
        <Label htmlFor="source">Origen (opcional)</Label>
        <Input id="source" placeholder="Referido, redes sociales, web..." {...register("source")} />
      </div>
      {serverError && <p className="text-sm text-paxo-red">{serverError}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : "Crear cliente"}
      </Button>
    </form>
  );
}

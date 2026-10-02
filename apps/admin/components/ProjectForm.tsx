"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectInput } from "@paxo/shared";
import { Button, Input, Label, Textarea } from "@paxo/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ClientOption = { id: string; full_name: string };

export function ProjectForm({ clients }: { clients: ClientOption[] }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({ resolver: zodResolver(projectSchema) });

  async function onSubmit(values: ProjectInput) {
    setServerError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("projects").insert({
      name: values.name,
      client_id: values.clientId,
      description: values.description || null,
      estimated_budget: values.estimatedBudget ?? null,
      start_date: values.startDate || null,
      end_date: values.endDate || null,
    });

    if (error) {
      setServerError("No se pudo crear el proyecto.");
      return;
    }

    router.push("/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
      <div>
        <Label htmlFor="name">Nombre del proyecto</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-paxo-red">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="clientId">Cliente</Label>
        <select
          id="clientId"
          className="h-11 w-full rounded-xl border border-paxo-neutral-dark bg-white px-3 text-sm text-paxo-ink focus:outline-none focus:ring-2 focus:ring-paxo-blue"
          {...register("clientId")}
        >
          <option value="">Selecciona un cliente</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name}
            </option>
          ))}
        </select>
        {errors.clientId && <p className="mt-1 text-xs text-paxo-red">{errors.clientId.message}</p>}
      </div>
      <div>
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea id="description" {...register("description")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="estimatedBudget">Presupuesto estimado (opcional)</Label>
          <Input id="estimatedBudget" type="number" step="0.01" {...register("estimatedBudget", { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="startDate">Fecha de inicio (opcional)</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
        </div>
      </div>
      {serverError && <p className="text-sm text-paxo-red">{serverError}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : "Crear proyecto"}
      </Button>
    </form>
  );
}

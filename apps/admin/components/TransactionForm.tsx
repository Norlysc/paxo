"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { financialTransactionSchema, type FinancialTransactionInput } from "@paxo/shared";
import { Button, Input, Label } from "@paxo/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function TransactionForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FinancialTransactionInput>({
    resolver: zodResolver(financialTransactionSchema),
    defaultValues: { type: "ingreso", date: new Date().toISOString().slice(0, 10) },
  });

  async function onSubmit(values: FinancialTransactionInput) {
    setServerError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("financial_transactions").insert({
      type: values.type,
      amount: values.amount,
      category: values.category,
      description: values.description || null,
      date: values.date,
    });

    if (error) {
      setServerError("No se pudo registrar el movimiento.");
      return;
    }

    reset({ type: values.type, date: values.date, amount: undefined, category: "", description: "" });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3 sm:grid-cols-6 sm:items-end">
      <div className="sm:col-span-1">
        <Label htmlFor="type">Tipo</Label>
        <select
          id="type"
          className="h-11 w-full rounded-xl border border-paxo-neutral-dark bg-white px-3 text-sm text-paxo-ink focus:outline-none focus:ring-2 focus:ring-paxo-blue"
          {...register("type")}
        >
          <option value="ingreso">Ingreso</option>
          <option value="gasto">Gasto</option>
        </select>
      </div>
      <div className="sm:col-span-1">
        <Label htmlFor="amount">Monto</Label>
        <Input id="amount" type="number" step="0.01" {...register("amount", { valueAsNumber: true })} />
        {errors.amount && <p className="mt-1 text-xs text-paxo-red">{errors.amount.message}</p>}
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="category">Categoría</Label>
        <Input id="category" placeholder="Materiales, nómina, servicios..." {...register("category")} />
        {errors.category && <p className="mt-1 text-xs text-paxo-red">{errors.category.message}</p>}
      </div>
      <div className="sm:col-span-1">
        <Label htmlFor="date">Fecha</Label>
        <Input id="date" type="date" {...register("date")} />
      </div>
      <div className="sm:col-span-1">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Registrar"}
        </Button>
      </div>
      <div className="sm:col-span-6">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Input id="description" {...register("description")} />
      </div>
      {serverError && <p className="text-sm text-paxo-red sm:col-span-6">{serverError}</p>}
    </form>
  );
}

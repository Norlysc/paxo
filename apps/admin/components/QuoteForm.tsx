"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quoteSchema, type QuoteInput } from "@paxo/shared";
import { Button, Input, Label, Textarea } from "@paxo/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ClientOption = { id: string; full_name: string };

export function QuoteForm({ clients }: { clients: ClientOption[] }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { status: "borrador", items: [{ description: "", quantity: 1, unitPrice: 0 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = watch("items");
  const total = items?.reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0) ?? 0;

  async function onSubmit(values: QuoteInput) {
    setServerError(null);
    const supabase = createSupabaseBrowserClient();

    const { data: quote, error } = await supabase
      .from("quotes")
      .insert({
        client_id: values.clientId,
        status: values.status,
        notes: values.notes || null,
        valid_until: values.validUntil || null,
        total,
      })
      .select("id")
      .single();

    if (error || !quote) {
      setServerError("No se pudo crear la cotización.");
      return;
    }

    const { error: itemsError } = await supabase.from("quote_items").insert(
      values.items.map((item) => ({
        quote_id: quote.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      }))
    );

    if (itemsError) {
      setServerError("La cotización se creó, pero hubo un error al guardar los ítems.");
      return;
    }

    router.push("/quotes");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
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

      <div className="space-y-3">
        <Label>Ítems</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-2">
            <div className="col-span-6">
              <Input placeholder="Descripción" {...register(`items.${index}.description`)} />
            </div>
            <div className="col-span-2">
              <Input type="number" step="1" placeholder="Cant." {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
            </div>
            <div className="col-span-3">
              <Input
                type="number"
                step="0.01"
                placeholder="Precio unit."
                {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
              />
            </div>
            <div className="col-span-1">
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}>
                ×
              </Button>
            </div>
          </div>
        ))}
        {errors.items && <p className="text-xs text-paxo-red">{errors.items.message}</p>}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}>
          Agregar ítem
        </Button>
      </div>

      <div>
        <Label htmlFor="notes">Notas (opcional)</Label>
        <Textarea id="notes" {...register("notes")} />
      </div>

      <div>
        <Label htmlFor="validUntil">Válida hasta (opcional)</Label>
        <Input id="validUntil" type="date" {...register("validUntil")} />
      </div>

      <div className="flex items-center justify-between rounded-xl bg-paxo-neutral p-4">
        <span className="font-medium text-paxo-ink">Total</span>
        <span className="font-display text-xl font-bold text-paxo-blue">
          {new Intl.NumberFormat("es-VE", { style: "currency", currency: "USD" }).format(total)}
        </span>
      </div>

      {serverError && <p className="text-sm text-paxo-red">{serverError}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : "Crear cotización"}
      </Button>
    </form>
  );
}

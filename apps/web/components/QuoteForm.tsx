"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SERVICE_CATEGORIES, quoteRequestSchema, type QuoteRequestInput } from "@paxo/shared";
import { Button, Input, Label, Textarea } from "@paxo/ui";
import { trackEvent } from "@/lib/analytics";

export function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteRequestInput>({ resolver: zodResolver(quoteRequestSchema) });

  async function onSubmit(values: QuoteRequestInput) {
    setStatus("submitting");
    try {
      // La ruta guarda la solicitud y la envia por correo a PAXO.
      const website = (document.getElementById("website") as HTMLInputElement | null)?.value ?? "";
      let result = { saved: false, emailSent: false };
      try {
        const res = await fetch("/api/solicitud", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, website }),
        });
        if (res.ok) result = await res.json();
      } catch {
        // sigue con el respaldo
      }

      // Si el servidor no pudo enviar el correo (p. ej. sin clave de Gmail
      // configurada), se reenvia por FormSubmit para que la solicitud llegue.
      if (!result.emailSent && !(await sendViaFormSubmit(values)) && !result.saved) {
        throw new Error("No se pudo registrar la solicitud");
      }

      await trackEvent("form_submit", { metadata: { service: values.serviceSlug } });
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="font-display text-lg font-semibold text-emerald-800">¡Solicitud enviada!</p>
        <p className="mt-1 text-sm text-emerald-700">
          Un asesor de PAXO se pondrá en contacto contigo muy pronto.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setStatus("idle")}>
          Enviar otra solicitud
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Campo trampa contra bots: oculto para personas y lectores de pantalla. */}
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div>
        <Label htmlFor="fullName">Nombre completo</Label>
        <Input id="fullName" placeholder="Tu nombre" {...register("fullName")} />
        {errors.fullName && <p className="mt-1 text-xs text-paxo-red">{errors.fullName.message}</p>}
      </div>
      <div>
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" placeholder="+58 412 0000000" {...register("phone")} />
        {errors.phone && <p className="mt-1 text-xs text-paxo-red">{errors.phone.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Correo (opcional)</Label>
        <Input id="email" type="email" placeholder="tucorreo@ejemplo.com" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-paxo-red">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="serviceSlug">Servicio de interés</Label>
        <select
          id="serviceSlug"
          {...register("serviceSlug")}
          className="h-11 w-full rounded-xl border border-paxo-neutral-dark bg-white px-3 text-sm text-paxo-ink focus:outline-none focus:ring-2 focus:ring-paxo-blue"
          defaultValue=""
        >
          <option value="" disabled>
            Selecciona un servicio
          </option>
          {SERVICE_CATEGORIES.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.label}
            </option>
          ))}
        </select>
        {errors.serviceSlug && <p className="mt-1 text-xs text-paxo-red">{errors.serviceSlug.message}</p>}
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="address">Dirección (opcional)</Label>
        <Input id="address" placeholder="Ciudad, urbanización, referencia" {...register("address")} />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="description">¿Qué necesitas?</Label>
        <Textarea id="description" placeholder="Describe brevemente tu proyecto o necesidad" {...register("description")} />
        {errors.description && <p className="mt-1 text-xs text-paxo-red">{errors.description.message}</p>}
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? "Enviando..." : "Solicitar Asesoría Personalizada"}
        </Button>
        {status === "error" && (
          <p className="mt-2 text-sm text-paxo-red">
            No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.
          </p>
        )}
      </div>
    </form>
  );
}

// Alias que FormSubmit asigno a solucionespaxo@gmail.com al activar el
// formulario: evita dejar la direccion de correo a la vista en el codigo.
const FORMSUBMIT_ID = "76e809a74a6ed305b924dafa2519b1e8";

/**
 * Respaldo de envio por correo con FormSubmit (formsubmit.co): no requiere
 * cuenta ni clave. La primera vez FormSubmit manda al buzon un correo de
 * activacion; hasta que se confirme, las solicitudes no se reenvian.
 */
async function sendViaFormSubmit(values: QuoteRequestInput) {
  const service = SERVICE_CATEGORIES.find((s) => s.slug === values.serviceSlug)?.label ?? values.serviceSlug;
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `Nueva solicitud de asesoría: ${service} — ${values.fullName}`,
        _template: "table",
        _captcha: "false",
        ...(values.email ? { _replyto: values.email } : {}),
        Nombre: values.fullName,
        Teléfono: values.phone,
        Correo: values.email || "—",
        Servicio: service,
        Dirección: values.address || "—",
        "¿Qué necesita?": values.description,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { success?: string | boolean };
    return res.ok && String(data.success) === "true";
  } catch {
    return false;
  }
}

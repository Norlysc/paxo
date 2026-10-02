"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { aiAssistantQuerySchema, type AiAssistantQueryInput } from "@paxo/shared";
import { Button, Textarea } from "@paxo/ui";

const SUGGESTED_QUESTIONS = [
  "¿Cuáles son las tendencias de ventas de este mes?",
  "¿Qué servicios tienen mayor rentabilidad?",
  "¿Hay gastos fuera de lo normal este mes?",
  "¿Qué proyectos tienen riesgo de sobrecosto?",
];

export function AiAssistantForm() {
  const router = useRouter();
  const [answer, setAnswer] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AiAssistantQueryInput>({ resolver: zodResolver(aiAssistantQuerySchema) });

  async function onSubmit(values: AiAssistantQueryInput) {
    setServerError(null);
    setAnswer(null);

    const res = await fetch("/api/ai-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setServerError(body?.error ?? "No se pudo generar el análisis.");
      return;
    }

    const body = await res.json();
    setAnswer(body.answer);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Textarea
          placeholder="Pregunta al Asistente Empresarial IA sobre ventas, gastos, clientes o proyectos..."
          {...register("question")}
        />
        {errors.question && <p className="text-xs text-paxo-red">{errors.question.message}</p>}
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setValue("question", q)}
              className="rounded-full border border-paxo-neutral-dark px-3 py-1 text-xs text-paxo-ink-light hover:bg-paxo-neutral"
            >
              {q}
            </button>
          ))}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Analizando..." : "Preguntar"}
        </Button>
      </form>

      {serverError && <p className="text-sm text-paxo-red">{serverError}</p>}

      {answer && (
        <div className="whitespace-pre-wrap rounded-xl border border-paxo-neutral-dark bg-white p-4 text-sm text-paxo-ink">
          {answer}
        </div>
      )}
    </div>
  );
}

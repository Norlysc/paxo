import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { aiAssistantQuerySchema } from "@paxo/shared";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getBusinessSnapshot } from "@/lib/ai-context";

// Server-only: ANTHROPIC_API_KEY nunca se expone al navegador (sin prefijo
// NEXT_PUBLIC_) y este módulo solo se ejecuta en el servidor (Route Handler).
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODELO = "claude-opus-5-5";
// Si el modelo principal declina responder, la API reintenta con este.
const MODELO_RESPALDO = "claude-opus-4-8";

const SYSTEM_PROMPT = `Eres el Asistente Empresarial IA de SOLUCIONES PAXO C.A., una empresa de construcción, mantenimiento y seguridad electrónica en Venezuela.
Analizas los datos financieros y operativos que se te entregan y respondes la pregunta del usuario con una recomendación concreta y accionable.
Responde en español, de forma directa y profesional. Basa tu análisis únicamente en los datos provistos; si falta información para responder con certeza, dilo explícitamente en vez de inventar cifras.`;

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "supervisor"].includes(profile.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "El asistente aún no está activado: falta configurar la clave de la IA (ANTHROPIC_API_KEY)." },
      { status: 503 }
    );
  }

  const parsed = aiAssistantQuerySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Solicitud inválida" }, { status: 400 });
  }

  const snapshot = await getBusinessSnapshot();

  let message: Anthropic.Beta.BetaMessage;
  try {
    message = await anthropic.beta.messages.create({
      model: MODELO,
      // Holgado: con pensamiento adaptativo un tope bajo corta la respuesta.
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      betas: ["server-side-fallback-2026-06-01"],
      fallbacks: [{ model: MODELO_RESPALDO }],
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Datos del negocio (snapshot actual):\n${snapshot}\n\nPregunta: ${parsed.data.question}`,
        },
      ],
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: "La clave de la IA no es válida. Revisa ANTHROPIC_API_KEY." }, { status: 503 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Demasiadas consultas seguidas. Espera un minuto e inténtalo de nuevo." }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError && error.status === 400 && /credit|billing/i.test(error.message)) {
      return NextResponse.json({ error: "La cuenta de la IA no tiene saldo. Recarga créditos en console.anthropic.com." }, { status: 503 });
    }
    console.error("ai-insights:", error instanceof Anthropic.APIError ? `${error.status} ${error.message}` : error);
    return NextResponse.json({ error: "La IA no respondió. Inténtalo de nuevo en unos segundos." }, { status: 502 });
  }

  if (message.stop_reason === "refusal") {
    return NextResponse.json({ error: "La IA no pudo responder esa pregunta. Prueba a formularla de otra forma." }, { status: 422 });
  }

  const answer = message.content
    .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  await supabase.from("ai_insights").insert({
    question: parsed.data.question,
    answer,
    created_by: user.id,
  });

  return NextResponse.json({ answer });
}

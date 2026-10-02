import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { aiAssistantQuerySchema } from "@paxo/shared";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getBusinessSnapshot } from "@/lib/ai-context";

// Server-only: ANTHROPIC_API_KEY nunca se expone al navegador (sin prefijo
// NEXT_PUBLIC_) y este módulo solo se ejecuta en el servidor (Route Handler).
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

  const parsed = aiAssistantQuerySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Solicitud inválida" }, { status: 400 });
  }

  const snapshot = await getBusinessSnapshot();

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2048,
    thinking: { type: "adaptive" },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Datos del negocio (snapshot actual):\n${snapshot}\n\nPregunta: ${parsed.data.question}`,
      },
    ],
  });

  const answer = message.content.find((block) => block.type === "text")?.text ?? "";

  await supabase.from("ai_insights").insert({
    question: parsed.data.question,
    answer,
    created_by: user.id,
  });

  return NextResponse.json({ answer });
}

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { COMPANY, SERVICE_CATEGORIES, quoteRequestSchema, type QuoteRequestInput } from "@paxo/shared";
import { createBrowserSupabaseClient } from "@paxo/database/client";

// nodemailer necesita el runtime de Node (sockets SMTP), no el de Edge.
export const runtime = "nodejs";

/**
 * Recibe el formulario "Solicitar Asesoría Personalizada": guarda la
 * solicitud en Supabase y la envia por correo al buzon oficial de PAXO.
 *
 * El correo sale por SMTP de Gmail con una contrasena de aplicacion de la
 * propia cuenta (GMAIL_USER / GMAIL_APP_PASSWORD, solo servidor). Responde
 * con exito si al menos uno de los dos destinos recibio la solicitud, para
 * que una falla puntual de uno no le haga perder el contacto al visitante.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  // Campo trampa: invisible para personas, los bots lo rellenan.
  if (typeof body === "object" && body && "website" in body && (body as { website?: string }).website) {
    return NextResponse.json({ ok: true });
  }

  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa los datos del formulario" }, { status: 400 });
  }
  const values = parsed.data;

  const [saved, mailed] = await Promise.allSettled([saveToDatabase(values), sendEmail(values)]);
  if (saved.status === "rejected") console.error("[solicitud] no se guardó en Supabase:", saved.reason);
  if (mailed.status === "rejected") console.error("[solicitud] no se envió el correo:", mailed.reason);

  if (saved.status === "rejected" && mailed.status === "rejected") {
    return NextResponse.json({ error: "No pudimos registrar tu solicitud" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

async function saveToDatabase(values: QuoteRequestInput) {
  const supabase = createBrowserSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
  const { error } = await supabase.from("quote_requests").insert({
    full_name: values.fullName,
    phone: values.phone,
    email: values.email || null,
    service_slug: values.serviceSlug,
    description: values.description,
    address: values.address || null,
  });
  if (error) throw error;
}

async function sendEmail(values: QuoteRequestInput) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("Faltan GMAIL_USER / GMAIL_APP_PASSWORD");

  const to = process.env.QUOTE_NOTIFY_EMAIL || COMPANY.email;
  const service = SERVICE_CATEGORIES.find((s) => s.slug === values.serviceSlug)?.label ?? values.serviceSlug;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const rows: [string, string][] = [
    ["Nombre", values.fullName],
    ["Teléfono", values.phone],
    ["Correo", values.email || "—"],
    ["Servicio", service],
    ["Dirección", values.address || "—"],
  ];
  const whatsapp = `https://wa.me/${values.phone.replace(/\D/g, "").replace(/^0/, "58")}`;

  await transporter.sendMail({
    from: `"Web PAXO" <${user}>`,
    to,
    // Al pulsar "Responder" en Gmail se le escribe directo al cliente.
    replyTo: values.email || undefined,
    subject: `Nueva solicitud de asesoría: ${service} — ${values.fullName}`,
    text: [
      "Nueva solicitud desde la página web",
      "",
      ...rows.map(([k, v]) => `${k}: ${v}`),
      "",
      "¿Qué necesita?",
      values.description,
      "",
      `WhatsApp: ${whatsapp}`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111827">
        <div style="background:#18438e;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;border-bottom:4px solid #a61d28">
          <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.8">Página web · SOLUCIONES PAXO C.A.</p>
          <h1 style="margin:6px 0 0;font-size:20px">Nueva solicitud de asesoría</h1>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:0;padding:20px 24px;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            ${rows
              .map(
                ([k, v]) =>
                  `<tr><td style="padding:8px 0;color:#4b5563;width:110px;vertical-align:top">${k}</td><td style="padding:8px 0;font-weight:600">${escapeHtml(v)}</td></tr>`
              )
              .join("")}
          </table>
          <p style="margin:18px 0 6px;color:#4b5563;font-size:14px">¿Qué necesita?</p>
          <p style="margin:0;padding:14px;background:#f5f7fa;border-radius:8px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(values.description)}</p>
          <p style="margin:22px 0 0">
            <a href="${whatsapp}" style="display:inline-block;background:#25d366;color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:8px">Responder por WhatsApp</a>
          </p>
        </div>
      </div>`,
  });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

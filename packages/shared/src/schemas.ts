import { z } from "zod";
import { QUOTE_STATUSES, SERVICE_CATEGORIES, TRANSACTION_TYPES } from "./constants";

const serviceSlugs = SERVICE_CATEGORIES.map((s) => s.slug) as [string, ...string[]];

/** Formulario público de solicitud de cotización (landing + app móvil). */
export const quoteRequestSchema = z.object({
  fullName: z.string().min(3, "Ingresa tu nombre completo").max(120),
  phone: z
    .string()
    .min(7, "Ingresa un teléfono válido")
    .max(20)
    .regex(/^[+0-9 ()-]+$/, "Formato de teléfono inválido"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  serviceSlug: z.enum(serviceSlugs, {
    errorMap: () => ({ message: "Selecciona un servicio" }),
  }),
  description: z.string().min(10, "Cuéntanos más sobre lo que necesitas").max(2000),
  address: z.string().max(300).optional().or(z.literal("")),
  photoUrls: z.array(z.string().url()).max(6).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});
export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

export const clientSchema = z.object({
  companyName: z.string().max(160).optional().or(z.literal("")),
  fullName: z.string().min(3).max(120),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(7).max(20),
  address: z.string().max(300).optional().or(z.literal("")),
  source: z.string().max(80).optional(),
});
export type ClientInput = z.infer<typeof clientSchema>;

export const projectSchema = z.object({
  name: z.string().min(3).max(160),
  clientId: z.string().uuid(),
  description: z.string().max(4000).optional().or(z.literal("")),
  estimatedBudget: z.number().nonnegative().optional(),
  responsibleUserId: z.string().uuid().optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const financialTransactionSchema = z.object({
  type: z.enum(TRANSACTION_TYPES),
  amount: z.number().positive("El monto debe ser mayor a cero"),
  category: z.string().min(2).max(80),
  description: z.string().max(500).optional().or(z.literal("")),
  date: z.string().date(),
  projectId: z.string().uuid().optional(),
});
export type FinancialTransactionInput = z.infer<typeof financialTransactionSchema>;

export const quoteItemSchema = z.object({
  description: z.string().min(2).max(300),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
});

export const quoteSchema = z.object({
  clientId: z.string().uuid(),
  status: z.enum(QUOTE_STATUSES).default("borrador"),
  items: z.array(quoteItemSchema).min(1, "Agrega al menos un ítem"),
  notes: z.string().max(1000).optional().or(z.literal("")),
  validUntil: z.string().date().optional(),
});
export type QuoteInput = z.infer<typeof quoteSchema>;

export const analyticsEventSchema = z.object({
  eventType: z.enum([
    "page_view",
    "whatsapp_click",
    "call_click",
    "email_click",
    "form_submit",
    "service_view",
  ]),
  path: z.string().max(300).optional(),
  sessionId: z.string().min(8).max(100),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;

export const aiAssistantQuerySchema = z.object({
  question: z.string().min(5, "Escribe una pregunta más específica").max(1000),
  periodStart: z.string().date().optional(),
  periodEnd: z.string().date().optional(),
});
export type AiAssistantQueryInput = z.infer<typeof aiAssistantQuerySchema>;

export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const STAFF_ROLES = ["admin", "supervisor", "comercial", "tecnico"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const ALL_ROLES = [...STAFF_ROLES, "cliente"] as const;
export type UserRole = (typeof ALL_ROLES)[number];

export const QUOTE_STATUSES = [
  "borrador",
  "enviada",
  "aceptada",
  "rechazada",
  "vencida",
] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const PROJECT_STATUSES = [
  "planificado",
  "activo",
  "pausado",
  "terminado",
  "cancelado",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const TRANSACTION_TYPES = ["ingreso", "gasto"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const SERVICE_CATEGORIES = [
  { slug: "construccion", label: "Construcción" },
  { slug: "remodelaciones", label: "Remodelaciones" },
  { slug: "infraestructura-civil", label: "Infraestructura Civil" },
  { slug: "electricidad", label: "Electricidad" },
  { slug: "plomeria", label: "Plomería" },
  { slug: "carpinteria", label: "Carpintería" },
  { slug: "herreria", label: "Herrería" },
  { slug: "cristaleria", label: "Cristalería" },
  { slug: "aire-acondicionado", label: "Aire Acondicionado" },
  { slug: "ducteria", label: "Ductería" },
  { slug: "pintura", label: "Pintura" },
  { slug: "drywall", label: "Drywall" },
  { slug: "plycem", label: "Plycem" },
  { slug: "cctv", label: "Sistemas CCTV" },
  { slug: "cercos-electricos", label: "Cercos Eléctricos" },
  { slug: "control-acceso", label: "Control de Acceso" },
  { slug: "seguridad-electronica", label: "Seguridad Electrónica" },
  { slug: "mantenimiento-industrial", label: "Mantenimiento Industrial" },
] as const;
export type ServiceCategorySlug = (typeof SERVICE_CATEGORIES)[number]["slug"];

export const COMPANY = {
  legalName: "SOLUCIONES PAXO C.A.",
  brandName: "PAXO",
  country: "Venezuela",
  address: "Calle Zuloaga, Qta. Lorsilta, P/A Urb. Los Chaguaramos, 1040 Caracas",
  coverageNote: "Trabajamos a nivel nacional en toda Venezuela",
  // Placeholders — reemplazar con datos reales de contacto de la empresa.
  whatsappNumber: "584242250106",
  phoneNumber: "0424 225 0106",
  email: "info@solucionespaxo.com",
} as const;

export const BRAND_COLORS = {
  red: "#A61D28",
  navy: "#1B3B6F",
  white: "#FFFFFF",
  neutral: "#F5F6F8",
} as const;

export const ANALYTICS_EVENT_TYPES = [
  "page_view",
  "whatsapp_click",
  "call_click",
  "email_click",
  "form_submit",
  "service_view",
] as const;
export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

export const AI_INSIGHT_TYPES = [
  "tendencias_ventas",
  "rentabilidad_servicios",
  "gastos_anomalos",
  "clientes_clave",
  "proyectos_en_riesgo",
  "proyeccion_ingresos",
  "comparativo_mensual",
] as const;
export type AiInsightType = (typeof AI_INSIGHT_TYPES)[number];

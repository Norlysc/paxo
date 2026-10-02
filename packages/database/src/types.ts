/**
 * Tipos de la base de datos, escritos a mano para reflejar
 * supabase/migrations/0001_init.sql. Cuando el proyecto Supabase real
 * exista, reemplazar generando con `pnpm --filter @paxo/database gen:types`
 * (ver supabase gen types typescript) y re-exportar desde aquí.
 */

export type StaffRole = "admin" | "supervisor" | "comercial" | "tecnico";
export type UserRole = StaffRole | "cliente";
export type QuoteStatus = "borrador" | "enviada" | "aceptada" | "rechazada" | "vencida";
export type ProjectStatus = "planificado" | "activo" | "pausado" | "terminado" | "cancelado";
export type TransactionType = "ingreso" | "gasto";
export type QuoteRequestStatus = "nuevo" | "contactado" | "convertido" | "descartado";

export type ProfileRow = {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type ClientRow = {
  id: string;
  company_name: string | null;
  full_name: string;
  email: string | null;
  phone: string;
  address: string | null;
  source: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientNoteRow = {
  id: string;
  client_id: string;
  author_id: string | null;
  note: string;
  created_at: string;
};

export type ServiceCatalogRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  icon: string | null;
  active: boolean;
};

export type QuoteRow = {
  id: string;
  client_id: string;
  created_by: string | null;
  status: QuoteStatus;
  notes: string | null;
  valid_until: string | null;
  total: number;
  created_at: string;
  updated_at: string;
};

export type QuoteItemRow = {
  id: string;
  quote_id: string;
  description: string;
  quantity: number;
  unit_price: number;
};

export type ProjectRow = {
  id: string;
  name: string;
  client_id: string;
  description: string | null;
  status: ProjectStatus;
  estimated_budget: number | null;
  actual_cost: number | null;
  responsible_user_id: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

export type FinancialTransactionRow = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  project_id: string | null;
  created_by: string | null;
  created_at: string;
};

export type QuoteRequestRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  service_slug: string;
  description: string;
  address: string | null;
  photo_urls: string[] | null;
  latitude: number | null;
  longitude: number | null;
  status: QuoteRequestStatus;
  submitted_by: string | null;
  created_at: string;
};

export type WebAnalyticsEventRow = {
  id: string;
  event_type: string;
  path: string | null;
  session_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type AiInsightRow = {
  id: string;
  question: string;
  answer: string;
  insight_type: string | null;
  period_start: string | null;
  period_end: string | null;
  tokens_used: number | null;
  created_by: string | null;
  created_at: string;
};

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type Table<Row, Insert, Relationships extends Relationship[] = []> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Row>;
  Relationships: Relationships;
};

/** Relación quotes.client_id -> clients.id, usada en embeds `select("...clients(full_name)")`. */
type QuoteClientRelationship = [
  {
    foreignKeyName: "quotes_client_id_fkey";
    columns: ["client_id"];
    isOneToOne: false;
    referencedRelation: "clients";
    referencedColumns: ["id"];
  },
];

/** Relación projects.client_id -> clients.id, usada en embeds `select("...clients(full_name)")`. */
type ProjectClientRelationship = [
  {
    foreignKeyName: "projects_client_id_fkey";
    columns: ["client_id"];
    isOneToOne: false;
    referencedRelation: "clients";
    referencedColumns: ["id"];
  },
];

/** Forma mínima requerida por `createClient<Database>()` de supabase-js. */
export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, Partial<ProfileRow> & { id: string }>;
      clients: Table<ClientRow, Partial<ClientRow>>;
      client_notes: Table<ClientNoteRow, Partial<ClientNoteRow> & { client_id: string; note: string }>;
      service_catalog: Table<ServiceCatalogRow, Partial<ServiceCatalogRow>>;
      quotes: Table<QuoteRow, Partial<QuoteRow>, QuoteClientRelationship>;
      quote_items: Table<QuoteItemRow, Partial<QuoteItemRow>>;
      projects: Table<ProjectRow, Partial<ProjectRow>, ProjectClientRelationship>;
      financial_transactions: Table<FinancialTransactionRow, Partial<FinancialTransactionRow>>;
      quote_requests: Table<QuoteRequestRow, Partial<QuoteRequestRow>>;
      web_analytics_events: Table<WebAnalyticsEventRow, Partial<WebAnalyticsEventRow>>;
      ai_insights: Table<AiInsightRow, Partial<AiInsightRow>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

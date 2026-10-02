-- ============================================================================
-- PAXO Platform — Esquema inicial (Fase 1)
-- Perfiles y roles, CRM, catálogo de servicios, cotizaciones, facturas,
-- proyectos, finanzas, inventario, calendario, analítica web, auditoría,
-- insights de IA y solicitudes públicas de cotización.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type user_role as enum ('admin', 'supervisor', 'comercial', 'tecnico', 'cliente');
create type quote_status as enum ('borrador', 'enviada', 'aceptada', 'rechazada', 'vencida');
create type project_status as enum ('planificado', 'activo', 'pausado', 'terminado', 'cancelado');
create type transaction_type as enum ('ingreso', 'gasto');
create type quote_request_status as enum ('nuevo', 'contactado', 'convertido', 'descartado');
create type invoice_status as enum ('pendiente', 'pagada', 'vencida', 'anulada');
create type movement_type as enum ('entrada', 'salida');

-- ----------------------------------------------------------------------------
-- Función utilitaria: updated_at automático
-- ----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ----------------------------------------------------------------------------
-- profiles — staff y clientes autenticados (1:1 con auth.users)
-- ----------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'cliente',
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Helper: rol del usuario autenticado actual (usado en políticas RLS).
create or replace function current_user_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role in ('admin', 'supervisor', 'comercial', 'tecnico') from profiles where id = auth.uid()),
    false
  );
$$;

-- Crea automáticamente un profile (rol 'cliente' por defecto) al registrarse.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (new.id, 'cliente', new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ----------------------------------------------------------------------------
-- clients — CRM
-- ----------------------------------------------------------------------------
create table clients (
  id uuid primary key default gen_random_uuid(),
  company_name text,
  full_name text not null,
  email text,
  phone text not null,
  address text,
  source text,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger clients_set_updated_at before update on clients
  for each row execute procedure set_updated_at();

create table client_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  author_id uuid references profiles (id),
  note text not null,
  created_at timestamptz not null default now()
);

create table client_files (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  uploaded_by uuid references profiles (id),
  file_url text not null,
  file_name text not null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- service_catalog
-- ----------------------------------------------------------------------------
create table service_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  description text,
  icon text,
  active boolean not null default true
);

-- ----------------------------------------------------------------------------
-- quotes / quote_items — cotizaciones
-- ----------------------------------------------------------------------------
create table quotes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  created_by uuid references profiles (id),
  status quote_status not null default 'borrador',
  notes text,
  valid_until date,
  total numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger quotes_set_updated_at before update on quotes
  for each row execute procedure set_updated_at();

create table quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes (id) on delete cascade,
  description text not null,
  quantity numeric(12, 2) not null default 1,
  unit_price numeric(12, 2) not null default 0
);

-- ----------------------------------------------------------------------------
-- invoices / invoice_items — facturación
-- ----------------------------------------------------------------------------
create table invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  quote_id uuid references quotes (id),
  status invoice_status not null default 'pendiente',
  total numeric(12, 2) not null default 0,
  issued_at date not null default current_date,
  due_at date,
  created_at timestamptz not null default now()
);

create table invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices (id) on delete cascade,
  description text not null,
  quantity numeric(12, 2) not null default 1,
  unit_price numeric(12, 2) not null default 0
);

-- ----------------------------------------------------------------------------
-- projects — gestión de proyectos
-- ----------------------------------------------------------------------------
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_id uuid not null references clients (id) on delete cascade,
  description text,
  status project_status not null default 'planificado',
  estimated_budget numeric(12, 2),
  actual_cost numeric(12, 2) not null default 0,
  responsible_user_id uuid references profiles (id),
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger projects_set_updated_at before update on projects
  for each row execute procedure set_updated_at();

create table project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  uploaded_by uuid references profiles (id),
  file_url text not null,
  file_name text not null,
  kind text not null default 'document', -- 'document' | 'photo'
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- financial_transactions — gestión financiera
-- ----------------------------------------------------------------------------
create table financial_transactions (
  id uuid primary key default gen_random_uuid(),
  type transaction_type not null,
  amount numeric(12, 2) not null check (amount > 0),
  category text not null,
  description text,
  date date not null default current_date,
  project_id uuid references projects (id),
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- inventory — materiales y herramientas
-- ----------------------------------------------------------------------------
create table inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  unit text not null default 'unidad',
  quantity numeric(12, 2) not null default 0,
  min_stock numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table inventory_movements (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references inventory_items (id) on delete cascade,
  movement_type movement_type not null,
  quantity numeric(12, 2) not null check (quantity > 0),
  note text,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- calendar_events — agenda de visitas técnicas / instalaciones / mantenimiento
-- ----------------------------------------------------------------------------
create table calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_type text not null default 'visita', -- 'visita' | 'instalacion' | 'mantenimiento'
  start_at timestamptz not null,
  end_at timestamptz,
  project_id uuid references projects (id),
  client_id uuid references clients (id),
  assigned_to uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- quote_requests — solicitudes públicas (landing + app móvil, antes de CRM)
-- ----------------------------------------------------------------------------
create table quote_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  service_slug text not null references service_catalog (slug),
  description text not null,
  address text,
  photo_urls text[],
  latitude double precision,
  longitude double precision,
  status quote_request_status not null default 'nuevo',
  submitted_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- push_tokens — notificaciones push (app móvil)
-- ----------------------------------------------------------------------------
create table push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  token text not null unique,
  platform text not null, -- 'ios' | 'android'
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- web_analytics_events — analítica propia
-- ----------------------------------------------------------------------------
create table web_analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  path text,
  session_id text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- audit_logs — auditoría
-- ----------------------------------------------------------------------------
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles (id),
  action text not null,
  table_name text not null,
  record_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- ai_insights — historial del Asistente Empresarial IA
-- ----------------------------------------------------------------------------
create table ai_insights (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  insight_type text,
  period_start date,
  period_end date,
  tokens_used integer,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Índices
-- ----------------------------------------------------------------------------
create index idx_clients_created_by on clients (created_by);
create index idx_quotes_client_id on quotes (client_id);
create index idx_quotes_status on quotes (status);
create index idx_projects_client_id on projects (client_id);
create index idx_projects_status on projects (status);
create index idx_financial_transactions_date on financial_transactions (date);
create index idx_financial_transactions_type on financial_transactions (type);
create index idx_calendar_events_start_at on calendar_events (start_at);
create index idx_quote_requests_status on quote_requests (status);
create index idx_web_analytics_events_type on web_analytics_events (event_type);
create index idx_web_analytics_events_created_at on web_analytics_events (created_at);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table profiles enable row level security;
alter table clients enable row level security;
alter table client_notes enable row level security;
alter table client_files enable row level security;
alter table service_catalog enable row level security;
alter table quotes enable row level security;
alter table quote_items enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;
alter table projects enable row level security;
alter table project_milestones enable row level security;
alter table project_files enable row level security;
alter table financial_transactions enable row level security;
alter table inventory_items enable row level security;
alter table inventory_movements enable row level security;
alter table calendar_events enable row level security;
alter table quote_requests enable row level security;
alter table push_tokens enable row level security;
alter table web_analytics_events enable row level security;
alter table audit_logs enable row level security;
alter table ai_insights enable row level security;

-- profiles: cada usuario ve/edita el suyo; el staff ve todos.
create policy "profiles_select_own_or_staff" on profiles for select
  using (id = auth.uid() or is_staff());
create policy "profiles_update_own" on profiles for update
  using (id = auth.uid());

-- service_catalog: lectura pública (landing/mobile sin auth), escritura solo admin.
create policy "service_catalog_public_read" on service_catalog for select using (active or is_staff());
create policy "service_catalog_admin_write" on service_catalog for all
  using (current_user_role() = 'admin') with check (current_user_role() = 'admin');

-- clients: staff (admin/supervisor/comercial) gestiona el CRM.
create policy "clients_staff_all" on clients for all
  using (current_user_role() in ('admin', 'supervisor', 'comercial'))
  with check (current_user_role() in ('admin', 'supervisor', 'comercial'));
create policy "client_notes_staff_all" on client_notes for all
  using (current_user_role() in ('admin', 'supervisor', 'comercial'))
  with check (current_user_role() in ('admin', 'supervisor', 'comercial'));
create policy "client_files_staff_all" on client_files for all
  using (current_user_role() in ('admin', 'supervisor', 'comercial'))
  with check (current_user_role() in ('admin', 'supervisor', 'comercial'));

-- quotes / invoices: mismo grupo de staff comercial + admin.
create policy "quotes_staff_all" on quotes for all
  using (current_user_role() in ('admin', 'supervisor', 'comercial'))
  with check (current_user_role() in ('admin', 'supervisor', 'comercial'));
create policy "quote_items_staff_all" on quote_items for all
  using (exists (select 1 from quotes q where q.id = quote_id) and current_user_role() in ('admin', 'supervisor', 'comercial'))
  with check (current_user_role() in ('admin', 'supervisor', 'comercial'));
create policy "invoices_staff_all" on invoices for all
  using (current_user_role() in ('admin', 'supervisor', 'comercial'))
  with check (current_user_role() in ('admin', 'supervisor', 'comercial'));
create policy "invoice_items_staff_all" on invoice_items for all
  using (current_user_role() in ('admin', 'supervisor', 'comercial'))
  with check (current_user_role() in ('admin', 'supervisor', 'comercial'));

-- projects: admin/supervisor ven todo; técnico ve solo lo asignado.
create policy "projects_admin_supervisor_all" on projects for all
  using (current_user_role() in ('admin', 'supervisor'))
  with check (current_user_role() in ('admin', 'supervisor'));
create policy "projects_tecnico_assigned_select" on projects for select
  using (current_user_role() = 'tecnico' and responsible_user_id = auth.uid());
create policy "project_milestones_staff" on project_milestones for all
  using (is_staff()) with check (is_staff());
create policy "project_files_staff" on project_files for all
  using (is_staff()) with check (is_staff());

-- financial_transactions: solo admin/supervisor (información sensible).
create policy "financial_transactions_admin_supervisor" on financial_transactions for all
  using (current_user_role() in ('admin', 'supervisor'))
  with check (current_user_role() in ('admin', 'supervisor'));

-- inventory: staff operativo.
create policy "inventory_items_staff_all" on inventory_items for all
  using (is_staff()) with check (is_staff());
create policy "inventory_movements_staff_all" on inventory_movements for all
  using (is_staff()) with check (is_staff());

-- calendar_events: staff ve todo; técnico ve lo propio.
create policy "calendar_events_admin_supervisor_comercial" on calendar_events for all
  using (current_user_role() in ('admin', 'supervisor', 'comercial'))
  with check (current_user_role() in ('admin', 'supervisor', 'comercial'));
create policy "calendar_events_tecnico_assigned" on calendar_events for select
  using (current_user_role() = 'tecnico' and assigned_to = auth.uid());

-- quote_requests: cualquiera (anónimo incluido) puede crear una solicitud;
-- solo staff comercial puede leer/gestionar; un cliente autenticado ve las suyas.
create policy "quote_requests_public_insert" on quote_requests for insert
  with check (true);
create policy "quote_requests_staff_select" on quote_requests for select
  using (current_user_role() in ('admin', 'supervisor', 'comercial'));
create policy "quote_requests_staff_update" on quote_requests for update
  using (current_user_role() in ('admin', 'supervisor', 'comercial'));
create policy "quote_requests_owner_select" on quote_requests for select
  using (submitted_by = auth.uid());

-- push_tokens: cada usuario gestiona los suyos.
create policy "push_tokens_owner_all" on push_tokens for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- web_analytics_events: inserción pública (anónima), lectura solo staff.
create policy "web_analytics_events_public_insert" on web_analytics_events for insert with check (true);
create policy "web_analytics_events_staff_select" on web_analytics_events for select using (is_staff());

-- audit_logs: solo lectura para admin; inserciones vía funciones/triggers (service role).
create policy "audit_logs_admin_select" on audit_logs for select using (current_user_role() = 'admin');

-- ai_insights: staff con acceso a información financiera (admin/supervisor).
create policy "ai_insights_admin_supervisor_all" on ai_insights for all
  using (current_user_role() in ('admin', 'supervisor'))
  with check (current_user_role() in ('admin', 'supervisor'));

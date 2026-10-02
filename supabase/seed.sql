-- ============================================================================
-- Datos de ejemplo — Fase 1
-- Catálogo de servicios PAXO + un cliente/proyecto/finanzas demo para que
-- el Dashboard Ejecutivo y el Asistente IA tengan datos reales con qué operar.
-- ============================================================================

insert into service_catalog (slug, name, category, description, icon) values
  ('construccion', 'Construcción', 'Obra civil', 'Construcción de obras civiles nuevas.', 'hard-hat'),
  ('remodelaciones', 'Remodelaciones', 'Obra civil', 'Remodelación de espacios residenciales y comerciales.', 'hammer'),
  ('infraestructura-civil', 'Infraestructura Civil', 'Obra civil', 'Proyectos de infraestructura civil.', 'building'),
  ('electricidad', 'Electricidad', 'Instalaciones', 'Instalaciones y reparaciones eléctricas.', 'zap'),
  ('plomeria', 'Plomería', 'Instalaciones', 'Instalación y mantenimiento de plomería.', 'droplet'),
  ('carpinteria', 'Carpintería', 'Acabados', 'Trabajos de carpintería a medida.', 'axe'),
  ('herreria', 'Herrería', 'Acabados', 'Trabajos de herrería y estructuras metálicas.', 'wrench'),
  ('cristaleria', 'Cristalería', 'Acabados', 'Instalación de vidrios y cristales.', 'square'),
  ('aire-acondicionado', 'Aire Acondicionado', 'Climatización', 'Instalación y mantenimiento de A/C.', 'wind'),
  ('ducteria', 'Ductería', 'Climatización', 'Diseño e instalación de ductería.', 'wind'),
  ('pintura', 'Pintura', 'Acabados', 'Pintura residencial e industrial.', 'paint-roller'),
  ('drywall', 'Drywall', 'Acabados', 'Instalación de sistemas drywall.', 'layout-panel-top'),
  ('plycem', 'Plycem', 'Acabados', 'Instalación de sistemas plycem.', 'layers'),
  ('cctv', 'Sistemas CCTV', 'Seguridad electrónica', 'Diseño e instalación de cámaras de seguridad.', 'camera'),
  ('cercos-electricos', 'Cercos Eléctricos', 'Seguridad electrónica', 'Instalación de cercos eléctricos perimetrales.', 'shield'),
  ('control-acceso', 'Control de Acceso', 'Seguridad electrónica', 'Sistemas de control de acceso.', 'key'),
  ('seguridad-electronica', 'Seguridad Electrónica', 'Seguridad electrónica', 'Soluciones integrales de seguridad electrónica.', 'shield-check'),
  ('mantenimiento-industrial', 'Mantenimiento Industrial', 'Mantenimiento', 'Mantenimiento preventivo y correctivo industrial.', 'settings')
on conflict (slug) do nothing;

-- Cliente demo
insert into clients (id, company_name, full_name, email, phone, address, source)
values (
  '11111111-1111-1111-1111-111111111111',
  'Centro Comercial Demo C.A.',
  'Carlos Delgado',
  'carlos@demo-cliente.com',
  '+58 412 5551234',
  'Av. Principal, Valencia, Carabobo',
  'referido'
) on conflict (id) do nothing;

-- Proyecto demo
insert into projects (id, name, client_id, description, status, estimated_budget, actual_cost, start_date)
values (
  '22222222-2222-2222-2222-222222222222',
  'Instalación CCTV — Centro Comercial Demo',
  '11111111-1111-1111-1111-111111111111',
  'Instalación de 24 cámaras CCTV y central de monitoreo.',
  'activo',
  18000,
  12500,
  current_date - interval '20 days'
) on conflict (id) do nothing;

-- Cotización demo
insert into quotes (id, client_id, status, notes, total)
values (
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'aceptada',
  'Cotización inicial del proyecto de CCTV.',
  18000
) on conflict (id) do nothing;

insert into quote_items (quote_id, description, quantity, unit_price) values
  ('33333333-3333-3333-3333-333333333333', 'Cámara IP 4MP', 24, 250),
  ('33333333-3333-3333-3333-333333333333', 'NVR 32 canales', 1, 3200),
  ('33333333-3333-3333-3333-333333333333', 'Mano de obra e instalación', 1, 8800);

-- Transacciones financieras demo (para que el dashboard y la IA tengan datos)
insert into financial_transactions (type, amount, category, description, date, project_id) values
  ('ingreso', 9000, 'Anticipo de proyecto', 'Anticipo 50% - Instalación CCTV', current_date - interval '18 days', '22222222-2222-2222-2222-222222222222'),
  ('gasto', 6500, 'Materiales', 'Compra de cámaras y NVR', current_date - interval '15 days', '22222222-2222-2222-2222-222222222222'),
  ('gasto', 2100, 'Mano de obra', 'Pago de cuadrilla de instalación', current_date - interval '5 days', '22222222-2222-2222-2222-222222222222'),
  ('gasto', 850, 'Transporte', 'Traslado de equipos y personal', current_date - interval '4 days', '22222222-2222-2222-2222-222222222222'),
  ('ingreso', 4500, 'Servicio de electricidad', 'Cotización residencial aceptada', current_date - interval '10 days', null),
  ('gasto', 1200, 'Materiales', 'Cableado y tomacorrientes', current_date - interval '9 days', null);

-- ============================================================================
-- 0002 — Impide que un usuario cambie su propio rol
-- ============================================================================
-- La politica "profiles_update_own" (0001) deja que cada usuario edite su fila
-- de profiles, incluida la columna role. Como el registro por correo esta
-- abierto y la anon key es publica, cualquiera podia crear una cuenta y
-- hacerse 'admin' con un UPDATE, y con eso leer clientes, cotizaciones y
-- finanzas a traves de las politicas de staff.
--
-- Este trigger rechaza cualquier cambio de role hecho por un usuario de la
-- API que no sea admin. Las sesiones sin usuario de la API (editor SQL del
-- panel de Supabase, service role) no se ven afectadas, asi que el dueno
-- puede seguir asignando roles desde el editor SQL.
-- ============================================================================

create or replace function prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and current_user_role() is distinct from 'admin' then
    raise exception 'Solo un administrador puede cambiar roles'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_role on profiles;
create trigger profiles_protect_role
  before update on profiles
  for each row execute procedure prevent_role_self_escalation();

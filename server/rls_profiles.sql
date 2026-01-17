-- 1. Activar RLS en la tabla profiles
alter table public.profiles enable row level security;

-- 2. Borrar políticas existentes si las hay (para evitar errores si ya existen)
drop policy if exists "Los perfiles son visibles para todos los usuarios" on public.profiles;
drop policy if exists "Los usuarios solo pueden editar su propio perfil" on public.profiles;

-- 3. Crear política para lectura (SELECT)
-- Permite que cualquier usuario autenticado lea los perfiles (necesario para ver nombres en el dashboard)
create policy "Los perfiles son visibles para todos los usuarios"
on public.profiles for select
to authenticated
using ( true );

-- 4. Crear política para actualización (UPDATE)
-- Solo permite que el dueño del perfil lo modifique
create policy "Los usuarios solo pueden editar su propio perfil"
on public.profiles for update
to authenticated
using ( auth.uid() = id );

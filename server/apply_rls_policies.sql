-- MASTER SECURITY SCRIPT for Campos Deportivos
-- This script secures both Database Tables and Storage Buckets

-- 1. ENABLE RLS ON ALL TABLES
alter table public.profiles enable row level security;
alter table public.stadiums enable row level security;
alter table public.assets enable row level security;
alter table public.asset_movements enable row level security;
alter table public.attendance enable row level security;
alter table public.requests enable row level security;
alter table public.news enable row level security;
alter table public.courses enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.payroll enable row level security;

-- 2. DATABASE POLICIES

-- PROFILES: Reading names is necessary for the app, but editing is restricted.
drop policy if exists "Perfiles visibles" on public.profiles;
create policy "Perfiles visibles" on public.profiles for select to authenticated using (true);
drop policy if exists "Edición propia perfiles" on public.profiles;
create policy "Edición propia perfiles" on public.profiles for update to authenticated using (auth.uid() = id);

-- STADIUMS (Predios)
drop policy if exists "Sedes visibles" on public.stadiums;
create policy "Sedes visibles" on public.stadiums for select to authenticated using (true);
drop policy if exists "Admin gestiona sedes" on public.stadiums;
create policy "Admin gestiona sedes" on public.stadiums for all to authenticated 
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ASSETS (Inventario)
drop policy if exists "Activos visibles" on public.assets;
create policy "Activos visibles" on public.assets for select to authenticated using (true);
drop policy if exists "Admin gestiona activos" on public.assets;
create policy "Admin gestiona activos" on public.assets for all to authenticated 
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ASSET MOVEMENTS (Logística)
drop policy if exists "Movimientos visibles" on public.asset_movements;
create policy "Movimientos visibles" on public.asset_movements for select to authenticated using (true);
drop policy if exists "Registro movimientos" on public.asset_movements;
create policy "Registro movimientos" on public.asset_movements for insert to authenticated with check (true);

-- ATTENDANCE (Fichado)
drop policy if exists "Ver propia asistencia" on public.attendance;
create policy "Ver propia asistencia" on public.attendance for select to authenticated 
  using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
drop policy if exists "Fichar uno mismo" on public.attendance;
create policy "Fichar uno mismo" on public.attendance for insert to authenticated with check (auth.uid() = user_id);

-- REQUESTS (Solicitudes)
drop policy if exists "Ver propias solicitudes" on public.requests;
create policy "Ver propias solicitudes" on public.requests for select to authenticated 
  using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
drop policy if exists "Crear solicitudes" on public.requests;
create policy "Crear solicitudes" on public.requests for insert to authenticated with check (auth.uid() = user_id);

-- PAYROLL (Recibos)
drop policy if exists "Ver propios recibos" on public.payroll;
create policy "Ver propios recibos" on public.payroll for select to authenticated 
  using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 3. STORAGE POLICIES (Protects files in Buckets)

-- Avatars: Public read, private write
drop policy if exists "Avatars public read" on storage.objects;
create policy "Avatars public read" on storage.objects for select to public using (bucket_id = 'avatars');
drop policy if exists "Avatars self upload" on storage.objects;
create policy "Avatars self upload" on storage.objects for insert to authenticated with check (bucket_id = 'avatars');

-- Payroll: Strictly private
drop policy if exists "Payroll private access" on storage.objects;
create policy "Payroll private access" on storage.objects for select to authenticated 
  using (bucket_id = 'payroll' and (storage.foldername(name))[1] = auth.uid()::text or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 4. SYSTEM TABLES
alter table public.spatial_ref_sys enable row level security;
drop policy if exists "spatial_ref_sys readability" on public.spatial_ref_sys;
create policy "spatial_ref_sys readability" on public.spatial_ref_sys for select to authenticated using (true);

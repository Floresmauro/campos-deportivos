-- Enable PostGIS for geolocation if needed (optional, but good for lat/lng)
create extension if not exists "postgis";

-- Users Table (Extends Supabase Auth or Standalone)
-- We will rely on Supabase Auth, but we need a public profiles table to store roles and extra data.
create table public.profiles (
  id uuid references auth.users not null,
  email text,
  full_name text,
  role text check (role in ('admin', 'manager', 'employee')),
  assigned_stadium_id uuid, -- For managers/employees
  phone text,
  primary key (id)
);

-- Roles security policies (RLS) would go here.

-- Stadiums / Sedes
create table public.stadiums (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text,
  city text,
  manager_id uuid references public.profiles(id),
  contact_phone text,
  location_lat float,
  location_lng float,
  created_at timestamp default now()
);

-- Assets / Inventario
create table public.assets (
  id uuid default gen_random_uuid() primary key,
  name text not null, -- e.g. "Tractor John Deere"
  type text check (type in ('machinery', 'tool', 'vehicle', 'other')),
  brand text,
  model text,
  serial_number text,
  qr_code text unique, -- Could be the UUID string or a separate code
  status text check (status in ('available', 'in_use', 'maintenance', 'out_of_service')),
  current_stadium_id uuid references public.stadiums(id),
  assigned_to_user_id uuid references public.profiles(id),
  photo_url text,
  notes text,
  created_at timestamp default now()
);

-- Asset Movements / Logistica
create table public.asset_movements (
  id uuid default gen_random_uuid() primary key,
  asset_id uuid references public.assets(id) not null,
  from_stadium_id uuid references public.stadiums(id),
  to_stadium_id uuid references public.stadiums(id),
  moved_by_user_id uuid references public.profiles(id),
  timestamp timestamp default now(),
  notes text
);

-- Attendance / Fichado
create table public.attendance (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  type text check (type in ('check_in', 'check_out')),
  timestamp timestamp default now(),
  location_lat float,
  location_lng float,
  photo_url text -- verification photo
);

-- Requests / Solicitudes (Vacations, Permits)
create table public.requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  type text check (type in ('vacation', 'permit', 'other')),
  start_date date,
  end_date date,
  status text check (status in ('pending', 'approved', 'rejected')),
  reason text,
  admin_notes text,
  created_at timestamp default now()
);

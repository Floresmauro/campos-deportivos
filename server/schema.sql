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

-- News / Blog Posts
create table public.news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  excerpt text,
  image_url text,
  author_id uuid references public.profiles(id),
  published boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Courses / Training
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  instructor text,
  start_date date not null,
  end_date date,
  max_students integer,
  location text,
  active boolean default true,
  created_at timestamp default now()
);

-- Course Enrollments
create table public.course_enrollments (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('enrolled', 'completed', 'dropped')) default 'enrolled',
  enrolled_at timestamp default now(),
  completed_at timestamp,
  unique(course_id, user_id)
);

-- Indexes for performance
create index idx_news_published on public.news(published, created_at);
create index idx_courses_active on public.courses(active, start_date);
create index idx_enrollments_user on public.course_enrollments(user_id);
create index idx_enrollments_course on public.course_enrollments(course_id);
create index idx_attendance_user_date on public.attendance(user_id, timestamp);
create index idx_requests_user_status on public.requests(user_id, status);

-- Payroll / Recibos de Pago
create table public.payroll (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  month integer not null check (month between 1 and 12),
  year integer not null,
  gross_salary decimal(10, 2),
  net_salary decimal(10, 2),
  deductions decimal(10, 2),
  bonuses decimal(10, 2),
  file_url text, -- URL to PDF stored in Supabase Storage
  notes text,
  created_at timestamp default now(),
  created_by uuid references public.profiles(id),
  unique(user_id, month, year)
);

create index idx_payroll_user on public.payroll(user_id, year desc, month desc);

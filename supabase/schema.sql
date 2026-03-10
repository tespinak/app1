-- Tabla base para almacenar onboarding y métricas iniciales del usuario.
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  registration_date timestamptz not null default now(),
  estimated_lost_amount numeric,
  bet_types text[] not null default '{}',
  trigger_teams text[] not null default '{}',
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'premium'))
);

-- Diario de impulsos (modelo MVP anterior).
create table if not exists public.impulse_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  intensity int not null check (intensity between 1 and 10),
  trigger text not null,
  action_taken text not null,
  emotional_state text not null
);

-- Diario simplificado para registro rápido de impulsos.
create table if not exists public.impulse_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  trigger text not null,
  resisted boolean not null,
  note text
);

-- Preferencias de alertas personalizadas.
create table if not exists public.alert_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  team_alerts boolean not null default true,
  payday_alerts boolean not null default true,
  risk_hours_alerts boolean not null default true,
  breathing_reminders boolean not null default true,
  nightly_checkin boolean not null default true,
  milestone_celebrations boolean not null default true,
  risk_hours text[] not null default '{}'
);

-- Metas y objetivos del usuario.
create table if not exists public.recovery_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text not null check (type in ('ahorro', 'dias_limpio', 'personalizada')),
  target_value numeric not null check (target_value > 0),
  current_value numeric not null default 0,
  due_date date,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
alter table public.impulse_entries enable row level security;
alter table public.impulse_logs enable row level security;
alter table public.alert_preferences enable row level security;
alter table public.recovery_goals enable row level security;

create policy "Users can read own profile" on public.user_profiles for select using (auth.uid() = id);
create policy "Users can insert or update own profile" on public.user_profiles for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users can manage own impulse entries" on public.impulse_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own impulse logs" on public.impulse_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own alert preferences" on public.alert_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own recovery goals" on public.recovery_goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

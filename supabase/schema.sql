create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  company text not null,
  location text,
  profile_url text,
  status text not null default 'new',
  fit_score integer not null default 0 check (fit_score >= 0 and fit_score <= 100),
  source text,
  owner text,
  last_touch date,
  next_action text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  segment text,
  sent integer not null default 0,
  accepted integer not null default 0,
  replied integer not null default 0,
  meetings integer not null default 0,
  status text not null default 'Attiva',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  due_date date,
  due_label text,
  priority text not null default 'Media',
  type text not null default 'Follow-up',
  completed boolean not null default false,
  lead_id uuid references public.leads(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.message_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  channel text not null,
  conversion integer not null default 0,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads enable row level security;
alter table public.campaigns enable row level security;
alter table public.tasks enable row level security;
alter table public.message_templates enable row level security;

create policy "Authenticated users can read leads"
  on public.leads for select
  to authenticated
  using (true);

create policy "Authenticated users can manage leads"
  on public.leads for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can read campaigns"
  on public.campaigns for select
  to authenticated
  using (true);

create policy "Authenticated users can manage campaigns"
  on public.campaigns for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can read tasks"
  on public.tasks for select
  to authenticated
  using (true);

create policy "Authenticated users can manage tasks"
  on public.tasks for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can read message templates"
  on public.message_templates for select
  to authenticated
  using (true);

create policy "Authenticated users can manage message templates"
  on public.message_templates for all
  to authenticated
  using (true)
  with check (true);

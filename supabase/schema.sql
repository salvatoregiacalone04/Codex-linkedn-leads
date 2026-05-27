create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  company text not null,
  location text,
  profile_url text,
  status text not null default 'new'
    check (status in ('new', 'connected', 'messaged', 'follow_up', 'meeting')),
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
  sent integer not null default 0 check (sent >= 0),
  accepted integer not null default 0 check (accepted >= 0),
  replied integer not null default 0 check (replied >= 0),
  meetings integer not null default 0 check (meetings >= 0),
  status text not null default 'Attiva',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  due_date date,
  due_label text,
  priority text not null default 'Media' check (priority in ('Bassa', 'Media', 'Alta')),
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
  conversion integer not null default 0 check (conversion >= 0 and conversion <= 100),
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.icp_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Default ICP',
  target_role text,
  industry text,
  company_size text,
  location text,
  seniority text,
  keywords text,
  excluded_keywords text,
  quality_priority text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.automation_settings (
  id uuid primary key default gen_random_uuid(),
  start_date date,
  start_time time not null default '09:00',
  business_days text[] not null default array['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  linkedin_profile_url text,
  weekly_connection_limit integer not null default 250 check (weekly_connection_limit >= 0),
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.manual_activities (
  id uuid primary key default gen_random_uuid(),
  activity_date date not null default current_date,
  sent_today integer not null default 0 check (sent_today >= 0),
  sent_this_week integer not null default 0 check (sent_this_week >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

drop trigger if exists set_campaigns_updated_at on public.campaigns;
create trigger set_campaigns_updated_at
  before update on public.campaigns
  for each row execute function public.set_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

drop trigger if exists set_message_templates_updated_at on public.message_templates;
create trigger set_message_templates_updated_at
  before update on public.message_templates
  for each row execute function public.set_updated_at();

drop trigger if exists set_icp_profiles_updated_at on public.icp_profiles;
create trigger set_icp_profiles_updated_at
  before update on public.icp_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_automation_settings_updated_at on public.automation_settings;
create trigger set_automation_settings_updated_at
  before update on public.automation_settings
  for each row execute function public.set_updated_at();

drop trigger if exists set_manual_activities_updated_at on public.manual_activities;
create trigger set_manual_activities_updated_at
  before update on public.manual_activities
  for each row execute function public.set_updated_at();

alter table public.leads enable row level security;
alter table public.campaigns enable row level security;
alter table public.tasks enable row level security;
alter table public.message_templates enable row level security;
alter table public.icp_profiles enable row level security;
alter table public.automation_settings enable row level security;
alter table public.manual_activities enable row level security;

drop policy if exists "Authenticated users can read leads" on public.leads;
drop policy if exists "Authenticated users can manage leads" on public.leads;
drop policy if exists "Authenticated users can read campaigns" on public.campaigns;
drop policy if exists "Authenticated users can manage campaigns" on public.campaigns;
drop policy if exists "Authenticated users can read tasks" on public.tasks;
drop policy if exists "Authenticated users can manage tasks" on public.tasks;
drop policy if exists "Authenticated users can read message templates" on public.message_templates;
drop policy if exists "Authenticated users can manage message templates" on public.message_templates;

drop policy if exists "Dashboard can manage leads" on public.leads;
create policy "Dashboard can manage leads"
  on public.leads for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Dashboard can manage campaigns" on public.campaigns;
create policy "Dashboard can manage campaigns"
  on public.campaigns for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Dashboard can manage tasks" on public.tasks;
create policy "Dashboard can manage tasks"
  on public.tasks for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Dashboard can manage message templates" on public.message_templates;
create policy "Dashboard can manage message templates"
  on public.message_templates for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Dashboard can manage ICP profiles" on public.icp_profiles;
create policy "Dashboard can manage ICP profiles"
  on public.icp_profiles for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Dashboard can manage automation settings" on public.automation_settings;
create policy "Dashboard can manage automation settings"
  on public.automation_settings for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Dashboard can manage manual activities" on public.manual_activities;
create policy "Dashboard can manage manual activities"
  on public.manual_activities for all
  to anon, authenticated
  using (true)
  with check (true);

insert into public.leads
  (id, name, role, company, location, profile_url, status, fit_score, source, owner, last_touch, next_action, notes)
values
  ('11111111-1111-4111-8111-111111111111', 'Giulia Marino', 'Head of Sales', 'Northstar CRM', 'Milano', 'linkedin.com/in/giuliamarino', 'follow_up', 91, 'Sales Navigator', 'Massi', '2026-05-10', 'Inviare caso studio SaaS', 'Ha risposto positivamente al problema pipeline outbound.'),
  ('22222222-2222-4222-8222-222222222222', 'Lorenzo Costa', 'Founder', 'Hireloop', 'Torino', 'linkedin.com/in/lorenzocosta', 'connected', 84, 'CSV import', 'Massi', '2026-05-09', 'Mandare primo messaggio', 'Startup HR tech in fase di crescita.'),
  ('33333333-3333-4333-8333-333333333333', 'Sara Bianchi', 'Marketing Director', 'Atlas Cloud', 'Roma', 'linkedin.com/in/sarabianchi', 'messaged', 76, 'Manuale', 'Massi', '2026-05-08', 'Aspettare risposta 48h', 'Interesse su automazione nurturing.'),
  ('44444444-4444-4444-8444-444444444444', 'Marco Rinaldi', 'CEO', 'Finwise', 'Bologna', 'linkedin.com/in/marcorinaldi', 'meeting', 95, 'Referral', 'Massi', '2026-05-11', 'Preparare agenda call', 'Call fissata per discutere outbound B2B.'),
  ('55555555-5555-4555-8555-555555555555', 'Elena Ferri', 'Operations Manager', 'Logixware', 'Verona', 'linkedin.com/in/elenaferri', 'new', 69, 'Sales Navigator', 'Massi', '2026-05-07', 'Validare ICP', 'Azienda compatibile, ruolo da qualificare.')
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  company = excluded.company,
  location = excluded.location,
  profile_url = excluded.profile_url,
  status = excluded.status,
  fit_score = excluded.fit_score,
  source = excluded.source,
  owner = excluded.owner,
  last_touch = excluded.last_touch,
  next_action = excluded.next_action,
  notes = excluded.notes;

insert into public.campaigns
  (id, name, segment, sent, accepted, replied, meetings, status)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'SaaS Sales Leaders IT', 'Head of Sales, VP Sales', 118, 46, 19, 7, 'Attiva'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Founder HR Tech', 'Founder, CEO', 74, 31, 11, 4, 'In test'),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Marketing Automation', 'Marketing Director', 92, 29, 8, 2, 'Pausa')
on conflict (id) do update set
  name = excluded.name,
  segment = excluded.segment,
  sent = excluded.sent,
  accepted = excluded.accepted,
  replied = excluded.replied,
  meetings = excluded.meetings,
  status = excluded.status;

insert into public.tasks
  (id, title, due_date, due_label, priority, type, completed, lead_id)
values
  ('66666666-6666-4666-8666-666666666666', 'Follow-up a Giulia Marino', current_date, 'Oggi', 'Alta', 'Follow-up', false, '11111111-1111-4111-8111-111111111111'),
  ('77777777-7777-4777-8777-777777777777', 'Preparare agenda call Finwise', current_date + interval '1 day', 'Domani', 'Alta', 'Meeting', false, '44444444-4444-4444-8444-444444444444'),
  ('88888888-8888-4888-8888-888888888888', 'Rivedere template connessione', '2026-05-16', '16 Mag', 'Media', 'Template', false, null),
  ('99999999-9999-4999-8999-999999999999', 'Importare 50 lead HR Tech', '2026-05-17', '17 Mag', 'Bassa', 'Import', false, null)
on conflict (id) do update set
  title = excluded.title,
  due_date = excluded.due_date,
  due_label = excluded.due_label,
  priority = excluded.priority,
  type = excluded.type,
  completed = excluded.completed,
  lead_id = excluded.lead_id;

insert into public.message_templates
  (id, title, channel, conversion, body)
values
  ('12121212-1212-4121-8121-121212121212', 'Connessione ICP SaaS', 'Richiesta collegamento', 39, 'Ciao {{nome}}, ho visto il lavoro che state facendo in {{azienda}}. Mi occupo di pipeline outbound per team B2B e mi farebbe piacere connetterci.'),
  ('34343434-3434-4343-8343-343434343434', 'Primo messaggio valore', 'Messaggio dopo accettazione', 21, 'Grazie per il collegamento. Sto mappando come team simili al vostro gestiscono prospecting e follow-up LinkedIn. Ha senso scambiarci due idee?')
on conflict (id) do update set
  title = excluded.title,
  channel = excluded.channel,
  conversion = excluded.conversion,
  body = excluded.body;

insert into public.icp_profiles
  (id, name, target_role, industry, company_size, location, seniority, keywords, excluded_keywords, quality_priority)
values
  ('56565656-5656-4565-8565-565656565656', 'Default ICP', 'Founder, CEO, Head of Sales', 'SaaS, HR Tech, Marketing Automation', '11-50', 'Italy, Europe', 'Founder', 'B2B, growth, sales, automation', 'student, intern, recruiter', 'Balanced')
on conflict (id) do update set
  name = excluded.name,
  target_role = excluded.target_role,
  industry = excluded.industry,
  company_size = excluded.company_size,
  location = excluded.location,
  seniority = excluded.seniority,
  keywords = excluded.keywords,
  excluded_keywords = excluded.excluded_keywords,
  quality_priority = excluded.quality_priority;

insert into public.automation_settings
  (id, start_date, start_time, business_days, weekly_connection_limit, enabled)
values
  ('78787878-7878-4787-8787-787878787878', current_date, '09:00', array['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 250, false)
on conflict (id) do update set
  start_date = excluded.start_date,
  start_time = excluded.start_time,
  business_days = excluded.business_days,
  weekly_connection_limit = excluded.weekly_connection_limit,
  enabled = excluded.enabled;

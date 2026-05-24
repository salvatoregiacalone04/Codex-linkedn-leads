alter table public.automation_settings
  add column if not exists linkedin_profile_name text,
  add column if not exists linkedin_connection_status text not null default 'disconnected'
    check (linkedin_connection_status in ('connected', 'disconnected')),
  add column if not exists linkedin_connected_at timestamptz;

update public.automation_settings
set linkedin_connection_status = 'disconnected'
where linkedin_connection_status is null;

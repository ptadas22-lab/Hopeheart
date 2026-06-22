-- Create safe_rule_consents table
create table if not exists public.safe_rule_consents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  accepted boolean not null default true,
  accepted_at timestamp with time zone not null default now(),
  consent_version text not null default 'v1',
  entry_method text not null check (entry_method in ('guest', 'google', 'email')),
  created_at timestamp with time zone not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.safe_rule_consents enable row level security;

-- Policy: Users can insert only their own consent
create policy "Users can insert their own consent" 
  on public.safe_rule_consents 
  for insert 
  with check (auth.uid() = user_id);

-- Policy: Users can view only their own consent
create policy "Users can view their own consent" 
  on public.safe_rule_consents 
  for select 
  using (auth.uid() = user_id);

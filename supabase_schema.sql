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

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  age_group text,
  language text,
  support_interest text,
  updated_at timestamp with time zone not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policy: Users can insert their own profile
create policy "Users can insert their own profile" 
  on public.profiles 
  for insert 
  with check (auth.uid() = id);

-- Policy: Users can update their own profile
create policy "Users can update their own profile" 
  on public.profiles 
  for update 
  using (auth.uid() = id);

-- Policy: Users can view their own profile
create policy "Users can view their own profile" 
  on public.profiles 
  for select 
  using (auth.uid() = id);

-- Create checkins table
create table if not exists public.checkins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  mood text not null,
  checkin_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique(user_id, checkin_date)
);

-- Enable Row Level Security (RLS)
alter table public.checkins enable row level security;

-- Policy: Users can insert their own checkins
create policy "Users can insert their own checkins" 
  on public.checkins 
  for insert 
  with check (auth.uid() = user_id);

-- Policy: Users can update their own checkins
create policy "Users can update their own checkins" 
  on public.checkins 
  for update 
  using (auth.uid() = user_id);

-- Policy: Users can view their own checkins
create policy "Users can view their own checkins" 
  on public.checkins 
  for select 
  using (auth.uid() = user_id);

-- Create support_requests table
create table if not exists public.support_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  issue_type text not null,
  message text not null,
  contact_email text,
  status text not null default 'new',
  created_at timestamp with time zone not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.support_requests enable row level security;

-- Policy: Anyone can insert support requests
create policy "Anyone can insert support requests" 
  on public.support_requests 
  for insert 
  with check (true);

-- Policy: Users can view their own support requests
create policy "Users can view their own support requests" 
  on public.support_requests 
  for select 
  using (auth.uid() = user_id);


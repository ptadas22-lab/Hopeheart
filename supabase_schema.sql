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

-- Create customer_support_requests table
create table if not exists public.customer_support_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  issue_type text not null,
  message text not null,
  contact_email text,
  status text not null default 'new',
  created_at timestamp with time zone not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.customer_support_requests enable row level security;

-- Policy: Anyone can insert support requests
create policy "Anyone can insert customer support requests" 
  on public.customer_support_requests 
  for insert 
  with check (true);

-- Policy: Users can view their own support requests
create policy "Users can view their own customer support requests" 
  on public.customer_support_requests 
  for select 
  using (auth.uid() = user_id);

-- Create community_listeners table
create table if not exists public.community_listeners (
  id uuid default gen_random_uuid() primary key,
  display_name text not null,
  role text not null,
  listening_style text,
  languages text,
  support_focus text,
  availability text not null default 'available',
  trust_score text,
  is_verified boolean not null default false,
  created_at timestamp with time zone not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.community_listeners enable row level security;

-- Policy: Anyone can view community listeners list
create policy "Allow public read of community listeners"
  on public.community_listeners
  for select
  using (true);

-- Create support_rooms table
create table if not exists public.support_rooms (
  id uuid default gen_random_uuid() primary key,
  room_name text not null,
  description text,
  support_focus text,
  room_type text,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.support_rooms enable row level security;

-- Policy: Anyone can view support rooms
create policy "Allow public read of support rooms"
  on public.support_rooms
  for select
  using (true);

-- Create community_support_requests table
create table if not exists public.community_support_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  listener_id uuid references public.community_listeners(id) on delete cascade not null,
  support_focus text not null,
  status text not null default 'requested',
  created_at timestamp with time zone not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.community_support_requests enable row level security;

-- Policy: Users can view their own community support requests
create policy "Users can view their own community support requests"
  on public.community_support_requests
  for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own community support requests
create policy "Users can insert their own community support requests"
  on public.community_support_requests
  for insert
  with check (auth.uid() = user_id);

-- Create room_memberships table
create table if not exists public.room_memberships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  room_id uuid references public.support_rooms(id) on delete cascade not null,
  created_at timestamp with time zone not null default now(),
  unique(user_id, room_id)
);

-- Enable Row Level Security (RLS)
alter table public.room_memberships enable row level security;

-- Policy: Users can view their own room memberships
create policy "Users can view their own room memberships"
  on public.room_memberships
  for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own room membership
create policy "Users can insert their own room membership"
  on public.room_memberships
  for insert
  with check (auth.uid() = user_id);

-- Create safety_concerns table
create table if not exists public.safety_concerns (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  concern_type text not null,
  message text not null,
  related_listener_id text,
  related_room_id text,
  created_at timestamp with time zone not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.safety_concerns enable row level security;

-- Policy: Anyone/guests can insert safety concerns
create policy "Anyone can insert safety concerns"
  on public.safety_concerns
  for insert
  with check (true);

-- Policy: Only the reporting user can view their own safety concern
create policy "Users can view their own safety concerns"
  on public.safety_concerns
  for select
  using (auth.uid() = user_id);

-- Seed community_listeners
insert into public.community_listeners (id, display_name, role, listening_style, languages, support_focus, availability, trust_score, is_verified) values
  ('d1a3b8ee-8b2b-4b2a-8cfa-555aa8823001', 'Priya', 'Peer Listener', 'Warm listener', 'English • Hindi • Kannada', 'I need someone to listen', 'available', '97%', true),
  ('d1a3b8ee-8b2b-4b2a-8cfa-555aa8823002', 'Aarav', 'Peer Listener', 'Gentle listener', 'English • Hindi', 'I need someone to listen', 'available', '96%', true),
  ('d1a3b8ee-8b2b-4b2a-8cfa-555aa8823003', 'Leo', 'Peer Listener', 'Gentle listener', 'English • Spanish', 'I feel anxious', 'available', '95%', false),
  ('d1a3b8ee-8b2b-4b2a-8cfa-555aa8823004', 'Maya', 'Peer Listener', 'Calm listener', 'English • Hindi • Kannada', 'I feel anxious', 'available', '98%', true),
  ('d1a3b8ee-8b2b-4b2a-8cfa-555aa8823005', 'Nisha', 'Peer Listener', 'Calm listener', 'English • Hindi', 'I feel hurt', 'soon', '99%', true),
  ('d1a3b8ee-8b2b-4b2a-8cfa-555aa8823006', 'Kabir', 'Peer Listener', 'Patient listener', 'English • Hindi • Urdu', 'I feel lonely', 'available', '97%', false)
on conflict (id) do nothing;

-- Seed support_rooms
insert into public.support_rooms (id, room_name, description, support_focus, room_type, is_active) values
  ('e2b4c9ff-9c3c-5c3a-9dfb-666bb9934001', 'Anxiety Support', 'For worry, panic, fear, and overthinking.', 'Anxiety', 'Peer support', true),
  ('e2b4c9ff-9c3c-5c3a-9dfb-666bb9934002', 'Emotional Recovery', 'For healing, life changes, grief, and recovering emotional strength.', 'Emotional Recovery', 'Peer support', true),
  ('e2b4c9ff-9c3c-5c3a-9dfb-666bb9934003', 'Loneliness Circle', 'For people who feel unseen, isolated, or emotionally distant.', 'Loneliness', 'Silent Companionship', true),
  ('e2b4c9ff-9c3c-5c3a-9dfb-666bb9934004', 'Living with Parkinson’s', 'For Parkinson''s emotional comfort and caregiver support.', 'Parkinson’s', 'Peer support', true),
  ('e2b4c9ff-9c3c-5c3a-9dfb-666bb9934005', 'Caregiver Corner', 'For family members and caregivers who feel emotionally tired.', 'Caregivers', 'Helper Haven', true),
  ('e2b4c9ff-9c3c-5c3a-9dfb-666bb9934006', 'Small Wins Only', 'Share one small step, one brave moment, or one hopeful thing from today.', 'Small Wins', 'Celebration', true)
on conflict (id) do nothing;



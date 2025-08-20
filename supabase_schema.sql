-- Buckets
insert into storage.buckets (id, name, public) values ('avatars','avatars', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('diary','diary', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('forum','forum', true) on conflict do nothing;

-- Tables
create table if not exists public.plant_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz default now()
);
create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  date timestamptz not null,
  note text,
  created_at timestamptz default now()
);
create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  note text,
  photo_url text,
  created_at timestamptz default now()
);
create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  nickname text,
  content text,
  image_url text,
  likes_count int default 0,
  hidden boolean default false,
  created_at timestamptz default now()
);
create table if not exists public.forum_likes (
  user_id uuid references auth.users(id) on delete cascade,
  post_id uuid references forum_posts(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);
create table if not exists public.forum_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references forum_posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  reason text,
  created_at timestamptz default now()
);
create table if not exists public.inbox_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  code text,
  level_awarded int,
  used boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table plant_states enable row level security;
create policy "own state" on plant_states for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table calendar_events enable row level security;
create policy "own events" on calendar_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table diary_entries enable row level security;
create policy "own diary" on diary_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table forum_posts enable row level security;
create policy "read visible" on forum_posts for select using (hidden = false);
create policy "write own posts" on forum_posts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table forum_likes enable row level security;
create policy "likes own" on forum_likes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table forum_reports enable row level security;
create policy "reports all read" on forum_reports for select using (true);
create policy "reports own write" on forum_reports for insert with check (true);

alter table inbox_codes enable row level security;
create policy "own inbox" on inbox_codes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

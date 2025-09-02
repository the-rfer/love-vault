-- Create moments table for tracking relationship events
create table if not exists public.moments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  moment_date date not null default current_date,
  media_urls text[], -- Array of media file URLs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.moments enable row level security;

-- Create policies for moments
create policy "moments_select_own"
  on public.moments for select
  using (auth.uid() = user_id);

create policy "moments_insert_own"
  on public.moments for insert
  with check (auth.uid() = user_id);

create policy "moments_update_own"
  on public.moments for update
  using (auth.uid() = user_id);

create policy "moments_delete_own"
  on public.moments for delete
  using (auth.uid() = user_id);

-- Create index for better query performance
create index if not exists moments_user_date_idx on public.moments(user_id, moment_date desc);
create index if not exists moments_created_at_idx on public.moments(created_at desc);

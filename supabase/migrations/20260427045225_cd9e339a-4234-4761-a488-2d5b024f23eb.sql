
-- PROFILES TABLE
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  headline text,
  bio text,
  avatar_url text,
  location text,
  resume_url text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  website_url text,
  accent_theme text default 'caution',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Users can delete own profile"
  on public.profiles for delete
  to authenticated
  using (auth.uid() = id);

-- PROJECTS TABLE
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  github_url text,
  live_url text,
  image_url text,
  tech_stack text[] default '{}',
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_user_id_idx on public.projects(user_id);

alter table public.projects enable row level security;

create policy "Projects are viewable by everyone"
  on public.projects for select
  using (true);

create policy "Users can insert own projects"
  on public.projects for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  to authenticated
  using (auth.uid() = user_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- STORAGE BUCKET for resumes
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true);

create policy "Resumes are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'resumes');

create policy "Users can upload own resume"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update own resume"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own resume"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

-- AVATARS bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

create policy "Avatars are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload own avatar"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update own avatar"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own avatar"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- PROJECT IMAGES bucket
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true);

create policy "Project images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "Users can upload own project images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update own project images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own project images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images' and (storage.foldername(name))[1] = auth.uid()::text);

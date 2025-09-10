-- Create categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.categories enable row level security;

-- RLS policies - categories are public for reading, admin-only for writing
create policy "categories_select_all"
  on public.categories for select
  to authenticated, anon
  using (true);

create policy "categories_insert_admin"
  on public.categories for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "categories_update_admin"
  on public.categories for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "categories_delete_admin"
  on public.categories for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Insert default categories
insert into public.categories (name, slug) values
  ('تصاميم وطنية', 'national-designs'),
  ('تصاميم قوة ورياضة', 'sports-fitness'),
  ('تصاميم أنمي', 'anime-designs'),
  ('تصاميم المناسبات', 'special-occasions'),
  ('تصاميم عصرية', 'modern-trendy')
on conflict (slug) do nothing;

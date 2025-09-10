-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  category text not null,
  image text,
  sizes text[] default '{}',
  colors text[] default '{}',
  print_types text[] default '{}',
  notes text,
  is_featured boolean default false,
  is_new boolean default false,
  is_best_seller boolean default false,
  is_on_sale boolean default false,
  sale_percentage integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.products enable row level security;

-- RLS policies - products are public for reading, admin-only for writing
create policy "products_select_all"
  on public.products for select
  to authenticated, anon
  using (true);

create policy "products_insert_admin"
  on public.products for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "products_update_admin"
  on public.products for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "products_delete_admin"
  on public.products for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

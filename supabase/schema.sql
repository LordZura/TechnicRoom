-- Enable extensions
create extension if not exists "pgcrypto";

-- Product core table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  model text not null,
  brand text not null,
  category text,
  price numeric(10,2),
  color text,
  has_fresh_air_intake boolean not null default false,
  recommended_area text,
  cooling_power text,
  heating_power text,
  cooling_consumption text,
  heating_consumption text,
  eer_cop text,
  freon_type_amount text,
  operating_temperature text,
  indoor_unit_size text,
  indoor_unit_weight text,
  outdoor_unit_size text,
  outdoor_unit_weight text,
  noise_level text,
  pipe_size text,
  custom_specs jsonb not null default '[]'::jsonb,
  likes_count integer not null default 0,
  view_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_translations (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  locale text not null check (locale in ('en', 'ka')),
  name text not null,
  description text,
  features text,
  unique (product_id, locale)
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.product_likes (
  product_id uuid not null references public.products(id) on delete cascade,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  primary key (product_id, visitor_id)
);

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id smallint primary key default 1,
  phone text,
  email text,
  address text,
  about_en text,
  about_ka text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- Search view to simplify fast query access
create or replace view public.products_search as
select
  p.*,
  max(case when pt.locale = 'en' then pt.name end) as name,
  max(case when pt.locale = 'en' then pt.name end) as name_en,
  max(case when pt.locale = 'ka' then pt.name end) as name_ka,
  max(case when pt.locale = 'en' then pt.features end) as features_en,
  max(case when pt.locale = 'ka' then pt.features end) as features_ka
from public.products p
left join public.product_translations pt on pt.product_id = p.id
group by p.id;

create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_model on public.products(model);
create index if not exists idx_products_brand on public.products(brand);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_color on public.products(color);
create index if not exists idx_products_fresh_air on public.products(has_fresh_air_intake);
create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_products_price on public.products(price);
create index if not exists idx_products_likes_count on public.products(likes_count);
create index if not exists idx_products_view_count on public.products(view_count);
create index if not exists idx_product_likes_visitor on public.product_likes(visitor_id);

create index if not exists idx_product_translations_name on public.product_translations using gin (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(features, '')));

create index if not exists idx_product_images_one_cover
  on public.product_images(product_id)
  where is_primary = true;
create index if not exists idx_product_images_product_sort on public.product_images(product_id, sort_order, created_at);

-- RLS
alter table public.products enable row level security;
alter table public.product_translations enable row level security;
alter table public.product_images enable row level security;
alter table public.product_likes enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

-- Public can read only active catalog data
create policy "Public read products" on public.products
for select using (is_active = true);

create policy "Public read product translations" on public.product_translations
for select using (
  exists (select 1 from public.products p where p.id = product_id and p.is_active = true)
);

create policy "Public read product images" on public.product_images
for select using (
  exists (select 1 from public.products p where p.id = product_id and p.is_active = true)
);

create policy "Public insert contact" on public.contact_messages
for insert with check (true);

create policy "Public read settings" on public.site_settings
for select using (true);

-- Admin full access by role claim
create policy "Admin full products" on public.products
for all using ((auth.jwt() ->> 'role') = 'admin') with check ((auth.jwt() ->> 'role') = 'admin');
create policy "Admin full translations" on public.product_translations
for all using ((auth.jwt() ->> 'role') = 'admin') with check ((auth.jwt() ->> 'role') = 'admin');
create policy "Admin full images" on public.product_images
for all using ((auth.jwt() ->> 'role') = 'admin') with check ((auth.jwt() ->> 'role') = 'admin');
create policy "Admin manage settings" on public.site_settings
for all using ((auth.jwt() ->> 'role') = 'admin') with check ((auth.jwt() ->> 'role') = 'admin');
create policy "Admin read contacts" on public.contact_messages
for select using ((auth.jwt() ->> 'role') = 'admin');

create or replace function public.toggle_product_like(
  p_product_id uuid,
  p_visitor_id text
)
returns table(liked boolean, like_count integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  next_liked boolean;
  next_count integer;
begin
  if p_visitor_id is null or length(trim(p_visitor_id)) < 8 then
    raise exception 'Invalid visitor id';
  end if;

  if not exists (
    select 1 from public.products
    where id = p_product_id and is_active = true
  ) then
    raise exception 'Product not found';
  end if;

  if exists (
    select 1 from public.product_likes
    where product_id = p_product_id and visitor_id = p_visitor_id
  ) then
    delete from public.product_likes
    where product_id = p_product_id and visitor_id = p_visitor_id;

    next_liked := false;
  else
    insert into public.product_likes (product_id, visitor_id)
    values (p_product_id, p_visitor_id)
    on conflict do nothing;

    next_liked := true;
  end if;

  update public.products
  set likes_count = (
    select count(*)::integer
    from public.product_likes
    where product_id = p_product_id
  )
  where id = p_product_id
  returning likes_count into next_count;

  return query select next_liked, coalesce(next_count, 0);
end;
$$;

create or replace function public.increment_product_view(p_product_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  next_count integer;
begin
  update public.products
  set view_count = coalesce(view_count, 0) + 1
  where id = p_product_id and is_active = true
  returning view_count into next_count;

  return coalesce(next_count, 0);
end;
$$;

-- storage bucket
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public view images" on storage.objects
for select using (bucket_id = 'product-images');

create policy "Admin upload images" on storage.objects
for insert with check (bucket_id = 'product-images' and (auth.jwt() ->> 'role') = 'admin');

create policy "Admin modify images" on storage.objects
for update using (bucket_id = 'product-images' and (auth.jwt() ->> 'role') = 'admin');

create policy "Admin delete images" on storage.objects
for delete using (bucket_id = 'product-images' and (auth.jwt() ->> 'role') = 'admin');

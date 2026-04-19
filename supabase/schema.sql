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

create unique index if not exists uniq_product_primary_image on public.product_images(product_id) where is_primary = true;
create index if not exists idx_product_images_product_sort on public.product_images(product_id, sort_order, created_at);

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

-- Search view includes cover image for catalog cards
create or replace view public.products_search as
select
  p.*,
  max(case when pt.locale = 'en' then pt.name end) as name,
  max(case when pt.locale = 'en' then pt.features end) as features_en,
  max(case when pt.locale = 'ka' then pt.features end) as features_ka,
  (
    select pi.storage_path
    from public.product_images pi
    where pi.product_id = p.id
    order by pi.is_primary desc, pi.sort_order asc, pi.created_at asc
    limit 1
  ) as cover_image
from public.products p
left join public.product_translations pt on pt.product_id = p.id
group by p.id;

create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_model on public.products(model);
create index if not exists idx_products_brand on public.products(brand);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_product_translations_name on public.product_translations using gin (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(features, '')));

-- RLS
alter table public.products enable row level security;
alter table public.product_translations enable row level security;
alter table public.product_images enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

-- Public can read only active catalog data
create policy "Public read products" on public.products
for select using (is_active = true);
create policy "Public read product translations" on public.product_translations
for select using (exists (select 1 from public.products p where p.id = product_id and p.is_active = true));
create policy "Public read product images" on public.product_images
for select using (exists (select 1 from public.products p where p.id = product_id and p.is_active = true));
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

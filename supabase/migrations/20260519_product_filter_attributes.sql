alter table public.products
  add column if not exists color text,
  add column if not exists has_fresh_air_intake boolean not null default false;

create index if not exists idx_products_color on public.products(color);
create index if not exists idx_products_fresh_air on public.products(has_fresh_air_intake);

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

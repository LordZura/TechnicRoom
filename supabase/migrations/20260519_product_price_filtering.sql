alter table public.products
  add column if not exists price numeric(10,2);

create or replace view public.products_search as
select
  p.*,
  max(case when pt.locale = 'en' then pt.name end) as name,
  max(case when pt.locale = 'en' then pt.features end) as features_en,
  max(case when pt.locale = 'ka' then pt.features end) as features_ka
from public.products p
left join public.product_translations pt on pt.product_id = p.id
group by p.id;

create index if not exists idx_products_price on public.products(price);

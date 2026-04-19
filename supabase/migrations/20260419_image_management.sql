-- Safe migration for existing installations
create unique index if not exists uniq_product_primary_image on public.product_images(product_id) where is_primary = true;
create index if not exists idx_product_images_product_sort on public.product_images(product_id, sort_order, created_at);

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

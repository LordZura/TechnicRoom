-- Ensure only one cover image can exist per product
create unique index if not exists idx_product_images_one_cover
  on public.product_images(product_id)
  where is_primary = true;

-- Ensure deterministic ordering for galleries
create index if not exists idx_product_images_product_sort
  on public.product_images(product_id, sort_order, created_at);

-- Backfill existing rows: if product has no cover, mark the first image as cover
with ranked as (
  select
    id,
    product_id,
    row_number() over (
      partition by product_id
      order by is_primary desc, sort_order asc, created_at asc
    ) as rn,
    bool_or(is_primary) over (partition by product_id) as has_cover
  from public.product_images
)
update public.product_images pi
set is_primary = true
from ranked r
where pi.id = r.id
  and r.rn = 1
  and r.has_cover = false;

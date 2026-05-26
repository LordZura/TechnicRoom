alter table public.products
  add column if not exists likes_count integer not null default 0,
  add column if not exists view_count integer not null default 0;

create table if not exists public.product_likes (
  product_id uuid not null references public.products(id) on delete cascade,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  primary key (product_id, visitor_id)
);

alter table public.product_likes enable row level security;

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

create index if not exists idx_products_likes_count on public.products(likes_count);
create index if not exists idx_products_view_count on public.products(view_count);
create index if not exists idx_product_likes_visitor on public.product_likes(visitor_id);

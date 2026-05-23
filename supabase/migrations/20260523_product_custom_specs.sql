alter table public.products
  add column if not exists custom_specs jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_custom_specs_is_array'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_custom_specs_is_array
      check (jsonb_typeof(custom_specs) = 'array')
      not valid;
  end if;
end $$;

alter table public.products
  validate constraint products_custom_specs_is_array;

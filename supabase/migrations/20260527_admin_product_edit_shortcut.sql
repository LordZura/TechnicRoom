alter table public.site_settings
add column if not exists admin_product_edit_shortcut_enabled boolean not null default false;

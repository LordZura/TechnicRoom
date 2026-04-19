# Technic Room

Production-ready Next.js + Supabase catalog and admin platform for air conditioners.

## What was broken and what was fixed

### 1) Admin delete was failing
**Root cause:** the admin dashboard used an HTML `<form method="post">` with `_method=DELETE`, but the API route only handled real HTTP `DELETE`, so deletion never reached the `DELETE` handler.

**Fix:** replaced dashboard deletion with `fetch(..., { method: 'DELETE' })`, added robust delete API logic to remove storage files + `product_images` + `product_translations` + `products`, and return clear errors/success JSON.

### 2) Image upload flow was unreliable
**Root causes:**
- there was no practical admin UI wired to upload images;
- upload route only handled one file and lacked validation;
- there was no cover-image management.

**Fix:** implemented multi-file upload API + admin UX for image upload, preview, cover selection, and removal. Added file type/size validation and clear error messages.

### 3) Public catalog cards looked text-only
**Fix:** product cards now render cover images from `products_search.cover_image` (with placeholders when missing), producing ecommerce-style cards.

### 4) Product detail gallery needed ecommerce behavior
**Fix:** gallery now supports primary image + thumbnails + click-to-switch + mobile-friendly layout.

## Project structure

```txt
src/
  app/
    page.tsx
    products/page.tsx
    products/[slug]/page.tsx
    about/page.tsx
    contact/page.tsx
    admin/login/page.tsx
    admin/dashboard/page.tsx
    api/
      admin/products/route.ts
      admin/upload/route.ts
      contact/route.ts
      share/route.ts
  components/
    admin/
      admin-products-manager.tsx
      product-form.tsx
    products/
      product-card.tsx
      product-gallery.tsx
  lib/
    i18n/
    supabase/
    validation/
  types/
supabase/
  schema.sql
  seed.sql
  migrations/20260419_image_management.sql
```

## Manual setup steps (required)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Create Supabase project and fill `.env.local` values.
4. Run schema in Supabase SQL editor: `supabase/schema.sql`.
5. Run seed data (optional): `supabase/seed.sql`.
6. If this project already existed before these fixes, run migration:
   - `supabase/migrations/20260419_image_management.sql`
7. Create admin users in Supabase Auth manually.
8. Configure admin role claims if you use RLS role policies (`role=admin`).
9. Verify Storage bucket exists:
   - bucket: `product-images`
   - public read + admin write/delete policies from `schema.sql`.
10. Run development server:
   ```bash
   npm run dev
   ```

## Deploy to Vercel

1. Push to GitHub.
2. Import project in Vercel.
3. Add environment variables from `.env.example`.
4. Deploy.
5. Connect custom domain later in Vercel domain settings.

## Security notes

- `SUPABASE_SERVICE_ROLE_KEY` is only used in server routes/components.
- Admin operations are protected by session checks and middleware.
- Public browsing uses anon key and RLS-safe read paths.


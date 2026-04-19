# Technic Room

Production-ready Next.js + Supabase catalog and admin platform for air conditioners.

## 1) Project structure

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
    layout/
    products/
    admin/
  lib/
    i18n/
    supabase/
    validation/
  types/
supabase/
  schema.sql
  seed.sql
.env.example
```

## 2) Features included

- Ecommerce-style responsive catalog and product detail pages
- Graceful handling of missing specs (hidden empty rows)
- Georgian/English UI switching (cookie-based)
- Share/copy link on product detail page
- Search by slug, model, brand, category, feature text
- Supabase Auth login for admin area
- Admin CRUD (create/upsert + delete) + multilingual translation management
- Supabase Storage image upload API
- Contact page with direct business contact links (email + phone)
- SEO metadata for product pages
- 404 page and loading/empty-safe UI blocks

## 3) Manual setup steps (required)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```
   Fill all variables.

3. **Create Supabase project**
   - Create a new Supabase project
   - Copy URL + anon key + service role key

4. **Apply schema**
   - Open Supabase SQL editor
   - Run `supabase/schema.sql`

5. **Seed demo products**
   - Run `supabase/seed.sql` in SQL editor

6. **Create admin users manually**
   - Supabase Dashboard → Authentication → Users → Add user
   - Use email/password for admin login
   - Add custom JWT claim `role=admin` through your auth hook/process (or manage admin-only operations via server-role key endpoints as in this repo)

7. **Create storage bucket manually**
   - Bucket name: `product-images`
   - Public bucket enabled
   - (If not already created by SQL) run storage policy SQL from `schema.sql`

8. **Run development server**
   ```bash
   npm run dev
   ```

## 4) Deploy to Vercel

1. Push repository to GitHub.
2. In Vercel, import the repository.
3. Set environment variables from `.env.example` in Vercel Project Settings.
4. Deploy.
5. Add custom domain later in Vercel Domains settings.

## 5) Security notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code.
- Keep admin operations server-side only.
- RLS is enabled for all core tables; policies in `schema.sql` separate public read access from admin management.
- Admin routes are guarded both by middleware and server session checks.

## 6) Future improvements

- Add pagination and advanced filters
- Add edit UI for existing products and drag/drop image sorting
- Add ISR caching and Supabase Edge Functions for webhook-triggered revalidation
- Add unit/integration tests and CI pipeline

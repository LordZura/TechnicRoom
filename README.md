# Technic Room

Technic Room is a production-ready air conditioner catalog and management website built for real deployment.

## Goal

The website must allow visitors to browse, search, and view detailed information about air conditioners, while allowing an admin to securely manage products, images, and multilingual content through an admin panel.

---

## Core Features

### Public website
- Home page
- Products catalog page
- Product details page
- About page
- Contact page
- 404 page

### Product catalog
Each product must support:
- Unique ID
- Slug / shareable URL
- Model
- Brand
- Type
- Price (optional)
- Recommended installation area
- Cooling power
- Heating power
- Cooling power consumption
- Heating power consumption
- EER/COP
- Freon type / quantity
- Features / functions
- Operating temperature
- Indoor unit size
- Indoor unit weight
- Outdoor unit size
- Outdoor unit weight
- Noise level
- Pipe size
- Description (optional)
- Multiple images

### Product display
- Modern ecommerce-style layout
- Multiple product images/gallery
- Clear model and title display
- Easy-to-read specifications section
- Shareable product page URL
- Copy-link/share button
- Responsive design for desktop and mobile

### Search and discoverability
Users must be able to search products by:
- Model
- Brand
- Type
- Features
- ID
- Slug

The search experience must be fast and user-friendly.

### Language support
- Georgian and English must be supported
- Language switcher must be available in the UI
- Site structure must be ready for adding more languages later
- Product content should support multilingual data where needed

---

## Admin Panel Requirements

### Authentication
- Admin page must be protected
- Login can be password-based, but must be implemented securely using Supabase
- Unauthenticated users must not access admin functionality

### Admin capabilities
Admin must be able to:
- Add products
- Edit products
- Delete products
- Upload multiple product images
- Reorder or manage images if possible
- Leave optional fields empty
- Manage multilingual product content

### Data handling
All product and admin operations must be connected to Supabase.
No fake data-only admin implementation is allowed for the final version.

---

## Technical Stack

- **Frontend:** Next.js + TypeScript
- **Styling:** Tailwind CSS
- **Backend/Data/Auth/Storage:** Supabase
- **Deployment:** Vercel
- **Version control:** GitHub

---

## Database Requirements

The Supabase database should include a clean schema for the following:

### Required tables
- `products`
- `product_images`
- `product_translations` or equivalent multilingual structure
- admin/auth integration using Supabase Auth

### Optional tables
- `site_settings`
- `contact_info`
- `brands`
- `categories`

### Database expectations
- Proper relationships
- Good naming conventions
- Nullable optional fields where appropriate
- Indexes for search-critical fields
- Row Level Security policies
- Safe access rules for public vs admin usage

---

## Image Handling

- Product images must be stored in Supabase Storage
- Multiple images per product must be supported
- Product pages must show an image gallery
- Missing images must not break the layout
- Images should be optimized and displayed cleanly

---

## UI / UX Requirements

The final website must be:
- Clean
- Modern
- Responsive
- Mobile-first
- Easy to navigate
- Trustworthy and professional
- Similar in quality to polished online shopping websites

### UX expectations
- Good spacing and typography
- Clear visual hierarchy
- Fast loading feel
- Loading states
- Empty states
- Error states
- Good forms and validation
- Accessible markup
- SEO-friendly page structure

---

## Product Data Format

Products should be able to display specifications in formats similar to:

- მოდელი: ASW-H09A4/FAR3DI
- ტიპი: ინვერტერი კედლის სპლიტ სისტემა
- რეკომენდებული ფართობი მონტაჟისთვის: 20-35 მ²
- გაგრილების სიმძლავრე: 10571 BTU
- გათბობის სიმძლავრე: 11594 BTU
- ხარჯი გაგრილებისას: 850(100-1600) ვატი
- ხარჯი გათბობისას: 630(300-1600) ვატი
- EER/COP: 3.25 / 3.61 W/W
- ფრეონის ტიპი/მოცულობა: R32/460
- ფუნქციები: გათბობა, გაგრილება, ტენის ამოშრობა, გარე ბლოკის დაცვა, თვითდიაგნოსტიკა
- სამუშაო ტემპერატურა: -10~+43 C°
- შიდა ბლოკის ზომა: 649×450×232 მმ
- შიდა ბლოკის წონა: 7 კგ
- გარე ბლოკის ზომა: 760×510×315 მმ
- გარე ბლოკის წონა: 18.5 კგ
- ხმაურის დონე: 52-59 დბ
- მილების ზომა: 6 / 9 მმ

The schema and UI must support partially filled products, because not every product will have every specification.

---

## Security Requirements

- Admin routes must be protected
- Secrets must stay in environment variables
- Public and admin access must be separated properly
- Supabase RLS must be configured correctly
- Storage access rules must be defined safely
- No sensitive keys must be exposed to the client

---

## SEO Requirements

- Product pages must have dynamic metadata
- Good page titles and descriptions
- Shareable URLs
- Clean route structure
- Open Graph support if possible

---

## Deployment Requirements

The project must be deployable through:
- GitHub
- Vercel
- Custom domain

The final codebase must include:
- setup instructions
- `.env.example`
- Supabase SQL/schema instructions
- deployment guidance
- seed/demo data if needed

---

## Final Acceptance Criteria

The final product is acceptable only if:

1. Visitors can browse products easily
2. Visitors can search for products
3. Every product has a clean shareable detail page
4. Language switching works
5. Admin login works securely
6. Admin can create, edit, and delete products
7. Admin can upload and manage multiple images
8. All data is stored in Supabase
9. The website is responsive and polished
10. The project is ready for GitHub + Vercel deployment

---

## Nice-to-have Features

These are optional but recommended:
- Related products
- Product filtering
- Featured products on homepage
- WhatsApp/contact quick action
- Image zoom
- Admin dashboard summary
- Site settings panel
- Contact form storage
- Product status toggle (active/inactive)
- Draft products
- Brand/category management

---

## Development Standard

The code should be:
- Clean
- Reusable
- Typed properly
- Easy to maintain
- Structured for future growth
- Ready for real use, not just demo use
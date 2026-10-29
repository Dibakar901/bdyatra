# BDYatra — Bangladesh Travel Discovery & Directory

BDYatra is an English-first travel discovery and hospitality directory platform for Bangladesh. It connects domestic travelers, international tourists, eco-explorers, and cultural enthusiasts with curated destinations, authentic eco-resorts, heritage homestays, local culinary gems, and trusted tour operators across all 8 administrative divisions of Bangladesh.

---

## 🌟 Key Features

1. **8 Administrative Divisions Discovery**
   - Curated regional filtering and exploration across all 8 administrative divisions: Dhaka, Chattogram, Sylhet, Khulna, Barishal, Rajshahi, Rangpur, and Mymensingh.
   - Comprehensive district-level tagging, climate overviews, and seasonal travel windows.

2. **Curated Destination Directory & Detail Views**
   - Rich destination cards with divisional badges, cost indicators, ratings, and best travel seasons.
   - Immersive destination reader with high-resolution photo galleries, key highlights, packing/how-to-reach guides, and related local accommodations.

3. **Hospitality & Stays Directory**
   - Vetted listings across 6 categories: Hotels, Eco-Resorts, Local Restaurants, River Houseboats, Certified Tour Guides, and Transport Providers.
   - Real-time search, division filter, verified provider badges, and direct host contact info.

4. **Editorial Travel Guides & Blog Reader**
   - Long-form travel stories, seasonal itineraries, cultural etiquettes, and photography guides.
   - Rich blog reader view with reading duration estimates, author profiles, and related destination deep links.

5. **Curated Experiences & Seasonal Highlights**
   - Signature travel adventures including haor houseboat living, 4x4 mountain safaris, and tea estate heritage stays.
   - Four seasonal travel windows with optimal months and climate advice.

6. **Full-Featured Admin CMS Portal (`#admin`)**
   - Protected dashboard with Supabase Authentication.
   - Complete CRUD interfaces for Destinations, Directory Listings, and Blog Posts.
   - Supabase Storage image uploader with automatic fallback handling.
   - Built-in SQL schema & RLS policy manager for database administration.

7. **Production SEO & OpenGraph Intelligence**
   - Dynamic page metadata, OpenGraph tags, Twitter Card headers, and Schema.org JSON-LD structured data for Google Search rich snippets.
   - Built-in live SEO Inspector modal.

---

## 🏗️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion
- **Icons**: Lucide React
- **Build System**: Vite 6.x
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Supabase Storage
- **Architecture**: Graceful hybrid model — executes queries against live Supabase PostgreSQL when available, with automatic high-fidelity fallback to local typed data when offline or unconfigured.

---

## 🔒 Security & Row Level Security (RLS) Audit

- **Zero Secret Exposure**: Only the public publishable anon key (`VITE_SUPABASE_ANON_KEY`) is bundled into the client build. No service role or database superuser keys exist in frontend code.
- **Strict Row Level Security**:
  - **Public Read-Only Access**: Unauthenticated visitors can only `SELECT` published records (`is_published = true`).
  - **Public Insert-Only Access**: Visitors can submit pending directory listings (`listing_submissions`) and trip inquiries (`trip_inquiries`).
  - **Admin-Only Write Access**: Authenticated administrators have full `INSERT`, `UPDATE`, and `DELETE` access to destinations, directory listings, and blogs.
  - **Storage Bucket Policies**: Buckets (`destination-images`, `blog-covers`, `place-photos`) enforce public `SELECT` and authenticated `INSERT`.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### 2. Environment Variables Configuration
Copy `.env.example` to `.env` or set the variables in your hosting provider:

```bash
# Supabase Configuration
VITE_SUPABASE_URL="https://kdrifllxmjwsxonmttyr.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

---

## 🗄️ Database Setup (Supabase)

To provision or sync your remote Supabase PostgreSQL database:

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to your project (`kdrifllxmjwsxonmttyr` or your custom project).
3. Open **SQL Editor** in the left sidebar.
4. Run the SQL scripts in the following order:
   - **Step 1: Schema & Tables**: Copy and run `supabase/schema.sql` to create enum types, tables (`divisions`, `districts`, `destinations`, `directory_places`, `blogs`, `listing_submissions`, `trip_inquiries`), and indexes.
   - **Step 2: Security & RLS**: Run `supabase/rls_policies.sql` to enable Row Level Security and apply access policies.
   - **Step 3: Seed Initial Data**: Run `supabase/seed.sql` to seed Bangladesh divisions, districts, destinations, directory listings, and editorial blogs.

---

## 📦 Production Build & Deployment

### Build Command
```bash
npm run build
```
This runs TypeScript checking (`tsc --noEmit`) and Vite bundling to produce optimized static assets in `/dist`.

### Deployment Providers

#### Vercel
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

#### Netlify
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Redirects**: Add `/* /index.html 200` to a `_redirects` file for client-side routing.

#### Cloud Run / Container
Use a lightweight Node or NGINX container serving the `/dist` directory.

---

## 📱 Responsive & English-First Guidelines

- **Strict English UI**: All buttons, badges, descriptions, headers, alerts, and navigation menus are strictly written in professional English.
- **Mobile First**: Built with responsive Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`), flexible flex/grid layouts, touch-friendly padding, and accessible modals.

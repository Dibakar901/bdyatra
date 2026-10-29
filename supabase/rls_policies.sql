-- =========================================================
-- BDYatra Supabase Row Level Security (RLS) Policy Setup
-- Project: https://kdrifllxmjwsxonmttyr.supabase.co
-- =========================================================

-- 1. Enable RLS on core tables
ALTER TABLE IF EXISTS public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.directory_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.directory_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.listing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trip_inquiries ENABLE ROW LEVEL SECURITY;

-- 2. Destinations Policies
DROP POLICY IF EXISTS "Public can view published destinations" ON public.destinations;
CREATE POLICY "Public can view published destinations"
  ON public.destinations FOR SELECT
  USING (is_published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins have full access to destinations" ON public.destinations;
CREATE POLICY "Admins have full access to destinations"
  ON public.destinations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Travel Blogs Policies
DROP POLICY IF EXISTS "Public can read published blogs" ON public.blogs;
CREATE POLICY "Public can read published blogs"
  ON public.blogs FOR SELECT
  USING (is_published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins have full access to blogs" ON public.blogs;
CREATE POLICY "Admins have full access to blogs"
  ON public.blogs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Directory Places & Listings Policies
DROP POLICY IF EXISTS "Public can read published listings" ON public.directory_listings;
CREATE POLICY "Public can read published listings"
  ON public.directory_listings FOR SELECT
  USING (published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins have full access to directory" ON public.directory_listings;
CREATE POLICY "Admins have full access to directory"
  ON public.directory_listings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. User Listing Submissions
DROP POLICY IF EXISTS "Anyone can submit a listing" ON public.listing_submissions;
CREATE POLICY "Anyone can submit a listing"
  ON public.listing_submissions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to submissions" ON public.listing_submissions;
CREATE POLICY "Admins have full access to submissions"
  ON public.listing_submissions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Storage Bucket Configuration
-- Buckets: destination-images, blog-covers, place-photos
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('destination-images', 'destination-images', true),
  ('blog-covers', 'blog-covers', true),
  ('place-photos', 'place-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public Read, Authenticated Write
DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('destination-images', 'blog-covers', 'place-photos'));

DROP POLICY IF EXISTS "Admin Storage Upload" ON storage.objects;
CREATE POLICY "Admin Storage Upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('destination-images', 'blog-covers', 'place-photos'));

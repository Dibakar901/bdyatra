-- ==============================================================================
-- BDYatra: Bangladesh Travel Discovery & Directory Database Schema
-- Supabase PostgreSQL Migration
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'traveler');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE place_category AS ENUM (
        'hotel',
        'resort',
        'restaurant',
        'houseboat',
        'guide',
        'transport'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. GEOGRAPHIC HIERARCHY TABLES: DIVISIONS & DISTRICTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS divisions (
    id TEXT PRIMARY KEY, -- e.g. 'chittagong', 'sylhet', 'khulna', 'barishal', 'dhaka', 'rajshahi', 'rangpur', 'mymensingh'
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    cover_image TEXT,
    coordinates JSONB DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS districts (
    id TEXT PRIMARY KEY, -- e.g. 'coxs-bazar', 'moulvibazar', 'rangamati', 'sunamganj', 'bagerhat'
    division_id TEXT NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    popular_for TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_districts_division ON districts(division_id);

-- ==============================================================================
-- 5. USER PROFILES & ADMIN ROLES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'traveler' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check if the current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 6. CORE TRAVEL ENTITIES: DESTINATIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS destinations (
    id TEXT PRIMARY KEY, -- slug-based identifier or uuid
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    division_id TEXT NOT NULL REFERENCES divisions(id) ON DELETE RESTRICT,
    district_id TEXT REFERENCES districts(id) ON DELETE SET NULL,
    category TEXT NOT NULL, -- Nature & Wildlife, Beaches & Islands, Hill Tracts, etc.
    cover_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}'::text[],
    highlights TEXT[] DEFAULT '{}'::text[],
    best_season TEXT NOT NULL,
    estimated_budget TEXT NOT NULL,
    recommended_days INTEGER DEFAULT 2 NOT NULL,
    rating NUMERIC(3,2) DEFAULT 4.8 NOT NULL,
    review_count INTEGER DEFAULT 0 NOT NULL,
    how_to_reach TEXT NOT NULL,
    coordinates JSONB DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_destinations_updated_at
BEFORE UPDATE ON destinations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_destinations_division ON destinations(division_id);
CREATE INDEX IF NOT EXISTS idx_destinations_district ON destinations(district_id);
CREATE INDEX IF NOT EXISTS idx_destinations_published ON destinations(is_published);
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations(is_featured);

-- ==============================================================================
-- 7. DIRECTORY: HOTELS, RESORTS, RESTAURANTS & TOURS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS directory_places (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    place_type place_category NOT NULL,
    division_id TEXT NOT NULL REFERENCES divisions(id) ON DELETE RESTRICT,
    district_id TEXT REFERENCES districts(id) ON DELETE SET NULL,
    destination_id TEXT REFERENCES destinations(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    price_range TEXT NOT NULL CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
    price_rate TEXT NOT NULL,
    rating NUMERIC(3,2) DEFAULT 4.8 NOT NULL,
    review_count INTEGER DEFAULT 0 NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    website TEXT,
    address TEXT NOT NULL,
    amenities TEXT[] DEFAULT '{}'::text[],
    cover_image TEXT,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_directory_places_updated_at
BEFORE UPDATE ON directory_places
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_directory_type ON directory_places(place_type);
CREATE INDEX IF NOT EXISTS idx_directory_division ON directory_places(division_id);
CREATE INDEX IF NOT EXISTS idx_directory_verified ON directory_places(is_verified);

-- ==============================================================================
-- 8. TRAVEL BLOGS & EDITORIAL GUIDES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS blogs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT DEFAULT 'BDYatra Editorial Team' NOT NULL,
    author_avatar TEXT,
    cover_image TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}'::text[],
    reading_time TEXT DEFAULT '5 min read' NOT NULL,
    destination_id TEXT REFERENCES destinations(id) ON DELETE SET NULL,
    division_id TEXT REFERENCES divisions(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_blogs_updated_at
BEFORE UPDATE ON blogs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published);

-- ==============================================================================
-- 9. USER SUBMISSIONS & TRIP INQUIRIES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS listing_submissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    division_id TEXT REFERENCES divisions(id) ON DELETE SET NULL,
    district TEXT NOT NULL,
    description TEXT NOT NULL,
    price_range TEXT DEFAULT '$$' NOT NULL,
    price_rate TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    website TEXT,
    address TEXT,
    services_text TEXT,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS trip_inquiries (
    id TEXT PRIMARY KEY,
    traveler_name TEXT,
    email TEXT NOT NULL,
    duration_days INTEGER DEFAULT 3 NOT NULL,
    division_focus TEXT NOT NULL,
    pace TEXT NOT NULL,
    preferred_category TEXT DEFAULT 'All Categories' NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'contacted', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_inquiries ENABLE ROW LEVEL SECURITY;

-- Divisions & Districts: Public Read, Admin Write
CREATE POLICY "Public read divisions" ON divisions FOR SELECT USING (true);
CREATE POLICY "Admin insert divisions" ON divisions FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update divisions" ON divisions FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete divisions" ON divisions FOR DELETE USING (is_admin());

CREATE POLICY "Public read districts" ON districts FOR SELECT USING (true);
CREATE POLICY "Admin insert districts" ON districts FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update districts" ON districts FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete districts" ON districts FOR DELETE USING (is_admin());

-- User Profiles: Users can view & edit their own profile; Admins have full access
CREATE POLICY "Users read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins read all profiles" ON user_profiles FOR SELECT USING (is_admin());
CREATE POLICY "Users update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins manage all profiles" ON user_profiles FOR ALL USING (is_admin());

-- Destinations: Public read published destinations; Admins manage all
CREATE POLICY "Public read published destinations" ON destinations FOR SELECT USING (is_published = true);
CREATE POLICY "Admin view all destinations" ON destinations FOR SELECT USING (is_admin());
CREATE POLICY "Admin insert destinations" ON destinations FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update destinations" ON destinations FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete destinations" ON destinations FOR DELETE USING (is_admin());

-- Directory Places: Public read published places; Admins manage all
CREATE POLICY "Public read published directory places" ON directory_places FOR SELECT USING (is_published = true);
CREATE POLICY "Admin view all directory places" ON directory_places FOR SELECT USING (is_admin());
CREATE POLICY "Admin insert directory places" ON directory_places FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update directory places" ON directory_places FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete directory places" ON directory_places FOR DELETE USING (is_admin());

-- Blogs: Public read published blogs; Admins manage all
CREATE POLICY "Public read published blogs" ON blogs FOR SELECT USING (is_published = true);
CREATE POLICY "Admin view all blogs" ON blogs FOR SELECT USING (is_admin());
CREATE POLICY "Admin insert blogs" ON blogs FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update blogs" ON blogs FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete blogs" ON blogs FOR DELETE USING (is_admin());

-- Listing Submissions: Public can submit; only Admins can view/update
CREATE POLICY "Public can submit listings" ON listing_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view submissions" ON listing_submissions FOR SELECT USING (is_admin());
CREATE POLICY "Admins update submissions" ON listing_submissions FOR UPDATE USING (is_admin());
CREATE POLICY "Admins delete submissions" ON listing_submissions FOR DELETE USING (is_admin());

-- Trip Inquiries: Public can submit; only Admins can view/update
CREATE POLICY "Public can submit trip inquiries" ON trip_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view trip inquiries" ON trip_inquiries FOR SELECT USING (is_admin());
CREATE POLICY "Admins update trip inquiries" ON trip_inquiries FOR UPDATE USING (is_admin());
CREATE POLICY "Admins delete trip inquiries" ON trip_inquiries FOR DELETE USING (is_admin());

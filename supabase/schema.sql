-- ==============================================================================
-- BDYatra: Complete Supabase PostgreSQL Schema & Seed Script
-- Ready to run in the Supabase Dashboard -> SQL Editor
-- Target: https://kdrifllxmjwsxonmttyr.supabase.co
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
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

-- 3. TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. GEOGRAPHIC HIERARCHY
CREATE TABLE IF NOT EXISTS divisions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    cover_image TEXT,
    coordinates JSONB DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS districts (
    id TEXT PRIMARY KEY,
    division_id TEXT NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    popular_for TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_districts_division ON districts(division_id);

-- 5. USER PROFILES & ADMIN ROLES
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'traveler' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. DESTINATIONS
CREATE TABLE IF NOT EXISTS destinations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    division_id TEXT NOT NULL REFERENCES divisions(id) ON DELETE RESTRICT,
    district_id TEXT REFERENCES districts(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}'::text[],
    best_season TEXT,
    estimated_budget TEXT,
    google_map_url TEXT,
    phone TEXT,
    website TEXT,
    rating NUMERIC(3,2) DEFAULT 4.8 NOT NULL,
    review_count INTEGER DEFAULT 0 NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_destinations_division ON destinations(division_id);
CREATE INDEX IF NOT EXISTS idx_destinations_published ON destinations(is_published);

-- 7. DIRECTORY LISTINGS & PLACES
CREATE TABLE IF NOT EXISTS directory_listings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    division TEXT NOT NULL,
    district TEXT NOT NULL,
    destination_id TEXT REFERENCES destinations(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    price_range TEXT,
    price_rate TEXT,
    rating NUMERIC(3,2) DEFAULT 4.8 NOT NULL,
    review_count INTEGER DEFAULT 0 NOT NULL,
    verified BOOLEAN DEFAULT TRUE NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    website TEXT,
    address TEXT NOT NULL,
    services TEXT[] DEFAULT '{}'::text[],
    cover_image TEXT,
    featured BOOLEAN DEFAULT FALSE NOT NULL,
    published BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_directory_category ON directory_listings(category);
CREATE INDEX IF NOT EXISTS idx_directory_division ON directory_listings(division);

-- 8. TRAVEL BLOGS & EDITORIAL ARTICLES
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

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published);

-- 9. USER SUBMISSIONS & INQUIRIES
CREATE TABLE IF NOT EXISTS listing_submissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    division_id TEXT REFERENCES divisions(id) ON DELETE SET NULL,
    district TEXT NOT NULL,
    description TEXT NOT NULL,
    price_range TEXT,
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

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_inquiries ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read divisions" ON divisions FOR SELECT USING (true);
CREATE POLICY "Public read districts" ON districts FOR SELECT USING (true);
CREATE POLICY "Public read published destinations" ON destinations FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published directory places" ON directory_places FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published blogs" ON blogs FOR SELECT USING (is_published = true);

-- User submissions
CREATE POLICY "Public can submit listings" ON listing_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit trip inquiries" ON trip_inquiries FOR INSERT WITH CHECK (true);

-- Admin manage policies
CREATE POLICY "Admin manage divisions" ON divisions FOR ALL USING (is_admin());
CREATE POLICY "Admin manage districts" ON districts FOR ALL USING (is_admin());
CREATE POLICY "Admin manage destinations" ON destinations FOR ALL USING (is_admin());
CREATE POLICY "Admin manage directory places" ON directory_places FOR ALL USING (is_admin());
CREATE POLICY "Admin manage blogs" ON blogs FOR ALL USING (is_admin());
CREATE POLICY "Admins manage submissions" ON listing_submissions FOR ALL USING (is_admin());
CREATE POLICY "Admins manage trip inquiries" ON trip_inquiries FOR ALL USING (is_admin());

-- Profile security
CREATE POLICY "Users read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins manage all profiles" ON user_profiles FOR ALL USING (is_admin());

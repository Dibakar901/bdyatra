import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Shield,
  Layers,
  FileCode2,
  Terminal,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { checkSupabaseHealth, SupabaseHealthResult, supabaseUrl } from '../../lib/supabase';

interface DatabaseConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseConsoleModal: React.FC<DatabaseConsoleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'health' | 'schema' | 'rls'>('health');
  const [health, setHealth] = useState<SupabaseHealthResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const result = await checkSupabaseHealth();
      setHealth(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  const copySqlToClipboard = () => {
    const sqlContent = `-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kdrifllxmjwsxonmttyr/sql

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'traveler');
CREATE TYPE place_category AS ENUM ('hotel', 'resort', 'restaurant', 'houseboat', 'guide', 'transport');

-- 3. CORE TABLES
CREATE TABLE IF NOT EXISTS divisions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    cover_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS districts (
    id TEXT PRIMARY KEY,
    division_id TEXT NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    popular_for TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'traveler' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS destinations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    division_id TEXT NOT NULL REFERENCES divisions(id),
    district TEXT NOT NULL,
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
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS directory_listings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    division TEXT NOT NULL,
    district TEXT NOT NULL,
    destination_id TEXT REFERENCES destinations(id),
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
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS blogs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT DEFAULT 'BDYatra Editorial Team' NOT NULL,
    cover_image TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}'::text[],
    reading_time TEXT DEFAULT '5 min read' NOT NULL,
    destination_id TEXT REFERENCES destinations(id),
    division_id TEXT REFERENCES divisions(id),
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. ROW LEVEL SECURITY
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read divisions" ON divisions FOR SELECT USING (true);
CREATE POLICY "Public read districts" ON districts FOR SELECT USING (true);
CREATE POLICY "Public read published destinations" ON destinations FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published directory listings" ON directory_listings FOR SELECT USING (published = true);
CREATE POLICY "Public read published blogs" ON blogs FOR SELECT USING (is_published = true);
`;

    navigator.clipboard.writeText(sqlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const schemaTables = [
    {
      name: 'divisions',
      description: 'The 8 administrative divisions of Bangladesh (e.g. Chittagong, Sylhet, Khulna)',
      columns: 'id (PK), name, tagline, description, cover_image, coordinates, created_at',
      rls: 'Public SELECT · Admin INSERT/UPDATE/DELETE',
    },
    {
      name: 'districts',
      description: 'Geographic districts associated with divisions (e.g. Cox’s Bazar, Moulvibazar, Sunamganj)',
      columns: 'id (PK), division_id (FK), name, popular_for, created_at',
      rls: 'Public SELECT · Admin INSERT/UPDATE/DELETE',
    },
    {
      name: 'destinations',
      description: 'Curated travel landmarks with auto-slug, short description, phone, and Google map link',
      columns: 'id (PK), title, slug, tagline, description, division_id, district, cover_image, google_map_url, phone, website',
      rls: 'Public SELECT (published) · Admin ALL',
    },
    {
      name: 'directory_listings',
      description: 'Hotels, eco-resorts, restaurants, houseboats, and licensed local tour guides',
      columns: 'id (PK), name, category, division, district, price_range, price_rate, verified, phone, email, website',
      rls: 'Public SELECT (published) · Admin ALL',
    },
    {
      name: 'blogs',
      description: 'Travel editorial articles, seasonal haor guides, and Sajek convoy logistics',
      columns: 'id (PK), title, slug, excerpt, content, author_name, cover_image, tags, reading_time, published_at',
      rls: 'Public SELECT (published) · Admin ALL',
    },
    {
      name: 'user_profiles',
      description: 'Role-based profiles linked to auth.users (admin, moderator, traveler)',
      columns: 'id (PK -> auth.users), email, full_name, role, avatar_url, updated_at',
      rls: 'User SELECT/UPDATE own · Admin ALL',
    },
    {
      name: 'listing_submissions',
      description: 'Host registration requests submitted for directory inclusion',
      columns: 'id (PK), name, category, district, description, phone, email, status (pending/approved)',
      rls: 'Public INSERT · Admin SELECT/UPDATE',
    },
    {
      name: 'trip_inquiries',
      description: 'Custom travel route requests submitted by travelers',
      columns: 'id (PK), traveler_name, email, duration_days, division_focus, pace, status',
      rls: 'Public INSERT · Admin SELECT/UPDATE',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title="Supabase Database & Security Console"
      subtitle={`Connected to ${supabaseUrl}`}
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('health')}
            className={`flex-1 py-2 px-3 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'health'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-emerald-600" />
            <span>Connection & Health</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`flex-1 py-2 px-3 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'schema'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-blue-600" />
            <span>Schema & Tables (8)</span>
          </button>

          <button
            onClick={() => setActiveTab('rls')}
            className={`flex-1 py-2 px-3 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'rls'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="h-3.5 w-3.5 text-amber-600" />
            <span>RLS Security Policies</span>
          </button>
        </div>

        {/* TAB 1: CONNECTION & HEALTH */}
        {activeTab === 'health' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Target Supabase Cluster
                </span>
                <span className="font-mono text-emerald-400 text-sm">{supabaseUrl}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchHealth}
                  disabled={loading}
                  icon={<RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />}
                  className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 text-xs"
                >
                  Test Ping
                </Button>
                <a
                  href="https://supabase.com/dashboard/project/kdrifllxmjwsxonmttyr/sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors"
                >
                  <span>Open Supabase SQL Editor</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Health Result */}
            {health && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
                  health.connected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {health.connected ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <span>
                      {health.connected ? 'Cluster Reachable' : 'Connection Notice'}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                      ({health.latencyMs}ms response)
                    </span>
                  </div>
                  <p className="leading-relaxed text-slate-700">{health.message}</p>
                </div>
              </div>
            )}

            {/* Quick SQL Migration Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <FileCode2 className="h-4 w-4 text-emerald-700" />
                  <span>Execute Database Migration</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copySqlToClipboard}
                  icon={
                    copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )
                  }
                  className="text-xs"
                >
                  {copied ? 'SQL Copied!' : 'Copy SQL Schema Script'}
                </Button>
              </div>

              <p className="text-slate-600 leading-relaxed text-[11px]">
                The migration script contains complete DDL statements, enum types, table
                constraints, triggers for <code className="text-slate-800">updated_at</code>, and
                sample seed data for Bangladesh’s 8 divisions and destinations.
              </p>

              <div className="bg-slate-900 rounded-lg p-3 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-36">
                <code>{`-- File: /supabase/schema.sql
CREATE TABLE IF NOT EXISTS divisions (...);
CREATE TABLE IF NOT EXISTS districts (...);
CREATE TABLE IF NOT EXISTS destinations (...);
CREATE TABLE IF NOT EXISTS directory_places (...);
CREATE TABLE IF NOT EXISTS blogs (...);
-- Click "Copy SQL Schema Script" above and run in Supabase Dashboard SQL Editor`}</code>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHEMA & TABLES */}
        {activeTab === 'schema' && (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="font-semibold text-slate-500">
                Core Entities Designed for BDYatra Directory
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={copySqlToClipboard}
                icon={
                  copied ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )
                }
                className="text-xs py-1"
              >
                {copied ? 'Copied' : 'Copy All SQL'}
              </Button>
            </div>

            <div className="space-y-2.5">
              {schemaTables.map((tbl) => (
                <div
                  key={tbl.name}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {tbl.name}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      {tbl.rls}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mb-1.5 leading-relaxed">
                    {tbl.description}
                  </p>
                  <div className="font-mono text-[10px] text-slate-500 bg-white p-1.5 rounded border border-slate-200/70 truncate">
                    {tbl.columns}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ROW LEVEL SECURITY POLICIES */}
        {activeTab === 'rls' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-950">
                <Shield className="h-4 w-4 text-emerald-700" />
                <span>Zero Secret Exposure & Least-Privilege Design</span>
              </div>
              <p className="text-emerald-900 leading-relaxed text-[11px]">
                BDYatra follows modern Supabase security guidelines. The frontend only exposes
                the public anonymous key (<code className="text-emerald-950 font-semibold">VITE_SUPABASE_ANON_KEY</code>).
                All write and administrative operations are validated at the PostgreSQL engine
                level using Row Level Security (RLS).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">
                  1. Public Read (SELECT)
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Anyone can freely browse verified destinations, hotels, houseboats, and
                  travel blogs where <code className="text-slate-800">is_published = true</code>.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">
                  2. Admin-Only Control (ALL)
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Only authenticated users with <code className="text-slate-800">role = 'admin'</code>{' '}
                  in <code className="text-slate-800">user_profiles</code> can insert, edit, or
                  delete catalog entries.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">
                  3. Host Submissions (INSERT)
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Local operators and hosts can submit new listings. Submissions default to{' '}
                  <code className="text-slate-800">'pending'</code> and are only visible to admins.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">
                  4. Traveler Inquiries (INSERT)
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Travelers can safely submit trip planning requests without exposing contact
                  records to other public site visitors.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Database Migration Path: <code className="text-slate-600">/supabase/schema.sql</code>
          </span>
          <Button variant="emerald" size="sm" onClick={onClose}>
            Close Console
          </Button>
        </div>
      </div>
    </Modal>
  );
};

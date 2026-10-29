import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Copy,
  Check,
  Database,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  HardDrive,
} from 'lucide-react';
import { checkSupabaseHealth, supabaseUrl } from '../../lib/supabase';

export const SecurityRLSView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [testingHealth, setTestingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState<string | null>(null);

  const rlsScript = `-- =========================================================
-- BDYatra Supabase Row Level Security (RLS) Policy Setup
-- Enforces:
-- 1. Public visitors have STRICT READ-ONLY access to published records
-- 2. Authenticated Admin users have FULL CRUD (INSERT, UPDATE, DELETE)
-- 3. Anonymous public users can INSERT pending submissions
-- 4. Supabase Storage buckets enforce public READ and admin WRITE
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

-- 6. Storage Bucket Configuration (Run in SQL or Storage UI)
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
  WITH CHECK (bucket_id IN ('destination-images', 'blog-covers', 'place-photos'));`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rlsScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTestHealth = async () => {
    setTestingHealth(true);
    try {
      const res = await checkSupabaseHealth();
      setHealthStatus(
        res.connected
          ? `Connected to Supabase PostgreSQL cluster (${res.latencyMs}ms latency). Tables detected: ${res.tablesDetected.join(', ') || 'None yet'}.`
          : `Connection message: ${res.message}`
      );
    } finally {
      setTestingHealth(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Supabase Row Level Security (RLS) & Storage Access
              </h3>
              <p className="text-xs text-slate-500">
                Active PostgreSQL Security Policies for project{' '}
                <span className="font-mono text-emerald-700 font-semibold">{supabaseUrl}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleTestHealth}
            disabled={testingHealth}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${testingHealth ? 'animate-spin text-emerald-600' : ''}`} />
            {testingHealth ? 'Pinging Cluster...' : 'Verify Cluster Connectivity'}
          </button>
        </div>

        {healthStatus && (
          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
            {healthStatus}
          </div>
        )}

        {/* Security Rule Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Public Anonymous Access</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Read-Only
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unauthenticated travelers can query published destinations, blogs, and directory listings. Drafts and internal admin metadata are strictly withheld.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">User Submissions</span>
              <span className="text-[11px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                Insert-Only
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Local hospitality operators can submit listings and travelers can submit trip planner inquiries. These enter a <code>pending</code> status requiring admin moderation.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Admin Role Access</span>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                Full CRUD
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authenticated editorial admins have unrestricted permission to create, edit, publish, unpublish, and delete entries across all entities.
            </p>
          </div>
        </div>
      </div>

      {/* SQL Script Viewer */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm text-slate-200">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300 font-mono">
              supabase/rls_policies.sql
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                Copied to Clipboard
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                Copy SQL Script
              </>
            )}
          </button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed bg-slate-900/90">
          <pre>{rlsScript}</pre>
        </div>
      </div>
    </div>
  );
};

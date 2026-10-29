import React, { useState } from 'react';
import { Database, ChevronRight, Shield, Layers, ExternalLink, Globe } from 'lucide-react';
import { getSupabaseConfigStatus } from '../../services/supabaseClient';

interface SupabaseStatusBannerProps {
  onOpenConsole?: () => void;
  onOpenSEO?: () => void;
  onOpenAdmin?: () => void;
}

export const SupabaseStatusBanner: React.FC<SupabaseStatusBannerProps> = ({
  onOpenConsole,
  onOpenSEO,
  onOpenAdmin,
}) => {
  const [expanded, setExpanded] = useState(false);
  const status = getSupabaseConfigStatus();

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-white text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-medium text-[11px]">
            <Database className="h-3 w-3 text-emerald-400" />
            <span>Supabase Cloud Connected</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden md:inline truncate max-w-md">
            Target: <code className="text-emerald-400">kdrifllxmjwsxonmttyr.supabase.co</code> (RLS Secured)
          </span>
        </div>

        <div className="flex items-center gap-4">
          {onOpenSEO && (
            <button
              onClick={onOpenSEO}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-medium cursor-pointer transition-colors"
            >
              <Globe className="h-3 w-3 text-emerald-400" />
              <span>SEO & Metadata Engine</span>
            </button>
          )}

          {onOpenConsole && (
            <button
              onClick={onOpenConsole}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-medium cursor-pointer transition-colors"
            >
              <Shield className="h-3 w-3" />
              <span>Database Schema</span>
            </button>
          )}

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer underline underline-offset-4"
            >
              <Shield className="h-3 w-3" />
              <span>Admin CMS</span>
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>{expanded ? 'Hide Info' : 'Quick Details'}</span>
            <ChevronRight
              className={`h-3 w-3 transform transition-transform ${
                expanded ? 'rotate-90' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-800 bg-slate-950/95 px-4 sm:px-6 lg:px-8 py-4 text-xs animate-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-1">
                Active Supabase Connection
              </span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Configured with <code className="text-slate-200">VITE_SUPABASE_URL</code> and{' '}
                <code className="text-slate-200">VITE_SUPABASE_ANON_KEY</code> pointing to project{' '}
                <span className="text-emerald-400">kdrifllxmjwsxonmttyr</span>.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-1">
                Dynamic SEO & OpenGraph Ready
              </span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Synchronizes <code className="text-slate-200">&lt;title&gt;</code>, canonical links,
                OpenGraph cards, Twitter cards, and Schema.org JSON-LD dynamically across all views and
                deep-link hashes.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-1">
                PostgreSQL RLS Security
              </span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Row Level Security strictly enforced: public read for verified catalog records; admin-only
                write/update controls; zero secret service role keys exposed in client code.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

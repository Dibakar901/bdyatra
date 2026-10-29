import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Production connection credentials
const PRODUCTION_URL = 'https://kdriflxmjwsxonmttyr.supabase.co';
const PRODUCTION_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcmlmbGx4bWp3c3hvbm10dHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNjk1MTksImV4cCI6MjEwODc0NTUxOX0.JfbJb2BAN8BZAJNCbPfO3MOBnLqpsipM7bPRBJQg7YE';

// Explicitly map environment variables with hardcoded fallbacks
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || PRODUCTION_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || PRODUCTION_KEY;

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn('[BDYatra Supabase] VITE_SUPABASE_URL not found, using production fallback.');
}
if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('[BDYatra Supabase] VITE_SUPABASE_ANON_KEY not found, using production fallback.');
}

// Client Initialization
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-client-info': 'bdyatra-web@1.0.0',
      },
    },
  }
);

// Health check and error handling wrappers
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20
);

export interface SupabaseHealthResult {
  connected: boolean;
  latencyMs: number;
  message: string;
  url: string;
  tablesDetected: string[];
}

export async function checkSupabaseHealth(): Promise<SupabaseHealthResult> {
  const start = performance.now();
  const tablesChecked = ['destinations', 'divisions', 'districts', 'blogs', 'directory_listings'];
  const detected: string[] = [];

  try {
    const { error } = await supabase.auth.getSession();
    const duration = Math.round(performance.now() - start);

    if (error) throw error;

    for (const table of tablesChecked) {
      const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
      if (!error) detected.push(table);
    }

    return {
      connected: true,
      latencyMs: duration,
      message: 'Connected',
      url: supabaseUrl,
      tablesDetected: detected,
    };
  } catch (err) {
    return {
      connected: false,
      latencyMs: Math.round(performance.now() - start),
      message: err instanceof Error ? err.message : 'Unknown error',
      url: supabaseUrl,
      tablesDetected: [],
    };
  }
}

export function handleSupabaseError(error: unknown, context: string): string {
  if (!error) return '';
  const err = error as { message: string };
  console.error(`[BDYatra Supabase Error] Context: ${context}`, err);
  return err.message || 'Database error occurred';
}

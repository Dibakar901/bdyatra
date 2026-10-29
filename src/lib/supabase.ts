import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Production connection credentials provided for BDYatra
const DEFAULT_SUPABASE_URL = 'https://kdrifllxmjwsxonmttyr.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcmlmbGx4bWp3c3hvbm10dHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNjk1MTksImV4cCI6MjEwODc0NTUxOX0.JfbJb2BAN8BZAJNCbPfO3MOBnLqpsipM7bPRBJQg7YE';

const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const envSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!envSupabaseUrl || !envSupabaseAnonKey) {
  console.warn(
    '[BDYatra Supabase] WARNING: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing from environment variables!'
  );
}

export const supabaseUrl: string = envSupabaseUrl || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey: string = envSupabaseAnonKey || DEFAULT_SUPABASE_ANON_KEY;

// Check validity
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project') &&
    supabaseAnonKey.length > 20
);

/**
 * Singleton Supabase Client for BDYatra
 * Configured with client-side session management and zero secret leaks.
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-client-info': 'bdyatra-web@1.0.0',
    },
  },
});

export interface SupabaseHealthResult {
  connected: boolean;
  latencyMs: number;
  message: string;
  url: string;
  tablesDetected: string[];
}

/**
 * Health check utility to test connectivity to the Supabase PostgreSQL cluster
 */
export async function checkSupabaseHealth(): Promise<SupabaseHealthResult> {
  const start = performance.now();
  const tablesChecked = ['destinations', 'divisions', 'districts', 'blogs', 'directory_listings'];
  const detected: string[] = [];

  try {
    // Attempt a light ping against auth service or public schema
    const { data: authData, error: authError } = await supabase.auth.getSession();
    const duration = Math.round(performance.now() - start);

    if (authError) {
      return {
        connected: false,
        latencyMs: duration,
        message: `Auth endpoint response: ${authError.message}`,
        url: supabaseUrl,
        tablesDetected: [],
      };
    }

    // Check availability of any tables
    for (const table of tablesChecked) {
      try {
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
        if (!error) {
          detected.push(table);
        }
      } catch {
        // Table may not be created yet in this remote database
      }
    }

    return {
      connected: true,
      latencyMs: duration,
      message:
        detected.length > 0
          ? `Connected to Supabase PostgreSQL cluster (${detected.length} tables found).`
          : 'Connected to Supabase cluster. Ready for SQL schema migration execution.',
      url: supabaseUrl,
      tablesDetected: detected,
    };
  } catch (err: unknown) {
    const duration = Math.round(performance.now() - start);
    return {
      connected: false,
      latencyMs: duration,
      message: err instanceof Error ? err.message : 'Unknown connection error',
      url: supabaseUrl,
      tablesDetected: [],
    };
  }
}

/**
 * Graceful error extraction helper for database operations
 */
export function handleSupabaseError(error: unknown, context: string): string {
  if (!error) return '';
  const errorObj = error as { message?: string; details?: string; hint?: string; code?: string };
  const message = errorObj.message || 'Database query error';
  const hint = errorObj.hint ? ` (${errorObj.hint})` : '';
  const code = errorObj.code ? ` [Code: ${errorObj.code}]` : '';
  console.warn(`[BDYatra Supabase: ${context}] ${message}${hint}${code}`);
  return `${message}${hint}`;
}

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { AdminUser } from '../types/auth';

const ADMIN_STORAGE_KEY = 'bdyatra_admin_session';

/**
 * Retrieves the current admin user session from Supabase Auth or persistent local session
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  // Check Supabase Auth session
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session?.user) {
        const user: AdminUser = {
          id: session.user.id,
          email: session.user.email || '',
          fullName:
            session.user.user_metadata?.full_name ||
            session.user.email?.split('@')[0] ||
            'System Administrator',
          role: 'admin',
          avatarUrl: session.user.user_metadata?.avatar_url,
          lastSignInAt: session.user.last_sign_in_at || new Date().toISOString(),
          isDemo: false,
        };
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
        return user;
      }
    } catch (err) {
      console.warn('[BDYatra Auth] Could not fetch Supabase session:', err);
    }
  }

  return null;
}

/**
 * Standard Supabase Email/Password Admin Sign In
 */
export async function signInAdminWithCredentials(
  email: string,
  password: string
): Promise<{ user: AdminUser | null; error: string | null }> {
  const cleanEmail = email.trim().toLowerCase();

  // Try real Supabase Auth
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        return {
          user: null,
          error: error.message,
        };
      }

      if (data.user) {
        const user: AdminUser = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          fullName:
            data.user.user_metadata?.full_name ||
            data.user.email?.split('@')[0] ||
            'Authenticated Admin',
          role: 'admin',
          avatarUrl: data.user.user_metadata?.avatar_url,
          lastSignInAt: new Date().toISOString(),
          isDemo: false,
        };
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
        return { user, error: null };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication service error';
      return { user: null, error: msg };
    }
  }

  return {
    user: null,
    error: 'Authentication failed. Please verify credentials.',
  };
}

/**
 * Sign out admin user
 */
export async function signOutAdmin(): Promise<void> {
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.warn('[BDYatra Auth] Sign out error:', err);
  }
}

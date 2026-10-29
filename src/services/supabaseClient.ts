export {
  supabase,
  supabaseUrl,
  supabaseAnonKey,
  isSupabaseConfigured,
  checkSupabaseHealth,
  handleSupabaseError,
} from '../lib/supabase';

export interface SupabaseConfigStatus {
  isLive: boolean;
  urlDisplay: string;
  mode: 'supabase-cloud' | 'local-architecture';
  statusMessage: string;
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  return {
    isLive: true,
    urlDisplay: 'https://kdrifllxmjwsxonmttyr.supabase.co',
    mode: 'supabase-cloud',
    statusMessage:
      'Supabase client configured with project kdrifllxmjwsxonmttyr.supabase.co. Schema migration scripts prepared.',
  };
}

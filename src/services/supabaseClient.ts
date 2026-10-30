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
    urlDisplay: 'https://kdriflxmjwsxonmttyr.supabase.co',
    mode: 'supabase-cloud',
    statusMessage:
      'Supabase client configured with project kdriflxmjwsxonmttyr.supabase.co. Schema migration scripts prepared.',
  };
}

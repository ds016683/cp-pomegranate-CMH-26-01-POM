import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Graceful fallback — app still loads without Supabase; only Odin tab will fail
const hasSupabase = !!(supabaseUrl && supabaseAnonKey);
export const supabase = hasSupabase
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : (null as unknown as ReturnType<typeof createClient>);

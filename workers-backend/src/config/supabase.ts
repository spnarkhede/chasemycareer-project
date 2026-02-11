import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Env } from '../index';

// Create Supabase client
export function getSupabaseClient(env: Env): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Create Supabase admin client (with service role key)
export function getSupabaseAdmin(env: Env): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

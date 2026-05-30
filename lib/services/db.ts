/**
 * lib/services/db.ts
 * Shared Supabase client factory for the service layer.
 *
 * Returns null when DB is not configured — callers fall back to mock data.
 * Uses the service role key (server-side only) for unrestricted access.
 * For RLS-respecting queries, pass the user's access token instead.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null | undefined = undefined; // undefined = not yet checked

/** Get a service-role Supabase client, or null in demo mode. */
export function getServiceClient(): SupabaseClient | null {
  if (_client !== undefined) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key || url.includes('your-project-ref')) {
    _client = null;
    return null;
  }

  _client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return _client;
}

/** True when Supabase is configured and ready. */
export function isDbConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && key && !url.includes('your-project-ref'));
}

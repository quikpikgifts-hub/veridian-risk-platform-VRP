/**
 * lib/supabase/server.ts
 * Server-side Supabase client for Server Components, Route Handlers, Middleware.
 * Uses cookie-based session management via @supabase/ssr.
 *
 * NEVER import this file in Client Components — it uses next/headers (server-only).
 */
import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from './types';

/** True when a value looks like an unfilled placeholder. */
function isPlaceholder(val: string | undefined): boolean {
  if (!val) return true;
  return val.includes('your-project-ref') || val.trimEnd().endsWith('...');
}

/**
 * Cookie-aware server client.
 * Use in Server Components and Route Handlers that need session-scoped access.
 * Returns null when Supabase is not configured (demo mode).
 */
export async function createServerSupabase() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isPlaceholder(url) || isPlaceholder(anon)) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url!, anon!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component — cookie mutations are ignored; middleware handles session refresh
        }
      },
    },
  });
}

/**
 * Service-role client for privileged admin operations.
 * Bypasses RLS — NEVER expose to the client bundle.
 * Returns null when service key is not configured.
 */
export function createAdminSupabase() {
  const url        = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (isPlaceholder(url) || !serviceKey || serviceKey.trimEnd().endsWith('...')) {
    return null;
  }

  return createSupabaseClient<Database>(url!, serviceKey, {
    auth: {
      persistSession:   false,
      autoRefreshToken: false,
    },
  });
}

/**
 * lib/supabase/client.ts
 * Browser-safe Supabase client for Client Components.
 * Uses NEXT_PUBLIC_ env vars — safe to expose.
 */
'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

/** Returns null when Supabase is not configured or still using placeholder values. */
export function createClient() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isPlaceholder =
    !url  || !anon ||
    url.includes('your-project-ref') ||   // example Supabase URL
    anon.includes('...') ||               // truncated key (e.g. eyJ...)
    anon.toUpperCase().startsWith('PASTE') || // literal placeholder text
    anon.length < 20;                     // too short to be a real key

  if (isPlaceholder) {
    console.warn('[Veridian] Supabase not configured — running in demo mode.');
    return null as unknown as ReturnType<typeof createBrowserClient<Database>>;
  }

  return createBrowserClient<Database>(url, anon);
}

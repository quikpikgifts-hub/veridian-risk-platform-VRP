/**
 * lib/env.ts
 * Single source of truth for all environment variables.
 * Server-only — never import into Client Components.
 * Throws on startup if required vars are missing in production.
 */

// ── Placeholder detection ────────────────────────────────────
// Values that look "set" but are actually template placeholders.
const PLACEHOLDER_PATTERNS = [
  'your-project-ref',  // Supabase URL template
  'YOUR_VALUE_HERE',   // Generic placeholder
  'sk-proj-...',       // Truncated OpenAI key
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Truncated JWT
];

function isPlaceholder(val: string | undefined): boolean {
  if (!val) return true;
  if (val.trim() === '') return true;
  // Ends with ... → truncated / example value
  if (val.trimEnd().endsWith('...')) return true;
  // Matches any known placeholder pattern
  return PLACEHOLDER_PATTERNS.some(p => val.includes(p));
}

function require_env(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(
      `[Veridian] Missing required environment variable: ${name}\n` +
      `  → Add it to .env.local (dev) or Vercel → Settings → Environment Variables (prod).`
    );
  }
  if (isPlaceholder(val)) {
    throw new Error(
      `[Veridian] Environment variable ${name} is still a placeholder value.\n` +
      `  → Replace "${val}" with your actual credentials.`
    );
  }
  return val;
}

function optional_env(name: string, fallback = ''): string {
  return process.env[name] ?? fallback;
}

// ── OpenAI ───────────────────────────────────────────────────
export const OPENAI_API_KEY   = () => require_env('OPENAI_API_KEY');
export const OPENAI_MODEL     = () => optional_env('OPENAI_MODEL', 'gpt-4o');

// ── Supabase ─────────────────────────────────────────────────
export const SUPABASE_URL         = () => require_env('NEXT_PUBLIC_SUPABASE_URL');
export const SUPABASE_ANON_KEY    = () => require_env('NEXT_PUBLIC_SUPABASE_ANON_KEY');
export const SUPABASE_SERVICE_KEY = () => optional_env('SUPABASE_SERVICE_ROLE_KEY');

// ── App ───────────────────────────────────────────────────────
export const APP_URL    = () => optional_env('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');
export const NODE_ENV   = process.env.NODE_ENV ?? 'development';
export const IS_PROD    = NODE_ENV === 'production';

/**
 * validateEnv — call once at app startup in layout.tsx server context.
 *
 * Checks for both:
 *  1. Missing vars (empty / undefined)
 *  2. Placeholder vars (template values left unfilled)
 *
 * Behaviour:
 *  - Development: logs warnings, never throws
 *  - Production:  throws on any missing or placeholder required var
 */
export function validateEnv(): void {
  const required         = ['OPENAI_API_KEY'];
  const supabaseRequired = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];

  const missingOrPlaceholder: string[] = [];
  const placeholderWarnings: string[]  = [];

  // Required vars — must be present and non-placeholder
  for (const key of required) {
    const val = process.env[key];
    if (!val) {
      missingOrPlaceholder.push(`${key} (missing)`);
    } else if (isPlaceholder(val)) {
      missingOrPlaceholder.push(`${key} (placeholder value)`);
    }
  }

  // Supabase vars — required in prod, warn in dev
  for (const key of supabaseRequired) {
    const val = process.env[key];
    const absent      = !val;
    const placeholder = !absent && isPlaceholder(val);

    if (absent || placeholder) {
      const reason = absent ? 'missing' : 'placeholder value';
      if (IS_PROD) {
        missingOrPlaceholder.push(`${key} (${reason})`);
      } else {
        placeholderWarnings.push(`${key} (${reason}) — Supabase auth disabled, demo mode active`);
      }
    }
  }

  // Emit dev warnings
  for (const w of placeholderWarnings) {
    console.warn(`[Veridian] ⚠️  ${w}`);
  }

  // Throw or error-log if any required vars are bad
  if (missingOrPlaceholder.length > 0) {
    const list = missingOrPlaceholder.map(k => `  • ${k}`).join('\n');
    const msg  = `[Veridian] Environment configuration error:\n${list}`;
    if (IS_PROD) throw new Error(msg);
    else console.error(msg);
  }
}

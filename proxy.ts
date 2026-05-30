/**
 * proxy.ts — Next.js 16 Edge Proxy
 *
 * 1. Refreshes Supabase session cookie on every request
 * 2. Redirects unauthenticated users to /login (protected routes)
 * 3. Redirects authenticated users away from /login → /dashboard
 * 4. Enforces RBAC — wrong role gets sent to /dashboard?error=unauthorized
 * 5. Demo mode — placeholder env vars → all routes open (dev only)
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { canAccessRoute } from '@/lib/rbac';

const PUBLIC_PATHS = new Set(['/', '/login', '/consultation']);
const PUBLIC_PREFIXES = ['/api/health', '/api/consultation', '/api/audit', '/_next/', '/static/'];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) return true;
  if (/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$/i.test(pathname)) return true;
  return false;
}

function isPlaceholder(val: string | undefined | null): boolean {
  if (!val || val.trim() === '') return true;
  if (val.includes('your-project-ref')) return true;
  if (val.trimEnd().endsWith('...')) return true;
  if (val.toUpperCase().startsWith('PASTE')) return true;
  if (val.length < 20) return true;
  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Demo mode — missing or placeholder credentials → open access
  if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnon)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[proxy] Demo mode — Supabase not configured, all routes open.');
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl!, supabaseAnon!, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, {
            ...options,
            httpOnly: true,
            secure:   process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path:     '/',
          })
        );
      },
    },
  });

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[proxy] getUser error:', err);
    }
    // Network error — pass through in dev, block in prod
    if (process.env.NODE_ENV !== 'production') return NextResponse.next({ request });
  }

  const isAuthenticated = !!user;

  // Authenticated user hitting /login → send to dashboard
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Public path — always allow
  if (isPublicPath(pathname)) {
    return NextResponse.next({ request });
  }

  // Unauthenticated → protected route
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (user!.user_metadata?.role as string) ?? 'viewer';

  // RBAC — authenticated but insufficient role
  if (!canAccessRoute(role, pathname)) {
    console.warn(`[proxy] RBAC denied: role=${role} path=${pathname}`);
    const dash = new URL('/dashboard', request.url);
    dash.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(dash);
  }

  // Forward identity to server components and API routes
  response.headers.set('x-user-id',    user!.id);
  response.headers.set('x-user-email', user!.email ?? '');
  response.headers.set('x-user-role',  role);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

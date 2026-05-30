import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Security Headers ──────────────────────────────────────────
  // Applied to every response. Adjust CSP connect-src when adding new services.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevents clickjacking
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },

          // Prevents MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },

          // Controls referrer sent in cross-origin requests
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // Restrict browser feature APIs not used by the platform
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },

          // HSTS — uncomment after confirming SSL cert is stable on production domain
          // { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },

          // Content Security Policy
          // 'unsafe-inline' is required by Next.js (inline hydration scripts + Tailwind styles).
          // Tighten to nonce-based once the app stabilises.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // unsafe-eval needed in dev (Next.js HMR); strip in prod if possible
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              // Supabase REST + realtime, OpenAI API
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // ── Images ────────────────────────────────────────────────────
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { validateEnv } from '@/lib/env';

// Surface configuration problems at startup — warns in dev, throws in prod
validateEnv();

export const metadata: Metadata = {
  title: {
    default: 'Veridian Risk Platform',
    template: '%s · Veridian',
  },
  description: 'Enterprise operational risk and consulting platform — Veridian Risk & Resilience Group, LLC',
  keywords: ['risk management', 'AI operations', 'workforce platform', 'operational intelligence'],
  authors: [{ name: 'Veridian Risk & Resilience Group, LLC' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#06070E',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

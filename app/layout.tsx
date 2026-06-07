import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { validateEnv } from '@/lib/env';

validateEnv();

export const metadata: Metadata = {
  title: {
    default: 'ShieldSync Enterprise Platform',
    template: '%s | ShieldSync',
  },
  description: 'Enterprise security operations platform for contract security teams, supervisors, and executives.',
  keywords: ['security operations', 'contract security', 'incident management', 'patrol management', 'operational intelligence'],
  authors: [{ name: 'ShieldSync Protect' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#04050A] px-5">
      <div aria-hidden className="pointer-events-none fixed inset-0 opacity-[0.018]"
        style={{ backgroundImage: 'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)', backgroundSize: '88px 88px' }} />

      <div className="relative text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#C9A84C]/[0.07] border border-[#C9A84C]/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#C9A84C]/60" />
          </div>
        </div>

        <div className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#C9A84C]/55 mb-3">
          Veridian Risk Platform
        </div>

        <h1 className="text-[64px] font-black font-mono text-white/08 leading-none mb-0 select-none">
          404
        </h1>
        <p className="text-[20px] font-bold text-[#EEF0F6] tracking-tight leading-snug -mt-2 mb-3">
          Page not found
        </p>
        <p className="text-[12px] text-[#EEF0F6]/38 leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#D4B560] text-[#03040A] text-[10.5px] font-bold uppercase tracking-[0.13em] px-6 py-3 transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-white/[0.14] hover:border-white/25 text-[#EEF0F6]/50 hover:text-[#EEF0F6]/80 text-[10.5px] font-semibold uppercase tracking-[0.12em] px-6 py-3 transition-all"
          >
            Back to Home
          </Link>
        </div>

        <p className="mt-8 text-[9.5px] text-white/15">
          © {new Date().getFullYear()} Veridian Risk &amp; Resilience Group, LLC
        </p>
      </div>
    </div>
  );
}

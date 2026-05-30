'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, AlertCircle, Lock, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function VLogo() {
  return (
    <svg viewBox="0 0 36 36" fill="none" className="w-10 h-10" aria-hidden>
      <circle cx="18" cy="18" r="15.5" stroke="#C9A84C" strokeWidth="0.6" opacity="0.25"/>
      <circle cx="18" cy="18" r="10"   stroke="#C9A84C" strokeWidth="1.3" opacity="0.6"/>
      <circle cx="18" cy="18" r="2.8"  fill="#C9A84C"/>
      <line x1="18" y1="2.5"  x2="18" y2="8"    stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="28"   x2="18" y2="33.5"  stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="2.5" y1="18"  x2="8"  y2="18"    stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="28"  y1="18"  x2="33.5" y2="18"  stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11.5 12 L18 24 L24.5 12" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Inner login form — reads searchParams ───────────────────── */
function LoginForm() {
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get('redirectTo') ?? '/dashboard';
  const supabase     = createClient();

  // If already authenticated, send to dashboard
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace(redirectTo);
    });
  }, [supabase, router, redirectTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Demo bypass — Supabase not configured
    if (!supabase) {
      setTimeout(() => {
        setLoading(false);
        router.push(redirectTo);
      }, 600);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email:    email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      setLoading(false);
      // Generic message — never reveal whether the email exists
      setError('Invalid credentials. Please check your email and password.');
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !email.trim()) {
      setError('Enter your email address to receive a reset link.');
      return;
    }
    setLoading(true);
    setError('');

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/login` }
    );

    setLoading(false);
    if (resetError) {
      setError('Could not send reset email. Please try again.');
      return;
    }
    setResetSent(true);
  };

  if (resetSent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle className="w-8 h-8 text-green-400" />
        <p className="text-[13px] font-semibold text-white/80">Reset link sent</p>
        <p className="text-[11px] text-white/35 leading-relaxed max-w-[260px]">
          Check your email for a password reset link. It expires in 1 hour.
        </p>
        <button
          onClick={() => { setResetMode(false); setResetSent(false); setError(''); }}
          className="mt-2 text-[10.5px] text-amber-400/70 hover:text-amber-400 transition-colors"
        >
          ← Back to sign in
        </button>
      </div>
    );
  }

  if (resetMode) {
    return (
      <form onSubmit={handleReset} className="space-y-4" noValidate>
        <p className="text-[11.5px] text-white/42 leading-relaxed">
          Enter your email and we&apos;ll send a password reset link.
        </p>
        <div>
          <label htmlFor="reset-email" className="block text-[9px] font-bold tracking-[0.2em] uppercase text-white/30 mb-1.5">
            Email Address
          </label>
          <input
            id="reset-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            placeholder="your@email.com"
            className="w-full bg-black/30 border border-white/[0.09] text-[#EEF0F6] text-[12.5px] px-3.5 py-2.5 rounded-[3px] outline-none transition-all focus:border-[#C9A84C]/40 focus:shadow-[0_0_0_2px_rgba(201,168,76,0.08)] placeholder:text-white/18"
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 text-[11px] text-red-400 bg-red-500/[0.08] border border-red-500/20 px-3 py-2.5 rounded-[3px]">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#D4B560] disabled:opacity-50 disabled:cursor-not-allowed text-[#03040A] text-[10.5px] font-bold uppercase tracking-[0.14em] py-3 rounded-[3px] transition-colors mt-2"
        >
          {loading
            ? <div className="w-4 h-4 rounded-full border-2 border-[#03040A]/20 border-t-[#03040A] animate-spin" />
            : 'Send Reset Link'
          }
        </button>
        <button
          type="button"
          onClick={() => { setResetMode(false); setError(''); }}
          className="w-full text-center text-[10.5px] text-white/30 hover:text-white/55 transition-colors pt-1"
        >
          ← Back to sign in
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4" noValidate>

      {!supabase && (
        <div className="flex items-start gap-2.5 p-3 bg-amber-500/[0.08] border border-amber-500/20 rounded-[3px]">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-[10.5px] text-amber-300/70 leading-relaxed">
            Demo mode — Supabase not configured. Any credentials will work.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-[9px] font-bold tracking-[0.2em] uppercase text-white/30 mb-1.5">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          placeholder={supabase ? 'your@email.com' : 'demo@veridian.com'}
          className="w-full bg-black/30 border border-white/[0.09] text-[#EEF0F6] text-[12.5px] px-3.5 py-2.5 rounded-[3px] outline-none transition-all focus:border-[#C9A84C]/40 focus:shadow-[0_0_0_2px_rgba(201,168,76,0.08)] placeholder:text-white/18"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-[9px] font-bold tracking-[0.2em] uppercase text-white/30 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPw ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            placeholder="••••••••"
            className="w-full bg-black/30 border border-white/[0.09] text-[#EEF0F6] text-[12.5px] px-3.5 py-2.5 pr-10 rounded-[3px] outline-none transition-all focus:border-[#C9A84C]/40 focus:shadow-[0_0_0_2px_rgba(201,168,76,0.08)] placeholder:text-white/18"
          />
          <button
            type="button"
            onClick={() => setShowPw(s => !s)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
          >
            {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[11px] text-red-400 bg-red-500/[0.08] border border-red-500/20 px-3 py-2.5 rounded-[3px]">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#D4B560] disabled:opacity-50 disabled:cursor-not-allowed text-[#03040A] text-[10.5px] font-bold uppercase tracking-[0.14em] py-3 rounded-[3px] transition-colors mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
      >
        {loading
          ? <div className="w-4 h-4 rounded-full border-2 border-[#03040A]/20 border-t-[#03040A] animate-spin" />
          : <><span>Access Platform</span><ArrowRight className="w-3.5 h-3.5" /></>
        }
      </button>

      {supabase && (
        <button
          type="button"
          onClick={() => { setResetMode(true); setError(''); }}
          className="w-full text-center text-[10.5px] text-white/28 hover:text-amber-400/70 transition-colors"
        >
          Forgot your password?
        </button>
      )}
    </form>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#04050A]">

      {/* Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.04), transparent)' }} />
        <div className="absolute inset-0 opacity-[0.018]" style={{ backgroundImage: 'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)', backgroundSize: '88px 88px' }} />
        <div className="absolute top-0 left-1/4 right-1/4 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
      </div>

      <div className="relative w-full max-w-[380px]">

        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <VLogo />
          <div className="mt-4 text-center">
            <div className="text-[17px] font-bold text-[#EEF0F6] tracking-tight">Veridian Risk Group</div>
            <div className="text-[8.5px] font-bold tracking-[0.28em] uppercase text-[#C9A84C]/60 mt-1">Operations Platform</div>
          </div>
        </div>

        {/* Card */}
        <div className="relative bg-[#07080E] border border-white/[0.08] rounded-[4px] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />

          <div className="p-7">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-3.5 h-3.5 text-amber-400/50" />
                <h1 className="text-[15px] font-bold text-[#EEF0F6]">Secure Access</h1>
              </div>
              <p className="text-[11.5px] text-white/35 mt-1">Authorised personnel only</p>
            </div>

            <Suspense fallback={
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin" />
              </div>
            }>
              <LoginForm />
            </Suspense>

            <div className="mt-5 pt-4 border-t border-white/[0.06] text-center">
              <p className="text-[10px] text-white/22">
                Contact your administrator for access credentials.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[9.5px] text-white/18">
          © {new Date().getFullYear()} Veridian Risk &amp; Resilience Group, LLC
        </p>
      </div>
    </div>
  );
}

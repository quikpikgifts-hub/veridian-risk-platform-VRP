'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, AlertCircle, Lock, CheckCircle, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function ShieldSyncMark() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-[6px] border border-blue-500/35 bg-blue-500/10" aria-hidden>
      <Shield className="h-7 w-7 text-blue-400" strokeWidth={2.2} />
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';
  const supabase = createClient();

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

    if (!supabase) {
      setTimeout(() => {
        setLoading(false);
        router.push(redirectTo);
      }, 500);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (authError) {
      setLoading(false);
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

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${window.location.origin}/login` });
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
        <p className="text-[13px] font-semibold text-white/85">Reset link sent</p>
        <p className="text-[11px] text-white/45 leading-relaxed max-w-[260px]">Check your email for a password reset link. It expires in 1 hour.</p>
        <button onClick={() => { setResetMode(false); setResetSent(false); setError(''); }} className="mt-2 text-[10.5px] text-blue-400/80 hover:text-blue-300 transition-colors">Back to sign in</button>
      </div>
    );
  }

  if (resetMode) {
    return (
      <form onSubmit={handleReset} className="space-y-4" noValidate>
        <p className="text-[11.5px] text-white/50 leading-relaxed">Enter your email and we will send a password reset link.</p>
        <div>
          <label htmlFor="reset-email" className="block text-[9px] font-bold tracking-[0.2em] uppercase text-white/35 mb-1.5">Email Address</label>
          <input id="reset-email" type="email" required autoComplete="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="name@company.com" className="w-full bg-[#111111] border border-[#262626] text-white text-[12.5px] px-3.5 py-2.5 rounded-[3px] outline-none transition-all focus:border-blue-500/70 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.12)] placeholder:text-white/25" />
        </div>
        {error && <div className="flex items-center gap-2 text-[11px] text-red-400 bg-red-500/[0.08] border border-red-500/25 px-3 py-2.5 rounded-[3px]"><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /><span>{error}</span></div>}
        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10.5px] font-bold uppercase tracking-[0.14em] py-3 rounded-[3px] transition-colors mt-2">
          {loading ? <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> : 'Send Reset Link'}
        </button>
        <button type="button" onClick={() => { setResetMode(false); setError(''); }} className="w-full text-center text-[10.5px] text-white/35 hover:text-white/65 transition-colors pt-1">Back to sign in</button>
      </form>
    );
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4" noValidate>
      {!supabase && (
        <div className="flex items-start gap-2.5 p-3 bg-blue-500/[0.08] border border-blue-500/25 rounded-[3px]">
          <AlertCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-[10.5px] text-blue-100/70 leading-relaxed">Demo tenant active. Use any credentials to access ShieldSync Protect.</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-[9px] font-bold tracking-[0.2em] uppercase text-white/35 mb-1.5">Email Address</label>
        <input id="email" type="email" required autoComplete="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder={supabase ? 'name@company.com' : 'demo@shieldsyncprotect.com'} className="w-full bg-[#111111] border border-[#262626] text-white text-[12.5px] px-3.5 py-2.5 rounded-[3px] outline-none transition-all focus:border-blue-500/70 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.12)] placeholder:text-white/25" />
      </div>

      <div>
        <label htmlFor="password" className="block text-[9px] font-bold tracking-[0.2em] uppercase text-white/35 mb-1.5">Password</label>
        <div className="relative">
          <input id="password" type={showPw ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="Password" className="w-full bg-[#111111] border border-[#262626] text-white text-[12.5px] px-3.5 py-2.5 pr-10 rounded-[3px] outline-none transition-all focus:border-blue-500/70 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.12)] placeholder:text-white/25" />
          <button type="button" onClick={() => setShowPw(s => !s)} aria-label={showPw ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/65 transition-colors">
            {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {error && <div className="flex items-center gap-2 text-[11px] text-red-400 bg-red-500/[0.08] border border-red-500/25 px-3 py-2.5 rounded-[3px]"><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /><span>{error}</span></div>}

      <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10.5px] font-bold uppercase tracking-[0.14em] py-3 rounded-[3px] transition-colors mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70">
        {loading ? <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> : <><span>Access Command Center</span><ArrowRight className="w-3.5 h-3.5" /></>}
      </button>

      {supabase && <button type="button" onClick={() => { setResetMode(true); setError(''); }} className="w-full text-center text-[10.5px] text-white/35 hover:text-blue-300 transition-colors">Forgot your password?</button>}
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0A0A0A]">
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:88px_88px] opacity-30" />
      <div className="relative w-full max-w-[390px]">
        <div className="flex flex-col items-center mb-8">
          <ShieldSyncMark />
          <div className="mt-4 text-center">
            <div className="text-[18px] font-bold text-white tracking-tight">ShieldSync Protect</div>
            <div className="text-[8.5px] font-bold tracking-[0.28em] uppercase text-blue-400/75 mt-1">Enterprise Demonstration Tenant</div>
          </div>
        </div>

        <div className="relative bg-[#171717] border border-[#262626] rounded-[6px] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-blue-500" />
          <div className="p-7">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-3.5 h-3.5 text-blue-400/75" />
                <h1 className="text-[15px] font-bold text-white">Secure Access</h1>
              </div>
              <p className="text-[11.5px] text-white/45 mt-1">Authorized operations personnel only</p>
            </div>
            <Suspense fallback={<div className="flex items-center justify-center py-8"><div className="w-5 h-5 rounded-full border-2 border-blue-400/20 border-t-blue-400 animate-spin" /></div>}>
              <LoginForm />
            </Suspense>
            <div className="mt-5 pt-4 border-t border-[#262626] text-center">
              <p className="text-[10px] text-white/30">Contract Security Services | Enterprise Demo</p>
            </div>
          </div>
        </div>
        <p className="mt-5 text-center text-[9.5px] text-white/24">© {new Date().getFullYear()} ShieldSync Protect</p>
      </div>
    </div>
  );
}

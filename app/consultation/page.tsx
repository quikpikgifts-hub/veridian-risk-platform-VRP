'use client';

/**
 * app/consultation/page.tsx
 * Public consultation intake form — no authentication required.
 * Matches VRG brand: dark background, gold accents, enterprise tone.
 */

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, CheckCircle, Send, Loader2 } from 'lucide-react';

// ── Brand logo (matches homepage) ──────────────────────────────
function VLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" aria-label="Veridian Risk Group" role="img" className={className}>
      <circle cx="18" cy="18" r="15.5" stroke="#C9A84C" strokeWidth="0.5" opacity="0.22" />
      <circle cx="18" cy="18" r="10"   stroke="#C9A84C" strokeWidth="1.2" opacity="0.55" />
      <circle cx="18" cy="18" r="2.8"  fill="#C9A84C" />
      <line x1="18" y1="2.5"  x2="18" y2="8"    stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="18" y1="28"   x2="18" y2="33.5"  stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="2.5" y1="18"  x2="8"  y2="18"    stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="28"  y1="18"  x2="33.5" y2="18"  stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11.5 12 L18 24 L24.5 12" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Constants ───────────────────────────────────────────────────
const INDUSTRIES = [
  'Transportation & Logistics',
  'Construction',
  'Manufacturing',
  'Healthcare',
  'Retail & Distribution',
  'Government / Municipal',
  'Oil, Gas & Energy',
  'Hospitality',
  'Education',
  'Finance & Insurance',
  'Other',
] as const;

const SERVICES = [
  'Operational Risk Assessment',
  'Incident Documentation',
  'OSHA Compliance Advisory',
  'Fleet Risk Management',
  'Emergency Action Planning',
  'Workplace Violence Prevention',
  'HR & Workforce Consulting',
  'Insurance Claim Support',
  'Executive Briefing / Training',
  'Ongoing Retainer / Partnership',
] as const;

// ── Form state ──────────────────────────────────────────────────
interface FormState {
  firstName:        string;
  lastName:         string;
  company:          string;
  email:            string;
  phone:            string;
  industry:         string;
  services:         string[];
  message:          string;
  preferredContact: 'email' | 'phone' | 'either';
}

const INITIAL: FormState = {
  firstName: '', lastName: '', company: '', email: '',
  phone: '', industry: '', services: [], message: '',
  preferredContact: 'either',
};

// ── Input component ─────────────────────────────────────────────
function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#EEF0F6]/50">
        {label}{required && <span className="text-[#C9A84C] ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-white/[0.04] border border-white/[0.1] text-[#EEF0F6] text-[13px] px-3.5 py-2.5 ' +
  'outline-none focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/20 ' +
  'placeholder:text-white/20 transition-colors';

// ── Page ────────────────────────────────────────────────────────
export default function ConsultationPage() {
  const [form,    setForm]    = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function set(field: keyof FormState, value: string | string[]) {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(null);
  }

  function toggleService(svc: string) {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(svc)
        ? prev.services.filter(s => s !== svc)
        : [...prev.services, svc],
    }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Submission failed. Please try again.');
        return;
      }
      setSuccess(true);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#04050A] flex items-center justify-center px-5">
        <GridBg />
        <div className="relative text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-[#C9A84C]/[0.08] border border-[#C9A84C]/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#C9A84C]" />
            </div>
          </div>
          <div className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#C9A84C]/55 mb-3">
            Veridian Risk Platform
          </div>
          <h1 className="text-[26px] font-black text-[#EEF0F6] tracking-tight mb-3">
            Request Received
          </h1>
          <p className="text-[13px] text-[#EEF0F6]/55 leading-relaxed mb-8 max-w-sm mx-auto">
            Thank you, <strong className="text-[#EEF0F6]/80">{form.firstName}</strong>.
            A member of our team will contact you within one business day to discuss your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#D4B560] text-[#03040A] text-[10.5px] font-bold uppercase tracking-[0.13em] px-6 py-3 transition-colors"
            >
              Return Home
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 border border-white/[0.14] hover:border-white/25 text-[#EEF0F6]/50 hover:text-[#EEF0F6]/80 text-[10.5px] font-semibold uppercase tracking-[0.12em] px-6 py-3 transition-all"
            >
              Client Portal Login
            </Link>
          </div>
          <p className="mt-10 text-[9.5px] text-white/15">
            © {new Date().getFullYear()} Veridian Risk &amp; Resilience Group, LLC
          </p>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#04050A] text-[#EEF0F6]">
      <GridBg />

      {/* Nav */}
      <nav className="relative z-10 border-b border-white/[0.06] px-5 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <VLogo className="w-7 h-7" />
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#EEF0F6]/60">
            Veridian Risk Group
          </span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[11px] font-semibold text-[#EEF0F6]/40 hover:text-[#EEF0F6]/70 transition-colors uppercase tracking-[0.1em]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>
      </nav>

      {/* Header */}
      <div className="relative z-10 text-center pt-14 pb-10 px-5">
        <div className="inline-flex items-center gap-2 border border-[#C9A84C]/20 bg-[#C9A84C]/[0.05] px-4 py-1.5 mb-6">
          <Shield className="w-3 h-3 text-[#C9A84C]/70" />
          <span className="text-[9.5px] font-bold tracking-[0.25em] uppercase text-[#C9A84C]/70">
            Confidential Intake
          </span>
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-black tracking-tight leading-[1.1] mb-4">
          Schedule a Consultation
        </h1>
        <p className="text-[13px] text-[#EEF0F6]/45 max-w-lg mx-auto leading-relaxed">
          Complete the form below and a Veridian consultant will contact you within
          one business day to discuss your operational risk and consulting needs.
        </p>
      </div>

      {/* Form card */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 pb-20">
        <div className="border border-white/[0.07] bg-white/[0.02] p-8 sm:p-10">
          <form onSubmit={handleSubmit} noValidate className="space-y-8">

            {/* Section: Contact */}
            <section>
              <SectionTitle>Contact Information</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="First Name" required>
                  <input
                    className={inputCls}
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={e => set('firstName', e.target.value)}
                    required
                  />
                </Field>
                <Field label="Last Name" required>
                  <input
                    className={inputCls}
                    placeholder="Smith"
                    value={form.lastName}
                    onChange={e => set('lastName', e.target.value)}
                    required
                  />
                </Field>
                <Field label="Company / Organization" required>
                  <input
                    className={inputCls}
                    placeholder="Acme Logistics, LLC"
                    value={form.company}
                    onChange={e => set('company', e.target.value)}
                    required
                  />
                </Field>
                <Field label="Industry" required>
                  <select
                    className={inputCls + ' bg-[#06070E]'}
                    value={form.industry}
                    onChange={e => set('industry', e.target.value)}
                    required
                  >
                    <option value="" disabled>Select industry…</option>
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Email Address" required>
                  <input
                    type="email"
                    className={inputCls}
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    required
                  />
                </Field>
                <Field label="Phone Number">
                  <input
                    type="tel"
                    className={inputCls}
                    placeholder="(555) 000-0000"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                  />
                </Field>
              </div>
            </section>

            {/* Section: Services */}
            <section>
              <SectionTitle>Services Requested <span className="text-[#C9A84C]">*</span></SectionTitle>
              <p className="text-[11px] text-[#EEF0F6]/35 mb-4">Select all that apply.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SERVICES.map(svc => {
                  const checked = form.services.includes(svc);
                  return (
                    <button
                      type="button"
                      key={svc}
                      onClick={() => toggleService(svc)}
                      className={[
                        'flex items-center gap-3 px-4 py-3 border text-left transition-all text-[12px] font-medium',
                        checked
                          ? 'border-[#C9A84C]/40 bg-[#C9A84C]/[0.07] text-[#EEF0F6]/90'
                          : 'border-white/[0.08] bg-transparent text-[#EEF0F6]/45 hover:border-white/20 hover:text-[#EEF0F6]/65',
                      ].join(' ')}
                    >
                      <span className={[
                        'w-4 h-4 rounded-sm border flex-shrink-0 flex items-center justify-center transition-colors',
                        checked
                          ? 'border-[#C9A84C] bg-[#C9A84C]/20'
                          : 'border-white/20',
                      ].join(' ')}>
                        {checked && (
                          <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-[#C9A84C]" fill="none">
                            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      {svc}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Section: Preferred contact */}
            <section>
              <SectionTitle>Preferred Contact Method</SectionTitle>
              <div className="flex flex-wrap gap-3">
                {(['email', 'phone', 'either'] as const).map(method => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => set('preferredContact', method)}
                    className={[
                      'px-5 py-2 border text-[11px] font-semibold uppercase tracking-[0.1em] transition-all capitalize',
                      form.preferredContact === method
                        ? 'border-[#C9A84C]/40 bg-[#C9A84C]/[0.07] text-[#C9A84C]/90'
                        : 'border-white/[0.1] text-[#EEF0F6]/40 hover:border-white/20 hover:text-[#EEF0F6]/65',
                    ].join(' ')}
                  >
                    {method === 'either' ? 'No preference' : method}
                  </button>
                ))}
              </div>
            </section>

            {/* Section: Message */}
            <section>
              <SectionTitle>Additional Notes</SectionTitle>
              <textarea
                rows={5}
                className={inputCls + ' resize-none'}
                placeholder="Briefly describe your situation, any specific concerns, or questions you'd like to address during the consultation…"
                value={form.message}
                onChange={e => set('message', e.target.value)}
              />
              <p className="mt-2 text-[10.5px] text-[#EEF0F6]/25">
                All information is treated as strictly confidential.
              </p>
            </section>

            {/* Error */}
            {error && (
              <div className="border border-red-500/25 bg-red-500/[0.07] px-4 py-3 text-[12px] text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-2">
              <p className="text-[10.5px] text-[#EEF0F6]/30 leading-relaxed max-w-xs">
                By submitting, you agree to be contacted by Veridian Risk & Resilience Group
                regarding your request.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2.5 bg-[#C9A84C] hover:bg-[#D4B560] disabled:opacity-60 disabled:cursor-not-allowed text-[#03040A] text-[10.5px] font-bold uppercase tracking-[0.13em] px-8 py-3.5 transition-colors whitespace-nowrap w-full sm:w-auto"
              >
                {loading ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting…</>
                ) : (
                  <><Send className="w-3.5 h-3.5" /> Submit Request</>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Contact fallback */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-[#EEF0F6]/30">
            Prefer to speak directly?{' '}
            <a href="tel:+14074705992" className="text-[#C9A84C]/70 hover:text-[#C9A84C] transition-colors font-semibold">
              (407) 470-5992
            </a>
            {' · '}
            <a href="mailto:director@veridianriskgroup.org" className="text-[#C9A84C]/70 hover:text-[#C9A84C] transition-colors font-semibold">
              director@veridianriskgroup.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C9A84C]/60 mb-5 pb-3 border-b border-white/[0.06]">
      {children}
    </h2>
  );
}

function GridBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 opacity-[0.018]"
      style={{
        backgroundImage:
          'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)',
        backgroundSize: '88px 88px',
      }}
    />
  );
}

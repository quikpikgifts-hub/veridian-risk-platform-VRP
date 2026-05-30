'use client';

/**
 * app/admin/checklist/page.tsx
 * Production Deployment Checklist — admin only.
 * Route: /admin/checklist
 *
 * Tracks all pre-launch and post-launch requirements.
 * State is local (localStorage) — not persisted to DB.
 */

import { useEffect, useState } from 'react';
import {
  CheckCircle2, Circle, AlertTriangle, Shield,
  Database, Key, Server, Globe, FileText, Users,
  ChevronDown, ChevronRight,
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────
interface CheckItem {
  id:          string;
  label:       string;
  detail?:     string;
  critical?:   boolean;
}

interface Section {
  id:       string;
  title:    string;
  icon:     React.ElementType;
  items:    CheckItem[];
}

// ── Checklist Data ──────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    id: 'env', title: 'Environment Variables', icon: Key,
    items: [
      { id: 'env-1', label: 'NEXT_PUBLIC_SUPABASE_URL is set and not a placeholder', critical: true },
      { id: 'env-2', label: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is set', critical: true },
      { id: 'env-3', label: 'SUPABASE_SERVICE_ROLE_KEY is set (server-only)', critical: true },
      { id: 'env-4', label: 'OPENAI_API_KEY is set and has sufficient credits', critical: true },
      { id: 'env-5', label: 'All env vars added to Vercel project settings', critical: true },
      { id: 'env-6', label: 'No placeholder values remain (check Settings → Environment tab)', detail: 'Go to /settings and click the Environment tab' },
    ],
  },
  {
    id: 'db', title: 'Database (Supabase)', icon: Database,
    items: [
      { id: 'db-1', label: 'supabase/schema.sql executed in Supabase SQL Editor', critical: true },
      { id: 'db-2', label: 'All tables created: profiles, incidents, clients, risk_assessments, risk_findings, reports, workflows, audit_logs, consultations, notifications' },
      { id: 'db-3', label: 'Row Level Security (RLS) enabled on all tables', critical: true },
      { id: 'db-4', label: 'All RLS policies applied (check each table in Supabase dashboard)' },
      { id: 'db-5', label: 'on_auth_user_created trigger active on auth.users', critical: true },
      { id: 'db-6', label: 'Indexes created for performance-critical queries' },
      { id: 'db-7', label: 'Admin user created in Supabase Auth → Users', critical: true, detail: 'Use director@veridianriskgroup.org and set role=admin in metadata' },
      { id: 'db-8', label: 'Admin profile seeded in public.profiles table with role=admin' },
      { id: 'db-9', label: 'Supabase project is on a paid plan (not free tier pauses)', detail: 'Free tier pauses after 1 week of inactivity' },
    ],
  },
  {
    id: 'auth', title: 'Authentication', icon: Shield,
    items: [
      { id: 'auth-1', label: 'Supabase Auth → Email provider enabled', critical: true },
      { id: 'auth-2', label: 'Allowed redirect URLs include production domain and /login', critical: true, detail: 'Supabase Dashboard → Auth → URL Configuration' },
      { id: 'auth-3', label: 'Forgot password email points to correct domain', detail: 'redirectTo in resetPasswordForEmail must match production URL' },
      { id: 'auth-4', label: 'middleware.ts is named correctly (not proxy.ts)', critical: true },
      { id: 'auth-5', label: 'RBAC enforced: test analyst cannot access /users, client cannot access /incidents' },
      { id: 'auth-6', label: 'Demo mode disabled (Supabase URL is real, not placeholder)' },
      { id: 'auth-7', label: 'Session cookie settings: httpOnly, secure, sameSite=lax confirmed' },
    ],
  },
  {
    id: 'security', title: 'Security Hardening', icon: AlertTriangle,
    items: [
      { id: 'sec-1', label: 'SUPABASE_SERVICE_ROLE_KEY never exposed to client bundle', critical: true, detail: 'Must NOT start with NEXT_PUBLIC_' },
      { id: 'sec-2', label: 'OPENAI_API_KEY never exposed to client bundle', critical: true },
      { id: 'sec-3', label: 'Error messages are generic (no raw Supabase errors shown to users)' },
      { id: 'sec-4', label: 'Auth error: "Invalid credentials" (not "email not found" / "wrong password")' },
      { id: 'sec-5', label: 'Audit logging active: test incident creation writes to audit_logs' },
      { id: 'sec-6', label: 'Consultation submissions visible to admin in Supabase dashboard' },
      { id: 'sec-7', label: 'No console.log statements exposing sensitive data in production' },
      { id: 'sec-8', label: 'Next.js headers configured (X-Frame-Options, HSTS, CSP) in next.config' },
    ],
  },
  {
    id: 'deployment', title: 'Vercel Deployment', icon: Server,
    items: [
      { id: 'dep-1', label: 'Project deployed from correct branch (main)', critical: true },
      { id: 'dep-2', label: 'Build passes with 0 errors (check Vercel dashboard)', critical: true },
      { id: 'dep-3', label: 'NODE_ENV=production confirmed in Vercel environment' },
      { id: 'dep-4', label: '/api/health returns 200 OK in production' },
      { id: 'dep-5', label: 'Edge middleware runs correctly (check Vercel → Functions → Middleware)' },
      { id: 'dep-6', label: 'No proxy.ts or conflicting middleware files in project root' },
      { id: 'dep-7', label: 'Build output: no TypeScript errors, no ESLint errors' },
      { id: 'dep-8', label: 'validateEnv() passes on cold start (check Vercel function logs)' },
    ],
  },
  {
    id: 'domain', title: 'Domain & DNS', icon: Globe,
    items: [
      { id: 'dom-1', label: 'Custom domain configured in Vercel project settings' },
      { id: 'dom-2', label: 'DNS records (A/CNAME) propagated' },
      { id: 'dom-3', label: 'SSL certificate issued and auto-renewing' },
      { id: 'dom-4', label: 'HTTPS redirect enforced (HTTP → HTTPS)' },
      { id: 'dom-5', label: 'Supabase allowed URLs updated with production domain', critical: true },
    ],
  },
  {
    id: 'functional', title: 'Functional Testing', icon: FileText,
    items: [
      { id: 'fn-1', label: 'Login with admin credentials works end-to-end', critical: true },
      { id: 'fn-2', label: 'Dashboard loads with correct KPI data' },
      { id: 'fn-3', label: 'Incident creation via AI generates a report' },
      { id: 'fn-4', label: 'Report generation API returns content' },
      { id: 'fn-5', label: 'AI Operations page: agent invocation works' },
      { id: 'fn-6', label: '/consultation form submits and confirms correctly' },
      { id: 'fn-7', label: 'Forgot password sends reset email' },
      { id: 'fn-8', label: '404 page renders branded not-found.tsx' },
      { id: 'fn-9', label: 'Settings → Environment tab shows correct env var statuses' },
      { id: 'fn-10', label: 'RBAC: create a viewer-role user and verify /incidents is inaccessible' },
      { id: 'fn-11', label: 'Audit log entries appear after actions (check Supabase audit_logs table)' },
    ],
  },
  {
    id: 'access', title: 'Access Control', icon: Users,
    items: [
      { id: 'acc-1', label: 'Admin user (director@veridianriskgroup.org) can access all routes' },
      { id: 'acc-2', label: 'Director role: blocked from /users write actions' },
      { id: 'acc-3', label: 'Analyst role: blocked from /users, /fleet write, /clients write' },
      { id: 'acc-4', label: 'Client role: only /dashboard, /reports (own), /notifications, /settings' },
      { id: 'acc-5', label: 'Viewer role: only /dashboard and /notifications' },
      { id: 'acc-6', label: 'Unauthorized access redirects to /dashboard?error=unauthorized' },
      { id: 'acc-7', label: 'Unauthenticated access redirects to /login?redirectTo=<path>' },
    ],
  },
];

// ── localStorage key ────────────────────────────────────────────
const STORAGE_KEY = 'vrp_deploy_checklist';

// ── Component ───────────────────────────────────────────────────
export default function DeploymentChecklist() {
  const [checked,   setChecked]   = useState<Set<string>>(new Set());
  const [expanded,  setExpanded]  = useState<Set<string>>(new Set(SECTIONS.map(s => s.id)));
  const [hydrated,  setHydrated]  = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setChecked(new Set(JSON.parse(saved)));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
    } catch {}
  }, [checked, hydrated]);

  const totalItems    = SECTIONS.reduce((s, sec) => s + sec.items.length, 0);
  const totalCritical = SECTIONS.reduce((s, sec) => s + sec.items.filter(i => i.critical).length, 0);
  const doneItems     = SECTIONS.reduce((s, sec) => s + sec.items.filter(i => checked.has(i.id)).length, 0);
  const doneCritical  = SECTIONS.reduce((s, sec) => s + sec.items.filter(i => i.critical && checked.has(i.id)).length, 0);
  const pct           = Math.round((doneItems / totalItems) * 100);
  const criticalDone  = doneCritical === totalCritical;

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSection(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function resetAll() {
    if (!confirm('Reset all checklist items?')) return;
    setChecked(new Set());
  }

  return (
    <div className="min-h-screen bg-[#04050A] text-[#EEF0F6] px-5 py-10 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <div className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#C9A84C]/55 mb-2">
          Veridian Risk Platform · Admin
        </div>
        <h1 className="text-[28px] font-black tracking-tight mb-2">Production Deployment Checklist</h1>
        <p className="text-[12px] text-[#EEF0F6]/40">
          Complete all critical items before going live. Progress is saved locally in your browser.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-10 border border-white/[0.07] bg-white/[0.02] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[22px] font-black text-[#EEF0F6]">{pct}%</span>
            <span className="text-[11px] text-[#EEF0F6]/40 ml-2">complete</span>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-[#EEF0F6]/50">
              {doneItems} / {totalItems} items
            </div>
            <div className={`text-[10px] font-semibold mt-0.5 ${criticalDone ? 'text-emerald-400' : 'text-amber-400'}`}>
              {criticalDone ? '✓ All critical items done' : `${doneCritical}/${totalCritical} critical items`}
            </div>
          </div>
        </div>
        <div className="h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C9A84C] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        {pct === 100 && (
          <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            All items complete — platform is production-ready.
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {SECTIONS.map(section => {
          const Icon        = section.icon;
          const isExpanded  = expanded.has(section.id);
          const sectionDone = section.items.filter(i => checked.has(i.id)).length;
          const sectionTotal= section.items.length;
          const allDone     = sectionDone === sectionTotal;

          return (
            <div key={section.id} className="border border-white/[0.07] bg-white/[0.02]">
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${allDone ? 'text-emerald-400' : 'text-[#C9A84C]/70'}`} />
                  <span className="text-[13px] font-semibold text-[#EEF0F6]/90">{section.title}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 border ${
                    allDone
                      ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/[0.08]'
                      : 'border-white/[0.1] text-[#EEF0F6]/40'
                  }`}>
                    {sectionDone}/{sectionTotal}
                  </span>
                </div>
                {isExpanded
                  ? <ChevronDown className="w-4 h-4 text-white/30" />
                  : <ChevronRight className="w-4 h-4 text-white/30" />
                }
              </button>

              {/* Items */}
              {isExpanded && (
                <div className="border-t border-white/[0.05] divide-y divide-white/[0.03]">
                  {section.items.map(item => {
                    const done = checked.has(item.id);
                    return (
                      <label
                        key={item.id}
                        className="flex items-start gap-3 px-5 py-3.5 cursor-pointer hover:bg-white/[0.015] transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => toggle(item.id)}
                          className="mt-0.5 flex-shrink-0"
                          aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {done
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            : <Circle className="w-4 h-4 text-white/20" />
                          }
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[12.5px] leading-snug ${done ? 'line-through text-[#EEF0F6]/30' : 'text-[#EEF0F6]/80'}`}>
                              {item.label}
                            </span>
                            {item.critical && !done && (
                              <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-amber-400 border border-amber-500/30 px-1.5 py-0.5 bg-amber-500/[0.07]">
                                Critical
                              </span>
                            )}
                          </div>
                          {item.detail && (
                            <p className="text-[10.5px] text-[#EEF0F6]/28 mt-0.5 leading-relaxed">
                              {item.detail}
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer actions */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={resetAll}
          className="text-[10.5px] text-[#EEF0F6]/25 hover:text-[#EEF0F6]/50 uppercase tracking-[0.1em] transition-colors"
        >
          Reset All
        </button>
        <p className="text-[10px] text-white/15">
          Progress saved to browser storage
        </p>
      </div>
    </div>
  );
}

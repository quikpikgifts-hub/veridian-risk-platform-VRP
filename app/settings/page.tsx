'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { mockAIAgents } from '@/lib/mock-data';
import { PLATFORM, FOUNDERS } from '@/lib/constants';
import { agentStatusConfig, cn } from '@/lib/utils';
import {
  User, Bell, Shield, Cpu, Lock, Building2, Key, Check,
  Eye, EyeOff, Save, RefreshCw, CheckCircle, AlertTriangle
} from 'lucide-react';

type Tab = 'profile' | 'notifications' | 'ai-agents' | 'security' | 'organization' | 'environment';

/* ── Environment status panel ───────────────────────────────── */
const ENV_VARS: { key: string; label: string; required: boolean; hint: string }[] = [
  { key: 'NEXT_PUBLIC_SUPABASE_URL',      label: 'Supabase Project URL',  required: true,  hint: 'Supabase → Settings → API → Project URL' },
  { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', label: 'Supabase Anon Key',     required: true,  hint: 'Supabase → Settings → API → anon/public key' },
  { key: 'SUPABASE_SERVICE_ROLE_KEY',     label: 'Supabase Service Role', required: false, hint: 'Supabase → Settings → API → service_role key' },
  { key: 'OPENAI_API_KEY',                label: 'OpenAI API Key',        required: true,  hint: 'platform.openai.com/api-keys' },
  { key: 'OPENAI_MODEL',                  label: 'OpenAI Model Override', required: false, hint: 'Default: gpt-4o' },
  { key: 'NEXT_PUBLIC_APP_URL',           label: 'App URL',               required: false, hint: 'e.g. https://veridianriskgroup.org' },
];

function EnvPanel() {
  const statuses = ENV_VARS.map(v => {
    const val = typeof window !== 'undefined' && v.key.startsWith('NEXT_PUBLIC_')
      ? (process.env[v.key] ?? '')
      : '';
    // For NEXT_PUBLIC_ vars we can check at runtime; server vars always show unknown client-side
    const isPublic  = v.key.startsWith('NEXT_PUBLIC_');
    const isSet     = isPublic ? Boolean(val && !val.includes('your-project') && val !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...') : null;
    return { ...v, isPublic, isSet };
  });

  return (
    <div className="space-y-3">
      <div className="p-3 bg-amber-500/[0.06] border border-amber-500/20 rounded-[3px] flex items-start gap-2.5">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-[10.5px] text-amber-300/70 leading-relaxed">
          Server-side variables (without <span className="font-mono">NEXT_PUBLIC_</span>) cannot be read in the browser.
          &quot;Unknown&quot; status is expected for those. Check your <span className="font-mono">.env.local</span> or Vercel dashboard.
        </p>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {statuses.map(v => (
          <div key={v.key} className="flex items-start gap-3 py-3">
            <div className="mt-0.5 flex-shrink-0">
              {v.isSet === null ? (
                <span className="w-2.5 h-2.5 rounded-full bg-white/20 inline-block" title="Server-only — cannot read in browser" />
              ) : v.isSet ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono text-white/80">{v.key}</span>
                {v.required && (
                  <span className="text-[8px] font-bold uppercase tracking-[1px] text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-[2px]">Required</span>
                )}
                {v.isSet === null && (
                  <span className="text-[8px] font-bold uppercase tracking-[1px] text-white/25 bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded-[2px]">Server-only</span>
                )}
              </div>
              <div className="text-[10px] text-white/32 mt-0.5">{v.hint}</div>
            </div>
            <div className="flex-shrink-0 text-[10px] font-semibold">
              {v.isSet === null ? (
                <span className="text-white/25">Unknown</span>
              ) : v.isSet ? (
                <span className="text-green-400">Configured</span>
              ) : (
                <span className="text-red-400">Missing</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-white/[0.03] border border-white/[0.06] rounded-[3px]">
        <div className="text-[9px] font-bold tracking-[2px] uppercase text-white/25 mb-2">Where to set these</div>
        <div className="space-y-1 text-[10.5px] text-white/42 leading-relaxed">
          <div><span className="font-semibold text-white/60">Local dev:</span> Add to <span className="font-mono text-amber-400/70">.env.local</span> at project root. Restart dev server after changes.</div>
          <div><span className="font-semibold text-white/60">Production:</span> Vercel → Project → Settings → Environment Variables → add each var for Production + Preview + Development.</div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ defaultOn = false, onChange }: { defaultOn?: boolean; onChange?: (v: boolean) => void }) {
  const [on, setOn] = useState(defaultOn);
  const toggle = () => { setOn(v => !v); onChange?.(!on); };
  return (
    <button
      onClick={toggle}
      className={cn('relative w-9 h-5 rounded-full transition-colors flex-shrink-0', on ? 'bg-amber-500' : 'bg-white/10')}
      aria-checked={on}
      role="switch"
    >
      <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all', on ? 'left-4' : 'left-0.5')} />
    </button>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
      <div className="flex-1 pr-6">
        <div className="text-[12px] font-medium text-white/80">{label}</div>
        {desc && <div className="text-[10.5px] text-white/35 mt-0.5 leading-relaxed">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="text-[9px] font-bold tracking-[3px] uppercase text-white/25 mb-3 pb-2 border-b border-white/[0.06]">
        {title}
      </div>
      {children}
    </div>
  );
}

function ApiKeyInput() {
  const [show, setShow] = useState(false);
  const [key,  setKey]  = useState('');
  const [status, setStatus] = useState<'idle' | 'saved' | 'testing' | 'ok' | 'error'>('idle');

  const save = () => {
    if (!key.startsWith('sk-')) { setStatus('error'); return; }
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 3000);
  };

  const test = async () => {
    setStatus('testing');
    try {
      const r = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'agt-01', task: 'Respond with: Connection verified.' }),
      });
      setStatus(r.ok ? 'ok' : 'error');
    } catch { setStatus('error'); }
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder="sk-proj-..."
          value={key}
          onChange={e => setKey(e.target.value)}
          className="w-full bg-black/30 border border-white/[0.08] text-white text-[12px] px-3 py-2.5 pr-9 rounded-[2px] focus:outline-none focus:border-amber-500/40 transition-colors placeholder:text-white/18 font-mono"
        />
        <button onClick={() => setShow(s => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
          {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
      <div className="flex gap-2 items-center">
        <Button variant="primary" size="sm" onClick={save} disabled={!key}>
          <Save className="w-3 h-3" />Save Key
        </Button>
        <Button variant="ghost" size="sm" onClick={test} disabled={status === 'testing'}>
          {status === 'testing' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Key className="w-3 h-3" />}
          Test Connection
        </Button>
        {status === 'saved' && <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Saved</span>}
        {status === 'ok'    && <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Connected</span>}
        {status === 'error' && <span className="text-[10px] text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Invalid key</span>}
      </div>
      <p className="text-[10px] text-white/22 leading-relaxed">
        For production: set <span className="font-mono text-amber-400/70">OPENAI_API_KEY</span> in Vercel → Settings → Environment Variables
      </p>
    </div>
  );
}

export default function SettingsPage() {
  const [tab,   setTab]   = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'profile',       label: 'Profile',       icon: User        },
    { key: 'notifications', label: 'Notifications', icon: Bell        },
    { key: 'ai-agents',     label: 'Modules',       icon: Cpu         },
    { key: 'security',      label: 'Security',      icon: Lock        },
    { key: 'organization',  label: 'Organization',  icon: Building2   },
    { key: 'environment',   label: 'Environment',   icon: Key         },
  ];

  return (
    <Sidebar>
      <div className="p-4 md:p-5 space-y-4 anim-fade-up">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[9px] font-bold tracking-[4px] uppercase text-amber-400/70 mb-1">Configuration</div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-white leading-tight">Settings</h1>
            <p className="text-[11px] text-white/35 mt-1">Platform preferences · API configuration · Agent management</p>
          </div>
          <Button variant="primary" size="md" onClick={save}>
            {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 overflow-x-auto border-b border-white/[0.06]">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-semibold border-b-2 transition-all whitespace-nowrap',
                t.key === tab
                  ? 'text-amber-400 border-amber-500'
                  : 'text-white/35 border-transparent hover:text-white/60 hover:border-white/20'
              )}
            >
              <t.icon className="w-3.5 h-3.5" />{t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-[#08090F] border border-white/[0.07] rounded-[3px] p-5">

          {/* Profile */}
          {tab === 'profile' && (
            <div className="max-w-xl space-y-5">
              <Section title="Account Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { l: 'Full Name',   v: FOUNDERS.steve.name,       r: false },
                    { l: 'Email',       v: FOUNDERS.steve.email,      r: false },
                    { l: 'Role',        v: 'Managing Member (50%)',    r: true  },
                    { l: 'Department',  v: 'Operations & Risk',        r: false },
                  ].map(f => (
                    <div key={f.l}>
                      <label className="block text-[9px] font-bold tracking-[2px] uppercase text-white/28 mb-1.5">{f.l}</label>
                      <input
                        defaultValue={f.v}
                        readOnly={f.r}
                        className="w-full bg-black/30 border border-white/[0.08] text-white text-[12px] px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-amber-500/40 transition-colors disabled:opacity-50"
                      />
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="Credentials & Experience">
                <div className="text-[11.5px] text-white/55 leading-relaxed space-y-1">
                  {FOUNDERS.steve.certs.map(c => (
                    <div key={c} className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-amber-400/60 flex-shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {/* Notifications */}
          {tab === 'notifications' && (
            <div className="max-w-xl">
              <Section title="Alert Preferences">
                <SettingRow label="Critical Incidents" desc="Immediate alert when a critical severity incident is logged">
                  <Toggle defaultOn />
                </SettingRow>
                <SettingRow label="AI Report Ready" desc="Notify when an AI agent completes a draft for review">
                  <Toggle defaultOn />
                </SettingRow>
                <SettingRow label="Client Review Due" desc="7-day advance notice before client assessment deadlines">
                  <Toggle defaultOn />
                </SettingRow>
                <SettingRow label="Fleet Violations" desc="Alert on new DOT compliance violations">
                  <Toggle defaultOn />
                </SettingRow>
                <SettingRow label="Workflow Failures" desc="Notify when an automated workflow fails">
                  <Toggle defaultOn />
                </SettingRow>
                <SettingRow label="Threat Intelligence" desc="New threat feed items matching client industries">
                  <Toggle />
                </SettingRow>
              </Section>
              <Section title="Delivery">
                <SettingRow label="In-Platform Notifications" desc="Show badge counts and notification center">
                  <Toggle defaultOn />
                </SettingRow>
                <SettingRow label="Email Digest" desc="Daily summary email at 7:00 AM">
                  <Toggle />
                </SettingRow>
              </Section>
            </div>
          )}

          {/* AI Agents */}
          {tab === 'ai-agents' && (
            <div className="space-y-4">
              <Section title="API Connection">
                <ApiKeyInput />
              </Section>
              <Section title="Module Status">
                <div className="space-y-0 divide-y divide-white/[0.04]">
                  {mockAIAgents.map(agent => {
                    const cfg = agentStatusConfig[agent.status];
                    return (
                      <div key={agent.id} className="flex items-center gap-3 py-3">
                        <span className={cn('w-2 h-2 rounded-full flex-shrink-0', cfg.pulse && 'pulse-dot')} style={{ background: cfg.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[11.5px] font-medium text-white/80">{agent.name}</div>
                          <div className="text-[9.5px] text-white/30">{agent.role}</div>
                        </div>
                        <span className="text-[10px] font-bold text-amber-400/70 font-mono">{agent.tasksToday} tasks</span>
                        <Toggle defaultOn={agent.status !== 'offline'} />
                      </div>
                    );
                  })}
                </div>
              </Section>
            </div>
          )}

          {/* Security */}
          {tab === 'security' && (
            <div className="max-w-xl">
              <Section title="Authentication">
                <SettingRow label="Two-Factor Authentication" desc="Require 2FA for all logins (recommended)">
                  <Toggle />
                </SettingRow>
                <SettingRow label="Session Timeout" desc="Auto-logout after 4 hours of inactivity">
                  <Toggle defaultOn />
                </SettingRow>
                <SettingRow label="Login Notifications" desc="Email alert on new sign-in from unrecognized device">
                  <Toggle defaultOn />
                </SettingRow>
              </Section>
              <Section title="Access Logs">
                <SettingRow label="Audit Log Retention" desc="Keep detailed access logs for 12 months">
                  <Toggle defaultOn />
                </SettingRow>
                <SettingRow label="Export Audit Logs" desc="Download CSV of all platform activity">
                  <Button variant="ghost" size="sm">Export CSV</Button>
                </SettingRow>
              </Section>
            </div>
          )}

          {/* Organization */}
          {tab === 'organization' && (
            <div className="max-w-xl space-y-5">
              <Section title="Company Profile">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { l: 'Company Name',   v: PLATFORM.company  },
                    { l: 'Phone',          v: PLATFORM.phone    },
                    { l: 'Email',          v: PLATFORM.email    },
                    { l: 'Website',        v: PLATFORM.website  },
                    { l: 'Location',       v: PLATFORM.location },
                    { l: 'Founded',        v: PLATFORM.founded  },
                  ].map(f => (
                    <div key={f.l}>
                      <label className="block text-[9px] font-bold tracking-[2px] uppercase text-white/28 mb-1.5">{f.l}</label>
                      <input
                        defaultValue={f.v}
                        className="w-full bg-black/30 border border-white/[0.08] text-white text-[12px] px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-amber-500/40 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="Co-Founders">
                {[FOUNDERS.steve, FOUNDERS.skeeter].map(f => (
                  <div key={f.name} className="p-3.5 bg-white/[0.025] border border-white/[0.06] rounded-[2px] mb-2 last:mb-0">
                    <div className="text-[12px] font-bold text-white/85 mb-0.5">{f.name}</div>
                    <div className="text-[10px] text-amber-400/70 mb-1">{f.equity} · {f.title}</div>
                    <div className="text-[10.5px] text-white/40">{f.experience}</div>
                  </div>
                ))}
              </Section>
              <Section title="Platform">
                <SettingRow label="Platform Version" desc={`Veridian Risk Platform v${PLATFORM.version}`}>
                  <span className="text-[10px] font-mono text-white/30">v{PLATFORM.version}</span>
                </SettingRow>
                <SettingRow label="Deployment" desc="Hosted on Vercel · Next.js 16 · GPT-4.1 · OpenAI">
                  <span className="text-[10px] text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />Live
                  </span>
                </SettingRow>
              </Section>
            </div>
          )}

          {/* Environment */}
          {tab === 'environment' && (
            <div className="max-w-2xl">
              <div className="text-[9px] font-bold tracking-[3px] uppercase text-white/25 mb-3 pb-2 border-b border-white/[0.06]">
                Environment Variable Status
              </div>
              <EnvPanel />
            </div>
          )}

        </div>
      </div>
    </Sidebar>
  );
}

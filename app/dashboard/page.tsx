'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { RecentIncidents } from '@/components/dashboard/RecentIncidents';
import { AIAgentPanel } from '@/components/dashboard/AIAgentPanel';
import { AlertFeed } from '@/components/dashboard/AlertFeed';
import { ClientTable } from '@/components/dashboard/ClientTable';
import {
  IncidentTrendChart, ThreatCategoryChart,
  RevenueChart, RiskByIndustryChart,
} from '@/components/charts/Charts';
import { mockWorkflows, mockReports, mockNotifications } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import {
  Zap, FileText, CheckCircle, Clock, ChevronRight,
  Play, RefreshCw, AlertCircle, Shield,
} from 'lucide-react';

/* ── Live clock ─────────────────────────────────────── */
function LiveClock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setTime(n.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(n.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="hidden lg:flex flex-col items-end">
      <span className="text-[17px] font-mono font-bold text-amber-400/85 leading-none tabular-nums">{time}</span>
      <span className="text-[9px] text-white/28 mt-0.5">{date}</span>
    </div>
  );
}

/* ── Daily briefing panel ───────────────────────────── */
function DailyBriefing() {
  const [output,  setOutput]  = useState('');
  const [loading, setLoading] = useState(false);
  const [ran,     setRan]     = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: 'agt-01',
          agentName: 'Operations Manager',
          task: 'Generate a concise 3-point daily operations briefing for Veridian Risk Group. Cover: (1) top priority action for Steve today, (2) any client items needing attention, (3) one field opportunity or business development note. Be direct and operational. No AI references.',
        }),
      });
      const d = await r.json();
      setOutput(d.output || d.content || 'Connected. No output returned — verify API key in Settings.');
      setRan(true);
    } catch {
      setOutput('Unable to generate briefing. Add OPENAI_API_KEY in Settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div>
          <div className="text-[11.5px] font-bold text-white/88">Daily Briefing</div>
          <div className="text-[9.5px] text-white/30 mt-0.5">Operations summary — generated on demand</div>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className={cn(
            'flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-[2px] transition-all',
            loading
              ? 'bg-white/[0.04] text-white/30 cursor-not-allowed'
              : ran
                ? 'border border-white/[0.1] text-white/40 hover:text-amber-400 hover:border-amber-500/30'
                : 'bg-amber-500 text-black hover:bg-amber-400',
          )}
        >
          {loading
            ? <><RefreshCw className="w-3 h-3 anim-spin" />Generating</>
            : ran
              ? <><RefreshCw className="w-3 h-3" />Refresh</>
              : <><Play className="w-3 h-3" />Generate</>
          }
        </button>
      </div>
      <div className="p-4 min-h-[80px]">
        {!ran && !loading && (
          <p className="text-[11px] text-white/22 text-center py-3">Click Generate to create today&apos;s briefing.</p>
        )}
        {loading && (
          <div className="flex items-center gap-2 text-white/30 text-[11px] py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 pulse-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 pulse-dot delay-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 pulse-dot delay-400" />
            <span className="ml-1">Processing...</span>
          </div>
        )}
        {output && !loading && (
          <p className="text-[12px] text-white/60 leading-[1.85] whitespace-pre-wrap">{output}</p>
        )}
      </div>
    </div>
  );
}

/* ── Operations feed ────────────────────────────────── */
function OpsFeed() {
  const FEED = [
    { c: '#22C55E', msg: 'Intake — New lead: Riverside Apartments, Sanford FL', t: 'Just now' },
    { c: '#C9A84C', msg: 'Risk — Draft report ready for review: Sunstate Restaurant OSHA audit', t: '14m' },
    { c: '#3B82F6', msg: 'Fleet — DOT compliance audit completed: FastRoute Logistics', t: '1h' },
    { c: '#F59E0B', msg: 'Follow-Up — 30-day check-in sent: Premier Gas Station', t: '3h' },
    { c: '#22C55E', msg: 'Proposal — Service proposal drafted: Lakeland Church', t: '5h' },
    { c: '#C9A84C', msg: 'Compliance — OSHA report finalized: Meridian Construction', t: '8h' },
  ];
  return (
    <div className="bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="text-[11.5px] font-bold text-white/88">Operations Feed</div>
        <span className="flex items-center gap-1.5 text-[8.5px] font-bold text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />LIVE
        </span>
      </div>
      <div className="divide-y divide-white/[0.038] max-h-[200px] overflow-y-auto scrollable">
        {FEED.map((f, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-2.5">
            <span className="w-1.5 h-1.5 rounded-full mt-[5px] flex-shrink-0" style={{ background: f.c }} />
            <span className="flex-1 text-[11px] text-white/52 leading-relaxed">{f.msg}</span>
            <span className="text-[9px] font-mono text-white/20 flex-shrink-0">{f.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Workflows strip ────────────────────────────────── */
function WorkflowStrip() {
  const active = mockWorkflows.filter(w => w.status === 'running').slice(0, 3);
  return (
    <div className="bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="text-[11.5px] font-bold text-white/88">Active Workflows</div>
        <a href="/workflows" className="flex items-center gap-1 text-[9.5px] text-amber-400/60 hover:text-amber-400 font-semibold transition-colors">
          View All <ChevronRight className="w-3 h-3" />
        </a>
      </div>
      <div className="p-3 space-y-2">
        {active.map(wf => (
          <div key={wf.id} className="flex items-center gap-3 p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-[2px]">
            <div className="w-7 h-7 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 rounded-[2px]">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-white/78 truncate">{wf.name}</div>
              <div className="text-[9px] text-white/28">{wf.assignedAgent}</div>
            </div>
            <span className="flex items-center gap-1 text-[8px] font-bold text-blue-400 bg-blue-500/8 border border-blue-500/18 px-1.5 py-0.5 rounded-[1px]">
              <span className="w-1 h-1 rounded-full bg-blue-400 pulse-dot" />ACTIVE
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Reports strip ──────────────────────────────────── */
function ReportsStrip() {
  const recent = mockReports.slice(0, 4);
  return (
    <div className="bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="text-[11.5px] font-bold text-white/88">Recent Reports</div>
        <a href="/reports" className="flex items-center gap-1 text-[9.5px] text-amber-400/60 hover:text-amber-400 font-semibold transition-colors">
          View All <ChevronRight className="w-3 h-3" />
        </a>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {recent.map(r => (
          <div key={r.id} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
            <div className="w-7 h-7 bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 rounded-[2px]">
              <FileText className="w-3.5 h-3.5 text-white/25" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-white/70 truncate">{r.title}</div>
              <div className="text-[9px] text-white/25">{r.clientName || 'Internal'}</div>
            </div>
            {r.status === 'delivered'
              ? <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              : <Clock className="w-3.5 h-3.5 text-amber-400/50 flex-shrink-0" />
            }
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Alert banner ───────────────────────────────────── */
function AlertBanner() {
  const critical = mockNotifications.filter(n => !n.read && (n.priority === 'critical' || n.priority === 'high'));
  if (!critical.length) return null;
  const n = critical[0];
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-red-500/[0.06] border border-red-500/18 rounded-[3px] anim-slide-down">
      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
      <span className="text-[11.5px] text-red-300/75 flex-1 min-w-0 truncate">
        <strong className="font-semibold">{n.title}</strong> — {n.message}
      </span>
      <a href="/notifications" className="text-[10px] font-semibold text-red-400/80 hover:text-red-300 whitespace-nowrap transition-colors flex-shrink-0">
        Review →
      </a>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */
export default function DashboardPage() {
  return (
    <Sidebar>
      <div className="p-4 md:p-5 lg:p-6 space-y-4 anim-fade-up">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400/60" />
              <span className="text-[9px] font-bold tracking-[0.28em] uppercase text-amber-400/60">Command Center</span>
            </div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-white leading-tight tracking-tight">
              Operations Dashboard
            </h1>
            <p className="text-[11px] text-white/28 mt-1">Veridian Risk &amp; Resilience Group, LLC</p>
          </div>
          <LiveClock />
        </div>

        <AlertBanner />

        {/* KPI row */}
        <KpiCards />

        {/* Charts R1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2"><IncidentTrendChart /></div>
          <ThreatCategoryChart />
        </div>

        {/* Charts R2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RevenueChart />
          <RiskByIndustryChart />
        </div>

        {/* Daily briefing + ops feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DailyBriefing />
          <OpsFeed />
        </div>

        {/* Incidents + alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RecentIncidents />
          <AlertFeed />
        </div>

        {/* Agent status + workflows + reports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AIAgentPanel />
          <WorkflowStrip />
          <ReportsStrip />
        </div>

        {/* Client table */}
        <ClientTable />

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 py-2 border-t border-white/[0.04]">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[9.5px] text-white/18">All systems operational · Veridian Risk Platform · {new Date().getFullYear()}</span>
        </div>

      </div>
    </Sidebar>
  );
}

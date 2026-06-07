'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { RecentIncidents } from '@/components/dashboard/RecentIncidents';
import { AIAgentPanel } from '@/components/dashboard/AIAgentPanel';
import { AlertFeed } from '@/components/dashboard/AlertFeed';
import { ClientTable } from '@/components/dashboard/ClientTable';
import { IncidentTrendChart, ThreatCategoryChart, RevenueChart, RiskByIndustryChart } from '@/components/charts/Charts';
import { mockWorkflows, mockReports, mockNotifications } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Route, FileText, CheckCircle, Clock, ChevronRight, Play, RefreshCw, AlertCircle, Shield, Radio, UserCheck } from 'lucide-react';

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
  return <div className="hidden lg:flex flex-col items-end"><span className="text-[17px] font-mono font-bold text-blue-400 leading-none tabular-nums">{time}</span><span className="text-[9px] text-white/36 mt-0.5">{date}</span></div>;
}

function ExecutiveBriefing() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ran, setRan] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: 'agt-01',
          agentName: 'Operations Intelligence',
          task: 'Generate a concise 3-point executive operations briefing for ShieldSync Protect. Cover: (1) top priority action today, (2) active site or officer item needing supervisor attention, (3) recommended action for client communication. Use operational intelligence language. Do not reference AI.',
        }),
      });
      const d = await r.json();
      setOutput(d.output || d.content || 'Connected. No output returned. Verify API configuration in Settings.');
      setRan(true);
    } catch {
      setOutput('Unable to generate briefing. Add OPENAI_API_KEY in Settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#171717] border border-[#262626] rounded-[5px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626]">
        <div><div className="text-[11.5px] font-bold text-white/92">Executive Briefing</div><div className="text-[9.5px] text-white/36 mt-0.5">Operational intelligence summary</div></div>
        <button onClick={run} disabled={loading} className={cn('flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-[3px] transition-colors', loading ? 'bg-white/[0.05] text-white/35 cursor-not-allowed' : ran ? 'border border-[#262626] text-white/50 hover:text-blue-300 hover:border-blue-500/35' : 'bg-blue-500 text-white hover:bg-blue-400')}>
          {loading ? <><RefreshCw className="w-3 h-3 anim-spin" />Generating</> : ran ? <><RefreshCw className="w-3 h-3" />Refresh</> : <><Play className="w-3 h-3" />Generate</>}
        </button>
      </div>
      <div className="p-4 min-h-[88px]">
        {!ran && !loading && <p className="text-[11px] text-white/30 text-center py-3">Generate today&apos;s executive-ready operations briefing.</p>}
        {loading && <div className="flex items-center gap-2 text-white/38 text-[11px] py-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 pulse-dot" /><span className="w-1.5 h-1.5 rounded-full bg-blue-400 pulse-dot delay-200" /><span className="w-1.5 h-1.5 rounded-full bg-blue-400 pulse-dot delay-400" /><span className="ml-1">Processing</span></div>}
        {output && !loading && <p className="text-[12px] text-white/66 leading-[1.85] whitespace-pre-wrap">{output}</p>}
      </div>
    </div>
  );
}

function OperationsFeed() {
  const FEED = [
    { c: '#EF4444', msg: 'Critical alert - NorthBridge Dock Gate 3 escalation open', t: 'Now' },
    { c: '#22C55E', msg: 'Officer check-ins - 96% complete across active posts', t: '8m' },
    { c: '#3B82F6', msg: 'Patrol route - Zone 4 reassigned to Patrol Unit 07', t: '18m' },
    { c: '#F59E0B', msg: 'Supervisor review - Cedar Grove visitor script pending approval', t: '42m' },
    { c: '#3B82F6', msg: 'Risk detection - logistics tailgating pattern matched', t: '1h' },
    { c: '#22C55E', msg: 'Report delivered - Fleet readiness review archived', t: '3h' },
  ];
  return (
    <div className="bg-[#171717] border border-[#262626] rounded-[5px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626]"><div className="text-[11.5px] font-bold text-white/92">Active Operations</div><span className="flex items-center gap-1.5 text-[8.5px] font-bold text-green-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />LIVE</span></div>
      <div className="divide-y divide-white/[0.04] max-h-[220px] overflow-y-auto scrollable">
        {FEED.map((f, i) => <div key={i} className="flex items-start gap-3 px-4 py-2.5"><span className="w-1.5 h-1.5 rounded-full mt-[5px] flex-shrink-0" style={{ background: f.c }} /><span className="flex-1 text-[11px] text-white/60 leading-relaxed">{f.msg}</span><span className="text-[9px] font-mono text-white/28 flex-shrink-0">{f.t}</span></div>)}
      </div>
    </div>
  );
}

function WorkflowStrip() {
  const active = mockWorkflows.filter(w => w.status === 'running').slice(0, 3);
  return (
    <div className="bg-[#171717] border border-[#262626] rounded-[5px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626]"><div className="text-[11.5px] font-bold text-white/92">Patrol and Response Workflows</div><a href="/workflows" className="flex items-center gap-1 text-[9.5px] text-blue-400/75 hover:text-blue-300 font-semibold transition-colors">View All <ChevronRight className="w-3 h-3" /></a></div>
      <div className="p-3 space-y-2">
        {active.map(wf => <div key={wf.id} className="flex items-center gap-3 p-2.5 bg-white/[0.025] border border-[#262626] rounded-[3px]"><div className="w-7 h-7 bg-blue-500/10 border border-blue-500/25 flex items-center justify-center flex-shrink-0 rounded-[3px]"><Route className="w-3.5 h-3.5 text-blue-400" /></div><div className="flex-1 min-w-0"><div className="text-[11px] font-semibold text-white/82 truncate">{wf.name}</div><div className="text-[9px] text-white/34">{wf.assignedAgent}</div></div><span className="flex items-center gap-1 text-[8px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/25 px-1.5 py-0.5 rounded-[2px]"><span className="w-1 h-1 rounded-full bg-blue-400 pulse-dot" />ACTIVE</span></div>)}
      </div>
    </div>
  );
}

function ReportsStrip() {
  const recent = mockReports.slice(0, 4);
  return (
    <div className="bg-[#171717] border border-[#262626] rounded-[5px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626]"><div className="text-[11.5px] font-bold text-white/92">Reports and Briefings</div><a href="/reports" className="flex items-center gap-1 text-[9.5px] text-blue-400/75 hover:text-blue-300 font-semibold transition-colors">View All <ChevronRight className="w-3 h-3" /></a></div>
      <div className="divide-y divide-white/[0.04]">
        {recent.map(r => <div key={r.id} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/[0.025] transition-colors"><div className="w-7 h-7 bg-white/[0.035] border border-[#262626] flex items-center justify-center flex-shrink-0 rounded-[3px]"><FileText className="w-3.5 h-3.5 text-white/32" /></div><div className="flex-1 min-w-0"><div className="text-[11px] font-medium text-white/74 truncate">{r.title}</div><div className="text-[9px] text-white/30">{r.clientName || 'Internal Operations'}</div></div>{r.status === 'delivered' ? <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> : <Clock className="w-3.5 h-3.5 text-blue-400/65 flex-shrink-0" />}</div>)}
      </div>
    </div>
  );
}

function AlertBanner() {
  const critical = mockNotifications.filter(n => !n.read && (n.priority === 'critical' || n.priority === 'high'));
  if (!critical.length) return null;
  const n = critical[0];
  return <div className="flex items-center gap-3 px-4 py-2.5 bg-red-500/[0.08] border border-red-500/28 rounded-[5px] anim-slide-down"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" /><span className="text-[11.5px] text-red-100/82 flex-1 min-w-0 truncate"><strong className="font-semibold">{n.title}</strong> - {n.message}</span><a href="/notifications" className="text-[10px] font-semibold text-red-300 hover:text-white whitespace-nowrap transition-colors flex-shrink-0">Review</a></div>;
}

function OfficerActivity() {
  const rows = [
    ['Dana Mitchell', 'Command review', 'Online'],
    ['Elena Brooks', 'North District supervision', 'Active'],
    ['Jordan Patel', 'Zone 4 mobile patrol', 'Active'],
    ['Marcus Lee', 'Fleet readiness', 'Review'],
  ];
  return <div className="bg-[#171717] border border-[#262626] rounded-[5px] overflow-hidden"><div className="flex items-center gap-2 px-4 py-3 border-b border-[#262626]"><UserCheck className="w-3.5 h-3.5 text-blue-400" /><div><div className="text-[11.5px] font-bold text-white/92">Officer Activity</div><div className="text-[9.5px] text-white/36">Supervisor and patrol status</div></div></div><div className="divide-y divide-white/[0.04]">{rows.map(([name, role, status]) => <div key={name} className="flex items-center gap-3 px-4 py-2.5"><span className="w-2 h-2 rounded-full bg-green-400" /><div className="flex-1 min-w-0"><div className="text-[11px] text-white/78 font-semibold truncate">{name}</div><div className="text-[9px] text-white/32 truncate">{role}</div></div><span className="text-[9px] text-white/42 uppercase tracking-[0.12em]">{status}</span></div>)}</div></div>;
}

export default function DashboardPage() {
  return (
    <Sidebar>
      <div className="p-4 md:p-5 lg:p-6 space-y-4 anim-fade-up">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1.5"><Shield className="w-3.5 h-3.5 text-blue-400/75" /><span className="text-[9px] font-bold tracking-[0.24em] uppercase text-blue-400/75">Operational Command Center</span></div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-white leading-tight tracking-tight">ShieldSync Protect</h1>
            <p className="text-[11px] text-white/38 mt-1">Contract Security Services | Enterprise Demonstration Tenant</p>
          </div>
          <LiveClock />
        </div>

        <AlertBanner />
        <KpiCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><OperationsFeed /></div>
          <OfficerActivity />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RecentIncidents />
          <AlertFeed />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ExecutiveBriefing />
          <AIAgentPanel />
          <WorkflowStrip />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2"><IncidentTrendChart /></div>
          <ThreatCategoryChart />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><RevenueChart /><RiskByIndustryChart /></div>
        <ReportsStrip />
        <ClientTable />

        <div className="flex items-center justify-center gap-2 py-2 border-t border-[#262626]"><Radio className="w-3.5 h-3.5 text-green-400" /><span className="text-[9.5px] text-white/24">All systems operational | ShieldSync Enterprise Platform | {new Date().getFullYear()}</span></div>
      </div>
    </Sidebar>
  );
}

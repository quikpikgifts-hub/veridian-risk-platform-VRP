'use client';

import { useState, useCallback } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { AIOutputBox } from '@/components/shared/AIOutputBox';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AgentTasksChart } from '@/components/charts/Charts';
import { mockAIAgents } from '@/lib/mock-data';
import { agentStatusConfig, cn } from '@/lib/utils';
import type { AIAgent } from '@/types';
import {
  Brain, Play, RefreshCw, Zap, Users, CheckCircle,
  TrendingUp, Cpu, Shield, Truck, BarChart3, MessageSquare,
} from 'lucide-react';

/* Agent default tasks */
const DEFAULT_TASKS: Record<string, string> = {
  'agt-01': 'Generate a concise daily operations briefing for Veridian Risk Group. Cover active incidents, pending client reviews, agent status, and Steve\'s top priority for today.',
  'agt-02': 'Create a professional intake questionnaire for a new restaurant client lead in Sanford, FL who needs a risk walk assessment and OSHA compliance review.',
  'agt-03': 'Draft a risk assessment report for a gas station with the following observations: no wet floor signage at fuel pumps, lone worker after 10pm, camera blind spot at dumpster area, expired fire extinguisher near register.',
  'agt-04': 'Provide a situational awareness brief for the US-17/92 commercial corridor in Sanford, FL. Focus on retail crime trends, threat patterns relevant to gas stations and auto shops.',
  'agt-05': 'Write a professional service proposal for Palmetto Apartments (180 units, Orlando FL). Propose a Risk Walk Assessment + Emergency Action Plan + De-Escalation Workshop package.',
  'agt-06': 'Draft 30-day and 60-day follow-up emails for Premier Gas Station after their risk walk assessment. Reference the camera gap and wet floor findings we documented.',
  'agt-07': 'Write a LinkedIn post from Steve Smith about a real-world de-escalation situation he handled during his 30-year law enforcement career and how it applies to businesses today.',
  'agt-08': 'Generate a fleet safety assessment for a 12-vehicle delivery fleet in Central Florida. Cover DOT compliance gaps, pre-trip inspection system, driver qualification files.',
  'agt-09': 'Draft an HR risk advisory plan for a restaurant with 14 employees and no written termination procedure or harassment policy. Focus on Florida employer liability.',
  'agt-10': 'Generate an OSHA 29 CFR 1910 compliance audit for an auto tire shop. List the top 5 most common violations found in this industry type with correction priorities.',
  'agt-11': 'Create a de-escalation awareness workshop plan for a convenience store with 8 staff members that recently had two customer confrontations. Include session outline and written protocol structure.',
};

const DIVISION_STYLES: Record<string, { color:string; bg:string; border:string; icon:React.ElementType }> = {
  ops:       { color:'text-blue-400',   bg:'bg-blue-500/10',   border:'border-blue-500/25',   icon:BarChart3   },
  risk:      { color:'text-red-400',    bg:'bg-red-500/10',    border:'border-red-500/25',    icon:Shield      },
  fleet:     { color:'text-orange-400', bg:'bg-orange-500/10', border:'border-orange-500/25', icon:Truck       },
  hr:        { color:'text-purple-400', bg:'bg-purple-500/10', border:'border-purple-500/25', icon:Users       },
  intel:     { color:'text-cyan-400',   bg:'bg-cyan-500/10',   border:'border-cyan-500/25',   icon:Brain       },
  marketing: { color:'text-green-400',  bg:'bg-green-500/10',  border:'border-green-500/25',  icon:MessageSquare },
};

function AgentCard({ agent, selected, onSelect }: { agent:AIAgent; selected:boolean; onSelect:()=>void }) {
  const sc  = agentStatusConfig[agent.status];
  const div = agent.division ? DIVISION_STYLES[agent.division] : DIVISION_STYLES.ops;
  const DivIcon = div.icon;

  return (
    <div
      onClick={onSelect}
      className={cn(
        'p-3.5 rounded-[4px] border cursor-pointer transition-all duration-200 group',
        selected
          ? 'bg-amber-500/[0.08] border-amber-500/38 shadow-[0_0_20px_rgba(201,168,76,0.06)]'
          : 'bg-[#0C0D18] border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.025]',
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <span
            className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-1', sc.pulse && 'pulse-dot')}
            style={{ background: sc.color }}
          />
          <div className="min-w-0">
            <div className="text-[12px] font-bold text-white/88 leading-tight truncate group-hover:text-white transition-colors">
              {agent.name}
            </div>
            <div className="text-[9.5px] text-white/32 mt-0.5">{agent.role}</div>
          </div>
        </div>
        {agent.division && (
          <span className={cn('flex items-center gap-1 text-[8px] font-bold uppercase tracking-[1px] px-1.5 py-[3px] rounded-[2px] border flex-shrink-0', div.color, div.bg, div.border)}>
            <DivIcon className="w-2.5 h-2.5" />{agent.division}
          </span>
        )}
      </div>

      <div className="text-[9.5px] text-white/28 line-clamp-2 mb-2.5 leading-relaxed">{agent.lastAction}</div>

      <div className="grid grid-cols-3 gap-1.5">
        {[
          { v: agent.tasksToday, l:'Tasks',   c:'text-amber-400'  },
          { v:`${agent.successRate}%`, l:'Success', c:'text-green-400'  },
          { v: agent.avgResponseTime, l:'Avg RT',  c:'text-blue-400'   },
        ].map(s => (
          <div key={s.l} className="text-center py-1.5 bg-black/25 rounded-[2px]">
            <div className={cn('text-[12px] font-bold font-mono leading-none', s.c)}>{s.v}</div>
            <div className="text-[7.5px] text-white/22 uppercase tracking-wide mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AIOperationsPage() {
  const [selected, setSelected] = useState<AIAgent>(mockAIAgents[0]);
  const [task,    setTask]    = useState(DEFAULT_TASKS[mockAIAgents[0].id] || '');
  const [ctx,     setCtx]     = useState('');
  const [output,  setOutput]  = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const totals = {
    active:  mockAIAgents.filter(a=>a.status==='active').length,
    tasks:   mockAIAgents.reduce((s,a)=>s+a.tasksToday,0),
    success: Math.round(mockAIAgents.reduce((s,a)=>s+(a.successRate||0),0)/mockAIAgents.length),
  };

  const selectAgent = useCallback((agent:AIAgent) => {
    setSelected(agent);
    setTask(DEFAULT_TASKS[agent.id] || '');
    setOutput(''); setError('');
  }, []);

  const run = async () => {
    if (!task.trim()) return;
    setLoading(true); setOutput(''); setError('');
    try {
      const r = await fetch('/api/ai-agent', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ agent:selected.id, agentName:selected.name, task, context:ctx }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Agent failed');
      setOutput(d.output || d.content || '');
    } catch(e:unknown) {
      setError(e instanceof Error ? e.message : 'Connection error — check API key in Settings');
    } finally { setLoading(false); }
  };

  return (
    <Sidebar>
      <div className="p-4 md:p-5 space-y-4 anim-fade-up">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[9px] font-bold tracking-[4px] uppercase text-amber-400/65 mb-1">Operations</div>
            <h1 className="text-[24px] md:text-[28px] font-bold text-white leading-tight">Workforce Operations</h1>
            <p className="text-[11px] text-white/30 mt-1">Operational consulting modules · All divisions active</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/8 border border-emerald-500/18 px-2.5 py-1.5 rounded-[3px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              {totals.active} Active
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-400 bg-amber-500/8 border border-amber-500/18 px-2.5 py-1.5 rounded-[3px]">
              <CheckCircle className="w-3 h-3" />{totals.tasks} Tasks Today
            </div>
          </div>
        </div>

        {/* Stat bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l:'Active Agents',    v:totals.active,      c:'text-emerald-400', i:<Brain className="w-3.5 h-3.5"/>       },
            { l:'Tasks Today',      v:totals.tasks,       c:'text-amber-400',  i:<CheckCircle className="w-3.5 h-3.5"/>  },
            { l:'Avg Success Rate', v:`${totals.success}%`,c:'text-blue-400',  i:<TrendingUp className="w-3.5 h-3.5"/>   },
            { l:'System',   v:'Active',         c:'text-purple-400', i:<Cpu className="w-3.5 h-3.5"/>          },
          ].map((s,i) => (
            <div key={i} className="bg-[#08090F] border border-white/[0.07] p-3.5 rounded-[4px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-bold tracking-[2.5px] uppercase text-white/25">{s.l}</span>
                <span className="text-white/15">{s.i}</span>
              </div>
              <div className={cn('text-[22px] font-bold font-mono leading-none', s.c)}>{s.v}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Agent grid */}
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-[#08090F] border border-white/[0.07] border-t-2 border-t-amber-500 rounded-[4px] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <div className="text-[12px] font-bold text-white/90">Consulting Modules</div>
                <div className="text-[10px] text-white/28 mt-0.5">Select a module to generate a document or report</div>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {mockAIAgents.map(agent => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    selected={selected.id === agent.id}
                    onSelect={() => selectAgent(agent)}
                  />
                ))}
              </div>
            </div>
            <AgentTasksChart />
          </div>

          {/* Task panel */}
          <div className="space-y-4">
            <div className="bg-[#08090F] border border-white/[0.07] border-t-2 border-t-amber-500 rounded-[4px] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <div className="text-[12px] font-bold text-white/90">{selected.name}</div>
                <div className="text-[10px] text-white/28 mt-0.5">{selected.role}</div>
              </div>

              <div className="p-4 space-y-3.5">
                {/* Status row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={selected.status === 'active' ? 'active' : selected.status === 'processing' ? 'processing' : 'standby'} label={selected.status} dot />
                  {selected.capabilities?.slice(0,3).map(c => (
                    <span key={c} className="text-[8px] text-white/28 bg-white/[0.04] border border-white/[0.07] px-1.5 py-0.5 rounded-[2px]">{c}</span>
                  ))}
                </div>

                {/* Task field */}
                <div>
                  <label className="block text-[8.5px] font-bold tracking-[2px] uppercase text-white/28 mb-1.5">Task Instructions</label>
                  <textarea
                    value={task}
                    onChange={e => setTask(e.target.value)}
                    rows={6}
                    placeholder="Describe the task for this agent..."
                    className="w-full bg-black/32 border border-white/[0.08] text-white/85 text-[12px] p-3 rounded-[3px] resize-none input focus:outline-none placeholder:text-white/16 leading-relaxed"
                  />
                </div>

                {/* Context field */}
                <div>
                  <label className="block text-[8.5px] font-bold tracking-[2px] uppercase text-white/28 mb-1.5">Context (Optional)</label>
                  <textarea
                    value={ctx}
                    onChange={e => setCtx(e.target.value)}
                    rows={2}
                    placeholder="Client name, field notes, incident details..."
                    className="w-full bg-black/32 border border-white/[0.08] text-white/85 text-[12px] p-3 rounded-[3px] resize-none input focus:outline-none placeholder:text-white/16"
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="primary" size="md" onClick={run} disabled={loading || !task.trim()} className="flex-1">
                    {loading ? <RefreshCw className="w-3.5 h-3.5 anim-spin" /> : <Play className="w-3.5 h-3.5" />}
                    {loading ? 'Processing...' : 'Generate'}
                  </Button>
                  <Button variant="ghost" size="md" onClick={() => { setOutput(''); setError(''); setTask(DEFAULT_TASKS[selected.id]||''); }}>
                    Reset
                  </Button>
                </div>

                {error && (
                  <div className="text-[11px] text-red-400 bg-red-500/8 border border-red-500/22 p-3 rounded-[3px] leading-relaxed">{error}</div>
                )}

                <AIOutputBox output={output} loading={loading} label={`${selected.name} — Output`} maxHeight="max-h-72" />
              </div>
            </div>

            {/* Capabilities */}
            {selected.capabilities && selected.capabilities.length > 0 && (
              <div className="bg-[#08090F] border border-white/[0.07] p-4 rounded-[4px]">
                <div className="text-[9px] font-bold tracking-[2px] uppercase text-white/28 mb-2.5">Agent Capabilities</div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.capabilities.map(c => (
                    <span key={c} className="flex items-center gap-1 text-[9px] text-amber-400/65 bg-amber-500/7 border border-amber-500/15 px-2 py-1 rounded-[2px]">
                      <Zap className="w-2.5 h-2.5" />{c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Authority notice */}
            <div className="bg-[#08090F] border border-amber-500/18 border-l-2 border-l-amber-500 p-3.5 rounded-[4px]">
              <div className="flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-[2px] text-amber-400 mb-2">
                <Users className="w-3 h-3" />Review Protocol
              </div>
              <p className="text-[10.5px] text-amber-100/42 leading-relaxed">
                All outputs are drafts requiring Co-Founder review before client delivery. Steve Washington Smith approves all deliverables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

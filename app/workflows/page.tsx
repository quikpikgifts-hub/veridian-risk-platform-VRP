'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockWorkflows } from '@/lib/mock-data';
import { workflowStatusConfig, timeAgo } from '@/lib/utils';
import { Zap, Play, Pause, RotateCcw, CheckCircle, Clock, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import type { WorkflowStep } from '@/types';

function StepBadge({ step }: { step: WorkflowStep }) {
  const cfg = {
    done:    { icon:<CheckCircle className="w-3 h-3 text-green-400"/>,  bar:'bg-green-500' },
    active:  { icon:<span className="w-3 h-3 rounded-full bg-blue-400 pulse-dot"/>, bar:'bg-blue-500' },
    pending: { icon:<Clock className="w-3 h-3 text-white/25"/>,        bar:'bg-white/10' },
    failed:  { icon:<span className="w-3 h-3 rounded-full bg-red-500"/>, bar:'bg-red-500' },
    skipped: { icon:<span className="w-3 h-3 rounded-full bg-white/15"/>,bar:'bg-white/15'},
  }[step.status] || { icon:null, bar:'bg-white/10' };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-shrink-0">{cfg.icon}</div>
      <div className="flex-1">
        <div className="text-[11px] font-medium text-white/70">{step.name}</div>
        <div className="text-[9px] text-white/28 capitalize">{step.type.replace('-', ' ')}{step.duration ? ` · ${step.duration}` : ''}</div>
      </div>
    </div>
  );
}

export default function WorkflowsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const stats = {
    running:   mockWorkflows.filter(w => w.status === 'running').length,
    completed: mockWorkflows.filter(w => w.status === 'completed').length,
    paused:    mockWorkflows.filter(w => w.status === 'paused').length,
    totalRuns: mockWorkflows.reduce((s, w) => s + w.runsTotal, 0),
  };

  return (
    <Sidebar>
      <div className="p-4 md:p-5 space-y-4 anim-fade-up">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[9px] font-bold tracking-[4px] uppercase text-amber-400/70 mb-1">Automation Engine</div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-white">Workflow Engine</h1>
            <p className="text-[11px] text-white/35 mt-1">AI-powered automation · 5 active workflows · {stats.totalRuns} total runs</p>
          </div>
          <Button variant="primary" size="md">
            <Plus className="w-3.5 h-3.5"/>New Workflow
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l:'Running',   v:stats.running,   c:'text-blue-400'   },
            { l:'Completed', v:stats.completed, c:'text-green-400'  },
            { l:'Paused',    v:stats.paused,    c:'text-orange-400' },
            { l:'Total Runs',v:stats.totalRuns, c:'text-amber-400'  },
          ].map((s,i) => (
            <div key={i} className="bg-[#08090F] border border-white/[0.07] p-3.5 rounded-[3px]">
              <div className="text-[8px] font-bold tracking-[2.5px] uppercase text-white/25 mb-2">{s.l}</div>
              <div className={`text-[28px] font-bold font-mono ${s.c}`}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Workflows */}
        <div className="space-y-2.5">
          {mockWorkflows.map(wf => {
            const cfg = workflowStatusConfig[wf.status];
            const isExp = expanded === wf.id;
            const completedSteps = wf.steps.filter(s => s.status === 'done').length;
            const progress = Math.round(completedSteps / wf.steps.length * 100);

            return (
              <div key={wf.id} className="bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpanded(isExp ? null : wf.id)}>
                  <div className="w-9 h-9 rounded-[2px] bg-blue-500/10 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-blue-400"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-[13px] font-bold text-white/88">{wf.name}</span>
                      <span className="text-[9px] font-mono text-white/25">{wf.id}</span>
                    </div>
                    <div className="text-[10px] text-white/32 flex items-center gap-3 flex-wrap">
                      <span>{wf.description.substring(0,60)}…</span>
                      {wf.lastRun && <span>Last: {timeAgo(wf.lastRun)}</span>}
                    </div>
                    <div className="mt-1.5 h-1 bg-white/[0.06] rounded-full overflow-hidden w-32">
                      <div className="h-full rounded-full transition-all" style={{width:`${progress}%`, background: cfg.color}}/>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-[13px] font-bold text-amber-400 font-mono">{wf.successRate}%</div>
                      <div className="text-[8.5px] text-white/25">{wf.runsTotal} runs</div>
                    </div>
                    <Badge variant={wf.status as 'active'} label={cfg.label}/>
                    {isExp ? <ChevronDown className="w-4 h-4 text-white/25"/> : <ChevronRight className="w-4 h-4 text-white/25"/>}
                  </div>
                </div>

                {/* Expanded */}
                {isExp && (
                  <div className="border-t border-white/[0.06] p-4 anim-slide-down">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Steps */}
                      <div>
                        <div className="text-[10px] font-bold text-white/35 uppercase tracking-[2px] mb-3">Workflow Steps</div>
                        <div className="relative space-y-0">
                          {wf.steps.map((step, i) => (
                            <div key={step.id} className="flex items-start gap-3 pb-3 relative">
                              {i < wf.steps.length - 1 && (
                                <div className="absolute left-[5px] top-4 bottom-0 w-[1px] bg-white/[0.07]"/>
                              )}
                              <StepBadge step={step}/>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Metadata */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            ['Trigger',     wf.trigger],
                            ['Assigned Agent', wf.assignedAgent || '—'],
                            ['Created',     wf.createdAt],
                            ['Next Run',    wf.nextRun || '—'],
                          ].map(([l,v]) => (
                            <div key={l} className="p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-[2px]">
                              <div className="text-[8.5px] font-bold text-white/25 uppercase tracking-[1.5px] mb-0.5">{l}</div>
                              <div className="text-[11px] text-white/60 capitalize">{v}</div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {wf.status === 'running' && (
                            <Button variant="ghost" size="sm">
                              <Pause className="w-3 h-3"/>Pause
                            </Button>
                          )}
                          {wf.status === 'paused' && (
                            <Button variant="primary" size="sm">
                              <Play className="w-3 h-3"/>Resume
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <RotateCcw className="w-3 h-3"/>Run Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Sidebar>
  );
}

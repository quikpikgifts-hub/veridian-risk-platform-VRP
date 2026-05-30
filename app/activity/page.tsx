'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { mockAuditLog, mockIncidents, mockAIAgents } from '@/lib/mock-data';
import { timeAgo, cn } from '@/lib/utils';
import {
  Activity, Shield, Cpu, Truck, FileText, Users,
  CheckCircle, AlertTriangle, Eye, Edit3, Plus, Trash2
} from 'lucide-react';

const ACTION_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  CREATE: { icon: Plus,          color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/25'   },
  UPDATE: { icon: Edit3,         color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/25'     },
  DELETE: { icon: Trash2,        color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/25'       },
  VIEW:   { icon: Eye,           color: 'text-white/40',   bg: 'bg-white/[0.05] border-white/[0.1]'   },
  LOGIN:  { icon: CheckCircle,   color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/25'   },
  GENERATE: { icon: Cpu,         color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/25'   },
};

// Synthesize a rich live feed from all data sources
function buildActivityFeed() {
  const items: Array<{
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    resource: string;
    detail: string;
    type: string;
    success: boolean;
  }> = [];

  // From audit log
  mockAuditLog.forEach(log => {
    items.push({
      id: log.id,
      timestamp: log.timestamp,
      actor: log.userName,
      action: log.action,
      resource: log.resource,
      detail: log.details || '',
      type: 'audit',
      success: log.success,
    });
  });

  // AI agent actions
  mockAIAgents.forEach((agent, i) => {
    if (agent.tasksToday > 0) {
      items.push({
        id: `agt-${i}`,
        timestamp: new Date(Date.now() - i * 900000).toISOString(),
        actor: agent.name,
        action: 'GENERATE',
        resource: 'AI Task',
        detail: agent.lastAction,
        type: 'ai',
        success: true,
      });
    }
  });

  // Incidents
  mockIncidents.slice(0, 4).forEach((inc, i) => {
    items.push({
      id: `inc-act-${i}`,
      timestamp: inc.reportedAt,
      actor: inc.assignedTo,
      action: 'CREATE',
      resource: 'Incident',
      detail: `${inc.title} — ${inc.location}`,
      type: 'incident',
      success: true,
    });
  });

  return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 40);
}

const RESOURCE_ICONS: Record<string, React.ElementType> = {
  Incident:      AlertTriangle,
  RiskAssessment: Shield,
  FleetVehicle:  Truck,
  Report:        FileText,
  Auth:          Users,
  'AI Task':     Cpu,
};

export default function ActivityPage() {
  const [typeFilter, setTypeFilter] = useState<'all' | 'audit' | 'ai' | 'incident'>('all');
  const feed = buildActivityFeed();
  const filtered = feed.filter(f => typeFilter === 'all' || f.type === typeFilter);

  return (
    <Sidebar>
      <div className="p-4 md:p-5 space-y-4 anim-fade-up">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[9px] font-bold tracking-[4px] uppercase text-amber-400/70 mb-1">Audit System</div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-white leading-tight">Activity Feed</h1>
            <p className="text-[11px] text-white/35 mt-1">Full audit trail · AI activity · Operational events</p>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-green-400 bg-green-500/8 border border-green-500/18 px-2.5 py-1.5 rounded-[2px]">
            <span className="w-[5px] h-[5px] rounded-full bg-green-400 pulse-dot" />
            Live Feed
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-0 border-b border-white/[0.06]">
          {([
            { key: 'all',      label: 'All Activity', count: feed.length },
            { key: 'audit',    label: 'Audit Log',    count: feed.filter(f => f.type === 'audit').length },
            { key: 'ai',       label: 'AI Actions',   count: feed.filter(f => f.type === 'ai').length },
            { key: 'incident', label: 'Incidents',    count: feed.filter(f => f.type === 'incident').length },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-semibold border-b-2 transition-all',
                f.key === typeFilter
                  ? 'text-amber-400 border-amber-500'
                  : 'text-white/35 border-transparent hover:text-white/60 hover:border-white/20'
              )}
            >
              {f.label}
              <span className={cn(
                'text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] leading-none',
                f.key === typeFilter ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.06] text-white/30'
              )}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden">
          {/* Column headers */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.02]">
            <span className="text-[8.5px] font-bold tracking-[2px] uppercase text-white/22 w-7">Type</span>
            <span className="text-[8.5px] font-bold tracking-[2px] uppercase text-white/22 flex-1">Event</span>
            <span className="text-[8.5px] font-bold tracking-[2px] uppercase text-white/22 hidden md:block w-24">Actor</span>
            <span className="text-[8.5px] font-bold tracking-[2px] uppercase text-white/22 w-16 text-right">Time</span>
          </div>

          <div className="divide-y divide-white/[0.03] max-h-[600px] overflow-y-auto scrollable">
            {filtered.map((item, idx) => {
              const actionCfg = ACTION_CONFIG[item.action] || ACTION_CONFIG.VIEW;
              const ResourceIcon = RESOURCE_ICONS[item.resource] || Activity;
              const ActionIcon   = actionCfg.icon;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-4 py-2.5 hover:bg-white/[0.02] transition-colors anim-fade-up"
                  style={{ animationDelay: `${Math.min(idx * 0.02, 0.4)}s` }}
                >
                  {/* Action badge */}
                  <div className={cn('w-7 h-7 rounded-[2px] border flex items-center justify-center flex-shrink-0', actionCfg.bg)}>
                    <ActionIcon className={cn('w-3 h-3', actionCfg.color)} />
                  </div>

                  {/* Event */}
                  <div className="flex-1 min-w-0 flex items-center gap-2.5">
                    <ResourceIcon className="w-3 h-3 text-white/22 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[11.5px] font-medium text-white/75 truncate block">{item.detail}</span>
                      <span className="text-[9.5px] text-white/30">{item.resource} · {item.action}</span>
                    </div>
                  </div>

                  {/* Actor */}
                  <div className="hidden md:block w-24 flex-shrink-0">
                    <span className="text-[10.5px] text-white/40 truncate block">{item.actor}</span>
                  </div>

                  {/* Time */}
                  <div className="w-16 text-right flex-shrink-0">
                    <span className="text-[9.5px] font-mono text-white/25">{timeAgo(item.timestamp)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-[10px] text-white/30">
          {Object.entries(ACTION_CONFIG).map(([action, cfg]) => {
            const Icon = cfg.icon;
            return (
              <div key={action} className="flex items-center gap-1.5">
                <Icon className={cn('w-3 h-3', cfg.color)} />
                <span>{action}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Sidebar>
  );
}

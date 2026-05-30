import { mockAIAgents } from '@/lib/mock-data';
import { cn, agentStatusConfig } from '@/lib/utils';
import { ChevronRight, Settings2 } from 'lucide-react';

export function AIAgentPanel() {
  const topAgents = mockAIAgents.slice(0, 6);
  const activeCount = mockAIAgents.filter(a => a.status !== 'offline').length;

  return (
    <div className="bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Settings2 className="w-3.5 h-3.5 text-white/30" />
          <div>
            <div className="text-[11.5px] font-bold text-white/88">Module Status</div>
            <div className="text-[9.5px] text-white/28 mt-0.5">{activeCount} operational modules</div>
          </div>
        </div>
        <a href="/ai-operations" className="flex items-center gap-1 text-[9.5px] text-amber-400/60 hover:text-amber-400 font-semibold transition-colors">
          Manage <ChevronRight className="w-3 h-3" />
        </a>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {topAgents.map(agent => {
          const cfg = agentStatusConfig[agent.status];
          return (
            <div key={agent.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
              <span
                className={cn('w-2 h-2 rounded-full flex-shrink-0', cfg.pulse && 'pulse-dot')}
                style={{ background: cfg.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-white/78 truncate">{agent.name}</div>
                <div className="text-[9px] text-white/25 truncate">{agent.lastAction}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[12px] font-bold text-amber-400/80 font-mono">{agent.tasksToday}</div>
                <div className="text-[8.5px] text-white/22">tasks</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

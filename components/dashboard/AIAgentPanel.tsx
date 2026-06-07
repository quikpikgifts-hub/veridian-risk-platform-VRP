import { mockAIAgents } from '@/lib/mock-data';
import { cn, agentStatusConfig } from '@/lib/utils';
import { ChevronRight, BrainCircuit } from 'lucide-react';

export function AIAgentPanel() {
  const topAgents = mockAIAgents.slice(0, 6);
  const activeCount = mockAIAgents.filter(a => a.status !== 'offline').length;

  return (
    <div className="bg-[#171717] border border-[#262626] rounded-[5px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-3.5 h-3.5 text-blue-400" />
          <div>
            <div className="text-[11.5px] font-bold text-white/92">Operational Intelligence</div>
            <div className="text-[9.5px] text-white/36 mt-0.5">{activeCount} intelligence services online</div>
          </div>
        </div>
        <a href="/ai-operations" className="flex items-center gap-1 text-[9.5px] text-blue-400/75 hover:text-blue-300 font-semibold transition-colors">
          Manage <ChevronRight className="w-3 h-3" />
        </a>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {topAgents.map(agent => {
          const cfg = agentStatusConfig[agent.status];
          return (
            <div key={agent.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.025] transition-colors">
              <span className={cn('w-2 h-2 rounded-full flex-shrink-0', cfg.pulse && 'pulse-dot')} style={{ background: cfg.color }} />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-white/80 truncate">{agent.name}</div>
                <div className="text-[9px] text-white/32 truncate">{agent.lastAction}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[12px] font-bold text-blue-400 font-mono">{agent.tasksToday}</div>
                <div className="text-[8.5px] text-white/26">actions</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

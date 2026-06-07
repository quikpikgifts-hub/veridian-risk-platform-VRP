'use client';

import { mockKpis } from '@/lib/mock-data';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ShieldCheck, Users, Gauge, BrainCircuit, Route, Truck, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  alert: AlertTriangle,
  shield: ShieldCheck,
  users: Users,
  gauge: Gauge,
  cpu: BrainCircuit,
  workflow: Route,
  truck: Truck,
  file: FileText,
};

export function KpiCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {mockKpis.slice(0, 8).map((kpi, i) => {
        const Icon = iconMap[kpi.icon || ''] || ShieldCheck;
        const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;
        const deltaColor =
          kpi.trend === 'flat' ? 'text-white/42' :
          kpi.positive ? 'text-green-400' : 'text-red-400';
        const isPriority = i < 2;

        return (
          <div
            key={kpi.label}
            className={cn(
              'bg-[#171717] border border-[#262626] p-4 rounded-[5px] relative overflow-hidden',
              'hover:border-blue-500/35 transition-colors duration-200 cursor-default group',
              'anim-count-up',
              isPriority && 'border-blue-500/30 bg-[#151923]',
            )}
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            {isPriority && <div className="absolute top-0 left-0 right-0 h-px bg-blue-500" />}
            <div className="flex items-start justify-between mb-2.5">
              <span className="text-[8px] font-bold tracking-[2px] uppercase text-white/38 leading-tight">{kpi.label}</span>
              <Icon className={cn('w-3.5 h-3.5 flex-shrink-0', isPriority ? 'text-blue-400/80' : 'text-white/18')} />
            </div>
            <div className={cn('text-[28px] font-bold font-mono leading-none mb-2', isPriority ? 'text-white' : 'text-blue-400')}>
              {kpi.value}{kpi.suffix || ''}
            </div>
            <div className={cn('flex items-center gap-1 text-[9.5px] font-medium', deltaColor)}>
              <TrendIcon className="w-3 h-3 flex-shrink-0" />
              <span>{kpi.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

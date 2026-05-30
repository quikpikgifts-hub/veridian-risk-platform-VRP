'use client';

import { mockKpis } from '@/lib/mock-data';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ShieldCheck, Users, Gauge, Cpu, Zap, Truck, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  alert: AlertTriangle, shield: ShieldCheck, users: Users,
  gauge: Gauge, cpu: Cpu, workflow: Zap, truck: Truck, file: FileText,
};

export function KpiCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {mockKpis.slice(0, 8).map((kpi, i) => {
        const Icon = iconMap[kpi.icon || ''] || ShieldCheck;
        const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;
        const isGood = kpi.positive;
        const deltaColor =
          kpi.trend === 'flat' ? 'text-white/30' :
          (isGood && kpi.trend === 'up') ? 'text-green-400' :
          (!isGood && kpi.trend === 'up') ? 'text-red-400' :
          (isGood && kpi.trend === 'down') ? 'text-green-400' :
          'text-red-400';

        return (
          <div
            key={i}
            className={cn(
              'bg-[#08090F] border border-white/[0.07] p-4 rounded-[4px] relative overflow-hidden',
              'hover:border-amber-500/22 transition-all duration-200 cursor-default group',
              'anim-count-up',
            )}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {/* Hover top shimmer */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-start justify-between mb-2.5">
              <span className="text-[8px] font-bold tracking-[2.5px] uppercase text-white/25 leading-tight">{kpi.label}</span>
              <Icon className="w-3.5 h-3.5 text-white/12 flex-shrink-0" />
            </div>

            <div className="text-[28px] font-bold font-mono text-amber-400 leading-none mb-2">
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

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  icon?: ReactNode;
  color?: 'gold' | 'green' | 'red' | 'orange' | 'blue';
  className?: string;
}

const colorMap = {
  gold:   'text-amber-400',
  green:  'text-green-400',
  red:    'text-red-400',
  orange: 'text-orange-400',
  blue:   'text-blue-400',
};

export function StatCard({ label, value, delta, deltaPositive, icon, color = 'gold', className }: StatCardProps) {
  return (
    <div className={cn(
      'bg-[#08090F] border border-white/[0.07] p-4 rounded-[3px]',
      'hover:border-amber-500/20 transition-colors',
      className
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className="text-[9px] font-bold tracking-[2.5px] uppercase text-white/30">{label}</div>
        {icon && <div className="text-white/20">{icon}</div>}
      </div>
      <div className={cn('text-[28px] font-bold font-mono leading-none mb-1.5', colorMap[color])}>
        {value}
      </div>
      {delta && (
        <div className={cn('text-[10px] font-medium', deltaPositive ? 'text-green-400' : 'text-red-400/80')}>
          {delta}
        </div>
      )}
    </div>
  );
}

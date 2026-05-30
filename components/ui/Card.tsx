import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  goldTop?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
}

const paddingMap = { none:'', sm:'p-3', md:'p-4', lg:'p-5 md:p-6' };

export function Card({ children, goldTop, padding = 'md', hover = false, className }: CardProps) {
  return (
    <div className={cn(
      'bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden',
      goldTop && 'border-t-amber-500 border-t-[2px]',
      hover && 'card-hover',
      paddingMap[padding],
      className
    )}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, actions, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div>
        <div className="text-[12px] font-bold text-white/90">{title}</div>
        {subtitle && <div className="text-[10px] text-white/35 mt-0.5">{subtitle}</div>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

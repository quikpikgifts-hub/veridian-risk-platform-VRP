import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-5 gap-3 flex-wrap', className)}>
      <div>
        {eyebrow && (
          <div className="text-[9px] font-bold tracking-[4px] uppercase text-amber-400/70 mb-1">{eyebrow}</div>
        )}
        <h1 className="text-[22px] md:text-[26px] font-bold text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-[11px] text-white/35 mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">{actions}</div>
      )}
    </div>
  );
}

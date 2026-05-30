import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  goldTop?: boolean;
  padding?: boolean;
  className?: string;
}

export function SectionCard({ title, subtitle, actions, children, goldTop = false, padding = true, className }: SectionCardProps) {
  return (
    <div className={cn(
      'bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden',
      goldTop && 'border-t-amber-500 border-t-2',
      className
    )}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div>
            {title && <div className="text-[12px] font-bold text-white/90">{title}</div>}
            {subtitle && <div className="text-[10px] text-white/30 mt-0.5">{subtitle}</div>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={padding ? 'p-4' : ''}>{children}</div>
    </div>
  );
}

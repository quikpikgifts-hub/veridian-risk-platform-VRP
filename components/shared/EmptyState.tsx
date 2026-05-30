import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-6 text-center', className)}>
      {icon && <div className="text-white/15 mb-4">{icon}</div>}
      <div className="text-[14px] font-semibold text-white/40 mb-1">{title}</div>
      {description && <div className="text-[12px] text-white/25 max-w-xs leading-relaxed">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

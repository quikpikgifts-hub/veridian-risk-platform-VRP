import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };

export function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        sizes[size],
        'rounded-full border-2 border-white/10 border-t-amber-500 animate-spin-slow'
      )} />
      {label && <span className="text-[11px] text-white/40">{label}</span>}
    </div>
  );
}

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
}

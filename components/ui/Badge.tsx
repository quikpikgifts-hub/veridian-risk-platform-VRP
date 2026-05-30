import { cn } from '@/lib/utils';

type Variant =
  | 'critical' | 'high' | 'medium' | 'low'
  | 'active' | 'standby' | 'processing' | 'offline'
  | 'gold' | 'blue' | 'grey'
  | 'review' | 'investigating' | 'contained' | 'resolved'
  | 'pending' | 'inactive'
  | 'draft' | 'approved' | 'delivered'
  | 'running' | 'completed' | 'failed' | 'paused';

const variants: Record<Variant, string> = {
  critical:      'bg-red-500/15 text-red-400 border border-red-500/40',
  high:          'bg-orange-500/15 text-orange-400 border border-orange-500/40',
  medium:        'bg-yellow-400/12 text-yellow-300 border border-yellow-400/40',
  low:           'bg-green-500/12 text-green-400 border border-green-500/35',
  active:        'bg-green-500/12 text-green-400 border border-green-500/35',
  standby:       'bg-orange-500/12 text-orange-400 border border-orange-500/35',
  processing:    'bg-blue-500/12 text-blue-400 border border-blue-500/35',
  offline:       'bg-white/8 text-white/40 border border-white/15',
  gold:          'bg-amber-500/12 text-amber-400 border border-amber-500/35',
  blue:          'bg-blue-500/12 text-blue-400 border border-blue-500/35',
  grey:          'bg-white/8 text-white/50 border border-white/15',
  review:        'bg-amber-500/12 text-amber-400 border border-amber-500/35',
  investigating: 'bg-orange-500/12 text-orange-400 border border-orange-500/35',
  contained:     'bg-blue-500/12 text-blue-400 border border-blue-500/35',
  resolved:      'bg-green-500/12 text-green-400 border border-green-500/35',
  pending:       'bg-amber-500/10 text-amber-300 border border-amber-400/30',
  inactive:      'bg-white/6 text-white/35 border border-white/12',
  draft:         'bg-white/8 text-white/50 border border-white/15',
  approved:      'bg-blue-500/12 text-blue-400 border border-blue-500/35',
  delivered:     'bg-green-500/12 text-green-400 border border-green-500/35',
  running:       'bg-blue-500/12 text-blue-400 border border-blue-500/35',
  completed:     'bg-green-500/12 text-green-400 border border-green-500/35',
  failed:        'bg-red-500/12 text-red-400 border border-red-500/35',
  paused:        'bg-orange-500/12 text-orange-400 border border-orange-500/35',
};

interface BadgeProps {
  variant: Variant;
  label: string;
  dot?: boolean;
  className?: string;
}

export function Badge({ variant, label, dot = false, className }: BadgeProps) {
  // Fallback for unknown variants
  const cls = variants[variant] ?? variants.grey;
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 text-[9.5px] font-bold tracking-[1px] uppercase rounded-[2px]',
      cls,
      className
    )}>
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full bg-current flex-shrink-0',
          (variant === 'active' || variant === 'processing' || variant === 'running') && 'animate-pulse'
        )} />
      )}
      {label}
    </span>
  );
}

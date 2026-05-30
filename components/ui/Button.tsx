import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const variants = {
  primary: 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black border-transparent',
  outline: 'bg-transparent text-amber-400 border-amber-500/35 hover:bg-amber-500/10 hover:border-amber-500/55',
  ghost:   'bg-transparent text-white/45 border-white/[0.08] hover:text-white/75 hover:bg-white/[0.04] hover:border-white/[0.13]',
  danger:  'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25 hover:border-red-500/50',
};

const sizes = {
  sm: 'text-[9.5px] px-3 py-1.5 gap-1.5',
  md: 'text-[10px]  px-4 py-2   gap-2',
  lg: 'text-[11px]  px-5 py-2.5 gap-2',
};

export function Button({
  children, variant = 'ghost', size = 'md',
  disabled, onClick, type = 'button', className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-bold uppercase tracking-[1.5px]',
        'border rounded-[3px] transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/60',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        'cursor-pointer select-none whitespace-nowrap flex-shrink-0',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </button>
  );
}

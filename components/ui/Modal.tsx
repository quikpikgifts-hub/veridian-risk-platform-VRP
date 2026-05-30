'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}

const sizes = {
  sm:  'max-w-sm',
  md:  'max-w-md',
  lg:  'max-w-lg',
  xl:  'max-w-2xl',
};

export function Modal({ open, onClose, title, subtitle, children, size = 'md', footer }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Panel */}
      <div className={cn(
        'relative w-full bg-[#0D0D18] border border-white/[0.09] rounded-[4px] shadow-[0_32px_80px_rgba(0,0,0,0.7)] flex flex-col max-h-[90vh]',
        'animate-[modalIn_0.25s_cubic-bezier(0.16,1,0.3,1)_both]',
        sizes[size]
      )}
        style={{ animation: 'modalIn 0.25s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        {/* Gold top line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-white/[0.07] flex-shrink-0">
          <div>
            <h2 className="text-[14px] font-bold text-white leading-tight">{title}</h2>
            {subtitle && <p className="text-[11px] text-white/40 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/80 transition-colors p-1 -mr-1 -mt-1 rounded hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-white/[0.07] flex-shrink-0 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Form helpers used inside modals ─────────────────────────
interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}

export function Field({ label, required, children, hint }: FieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-[9.5px] font-bold tracking-[2px] uppercase text-white/40 mb-1.5">
        {label}{required && <span className="text-amber-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-white/25 mt-1">{hint}</p>}
    </div>
  );
}

const inputClass = 'w-full bg-[#131320] border border-white/[0.08] text-white text-[12px] px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-white/20';

export function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputClass} {...props} />;
}

export function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputClass, 'resize-none')} rows={3} {...props} />;
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(inputClass, 'cursor-pointer')} {...props}>
      {children}
    </select>
  );
}

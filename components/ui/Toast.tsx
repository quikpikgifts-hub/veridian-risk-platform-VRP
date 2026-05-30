'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const icons = {
  success: CheckCircle2,
  error:   AlertCircle,
  warning: AlertTriangle,
  info:    Info,
};

const styles: Record<ToastType, string> = {
  success: 'border-green-500/40 bg-green-500/10',
  error:   'border-red-500/40 bg-red-500/10',
  warning: 'border-orange-500/40 bg-orange-500/10',
  info:    'border-amber-500/40 bg-amber-500/10',
};

const iconColors: Record<ToastType, string> = {
  success: 'text-green-400',
  error:   'text-red-400',
  warning: 'text-orange-400',
  info:    'text-amber-400',
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const Icon = icons[toast.type];

  return (
    <div className={cn(
      'flex items-start gap-3 p-3.5 border rounded-[3px] bg-[#0D0D18] shadow-[0_8px_32px_rgba(0,0,0,0.6)] min-w-[280px] max-w-[360px]',
      'animate-[toastIn_0.3s_cubic-bezier(0.16,1,0.3,1)_both]',
      styles[toast.type]
    )}>
      <Icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', iconColors[toast.type])} />
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold text-white leading-tight">{toast.title}</div>
        {toast.message && <div className="text-[11px] text-white/50 mt-0.5 leading-snug">{toast.message}</div>}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-white/25 hover:text-white/60 transition-colors flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[300] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

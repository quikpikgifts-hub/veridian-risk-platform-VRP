'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, X, AlertTriangle, Cpu, Calendar, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const notifications = [
  { id: '1', type: 'critical',  title: 'Critical Incident Active',       body: 'Unauthorized entry at Palmetto Apartments — active response.',    time: '2m ago',  read: false },
  { id: '2', type: 'ai',        title: 'AI Draft Ready for Review',       body: 'Risk Analyst completed Orange Ave Gas Station assessment draft.',  time: '18m ago', read: false },
  { id: '3', type: 'warning',   title: 'OSHA Alert — Construction Site',  body: 'Meridian Construction OSHA critical — second event this month.',   time: '1h ago',  read: false },
  { id: '4', type: 'info',      title: 'Quarterly Review Due',            body: 'FastRoute Logistics is overdue for reassessment (May 28).',        time: '3h ago',  read: true  },
  { id: '5', type: 'success',   title: 'Incident Resolved',               body: 'Harbor Point Hotel suspicious package — cleared by staff.',        time: '5h ago',  read: true  },
  { id: '6', type: 'ai',        title: 'Intelligence Brief Updated',      body: 'AI Analyst updated Orange County retail crime threat brief.',       time: '6h ago',  read: true  },
];

const iconMap = {
  critical: { Icon: AlertTriangle, color: 'text-red-400',    bg: 'bg-red-500/15'    },
  warning:  { Icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/15' },
  ai:       { Icon: Cpu,           color: 'text-amber-400',  bg: 'bg-amber-500/15'  },
  info:     { Icon: Calendar,      color: 'text-blue-400',   bg: 'bg-blue-500/15'   },
  success:  { Icon: CheckCircle2,  color: 'text-green-400',  bg: 'bg-green-500/15'  },
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(notifications);
  const panelRef = useRef<HTMLDivElement>(null);

  const unread = items.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const markAll = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: string) => setItems(prev => prev.filter(n => n.id !== id));

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-white/40 hover:text-white/80 transition-colors rounded-[2px] hover:bg-white/5"
        aria-label="Notifications"
      >
        <Bell className="w-4.5 h-4.5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#0D0D18] animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#0D0D18] border border-white/[0.09] rounded-[3px] shadow-[0_16px_48px_rgba(0,0,0,0.6)] z-[150] overflow-hidden animate-[modalIn_0.2s_cubic-bezier(0.16,1,0.3,1)_both]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-white">Notifications</span>
              {unread > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm leading-none">{unread}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAll} className="text-[10px] text-amber-400/70 hover:text-amber-400 transition-colors font-medium">
                  Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/60 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-6 text-center text-[11px] text-white/30">All caught up</div>
            ) : items.map(notif => {
              const { Icon, color, bg } = iconMap[notif.type as keyof typeof iconMap] ?? iconMap.info;
              return (
                <div
                  key={notif.id}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors group',
                    !notif.read && 'bg-white/[0.018]'
                  )}
                >
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', bg)}>
                    <Icon className={cn('w-3.5 h-3.5', color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <span className={cn('text-[11.5px] font-semibold leading-tight', notif.read ? 'text-white/60' : 'text-white/90')}>
                        {notif.title}
                      </span>
                      {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-[10.5px] text-white/35 mt-0.5 leading-relaxed">{notif.body}</p>
                    <span className="text-[9.5px] text-white/25 mt-1 block">{notif.time}</span>
                  </div>
                  <button
                    onClick={() => dismiss(notif.id)}
                    className="text-white/0 group-hover:text-white/30 hover:!text-white/60 transition-colors flex-shrink-0 mt-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="px-4 py-2.5 border-t border-white/[0.06]">
            <span className="text-[9.5px] text-white/25">Critical alerts also sent via SMS to Steve</span>
          </div>
        </div>
      )}
    </div>
  );
}

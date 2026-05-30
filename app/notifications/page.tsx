'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { mockNotifications } from '@/lib/mock-data';
import { timeAgo, cn } from '@/lib/utils';
import { Bell, CheckCheck, Trash2, AlertTriangle, Brain, Truck, Users, Settings as SettingsIcon, Info, X } from 'lucide-react';
import type { Notification } from '@/types';
import Link from 'next/link';

const TYPE_ICONS: Record<Notification['type'], React.ElementType> = {
  incident: AlertTriangle,
  ai:       Brain,
  fleet:    Truck,
  client:   Users,
  system:   SettingsIcon,
  report:   Info,
};

const PRIORITY_CONFIG: Record<string, { dot: string; border: string; bg: string }> = {
  critical: { dot: 'bg-red-500',    border: 'border-l-red-500',    bg: 'bg-red-500/[0.04]'    },
  high:     { dot: 'bg-orange-500', border: 'border-l-orange-500', bg: 'bg-orange-500/[0.03]' },
  medium:   { dot: 'bg-amber-500',  border: 'border-l-amber-500',  bg: 'bg-amber-500/[0.03]'  },
  low:      { dot: 'bg-blue-500',   border: 'border-l-blue-500',   bg: 'bg-blue-500/[0.03]'   },
  info:     { dot: 'bg-white/25',   border: 'border-l-white/15',   bg: ''                     },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | Notification['type']>('all');

  const markRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const dismiss = (id: string) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'all')    return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const FILTERS = [
    { key: 'all',      label: 'All' },
    { key: 'unread',   label: 'Unread' },
    { key: 'incident', label: 'Incidents' },
    { key: 'ai',       label: 'AI' },
    { key: 'fleet',    label: 'Fleet' },
    { key: 'client',   label: 'Clients' },
    { key: 'system',   label: 'System' },
  ] as const;

  return (
    <Sidebar>
      <div className="p-4 md:p-5 space-y-4 anim-fade-up">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[9px] font-bold tracking-[4px] uppercase text-amber-400/70 mb-1">Alerts</div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-white leading-tight">Notifications</h1>
            <p className="text-[11px] text-white/35 mt-1">
              {unreadCount > 0 ? (
                <span className="text-amber-400">{unreadCount} unread</span>
              ) : 'All caught up'} · {notifications.length} total
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead}>
                <CheckCheck className="w-3.5 h-3.5" />Mark All Read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setNotifications([])}>
              <Trash2 className="w-3.5 h-3.5" />Clear All
            </Button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-0 overflow-x-auto border-b border-white/[0.06]">
          {FILTERS.map(f => {
            const count = f.key === 'all'    ? notifications.length
                        : f.key === 'unread' ? unreadCount
                        : notifications.filter(n => n.type === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as typeof filter)}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2.5 text-[11px] font-semibold border-b-2 transition-all whitespace-nowrap',
                  f.key === filter
                    ? 'text-amber-400 border-amber-500'
                    : 'text-white/35 border-transparent hover:text-white/60 hover:border-white/20'
                )}
              >
                {f.label}
                {count > 0 && (
                  <span className={cn(
                    'text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] leading-none',
                    f.key === filter ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.06] text-white/30'
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notifications list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="w-10 h-10 text-white/10 mb-3" />
            <div className="text-[14px] font-semibold text-white/30 mb-1">No notifications</div>
            <div className="text-[11px] text-white/20">
              {filter === 'unread' ? 'All notifications have been read.' : 'Nothing here yet.'}
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {filtered.map(n => {
              const cfg = PRIORITY_CONFIG[n.priority] || PRIORITY_CONFIG.info;
              const Icon = TYPE_ICONS[n.type] || Bell;

              return (
                <div
                  key={n.id}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-[3px] border border-transparent border-l-2 transition-all',
                    cfg.border, cfg.bg,
                    !n.read && 'bg-white/[0.025]',
                    n.read && 'opacity-60',
                  )}
                >
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-[2px] bg-white/[0.04] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-white/45" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <div className="flex items-center gap-2">
                        {!n.read && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5', cfg.dot)} />}
                        <span className="text-[12px] font-bold text-white/90">{n.title}</span>
                      </div>
                      <span className="text-[9px] text-white/25 flex-shrink-0 font-mono">{timeAgo(n.timestamp)}</span>
                    </div>
                    <p className="text-[11px] text-white/48 leading-relaxed">{n.message}</p>
                    {n.actionUrl && (
                      <div className="flex items-center gap-3 mt-2">
                        <Link
                          href={n.actionUrl}
                          onClick={() => markRead(n.id)}
                          className="text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-[1px]"
                        >
                          {n.actionLabel || 'View'} →
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="p-1 text-white/20 hover:text-green-400 transition-colors rounded"
                        title="Mark read"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => dismiss(n.id)}
                      className="p-1 text-white/20 hover:text-red-400 transition-colors rounded"
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Sidebar>
  );
}

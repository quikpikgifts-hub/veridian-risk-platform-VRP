'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, AlertTriangle, ShieldCheck, Radar,
  BrainCircuit, Route, Truck, FileText, BarChart3, Building2,
  Activity, Bell, Users, Settings, Shield,
  ChevronLeft, ChevronRight, Menu, X,
} from 'lucide-react';
import { mockNotifications } from '@/lib/mock-data';

function ShieldSyncMark({ size = 26 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-[4px] border border-blue-500/35 bg-blue-500/10"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Shield className="h-[58%] w-[58%] text-blue-400" strokeWidth={2.2} />
    </div>
  );
}

const NAV = [
  {
    section: 'Command',
    items: [
      { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
      { href: '/incidents', label: 'Incidents', icon: AlertTriangle, badge: '5', badgeCls: 'bg-red-500 text-white' },
      { href: '/risk-assessments', label: 'Site Risk', icon: ShieldCheck },
      { href: '/threat-intel', label: 'Risk Detection', icon: Radar, badge: '6', badgeCls: 'bg-blue-500 text-white' },
    ],
  },
  {
    section: 'Operations',
    items: [
      { href: '/ai-operations', label: 'Operational Intelligence', icon: BrainCircuit },
      { href: '/workflows', label: 'Workflows', icon: Route },
      { href: '/fleet', label: 'Fleet', icon: Truck },
      { href: '/reports', label: 'Reports', icon: FileText },
    ],
  },
  {
    section: 'Review',
    items: [
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/clients', label: 'Sites', icon: Building2 },
      { href: '/activity', label: 'Activity Log', icon: Activity },
    ],
  },
  {
    section: 'Platform',
    items: [
      { href: '/notifications', label: 'Notifications', icon: Bell, dynamic: 'notif' },
      { href: '/users', label: 'Users', icon: Users },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
] as const;

function NavItem({
  href, label, icon: Icon, badge, badgeCls, dynamic,
  active, collapsed, notifCount, onNavigate,
}: {
  href: string; label: string; icon: React.ElementType;
  badge?: string; badgeCls?: string; dynamic?: string;
  active: boolean; collapsed: boolean; notifCount: number;
  onNavigate: () => void;
}) {
  const resolvedBadge = dynamic === 'notif' && notifCount > 0 ? String(notifCount) : badge;
  const resolvedCls = dynamic === 'notif' ? 'bg-red-500 text-white' : (badgeCls ?? '');

  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex items-center gap-2.5 border border-transparent rounded-[3px]',
        'text-[11.5px] font-medium select-none transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/70',
        collapsed ? 'justify-center px-0 py-2.5 mx-2' : 'px-3 py-2 mx-2',
        active
          ? 'bg-blue-500/[0.12] text-white border-blue-500/35'
          : 'text-white/45 hover:text-white/82 hover:bg-white/[0.045]',
      )}
    >
      {active && <span className="absolute left-0 inset-y-[4px] w-[2px] rounded-r-full bg-blue-500" />}
      <Icon className={cn('flex-shrink-0', collapsed ? 'w-[16px] h-[16px]' : 'w-[13.5px] h-[13.5px]', active ? 'text-blue-400' : 'text-white/32 group-hover:text-white/62')} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {resolvedBadge && <span className={cn('flex-shrink-0 text-[8px] font-bold leading-none px-1.5 py-[3px] rounded-[2px]', resolvedCls)}>{resolvedBadge}</span>}
        </>
      )}
      {collapsed && resolvedBadge && <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-red-500 text-white text-[7.5px] font-bold flex items-center justify-center px-0.5">{resolvedBadge}</span>}
      {collapsed && <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#171717] border border-[#262626] text-white/80 text-[10.5px] font-medium rounded-[3px] whitespace-nowrap z-[200] shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150">{label}</span>}
    </Link>
  );
}

function SBContent({ pathname, collapsed, notifCount, onNavigate, onToggle }: {
  pathname: string; collapsed: boolean; notifCount: number;
  onNavigate: () => void; onToggle: () => void;
}) {
  return (
    <>
      <div className={cn('flex items-center border-b border-[#262626] flex-shrink-0', collapsed ? 'justify-center py-4 px-2' : 'gap-3 px-4 py-[14px]')}>
        <ShieldSyncMark size={collapsed ? 22 : 28} />
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-white leading-tight">ShieldSync</div>
              <div className="text-[8px] font-bold tracking-[0.24em] uppercase text-blue-400/70 mt-0.5">Protect</div>
            </div>
            <button onClick={onToggle} className="p-1 text-white/28 hover:text-white/70 hover:bg-white/[0.05] rounded transition-colors" aria-label="Collapse sidebar">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </>
        )}
        {collapsed && (
          <button onClick={onToggle} className="absolute -right-[14px] top-[60px] w-[27px] h-[27px] rounded-full bg-[#171717] border border-[#262626] flex items-center justify-center text-white/38 hover:text-blue-400 hover:border-blue-500/45 transition-all shadow-lg z-10" aria-label="Expand sidebar">
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 scrollable" aria-label="Platform navigation">
        {NAV.map(({ section, items }) => (
          <div key={section} className="mb-2">
            {!collapsed ? <div className="px-5 pb-1.5 pt-2 text-[7.5px] font-bold tracking-[0.26em] uppercase text-white/25 select-none">{section}</div> : <div className="h-px bg-[#262626] mx-3 my-2" />}
            <div className="space-y-[1px]">
              {items.map(item => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  badge={'badge' in item ? item.badge : undefined}
                  badgeCls={'badgeCls' in item ? item.badgeCls : undefined}
                  dynamic={'dynamic' in item ? (item as { dynamic?: string }).dynamic : undefined}
                  active={pathname === item.href || pathname.startsWith(item.href + '/')}
                  collapsed={collapsed}
                  notifCount={notifCount}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className={cn('border-t border-[#262626] flex-shrink-0', collapsed ? 'py-3.5 flex justify-center' : 'px-3 py-3')}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-blue-500/[0.12] border border-blue-500/28 flex items-center justify-center" title="Dana Mitchell">
            <span className="text-[11px] font-bold text-blue-400">DM</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-[3px] hover:bg-white/[0.035] transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-blue-500/[0.12] border border-blue-500/28 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold text-blue-400">DM</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] font-semibold text-white/82 truncate">Dana Mitchell</div>
              <div className="text-[9px] text-white/32 tracking-wide">Operations Director</div>
            </div>
            <span className="w-[7px] h-[7px] rounded-full bg-green-400 flex-shrink-0" />
          </div>
        )}
      </div>
    </>
  );
}

function TopBar({ pathname, onMobileOpen, notifCount }: { pathname: string; onMobileOpen: () => void; notifCount: number }) {
  const crumbs = pathname.split('/').filter(Boolean);
  const pageTitle = crumbs[crumbs.length - 1]?.replace(/-/g, ' ') || 'dashboard';

  return (
    <div id="topbar">
      <button onClick={onMobileOpen} className="md:hidden p-2 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-[3px] transition-colors flex-shrink-0" aria-label="Open navigation">
        <Menu className="w-[18px] h-[18px]" />
      </button>
      <div className="md:hidden flex items-center gap-2.5 flex-1 min-w-0">
        <ShieldSyncMark size={20} />
        <span className="text-[13px] font-semibold text-white capitalize truncate">{pageTitle}</span>
      </div>
      <div className="hidden md:flex items-center gap-1.5 text-[10.5px] flex-1 min-w-0">
        <span className="text-blue-400/80 font-bold tracking-[0.12em]">SHIELDSYNC</span>
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5 text-white/24">
            <span className="text-white/16">/</span>
            <span className={cn('capitalize font-medium', i === crumbs.length - 1 ? 'text-white/65' : 'text-white/28')}>{c.replace(/-/g, ' ')}</span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link href="/notifications" className="relative p-2 text-white/36 hover:text-white/72 hover:bg-white/[0.05] rounded-[3px] transition-colors" aria-label="Notifications">
          <Bell className="w-4 h-4" />
          {notifCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center px-0.5 leading-none">{notifCount > 9 ? '9+' : notifCount}</span>}
        </Link>
        <Link href="/dashboard" className="hidden sm:flex items-center gap-1.5 bg-blue-500 hover:bg-blue-400 text-white text-[9.5px] font-bold uppercase tracking-[0.12em] px-3.5 py-[7px] rounded-[3px] transition-colors">
          Command Center
        </Link>
      </div>
    </div>
  );
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const notifCount = mockNotifications.filter(n => !n.read).length;

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    if (!mobileOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [mobileOpen]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNav = useCallback(() => setMobileOpen(false), []);

  return (
    <div id="shell">
      <aside id="sb" className={cn('hidden md:flex flex-col relative', collapsed ? 'collapsed' : 'expanded')} aria-label="Primary navigation">
        <SBContent pathname={pathname} collapsed={collapsed} notifCount={notifCount} onNavigate={handleNav} onToggle={() => setCollapsed(c => !c)} />
      </aside>
      {mobileOpen && <div className="md:hidden fixed inset-0 z-[180] bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-hidden />}
      <aside id="sb" className={cn('md:hidden fixed top-0 left-0 bottom-0 z-[200] flex flex-col expanded bg-[#111111] border-r border-[#262626] shadow-[6px_0_48px_rgba(0,0,0,0.8)] transition-transform duration-300', mobileOpen ? 'translate-x-0' : '-translate-x-full')} aria-label="Mobile navigation" aria-hidden={!mobileOpen}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1.5 text-white/32 hover:text-white/72 hover:bg-white/[0.05] rounded transition-colors z-10" aria-label="Close navigation">
          <X className="w-4 h-4" />
        </button>
        <SBContent pathname={pathname} collapsed={false} notifCount={notifCount} onNavigate={handleNav} onToggle={() => {}} />
      </aside>
      <div id="main">
        <TopBar pathname={pathname} onMobileOpen={() => setMobileOpen(true)} notifCount={notifCount} />
        <div id="content">{children}</div>
      </div>
    </div>
  );
}

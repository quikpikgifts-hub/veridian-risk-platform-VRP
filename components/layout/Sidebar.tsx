'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, AlertTriangle, ShieldCheck, Radar,
  Brain, Zap, Truck, FileText, BarChart3, BookOpen,
  Activity, Bell, Users, Settings,
  ChevronLeft, ChevronRight, Menu, X,
} from 'lucide-react';
import { mockNotifications } from '@/lib/mock-data';

/* ── Logo ──────────────────────────────────────────── */
function VLogo({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" width={size} height={size} aria-hidden>
      <circle cx="18" cy="18" r="15.5" stroke="#C9A84C" strokeWidth="0.6" opacity="0.25"/>
      <circle cx="18" cy="18" r="10"   stroke="#C9A84C" strokeWidth="1.2" opacity="0.6"/>
      <circle cx="18" cy="18" r="2.8"  fill="#C9A84C"/>
      <line x1="18" y1="2.5"  x2="18" y2="8"    stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="28"   x2="18" y2="33.5"  stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="2.5"  y1="18" x2="8"   y2="18"   stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="28"   y1="18" x2="33.5" y2="18"  stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 11.5 L18 24.5 L25 11.5" fill="none" stroke="#C9A84C" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Nav structure ─────────────────────────────────── */
const NAV = [
  {
    section: 'Operations',
    items: [
      { href: '/dashboard',        label: 'Dashboard',       icon: LayoutDashboard },
      { href: '/incidents',        label: 'Incidents',       icon: AlertTriangle,  badge: '4',    badgeCls: 'bg-red-600 text-white' },
      { href: '/risk-assessments', label: 'Risk Assessments',icon: ShieldCheck },
      { href: '/threat-intel',     label: 'Threat Intel',    icon: Radar,          badge: '6',    badgeCls: 'bg-orange-500 text-white' },
    ],
  },
  {
    section: 'Consulting',
    items: [
      { href: '/ai-operations',    label: 'Workforce',       icon: Brain },
      { href: '/workflows',        label: 'Workflows',       icon: Zap },
      { href: '/fleet',            label: 'Fleet',           icon: Truck },
      { href: '/reports',          label: 'Reports',         icon: FileText },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      { href: '/analytics',        label: 'Analytics',       icon: BarChart3 },
      { href: '/clients',          label: 'Clients',         icon: BookOpen },
      { href: '/activity',         label: 'Activity Log',    icon: Activity },
    ],
  },
  {
    section: 'Platform',
    items: [
      { href: '/notifications',    label: 'Notifications',   icon: Bell,     dynamic: 'notif' },
      { href: '/users',            label: 'Users',           icon: Users },
      { href: '/settings',         label: 'Settings',        icon: Settings },
    ],
  },
] as const;

/* ── Single nav item ───────────────────────────────── */
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
  const resolvedCls   = dynamic === 'notif' ? 'bg-red-600 text-white' : (badgeCls ?? '');

  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex items-center gap-2.5 border border-transparent rounded-[2px]',
        'text-[11.5px] font-medium select-none transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50',
        collapsed ? 'justify-center px-0 py-2.5 mx-2' : 'px-3 py-2 mx-2',
        active
          ? 'bg-amber-500/[0.09] text-amber-400 border-amber-500/22'
          : 'text-white/38 hover:text-white/72 hover:bg-white/[0.038]',
      )}
    >
      {/* Active accent bar */}
      {active && <span className="absolute left-0 inset-y-[3px] w-[2px] rounded-r-full bg-amber-500" />}

      <Icon className={cn(
        'flex-shrink-0',
        collapsed ? 'w-[16px] h-[16px]' : 'w-[13px] h-[13px]',
        active ? 'text-amber-400' : 'text-white/28 group-hover:text-white/52',
      )} />

      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {resolvedBadge && (
            <span className={cn('flex-shrink-0 text-[8px] font-bold leading-none px-1.5 py-[3px] rounded-[1px]', resolvedCls)}>
              {resolvedBadge}
            </span>
          )}
        </>
      )}

      {/* Collapsed: badge dot */}
      {collapsed && resolvedBadge && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-red-600 text-white text-[7.5px] font-bold flex items-center justify-center px-0.5">
          {resolvedBadge}
        </span>
      )}

      {/* Collapsed: tooltip */}
      {collapsed && (
        <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#14151F] border border-white/[0.1] text-white/75 text-[10.5px] font-medium rounded-[2px] whitespace-nowrap z-[200] shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {label}
        </span>
      )}
    </Link>
  );
}

/* ── Sidebar content ───────────────────────────────── */
function SBContent({
  pathname, collapsed, notifCount, onNavigate, onToggle,
}: {
  pathname: string; collapsed: boolean; notifCount: number;
  onNavigate: () => void; onToggle: () => void;
}) {
  return (
    <>
      {/* Brand header */}
      <div className={cn(
        'flex items-center border-b border-white/[0.055] flex-shrink-0',
        collapsed ? 'justify-center py-4 px-2' : 'gap-3 px-4 py-[14px]',
      )}>
        <VLogo size={collapsed ? 22 : 26} />
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-white leading-tight">Veridian</div>
              <div className="text-[8px] font-bold tracking-[0.26em] uppercase text-amber-400/60 mt-0.5">Risk Group</div>
            </div>
            <button
              onClick={onToggle}
              className="p-1 text-white/20 hover:text-white/55 hover:bg-white/[0.04] rounded transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </>
        )}
        {collapsed && (
          <button
            onClick={onToggle}
            className="absolute -right-[14px] top-[60px] w-[27px] h-[27px] rounded-full bg-[#0F1019] border border-white/[0.1] flex items-center justify-center text-white/30 hover:text-amber-400 hover:border-amber-500/35 transition-all shadow-lg z-10"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 scrollable" aria-label="Platform navigation">
        {NAV.map(({ section, items }) => (
          <div key={section} className="mb-2">
            {!collapsed ? (
              <div className="px-5 pb-1.5 pt-2 text-[7.5px] font-bold tracking-[0.3em] uppercase text-white/22 select-none">
                {section}
              </div>
            ) : (
              <div className="h-px bg-white/[0.055] mx-3 my-2" />
            )}
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

      {/* User footer */}
      <div className={cn(
        'border-t border-white/[0.055] flex-shrink-0',
        collapsed ? 'py-3.5 flex justify-center' : 'px-3 py-3',
      )}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-amber-500/[0.1] border border-amber-500/22 flex items-center justify-center cursor-pointer hover:border-amber-500/45 transition-colors" title="Steve Washington Smith">
            <span className="text-[11px] font-bold text-amber-400">SS</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-[2px] hover:bg-white/[0.03] transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-amber-500/[0.1] border border-amber-500/22 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold text-amber-400">SS</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] font-semibold text-white/80 truncate">Steve Smith</div>
              <div className="text-[9px] text-white/28 tracking-wide">Managing Member</div>
            </div>
            <span className="w-[7px] h-[7px] rounded-full bg-green-400 flex-shrink-0" style={{ boxShadow: '0 0 5px rgba(34,197,94,0.6)' }} />
          </div>
        )}
      </div>
    </>
  );
}

/* ── Top bar ───────────────────────────────────────── */
function TopBar({ pathname, onMobileOpen, notifCount }: { pathname: string; onMobileOpen: () => void; notifCount: number }) {
  const crumbs    = pathname.split('/').filter(Boolean);
  const pageTitle = crumbs[crumbs.length - 1]?.replace(/-/g, ' ') || 'dashboard';

  return (
    <div id="topbar">
      {/* Mobile menu */}
      <button
        onClick={onMobileOpen}
        className="md:hidden p-2 text-white/35 hover:text-white hover:bg-white/[0.04] rounded-[2px] transition-colors flex-shrink-0"
        aria-label="Open navigation"
      >
        <Menu className="w-[18px] h-[18px]" />
      </button>

      {/* Mobile brand */}
      <div className="md:hidden flex items-center gap-2.5 flex-1 min-w-0">
        <VLogo size={20} />
        <span className="text-[13px] font-semibold text-white capitalize truncate">{pageTitle}</span>
      </div>

      {/* Desktop breadcrumb */}
      <div className="hidden md:flex items-center gap-1.5 text-[10.5px] flex-1 min-w-0">
        <span className="text-amber-400/55 font-bold tracking-[0.1em]">VERIDIAN</span>
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5 text-white/22">
            <span className="text-white/14">/</span>
            <span className={cn('capitalize font-medium', i === crumbs.length - 1 ? 'text-white/55' : 'text-white/22')}>
              {c.replace(/-/g, ' ')}
            </span>
          </span>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Notification bell */}
        <Link
          href="/notifications"
          className="relative p-2 text-white/32 hover:text-white/70 hover:bg-white/[0.04] rounded-[2px] transition-colors"
        >
          <Bell className="w-4 h-4" />
          {notifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-red-600 text-white text-[8px] font-bold flex items-center justify-center px-0.5 leading-none">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </Link>

        {/* Dashboard entry */}
        <Link
          href="/dashboard"
          className="hidden sm:flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black text-[9.5px] font-bold uppercase tracking-[0.12em] px-3.5 py-[7px] rounded-[2px] transition-colors"
        >
          Operations Center
        </Link>
      </div>
    </div>
  );
}

/* ── Shell export ──────────────────────────────────── */
export function Sidebar({ children }: { children: React.ReactNode }) {
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname    = usePathname();
  const notifCount  = mockNotifications.filter(n => !n.read).length;

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

      {/* Desktop sidebar */}
      <aside
        id="sb"
        className={cn('hidden md:flex flex-col relative', collapsed ? 'collapsed' : 'expanded')}
        aria-label="Primary navigation"
      >
        <SBContent
          pathname={pathname}
          collapsed={collapsed}
          notifCount={notifCount}
          onNavigate={handleNav}
          onToggle={() => setCollapsed(c => !c)}
        />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-[180] bg-black/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <aside
        id="sb"
        className={cn(
          'md:hidden fixed top-0 left-0 bottom-0 z-[200] flex flex-col expanded',
          'bg-[#07080F] border-r border-white/[0.07]',
          'shadow-[6px_0_48px_rgba(0,0,0,0.8)] transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-white/25 hover:text-white/65 hover:bg-white/[0.04] rounded transition-colors z-10"
          aria-label="Close navigation"
        >
          <X className="w-4 h-4" />
        </button>
        <SBContent
          pathname={pathname}
          collapsed={false}
          notifCount={notifCount}
          onNavigate={handleNav}
          onToggle={() => {}}
        />
      </aside>

      {/* Main */}
      <div id="main">
        <TopBar pathname={pathname} onMobileOpen={() => setMobileOpen(true)} notifCount={notifCount} />
        <div id="content">{children}</div>
      </div>

    </div>
  );
}

'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockUsers } from '@/lib/mock-data';
import { formatDate, timeAgo, cn } from '@/lib/utils';
import { Users, Plus, Shield, Eye, Edit3, Key, UserCheck, UserX, Crown, Settings } from 'lucide-react';
import type { User } from '@/types';

const ROLE_CONFIG: Record<User['role'], { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  admin:    { label: 'Admin',    color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/25',  icon: Crown   },
  operator: { label: 'Operator', color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/25',   icon: Shield  },
  analyst:  { label: 'Analyst',  color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/25', icon: Eye     },
  client:   { label: 'Client',   color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/25',  icon: UserCheck },
  viewer:   { label: 'Viewer',   color: 'text-white/40',   bg: 'bg-white/[0.05]',  border: 'border-white/[0.1]',   icon: Eye     },
};

const PERMISSIONS_MAP: Record<User['role'], string[]> = {
  admin:    ['All platform access', 'User management', 'Billing', 'modules', 'All reports', 'Settings'],
  operator: ['Incident management', 'Risk assessments', 'Fleet', 'Reports', 'modules', 'Workflows'],
  analyst:  ['Risk assessments', 'Read-only incidents', 'Analytics', 'Reports view'],
  client:   ['Own reports only', 'Incident read', 'Limited dashboard'],
  viewer:   ['Dashboard view only', 'No write access'],
};

function UserRow({ user }: { user: User }) {
  const roleCfg = ROLE_CONFIG[user.role];
  const RoleIcon = roleCfg.icon;
  const isActive = user.status === 'active';

  return (
    <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.025] transition-colors border-b border-white/[0.04] last:border-0">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <span className="text-[12px] font-bold text-amber-400">
            {user.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
          </span>
        </div>
        <span className={cn(
          'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#08090F]',
          isActive ? 'bg-green-400' : user.status === 'suspended' ? 'bg-red-500' : 'bg-white/20'
        )} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-semibold text-white/88">{user.name}</span>
        </div>
        <div className="text-[10px] text-white/35 mt-0.5">{user.email}</div>
      </div>

      {/* Department */}
      <div className="hidden md:block text-[11px] text-white/40 w-32 truncate">{user.department}</div>

      {/* Role */}
      <div className="flex-shrink-0">
        <span className={cn(
          'inline-flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[1px] px-2 py-1 rounded-[2px] border',
          roleCfg.color, roleCfg.bg, roleCfg.border
        )}>
          <RoleIcon className="w-2.5 h-2.5" />
          {roleCfg.label}
        </span>
      </div>

      {/* Status */}
      <div className="hidden sm:block flex-shrink-0">
        <Badge
          variant={isActive ? 'active' : 'grey'}
          label={user.status}
          dot={isActive}
        />
      </div>

      {/* Last login */}
      <div className="hidden lg:block text-[10px] text-white/25 font-mono w-20 text-right flex-shrink-0">
        {user.lastLogin ? timeAgo(user.lastLogin) : '—'}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button className="p-1.5 text-white/20 hover:text-blue-400 transition-colors rounded" title="Edit user">
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button className="p-1.5 text-white/20 hover:text-amber-400 transition-colors rounded" title="Manage permissions">
          <Key className="w-3.5 h-3.5" />
        </button>
        <button className="p-1.5 text-white/20 hover:text-red-400 transition-colors rounded" title={isActive ? 'Suspend user' : 'Activate user'}>
          {isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [activeRole, setActiveRole] = useState<User['role'] | 'all'>('all');

  const filtered = mockUsers.filter(u => activeRole === 'all' || u.role === activeRole);

  const roleCounts = Object.keys(ROLE_CONFIG).reduce((acc, role) => {
    acc[role] = mockUsers.filter(u => u.role === role).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Sidebar>
      <div className="p-4 md:p-5 space-y-4 anim-fade-up">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[9px] font-bold tracking-[4px] uppercase text-amber-400/70 mb-1">Access Control</div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-white leading-tight">Users & Roles</h1>
            <p className="text-[11px] text-white/35 mt-1">{mockUsers.length} users · Role-based access control</p>
          </div>
          <Button variant="primary" size="md">
            <Plus className="w-3.5 h-3.5" />Invite User
          </Button>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(Object.entries(ROLE_CONFIG) as [User['role'], typeof ROLE_CONFIG[User['role']]][]).map(([role, cfg]) => {
            const Icon = cfg.icon;
            return (
              <button
                key={role}
                onClick={() => setActiveRole(activeRole === role ? 'all' : role)}
                className={cn(
                  'p-3.5 rounded-[3px] border text-left transition-all',
                  activeRole === role
                    ? `${cfg.bg} ${cfg.border}`
                    : 'bg-[#08090F] border-white/[0.07] hover:border-white/[0.14]'
                )}
              >
                <Icon className={cn('w-4 h-4 mb-2', cfg.color)} />
                <div className="text-[18px] font-bold font-mono text-white/80">{roleCounts[role] || 0}</div>
                <div className={cn('text-[9px] font-bold uppercase tracking-[1.5px]', cfg.color)}>{cfg.label}s</div>
              </button>
            );
          })}
        </div>

        {/* Users table */}
        <div className="bg-[#08090F] border border-white/[0.07] border-t-2 border-t-amber-500 rounded-[3px] overflow-hidden">
          {/* Table header */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="w-9 flex-shrink-0" />
            <div className="flex-1 text-[8.5px] font-bold tracking-[2px] uppercase text-white/22">User</div>
            <div className="hidden md:block text-[8.5px] font-bold tracking-[2px] uppercase text-white/22 w-32">Department</div>
            <div className="text-[8.5px] font-bold tracking-[2px] uppercase text-white/22 flex-shrink-0">Role</div>
            <div className="hidden sm:block text-[8.5px] font-bold tracking-[2px] uppercase text-white/22 flex-shrink-0">Status</div>
            <div className="hidden lg:block text-[8.5px] font-bold tracking-[2px] uppercase text-white/22 w-20 text-right flex-shrink-0">Last Login</div>
            <div className="text-[8.5px] font-bold tracking-[2px] uppercase text-white/22 flex-shrink-0">Actions</div>
          </div>
          <div>
            {filtered.map(user => <UserRow key={user.id} user={user} />)}
          </div>
        </div>

        {/* Permissions matrix */}
        <div className="bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <div className="text-[12px] font-bold text-white/90">Permission Matrix</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="px-4 py-3 text-left text-[8.5px] font-bold tracking-[2px] uppercase text-white/22">Role</th>
                  <th className="px-4 py-3 text-left text-[8.5px] font-bold tracking-[2px] uppercase text-white/22">Permissions</th>
                  <th className="px-4 py-3 text-left text-[8.5px] font-bold tracking-[2px] uppercase text-white/22">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {(Object.entries(ROLE_CONFIG) as [User['role'], typeof ROLE_CONFIG[User['role']]][]).map(([role, cfg]) => {
                  const Icon = cfg.icon;
                  return (
                    <tr key={role} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[1px] px-2 py-1 rounded-[2px] border',
                          cfg.color, cfg.bg, cfg.border
                        )}>
                          <Icon className="w-2.5 h-2.5" />{cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {PERMISSIONS_MAP[role].map(p => (
                            <span key={p} className="text-[9px] text-white/40 bg-white/[0.04] border border-white/[0.07] px-1.5 py-0.5 rounded-[2px]">
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-[10px] text-amber-400/60 hover:text-amber-400 transition-colors flex items-center gap-1">
                          <Settings className="w-3 h-3" />Configure
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

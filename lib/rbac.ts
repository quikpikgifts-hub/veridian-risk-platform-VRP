/**
 * lib/rbac.ts
 * Role-Based Access Control for Veridian Risk Platform.
 *
 * Roles (hierarchy: admin > director > analyst > client > viewer):
 *   admin    — full platform access + user management
 *   director — full ops access, cannot manage users/billing
 *   analyst  — read/write risk assessments, reports, incidents (read-only fleet)
 *   client   — own reports only, read-only dashboard
 *   viewer   — dashboard read-only, no write access
 *
 * Used in: middleware (route guards) + components (UI visibility)
 */

export type Role = 'admin' | 'director' | 'analyst' | 'client' | 'viewer';

// ── Permission definitions ────────────────────────────────────
export type Permission =
  | 'dashboard:view'
  | 'incidents:view'   | 'incidents:write'
  | 'risk:view'        | 'risk:write'
  | 'reports:view'     | 'reports:write'
  | 'fleet:view'       | 'fleet:write'
  | 'clients:view'     | 'clients:write'
  | 'workflows:view'   | 'workflows:write'
  | 'analytics:view'
  | 'threat-intel:view'
  | 'activity:view'
  | 'notifications:view'
  | 'users:view'       | 'users:write'
  | 'settings:view'    | 'settings:write'
  | 'ai-operations:view'
  | 'audit:view'
  | 'admin:all';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'admin:all',
    'dashboard:view',
    'incidents:view',   'incidents:write',
    'risk:view',        'risk:write',
    'reports:view',     'reports:write',
    'fleet:view',       'fleet:write',
    'clients:view',     'clients:write',
    'workflows:view',   'workflows:write',
    'analytics:view',
    'threat-intel:view',
    'activity:view',
    'notifications:view',
    'users:view',       'users:write',
    'settings:view',    'settings:write',
    'ai-operations:view',
    'audit:view',
  ],
  director: [
    'dashboard:view',
    'incidents:view',   'incidents:write',
    'risk:view',        'risk:write',
    'reports:view',     'reports:write',
    'fleet:view',       'fleet:write',
    'clients:view',     'clients:write',
    'workflows:view',   'workflows:write',
    'analytics:view',
    'threat-intel:view',
    'activity:view',
    'notifications:view',
    'users:view',       // can view users, not write
    'settings:view',
    'ai-operations:view',
    'audit:view',
  ],
  analyst: [
    'dashboard:view',
    'incidents:view',
    'risk:view',        'risk:write',
    'reports:view',     'reports:write',
    'fleet:view',       // read-only fleet
    'clients:view',
    'analytics:view',
    'threat-intel:view',
    'notifications:view',
    'settings:view',
    'ai-operations:view',
  ],
  client: [
    'dashboard:view',
    'reports:view',     // own reports only — enforced at query level
    'notifications:view',
    'settings:view',
  ],
  viewer: [
    'dashboard:view',
    'notifications:view',
  ],
};

// ── Route → required permission map ──────────────────────────
export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  '/dashboard':        'dashboard:view',
  '/incidents':        'incidents:view',
  '/risk-assessments': 'risk:view',
  '/reports':          'reports:view',
  '/fleet':            'fleet:view',
  '/clients':          'clients:view',
  '/workflows':        'workflows:view',
  '/analytics':        'analytics:view',
  '/threat-intel':     'threat-intel:view',
  '/activity':         'activity:view',
  '/notifications':    'notifications:view',
  '/users':            'users:view',
  '/settings':         'settings:view',
  '/ai-operations':    'ai-operations:view',
  '/admin':            'admin:all',
};

// ── Core helpers ──────────────────────────────────────────────

/** Check if a role has a specific permission */
export function hasPermission(role: Role | string | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  const perms = ROLE_PERMISSIONS[role as Role];
  if (!perms) return false;
  return perms.includes('admin:all') || perms.includes(permission);
}

/** Check if a role can access a specific route */
export function canAccessRoute(role: Role | string | null | undefined, pathname: string): boolean {
  // Match exact route or prefix
  const required = ROUTE_PERMISSIONS[pathname]
    ?? Object.entries(ROUTE_PERMISSIONS).find(([r]) => pathname.startsWith(r))?.[1];

  if (!required) return true; // No permission required — allow
  return hasPermission(role, required);
}

/** Get all permissions for a role */
export function getPermissions(role: Role | string): Permission[] {
  return ROLE_PERMISSIONS[role as Role] ?? [];
}

/** Role display label */
export const ROLE_LABELS: Record<Role, string> = {
  admin:    'Administrator',
  director: 'Director',
  analyst:  'Analyst',
  client:   'Client',
  viewer:   'Viewer',
};

/** Role color config for UI */
export const ROLE_COLORS: Record<Role, { text: string; bg: string; border: string }> = {
  admin:    { text: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/25'  },
  director: { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/25'   },
  analyst:  { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/25' },
  client:   { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/25'  },
  viewer:   { text: 'text-white/40',   bg: 'bg-white/[0.05]',  border: 'border-white/[0.1]'   },
};

/** Check if role is privileged (admin or director) */
export function isPrivileged(role: Role | string | null | undefined): boolean {
  return role === 'admin' || role === 'director';
}

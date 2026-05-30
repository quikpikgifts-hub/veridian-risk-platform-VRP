/**
 * lib/services/users.ts
 * User/profile data access layer.
 * Queries Supabase `profiles` table when configured; falls back to mock data.
 *
 * NOTE: User management requires admin/service-role access.
 *       Never expose service role key to the client.
 */
import type { User } from '@/types';
import { mockUsers } from '@/lib/mock-data';
import { getServiceClient } from './db';

export async function getUsers(): Promise<User[]> {
  const db = getServiceClient();
  if (!db) return mockUsers;

  const { data, error } = await db
    .from('profiles')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('[users.service] getUsers:', error.message);
    return mockUsers;
  }

  return (data ?? []).map(mapRow);
}

export async function getUserById(id: string): Promise<User | null> {
  const db = getServiceClient();
  if (!db) return mockUsers.find(u => u.id === id) ?? null;

  const { data, error } = await db
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    if (error?.code !== 'PGRST116') {
      console.error('[users.service] getUserById:', error?.message);
    }
    return mockUsers.find(u => u.id === id) ?? null;
  }

  return mapRow(data);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = getServiceClient();
  if (!db) return mockUsers.find(u => u.email === email) ?? null;

  const { data, error } = await db
    .from('profiles')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error || !data) {
    return mockUsers.find(u => u.email === email) ?? null;
  }

  return mapRow(data);
}

export async function updateUserRole(
  id: string,
  role: string
): Promise<boolean> {
  const db = getServiceClient();
  if (!db) {
    console.info('[users.service] Demo mode — updateUserRole skipped.');
    return false;
  }

  const { error } = await db
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('[users.service] updateUserRole:', error.message);
    return false;
  }

  return true;
}

// ── Row → domain type ─────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): User {
  return {
    id:          row.id,
    name:        row.name,
    email:       row.email,
    role:        row.role,
    department:  row.department,
    lastLogin:   row.last_login,
    status:      row.status,
    permissions: row.permissions ?? [],
  };
}

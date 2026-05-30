/**
 * lib/audit.ts
 * Centralized audit log writer for Veridian Risk Platform.
 *
 * Writes to Supabase `audit_logs` table when DB is configured.
 * Falls back to structured console logging (dev/demo mode).
 *
 * Usage (server-side):
 *   import { writeAuditLog } from '@/lib/audit';
 *   await writeAuditLog({ action: 'login', resource: 'auth', userId, userEmail, success: true });
 *
 * Usage (client-side via API):
 *   POST /api/audit  { action, resource, resourceId?, details? }
 */

export type AuditAction =
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'password_reset_requested'
  | 'user_created'
  | 'user_updated'
  | 'user_deleted'
  | 'report_generated'
  | 'report_viewed'
  | 'incident_created'
  | 'incident_updated'
  | 'workflow_executed'
  | 'workflow_updated'
  | 'risk_assessment_created'
  | 'risk_assessment_updated'
  | 'consultation_submitted'
  | 'ai_agent_invoked'
  | 'settings_updated'
  | 'data_exported'
  | 'unauthorized_access_attempt';

export interface AuditEntry {
  action:       AuditAction | string;
  resource:     string;
  resourceId?:  string;
  userId?:      string;
  userEmail?:   string;
  userRole?:    string;
  ipAddress?:   string;
  userAgent?:   string;
  details?:     Record<string, unknown>;
  success?:     boolean;
}

/** Write an audit log entry. Gracefully no-ops when DB is unavailable. */
export async function writeAuditLog(entry: AuditEntry): Promise<void> {
  const supabaseUrl        = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey     = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const isConfigured       = supabaseUrl && serviceRoleKey &&
                             !supabaseUrl.includes('your-project-ref');

  const logRecord = {
    ...entry,
    timestamp: new Date().toISOString(),
    success:   entry.success ?? true,
  };

  if (!isConfigured) {
    // Dev/demo mode — structured console output
    console.info('[audit]', JSON.stringify(logRecord));
    return;
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl!, serviceRoleKey!, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from('audit_logs').insert({
      action:      logRecord.action,
      resource:    logRecord.resource,
      resource_id: logRecord.resourceId ?? null,
      user_id:     logRecord.userId     ?? null,
      user_email:  logRecord.userEmail  ?? null,
      user_role:   logRecord.userRole   ?? null,
      ip_address:  logRecord.ipAddress  ?? null,
      user_agent:  logRecord.userAgent  ?? null,
      details:     logRecord.details    ?? null,
      success:     logRecord.success,
      created_at:  logRecord.timestamp,
    });

    if (error) {
      console.error('[audit] Failed to write log:', error.message);
    }
  } catch (err) {
    // Never throw from audit — logging must not break the main request
    console.error('[audit] Unexpected error:', err);
  }
}

/**
 * Extract client identity from Next.js request headers.
 * Use in API route handlers after middleware sets x-user-* headers.
 */
export function extractRequestContext(headers: Headers) {
  return {
    userId:    headers.get('x-user-id')    ?? undefined,
    userEmail: headers.get('x-user-email') ?? undefined,
    userRole:  headers.get('x-user-role')  ?? undefined,
    ipAddress: headers.get('x-forwarded-for')?.split(',')[0]?.trim()
               ?? headers.get('x-real-ip')
               ?? undefined,
    userAgent: headers.get('user-agent') ?? undefined,
  };
}

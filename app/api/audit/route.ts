/**
 * app/api/audit/route.ts
 * Client-side audit event ingestion endpoint.
 *
 * Used by browser code to record events that can't be captured server-side
 * (e.g. login success after Supabase client auth, logout, page visits).
 *
 * POST /api/audit
 * Body: { action, resource, resourceId?, details? }
 * Headers: Authorization: Bearer <supabase-access-token>  (optional — best-effort)
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeAuditLog, extractRequestContext, AuditAction } from '@/lib/audit';

interface AuditPayload {
  action:      string;
  resource:    string;
  resourceId?: string;
  details?:    Record<string, unknown>;
  success?:    boolean;
}

export async function POST(request: NextRequest) {
  let body: AuditPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { action, resource, resourceId, details, success } = body;

  if (!action || !resource) {
    return NextResponse.json({ error: 'action and resource are required' }, { status: 400 });
  }

  const ctx = extractRequestContext(request.headers);

  await writeAuditLog({
    action:      action as AuditAction,
    resource,
    resourceId,
    userId:      ctx.userId,
    userEmail:   ctx.userEmail,
    userRole:    ctx.userRole,
    ipAddress:   ctx.ipAddress,
    userAgent:   ctx.userAgent,
    details,
    success:     success ?? true,
  });

  return NextResponse.json({ ok: true });
}

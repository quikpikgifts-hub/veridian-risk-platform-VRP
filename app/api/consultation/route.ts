/**
 * app/api/consultation/route.ts
 * Public endpoint — no auth required.
 *
 * POST /api/consultation
 * Body: ConsultationPayload
 *
 * Behaviour:
 *  1. Validates input
 *  2. Inserts to Supabase `consultations` table (when DB is configured)
 *  3. Falls back to structured console log in demo mode
 *  4. Writes audit log on submission
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeAuditLog } from '@/lib/audit';

interface ConsultationPayload {
  firstName:        string;
  lastName:         string;
  company:          string;
  email:            string;
  phone?:           string;
  industry:         string;
  services:         string[];
  message?:         string;
  preferredContact: 'email' | 'phone' | 'either';
}

function validatePayload(body: Partial<ConsultationPayload>): string | null {
  if (!body.firstName?.trim()) return 'First name is required.';
  if (!body.lastName?.trim())  return 'Last name is required.';
  if (!body.company?.trim())   return 'Company name is required.';
  if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    return 'A valid email address is required.';
  if (!body.industry?.trim())  return 'Industry is required.';
  if (!Array.isArray(body.services) || body.services.length === 0)
    return 'Please select at least one service.';
  return null;
}

export async function POST(request: NextRequest) {
  let body: Partial<ConsultationPayload>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const validationError = validatePayload(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 });
  }

  const entry = {
    first_name:        body.firstName!.trim(),
    last_name:         body.lastName!.trim(),
    company:           body.company!.trim(),
    email:             body.email!.trim().toLowerCase(),
    phone:             body.phone?.trim() ?? null,
    industry:          body.industry!.trim(),
    services:          body.services!,
    message:           body.message?.trim() ?? null,
    preferred_contact: body.preferredContact ?? 'email',
    ip_address:        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
                       ?? request.headers.get('x-real-ip') ?? null,
    submitted_at:      new Date().toISOString(),
  };

  const supabaseUrl    = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const isConfigured   = supabaseUrl && serviceRoleKey &&
                         !supabaseUrl.includes('your-project-ref');

  let consultationId: string | null = null;

  if (isConfigured) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl!, serviceRoleKey!, {
        auth: { persistSession: false },
      });
      const { data, error } = await supabase
        .from('consultations')
        .insert(entry)
        .select('id')
        .single();

      if (error) {
        console.error('[/api/consultation] DB insert failed:', error.message);
        // Don't fail the request — still confirm to the user
      } else {
        consultationId = data?.id ?? null;
      }
    } catch (err) {
      console.error('[/api/consultation] Unexpected DB error:', err);
    }
  } else {
    // Demo mode — log to console
    console.info('[consultation] Demo mode — new submission:', JSON.stringify(entry, null, 2));
  }

  // Audit log
  await writeAuditLog({
    action:     'consultation_submitted',
    resource:   'consultation',
    resourceId: consultationId ?? undefined,
    userEmail:  entry.email,
    ipAddress:  entry.ip_address ?? undefined,
    success:    true,
    details: {
      company:  entry.company,
      industry: entry.industry,
      services: entry.services,
    },
  });

  return NextResponse.json({
    ok:      true,
    message: 'Consultation request received. We will contact you within one business day.',
    id:      consultationId,
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { complete, openAIErrorResponse, TOKEN_LIMITS } from '@/lib/openai';
import { writeAuditLog, extractRequestContext } from '@/lib/audit';

export const runtime = 'nodejs';
export const maxDuration = 55;

const SYSTEM = `You are the senior report analyst for Veridian Risk & Resilience Group, LLC.
Principals:
- Steve Washington Smith: nearly 30 years law enforcement, JCF Detective Corporal, 13 commendations, OSHA 10-Hour General Industry (DOL), FEMA IS-100/200/700.
- Skeeter Adiansingh-Smith: 25+ years fleet operations, 3,500 government vehicles, BS HR Management, HRCI certified.
Output is always a DRAFT for Co-Founder review. Write professionally — executive, authoritative, practical.
OSHA violation fines: Other $0–15,625 | Serious up to $15,625 | Willful/Repeat up to $156,259 each.
Company: Veridian Risk & Resilience Group, LLC | +1 (407) 470-5992 | info@veridianriskgroup.com`;

export async function POST(req: NextRequest) {
  const ctx = extractRequestContext(req.headers);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: 'Invalid JSON.' }, { status: 400 });

    const { reportType = 'Operational Risk Assessment', incidentData = null,
            notes = '', clientName, extended = false } = body as Record<string, unknown>;

    if (!notes && !incidentData) {
      await writeAuditLog({
        action: 'report_generated', resource: 'report',
        ...ctx, success: false,
        details: { error: 'missing_content', reportType },
      });
      return NextResponse.json({ success: false, error: 'Provide notes or incidentData.' }, { status: 400 });
    }

    const user = `Generate a professional ${reportType}.
${clientName ? `Client: ${clientName}` : ''}
${incidentData ? `\nCase Data:\n${JSON.stringify(incidentData, null, 2)}` : ''}
${notes ? `\nField Notes:\n${notes}` : ''}

Structure:
1. EXECUTIVE SUMMARY (2–3 sentences)
2. KEY FINDINGS (3–5 specific observations with severity)
3. RISK ASSESSMENT (rating: Low/Moderate/High/Critical with OSHA/DOT citations)
4. RECOMMENDATIONS (3–5 numbered, prioritised, with suggested timeline)
5. NEXT STEPS

Label: DRAFT — Prepared for review by Steve Washington Smith, Managing Member.`;

    const result = await complete({
      system: SYSTEM, user,
      maxTokens: extended ? TOKEN_LIMITS.EXTENDED : TOKEN_LIMITS.STANDARD,
      temperature: 0.35,
    });

    await writeAuditLog({
      action: 'report_generated', resource: 'report',
      ...ctx, success: true,
      details: { reportType, clientName, extended, model: result.model,
                 outputTokens: result.outputTokens },
    });

    return NextResponse.json({
      success: true, report: result.output, reportType,
      model: result.model, inputTokens: result.inputTokens,
      outputTokens: result.outputTokens, timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[/api/generate-report]', error);
    await writeAuditLog({
      action: 'report_generated', resource: 'report',
      ...ctx, success: false,
      details: { error: String(error) },
    });
    const e = openAIErrorResponse(error);
    return NextResponse.json({ success: false, error: e.error, code: e.code }, { status: e.status });
  }
}

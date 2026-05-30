import { NextRequest, NextResponse } from 'next/server';
import { complete, openAIErrorResponse, TOKEN_LIMITS } from '@/lib/openai';
import { writeAuditLog, extractRequestContext } from '@/lib/audit';

export const runtime = 'nodejs';
export const maxDuration = 55;

const SYSTEM = `You are the incident analysis module for Veridian Risk & Resilience Group, LLC.
Analyse submitted incident data and produce a structured incident report.
Format with clear numbered sections. Write like a decorated law enforcement professional. No AI disclaimers.
Company: Veridian Risk & Resilience Group | Steve Washington Smith, Managing Member | +1 (407) 470-5992`;

export async function POST(req: NextRequest) {
  const ctx = extractRequestContext(req.headers);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: 'Invalid JSON.' }, { status: 400 });

    const { title, location, industry, severity, category,
            description, assignedTo, immediateActions, witnesses } = body as Record<string, unknown>;

    if (!description || typeof description !== 'string' || !description.trim()) {
      await writeAuditLog({
        action: 'incident_created', resource: 'incident',
        ...ctx, success: false,
        details: { error: 'missing_description' },
      });
      return NextResponse.json({ success: false, error: 'description is required.' }, { status: 400 });
    }

    const user = `Analyse this incident and produce a structured report:
Title: ${title ?? 'Not specified'}
Location: ${location ?? 'Not specified'}
Industry: ${industry ?? 'Not specified'}
Severity: ${severity ?? 'Not assessed'}
Category: ${category ?? 'Not specified'}
Assigned To: ${assignedTo ?? 'Not assigned'}
Witnesses: ${witnesses ?? 'Unknown'}
Description: ${description}
Immediate Actions: ${immediateActions ?? 'None documented'}

Produce sections:
1. INCIDENT SUMMARY
2. CONTRIBUTING FACTORS
3. RISK EXPOSURE
4. IMMEDIATE RESPONSE (next 24–72 hours)
5. RECOMMENDED REMEDIATION (cite OSHA/DOT standards where applicable)
6. DOCUMENTATION CHECKLIST

Label: DRAFT — For review by ${assignedTo ?? 'Steve Washington Smith'}.`;

    const result = await complete({ system: SYSTEM, user, maxTokens: TOKEN_LIMITS.STANDARD, temperature: 0.3 });

    await writeAuditLog({
      action: 'incident_created', resource: 'incident',
      ...ctx, success: true,
      details: { title: title ?? 'Untitled', severity, category, model: result.model },
    });

    return NextResponse.json({
      success: true, analysis: result.output,
      model: result.model, inputTokens: result.inputTokens,
      outputTokens: result.outputTokens, timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[/api/create-incident]', error);
    await writeAuditLog({
      action: 'incident_created', resource: 'incident',
      ...ctx, success: false,
      details: { error: String(error) },
    });
    const e = openAIErrorResponse(error);
    return NextResponse.json({ success: false, error: e.error, code: e.code }, { status: e.status });
  }
}

/**
 * lib/services/risk-assessments.ts
 * Risk assessment data access layer.
 * Queries Supabase `risk_assessments` table when configured; falls back to mock data.
 */
import type { RiskAssessment } from '@/types';
import { mockRiskAssessments } from '@/lib/mock-data';
import { getServiceClient } from './db';

export async function getRiskAssessments(): Promise<RiskAssessment[]> {
  const db = getServiceClient();
  if (!db) return mockRiskAssessments;

  const { data, error } = await db
    .from('risk_assessments')
    .select('*, risk_findings(*)')
    .order('assessed_at', { ascending: false });

  if (error) {
    console.error('[risk-assessments.service] getRiskAssessments:', error.message);
    return mockRiskAssessments;
  }

  return (data ?? []).map(mapRow);
}

export async function getRiskAssessmentById(
  id: string
): Promise<RiskAssessment | null> {
  const db = getServiceClient();
  if (!db) return mockRiskAssessments.find(r => r.id === id) ?? null;

  const { data, error } = await db
    .from('risk_assessments')
    .select('*, risk_findings(*)')
    .eq('id', id)
    .single();

  if (error || !data) {
    if (error?.code !== 'PGRST116') {
      console.error('[risk-assessments.service] getById:', error?.message);
    }
    return mockRiskAssessments.find(r => r.id === id) ?? null;
  }

  return mapRow(data);
}

export async function getRiskAssessmentsByClient(
  clientId: string
): Promise<RiskAssessment[]> {
  const db = getServiceClient();
  if (!db) return mockRiskAssessments.filter(r => r.clientId === clientId);

  const { data, error } = await db
    .from('risk_assessments')
    .select('*, risk_findings(*)')
    .eq('client_id', clientId)
    .order('assessed_at', { ascending: false });

  if (error) {
    console.error('[risk-assessments.service] getByClient:', error.message);
    return mockRiskAssessments.filter(r => r.clientId === clientId);
  }

  return (data ?? []).map(mapRow);
}

// ── Row → domain type ─────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): RiskAssessment {
  return {
    id:               row.id,
    clientId:         row.client_id,
    clientName:       row.client_name,
    industry:         row.industry,
    assessmentType:   row.assessment_type,
    status:           row.status,
    riskScore:        row.risk_score,
    previousScore:    row.previous_score,
    assessedBy:       row.assessed_by,
    assessedAt:       row.assessed_at,
    nextReview:       row.next_review,
    aiSummary:        row.ai_summary,
    recommendations:  row.recommendations ?? [],
    findings:         (row.risk_findings ?? []).map(mapFinding),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFinding(f: any): RiskAssessment['findings'][0] {
  return {
    id:           f.id,
    category:     f.category,
    description:  f.description,
    severity:     f.severity,
    standard:     f.standard,
    remediation:  f.remediation,
    status:       f.status,
  };
}

/**
 * lib/services/incidents.ts
 * Incident data access layer.
 * Queries Supabase `incidents` table when configured; falls back to mock data.
 */
import type { Incident } from '@/types';
import { mockIncidents } from '@/lib/mock-data';
import { getServiceClient } from './db';

export async function getIncidents(): Promise<Incident[]> {
  const db = getServiceClient();
  if (!db) return mockIncidents;

  const { data, error } = await db
    .from('incidents')
    .select('*')
    .order('reported_at', { ascending: false });

  if (error) {
    console.error('[incidents.service] getIncidents:', error.message);
    return mockIncidents;
  }

  return (data ?? []).map(mapRow);
}

export async function getIncidentById(id: string): Promise<Incident | null> {
  const db = getServiceClient();
  if (!db) return mockIncidents.find(i => i.id === id) ?? null;

  const { data, error } = await db
    .from('incidents')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    if (error?.code !== 'PGRST116') {
      console.error('[incidents.service] getIncidentById:', error?.message);
    }
    return mockIncidents.find(i => i.id === id) ?? null;
  }

  return mapRow(data);
}

export async function getIncidentsByStatus(
  status: Incident['status']
): Promise<Incident[]> {
  const db = getServiceClient();
  if (!db) return mockIncidents.filter(i => i.status === status);

  const { data, error } = await db
    .from('incidents')
    .select('*')
    .eq('status', status)
    .order('reported_at', { ascending: false });

  if (error) {
    console.error('[incidents.service] getIncidentsByStatus:', error.message);
    return mockIncidents.filter(i => i.status === status);
  }

  return (data ?? []).map(mapRow);
}

export async function createIncident(
  incident: Omit<Incident, 'id'>
): Promise<{ id: string } | null> {
  const db = getServiceClient();
  if (!db) {
    console.info('[incidents.service] Demo mode — createIncident skipped.');
    return null;
  }

  const { data, error } = await db
    .from('incidents')
    .insert({
      title:            incident.title,
      location:         incident.location,
      industry:         incident.industry,
      severity:         incident.severity,
      status:           incident.status,
      category:         incident.category,
      description:      incident.description,
      assigned_to:      incident.assignedTo,
      ai_summary:       incident.aiSummary,
      estimated_loss:   incident.estimatedLoss,
      witnesses:        incident.witnesses,
      tags:             incident.tags,
      reported_at:      incident.reportedAt ?? new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) {
    console.error('[incidents.service] createIncident:', error.message);
    return null;
  }

  return { id: data.id };
}

// ── Row → domain type ─────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Incident {
  return {
    id:             row.id,
    title:          row.title,
    location:       row.location,
    industry:       row.industry,
    severity:       row.severity,
    status:         row.status,
    category:       row.category,
    description:    row.description,
    assignedTo:     row.assigned_to,
    aiSummary:      row.ai_summary,
    estimatedLoss:  row.estimated_loss,
    witnesses:      row.witnesses,
    tags:           row.tags,
    reportedAt:     row.reported_at,
  };
}

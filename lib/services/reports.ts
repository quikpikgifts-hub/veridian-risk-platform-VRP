/**
 * lib/services/reports.ts
 * Report data access layer.
 * Queries Supabase `reports` table when configured; falls back to mock data.
 */
import type { Report } from '@/types';
import { mockReports } from '@/lib/mock-data';
import { getServiceClient } from './db';

export async function getReports(): Promise<Report[]> {
  const db = getServiceClient();
  if (!db) return mockReports;

  const { data, error } = await db
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[reports.service] getReports:', error.message);
    return mockReports;
  }

  return (data ?? []).map(mapRow);
}

export async function getReportById(id: string): Promise<Report | null> {
  const db = getServiceClient();
  if (!db) return mockReports.find(r => r.id === id) ?? null;

  const { data, error } = await db
    .from('reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    if (error?.code !== 'PGRST116') {
      console.error('[reports.service] getReportById:', error?.message);
    }
    return mockReports.find(r => r.id === id) ?? null;
  }

  return mapRow(data);
}

export async function getReportsByClient(clientId: string): Promise<Report[]> {
  const db = getServiceClient();
  if (!db) return mockReports.filter(r => r.clientId === clientId);

  const { data, error } = await db
    .from('reports')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[reports.service] getReportsByClient:', error.message);
    return mockReports.filter(r => r.clientId === clientId);
  }

  return (data ?? []).map(mapRow);
}

export async function getReportsByStatus(
  status: Report['status']
): Promise<Report[]> {
  const db = getServiceClient();
  if (!db) return mockReports.filter(r => r.status === status);

  const { data, error } = await db
    .from('reports')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[reports.service] getReportsByStatus:', error.message);
    return mockReports.filter(r => r.status === status);
  }

  return (data ?? []).map(mapRow);
}

// ── Row → domain type ─────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Report {
  return {
    id:           row.id,
    title:        row.title,
    type:         row.type,
    clientId:     row.client_id,
    clientName:   row.client_name,
    status:       row.status,
    createdBy:    row.created_by,
    createdAt:    row.created_at,
    updatedAt:    row.updated_at,
    pages:        row.pages,
    aiGenerated:  row.ai_generated,
    tags:         row.tags,
    content:      row.content,
  };
}

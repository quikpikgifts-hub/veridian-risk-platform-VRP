/**
 * lib/services/clients.ts
 * Client data access layer.
 * Queries Supabase `clients` table when configured; falls back to mock data.
 */
import type { Client } from '@/types';
import { mockClients } from '@/lib/mock-data';
import { getServiceClient } from './db';

export async function getClients(): Promise<Client[]> {
  const db = getServiceClient();
  if (!db) return mockClients;

  const { data, error } = await db
    .from('clients')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('[clients.service] getClients:', error.message);
    return mockClients;
  }

  return (data ?? []).map(mapRow);
}

export async function getClientById(id: string): Promise<Client | null> {
  const db = getServiceClient();
  if (!db) return mockClients.find(c => c.id === id) ?? null;

  const { data, error } = await db
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    if (error?.code !== 'PGRST116') {
      console.error('[clients.service] getClientById:', error?.message);
    }
    return mockClients.find(c => c.id === id) ?? null;
  }

  return mapRow(data);
}

export async function getClientsByStatus(
  status: Client['status']
): Promise<Client[]> {
  const db = getServiceClient();
  if (!db) return mockClients.filter(c => c.status === status);

  const { data, error } = await db
    .from('clients')
    .select('*')
    .eq('status', status)
    .order('name');

  if (error) {
    console.error('[clients.service] getClientsByStatus:', error.message);
    return mockClients.filter(c => c.status === status);
  }

  return (data ?? []).map(mapRow);
}

// ── Row → domain type ─────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Client {
  return {
    id:               row.id,
    name:             row.name,
    industry:         row.industry,
    riskScore:        row.risk_score,
    lastAssessment:   row.last_assessment,
    nextReview:       row.next_review,
    status:           row.status,
    incidents:        row.incidents,
    contact:          row.contact,
    phone:            row.phone,
    email:            row.email,
    contractValue:    row.contract_value,
    engagementLead:   row.engagement_lead,
  };
}

import { clsx, type ClassValue } from 'clsx';
import type { SeverityLevel, IncidentStatus, AgentStatus, WorkflowStatus, ReportStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} ${formatTime(iso)}`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24)  return `${hrs}h ago`;
  return `${days}d ago`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', minimumFractionDigits:0 }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function getRiskColor(score: number): string {
  if (score >= 8) return '#EF4444';
  if (score >= 6.5) return '#F59E0B';
  if (score >= 5) return '#3B82F6';
  return '#22C55E';
}

export function getRiskLabel(score: number): string {
  if (score >= 8) return 'Critical';
  if (score >= 6.5) return 'High';
  if (score >= 5) return 'Medium';
  return 'Low';
}

export const severityConfig: Record<SeverityLevel, { label:string; color:string; bg:string; border:string; variant:'critical'|'high'|'medium'|'low' }> = {
  critical: { label:'Critical', color:'#EF4444', bg:'rgba(239,68,68,0.12)', border:'rgba(239,68,68,0.35)', variant:'critical' },
  high:     { label:'High',     color:'#F59E0B', bg:'rgba(245,158,11,0.12)', border:'rgba(245,158,11,0.35)', variant:'high' },
  medium:   { label:'Medium',   color:'#3B82F6', bg:'rgba(59,130,246,0.12)', border:'rgba(59,130,246,0.35)', variant:'medium' },
  low:      { label:'Low',      color:'#22C55E', bg:'rgba(34,197,94,0.12)', border:'rgba(34,197,94,0.35)', variant:'low' },
};

export const statusConfig: Record<IncidentStatus, { label:string; color:string; bg:string }> = {
  active:        { label:'Active',        color:'#EF4444', bg:'rgba(239,68,68,0.12)' },
  investigating: { label:'Investigating', color:'#F59E0B', bg:'rgba(245,158,11,0.12)' },
  contained:     { label:'Contained',     color:'#3B82F6', bg:'rgba(59,130,246,0.12)' },
  resolved:      { label:'Resolved',      color:'#22C55E', bg:'rgba(34,197,94,0.12)' },
};

export const agentStatusConfig: Record<AgentStatus, { label:string; color:string; pulse:boolean }> = {
  active:     { label:'Active',     color:'#22C55E', pulse:true },
  processing: { label:'Processing', color:'#3B82F6', pulse:true },
  standby:    { label:'Standby',    color:'#F59E0B', pulse:false },
  offline:    { label:'Offline',    color:'#A3A3A3', pulse:false },
};

export const workflowStatusConfig: Record<WorkflowStatus, { label:string; color:string; bg:string }> = {
  pending:   { label:'Pending',   color:'#A3A3A3', bg:'rgba(163,163,163,0.12)' },
  running:   { label:'Running',   color:'#3B82F6', bg:'rgba(59,130,246,0.12)' },
  completed: { label:'Completed', color:'#22C55E', bg:'rgba(34,197,94,0.12)' },
  failed:    { label:'Failed',    color:'#EF4444', bg:'rgba(239,68,68,0.12)' },
  paused:    { label:'Paused',    color:'#F59E0B', bg:'rgba(245,158,11,0.12)' },
};

export const reportStatusConfig: Record<ReportStatus, { label:string; color:string; bg:string }> = {
  draft:     { label:'Draft',     color:'#A3A3A3', bg:'rgba(163,163,163,0.12)' },
  review:    { label:'In Review', color:'#F59E0B', bg:'rgba(245,158,11,0.12)' },
  approved:  { label:'Approved',  color:'#3B82F6', bg:'rgba(59,130,246,0.12)' },
  delivered: { label:'Delivered', color:'#22C55E', bg:'rgba(34,197,94,0.12)' },
};

export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function classifyRisk(score: number): SeverityLevel {
  if (score >= 8) return 'critical';
  if (score >= 6.5) return 'high';
  if (score >= 5) return 'medium';
  return 'low';
}

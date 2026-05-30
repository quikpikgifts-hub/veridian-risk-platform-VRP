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
  if (score >= 8) return '#E74C3C';
  if (score >= 6.5) return '#E67E22';
  if (score >= 5) return '#F1C40F';
  return '#2ECC71';
}

export function getRiskLabel(score: number): string {
  if (score >= 8) return 'Critical';
  if (score >= 6.5) return 'High';
  if (score >= 5) return 'Medium';
  return 'Low';
}

export const severityConfig: Record<SeverityLevel, { label:string; color:string; bg:string; border:string; variant:'critical'|'high'|'medium'|'low' }> = {
  critical: { label:'Critical', color:'#E74C3C', bg:'rgba(231,76,60,0.12)',  border:'rgba(231,76,60,0.35)',  variant:'critical' },
  high:     { label:'High',     color:'#E67E22', bg:'rgba(230,126,34,0.12)', border:'rgba(230,126,34,0.35)', variant:'high'     },
  medium:   { label:'Medium',   color:'#F1C40F', bg:'rgba(241,196,15,0.12)', border:'rgba(241,196,15,0.35)', variant:'medium'   },
  low:      { label:'Low',      color:'#2ECC71', bg:'rgba(46,204,113,0.12)', border:'rgba(46,204,113,0.35)', variant:'low'      },
};

export const statusConfig: Record<IncidentStatus, { label:string; color:string; bg:string }> = {
  active:        { label:'Active',        color:'#E74C3C', bg:'rgba(231,76,60,0.12)'   },
  investigating: { label:'Investigating', color:'#E67E22', bg:'rgba(230,126,34,0.12)'  },
  contained:     { label:'Contained',     color:'#3498DB', bg:'rgba(52,152,219,0.12)'  },
  resolved:      { label:'Resolved',      color:'#2ECC71', bg:'rgba(46,204,113,0.12)'  },
};

export const agentStatusConfig: Record<AgentStatus, { label:string; color:string; pulse:boolean }> = {
  active:     { label:'Active',     color:'#2ECC71', pulse:true  },
  processing: { label:'Processing', color:'#3498DB', pulse:true  },
  standby:    { label:'Standby',    color:'#E67E22', pulse:false },
  offline:    { label:'Offline',    color:'#8A8AA8', pulse:false },
};

export const workflowStatusConfig: Record<WorkflowStatus, { label:string; color:string; bg:string }> = {
  pending:   { label:'Pending',   color:'#8A8AA8', bg:'rgba(138,138,168,0.12)' },
  running:   { label:'Running',   color:'#3498DB', bg:'rgba(52,152,219,0.12)'  },
  completed: { label:'Completed', color:'#2ECC71', bg:'rgba(46,204,113,0.12)'  },
  failed:    { label:'Failed',    color:'#E74C3C', bg:'rgba(231,76,60,0.12)'   },
  paused:    { label:'Paused',    color:'#E67E22', bg:'rgba(230,126,34,0.12)'  },
};

export const reportStatusConfig: Record<ReportStatus, { label:string; color:string; bg:string }> = {
  draft:     { label:'Draft',     color:'#8A8AA8', bg:'rgba(138,138,168,0.12)' },
  review:    { label:'In Review', color:'#E67E22', bg:'rgba(230,126,34,0.12)'  },
  approved:  { label:'Approved',  color:'#3498DB', bg:'rgba(52,152,219,0.12)'  },
  delivered: { label:'Delivered', color:'#2ECC71', bg:'rgba(46,204,113,0.12)'  },
};

export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
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

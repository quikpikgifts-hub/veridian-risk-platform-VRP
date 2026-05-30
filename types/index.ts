// ============================================================
// VERIDIAN AI WORKFORCE PLATFORM — Type System
// Enterprise-grade type definitions for all platform modules
// ============================================================

// ── Severity & Status Enums ──────────────────────────────────
export type SeverityLevel   = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus  = 'active' | 'investigating' | 'contained' | 'resolved';
export type ThreatCategory  = 'workplace-violence' | 'theft' | 'trespass' | 'safety' | 'compliance' | 'fleet';
export type AgentStatus     = 'active' | 'standby' | 'processing' | 'offline';
export type ClientStatus    = 'active' | 'pending' | 'review' | 'inactive';
export type UserRole        = 'admin' | 'operator' | 'analyst' | 'client' | 'viewer';
export type FleetStatus     = 'active' | 'maintenance' | 'inactive' | 'violation';
export type WorkflowStatus  = 'pending' | 'running' | 'completed' | 'failed' | 'paused';
export type ReportStatus    = 'draft' | 'review' | 'approved' | 'delivered';
export type NotifPriority   = 'critical' | 'high' | 'medium' | 'low' | 'info';

// ── Core Entities ─────────────────────────────────────────────
export interface Incident {
  id: string;
  title: string;
  location: string;
  industry: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  category: ThreatCategory;
  reportedAt: string;
  updatedAt?: string;
  assignedTo: string;
  description: string;
  aiSummary?: string;
  tags?: string[];
  coordinates?: { lat: number; lng: number };
  responseTime?: number;
  witnesses?: number;
  estimatedLoss?: number;
}

export interface ThreatFeed {
  id: string;
  title: string;
  source: string;
  severity: SeverityLevel;
  category: ThreatCategory;
  timestamp: string;
  location: string;
  summary: string;
  actionable: boolean;
  tags?: string[];
  url?: string;
}

export interface KpiCard {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'flat';
  positive: boolean;
  icon?: string;
  suffix?: string;
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  tasksToday: number;
  lastAction: string;
  successRate?: number;
  avgResponseTime?: string;
  capabilities?: string[];
  division?: 'risk' | 'fleet' | 'hr' | 'ops' | 'intel' | 'marketing';
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  riskScore: number;
  lastAssessment: string;
  nextReview: string;
  status: ClientStatus;
  incidents: number;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  contractValue?: number;
  engagementLead?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'suspended';
  permissions?: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  priority: NotifPriority;
  timestamp: string;
  read: boolean;
  type: 'incident' | 'ai' | 'system' | 'client' | 'fleet' | 'report';
  actionUrl?: string;
  actionLabel?: string;
}

// ── Fleet Module ───────────────────────────────────────────────
export interface FleetVehicle {
  id: string;
  name: string;
  type: 'truck' | 'van' | 'car' | 'bus' | 'emergency';
  plate: string;
  status: FleetStatus;
  driver?: string;
  mileage: number;
  lastInspection: string;
  nextMaintenance: string;
  violations: number;
  location?: string;
  dotCompliant: boolean;
  fuelType: 'diesel' | 'gasoline' | 'electric' | 'hybrid';
  year: number;
  make: string;
  model: string;
}

export interface FleetInspection {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: 'pre-trip' | 'post-trip' | 'scheduled' | 'dot';
  status: 'pass' | 'fail' | 'conditional';
  inspectedBy: string;
  date: string;
  findings: string[];
  violations?: string[];
  signedOff: boolean;
}

// ── Risk Assessment Module ─────────────────────────────────────
export interface RiskAssessment {
  id: string;
  clientId: string;
  clientName: string;
  industry: string;
  assessmentType: 'initial' | 'follow-up' | 'annual' | 'incident-triggered';
  status: ReportStatus;
  riskScore: number;
  previousScore?: number;
  assessedBy: string;
  assessedAt: string;
  nextReview: string;
  findings: RiskFinding[];
  recommendations: string[];
  aiSummary?: string;
}

export interface RiskFinding {
  id: string;
  category: string;
  description: string;
  severity: SeverityLevel;
  standard?: string;
  remediation: string;
  dueDate?: string;
  status: 'open' | 'in-progress' | 'resolved';
}

// ── Workflow Engine ────────────────────────────────────────────
export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: 'manual' | 'scheduled' | 'incident' | 'lead' | 'review';
  status: WorkflowStatus;
  steps: WorkflowStep[];
  createdAt: string;
  lastRun?: string;
  nextRun?: string;
  runsTotal: number;
  successRate: number;
  assignedAgent?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'ai-task' | 'notification' | 'document' | 'approval' | 'delay' | 'condition';
  status: 'pending' | 'active' | 'done' | 'failed' | 'skipped';
  duration?: string;
  assignee?: string;
  output?: string;
}

// ── Report Module ───────────────────────────────────────────────
export interface Report {
  id: string;
  title: string;
  type: 'risk-assessment' | 'incident' | 'osha' | 'fleet' | 'executive' | 'de-escalation' | 'proposal';
  clientId?: string;
  clientName?: string;
  status: ReportStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  pages?: number;
  aiGenerated: boolean;
  tags: string[];
  fileUrl?: string;
}

// ── Analytics ─────────────────────────────────────────────────
export interface AnalyticsDataPoint {
  period: string;
  value: number;
  comparison?: number;
  label?: string;
}

export interface DashboardMetric {
  id: string;
  name: string;
  value: number | string;
  change: number;
  changeLabel: string;
  trend: 'up' | 'down' | 'flat';
  positive: boolean;
  sparkline?: number[];
}

// ── Audit Log ─────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  success: boolean;
}

// ── API Response Wrappers ──────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

// ── UI State ───────────────────────────────────────────────────
export interface FilterState {
  search: string;
  severity?: SeverityLevel | 'all';
  status?: string | 'all';
  dateRange?: { from: string; to: string };
  assignee?: string;
  industry?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// ── Chart Data ─────────────────────────────────────────────────
export interface ChartDataPoint {
  month?: string;
  name?: string;
  value?: number;
  incidents?: number;
  resolved?: number;
  critical?: number;
  risk?: number;
  color?: string;
  fill?: string;
}

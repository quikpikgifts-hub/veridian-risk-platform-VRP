import type {
  Incident, ThreatFeed, KpiCard, AIAgent, Client,
  FleetVehicle, FleetInspection, RiskAssessment,
  Workflow, Report, Notification, User, AuditLog
} from '@/types';

// ── Incidents ─────────────────────────────────────────────────
export const mockIncidents: Incident[] = [
  { id:'INC-2025-001', title:'Verbal Altercation — Retail Floor', location:'Orange Ave Gas Station', industry:'Retail / Fuel', severity:'high', status:'investigating', category:'workplace-violence', reportedAt:'2025-05-20T09:14:00', assignedTo:'Steve Smith', description:'Customer-staff verbal confrontation escalated near register. De-escalation protocol initiated.', aiSummary:'Pattern consistent with 3 prior events at this location. Recommend de-escalation training.', tags:['de-escalation','customer-facing'], estimatedLoss:0, witnesses:2 },
  { id:'INC-2025-002', title:'Unauthorized Entry — After Hours', location:'Palmetto Apartments Complex A', industry:'Property Management', severity:'critical', status:'active', category:'trespass', reportedAt:'2025-05-20T02:33:00', assignedTo:'Steve Smith', description:'Motion sensors triggered in restricted parking garage. Individual bypassed access gate.', aiSummary:'Access control vulnerability identified. Gate mechanism requires immediate review.', tags:['access-control','after-hours'] },
  { id:'INC-2025-003', title:'Vehicle Inventory Discrepancy', location:'Premier Auto Group — Lot B', industry:'Dealership', severity:'high', status:'investigating', category:'theft', reportedAt:'2025-05-19T16:45:00', assignedTo:'Steve Smith', description:'End-of-day inventory check shows one vehicle unaccounted for. Reviewing camera footage.', aiSummary:'Lot B has documented camera blind spot. Recommend camera repositioning.', estimatedLoss:28000 },
  { id:'INC-2025-004', title:'Slip and Fall — Parking Lot', location:'Westside Church Campus', industry:'Religious Organization', severity:'medium', status:'contained', category:'safety', reportedAt:'2025-05-19T11:22:00', assignedTo:'Steve Smith', description:'Visitor slipped on unmarked wet surface near main entrance. Medical assistance provided.', aiSummary:'Premises liability exposure. Immediate signage and surface treatment recommended.', witnesses:3 },
  { id:'INC-2025-005', title:'Driver Hours Violation', location:'FastRoute Logistics — Fleet', industry:'Transportation', severity:'medium', status:'resolved', category:'compliance', reportedAt:'2025-05-18T08:00:00', assignedTo:'Skeeter Smith', description:'Log review identified driver exceeding DOT hours of service regulations.', aiSummary:'Recurring compliance gap in fleet scheduling system. Audit recommended.', tags:['dot','fleet'] },
  { id:'INC-2025-006', title:'Shoplifting — Organized', location:'Sunrise Retail Center', industry:'Retail', severity:'high', status:'investigating', category:'theft', reportedAt:'2025-05-18T14:30:00', assignedTo:'Steve Smith', description:'Three-person coordinated theft. Estimated $2,400 loss.', aiSummary:'Organized retail crime pattern. Coordinate with neighboring stores.', estimatedLoss:2400, witnesses:1 },
  { id:'INC-2025-007', title:'OSHA Violation — Construction Zone', location:'Meridian Construction Site', industry:'Construction', severity:'critical', status:'active', category:'compliance', reportedAt:'2025-05-17T13:15:00', assignedTo:'Steve Smith', description:'Workers observed without required PPE in designated hard hat zone.', aiSummary:'Second OSHA event in 30 days. Escalated compliance training required.', tags:['osha','ppe','construction'] },
  { id:'INC-2025-008', title:'Suspicious Package Report', location:'Harbor Point Hotel — Lobby', industry:'Hospitality', severity:'medium', status:'resolved', category:'safety', reportedAt:'2025-05-17T09:45:00', assignedTo:'Steve Smith', description:'Unattended bag in lobby. Emergency protocol activated. Determined to be guest property.', aiSummary:'Emergency response protocol performed correctly. No action needed.' },
];

// ── Threat Feed ────────────────────────────────────────────────
export const mockThreatFeed: ThreatFeed[] = [
  { id:'TF-001', title:'Retail Crime Spike — Orange County', source:'OCSO Public Records', severity:'high', category:'theft', timestamp:'2025-05-20T08:00:00', location:'Orange County, FL', summary:'34% increase in organized retail theft this quarter. High-risk: Semoran Blvd corridor.', actionable:true },
  { id:'TF-002', title:'Active Threat Training Advisory', source:'DHS Bulletin', severity:'medium', category:'workplace-violence', timestamp:'2025-05-20T06:30:00', location:'Nationwide', summary:'DHS updated active threat response guidelines for commercial properties. Churches and schools highlighted.', actionable:true },
  { id:'TF-003', title:'Fleet Safety Alert — I-4 Corridor', source:'FDOT Safety Report', severity:'medium', category:'fleet', timestamp:'2025-05-19T15:00:00', location:'I-4 Central Florida', summary:'FDOT identifies high-incident zones on I-4 between exits 72-88. Commercial vehicle operators advised.', actionable:true },
  { id:'TF-004', title:'OSHA Priority Inspection Initiative', source:'OSHA Region 4', severity:'high', category:'compliance', timestamp:'2025-05-19T10:00:00', location:'Central Florida', summary:'Targeted enforcement campaign for construction and general industry through Q3.', actionable:true },
  { id:'TF-005', title:'Apartment Complex Crime Trend', source:'Crime Data Analysis', severity:'medium', category:'trespass', timestamp:'2025-05-18T14:00:00', location:'Metro Orlando', summary:'28% rise in trespass incidents at multi-family residential. Access control primary gap.', actionable:true },
  { id:'TF-006', title:'Workplace Violence Prevention Act Update', source:'FL Legislature', severity:'low', category:'compliance', timestamp:'2025-05-17T09:00:00', location:'Florida', summary:'New employer documentation requirements effective July 2025.', actionable:true },
];

// ── KPIs ───────────────────────────────────────────────────────
export const mockKpis: KpiCard[] = [
  { label:'Active Incidents',   value:4,     change:'+2 this week', trend:'up',   positive:false, icon:'alert' },
  { label:'Risk Assessments',   value:12,    change:'+3 this month', trend:'up',  positive:true,  icon:'shield' },
  { label:'Clients Protected',  value:9,     change:'Steady',        trend:'flat',positive:true,  icon:'users' },
  { label:'Avg Risk Score',     value:'6.4', change:'-0.8 vs last',  trend:'down',positive:true,  icon:'gauge' },
  { label:'AI Tasks Today',     value:47,    change:'+12 vs avg',    trend:'up',  positive:true,  icon:'cpu' },
  { label:'Open Workflows',     value:8,     change:'3 due today',   trend:'up',  positive:false, icon:'workflow' },
  { label:'Fleet Compliance',   value:'94%', change:'+2% this week', trend:'up',  positive:true,  icon:'truck' },
  { label:'Reports Generated',  value:23,    change:'This month',    trend:'up',  positive:true,  icon:'file' },
];

// ── AI Agents ──────────────────────────────────────────────────
export const mockAIAgents: AIAgent[] = [
  { id:'agt-01', name:'Operations Manager',    role:'Daily Workflow & Escalation',  status:'active',     tasksToday:8,  lastAction:'Generated morning operations briefing',              successRate:98, avgResponseTime:'1.2s', division:'ops',     capabilities:['briefings','routing','escalation'] },
  { id:'agt-02', name:'Intake Coordinator',    role:'Lead Capture & Onboarding',    status:'active',     tasksToday:3,  lastAction:'Sent intake form to Palmetto Apartments',            successRate:96, avgResponseTime:'2.1s', division:'ops',     capabilities:['lead-capture','questionnaires','crm'] },
  { id:'agt-03', name:'Risk Analyst',          role:'Assessment Report Drafting',   status:'processing', tasksToday:2,  lastAction:'Drafting OSHA report for Orange Ave Gas Station',    successRate:94, avgResponseTime:'8.4s', division:'risk',    capabilities:['reports','osha','risk-scoring'] },
  { id:'agt-04', name:'Intelligence Analyst',  role:'Situational Awareness',        status:'active',     tasksToday:5,  lastAction:'Updated Orange County threat brief',                 successRate:97, avgResponseTime:'3.8s', division:'intel',   capabilities:['intel-briefs','threat-analysis','research'] },
  { id:'agt-05', name:'Proposal Writer',       role:'Document Generation',          status:'active',     tasksToday:1,  lastAction:'Generated proposal for FastRoute Logistics',         successRate:95, avgResponseTime:'12s',  division:'ops',     capabilities:['proposals','engagement-letters','pricing'] },
  { id:'agt-06', name:'Follow-Up Coordinator', role:'Client Retention',             status:'standby',    tasksToday:0,  lastAction:'Scheduled 90-day review for Westside Church',       successRate:99, avgResponseTime:'1.8s', division:'ops',     capabilities:['follow-ups','scheduling','retention'] },
  { id:'agt-07', name:'Marketing Agent',       role:'Business Development',         status:'active',     tasksToday:2,  lastAction:'Drafted LinkedIn post — workplace violence stats',   successRate:91, avgResponseTime:'5.2s', division:'marketing',capabilities:['content','linkedin','cold-outreach'] },
  { id:'agt-08', name:'Fleet Safety Advisor',  role:'DOT Compliance & Fleet Risk',  status:'active',     tasksToday:4,  lastAction:'DOT compliance audit: FastRoute Logistics complete', successRate:96, avgResponseTime:'6.1s', division:'fleet',   capabilities:['fleet-safety','dot','driver-risk'] },
  { id:'agt-09', name:'HR Advisor',            role:'HR Risk & Workforce Policy',   status:'active',     tasksToday:2,  lastAction:'Drafted HR policy for Meridian Construction',       successRate:93, avgResponseTime:'7.3s', division:'hr',      capabilities:['hr-policy','termination-risk','onboarding'] },
  { id:'agt-10', name:'OSHA Compliance Advisor',role:'Federal Standards Compliance',status:'active',     tasksToday:3,  lastAction:'Generated 29 CFR 1910 audit: Orange Ave Gas',       successRate:97, avgResponseTime:'9.2s', division:'risk',    capabilities:['osha','29cfr1910','compliance-reports'] },
  { id:'agt-11', name:'De-Escalation Advisor', role:'Conflict Prevention',          status:'standby',    tasksToday:1,  lastAction:'Workshop advisory plan: Sunstate Restaurant',       successRate:94, avgResponseTime:'4.5s', division:'risk',    capabilities:['de-escalation','protocols','workshops'] },
];

// ── Clients ────────────────────────────────────────────────────
export const mockClients: Client[] = [
  { id:'APT001', name:'Palmetto Apartments',   industry:'Property Management', riskScore:7.8, lastAssessment:'2025-03-15', nextReview:'2025-06-15', status:'active', incidents:2, contact:'Maria Torres',    phone:'(407) 555-0101', email:'mtorres@palmettoapt.com',   contractValue:1800, engagementLead:'Steve Smith' },
  { id:'GAS001', name:'Orange Ave Gas Station',industry:'Retail / Fuel',       riskScore:8.2, lastAssessment:'2025-04-02', nextReview:'2025-07-02', status:'review', incidents:3, contact:'Raj Patel',       phone:'(407) 555-0202', email:'rpatel@oranavegas.com',      contractValue:1200, engagementLead:'Steve Smith' },
  { id:'DLR001', name:'Premier Auto Group',    industry:'Dealership',          riskScore:6.5, lastAssessment:'2025-04-20', nextReview:'2025-07-20', status:'active', incidents:1, contact:'James Wilson',    phone:'(407) 555-0303', email:'jwilson@premierauto.com',    contractValue:2500, engagementLead:'Steve Smith' },
  { id:'CHR001', name:'Westside Church',       industry:'Religious Org',       riskScore:4.2, lastAssessment:'2025-05-01', nextReview:'2025-08-01', status:'active', incidents:1, contact:'Pastor Greg Lane', phone:'(407) 555-0404', email:'glane@westsidechurch.com',   contractValue:999,  engagementLead:'Steve Smith' },
  { id:'LOG001', name:'FastRoute Logistics',   industry:'Transportation',      riskScore:6.9, lastAssessment:'2025-02-28', nextReview:'2025-05-28', status:'review', incidents:2, contact:'David Chen',      phone:'(407) 555-0505', email:'dchen@fastroutelog.com',     contractValue:3200, engagementLead:'Skeeter Smith' },
  { id:'RTL001', name:'Sunrise Retail Center', industry:'Retail',              riskScore:7.1, lastAssessment:'2025-03-10', nextReview:'2025-06-10', status:'active', incidents:1, contact:'Lisa Park',       phone:'(407) 555-0606', email:'lpark@sunriseretail.com',    contractValue:1500, engagementLead:'Steve Smith' },
  { id:'CON001', name:'Meridian Construction', industry:'Construction',        riskScore:8.9, lastAssessment:'2025-04-15', nextReview:'2025-07-15', status:'review', incidents:2, contact:'Mike Johnson',    phone:'(407) 555-0707', email:'mjohnson@meridiancon.com',   contractValue:4800, engagementLead:'Steve Smith' },
  { id:'HTL001', name:'Harbor Point Hotel',    industry:'Hospitality',         riskScore:5.4, lastAssessment:'2025-05-05', nextReview:'2025-08-05', status:'active', incidents:1, contact:'Sarah Kim',       phone:'(407) 555-0808', email:'skim@harborpointhotel.com',  contractValue:2100, engagementLead:'Steve Smith' },
];

// ── Fleet ─────────────────────────────────────────────────────
export const mockFleet: FleetVehicle[] = [
  { id:'VEH-001', name:'Unit 1 — Delivery', type:'truck', plate:'FL-4827-XK', status:'active',      driver:'Carlos Ruiz',     mileage:89234, lastInspection:'2025-05-10', nextMaintenance:'2025-06-10', violations:0, location:'I-4 Eastbound', dotCompliant:true,  fuelType:'diesel', year:2022, make:'Ford',    model:'F-650' },
  { id:'VEH-002', name:'Unit 2 — Cargo',   type:'van',   plate:'FL-2934-MB', status:'maintenance', driver:'Unassigned',      mileage:54102, lastInspection:'2025-04-28', nextMaintenance:'2025-05-28', violations:1, location:'Shop Bay 2',   dotCompliant:false, fuelType:'gasoline',year:2021, make:'Mercedes',model:'Sprinter' },
  { id:'VEH-003', name:'Unit 3 — Express', type:'van',   plate:'FL-8821-TP', status:'active',      driver:'Maria Santos',    mileage:67890, lastInspection:'2025-05-15', nextMaintenance:'2025-07-15', violations:0, location:'US-17/92 S',   dotCompliant:true,  fuelType:'gasoline',year:2023, make:'Ford',    model:'Transit' },
  { id:'VEH-004', name:'Unit 4 — Heavy',   type:'truck', plate:'FL-3341-VW', status:'violation',   driver:'James Powell',    mileage:112500,lastInspection:'2025-03-20', nextMaintenance:'2025-05-20', violations:3, location:'Orange Ave',   dotCompliant:false, fuelType:'diesel', year:2020, make:'Freightliner',model:'M2' },
  { id:'VEH-005', name:'Unit 5 — Fleet',   type:'car',   plate:'FL-9912-CS', status:'active',      driver:'Skeeter Smith',   mileage:34521, lastInspection:'2025-05-18', nextMaintenance:'2025-08-18', violations:0, location:'Sanford HQ',  dotCompliant:true,  fuelType:'hybrid', year:2024, make:'Toyota',  model:'Camry' },
  { id:'VEH-006', name:'Unit 6 — Survey',  type:'car',   plate:'FL-7754-NR', status:'inactive',    driver:'Unassigned',      mileage:28000, lastInspection:'2025-02-10', nextMaintenance:'2025-05-10', violations:0, location:'HQ Lot',      dotCompliant:true,  fuelType:'gasoline',year:2022, make:'Honda',   model:'CR-V' },
];

export const mockInspections: FleetInspection[] = [
  { id:'INS-001', vehicleId:'VEH-001', vehicleName:'Unit 1 — Delivery', type:'pre-trip', status:'pass', inspectedBy:'Carlos Ruiz', date:'2025-05-20T06:00:00', findings:['Tires: Good','Lights: Good','Brakes: Good'], signedOff:true },
  { id:'INS-002', vehicleId:'VEH-004', vehicleName:'Unit 4 — Heavy', type:'dot', status:'fail', inspectedBy:'Steve Smith', date:'2025-05-19T14:00:00', findings:['Brake pads worn'], violations:['FMCSA 393.47 — Brake System'], signedOff:false },
  { id:'INS-003', vehicleId:'VEH-003', vehicleName:'Unit 3 — Express', type:'pre-trip', status:'pass', inspectedBy:'Maria Santos', date:'2025-05-20T07:30:00', findings:['All systems nominal'], signedOff:true },
  { id:'INS-004', vehicleId:'VEH-002', vehicleName:'Unit 2 — Cargo', type:'scheduled', status:'conditional', inspectedBy:'Shop Tech', date:'2025-05-18T09:00:00', findings:['Minor oil leak detected','Filter replacement needed'], signedOff:false },
];

// ── Risk Assessments ───────────────────────────────────────────
export const mockRiskAssessments: RiskAssessment[] = [
  { id:'RA-2025-001', clientId:'CON001', clientName:'Meridian Construction', industry:'Construction', assessmentType:'follow-up', status:'approved', riskScore:8.9, previousScore:8.2, assessedBy:'Steve Smith', assessedAt:'2025-04-15', nextReview:'2025-07-15', findings:[{ id:'f1', category:'PPE Compliance', description:'Workers not wearing required hard hats in zone A', severity:'critical', standard:'OSHA 29 CFR 1910.132', remediation:'Immediate mandatory PPE briefing and signage', status:'open' },{ id:'f2', category:'Fall Protection', description:'Missing guardrails on scaffolding above 4 feet', severity:'critical', standard:'OSHA 29 CFR 1926.502', remediation:'Install compliant guardrail system within 24 hours', status:'in-progress' }], recommendations:['Schedule OSHA compliance training this week','Install additional PPE signage at all entry points','Implement daily safety briefings with supervisor sign-off'], aiSummary:'Site presents two critical OSHA violations requiring immediate remediation. Pattern indicates systemic safety culture issues rather than isolated incidents.' },
  { id:'RA-2025-002', clientId:'GAS001', clientName:'Orange Ave Gas Station', industry:'Retail / Fuel', assessmentType:'annual', status:'review', riskScore:8.2, previousScore:7.5, assessedBy:'Steve Smith', assessedAt:'2025-04-02', nextReview:'2025-07-02', findings:[{ id:'f3', category:'Camera Coverage', description:'Blind spot at dumpster area — no camera coverage', severity:'high', remediation:'Reposition camera or add coverage unit', status:'open' },{ id:'f4', category:'Slip/Fall', description:'Fluid staining at pump island 3 with no wet floor signage', severity:'high', standard:'OSHA 29 CFR 1910.22', remediation:'Clean surface immediately, install permanent anti-slip matting', status:'in-progress' }], recommendations:['Install wet floor signage system','Conduct de-escalation training for counter staff','Add motion sensor lighting to lot perimeter'], aiSummary:'Risk score increased 0.7 points. Camera blind spot + lone worker situation after 10pm creates compounded liability exposure.' },
  { id:'RA-2025-003', clientId:'LOG001', clientName:'FastRoute Logistics', industry:'Transportation', assessmentType:'incident-triggered', status:'draft', riskScore:6.9, assessedBy:'Skeeter Smith', assessedAt:'2025-02-28', nextReview:'2025-05-28', findings:[{ id:'f5', category:'Hours of Service', description:'Driver logs show consistent HOS violations across 3 drivers', severity:'high', standard:'FMCSA 395.3', remediation:'Implement automated HOS tracking system', status:'open' }], recommendations:['Implement ELD mandate compliance review','Retrain dispatchers on HOS rules','Quarterly DOT self-audit schedule'], aiSummary:'Fleet compliance gaps identified in scheduling system. Root cause: manual log tracking rather than electronic. ELD implementation will resolve 90% of violations.' },
];

// ── Workflows ─────────────────────────────────────────────────
export const mockWorkflows: Workflow[] = [
  { id:'WF-001', name:'New Lead Intake Sequence', description:'Auto-capture lead → send intake form → schedule discovery call → create HubSpot record', trigger:'lead', status:'running', steps:[{ id:'s1', name:'Capture Lead', type:'ai-task', status:'done', duration:'0.8s' },{ id:'s2', name:'Send Intake Form', type:'notification', status:'done', duration:'1.2s' },{ id:'s3', name:'Book Discovery Call', type:'ai-task', status:'active', duration:'—' },{ id:'s4', name:'Create CRM Record', type:'ai-task', status:'pending' }], createdAt:'2025-05-01', lastRun:'2025-05-20T08:14:00', runsTotal:34, successRate:97, assignedAgent:'Intake Coordinator' },
  { id:'WF-002', name:'Incident Response Protocol', description:'Incident logged → AI analysis → assign consultant → notify client → generate draft report', trigger:'incident', status:'running', steps:[{ id:'s1', name:'Log Incident', type:'ai-task', status:'done' },{ id:'s2', name:'AI Risk Analysis', type:'ai-task', status:'done' },{ id:'s3', name:'Assign Consultant', type:'approval', status:'active' },{ id:'s4', name:'Client Notification', type:'notification', status:'pending' },{ id:'s5', name:'Draft Report', type:'document', status:'pending' }], createdAt:'2025-04-15', lastRun:'2025-05-20T09:14:00', runsTotal:8, successRate:100, assignedAgent:'Risk Analyst' },
  { id:'WF-003', name:'30/60/90 Day Follow-Up', description:'Auto-send client check-ins at 30, 60, and 90 days post-engagement', trigger:'manual', status:'completed', steps:[{ id:'s1', name:'30-Day Email', type:'notification', status:'done' },{ id:'s2', name:'60-Day Call Script', type:'ai-task', status:'done' },{ id:'s3', name:'90-Day Review Proposal', type:'document', status:'done' }], createdAt:'2025-03-01', lastRun:'2025-05-15', nextRun:'2025-06-15', runsTotal:18, successRate:95, assignedAgent:'Follow-Up Coordinator' },
  { id:'WF-004', name:'Fleet Compliance Audit', description:'Weekly automated DOT compliance check for all fleet vehicles', trigger:'scheduled', status:'paused', steps:[{ id:'s1', name:'Pull Vehicle Data', type:'ai-task', status:'pending' },{ id:'s2', name:'Run Compliance Check', type:'ai-task', status:'pending' },{ id:'s3', name:'Flag Violations', type:'condition', status:'pending' },{ id:'s4', name:'Generate Report', type:'document', status:'pending' }], createdAt:'2025-04-01', nextRun:'2025-05-27', runsTotal:6, successRate:83, assignedAgent:'Fleet Safety Advisor' },
  { id:'WF-005', name:'Marketing Content Pipeline', description:'Generate weekly LinkedIn posts and cold outreach sequences', trigger:'scheduled', status:'running', steps:[{ id:'s1', name:'Draft LinkedIn Post', type:'ai-task', status:'done' },{ id:'s2', name:'Steve Review', type:'approval', status:'active' },{ id:'s3', name:'Schedule Post', type:'ai-task', status:'pending' }], createdAt:'2025-05-01', lastRun:'2025-05-19', nextRun:'2025-05-26', runsTotal:12, successRate:92, assignedAgent:'Marketing Agent' },
];

// ── Reports ────────────────────────────────────────────────────
export const mockReports: Report[] = [
  { id:'RPT-001', title:'OSHA Compliance Audit — Orange Ave Gas Station', type:'osha', clientId:'GAS001', clientName:'Orange Ave Gas Station', status:'delivered', createdBy:'Steve Smith', createdAt:'2025-05-15T10:00:00', updatedAt:'2025-05-16T14:00:00', pages:8, aiGenerated:true, tags:['osha','compliance','retail'] },
  { id:'RPT-002', title:'Risk Assessment Report — Meridian Construction', type:'risk-assessment', clientId:'CON001', clientName:'Meridian Construction', status:'approved', createdBy:'Steve Smith', createdAt:'2025-04-20T09:00:00', updatedAt:'2025-04-22T11:00:00', pages:12, aiGenerated:true, tags:['risk','construction','critical'] },
  { id:'RPT-003', title:'Fleet Safety Assessment — FastRoute Logistics', type:'fleet', clientId:'LOG001', clientName:'FastRoute Logistics', status:'review', createdBy:'Skeeter Smith', createdAt:'2025-05-18T15:00:00', updatedAt:'2025-05-19T09:00:00', pages:7, aiGenerated:true, tags:['fleet','dot','compliance'] },
  { id:'RPT-004', title:'Executive Briefing — Q2 2025 Operations', type:'executive', status:'delivered', createdBy:'Steve Smith', createdAt:'2025-04-30T08:00:00', updatedAt:'2025-05-01T12:00:00', pages:4, aiGenerated:true, tags:['executive','quarterly','briefing'] },
  { id:'RPT-005', title:'De-Escalation Protocol — Sunstate Restaurant', type:'de-escalation', clientId:'RTL001', clientName:'Sunrise Retail Center', status:'draft', createdBy:'Steve Smith', createdAt:'2025-05-20T11:00:00', updatedAt:'2025-05-20T11:00:00', pages:5, aiGenerated:true, tags:['de-escalation','protocol','restaurant'] },
  { id:'RPT-006', title:'Service Proposal — Harbor Point Hotel', type:'proposal', clientId:'HTL001', clientName:'Harbor Point Hotel', status:'review', createdBy:'Steve Smith', createdAt:'2025-05-17T13:00:00', updatedAt:'2025-05-17T13:00:00', pages:6, aiGenerated:true, tags:['proposal','hospitality'] },
];

// ── Notifications ─────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id:'N-001', title:'Critical Incident Active', message:'INC-2025-002: Unauthorized entry at Palmetto Apartments requires immediate response.', priority:'critical', timestamp:'2025-05-20T02:45:00', read:false, type:'incident', actionUrl:'/incidents', actionLabel:'View Incident' },
  { id:'N-002', title:'OSHA Violation — Meridian Construction', message:'Second OSHA violation in 30 days. Escalated compliance action required.', priority:'high', timestamp:'2025-05-17T13:30:00', read:false, type:'incident', actionUrl:'/incidents', actionLabel:'View Incident' },
  { id:'N-003', title:'AI Report Ready for Review', message:'Risk Analyst completed draft: OSHA Audit — Orange Ave Gas Station.', priority:'medium', timestamp:'2025-05-20T10:15:00', read:false, type:'ai', actionUrl:'/reports', actionLabel:'Review Report' },
  { id:'N-004', title:'Fleet Violation — Unit 4', message:'Unit 4 (FL-3341-VW) has 3 DOT violations. Recommend immediate maintenance.', priority:'high', timestamp:'2025-05-19T16:00:00', read:true, type:'fleet', actionUrl:'/fleet', actionLabel:'View Fleet' },
  { id:'N-005', title:'Client Review Due', message:'FastRoute Logistics risk review is 7 days overdue. Schedule follow-up.', priority:'medium', timestamp:'2025-05-18T09:00:00', read:true, type:'client', actionUrl:'/clients', actionLabel:'View Client' },
  { id:'N-006', title:'Workflow Completed', message:'30/60/90 Day Follow-Up workflow completed successfully for 3 clients.', priority:'info', timestamp:'2025-05-15T14:00:00', read:true, type:'system', actionUrl:'/workflows' },
  { id:'N-007', title:'New Threat Intelligence', message:'OSHA Priority Inspection Initiative announced for Central Florida through Q3.', priority:'high', timestamp:'2025-05-19T10:00:00', read:false, type:'system', actionUrl:'/threat-intel', actionLabel:'View Intel' },
];

// ── Users ─────────────────────────────────────────────────────
export const mockUsers: User[] = [
  { id:'USR-001', name:'Steve Washington Smith', email:'steve@veridianriskgroup.com', role:'admin', department:'Operations', lastLogin:'2025-05-20T08:00:00', status:'active', permissions:['all'] },
  { id:'USR-002', name:'Skeeter Adiansingh-Smith', email:'skeeter@veridianriskgroup.com', role:'operator', department:'Fleet & HR', lastLogin:'2025-05-20T07:30:00', status:'active', permissions:['fleet','hr','reports'] },
  { id:'USR-003', name:'Maria Torres', email:'mtorres@palmettoapt.com', role:'client', department:'Palmetto Apartments', lastLogin:'2025-05-18T15:00:00', status:'active', permissions:['view-own-reports'] },
];

// ── Audit Log ─────────────────────────────────────────────────
export const mockAuditLog: AuditLog[] = [
  { id:'AL-001', timestamp:'2025-05-20T09:14:22', userId:'USR-001', userName:'Steve Smith', action:'CREATE', resource:'Incident', resourceId:'INC-2025-001', details:'Created incident: Verbal Altercation — Retail Floor', ipAddress:'192.168.1.1', success:true },
  { id:'AL-002', timestamp:'2025-05-20T08:15:00', userId:'USR-001', userName:'Steve Smith', action:'GENERATE', resource:'Report', resourceId:'RPT-003', details:'AI report generation initiated: Fleet Safety Assessment', success:true },
  { id:'AL-003', timestamp:'2025-05-19T16:45:00', userId:'USR-002', userName:'Skeeter Smith', action:'UPDATE', resource:'FleetVehicle', resourceId:'VEH-004', details:'Flagged Unit 4 for maintenance — DOT violation', success:true },
  { id:'AL-004', timestamp:'2025-05-19T14:00:00', userId:'USR-001', userName:'Steve Smith', action:'VIEW', resource:'RiskAssessment', resourceId:'RA-2025-001', details:'Accessed Meridian Construction risk assessment', success:true },
  { id:'AL-005', timestamp:'2025-05-18T09:30:00', userId:'USR-001', userName:'Steve Smith', action:'LOGIN', resource:'Auth', details:'Successful authentication', ipAddress:'192.168.1.1', success:true },
];

// ── Chart Data ─────────────────────────────────────────────────
export const incidentTrendData = [
  { month:'Nov', incidents:3, resolved:3, critical:0 },
  { month:'Dec', incidents:5, resolved:4, critical:1 },
  { month:'Jan', incidents:4, resolved:4, critical:0 },
  { month:'Feb', incidents:7, resolved:6, critical:2 },
  { month:'Mar', incidents:6, resolved:5, critical:1 },
  { month:'Apr', incidents:9, resolved:7, critical:2 },
  { month:'May', incidents:8, resolved:4, critical:3 },
];

export const riskByIndustryData = [
  { name:'Construction', risk:8.9, color:'#E74C3C' },
  { name:'Fuel/Retail',  risk:8.2, color:'#E67E22' },
  { name:'Apartments',   risk:7.8, color:'#E67E22' },
  { name:'Retail',       risk:7.1, color:'#F1C40F' },
  { name:'Logistics',    risk:6.9, color:'#F1C40F' },
  { name:'Dealership',   risk:6.5, color:'#2ECC71' },
  { name:'Hospitality',  risk:5.4, color:'#2ECC71' },
  { name:'Church',       risk:4.2, color:'#2ECC71' },
];

export const threatCategoryData = [
  { name:'Workplace Violence', value:28, fill:'#E74C3C' },
  { name:'Theft',              value:32, fill:'#E67E22' },
  { name:'Compliance',         value:20, fill:'#3498DB' },
  { name:'Safety',             value:12, fill:'#F1C40F' },
  { name:'Trespass',           value:8,  fill:'#C9A84C' },
];

export const revenueData = [
  { month:'Nov', revenue:3200,  target:3000 },
  { month:'Dec', revenue:4100,  target:3500 },
  { month:'Jan', revenue:3800,  target:4000 },
  { month:'Feb', revenue:5200,  target:4500 },
  { month:'Mar', revenue:6100,  target:5000 },
  { month:'Apr', revenue:7800,  target:6000 },
  { month:'May', revenue:9200,  target:7000 },
];

export const agentTaskData = [
  { day:'Mon', tasks:38, completed:36 },
  { day:'Tue', tasks:44, completed:42 },
  { day:'Wed', tasks:51, completed:48 },
  { day:'Thu', tasks:39, completed:39 },
  { day:'Fri', tasks:47, completed:44 },
  { day:'Sat', tasks:22, completed:22 },
  { day:'Sun', tasks:15, completed:15 },
];

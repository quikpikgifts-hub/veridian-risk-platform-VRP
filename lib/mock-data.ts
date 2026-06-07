import type {
  Incident, ThreatFeed, KpiCard, AIAgent, Client,
  FleetVehicle, FleetInspection, RiskAssessment,
  Workflow, Report, Notification, User, AuditLog
} from '@/types';

export const mockIncidents: Incident[] = [
  { id:'INC-2026-014', title:'Access Control Failure - Dock Gate 3', location:'NorthBridge Logistics - Dock Gate 3', industry:'Logistics / Distribution', severity:'critical', status:'active', category:'trespass', reportedAt:'2026-06-06T05:42:00', assignedTo:'Dana Mitchell', description:'Mobile patrol found Dock Gate 3 unsecured during closed hours. Camera review shows repeated tailgate attempts after shift change.', aiSummary:'Risk Detection: gate timing and lighting are contributing factors. Recommended actions: dispatch supervisor, secure gate, review access schedule, notify account contact.', tags:['access-control','mobile-patrol','after-hours'], witnesses:1 },
  { id:'INC-2026-013', title:'Officer Welfare Check Escalation', location:'Riverside Medical Plaza - Post B', industry:'Healthcare', severity:'high', status:'investigating', category:'safety', reportedAt:'2026-06-06T03:18:00', assignedTo:'Elena Brooks', description:'Officer missed two required check-ins during overnight shift. Supervisor contacted officer and initiated welfare protocol.', aiSummary:'Supervisor Insight: no immediate safety concern remains, but missed check-ins require documentation and coaching before next overnight assignment.', tags:['officer-safety','supervision'] },
  { id:'INC-2026-012', title:'Unauthorized Visitor Refused Departure', location:'Cedar Grove Residential - Lobby', industry:'Residential Community', severity:'high', status:'contained', category:'workplace-violence', reportedAt:'2026-06-05T22:27:00', assignedTo:'Dana Mitchell', description:'Visitor became verbally aggressive after access denial. Officer de-escalated and supervisor arrived before law enforcement was requested.', aiSummary:'Incident Intelligence: response followed post orders. Recommend updating visitor denial script and adding lobby camera angle review.', tags:['de-escalation','visitor-management'], witnesses:3 },
  { id:'INC-2026-011', title:'Patrol Vehicle Maintenance Hold', location:'ShieldSync Protect Fleet Yard', industry:'Contract Security Services', severity:'medium', status:'active', category:'fleet', reportedAt:'2026-06-05T18:05:00', assignedTo:'Marcus Lee', description:'Patrol Unit 12 reported brake vibration during route. Vehicle removed from service pending inspection.', aiSummary:'Recommended Action: keep unit out of rotation, reassign Zone 4 patrols to Unit 07, and review maintenance trend for repeated route wear.', tags:['fleet','mobile-patrol'] },
  { id:'INC-2026-010', title:'Alarm Response Delay', location:'Summit Retail Center - Building C', industry:'Retail Center', severity:'medium', status:'resolved', category:'safety', reportedAt:'2026-06-05T09:41:00', assignedTo:'Jordan Patel', description:'Alarm response exceeded SLA by 9 minutes due to construction detour not reflected in route plan.', aiSummary:'Operational Intelligence: update route exception map and add temporary patrol geofence until construction ends.', tags:['sla','alarm-response'] },
  { id:'INC-2026-009', title:'Loading Area Theft Attempt', location:'Apex Manufacturing - West Loading Area', industry:'Manufacturing', severity:'high', status:'investigating', category:'theft', reportedAt:'2026-06-04T23:12:00', assignedTo:'Elena Brooks', description:'Officer interrupted attempted copper wire removal from west loading area. Suspect left property before law enforcement arrival.', aiSummary:'Risk Detection: loading area has limited after-hours visibility. Recommend lighting repair and second checkpoint during weekend patrols.', estimatedLoss:0, witnesses:1 },
  { id:'INC-2026-008', title:'Wet Surface Near Employee Entrance', location:'Monarch Tower - Employee Entrance', industry:'Corporate Campus', severity:'low', status:'resolved', category:'safety', reportedAt:'2026-06-04T07:35:00', assignedTo:'Jordan Patel', description:'Officer documented standing water near employee entrance and placed temporary signage before facilities response.', aiSummary:'Supervisor Insight: strong documentation. Add recurring facilities notification for rain events.', witnesses:0 },
  { id:'INC-2026-007', title:'Post Order Exception Logged', location:'Harbor Hotel - Valet Drive', industry:'Hospitality', severity:'medium', status:'contained', category:'compliance', reportedAt:'2026-06-03T21:05:00', assignedTo:'Dana Mitchell', description:'Client requested temporary valet lane closure that changed officer patrol route. Exception approved by supervisor.', aiSummary:'Recommended Action: archive exception with client approval and update tonight-only route notes.', tags:['post-orders','client-request'] },
];

export const mockThreatFeed: ThreatFeed[] = [
  { id:'TF-101', title:'After-Hours Tailgating Pattern Near Industrial Parks', source:'Regional Security Bulletin', severity:'high', category:'trespass', timestamp:'2026-06-06T06:30:00', location:'Central Florida', summary:'Multiple distribution sites reported attempts to follow outbound trucks through dock gates after midnight. Sites with slow-closing gates are most exposed.', actionable:true },
  { id:'TF-102', title:'Retail Center Vehicle Break-In Increase', source:'County Crime Analysis Unit', severity:'medium', category:'theft', timestamp:'2026-06-05T17:20:00', location:'Orlando Metro', summary:'Vehicle break-ins increased near large retail centers during evening shift change windows. Recommend visible patrol presence and camera verification between 1800-2100.', actionable:true },
  { id:'TF-103', title:'Officer Heat Stress Advisory', source:'Safety Operations Desk', severity:'medium', category:'safety', timestamp:'2026-06-05T13:00:00', location:'Florida', summary:'Heat index above 100F expected this week. Supervisors should confirm hydration breaks for exterior posts and mobile patrol assignments.', actionable:true },
  { id:'TF-104', title:'Healthcare Visitor Management Reminder', source:'Client Policy Watch', severity:'low', category:'compliance', timestamp:'2026-06-04T09:15:00', location:'Healthcare Accounts', summary:'Several healthcare tenants updated visitor access procedures. Post orders should be reviewed before weekend shifts.', actionable:true },
  { id:'TF-105', title:'Parking Garage Loitering Trend', source:'Field Intelligence Notes', severity:'high', category:'workplace-violence', timestamp:'2026-06-03T22:45:00', location:'Downtown Properties', summary:'Supervisors reported repeat loitering and confrontation risk in garage stairwells. Add stairwell pass-throughs to patrol plans where applicable.', actionable:true },
  { id:'TF-106', title:'Mobile Patrol Fuel Card Review', source:'Fleet Controls Monitor', severity:'low', category:'fleet', timestamp:'2026-06-03T08:10:00', location:'ShieldSync Protect Fleet', summary:'Fuel card variance is within tolerance, but two routes show mileage drift. Review route adherence during weekly supervisor briefing.', actionable:true },
];

export const mockKpis: KpiCard[] = [
  { label:'Critical Alerts', value:2, change:'1 requires escalation', trend:'up', positive:false, icon:'alert' },
  { label:'Active Operations', value:18, change:'Across 12 sites', trend:'flat', positive:true, icon:'shield' },
  { label:'Officer Check-Ins', value:'96%', change:'+4% vs last shift', trend:'up', positive:true, icon:'users' },
  { label:'Open Incidents', value:5, change:'2 high priority', trend:'up', positive:false, icon:'gauge' },
  { label:'Recommended Actions', value:11, change:'5 due today', trend:'up', positive:false, icon:'cpu' },
  { label:'Patrols In Progress', value:7, change:'Zone 4 reassigned', trend:'flat', positive:true, icon:'workflow' },
  { label:'Fleet Readiness', value:'91%', change:'1 vehicle held', trend:'down', positive:false, icon:'truck' },
  { label:'Reports Ready', value:14, change:'This week', trend:'up', positive:true, icon:'file' },
];

export const mockAIAgents: AIAgent[] = [
  { id:'agt-01', name:'Operations Intelligence', role:'Executive Briefings and Escalation', status:'active', tasksToday:8, lastAction:'Prepared executive briefing for overnight incidents', successRate:98, avgResponseTime:'1.2s', division:'ops', capabilities:['briefings','routing','escalation'] },
  { id:'agt-02', name:'Dispatch Insights', role:'Shift Coverage and Route Exceptions', status:'active', tasksToday:5, lastAction:'Flagged Zone 4 route change after Unit 12 maintenance hold', successRate:96, avgResponseTime:'2.1s', division:'ops', capabilities:['dispatch','coverage','routing'] },
  { id:'agt-03', name:'Incident Intelligence', role:'Narrative Review and Risk Scoring', status:'processing', tasksToday:4, lastAction:'Reviewing Dock Gate 3 incident for escalation language', successRate:94, avgResponseTime:'8.4s', division:'risk', capabilities:['reports','risk-scoring','incident-review'] },
  { id:'agt-04', name:'Risk Detection', role:'Site Pattern Monitoring', status:'active', tasksToday:7, lastAction:'Matched tailgating pattern across logistics accounts', successRate:97, avgResponseTime:'3.8s', division:'intel', capabilities:['risk-detection','site-patterns','research'] },
  { id:'agt-05', name:'Client Briefings', role:'Account Summary Preparation', status:'active', tasksToday:3, lastAction:'Generated Riverside Medical Plaza shift summary', successRate:95, avgResponseTime:'12s', division:'ops', capabilities:['client-briefs','executive-summary','account-notes'] },
  { id:'agt-06', name:'Supervisor Insights', role:'Officer Coaching and Follow-Up', status:'standby', tasksToday:1, lastAction:'Queued missed check-in coaching note for supervisor review', successRate:99, avgResponseTime:'1.8s', division:'ops', capabilities:['coaching','follow-ups','supervision'] },
  { id:'agt-07', name:'Quality Assurance', role:'Post Order Compliance', status:'active', tasksToday:6, lastAction:'Validated Harbor Hotel route exception documentation', successRate:91, avgResponseTime:'5.2s', division:'risk', capabilities:['post-orders','qa','exceptions'] },
  { id:'agt-08', name:'Fleet Readiness', role:'Mobile Patrol Vehicle Status', status:'active', tasksToday:4, lastAction:'Recommended Unit 07 reassignment for Zone 4 route', successRate:96, avgResponseTime:'6.1s', division:'fleet', capabilities:['fleet-readiness','maintenance','route-impact'] },
  { id:'agt-09', name:'Workforce Risk', role:'Officer Fatigue and Staffing Review', status:'active', tasksToday:2, lastAction:'Reviewed overnight post coverage for fatigue risk', successRate:93, avgResponseTime:'7.3s', division:'hr', capabilities:['staffing','fatigue','workforce-policy'] },
  { id:'agt-10', name:'Compliance Monitor', role:'Safety and Documentation Controls', status:'active', tasksToday:3, lastAction:'Verified wet surface incident documentation', successRate:97, avgResponseTime:'9.2s', division:'risk', capabilities:['compliance','safety','documentation'] },
  { id:'agt-11', name:'De-Escalation Review', role:'Use-of-Force Avoidance and Scripts', status:'standby', tasksToday:1, lastAction:'Reviewed Cedar Grove visitor denial sequence', successRate:94, avgResponseTime:'4.5s', division:'risk', capabilities:['de-escalation','protocols','training'] },
];

export const mockClients: Client[] = [
  { id:'SITE001', name:'NorthBridge Logistics', industry:'Logistics / Distribution', riskScore:8.7, lastAssessment:'2026-05-15', nextReview:'2026-06-15', status:'review', incidents:3, contact:'Erin Vaughn', phone:'(407) 555-0101', email:'evaughn@northbridgelogistics.com', contractValue:18400, engagementLead:'Dana Mitchell' },
  { id:'SITE002', name:'Riverside Medical Plaza', industry:'Healthcare', riskScore:7.9, lastAssessment:'2026-05-22', nextReview:'2026-06-22', status:'active', incidents:2, contact:'Dr. Lena Ortiz', phone:'(407) 555-0202', email:'lortiz@riversidemedical.example', contractValue:21200, engagementLead:'Elena Brooks' },
  { id:'SITE003', name:'Cedar Grove Residential', industry:'Residential Community', riskScore:7.4, lastAssessment:'2026-04-30', nextReview:'2026-06-30', status:'active', incidents:2, contact:'Marcus Wynn', phone:'(407) 555-0303', email:'mwynn@cedargrove.example', contractValue:16800, engagementLead:'Dana Mitchell' },
  { id:'SITE004', name:'Summit Retail Center', industry:'Retail Center', riskScore:6.8, lastAssessment:'2026-05-10', nextReview:'2026-07-10', status:'active', incidents:1, contact:'Priya Desai', phone:'(407) 555-0404', email:'pdesai@summitretail.example', contractValue:13900, engagementLead:'Jordan Patel' },
  { id:'SITE005', name:'Apex Manufacturing', industry:'Manufacturing', riskScore:8.1, lastAssessment:'2026-05-18', nextReview:'2026-06-18', status:'review', incidents:2, contact:'Thomas Reeve', phone:'(407) 555-0505', email:'treeve@apexmfg.example', contractValue:24400, engagementLead:'Elena Brooks' },
  { id:'SITE006', name:'Monarch Tower', industry:'Corporate Campus', riskScore:5.3, lastAssessment:'2026-05-28', nextReview:'2026-08-28', status:'active', incidents:1, contact:'Nina Brooks', phone:'(407) 555-0606', email:'nbrooks@monarchtower.example', contractValue:15100, engagementLead:'Jordan Patel' },
  { id:'SITE007', name:'Harbor Hotel', industry:'Hospitality', riskScore:6.1, lastAssessment:'2026-05-05', nextReview:'2026-08-05', status:'active', incidents:1, contact:'Avery Stone', phone:'(407) 555-0707', email:'astone@harborhotel.example', contractValue:12750, engagementLead:'Dana Mitchell' },
  { id:'SITE008', name:'Lakeview Education Campus', industry:'Education Campus', riskScore:6.6, lastAssessment:'2026-04-20', nextReview:'2026-07-20', status:'pending', incidents:0, contact:'Maya Coleman', phone:'(407) 555-0808', email:'mcoleman@lakeview.example', contractValue:19600, engagementLead:'Elena Brooks' },
];

export const mockFleet: FleetVehicle[] = [
  { id:'VEH-007', name:'Patrol Unit 07', type:'car', plate:'FL-SYN-107', status:'active', driver:'Jordan Patel', mileage:48210, lastInspection:'2026-06-05', nextMaintenance:'2026-07-05', violations:0, location:'Zone 4 Route', dotCompliant:true, fuelType:'hybrid', year:2024, make:'Toyota', model:'RAV4' },
  { id:'VEH-012', name:'Patrol Unit 12', type:'car', plate:'FL-SYN-112', status:'maintenance', driver:'Unassigned', mileage:62740, lastInspection:'2026-06-05', nextMaintenance:'2026-06-06', violations:1, location:'Fleet Yard', dotCompliant:false, fuelType:'gasoline', year:2022, make:'Ford', model:'Explorer' },
  { id:'VEH-014', name:'Supervisor Unit 14', type:'car', plate:'FL-SYN-114', status:'active', driver:'Elena Brooks', mileage:39112, lastInspection:'2026-06-01', nextMaintenance:'2026-08-01', violations:0, location:'North District', dotCompliant:true, fuelType:'hybrid', year:2025, make:'Ford', model:'Escape' },
  { id:'VEH-021', name:'Response Van 21', type:'van', plate:'FL-SYN-221', status:'active', driver:'Marcus Lee', mileage:75500, lastInspection:'2026-05-29', nextMaintenance:'2026-06-29', violations:0, location:'Operations Center', dotCompliant:true, fuelType:'gasoline', year:2023, make:'Mercedes', model:'Sprinter' },
  { id:'VEH-031', name:'Event Shuttle 31', type:'bus', plate:'FL-SYN-331', status:'inactive', driver:'Unassigned', mileage:91200, lastInspection:'2026-04-12', nextMaintenance:'2026-06-12', violations:0, location:'Storage Lot', dotCompliant:true, fuelType:'diesel', year:2020, make:'Ford', model:'E-450' },
  { id:'VEH-044', name:'Patrol Unit 44', type:'car', plate:'FL-SYN-144', status:'active', driver:'Nolan Price', mileage:28240, lastInspection:'2026-06-03', nextMaintenance:'2026-08-03', violations:0, location:'South District', dotCompliant:true, fuelType:'hybrid', year:2025, make:'Toyota', model:'Camry' },
];

export const mockInspections: FleetInspection[] = [
  { id:'INS-101', vehicleId:'VEH-007', vehicleName:'Patrol Unit 07', type:'pre-trip', status:'pass', inspectedBy:'Jordan Patel', date:'2026-06-06T06:00:00', findings:['Tires: Good','Lights: Good','Camera kit: Online'], signedOff:true },
  { id:'INS-102', vehicleId:'VEH-012', vehicleName:'Patrol Unit 12', type:'scheduled', status:'fail', inspectedBy:'Marcus Lee', date:'2026-06-05T18:20:00', findings:['Brake vibration reported'], violations:['Vehicle removed from route pending service'], signedOff:false },
  { id:'INS-103', vehicleId:'VEH-014', vehicleName:'Supervisor Unit 14', type:'pre-trip', status:'pass', inspectedBy:'Elena Brooks', date:'2026-06-06T05:45:00', findings:['All systems operational'], signedOff:true },
  { id:'INS-104', vehicleId:'VEH-021', vehicleName:'Response Van 21', type:'scheduled', status:'conditional', inspectedBy:'Fleet Technician', date:'2026-06-04T10:00:00', findings:['First aid kit restock needed'], signedOff:false },
];

export const mockRiskAssessments: RiskAssessment[] = [
  { id:'RA-2026-021', clientId:'SITE001', clientName:'NorthBridge Logistics', industry:'Logistics / Distribution', assessmentType:'incident-triggered', status:'review', riskScore:8.7, previousScore:7.8, assessedBy:'Dana Mitchell', assessedAt:'2026-06-06', nextReview:'2026-06-15', findings:[{ id:'f1', category:'Gate Security', description:'Dock Gate 3 remained unsecured after outbound traffic cleared', severity:'critical', remediation:'Adjust gate timer, verify sensor, and add supervisor verification until repaired', status:'open' },{ id:'f2', category:'Lighting', description:'West dock lighting below post order standard', severity:'high', remediation:'Submit facilities ticket and add second patrol pass after 2300', status:'in-progress' }], recommendations:['Dispatch supervisor for same-day account review','Update tailgating response steps in post orders','Add temporary checkpoint until gate vendor completes repair'], aiSummary:'Incident Intelligence: gate failure compounds current regional tailgating trend. Executive escalation recommended.' },
  { id:'RA-2026-019', clientId:'SITE005', clientName:'Apex Manufacturing', industry:'Manufacturing', assessmentType:'follow-up', status:'approved', riskScore:8.1, previousScore:7.4, assessedBy:'Elena Brooks', assessedAt:'2026-05-18', nextReview:'2026-06-18', findings:[{ id:'f3', category:'Exterior Visibility', description:'West loading area visibility is limited during overnight patrol window', severity:'high', remediation:'Repair lighting and add camera validation during patrol', status:'open' }], recommendations:['Increase weekend patrol frequency','Review camera blind spots with client facilities lead','Document high-value material staging controls'], aiSummary:'Risk Detection: theft attempt aligns with poor visibility and predictable staging pattern.' },
  { id:'RA-2026-017', clientId:'SITE002', clientName:'Riverside Medical Plaza', industry:'Healthcare', assessmentType:'annual', status:'delivered', riskScore:7.9, previousScore:7.2, assessedBy:'Dana Mitchell', assessedAt:'2026-05-22', nextReview:'2026-06-22', findings:[{ id:'f4', category:'Officer Check-Ins', description:'Overnight post has limited redundancy if a check-in is missed', severity:'medium', remediation:'Add automated supervisor alert after first missed check-in', status:'in-progress' }], recommendations:['Review healthcare visitor escalation script','Add welfare check procedure to supervisor checklist','Validate lobby camera coverage'], aiSummary:'Supervisor Insight: staffing is stable, but overnight check-in controls need tighter escalation timing.' },
];

export const mockWorkflows: Workflow[] = [
  { id:'WF-101', name:'Critical Incident Escalation', description:'Incident logged -> risk scoring -> supervisor assignment -> client notification -> executive briefing', trigger:'incident', status:'running', steps:[{ id:'s1', name:'Log Incident', type:'ai-task', status:'done', duration:'0.8s' },{ id:'s2', name:'Risk Scoring', type:'ai-task', status:'done', duration:'1.4s' },{ id:'s3', name:'Assign Supervisor', type:'approval', status:'active' },{ id:'s4', name:'Notify Client', type:'notification', status:'pending' },{ id:'s5', name:'Prepare Brief', type:'document', status:'pending' }], createdAt:'2026-05-01', lastRun:'2026-06-06T05:42:00', runsTotal:42, successRate:98, assignedAgent:'Incident Intelligence' },
  { id:'WF-102', name:'Officer Check-In Monitor', description:'Missed check-in -> welfare confirmation -> supervisor follow-up -> coaching note', trigger:'scheduled', status:'running', steps:[{ id:'s1', name:'Monitor Check-Ins', type:'ai-task', status:'done' },{ id:'s2', name:'Supervisor Alert', type:'notification', status:'done' },{ id:'s3', name:'Welfare Confirmation', type:'approval', status:'done' },{ id:'s4', name:'Coaching Note', type:'document', status:'active' }], createdAt:'2026-04-15', lastRun:'2026-06-06T03:18:00', runsTotal:118, successRate:97, assignedAgent:'Supervisor Insights' },
  { id:'WF-103', name:'Mobile Patrol Reassignment', description:'Vehicle hold -> route impact analysis -> alternate unit assignment -> patrol confirmation', trigger:'fleet', status:'running', steps:[{ id:'s1', name:'Flag Vehicle Hold', type:'ai-task', status:'done' },{ id:'s2', name:'Analyze Route Impact', type:'ai-task', status:'done' },{ id:'s3', name:'Assign Alternate Unit', type:'approval', status:'active' },{ id:'s4', name:'Confirm Patrol', type:'notification', status:'pending' }], createdAt:'2026-04-28', lastRun:'2026-06-05T18:05:00', runsTotal:19, successRate:95, assignedAgent:'Fleet Readiness' },
  { id:'WF-104', name:'Weekly Account Briefing', description:'Collect incidents, patrol exceptions, staffing notes, and recommended actions for account review', trigger:'scheduled', status:'paused', steps:[{ id:'s1', name:'Collect Account Data', type:'ai-task', status:'pending' },{ id:'s2', name:'Draft Briefing', type:'document', status:'pending' },{ id:'s3', name:'Supervisor Review', type:'approval', status:'pending' }], createdAt:'2026-03-01', nextRun:'2026-06-10', runsTotal:24, successRate:96, assignedAgent:'Client Briefings' },
  { id:'WF-105', name:'Post Order Exception Review', description:'Client exception -> supervisor approval -> temporary route note -> archive with audit trail', trigger:'manual', status:'completed', steps:[{ id:'s1', name:'Capture Exception', type:'document', status:'done' },{ id:'s2', name:'Supervisor Approval', type:'approval', status:'done' },{ id:'s3', name:'Update Route Notes', type:'notification', status:'done' }], createdAt:'2026-05-18', lastRun:'2026-06-03T21:05:00', runsTotal:31, successRate:100, assignedAgent:'Quality Assurance' },
];

export const mockReports: Report[] = [
  { id:'RPT-101', title:'Executive Briefing - Overnight Operations', type:'executive', status:'review', createdBy:'Dana Mitchell', createdAt:'2026-06-06T07:15:00', updatedAt:'2026-06-06T07:30:00', pages:5, aiGenerated:true, tags:['executive','overnight','operations'] },
  { id:'RPT-102', title:'Incident Report - Dock Gate 3 Access Control Failure', type:'incident', clientId:'SITE001', clientName:'NorthBridge Logistics', status:'draft', createdBy:'Elena Brooks', createdAt:'2026-06-06T06:20:00', updatedAt:'2026-06-06T06:40:00', pages:6, aiGenerated:true, tags:['incident','access-control','critical'] },
  { id:'RPT-103', title:'Site Risk Assessment - Apex Manufacturing', type:'risk-assessment', clientId:'SITE005', clientName:'Apex Manufacturing', status:'approved', createdBy:'Dana Mitchell', createdAt:'2026-05-18T10:00:00', updatedAt:'2026-05-20T12:00:00', pages:11, aiGenerated:true, tags:['risk','manufacturing','patrol'] },
  { id:'RPT-104', title:'Fleet Readiness Review - June Week 1', type:'fleet', status:'delivered', createdBy:'Marcus Lee', createdAt:'2026-06-05T16:00:00', updatedAt:'2026-06-05T17:15:00', pages:4, aiGenerated:true, tags:['fleet','readiness','mobile-patrol'] },
  { id:'RPT-105', title:'Visitor Management Script - Cedar Grove Residential', type:'de-escalation', clientId:'SITE003', clientName:'Cedar Grove Residential', status:'review', createdBy:'Dana Mitchell', createdAt:'2026-06-05T23:30:00', updatedAt:'2026-06-06T00:15:00', pages:3, aiGenerated:true, tags:['visitor-management','de-escalation'] },
  { id:'RPT-106', title:'Enterprise Demonstration Tenant Overview', type:'proposal', status:'delivered', createdBy:'ShieldSync Protect', createdAt:'2026-06-01T09:00:00', updatedAt:'2026-06-01T09:00:00', pages:8, aiGenerated:false, tags:['demo','tenant','enterprise'] },
];

export const mockNotifications: Notification[] = [
  { id:'N-101', title:'Critical Alert: Dock Gate 3', message:'NorthBridge Logistics requires supervisor escalation and client notification.', priority:'critical', timestamp:'2026-06-06T05:50:00', read:false, type:'incident', actionUrl:'/incidents', actionLabel:'Review Incident' },
  { id:'N-102', title:'Officer Welfare Check Completed', message:'Riverside Medical Plaza officer contacted. Coaching follow-up remains open.', priority:'high', timestamp:'2026-06-06T03:40:00', read:false, type:'incident', actionUrl:'/incidents', actionLabel:'View Follow-Up' },
  { id:'N-103', title:'Recommended Action Ready', message:'Incident Intelligence prepared recommended actions for Dock Gate 3.', priority:'medium', timestamp:'2026-06-06T06:12:00', read:false, type:'ai', actionUrl:'/reports', actionLabel:'Review Actions' },
  { id:'N-104', title:'Fleet Hold: Patrol Unit 12', message:'Unit 12 removed from service. Zone 4 route reassigned to Unit 07.', priority:'high', timestamp:'2026-06-05T18:10:00', read:true, type:'fleet', actionUrl:'/fleet', actionLabel:'View Fleet' },
  { id:'N-105', title:'Account Review Due', message:'NorthBridge Logistics review due June 15 with active incident context.', priority:'medium', timestamp:'2026-06-05T09:00:00', read:true, type:'client', actionUrl:'/clients', actionLabel:'View Account' },
  { id:'N-106', title:'Workflow Completed', message:'Post order exception archived for Harbor Hotel valet lane closure.', priority:'info', timestamp:'2026-06-03T22:00:00', read:true, type:'system', actionUrl:'/workflows' },
  { id:'N-107', title:'Risk Detection Update', message:'Regional tailgating pattern detected across logistics accounts.', priority:'high', timestamp:'2026-06-06T06:30:00', read:false, type:'system', actionUrl:'/threat-intel', actionLabel:'View Risk Detection' },
];

export const mockUsers: User[] = [
  { id:'USR-101', name:'Dana Mitchell', email:'dana.mitchell@shieldsyncprotect.com', role:'admin', department:'Operations Command', lastLogin:'2026-06-06T06:45:00', status:'active', permissions:['all'] },
  { id:'USR-102', name:'Marcus Lee', email:'marcus.lee@shieldsyncprotect.com', role:'operator', department:'Fleet and Compliance', lastLogin:'2026-06-06T05:55:00', status:'active', permissions:['fleet','reports','workflows'] },
  { id:'USR-103', name:'Elena Brooks', email:'elena.brooks@shieldsyncprotect.com', role:'analyst', department:'Field Supervision', lastLogin:'2026-06-06T04:20:00', status:'active', permissions:['incidents','reports','clients'] },
  { id:'USR-104', name:'Jordan Patel', email:'jordan.patel@shieldsyncprotect.com', role:'operator', department:'Mobile Patrol', lastLogin:'2026-06-05T22:00:00', status:'active', permissions:['incidents','fleet'] },
];

export const mockAuditLog: AuditLog[] = [
  { id:'AL-101', timestamp:'2026-06-06T05:42:22', userId:'USR-103', userName:'Elena Brooks', action:'CREATE', resource:'Incident', resourceId:'INC-2026-014', details:'Created incident: Access Control Failure - Dock Gate 3', ipAddress:'192.168.1.12', success:true },
  { id:'AL-102', timestamp:'2026-06-06T06:12:00', userId:'USR-101', userName:'Dana Mitchell', action:'REVIEW', resource:'RecommendedAction', resourceId:'RPT-102', details:'Reviewed recommended actions for NorthBridge Logistics', success:true },
  { id:'AL-103', timestamp:'2026-06-05T18:10:00', userId:'USR-102', userName:'Marcus Lee', action:'UPDATE', resource:'FleetVehicle', resourceId:'VEH-012', details:'Removed Patrol Unit 12 from service pending maintenance', success:true },
  { id:'AL-104', timestamp:'2026-06-05T23:30:00', userId:'USR-101', userName:'Dana Mitchell', action:'GENERATE', resource:'Report', resourceId:'RPT-105', details:'Generated visitor management script for Cedar Grove Residential', success:true },
  { id:'AL-105', timestamp:'2026-06-06T06:45:00', userId:'USR-101', userName:'Dana Mitchell', action:'LOGIN', resource:'Auth', details:'Successful authentication', ipAddress:'192.168.1.10', success:true },
];

export const incidentTrendData = [
  { month:'Dec', incidents:7, resolved:6, critical:1 },
  { month:'Jan', incidents:9, resolved:8, critical:1 },
  { month:'Feb', incidents:8, resolved:8, critical:0 },
  { month:'Mar', incidents:12, resolved:10, critical:2 },
  { month:'Apr', incidents:10, resolved:9, critical:1 },
  { month:'May', incidents:14, resolved:12, critical:2 },
  { month:'Jun', incidents:8, resolved:3, critical:2 },
];

export const riskByIndustryData = [
  { name:'Logistics', risk:8.7, color:'#EF4444' },
  { name:'Manufacturing', risk:8.1, color:'#EF4444' },
  { name:'Healthcare', risk:7.9, color:'#F59E0B' },
  { name:'Residential', risk:7.4, color:'#F59E0B' },
  { name:'Retail', risk:6.8, color:'#F59E0B' },
  { name:'Education', risk:6.6, color:'#3B82F6' },
  { name:'Hospitality', risk:6.1, color:'#3B82F6' },
  { name:'Corporate', risk:5.3, color:'#22C55E' },
];

export const threatCategoryData = [
  { name:'Access Control', value:30, fill:'#EF4444' },
  { name:'Theft', value:22, fill:'#F59E0B' },
  { name:'Safety', value:18, fill:'#3B82F6' },
  { name:'Compliance', value:16, fill:'#22C55E' },
  { name:'Workplace Violence', value:14, fill:'#A3A3A3' },
];

export const revenueData = [
  { month:'Dec', revenue:82000, target:78000 },
  { month:'Jan', revenue:88000, target:82000 },
  { month:'Feb', revenue:91000, target:86000 },
  { month:'Mar', revenue:104000, target:92000 },
  { month:'Apr', revenue:111000, target:98000 },
  { month:'May', revenue:119000, target:105000 },
  { month:'Jun', revenue:64000, target:112000 },
];

export const agentTaskData = [
  { day:'Mon', tasks:42, completed:40 },
  { day:'Tue', tasks:51, completed:49 },
  { day:'Wed', tasks:46, completed:45 },
  { day:'Thu', tasks:58, completed:54 },
  { day:'Fri', tasks:63, completed:59 },
  { day:'Sat', tasks:37, completed:34 },
  { day:'Sun', tasks:29, completed:28 },
];

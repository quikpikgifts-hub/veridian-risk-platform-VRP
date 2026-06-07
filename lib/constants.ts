export const PLATFORM = {
  name:       'ShieldSync Enterprise Platform',
  shortName:  'ShieldSync',
  company:    'ShieldSync Protect',
  tagline:    'Enterprise Security Operations. Command Ready.',
  version:    '2.1.0',
  phone:      '+1 (407) 470-5992',
  email:      'operations@shieldsyncprotect.com',
  website:    'shieldsyncprotect.com',
  location:   'Orlando, FL',
  founded:    '2021',
  industry:   'Contract Security Services',
  purpose:    'Enterprise Demonstration Tenant',
} as const;

export const FOUNDERS = {
  steve: {
    name:       'Dana Mitchell',
    title:      'Director of Security Operations',
    equity:     'Executive Admin',
    email:      'dana.mitchell@shieldsyncprotect.com',
    experience: '18 years contract security operations, field supervision, and enterprise account leadership',
    certs:      ['CPP-aligned security program management', 'FEMA IS-100', 'FEMA IS-200', 'FEMA IS-700', 'OSHA 10 General Industry'],
  },
  skeeter: {
    name:       'Marcus Lee',
    title:      'Fleet and Compliance Manager',
    equity:     'Operations Lead',
    email:      'marcus.lee@shieldsyncprotect.com',
    experience: '15 years mobile patrol, fleet readiness, post order compliance, and quality assurance',
    certs:      ['Fleet safety management', 'Incident command fundamentals', 'Supervisor field training', 'Client service operations'],
  },
} as const;

export const AGENT_IDS = {
  OPS_MANAGER:   'agt-01',
  INTAKE:        'agt-02',
  RISK_ANALYST:  'agt-03',
  INTEL_ANALYST: 'agt-04',
  PROPOSAL:      'agt-05',
  FOLLOW_UP:     'agt-06',
  MARKETING:     'agt-07',
  FLEET:         'agt-08',
  HR:            'agt-09',
  OSHA:          'agt-10',
  DE_ESCALATION: 'agt-11',
} as const;

export const SERVICES = {
  RISK_WALK:        { name: 'Site Security Assessment',      range: '$350-$500'    },
  DE_ESCALATION:    { name: 'Post Order Review',             range: '$500-$800'    },
  OSHA:             { name: 'Safety Compliance Review',      range: '$800-$1,500'  },
  EAP:              { name: 'Emergency Action Plan',         range: '$500-$750'    },
  FLEET:            { name: 'Mobile Patrol Readiness Review',range: '$800-$2,000'  },
  FLEET_EFFICIENCY: { name: 'Fleet Utilization Analysis',    range: '$600-$1,200'  },
  WPV:              { name: 'Workplace Violence Prevention', range: '$1,200-$2,500' },
  HR:               { name: 'Officer Workforce Advisory',    range: '$800-$1,500'  },
  APEX_BUNDLE:      { name: 'Enterprise Demo Package',       range: '$999'         },
} as const;

export const INDUSTRIES = [
  'Corporate Campus', 'Mixed-Use Property', 'Healthcare', 'Manufacturing',
  'Logistics / Distribution', 'Retail Center', 'Residential Community',
  'Education Campus', 'Hospitality', 'Municipal Facility', 'Construction', 'Other',
] as const;

export const OSHA_STANDARDS = {
  WALKING_SURFACES:    '29 CFR 1910.22',
  EXIT_ROUTES:         '29 CFR 1910.36',
  PPE:                 '29 CFR 1910.132',
  FIRE_EXTINGUISHER:   '29 CFR 1910.157',
  HAZARD_COMM:         '29 CFR 1910.1200',
  LOCKOUT_TAGOUT:      '29 CFR 1910.147',
  BLOODBORNE_PATHOGEN: '29 CFR 1910.1030',
  EMERGENCY_ACTION:    '29 CFR 1910.38',
} as const;

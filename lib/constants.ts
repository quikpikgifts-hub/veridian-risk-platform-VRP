// ─── Platform Constants ───────────────────────────────────────
export const PLATFORM = {
  name:       'Veridian Risk Platform',
  shortName:  'Veridian',
  company:    'Veridian Risk & Resilience Group, LLC',
  tagline:    'Operational Risk. Elevated Standard.',
  version:    '2.0.0',
  phone:      '+1 (407) 470-5992',
  email:      'info@veridianriskgroup.com',
  website:    'veridianriskgroup.com',
  location:   'Sanford, FL 32773',
  founded:    '2025',
} as const;

export const FOUNDERS = {
  steve: {
    name:       'Steve Washington Smith',
    title:      'Managing Member',
    equity:     '50%',
    email:      'steve@veridianriskgroup.com',
    experience: '30 years law enforcement · JCF Detective Corporal · 13 Commendations',
    certs:      ['FEMA IS-100', 'FEMA IS-200', 'FEMA IS-700', 'OSHA 10 General Industry', 'Sanford PD CSO'],
  },
  skeeter: {
    name:       'Skeeter Adiansingh-Smith',
    title:      'Member Director',
    equity:     '50%',
    email:      'skeeter@veridianriskgroup.com',
    experience: '25+ years fleet ops · 3,500 emergency vehicles · BS HR Management',
    certs:      ['HRCI HR Associate', 'Certificate HR & Org Development', 'Certificate Supervisory Management'],
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
  RISK_WALK:        { name: 'Risk Walk Assessment',           range: '$350–$500'    },
  DE_ESCALATION:    { name: 'De-Escalation Advisory',        range: '$500–$800'    },
  OSHA:             { name: 'OSHA Compliance Review',        range: '$800–$1,500'  },
  EAP:              { name: 'Emergency Action Plan',         range: '$500–$750'    },
  FLEET:            { name: 'Fleet Safety Review',           range: '$800–$2,000'  },
  FLEET_EFFICIENCY: { name: 'Fleet Cost Efficiency Analysis',range: '$600–$1,200'  },
  WPV:              { name: 'Workplace Violence Prevention', range: '$1,200–$2,500' },
  HR:               { name: 'HR Advisory Services',          range: '$800–$1,500'  },
  APEX_BUNDLE:      { name: 'Apex Starter Bundle',           range: '$999'         },
} as const;

export const INDUSTRIES = [
  'Apartment Complex', 'Auto Dealership', 'Church / House of Worship',
  'Construction', 'Gas Station / Fuel Retail', 'Healthcare',
  'Hotel / Hospitality', 'Logistics / Transportation', 'Manufacturing',
  'Restaurant / Food Service', 'Retail Store', 'School / Institution', 'Other',
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

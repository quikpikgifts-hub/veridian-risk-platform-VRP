'use client';

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import { incidentTrendData, riskByIndustryData, threatCategoryData, revenueData, agentTaskData } from '@/lib/mock-data';

const ACCENT = '#3B82F6';

const tooltip = {
  contentStyle: {
    background: '#171717',
    border: '1px solid #262626',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#FFFFFF',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  },
  labelStyle: { color: '#A3A3A3', marginBottom: '3px', fontSize: '10px' },
  cursor: { fill: 'rgba(255,255,255,0.025)' },
};

const axis = {
  tick: { fill: 'rgba(163,163,163,0.75)', fontSize: 10, fontFamily: 'inherit' },
  axisLine: false as const,
  tickLine: false as const,
};

function ChartShell({ title, subtitle, height = 210, children }: { title: string; subtitle?: string; height?: number; children: React.ReactNode }) {
  return (
    <div className="bg-[#171717] border border-[#262626] rounded-[5px] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#262626]">
        <div className="text-[12px] font-bold text-white/92">{title}</div>
        {subtitle && <div className="text-[10px] text-white/36 mt-0.5">{subtitle}</div>}
      </div>
      <div className="px-2 py-4" style={{ height }}>{children}</div>
    </div>
  );
}

export function IncidentTrendChart() {
  return (
    <ChartShell title="Incident Trend" subtitle="Operational activity by month" height={218}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={incidentTrendData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={ACCENT} stopOpacity={0.22}/><stop offset="95%" stopColor={ACCENT} stopOpacity={0.01}/></linearGradient>
            <linearGradient id="gRes" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22C55E" stopOpacity={0.18}/><stop offset="95%" stopColor="#22C55E" stopOpacity={0.01}/></linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
          <XAxis dataKey="month" {...axis}/>
          <YAxis {...axis}/>
          <Tooltip {...tooltip}/>
          <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8, color: 'rgba(255,255,255,0.45)' }}/>
          <Area type="monotone" dataKey="incidents" name="Incidents" stroke={ACCENT} fill="url(#gInc)" strokeWidth={2} dot={false} activeDot={{ r: 3, fill: ACCENT }}/>
          <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#22C55E" fill="url(#gRes)" strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: '#22C55E' }}/>
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function ThreatCategoryChart() {
  return (
    <ChartShell title="Risk Categories" subtitle="Current detection mix" height={218}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={threatCategoryData} cx="50%" cy="48%" innerRadius={52} outerRadius={78} paddingAngle={2} dataKey="value">
            {threatCategoryData.map((entry, i) => <Cell key={i} fill={entry.fill} opacity={0.9}/>)}
          </Pie>
          <Tooltip {...tooltip} formatter={(v) => [`${v}%`, 'Share']}/>
          <Legend wrapperStyle={{ fontSize: 9.5, lineHeight: '20px' }} formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.55)' }}>{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function RiskByIndustryChart() {
  return (
    <ChartShell title="Risk by Site Type" subtitle="Average score across protected sites" height={218}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={riskByIndustryData} layout="vertical" margin={{ top: 0, right: 24, left: 24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false}/>
          <XAxis type="number" domain={[0, 10]} {...axis}/>
          <YAxis type="category" dataKey="name" width={78} {...axis} tick={{ ...axis.tick, fontSize: 9.5 }}/>
          <Tooltip {...tooltip} formatter={(v) => [(v as number).toFixed(1), 'Risk Score']}/>
          <Bar dataKey="risk" radius={[0, 2, 2, 0]} maxBarSize={13}>{riskByIndustryData.map((entry, i) => <Cell key={i} fill={entry.color}/>)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function RevenueChart() {
  return (
    <ChartShell title="Contract Revenue" subtitle="Monthly billing vs target" height={218}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <defs><linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={ACCENT} stopOpacity={0.22}/><stop offset="95%" stopColor={ACCENT} stopOpacity={0.01}/></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
          <XAxis dataKey="month" {...axis}/>
          <YAxis {...axis} tickFormatter={(v) => `$${(v as number) / 1000}k`}/>
          <Tooltip {...tooltip} formatter={(v) => [`$${(v as number).toLocaleString()}`, '']}/>
          <Area type="monotone" dataKey="revenue" name="Revenue" stroke={ACCENT} fill="url(#gRev)" strokeWidth={2}/>
          <Line type="monotone" dataKey="target" name="Target" stroke="rgba(255,255,255,0.22)" strokeWidth={1.5} strokeDasharray="4 4" dot={false}/>
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function AgentTasksChart() {
  return (
    <ChartShell title="Intelligence Actions" subtitle="Last 7 days" height={188}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={agentTaskData} margin={{ top: 0, right: 4, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
          <XAxis dataKey="day" {...axis}/>
          <YAxis {...axis}/>
          <Tooltip {...tooltip}/>
          <Bar dataKey="tasks" name="Assigned" radius={[2,2,0,0]} maxBarSize={18} fill="rgba(59,130,246,0.24)"/>
          <Bar dataKey="completed" name="Completed" radius={[2,2,0,0]} maxBarSize={18} fill={ACCENT}/>
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

'use client';

import dynamic from 'next/dynamic';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import { incidentTrendData, riskByIndustryData, threatCategoryData, revenueData, agentTaskData } from '@/lib/mock-data';

const GOLD = '#C9A84C';

const tooltip = {
  contentStyle: {
    background: '#0D0E17',
    border: '1px solid rgba(201,168,76,0.18)',
    borderRadius: '3px',
    fontSize: '11px',
    color: '#EEF0F4',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  },
  labelStyle: { color: 'rgba(238,240,244,0.55)', marginBottom: '3px', fontSize: '10px' },
  cursor: { fill: 'rgba(255,255,255,0.025)' },
};

const axis = {
  tick:     { fill: 'rgba(255,255,255,0.26)', fontSize: 10, fontFamily: 'inherit' },
  axisLine: false as const,
  tickLine: false as const,
};

function ChartShell({ title, subtitle, height = 210, children }: {
  title: string; subtitle?: string; height?: number; children: React.ReactNode;
}) {
  return (
    <div className="bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <div className="text-[12px] font-bold text-white/90">{title}</div>
        {subtitle && <div className="text-[10px] text-white/30 mt-0.5">{subtitle}</div>}
      </div>
      <div className="px-2 py-4" style={{ height }}>
        {children}
      </div>
    </div>
  );
}

export function IncidentTrendChart() {
  return (
    <ChartShell title="Incident Trend" subtitle="Nov 2024 – May 2025" height={218}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={incidentTrendData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={GOLD} stopOpacity={0.22}/>
              <stop offset="95%" stopColor={GOLD} stopOpacity={0.01}/>
            </linearGradient>
            <linearGradient id="gRes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.18}/>
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0.01}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
          <XAxis dataKey="month" {...axis}/>
          <YAxis {...axis}/>
          <Tooltip {...tooltip}/>
          <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8, color: 'rgba(255,255,255,0.35)' }}/>
          <Area type="monotone" dataKey="incidents" name="Incidents" stroke={GOLD}      fill="url(#gInc)" strokeWidth={2}   dot={false} activeDot={{ r: 3, fill: GOLD }}/>
          <Area type="monotone" dataKey="resolved"  name="Resolved"  stroke="#22C55E" fill="url(#gRes)" strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: '#22C55E' }}/>
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function ThreatCategoryChart() {
  return (
    <ChartShell title="Threat Categories" subtitle="By type distribution" height={218}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={threatCategoryData} cx="50%" cy="48%" innerRadius={52} outerRadius={78} paddingAngle={2} dataKey="value">
            {threatCategoryData.map((entry, i) => <Cell key={i} fill={entry.fill} opacity={0.85}/>)}
          </Pie>
          <Tooltip {...tooltip} formatter={(v) => [`${v}%`, 'Share']}/>
          <Legend
            wrapperStyle={{ fontSize: 9.5, lineHeight: '20px' }}
            formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.45)' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function RiskByIndustryChart() {
  return (
    <ChartShell title="Risk by Industry" subtitle="Average score across clients" height={218}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={riskByIndustryData} layout="vertical" margin={{ top: 0, right: 24, left: 24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false}/>
          <XAxis type="number" domain={[0, 10]} {...axis}/>
          <YAxis type="category" dataKey="name" width={78} {...axis} tick={{ ...axis.tick, fontSize: 9.5 }}/>
          <Tooltip {...tooltip} formatter={(v) => [(v as number).toFixed(1), 'Risk Score']}/>
          <Bar dataKey="risk" radius={[0, 2, 2, 0]} maxBarSize={13}>
            {riskByIndustryData.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function RevenueChart() {
  return (
    <ChartShell title="Revenue Pipeline" subtitle="Monthly billing vs target ($)" height={218}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={GOLD} stopOpacity={0.22}/>
              <stop offset="95%" stopColor={GOLD} stopOpacity={0.01}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
          <XAxis dataKey="month" {...axis}/>
          <YAxis {...axis} tickFormatter={(v) => `$${(v as number) / 1000}k`}/>
          <Tooltip {...tooltip} formatter={(v) => [`$${(v as number).toLocaleString()}`, '']}/>
          <Area  type="monotone" dataKey="revenue" name="Revenue" stroke={GOLD}       fill="url(#gRev)"      strokeWidth={2}/>
          <Line  type="monotone" dataKey="target"  name="Target"  stroke="rgba(255,255,255,0.18)"            strokeWidth={1.5} strokeDasharray="4 4" dot={false}/>
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function AgentTasksChart() {
  return (
    <ChartShell title="Agent Task Volume" subtitle="Last 7 days" height={188}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={agentTaskData} margin={{ top: 0, right: 4, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
          <XAxis dataKey="day" {...axis}/>
          <YAxis {...axis}/>
          <Tooltip {...tooltip}/>
          <Bar dataKey="tasks"     name="Assigned"  radius={[2,2,0,0]} maxBarSize={18} fill="rgba(201,168,76,0.2)"/>
          <Bar dataKey="completed" name="Completed" radius={[2,2,0,0]} maxBarSize={18} fill={GOLD}/>
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

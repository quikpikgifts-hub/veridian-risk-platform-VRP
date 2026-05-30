'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import {
  IncidentTrendChart, RiskByIndustryChart, ThreatCategoryChart,
  RevenueChart, AgentTasksChart
} from '@/components/charts/Charts';
import { mockClients, mockIncidents, mockAIAgents, revenueData } from '@/lib/mock-data';
import { getRiskColor, formatCurrency, cn } from '@/lib/utils';
import { BarChart3, TrendingUp, TrendingDown, Minus, Brain, Users, Shield, DollarSign } from 'lucide-react';

const PERIODS = ['7 Days', '30 Days', '90 Days', 'YTD'] as const;
type Period = typeof PERIODS[number];

function MetricCard({
  label, value, change, trend, positive, icon: Icon, color = 'amber', index = 0
}: {
  label: string; value: string | number; change: string;
  trend: 'up' | 'down' | 'flat'; positive: boolean;
  icon: React.ElementType; color?: string; index?: number;
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const deltaColor = positive
    ? (trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-green-400' : 'text-white/30')
    : (trend === 'up' ? 'text-red-400' : 'text-green-400');

  const colorMap: Record<string, string> = {
    amber:  'text-amber-400',
    green:  'text-green-400',
    red:    'text-red-400',
    blue:   'text-blue-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
  };

  return (
    <div
      className="bg-[#08090F] border border-white/[0.07] p-4 rounded-[3px] hover:border-amber-500/20 transition-colors anim-fade-up"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[8.5px] font-bold tracking-[2.5px] uppercase text-white/28">{label}</span>
        <Icon className="w-3.5 h-3.5 text-white/15" />
      </div>
      <div className={cn('text-[30px] font-bold font-mono leading-none mb-2', colorMap[color] || 'text-amber-400')}>
        {value}
      </div>
      <div className={cn('flex items-center gap-1 text-[10px] font-medium', deltaColor)}>
        <TrendIcon className="w-3 h-3 flex-shrink-0" />
        <span>{change}</span>
      </div>
    </div>
  );
}

function TopRiskTable() {
  const sorted = [...mockClients].sort((a, b) => b.riskScore - a.riskScore).slice(0, 6);
  return (
    <div className="bg-[#08090F] border border-white/[0.07] border-t-2 border-t-amber-500 rounded-[3px] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <div className="text-[12px] font-bold text-white/90">Top Risk Clients</div>
        <div className="text-[10px] text-white/30 mt-0.5">Ranked by current risk score</div>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {sorted.map((c, i) => (
          <div key={c.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
            <span className="text-[11px] font-bold font-mono text-white/20 w-4 flex-shrink-0">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] font-semibold text-white/80 truncate">{c.name}</div>
              <div className="text-[9.5px] text-white/30">{c.industry}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-16 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${c.riskScore * 10}%`, background: getRiskColor(c.riskScore) }} />
              </div>
              <span className="text-[12px] font-bold font-mono w-7 text-right" style={{ color: getRiskColor(c.riskScore) }}>
                {c.riskScore}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentPerformanceTable() {
  const agents = mockAIAgents.slice(0, 6);
  return (
    <div className="bg-[#08090F] border border-white/[0.07] border-t-2 border-t-blue-500 rounded-[3px] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <div className="text-[12px] font-bold text-white/90">Agent Performance</div>
        <div className="text-[10px] text-white/30 mt-0.5">Success rates & task volume</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[440px]">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {['Agent', 'Division', 'Tasks', 'Success', 'Avg Time'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[8.5px] font-bold tracking-[2px] uppercase text-white/22">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {agents.map(a => (
              <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-2.5 text-[11.5px] font-medium text-white/80">{a.name}</td>
                <td className="px-4 py-2.5">
                  <span className="text-[9px] font-bold uppercase tracking-[1px] px-1.5 py-0.5 rounded-[2px] bg-amber-500/10 text-amber-400/80 border border-amber-500/20">
                    {a.division}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-[12px] font-bold font-mono text-amber-400">{a.tasksToday}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-green-500/70 rounded-full" style={{ width: `${a.successRate}%` }} />
                    </div>
                    <span className="text-[11px] font-bold text-green-400 font-mono">{a.successRate}%</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-[11px] text-white/40 font-mono">{a.avgResponseTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30 Days');

  const totalRevenue  = revenueData.reduce((s, d) => s + d.revenue, 0);
  const activeClients = mockClients.filter(c => c.status === 'active').length;
  const totalTasks    = mockAIAgents.reduce((s, a) => s + a.tasksToday, 0);
  const avgRisk       = (mockClients.reduce((s, c) => s + c.riskScore, 0) / mockClients.length).toFixed(1);

  return (
    <Sidebar>
      <div className="p-4 md:p-5 space-y-5 anim-fade-up">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[9px] font-bold tracking-[4px] uppercase text-amber-400/70 mb-1">Intelligence</div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-white leading-tight">Analytics Center</h1>
            <p className="text-[11px] text-white/35 mt-1">Operational intelligence · Real-time performance metrics</p>
          </div>
          {/* Period selector */}
          <div className="flex items-center gap-1 bg-[#08090F] border border-white/[0.07] rounded-[3px] p-1">
            {PERIODS.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-3 py-1.5 text-[10px] font-semibold rounded-[2px] transition-all',
                  p === period
                    ? 'bg-amber-500 text-black'
                    : 'text-white/40 hover:text-white/70'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard label="Total Revenue"    value={formatCurrency(totalRevenue)} change="+34% vs prior period" trend="up"   positive icon={DollarSign} color="amber" index={0} />
          <MetricCard label="Active Clients"   value={activeClients}  change="2 new this month"   trend="up"   positive icon={Users}       color="green"  index={1} />
          <MetricCard label="AI Tasks Today"   value={totalTasks}     change="+18% above average" trend="up"   positive icon={Brain}       color="blue"   index={2} />
          <MetricCard label="Avg Risk Score"   value={avgRisk}        change="−0.4 vs last month" trend="down" positive icon={Shield}      color="orange" index={3} />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2"><IncidentTrendChart /></div>
          <ThreatCategoryChart />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RevenueChart />
          <AgentTasksChart />
        </div>

        {/* Data Tables Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TopRiskTable />
          <RiskByIndustryChart />
        </div>

        {/* Agent Performance */}
        <AgentPerformanceTable />

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Incidents Logged',    value: mockIncidents.length,    sub: 'All time'         },
            { label: 'Assessments Done',    value: 12,                       sub: 'This quarter'     },
            { label: 'Reports Generated',   value: 23,                       sub: 'AI-assisted'      },
            { label: 'Client Retention',    value: '94%',                    sub: '12-month rate'    },
          ].map((s, i) => (
            <div key={i} className="bg-[#08090F] border border-white/[0.07] p-4 rounded-[3px] text-center">
              <div className="text-[26px] font-bold font-mono text-amber-400 leading-none mb-1">{s.value}</div>
              <div className="text-[10.5px] font-semibold text-white/60">{s.label}</div>
              <div className="text-[9.5px] text-white/25 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-2 py-2 text-[10px] text-white/20">
          <BarChart3 className="w-3 h-3" />
          <span>Analytics powered by operational data · Updates in real-time when connected to live data</span>
        </div>
      </div>
    </Sidebar>
  );
}

'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CreateIncidentModal } from '@/components/incidents/CreateIncidentModal';
import { GenerateReportModal } from '@/components/incidents/GenerateReportModal';
import { mockIncidents } from '@/lib/mock-data';
import { formatDateTime, timeAgo } from '@/lib/utils';
import type { Incident, SeverityLevel, IncidentStatus } from '@/types';
import {
  Search, MapPin, Clock, ChevronDown, X,
  Cpu, AlertTriangle, FileText, RefreshCw
} from 'lucide-react';

const severities: SeverityLevel[]  = ['critical','high','medium','low'];
const statuses:   IncidentStatus[] = ['active','investigating','contained','resolved'];

export default function IncidentsPage() {
  const [search,         setSearch]         = useState('');
  const [sevFilter,      setSevFilter]      = useState<SeverityLevel|'all'>('all');
  const [statusFilter,   setStatusFilter]   = useState<IncidentStatus|'all'>('all');
  const [selected,       setSelected]       = useState<Incident|null>(null);
  const [createOpen,     setCreateOpen]     = useState(false);
  const [reportOpen,     setReportOpen]     = useState(false);
  const [reportIncident, setReportIncident] = useState<Incident|null>(null);
  const [incidents,      setIncidents]      = useState(mockIncidents);

  const filtered = incidents.filter(inc => {
    const q = search.toLowerCase();
    const matchSearch = !q || inc.title.toLowerCase().includes(q) || inc.location.toLowerCase().includes(q) || inc.id.toLowerCase().includes(q);
    const matchSev    = sevFilter    === 'all' || inc.severity === sevFilter;
    const matchStatus = statusFilter === 'all' || inc.status   === statusFilter;
    return matchSearch && matchSev && matchStatus;
  });

  const counts = {
    active:   incidents.filter(i => i.status === 'active').length,
    critical: incidents.filter(i => i.severity === 'critical').length,
    total:    incidents.length,
  };

  const openReport = (inc: Incident) => {
    setReportIncident(inc);
    setReportOpen(true);
  };

  return (
    <Sidebar>
      <div className="p-4 md:p-6 anim-fade-up">

        {/* ── Header ───────────────────────────── */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-[9px] font-bold tracking-[4px] uppercase text-amber-400/70 mb-1">Risk Management</div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-white leading-tight">Incident Registry</h1>
            <p className="text-[11px] text-white/35 mt-1">{counts.total} total · {counts.active} active</p>
          </div>
          <Button variant="primary" size="md" onClick={() => setCreateOpen(true)}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Incident</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        {/* ── Summary strip ─────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label:'Active',   value: counts.active,   color:'text-red-400',    border:'border-red-500/25',    bg:'bg-red-500/10'    },
            { label:'Critical', value: counts.critical, color:'text-orange-400', border:'border-orange-500/25', bg:'bg-orange-500/10' },
            { label:'Total',    value: counts.total,    color:'text-amber-400',  border:'border-amber-500/25',  bg:'bg-amber-500/10'  },
          ].map(s => (
            <div key={s.label} className={`${s.bg} ${s.border} border p-3 rounded-[3px] text-center`}>
              <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-[9px] font-bold tracking-[2px] uppercase text-white/35 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Filters ───────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, location, or ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0D0D18] border border-white/[0.08] text-white text-[12px] pl-9 pr-4 py-2 rounded-[2px] focus:outline-none focus:border-amber-500/40 transition-colors placeholder:text-white/25"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <select
                value={sevFilter}
                onChange={e => setSevFilter(e.target.value as SeverityLevel|'all')}
                className="appearance-none bg-[#0D0D18] border border-white/[0.08] text-white/60 text-[11px] pl-3 pr-7 py-2 rounded-[2px] focus:outline-none focus:border-amber-500/40 cursor-pointer"
              >
                <option value="all">All Severity</option>
                {severities.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as IncidentStatus|'all')}
                className="appearance-none bg-[#0D0D18] border border-white/[0.08] text-white/60 text-[11px] pl-3 pr-7 py-2 rounded-[2px] focus:outline-none focus:border-amber-500/40 cursor-pointer"
              >
                <option value="all">All Status</option>
                {statuses.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Main layout ───────────────────────── */}
        <div className="flex gap-4">

          {/* Incident list */}
          <div className={`flex-1 min-w-0 space-y-1.5 ${selected ? 'hidden md:block' : ''}`}>
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-white/25 text-[12px] bg-[#0D0D18] border border-white/[0.06] rounded-[3px]">
                No incidents match your current filters
              </div>
            ) : filtered.map(inc => (
              <div
                key={inc.id}
                onClick={() => setSelected(selected?.id === inc.id ? null : inc)}
                className={`flex items-center gap-3 p-3 rounded-[3px] cursor-pointer transition-all border ${
                  selected?.id === inc.id
                    ? 'border-amber-500/40 bg-amber-500/[0.05]'
                    : 'border-white/[0.06] bg-[#0D0D18] hover:border-white/[0.12] hover:bg-white/[0.02]'
                }`}
              >
                {/* Severity bar */}
                <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${
                  inc.severity==='critical' ? 'bg-red-500' :
                  inc.severity==='high'     ? 'bg-orange-500' :
                  inc.severity==='medium'   ? 'bg-yellow-400' : 'bg-green-500'
                }`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-[12px] font-semibold text-white/85 truncate">{inc.title}</span>
                    <span className="text-[9.5px] font-mono text-white/25 hidden sm:inline">{inc.id}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-white/35 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{inc.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{timeAgo(inc.reportedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Badge variant={inc.severity as SeverityLevel} label={inc.severity} />
                  <Badge variant={inc.status as IncidentStatus} label={inc.status} className="hidden sm:inline-flex" />
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-full md:w-[300px] flex-shrink-0 animate-slide-in">
              <Card goldTop padding="none" className="p-4 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-amber-400/90">Incident Detail</div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-white/30 hover:text-white/70 transition-colors p-0.5 rounded hover:bg-white/5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-[13.5px] font-bold text-white leading-snug mb-2">{selected.title}</h3>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant={selected.severity as SeverityLevel} label={selected.severity} dot />
                      <Badge variant={selected.status as IncidentStatus} label={selected.status} />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { label: 'Incident ID',  value: selected.id },
                      { label: 'Location',     value: selected.location },
                      { label: 'Industry',     value: selected.industry },
                      { label: 'Reported',     value: formatDateTime(selected.reportedAt) },
                      { label: 'Assigned To',  value: selected.assignedTo },
                    ].map(row => (
                      <div key={row.label} className="border-b border-white/[0.05] pb-2">
                        <div className="text-[9px] font-bold tracking-[1.5px] uppercase text-white/25 mb-0.5">{row.label}</div>
                        <div className="text-[11.5px] text-white/70">{row.value}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="text-[9px] font-bold tracking-[1.5px] uppercase text-white/25 mb-1">Description</div>
                    <p className="text-[11px] text-white/50 leading-relaxed">{selected.description}</p>
                  </div>

                  {selected.aiSummary && (
                    <div className="bg-amber-500/8 border border-amber-500/20 p-3 rounded-[2px]">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-[1.5px] uppercase text-amber-400 mb-1.5">
                        <Cpu className="w-3 h-3" />AI Analysis
                      </div>
                      <p className="text-[10.5px] text-amber-200/65 leading-relaxed">{selected.aiSummary}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => openReport(selected)}
                    >
                      <FileText className="w-3 h-3" />Generate Report
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelected(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ────────────────────────────── */}
      <CreateIncidentModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {/* incidents would refresh from API */}}
      />

      <GenerateReportModal
        open={reportOpen}
        onClose={() => { setReportOpen(false); setReportIncident(null); }}
        incident={reportIncident}
      />
    </Sidebar>
  );
}

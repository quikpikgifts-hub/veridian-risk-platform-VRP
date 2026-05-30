'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockClients } from '@/lib/mock-data';
import { getRiskColor, getRiskLabel, formatDate, classifyRisk, formatCurrency, cn } from '@/lib/utils';
import { Search, Plus, Phone, Mail, MapPin, X, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react';
import type { Client, ClientStatus } from '@/types';

type ViewMode = 'grid' | 'table';

function ClientCard({ client, onSelect }: { client: Client; onSelect: () => void }) {
  const riskColor = getRiskColor(client.riskScore);
  const riskLabel = getRiskLabel(client.riskScore);

  return (
    <div
      onClick={onSelect}
      className="bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden hover:border-amber-500/25 transition-all cursor-pointer group"
    >
      {/* Risk bar top */}
      <div className="h-[2px]" style={{ background: riskColor, opacity: 0.7 }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-white/88 group-hover:text-white transition-colors truncate">{client.name}</div>
            <div className="text-[10px] text-white/35 mt-0.5">{client.industry}</div>
          </div>
          <Badge variant={client.status as ClientStatus} label={client.status} />
        </div>

        {/* Risk Score */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${client.riskScore * 10}%`, background: riskColor }} />
          </div>
          <span className="text-[12px] font-bold font-mono flex-shrink-0" style={{ color: riskColor }}>
            {client.riskScore}
          </span>
          <span className="text-[9px] font-bold flex-shrink-0" style={{ color: riskColor }}>{riskLabel}</span>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-2 text-[10px] text-white/35">
          <div>
            <div className="text-[8.5px] text-white/20 uppercase tracking-[1.5px] font-bold mb-0.5">Last Review</div>
            <div className="text-white/50">{formatDate(client.lastAssessment)}</div>
          </div>
          <div>
            <div className="text-[8.5px] text-white/20 uppercase tracking-[1.5px] font-bold mb-0.5">Next Review</div>
            <div className="text-white/50">{formatDate(client.nextReview)}</div>
          </div>
          <div>
            <div className="text-[8.5px] text-white/20 uppercase tracking-[1.5px] font-bold mb-0.5">Incidents</div>
            <div className={client.incidents > 2 ? 'text-red-400 font-bold' : 'text-white/50'}>{client.incidents}</div>
          </div>
          <div>
            <div className="text-[8.5px] text-white/20 uppercase tracking-[1.5px] font-bold mb-0.5">Contract</div>
            <div className="text-amber-400/80 font-mono text-[10px]">{client.contractValue ? formatCurrency(client.contractValue) : '—'}</div>
          </div>
        </div>

        {/* Lead */}
        {client.engagementLead && (
          <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between">
            <span className="text-[9.5px] text-white/30">Lead: <span className="text-white/55">{client.engagementLead}</span></span>
            <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-amber-400 transition-colors" />
          </div>
        )}
      </div>
    </div>
  );
}

function ClientDetail({ client, onClose }: { client: Client; onClose: () => void }) {
  return (
    <div className="bg-[#08090F] border border-white/[0.07] border-t-2 rounded-[3px] overflow-hidden sticky top-4" style={{ borderTopColor: getRiskColor(client.riskScore) }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="text-[10px] font-bold text-amber-400/90 uppercase tracking-[2px]">Client Profile</div>
        <button onClick={onClose} className="text-white/25 hover:text-white/70 transition-colors p-0.5 rounded hover:bg-white/5">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-[15px] font-bold text-white mb-1">{client.name}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={client.status as ClientStatus} label={client.status} dot />
            <Badge variant={classifyRisk(client.riskScore)} label={`Risk: ${client.riskScore}`} />
          </div>
        </div>

        {/* Contact info */}
        {(client.contact || client.phone || client.email || client.address) && (
          <div className="space-y-2">
            <div className="text-[9px] font-bold text-white/25 uppercase tracking-[2px]">Contact</div>
            {client.contact && (
              <div className="flex items-center gap-2 text-[11.5px] text-white/60">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] font-bold text-amber-400">{client.contact[0]}</span>
                </div>
                {client.contact}
              </div>
            )}
            {client.phone && (
              <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-[11.5px] text-white/50 hover:text-amber-400 transition-colors">
                <Phone className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />{client.phone}
              </a>
            )}
            {client.email && (
              <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-[11.5px] text-white/50 hover:text-amber-400 transition-colors truncate">
                <Mail className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />{client.email}
              </a>
            )}
            {client.address && (
              <div className="flex items-center gap-2 text-[11.5px] text-white/50">
                <MapPin className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />{client.address}
              </div>
            )}
          </div>
        )}

        {/* Risk meter */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[9px] font-bold text-white/25 uppercase tracking-[2px]">Risk Score</div>
            <span className="text-[13px] font-bold font-mono" style={{ color: getRiskColor(client.riskScore) }}>
              {client.riskScore} / 10
            </span>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${client.riskScore * 10}%`, background: getRiskColor(client.riskScore) }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { l: 'Client ID',     v: client.id },
            { l: 'Industry',      v: client.industry },
            { l: 'Incidents',     v: String(client.incidents) },
            { l: 'Contract Value',v: client.contractValue ? formatCurrency(client.contractValue) : '—' },
            { l: 'Last Assessment',v: formatDate(client.lastAssessment) },
            { l: 'Next Review',   v: formatDate(client.nextReview) },
            { l: 'Lead',          v: client.engagementLead || '—' },
          ].map(({ l, v }) => (
            <div key={l} className="p-2.5 bg-white/[0.025] border border-white/[0.05] rounded-[2px]">
              <div className="text-[8.5px] font-bold text-white/22 uppercase tracking-[1.5px] mb-0.5">{l}</div>
              <div className="text-[11px] text-white/65 truncate">{v}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button variant="primary" size="sm" className="flex-1">
            <TrendingUp className="w-3 h-3" />Schedule Review
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <AlertTriangle className="w-3 h-3" />Log Incident
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState<ClientStatus | 'all'>('all');
  const [view,     setView]     = useState<ViewMode>('grid');
  const [selected, setSelected] = useState<Client | null>(null);

  const filtered = mockClients.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all:     mockClients.length,
    active:  mockClients.filter(c => c.status === 'active').length,
    review:  mockClients.filter(c => c.status === 'review').length,
    pending: mockClients.filter(c => c.status === 'pending').length,
  };

  return (
    <Sidebar>
      <div className="p-4 md:p-5 space-y-4 anim-fade-up">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[9px] font-bold tracking-[4px] uppercase text-amber-400/70 mb-1">CRM</div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-white leading-tight">Client Registry</h1>
            <p className="text-[11px] text-white/35 mt-1">{counts.all} clients · {counts.active} active engagements</p>
          </div>
          <Button variant="primary" size="md">
            <Plus className="w-3.5 h-3.5" />Add Client
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-0 border-b border-white/[0.06]">
          {(['all', 'active', 'review', 'pending'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-semibold border-b-2 transition-all capitalize',
                f === filter
                  ? 'text-amber-400 border-amber-500'
                  : 'text-white/35 border-transparent hover:text-white/60 hover:border-white/20'
              )}
            >
              {f}
              <span className={cn(
                'text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] leading-none',
                f === filter ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.06] text-white/30'
              )}>
                {counts[f as keyof typeof counts]}
              </span>
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2 pb-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25 pointer-events-none" />
              <input
                type="text"
                placeholder="Search clients..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-[#08090F] border border-white/[0.07] text-white text-[11px] pl-7 pr-3 py-1.5 rounded-[2px] focus:outline-none focus:border-amber-500/35 transition-colors placeholder:text-white/20 w-40"
              />
            </div>
            {/* View toggle */}
            <div className="flex items-center border border-white/[0.07] rounded-[2px] overflow-hidden">
              {(['grid', 'table'] as ViewMode[]).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    'px-2.5 py-1.5 text-[10px] font-semibold transition-all capitalize',
                    v === view ? 'bg-amber-500/15 text-amber-400' : 'text-white/30 hover:text-white/60'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={cn('flex gap-4', selected ? 'items-start' : '')}>
          <div className="flex-1 min-w-0">
            {view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filtered.map(c => (
                  <ClientCard
                    key={c.id}
                    client={c}
                    onSelect={() => setSelected(selected?.id === c.id ? null : c)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-white/[0.05]">
                        {['Client', 'Industry', 'Risk', 'Status', 'Last Assessment', 'Next Review', 'Contract', ''].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[8.5px] font-bold tracking-[2px] uppercase text-white/22">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {filtered.map(c => (
                        <tr key={c.id} className="hover:bg-white/[0.02] cursor-pointer transition-colors" onClick={() => setSelected(c)}>
                          <td className="px-4 py-3">
                            <div className="text-[12px] font-semibold text-white/82">{c.name}</div>
                            <div className="text-[9.5px] text-white/25 font-mono">{c.id}</div>
                          </td>
                          <td className="px-4 py-3 text-[11px] text-white/45">{c.industry}</td>
                          <td className="px-4 py-3">
                            <span className="text-[12px] font-bold font-mono" style={{ color: getRiskColor(c.riskScore) }}>{c.riskScore}</span>
                          </td>
                          <td className="px-4 py-3"><Badge variant={c.status as ClientStatus} label={c.status} /></td>
                          <td className="px-4 py-3 text-[11px] text-white/40">{formatDate(c.lastAssessment)}</td>
                          <td className="px-4 py-3 text-[11px] text-white/40">{formatDate(c.nextReview)}</td>
                          <td className="px-4 py-3 text-[11px] text-amber-400/70 font-mono">{c.contractValue ? formatCurrency(c.contractValue) : '—'}</td>
                          <td className="px-4 py-3">
                            <ChevronRight className="w-4 h-4 text-white/20" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-full md:w-[280px] flex-shrink-0 anim-slide-right">
              <ClientDetail client={selected} onClose={() => setSelected(null)} />
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}

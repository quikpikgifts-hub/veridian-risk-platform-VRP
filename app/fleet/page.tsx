'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockFleet, mockInspections } from '@/lib/mock-data';
import { formatDate, timeAgo } from '@/lib/utils';
import { Truck, AlertTriangle, CheckCircle, Clock, MapPin, Search, RefreshCw } from 'lucide-react';
import type { FleetVehicle } from '@/types';

const statusVariant: Record<string, 'active'|'standby'|'critical'|'low'|'grey'> = {
  active:      'active',
  maintenance: 'standby',
  inactive:    'grey',
  violation:   'critical',
};

export default function FleetPage() {
  const [selected, setSelected] = useState<FleetVehicle | null>(null);
  const [search,   setSearch]   = useState('');

  const filtered = mockFleet.filter(v =>
    !search || v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.plate.toLowerCase().includes(search.toLowerCase()) ||
    (v.driver||'').toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    active:      mockFleet.filter(v => v.status === 'active').length,
    maintenance: mockFleet.filter(v => v.status === 'maintenance').length,
    violations:  mockFleet.filter(v => v.status === 'violation').length,
    compliant:   Math.round(mockFleet.filter(v => v.dotCompliant).length / mockFleet.length * 100),
  };

  return (
    <Sidebar>
      <div className="p-4 md:p-5 space-y-4 anim-fade-up">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[9px] font-bold tracking-[4px] uppercase text-amber-400/70 mb-1">Fleet Operations</div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-white">Fleet Management</h1>
            <p className="text-[11px] text-white/35 mt-1">Skeeter Adiansingh-Smith, Director · DOT Compliance & Safety</p>
          </div>
          <Button variant="primary" size="md">
            <Truck className="w-3.5 h-3.5"/>Add Vehicle
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l:'Active Units',     v:stats.active,          c:'text-green-400',  border:'border-green-500/20'  },
            { l:'In Maintenance',   v:stats.maintenance,     c:'text-orange-400', border:'border-orange-500/20' },
            { l:'DOT Violations',   v:stats.violations,      c:'text-red-400',    border:'border-red-500/20'    },
            { l:'DOT Compliance',   v:`${stats.compliant}%`, c:'text-amber-400',  border:'border-amber-500/20'  },
          ].map((s,i) => (
            <div key={i} className={`bg-[#08090F] border border-white/[0.07] ${s.border} p-3.5 rounded-[3px]`}>
              <div className="text-[8px] font-bold tracking-[2.5px] uppercase text-white/28 mb-2">{s.l}</div>
              <div className={`text-[28px] font-bold font-mono ${s.c}`}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none"/>
          <input type="text" placeholder="Search vehicles, drivers, plates..." value={search}
            onChange={e=>setSearch(e.target.value)}
            className="w-full bg-[#08090F] border border-white/[0.08] text-white text-[12px] pl-9 pr-4 py-2 rounded-[2px] input-focus placeholder:text-white/20"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Vehicle List */}
          <div className="lg:col-span-2">
            <div className="bg-[#08090F] border-t-2 border-t-amber-500 border border-white/[0.07] rounded-[3px] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <div className="text-[12px] font-bold text-white/90">Fleet Registry</div>
                <div className="text-[10px] text-white/30 mt-0.5">{filtered.length} vehicles</div>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {filtered.map(v => (
                  <div key={v.id} onClick={() => setSelected(selected?.id === v.id ? null : v)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
                      selected?.id === v.id ? 'bg-amber-500/[0.06] border-l-2 border-l-amber-500' : 'hover:bg-white/[0.02]'
                    }`}>
                    <div className={`w-8 h-8 rounded-[2px] flex items-center justify-center flex-shrink-0 ${
                      v.status === 'violation' ? 'bg-red-500/15 border border-red-500/30' :
                      v.status === 'maintenance' ? 'bg-orange-500/15 border border-orange-500/30' :
                      v.status === 'active' ? 'bg-green-500/10 border border-green-500/20' :
                      'bg-white/[0.04] border border-white/[0.08]'
                    }`}>
                      <Truck className={`w-4 h-4 ${
                        v.status === 'violation' ? 'text-red-400' :
                        v.status === 'maintenance' ? 'text-orange-400' :
                        v.status === 'active' ? 'text-green-400' : 'text-white/30'
                      }`}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[12px] font-semibold text-white/85">{v.name}</span>
                        <span className="text-[9px] font-mono text-white/28">{v.plate}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-white/30 flex-wrap">
                        {v.driver && <span>{v.driver}</span>}
                        {v.location && <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5"/>{v.location}</span>}
                        <span>{v.year} {v.make} {v.model}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={statusVariant[v.status]} label={v.status}/>
                      {!v.dotCompliant && <Badge variant="critical" label="DOT" dot/>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspections */}
            <div className="mt-4 bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <div className="text-[12px] font-bold text-white/90">Recent Inspections</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px]">
                  <thead>
                    <tr className="border-b border-white/[0.05]">
                      {['Vehicle','Type','Inspector','Date','Status','Signed'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-[8.5px] font-bold tracking-[2px] uppercase text-white/22">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {mockInspections.map(ins => (
                      <tr key={ins.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 text-[11px] font-medium text-white/75">{ins.vehicleName}</td>
                        <td className="px-4 py-3 text-[11px] text-white/40 capitalize">{ins.type}</td>
                        <td className="px-4 py-3 text-[11px] text-white/40">{ins.inspectedBy}</td>
                        <td className="px-4 py-3 text-[11px] text-white/35 font-mono">{timeAgo(ins.date)}</td>
                        <td className="px-4 py-3">
                          <Badge variant={ins.status === 'pass' ? 'active' : ins.status === 'fail' ? 'critical' : 'standby'} label={ins.status}/>
                        </td>
                        <td className="px-4 py-3">
                          {ins.signedOff
                            ? <CheckCircle className="w-4 h-4 text-green-400"/>
                            : <Clock className="w-4 h-4 text-orange-400"/>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          <div>
            {selected ? (
              <div className="bg-[#08090F] border-t-2 border-t-amber-500 border border-white/[0.07] rounded-[3px] overflow-hidden sticky top-4">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                  <div className="text-[11px] font-bold text-amber-400/90 uppercase tracking-[1.5px]">Vehicle Detail</div>
                  <button onClick={()=>setSelected(null)} className="text-white/25 hover:text-white/60 text-[12px]">✕</button>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-[14px] font-bold text-white mb-1">{selected.name}</h3>
                    <div className="flex gap-1.5 flex-wrap">
                      <Badge variant={statusVariant[selected.status]} label={selected.status} dot/>
                      <Badge variant={selected.dotCompliant ? 'active' : 'critical'} label={selected.dotCompliant ? 'DOT Compliant' : 'DOT Violation'}/>
                    </div>
                  </div>
                  <div className="space-y-2.5 divide-y divide-white/[0.05]">
                    {[
                      ['Vehicle ID',    selected.id],
                      ['License Plate', selected.plate],
                      ['Year/Make/Model',`${selected.year} ${selected.make} ${selected.model}`],
                      ['Driver',        selected.driver || 'Unassigned'],
                      ['Location',      selected.location || '—'],
                      ['Mileage',       selected.mileage.toLocaleString() + ' mi'],
                      ['Fuel Type',     selected.fuelType],
                      ['Last Inspection',formatDate(selected.lastInspection)],
                      ['Next Maintenance',formatDate(selected.nextMaintenance)],
                      ['DOT Violations', String(selected.violations)],
                    ].map(([l,v]) => (
                      <div key={l} className="pt-2 first:pt-0">
                        <div className="text-[8.5px] font-bold tracking-[1.5px] uppercase text-white/22 mb-0.5">{l}</div>
                        <div className="text-[11.5px] text-white/65">{v}</div>
                      </div>
                    ))}
                  </div>
                  {selected.violations > 0 && (
                    <div className="bg-red-500/8 border border-red-500/20 p-3 rounded-[2px]">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-red-400 uppercase tracking-[1px] mb-1">
                        <AlertTriangle className="w-3 h-3"/>DOT Violations
                      </div>
                      <p className="text-[10.5px] text-red-300/55">This vehicle has {selected.violations} active DOT violation(s). Schedule maintenance immediately to restore compliance.</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1"><RefreshCw className="w-3 h-3"/>Inspect</Button>
                    <Button variant="ghost" size="sm" className="flex-1">Schedule</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#08090F] border border-white/[0.07] rounded-[3px] p-8 text-center">
                <Truck className="w-8 h-8 text-white/10 mx-auto mb-3"/>
                <p className="text-[12px] text-white/25">Select a vehicle to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

import { mockClients } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import { getRiskColor, getRiskLabel, formatDate, classifyRisk } from '@/lib/utils';
import type { ClientStatus } from '@/types';

export function ClientTable() {
  return (
    <div className="bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div>
          <div className="text-[12px] font-bold text-white/90">Client Registry</div>
          <div className="text-[10px] text-white/30 mt-0.5">{mockClients.length} active clients · Sorted by risk score</div>
        </div>
        <a href="/clients" className="text-[10px] text-amber-400/70 hover:text-amber-400 font-semibold transition-colors">Full Registry →</a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {['Client', 'Industry', 'Risk Score', 'Last Assessment', 'Next Review', 'Status', 'Incidents'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[8.5px] font-bold tracking-[2px] uppercase text-white/25">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {mockClients.sort((a, b) => b.riskScore - a.riskScore).map(client => (
              <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-4 py-3">
                  <div className="text-[12px] font-semibold text-white/82 group-hover:text-white transition-colors">{client.name}</div>
                  <div className="text-[9.5px] text-white/25 font-mono">{client.id}</div>
                </td>
                <td className="px-4 py-3 text-[11px] text-white/45">{client.industry}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width:`${(client.riskScore/10)*100}%`, background: getRiskColor(client.riskScore) }} />
                    </div>
                    <span className="text-[11.5px] font-bold font-mono" style={{ color: getRiskColor(client.riskScore) }}>
                      {client.riskScore}
                    </span>
                    <Badge variant={classifyRisk(client.riskScore)} label={getRiskLabel(client.riskScore)} className="hidden lg:inline-flex" />
                  </div>
                </td>
                <td className="px-4 py-3 text-[11px] text-white/40">{formatDate(client.lastAssessment)}</td>
                <td className="px-4 py-3 text-[11px] text-white/40">{formatDate(client.nextReview)}</td>
                <td className="px-4 py-3"><Badge variant={client.status as ClientStatus} label={client.status} /></td>
                <td className="px-4 py-3">
                  <span className={`text-[12px] font-bold font-mono ${client.incidents > 2 ? 'text-red-400' : client.incidents > 1 ? 'text-orange-400' : 'text-white/40'}`}>
                    {client.incidents}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

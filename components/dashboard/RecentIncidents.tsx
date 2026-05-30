import { mockIncidents } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import { timeAgo } from '@/lib/utils';
import { MapPin, Clock } from 'lucide-react';
import type { SeverityLevel, IncidentStatus } from '@/types';

export function RecentIncidents() {
  const recent = mockIncidents.slice(0, 5);

  return (
    <div className="bg-[#08090F] border border-white/[0.07] border-t-amber-500 border-t-[2px] rounded-[3px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div>
          <div className="text-[12px] font-bold text-white/90">Recent Incidents</div>
          <div className="text-[10px] text-white/30 mt-0.5">{recent.length} active investigations</div>
        </div>
        <a href="/incidents" className="text-[10px] text-amber-400/70 hover:text-amber-400 font-semibold transition-colors">View All →</a>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {recent.map(inc => (
          <div key={inc.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
            <div className={`w-1 self-stretch rounded-full flex-shrink-0 min-h-[32px] ${
              inc.severity === 'critical' ? 'bg-red-500' :
              inc.severity === 'high'     ? 'bg-orange-500' :
              inc.severity === 'medium'   ? 'bg-yellow-400' : 'bg-green-500'
            }`} />
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] font-semibold text-white/82 truncate mb-1">{inc.title}</div>
              <div className="flex items-center gap-3 text-[9.5px] text-white/30 flex-wrap">
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
    </div>
  );
}

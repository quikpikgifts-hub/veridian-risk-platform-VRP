'use client';
import { useState } from 'react';
import { mockThreatFeed } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import { timeAgo } from '@/lib/utils';
import { Radar } from 'lucide-react';
import type { SeverityLevel } from '@/types';

export function AlertFeed() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="bg-[#171717] border border-[#262626] border-t-blue-500 border-t-[2px] rounded-[5px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <Radar className="w-3.5 h-3.5 text-blue-400" />
          <div><div className="text-[12px] font-bold text-white/92">Risk Detection</div><div className="text-[10px] text-white/36 mt-0.5">Operational intelligence updates</div></div>
        </div>
        <a href="/threat-intel" className="text-[10px] text-blue-400/75 hover:text-blue-300 font-semibold transition-colors">View All</a>
      </div>
      <div className="divide-y divide-white/[0.04] max-h-[340px] overflow-y-auto scrollable">
        {mockThreatFeed.map(feed => (
          <div key={feed.id} className="px-4 py-3 hover:bg-white/[0.025] transition-colors">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={feed.severity as SeverityLevel} label={feed.severity} dot />
                {feed.actionable && <span className="text-[8.5px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/25 px-1.5 py-0.5 rounded-[2px] uppercase tracking-[1px]">Recommended Action</span>}
              </div>
              <span className="text-[9px] text-white/30 flex-shrink-0">{timeAgo(feed.timestamp)}</span>
            </div>
            <div className="text-[11.5px] font-semibold text-white/82 mb-0.5 cursor-pointer hover:text-white transition-colors" onClick={() => setExpanded(expanded === feed.id ? null : feed.id)}>{feed.title}</div>
            <div className="text-[9.5px] text-white/34 mb-1">{feed.source} | {feed.location}</div>
            {expanded === feed.id && <p className="text-[10.5px] text-white/55 leading-relaxed mt-2 border-t border-white/[0.05] pt-2 animate-slide-up">{feed.summary}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

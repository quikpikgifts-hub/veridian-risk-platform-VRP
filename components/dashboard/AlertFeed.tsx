'use client';
import { useState } from 'react';
import { mockThreatFeed } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import { timeAgo } from '@/lib/utils';
import { ExternalLink, Rss } from 'lucide-react';
import type { SeverityLevel } from '@/types';

export function AlertFeed() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-[#08090F] border border-white/[0.07] border-t-red-500 border-t-[2px] rounded-[3px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Rss className="w-3.5 h-3.5 text-red-400" />
          <div>
            <div className="text-[12px] font-bold text-white/90">Threat Intelligence Feed</div>
            <div className="text-[10px] text-white/30 mt-0.5">Live regional threat updates</div>
          </div>
        </div>
        <a href="/threat-intel" className="text-[10px] text-amber-400/70 hover:text-amber-400 font-semibold transition-colors">View All →</a>
      </div>

      <div className="divide-y divide-white/[0.04] max-h-[340px] overflow-y-auto scrollable">
        {mockThreatFeed.map(feed => (
          <div key={feed.id} className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={feed.severity as SeverityLevel} label={feed.severity} dot />
                {feed.actionable && (
                  <span className="text-[8.5px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded-[2px] uppercase tracking-[1px]">
                    Actionable
                  </span>
                )}
              </div>
              <span className="text-[9px] text-white/25 flex-shrink-0">{timeAgo(feed.timestamp)}</span>
            </div>
            <div className="text-[11.5px] font-semibold text-white/80 mb-0.5 cursor-pointer hover:text-white transition-colors"
              onClick={() => setExpanded(expanded === feed.id ? null : feed.id)}>
              {feed.title}
            </div>
            <div className="text-[9.5px] text-white/30 mb-1">{feed.source} · {feed.location}</div>
            {expanded === feed.id && (
              <p className="text-[10.5px] text-white/48 leading-relaxed mt-2 border-t border-white/[0.05] pt-2 animate-slide-up">
                {feed.summary}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

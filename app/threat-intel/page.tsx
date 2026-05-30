'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GenerateReportModal } from '@/components/incidents/GenerateReportModal';
import { useToast } from '@/components/ui/Toast';
import { mockThreatFeed } from '@/lib/mock-data';
import { timeAgo } from '@/lib/utils';
import type { SeverityLevel } from '@/types';
import {
  Radar, ExternalLink, MapPin, RefreshCw,
  Cpu, CheckCircle2, BookmarkPlus, Share2
} from 'lucide-react';

const categories = [
  { value: 'all',               label: 'All' },
  { value: 'workplace-violence',label: 'Workplace Violence' },
  { value: 'theft',             label: 'Theft' },
  { value: 'trespass',          label: 'Trespass' },
  { value: 'safety',            label: 'Safety' },
  { value: 'compliance',        label: 'Compliance' },
  { value: 'fleet',             label: 'Fleet' },
] as const;

export default function ThreatIntelPage() {
  const { toast } = useToast();
  const [catFilter,    setCatFilter]    = useState('all');
  const [refreshing,   setRefreshing]   = useState(false);
  const [savedItems,   setSavedItems]   = useState<Set<string>>(new Set());
  const [reportOpen,   setReportOpen]   = useState(false);
  const [expandedId,   setExpandedId]   = useState<string|null>(null);

  const filtered = mockThreatFeed.filter(t => catFilter === 'all' || t.category === catFilter);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast('success', 'Intelligence Updated', 'All threat feeds refreshed successfully.');
    }, 1400);
  };

  const handleSave = (id: string, title: string) => {
    setSavedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast('info', 'Removed from saved', title);
      } else {
        next.add(id);
        toast('success', 'Saved to briefing', title);
      }
      return next;
    });
  };

  const handleShare = (title: string) => {
    toast('info', 'Link copied', `Intelligence item "${title}" link copied to clipboard.`);
  };

  const counts = {
    critical: mockThreatFeed.filter(t => t.severity === 'critical').length,
    high:     mockThreatFeed.filter(t => t.severity === 'high').length,
    actionable: mockThreatFeed.filter(t => t.actionable).length,
  };

  return (
    <Sidebar>
      <div className="p-4 md:p-6 anim-fade-up">

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-[9px] font-bold tracking-[4px] uppercase text-amber-400/70 mb-1">Intelligence Center</div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-white leading-tight">Threat Intelligence</h1>
            <p className="text-[11px] text-white/35 mt-1">Real-time operational intelligence · Central Florida + Nationwide</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="md" onClick={() => setReportOpen(true)}>
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Generate Brief</span>
              <span className="sm:hidden">Brief</span>
            </Button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-[10px] font-bold tracking-[1.5px] uppercase text-amber-400/70 hover:text-amber-400 border border-amber-500/25 hover:border-amber-500/50 px-3 py-2 transition-all rounded-[2px] disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{refreshing ? 'Refreshing…' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Critical Alerts', value: counts.critical,   color: 'text-red-400',    border: 'border-red-500/25',    bg: 'bg-red-500/10'    },
            { label: 'High Priority',   value: counts.high,        color: 'text-orange-400', border: 'border-orange-500/25', bg: 'bg-orange-500/10' },
            { label: 'Actionable',      value: counts.actionable,  color: 'text-green-400',  border: 'border-green-500/25',  bg: 'bg-green-500/10'  },
          ].map(s => (
            <div key={s.label} className={`${s.bg} ${s.border} border p-3 rounded-[3px] text-center`}>
              <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-[9px] font-bold tracking-[2px] uppercase text-white/35 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* AI agent notice */}
        <div className="flex items-start gap-3 bg-amber-500/8 border border-amber-500/20 p-3 mb-5 rounded-[2px]">
          <Cpu className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-[10px] font-bold text-amber-400 mb-0.5">AI Intelligence Analyst · Active</div>
            <div className="text-[11px] text-amber-200/55 leading-relaxed">
              Monitoring public crime databases, OSHA records, DHS bulletins, FDOT reports, and local law enforcement feeds.
              All intelligence requires Steve's validation before operational use.
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[9px] text-green-400 font-bold">LIVE</span>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-1.5 flex-wrap mb-5 pb-4 border-b border-white/[0.06]">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCatFilter(cat.value)}
              className={`text-[9.5px] font-bold tracking-[1px] uppercase px-3 py-1.5 transition-all rounded-[2px] ${
                catFilter === cat.value
                  ? 'bg-amber-500 text-black'
                  : 'bg-[#0D0D18] border border-white/[0.07] text-white/40 hover:text-white/70 hover:border-white/15'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Feed grid */}
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-white/25 text-[12px] bg-[#0D0D18] border border-white/[0.06] rounded-[3px]">
            No intelligence items match this category
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {filtered.map(threat => {
              const isExpanded = expandedId === threat.id;
              const isSaved    = savedItems.has(threat.id);

              return (
                <div
                  key={threat.id}
                  className="bg-[#0D0D18] border border-white/[0.06] hover:border-white/[0.12] p-4 transition-all rounded-[3px] group"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={threat.severity as SeverityLevel} label={threat.severity} dot />
                      {threat.actionable && (
                        <div className="flex items-center gap-1 text-[8.5px] font-bold text-green-400 bg-green-500/10 border border-green-500/25 px-2 py-0.5 rounded-[2px]">
                          <CheckCircle2 className="w-2.5 h-2.5" />Actionable
                        </div>
                      )}
                    </div>
                    <span className="text-[9.5px] text-white/25 flex-shrink-0">{timeAgo(threat.timestamp)}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[13px] font-bold text-white/85 leading-snug mb-2 group-hover:text-white transition-colors">
                    {threat.title}
                  </h3>

                  {/* Summary */}
                  <p className={`text-[11px] text-white/45 leading-relaxed mb-3 transition-all ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {threat.summary}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-[9.5px] text-white/30 mb-3">
                    <span className="text-amber-400/60 font-semibold">{threat.source}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />{threat.location}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 pt-2.5 border-t border-white/[0.05]">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : threat.id)}
                      className="flex-1 text-[9.5px] font-bold tracking-[1px] uppercase text-amber-400/60 hover:text-amber-400 transition-colors text-left"
                    >
                      {isExpanded ? 'Show less ↑' : 'Read more ↓'}
                    </button>
                    <button
                      onClick={() => handleSave(threat.id, threat.title)}
                      className={`p-1.5 rounded transition-colors ${isSaved ? 'text-amber-400' : 'text-white/25 hover:text-amber-400/70'}`}
                      title={isSaved ? 'Remove from saved' : 'Save to briefing'}
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleShare(threat.title)}
                      className="p-1.5 rounded text-white/25 hover:text-white/60 transition-colors"
                      title="Copy link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded text-white/20 hover:text-white/50 transition-colors"
                      title="Open source"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between flex-wrap gap-2">
          <span className="text-[9.5px] text-white/20">Sources: OCSO · DHS · FDOT · OSHA Region 4 · FL Crime Stats · Public Records</span>
          <span className="text-[9.5px] text-amber-400/35">Validated by Steve Smith · Final Authority</span>
        </div>
      </div>

      <GenerateReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        incident={null}
      />
    </Sidebar>
  );
}

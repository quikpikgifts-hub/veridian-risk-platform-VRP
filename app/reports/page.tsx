'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AIOutputBox } from '@/components/shared/AIOutputBox';
import { mockReports } from '@/lib/mock-data';
import { reportStatusConfig, timeAgo } from '@/lib/utils';
import { FileText, Brain, Download, Search, Plus, Play, RefreshCw } from 'lucide-react';
import type { Report } from '@/types';

const REPORT_TYPES = [
  'Risk Assessment Report','OSHA Compliance Audit','Fleet Safety Assessment',
  'De-Escalation Protocol','Service Proposal','Executive Briefing',
  'Emergency Action Plan','Workplace Violence Prevention Plan','HR Policy Document','DOT Compliance Report',
];

export default function ReportsPage() {
  const [search,    setSearch]   = useState('');
  const [genOpen,   setGenOpen]  = useState(false);
  const [loading,   setLoad]     = useState(false);
  const [output,    setOutput]   = useState('');
  const [form, setForm] = useState({ type:'Risk Assessment Report', client:'', notes:'', tone:'Professional Executive' });

  const filtered = mockReports.filter(r =>
    !search || r.title.toLowerCase().includes(search.toLowerCase()) || (r.clientName||'').toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:     mockReports.length,
    delivered: mockReports.filter(r => r.status === 'delivered').length,
    review:    mockReports.filter(r => r.status === 'review').length,
    aiGen:     mockReports.filter(r => r.aiGenerated).length,
  };

  const generate = async () => {
    if (!form.client || !form.notes) return;
    setLoad(true); setOutput('');
    try {
      const res = await fetch('/api/ai-agent', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          agent:'agt-03', agentName:'Report Writer',
          task:`Generate a professional ${form.type} for:\nClient: ${form.client}\nTone: ${form.tone}\n\nKey Information:\n${form.notes}`,
        }),
      });
      const d = await res.json();
      setOutput(d.output || d.content || '');
    } catch { setOutput('Error generating report. Check API key in settings.'); }
    finally { setLoad(false); }
  };

  const typeIcon = (type: Report['type']) => {
    const map: Record<string, string> = {
      'risk-assessment':'🎯','osha':'📋','fleet':'🚛','executive':'📊',
      'de-escalation':'⚡','proposal':'💼','incident':'🚨',
    };
    return map[type] || '📄';
  };

  return (
    <Sidebar>
      <div className="p-4 md:p-5 space-y-4 anim-fade-up">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[9px] font-bold tracking-[4px] uppercase text-amber-400/70 mb-1">Document Center</div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-white">Reports Center</h1>
            <p className="text-[11px] text-white/35 mt-1">AI-generated documents · {stats.total} reports · Steve approves all deliverables</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="md" onClick={() => setGenOpen(!genOpen)}>
              <Brain className="w-3.5 h-3.5"/>AI Generate
            </Button>
            <Button variant="primary" size="md">
              <Plus className="w-3.5 h-3.5"/>New Report
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l:'Total Reports', v:stats.total,     c:'text-amber-400' },
            { l:'Delivered',     v:stats.delivered, c:'text-green-400' },
            { l:'In Review',     v:stats.review,    c:'text-orange-400'},
            { l:'AI Generated',  v:stats.aiGen,     c:'text-blue-400'  },
          ].map((s,i) => (
            <div key={i} className="bg-[#08090F] border border-white/[0.07] p-3.5 rounded-[3px]">
              <div className="text-[8px] font-bold tracking-[2.5px] uppercase text-white/25 mb-2">{s.l}</div>
              <div className={`text-[28px] font-bold font-mono ${s.c}`}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* AI Generator */}
        {genOpen && (
          <div className="bg-[#08090F] border-t-2 border-t-amber-500 border border-white/[0.07] rounded-[3px] overflow-hidden anim-slide-down">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
              <Brain className="w-3.5 h-3.5 text-amber-400"/>
              <div className="text-[12px] font-bold text-white/90">AI Report Generator</div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] font-bold tracking-[2px] uppercase text-white/30 mb-1.5">Report Type</label>
                  <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
                    className="w-full bg-black/30 border border-white/[0.08] text-white text-[12px] p-2.5 rounded-[2px] input-focus">
                    {REPORT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold tracking-[2px] uppercase text-white/30 mb-1.5">Client</label>
                    <input value={form.client} onChange={e=>setForm(f=>({...f,client:e.target.value}))}
                      placeholder="Client name & business"
                      className="w-full bg-black/30 border border-white/[0.08] text-white text-[12px] p-2.5 rounded-[2px] input-focus placeholder:text-white/18"/>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold tracking-[2px] uppercase text-white/30 mb-1.5">Tone</label>
                    <select value={form.tone} onChange={e=>setForm(f=>({...f,tone:e.target.value}))}
                      className="w-full bg-black/30 border border-white/[0.08] text-white text-[12px] p-2.5 rounded-[2px] input-focus">
                      <option>Professional Executive</option>
                      <option>Technical Detailed</option>
                      <option>Summary Brief</option>
                      <option>Urgent Action</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-[2px] uppercase text-white/30 mb-1.5">Field Notes & Key Information</label>
                  <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={6}
                    placeholder="Paste field observations, incident details, client information..."
                    className="w-full bg-black/30 border border-white/[0.08] text-white text-[12px] p-3 rounded-[2px] resize-none input-focus placeholder:text-white/18"/>
                </div>
                <Button variant="primary" size="md" onClick={generate} disabled={loading||!form.client||!form.notes} className="w-full">
                  {loading ? <RefreshCw className="w-3.5 h-3.5 anim-spin"/> : <Play className="w-3.5 h-3.5"/>}
                  {loading ? 'Generating...' : 'Generate Report'}
                </Button>
              </div>
              <AIOutputBox output={output} loading={loading} label="Report Writer — Draft" maxHeight="max-h-[380px]"/>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none"/>
          <input type="text" placeholder="Search reports..." value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full bg-[#08090F] border border-white/[0.08] text-white text-[12px] pl-9 pr-4 py-2 rounded-[2px] input-focus placeholder:text-white/20"/>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(r => {
            const cfg = reportStatusConfig[r.status];
            return (
              <div key={r.id} className="bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden hover:border-white/[0.14] transition-colors">
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-white/[0.03] border border-white/[0.07] rounded-[2px] flex items-center justify-center text-xl flex-shrink-0">
                      {typeIcon(r.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-bold text-white/85 leading-snug mb-1">{r.title}</div>
                      <div className="text-[10px] text-white/30">{r.clientName || 'Internal'}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={r.status as 'active'} label={cfg.label}/>
                      {r.aiGenerated && (
                        <span className="text-[8.5px] font-bold text-blue-400 bg-blue-500/8 border border-blue-500/20 px-1.5 py-0.5 rounded-[2px] uppercase tracking-[1px] flex items-center gap-1">
                          <Brain className="w-2.5 h-2.5"/>AI
                        </span>
                      )}
                    </div>
                    <div className="text-[9.5px] text-white/25">{timeAgo(r.updatedAt)}</div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[9.5px] text-white/25 flex-wrap">
                    <span>By {r.createdBy}</span>
                    {r.pages && <><span>·</span><span>{r.pages}p</span></>}
                    {r.tags.slice(0,2).map(t => (
                      <span key={t} className="bg-white/[0.04] border border-white/[0.07] px-1.5 py-0.5 rounded-[2px] text-[8.5px]">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="px-4 py-2.5 border-t border-white/[0.05] flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="flex-1 text-[9.5px]">
                    <FileText className="w-3 h-3"/>View
                  </Button>
                  {r.status === 'delivered' && (
                    <Button variant="ghost" size="sm" className="flex-1 text-[9.5px]">
                      <Download className="w-3 h-3"/>Download
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Sidebar>
  );
}

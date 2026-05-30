'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AIOutputBox } from '@/components/shared/AIOutputBox';
import { mockRiskAssessments } from '@/lib/mock-data';
import { formatDate, getRiskColor, getRiskLabel, classifyRisk } from '@/lib/utils';
import { ShieldCheck, Plus, Brain, ChevronDown, ChevronUp, RefreshCw, Play } from 'lucide-react';
import type { RiskAssessment } from '@/types';

export default function RiskAssessmentsPage() {
  const [expanded, setExpanded]  = useState<string | null>(null);
  const [newOpen,  setNewOpen]   = useState(false);
  const [genLoading,setGenLoad]  = useState(false);
  const [genOutput, setGenOut]   = useState('');
  const [form, setForm] = useState({ client:'', industry:'', type:'initial', notes:'' });

  const stats = {
    total:    mockRiskAssessments.length,
    critical: mockRiskAssessments.filter(r => r.riskScore >= 8).length,
    pending:  mockRiskAssessments.filter(r => r.status === 'draft' || r.status === 'review').length,
    avgScore: (mockRiskAssessments.reduce((s,r) => s + r.riskScore, 0) / mockRiskAssessments.length).toFixed(1),
  };

  const generateReport = async () => {
    if (!form.client || !form.notes) return;
    setGenLoad(true); setGenOut('');
    try {
      const res = await fetch('/api/ai-agent', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          agent:'agt-03', agentName:'Risk Analyst',
          task:`Generate a professional risk assessment report for:\nClient: ${form.client}\nIndustry: ${form.industry}\nAssessment Type: ${form.type}\n\nField Observations:\n${form.notes}`,
        }),
      });
      const d = await res.json();
      setGenOut(d.output || d.content || '');
    } catch(e) { setGenOut('Error connecting to AI. Check your API key in settings.'); }
    finally { setGenLoad(false); }
  };

  return (
    <Sidebar>
      <div className="p-4 md:p-5 space-y-4 anim-fade-up">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[9px] font-bold tracking-[4px] uppercase text-amber-400/70 mb-1">Risk Management</div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-white">Risk Assessments</h1>
            <p className="text-[11px] text-white/35 mt-1">{stats.total} assessments · AI-powered · OSHA 29 CFR 1910</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="md" onClick={() => setNewOpen(!newOpen)}>
              <Brain className="w-3.5 h-3.5"/>AI Generate
            </Button>
            <Button variant="primary" size="md">
              <Plus className="w-3.5 h-3.5"/>New Assessment
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l:'Total Assessments', v:stats.total,    c:'text-amber-400'  },
            { l:'Critical Risk',     v:stats.critical, c:'text-red-400'    },
            { l:'Pending Review',    v:stats.pending,  c:'text-orange-400' },
            { l:'Avg Risk Score',    v:stats.avgScore, c:'text-amber-400'  },
          ].map((s,i) => (
            <div key={i} className="bg-[#08090F] border border-white/[0.07] p-3.5 rounded-[3px]">
              <div className="text-[8px] font-bold tracking-[2.5px] uppercase text-white/25 mb-2">{s.l}</div>
              <div className={`text-[28px] font-bold font-mono ${s.c}`}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* AI Generate Panel */}
        {newOpen && (
          <div className="bg-[#08090F] border-t-2 border-t-amber-500 border border-white/[0.07] rounded-[3px] overflow-hidden anim-slide-down">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
              <Brain className="w-3.5 h-3.5 text-amber-400"/>
              <div className="text-[12px] font-bold text-white/90">AI Risk Assessment Generator</div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] font-bold tracking-[2px] uppercase text-white/30 mb-1.5">Client / Business Name *</label>
                  <input value={form.client} onChange={e=>setForm(f=>({...f,client:e.target.value}))}
                    placeholder="e.g. Premier Gas Station, Sanford FL"
                    className="w-full bg-black/30 border border-white/[0.08] text-white text-[12px] p-2.5 rounded-[2px] input-focus placeholder:text-white/18"/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold tracking-[2px] uppercase text-white/30 mb-1.5">Industry</label>
                    <select value={form.industry} onChange={e=>setForm(f=>({...f,industry:e.target.value}))}
                      className="w-full bg-black/30 border border-white/[0.08] text-white text-[12px] p-2.5 rounded-[2px] input-focus">
                      <option value="">Select...</option>
                      {['Retail/Fuel','Restaurant','Apartments','Logistics','Construction','Church','Dealership','Hospitality','Healthcare'].map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold tracking-[2px] uppercase text-white/30 mb-1.5">Type</label>
                    <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
                      className="w-full bg-black/30 border border-white/[0.08] text-white text-[12px] p-2.5 rounded-[2px] input-focus">
                      <option value="initial">Initial</option>
                      <option value="follow-up">Follow-Up</option>
                      <option value="annual">Annual</option>
                      <option value="incident-triggered">Incident Triggered</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-[2px] uppercase text-white/30 mb-1.5">Field Observations *</label>
                  <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={6}
                    placeholder="Describe what you observed on site — lighting, cameras, floor hazards, tire stacking, PPE gaps, exit routes, fire extinguisher access, fluid spills..."
                    className="w-full bg-black/30 border border-white/[0.08] text-white text-[12px] p-3 rounded-[2px] resize-none input-focus placeholder:text-white/18"/>
                </div>
                <Button variant="primary" size="md" onClick={generateReport} disabled={genLoading || !form.client || !form.notes} className="w-full">
                  {genLoading ? <RefreshCw className="w-3.5 h-3.5 anim-spin"/> : <Play className="w-3.5 h-3.5"/>}
                  {genLoading ? 'Generating...' : 'Generate AI Report'}
                </Button>
              </div>
              <div>
                <AIOutputBox output={genOutput} loading={genLoading} label="Risk Analyst — Draft Report" maxHeight="max-h-[380px]"/>
                <div className="mt-3 text-[9.5px] text-white/22 leading-relaxed">
                  AI output is a draft. Steve Washington Smith reviews and approves before client delivery. Reports cite OSHA 29 CFR 1910 standards.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assessments List */}
        <div className="space-y-3">
          {mockRiskAssessments.map(ra => (
            <div key={ra.id} className="bg-[#08090F] border border-white/[0.07] rounded-[3px] overflow-hidden">
              {/* Row */}
              <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpanded(expanded === ra.id ? null : ra.id)}>
                <div className="w-10 h-10 rounded-[2px] flex items-center justify-center flex-shrink-0"
                  style={{ background:`${getRiskColor(ra.riskScore)}15`, border:`1px solid ${getRiskColor(ra.riskScore)}35` }}>
                  <ShieldCheck className="w-4.5 h-4.5" style={{ color: getRiskColor(ra.riskScore) }}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[13px] font-bold text-white/88">{ra.clientName}</span>
                    <span className="text-[9.5px] font-mono text-white/25">{ra.id}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-white/32 flex-wrap">
                    <span>{ra.industry}</span>
                    <span className="capitalize">{ra.assessmentType.replace('-', ' ')}</span>
                    <span>By {ra.assessedBy}</span>
                    <span>Next: {formatDate(ra.nextReview)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-[20px] font-bold font-mono leading-none" style={{color:getRiskColor(ra.riskScore)}}>{ra.riskScore}</div>
                    <div className="text-[8.5px] text-white/28">{getRiskLabel(ra.riskScore)}</div>
                  </div>
                  <Badge variant={ra.status as 'active'} label={ra.status}/>
                  {expanded === ra.id ? <ChevronUp className="w-4 h-4 text-white/25"/> : <ChevronDown className="w-4 h-4 text-white/25"/>}
                </div>
              </div>

              {/* Expanded */}
              {expanded === ra.id && (
                <div className="border-t border-white/[0.06] p-4 anim-slide-down">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-bold text-white/40 uppercase tracking-[2px] mb-2.5">Findings ({ra.findings.length})</div>
                      <div className="space-y-2">
                        {ra.findings.map(f => (
                          <div key={f.id} className="p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-[2px]">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={classifyRisk(f.severity === 'critical' ? 9 : f.severity === 'high' ? 7 : 5)} label={f.severity}/>
                              <span className="text-[11px] font-semibold text-white/75">{f.category}</span>
                            </div>
                            <p className="text-[10.5px] text-white/45 mb-1">{f.description}</p>
                            {f.standard && <div className="text-[9.5px] font-mono text-amber-400/55">{f.standard}</div>}
                            <div className="text-[9.5px] text-green-400/65 mt-1">→ {f.remediation}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white/40 uppercase tracking-[2px] mb-2.5">Recommendations</div>
                      <div className="space-y-1.5">
                        {ra.recommendations.map((r,i) => (
                          <div key={i} className="flex items-start gap-2 text-[11px] text-white/50">
                            <span className="text-amber-400 mt-0.5 flex-shrink-0">{i+1}.</span>{r}
                          </div>
                        ))}
                      </div>
                      {ra.aiSummary && (
                        <div className="mt-3 bg-amber-500/[0.05] border border-amber-500/18 p-3 rounded-[2px]">
                          <div className="text-[8.5px] font-bold text-amber-400 uppercase tracking-[1.5px] mb-1 flex items-center gap-1.5">
                            <Brain className="w-3 h-3"/>AI Analysis
                          </div>
                          <p className="text-[10.5px] text-amber-100/55 leading-relaxed">{ra.aiSummary}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
}

'use client';

import { useState } from 'react';
import { Modal, Field, Select, Textarea } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Cpu, FileText, Download, CheckCircle2, Loader2, Copy } from 'lucide-react';
import type { Incident } from '@/types';

interface GenerateReportModalProps {
  open: boolean;
  onClose: () => void;
  incident?: Incident | null;
}

type Step = 'configure' | 'generating' | 'done';

const reportTypes = [
  { value: 'incident-summary',  label: 'Incident Summary Report' },
  { value: 'executive-brief',   label: 'Executive Briefing' },
  { value: 'risk-assessment',   label: 'Risk Assessment Report' },
  { value: 'compliance-audit',  label: 'Compliance Audit Report' },
  { value: 'client-proposal',   label: 'Client Service Proposal' },
  { value: 'fleet-safety',      label: 'Fleet Safety Assessment' },
  { value: 'follow-up',         label: 'Follow-Up Recommendation' },
];

export function GenerateReportModal({ open, onClose, incident }: GenerateReportModalProps) {
  const { toast } = useToast();
  const [step, setStep]           = useState<Step>('configure');
  const [reportType, setReportType] = useState('incident-summary');
  const [notes, setNotes]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [error, setError]         = useState('');

  const reset = () => { setStep('configure'); setReportContent(''); setError(''); setNotes(''); };
  const handleClose = () => { reset(); onClose(); };

  const handleGenerate = async () => {
    setLoading(true); setError(''); setStep('generating');
    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          incidentData: incident,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReportContent(data.report);
        setStep('done');
        toast('success', 'Report drafted', 'AI draft ready for your review.');
      } else {
        setError(data.error || 'Generation failed.');
        setStep('configure');
      }
    } catch {
      setError('Connection error. Verify ANTHROPIC_API_KEY in Vercel settings.');
      setStep('configure');
    } finally {
      setLoading(false);
    }
  };

  const copyReport = () => {
    navigator.clipboard.writeText(reportContent);
    toast('success', 'Copied to clipboard', 'Paste into Word or email for editing.');
  };

  return (
    <Modal open={open} onClose={handleClose} title="Generate AI Report"
      subtitle={incident ? `Incident: ${incident.id}` : 'AI-assisted document generation'}
      size="lg"
      footer={
        step === 'configure' ? (
          <>
            <Button variant="ghost" size="md" onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button variant="primary" size="md" onClick={handleGenerate} disabled={loading}>
              {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating...</> : <><Cpu className="w-3.5 h-3.5" />Generate Report</>}
            </Button>
          </>
        ) : step === 'done' ? (
          <>
            <Button variant="ghost" size="md" onClick={handleClose}>Close</Button>
            <Button variant="outline" size="md" onClick={copyReport}><Copy className="w-3.5 h-3.5" />Copy Report</Button>
            <Button variant="primary" size="md" onClick={() => { toast('success','Approved & queued','Report sent to client delivery queue.'); handleClose(); }}>
              <Download className="w-3.5 h-3.5" />Approve & Queue
            </Button>
          </>
        ) : null
      }
    >
      {step === 'configure' && (
        <div>
          {incident && (
            <div className="mb-4 p-3 bg-white/[0.03] border border-white/[0.07] rounded-[2px]">
              <div className="text-[9.5px] font-bold tracking-[2px] uppercase text-white/30 mb-1">Linked Incident</div>
              <div className="text-[12px] font-semibold text-white/80">{incident.title}</div>
              <div className="text-[10.5px] text-white/40 mt-0.5">{incident.location} · {incident.id}</div>
            </div>
          )}
          <Field label="Report Type" required>
            <Select value={reportType} onChange={e => setReportType(e.target.value)}>
              {reportTypes.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </Select>
          </Field>
          <Field label="Additional Context for AI" hint="Field notes, observations, or specific requirements">
            <Textarea placeholder="Add context to improve report accuracy..." value={notes} onChange={e => setNotes(e.target.value)} rows={4} />
          </Field>
          {error && <div className="mt-2 p-2.5 bg-red-500/10 border border-red-500/30 rounded-[2px] text-[10px] text-red-400">{error}</div>}
          <div className="p-3 bg-amber-500/8 border border-amber-500/20 rounded-[2px] mt-2">
            <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-[1.5px] uppercase text-amber-400 mb-1"><Cpu className="w-3 h-3" />AI Risk Analyst — Claude Sonnet</div>
            <p className="text-[11px] text-amber-200/55 leading-relaxed">Report is AI-drafted using your Anthropic API. Steve reviews and approves before delivery.</p>
          </div>
        </div>
      )}
      {step === 'generating' && (
        <div className="py-8 text-center">
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-2 border-amber-500/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-amber-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center"><Cpu className="w-6 h-6 text-amber-400" /></div>
            </div>
          </div>
          <div className="text-[13px] font-bold text-white mb-1">Claude AI Processing</div>
          <div className="text-[11px] text-amber-400/70 animate-pulse">Drafting professional report...</div>
        </div>
      )}
      {step === 'done' && (
        <div>
          <div className="flex items-center gap-2 mb-3 p-2.5 bg-green-500/10 border border-green-500/25 rounded-[2px]">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-[11px] text-green-400 font-semibold">Report drafted by Claude AI — Review before delivery</span>
          </div>
          <div className="bg-[#0D0D18] border border-white/[0.07] rounded-[2px] p-4 max-h-72 overflow-y-auto">
            <div className="text-[10.5px] text-white/75 leading-relaxed whitespace-pre-wrap">{reportContent}</div>
          </div>
          <div className="mt-3 p-2.5 bg-amber-500/8 border border-amber-500/20 rounded-[2px] flex items-start gap-2">
            <FileText className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <span className="text-[10.5px] text-amber-200/55">Copy this draft into Word or email. Edit and approve before sending to client.</span>
          </div>
        </div>
      )}
    </Modal>
  );
}

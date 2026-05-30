'use client';

import { useState } from 'react';
import { Modal, Field, Input, Textarea, Select } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { AlertTriangle, MapPin, Building2, User, FileText } from 'lucide-react';

interface CreateIncidentModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function CreateIncidentModal({ open, onClose, onCreated }: CreateIncidentModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    location: '',
    industry: '',
    severity: 'medium',
    category: 'workplace-violence',
    description: '',
    assignedTo: 'Steve Smith',
  });

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.title || !form.location) {
      toast('error', 'Required fields missing', 'Please fill in title and location.');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast('success', 'Incident created', `INC-2025-00${Math.floor(Math.random()*9)+9} logged and assigned.`);
      setForm({ title: '', location: '', industry: '', severity: 'medium', category: 'workplace-violence', description: '', assignedTo: 'Steve Smith' });
      onCreated?.();
      onClose();
    }, 900);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create New Incident"
      subtitle="Log and track a new operational incident"
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="md" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" size="md" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <><div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />Creating...</>
            ) : (
              <><AlertTriangle className="w-3.5 h-3.5" />Create Incident</>
            )}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Field label="Incident Title" required>
          <Input
            placeholder="e.g. Verbal Altercation — Main Entrance"
            value={form.title}
            onChange={e => update('title', e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Severity" required>
            <Select value={form.severity} onChange={e => update('severity', e.target.value)}>
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </Select>
          </Field>
          <Field label="Category" required>
            <Select value={form.category} onChange={e => update('category', e.target.value)}>
              <option value="workplace-violence">Workplace Violence</option>
              <option value="theft">Theft</option>
              <option value="trespass">Trespass</option>
              <option value="safety">Safety Hazard</option>
              <option value="compliance">Compliance</option>
              <option value="fleet">Fleet</option>
            </Select>
          </Field>
        </div>

        <Field label="Location / Property" required>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
            <Input
              placeholder="e.g. Orange Ave Gas Station — Lot B"
              value={form.location}
              onChange={e => update('location', e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Industry">
            <Select value={form.industry} onChange={e => update('industry', e.target.value)}>
              <option value="">Select industry…</option>
              <option value="Retail / Fuel">Retail / Fuel</option>
              <option value="Property Management">Property Management</option>
              <option value="Transportation">Transportation</option>
              <option value="Religious Organization">Religious Organization</option>
              <option value="Dealership">Dealership</option>
              <option value="Construction">Construction</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Retail">Retail</option>
              <option value="Healthcare">Healthcare</option>
            </Select>
          </Field>
          <Field label="Assigned To">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
              <Input
                value={form.assignedTo}
                onChange={e => update('assignedTo', e.target.value)}
                className="pl-9"
              />
            </div>
          </Field>
        </div>

        <Field label="Description" hint="Describe what happened. Include all observable facts.">
          <Textarea
            placeholder="Describe the incident in detail — timeline, persons involved, actions taken…"
            value={form.description}
            onChange={e => update('description', e.target.value)}
            rows={4}
          />
        </Field>

        <div className="flex items-center gap-2 mt-1 p-2.5 bg-amber-500/8 border border-amber-500/20 rounded-[2px]">
          <FileText className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="text-[10.5px] text-amber-200/60">
            AI Risk Analyst will draft a preliminary report for Steve's review after creation.
          </span>
        </div>
      </form>
    </Modal>
  );
}

'use client';

import React, { useState } from 'react';
import { Booking, Resource, Incident, IncidentType, IncidentSeverity } from '@/types';
import { 
  X, 
  AlertTriangle, 
  Camera, 
  ShieldAlert, 
  Send,
  FileWarning
} from 'lucide-react';

interface IncidentModalProps {
  booking: Booking | null;
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    bookingId: string;
    resourceId: string;
    incidentType: IncidentType;
    severity: IncidentSeverity;
    description: string;
    evidenceUrl?: string;
  }) => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({
  booking,
  resource,
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen || !booking || !resource) return null;

  const [incidentType, setIncidentType] = useState<IncidentType>('damage');
  const [severity, setSeverity] = useState<IncidentSeverity>('medium');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSubmit({
      bookingId: booking.id,
      resourceId: resource.id,
      incidentType,
      severity,
      description: description.trim(),
      evidenceUrl: evidenceUrl.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-red-400 tracking-wider uppercase">
              Step 9: Incident & Safety Governance Report
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">{resource.title}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Document damage, overdue returns, or safety protocol violations for formal institutional review.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Incident Type */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Incident Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'damage', label: 'Physical Damage / Wear' },
                { type: 'overdue_return', label: 'Overdue / Late Return' },
                { type: 'safety_breach', label: 'Safety Protocol Breach' },
                { type: 'unauthorized_access', label: 'Unauthorized Personnel' },
              ].map(item => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setIncidentType(item.type as IncidentType)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all ${
                    incidentType === item.type
                      ? 'bg-red-500/20 text-red-300 border-red-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Severity Level
            </label>
            <div className="grid grid-cols-4 gap-2 text-center">
              {(['low', 'medium', 'high', 'critical'] as IncidentSeverity[]).map(sev => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverity(sev)}
                  className={`py-2 rounded-lg text-xs font-bold capitalize border transition-all ${
                    severity === sev
                      ? sev === 'critical'
                        ? 'bg-red-600 text-white border-red-500'
                        : sev === 'high'
                        ? 'bg-orange-600 text-white border-orange-500'
                        : sev === 'medium'
                        ? 'bg-amber-600 text-white border-amber-500'
                        : 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Detailed Description of Occurrence
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what occurred, any warning lights, tool failure, or safety anomalies observed..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Evidence photo */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-slate-400" />
              Evidence Photo Link / Documentation
            </label>
            <input
              type="text"
              value={evidenceUrl}
              onChange={e => setEvidenceUrl(e.target.value)}
              placeholder="https://... photo link of broken bit or error code"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Penalty notice */}
          <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-xs text-red-300/90 flex items-start gap-2">
            <FileWarning className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>
              Filing this report flags the reservation for manager investigation. The user's FairShare rating will be held pending resolution.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-slate-950 font-bold text-xs shadow-lg shadow-red-500/25 transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              File Incident Report
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

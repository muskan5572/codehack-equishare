'use client';

import React, { useState } from 'react';
import { Booking, Resource, ConditionReport, PhysicalCondition } from '@/types';
import { 
  X, 
  RotateCcw, 
  Star, 
  Camera, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckOutModalProps {
  booking: Booking | null;
  resource: Resource | null;
  checkInReport: ConditionReport | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingId: string, report: Omit<ConditionReport, 'id' | 'stage' | 'booking_id' | 'created_at'>) => void;
  onOpenIncident: (booking: Booking) => void;
}

export const CheckOutModal: React.FC<CheckOutModalProps> = ({
  booking,
  resource,
  checkInReport,
  isOpen,
  onClose,
  onSubmit,
  onOpenIncident,
}) => {
  if (!isOpen || !booking || !resource) return null;

  const [physicalCondition, setPhysicalCondition] = useState<PhysicalCondition>('flawless');
  const [cleanliness, setCleanliness] = useState(5);
  const [guardsIntact, setGuardsIntact] = useState(true);
  const [calibrated, setCalibrated] = useState(true);
  const [areaCleaned, setAreaCleaned] = useState(true);
  const [photoUrl, setPhotoUrl] = useState(resource.images[0] || '');
  const [notes, setNotes] = useState('');

  // Discrepancy detection: check if final condition degraded compared to baseline check-in
  const conditionRanks: Record<PhysicalCondition, number> = {
    flawless: 4,
    minor_wear: 3,
    flagged_issue: 2,
    damaged: 1,
  };

  const baselineRank = checkInReport ? conditionRanks[checkInReport.physical_condition] : 4;
  const currentRank = conditionRanks[physicalCondition];
  const hasDiscrepancy = currentRank < baselineRank || cleanliness < (checkInReport?.cleanliness_rating || 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    onSubmit(booking.id, {
      inspector_id: booking.user_id,
      physical_condition: physicalCondition,
      cleanliness_rating: cleanliness,
      checklist_safety_guards_intact: guardsIntact,
      checklist_calibrated: calibrated,
      checklist_area_cleaned: areaCleaned,
      photo_urls: photoUrl ? [photoUrl] : [],
      notes: notes.trim() || 'Session concluded. Resource sanitized and returned.',
      discrepancy_detected: hasDiscrepancy,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <RotateCcw className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
              Step 8: Return Inspection & Condition Documentation
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">{resource.title}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Side-by-side Before & After condition comparison. Verifies integrity for security deposit release and FairShare rating.
            </p>
          </div>
        </div>

        {/* Side-by-Side Comparison Card */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          {/* Baseline Check-in Column */}
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block">
              1. Check-In Baseline Record
            </span>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Condition:</span>
              <span className="font-semibold text-emerald-300 capitalize">
                {checkInReport?.physical_condition.replace('_', ' ') || 'Flawless'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Cleanliness:</span>
              <span className="font-semibold text-amber-300">
                {checkInReport?.cleanliness_rating || 5}/5 Stars
              </span>
            </div>
            <div className="text-slate-400 pt-1 border-t border-slate-800 italic">
              "{checkInReport?.notes || 'Baseline passed'}"
            </div>
          </div>

          {/* Current Return State Column */}
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block">
              2. Return Sign-off State
            </span>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Return Condition:</span>
              <span className={`font-semibold capitalize ${hasDiscrepancy ? 'text-amber-400' : 'text-emerald-300'}`}>
                {physicalCondition.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Cleanliness:</span>
              <span className="font-semibold text-amber-300">{cleanliness}/5 Stars</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <span className="text-slate-400">Discrepancy:</span>
              <span className={hasDiscrepancy ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                {hasDiscrepancy ? 'Degradation Flagged' : 'None Detected'}
              </span>
            </div>
          </div>
        </div>

        {/* Discrepancy Alert */}
        {hasDiscrepancy && (
          <div className="mb-5 p-3.5 bg-amber-950/70 border border-amber-600/40 rounded-xl flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-300">Condition Degradation Notice</p>
                <p className="text-amber-400/90 mt-0.5">
                  The returned condition differs from the check-in baseline. Would you like to file a formal damage/incident report?
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenIncident(booking);
              }}
              className="px-3 py-1 bg-red-500 hover:bg-red-400 text-slate-950 font-bold rounded-lg shrink-0 transition-colors"
            >
              Report Incident
            </button>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Physical Condition Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Return Physical Condition
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['flawless', 'minor_wear', 'flagged_issue', 'damaged'] as PhysicalCondition[]).map(cond => {
                const isSelected = physicalCondition === cond;
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setPhysicalCondition(cond)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold capitalize border transition-all text-center ${
                      isSelected
                        ? cond === 'flawless'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : cond === 'minor_wear'
                          ? 'bg-blue-500 text-slate-950 border-blue-400'
                          : cond === 'flagged_issue'
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-red-500 text-slate-950 border-red-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {cond.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cleanliness */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Work Area Cleanliness: {cleanliness}/5
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setCleanliness(star)}
                  className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                >
                  <Star className={`w-6 h-6 ${star <= cleanliness ? 'text-amber-400 fill-amber-400' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Final Handover Notes / Consumables Used
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g., Vacuum chamber vented, machine turned off, lenses wiped with optical cloth..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Reward Notification */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Reputation Reward:
            </span>
            <span className="font-semibold text-emerald-400">+2 FairShare Points on Flawless Return</span>
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
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Return & Release Deposit
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

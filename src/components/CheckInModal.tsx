'use client';

import React, { useState } from 'react';
import { Booking, Resource, ConditionReport, PhysicalCondition } from '@/types';
import { 
  X, 
  CheckSquare, 
  Camera, 
  Star, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

interface CheckInModalProps {
  booking: Booking | null;
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingId: string, report: Omit<ConditionReport, 'id' | 'stage' | 'booking_id' | 'created_at'>) => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  booking,
  resource,
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen || !booking || !resource) return null;

  const [physicalCondition, setPhysicalCondition] = useState<PhysicalCondition>('flawless');
  const [cleanliness, setCleanliness] = useState(5);
  const [guardsIntact, setGuardsIntact] = useState(true);
  const [calibrated, setCalibrated] = useState(true);
  const [areaCleaned, setAreaCleaned] = useState(true);
  const [photoUrl, setPhotoUrl] = useState(resource.images[0] || '');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(booking.id, {
      inspector_id: booking.user_id,
      physical_condition: physicalCondition,
      cleanliness_rating: cleanliness,
      checklist_safety_guards_intact: guardsIntact,
      checklist_calibrated: calibrated,
      checklist_area_cleaned: areaCleaned,
      photo_urls: photoUrl ? [photoUrl] : [],
      notes: notes.trim() || 'Pre-session baseline recorded. Equipment operational.',
      discrepancy_detected: physicalCondition === 'flagged_issue' || physicalCondition === 'damaged',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
        
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
            <CheckSquare className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
              Step 7: Check-In Baseline Condition Report
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">{resource.title}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Establish a tamper-evident condition baseline before operating equipment. Protects you against pre-existing damage liability.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 1. Physical Condition Rating */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Current Physical State
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

          {/* 2. Mandatory Pre-Flight Safety Checklist */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Pre-Use Safety Checklist
            </h4>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={guardsIntact}
                onChange={e => setGuardsIntact(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700 focus:ring-amber-500"
              />
              <span>Emergency stop button & physical safety guards intact and functional</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={calibrated}
                onChange={e => setCalibrated(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700 focus:ring-amber-500"
              />
              <span>System power and calibration sequence completed without error codes</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={areaCleaned}
                onChange={e => setAreaCleaned(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700 focus:ring-amber-500"
              />
              <span>Work table, fluid lines, and surrounding workspace clean and unobstructed</span>
            </label>
          </div>

          {/* 3. Cleanliness Rating */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Initial Cleanliness Rating: {cleanliness}/5
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

          {/* 4. Photo Evidence URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              Condition Photo Baseline
            </label>
            <input
              type="text"
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
              placeholder="Photo URL or camera capture link..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* 5. Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Inspection Notes / Existing Blemishes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g., Small cosmetic scratch on left casing, machine spindle clean..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
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
              Confirm Check-In & Unlock
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

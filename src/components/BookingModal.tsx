'use client';

import React, { useState } from 'react';
import { Resource, Profile, Booking } from '@/types';
import { 
  X, 
  Calendar, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  ShieldAlert, 
  CheckCircle2, 
  DollarSign, 
  FileText 
} from 'lucide-react';

interface BookingModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: Profile;
  bookings: Booking[];
  onSubmitBooking: (data: {
    resourceId: string;
    startTime: string;
    endTime: string;
    purpose: string;
    supervisorName?: string;
  }) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  resource,
  isOpen,
  onClose,
  currentUser,
  bookings,
  onSubmitBooking,
}) => {
  if (!isOpen || !resource) return null;

  // Defaults: tomorrow 10:00 to 12:00
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [purpose, setPurpose] = useState('');
  const [supervisor, setSupervisor] = useState(
    resource.supervision_required ? 'Muskan Gupta' : ''
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute start and end datetime
  const fullStart = new Date(`${date}T${startTime}:00`);
  const fullEnd = new Date(`${date}T${endTime}:00`);
  const durationHours = (fullEnd.getTime() - fullStart.getTime()) / (1000 * 60 * 60);

  // Check if there is an overlapping approved booking
  const hasConflict = bookings.some(b => 
    b.resource_id === resource.id &&
    (b.status === 'approved' || b.status === 'checked_in') &&
    fullStart < new Date(b.end_time) &&
    fullEnd > new Date(b.start_time)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (durationHours <= 0) {
      setErrorMsg('End time must be after start time.');
      return;
    }

    if (durationHours > resource.max_consecutive_hours) {
      setErrorMsg(`Maximum session length for this resource is ${resource.max_consecutive_hours} hours.`);
      return;
    }

    if (!purpose.trim()) {
      setErrorMsg('Please describe your intended research or project purpose.');
      return;
    }

    setIsSubmitting(true);
    onSubmitBooking({
      resourceId: resource.id,
      startTime: fullStart.toISOString(),
      endTime: fullEnd.toISOString(),
      purpose: purpose.trim(),
      supervisorName: supervisor.trim() || undefined,
    });

    setIsSubmitting(false);
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
            <Calendar className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
              Schedule Reservation Request
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">{resource.title}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Location: {resource.location} • Max limit: {resource.max_consecutive_hours}h per session
            </p>
          </div>
        </div>

        {/* Conflict Warning or Status Banner */}
        {hasConflict ? (
          <div className="mb-5 p-3.5 bg-amber-950/70 border border-amber-600/40 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-amber-300">Scheduling Conflict Detected</p>
              <p className="text-amber-400/90 mt-0.5">
                Another approved reservation exists in this window. Submitting will automatically place your request on the <strong>Transparent Priority Waitlist</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-5 p-3 bg-emerald-950/60 border border-emerald-600/30 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>This window is currently open for immediate manager review.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Date & Time Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Requested Session Duration: <strong className="text-white">{durationHours > 0 ? durationHours : 0} hours</strong></span>
            <span>Max Allowed: <strong className="text-amber-400">{resource.max_consecutive_hours} hours</strong></span>
          </div>

          {/* Research / Project Purpose */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Intended Purpose & Project Description
            </label>
            <textarea
              rows={3}
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              placeholder="e.g., Fabricating titanium brackets for FSAE competition suspension assembly..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Supervisor Name if required */}
          {resource.supervision_required && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Designated Faculty / Staff Supervisor
              </label>
              <input
                type="text"
                value={supervisor}
                onChange={e => setSupervisor(e.target.value)}
                placeholder="Faculty Advisor or Lab Manager"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          )}

          {/* Fair-Use Impact & Deposit Breakdown */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Fair-Use Quota Allocation:
              </span>
              <span className="font-semibold text-amber-300">-{resource.fair_use_weight} pts hold</span>
            </div>

            {resource.deposit_required > 0 && (
              <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  Security Deposit Hold:
                </span>
                <span className="font-semibold text-amber-300">${resource.deposit_required} (refundable upon check-out)</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-700/50 rounded-lg text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

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
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              {hasConflict ? 'Join Waitlist Queue' : 'Submit for Manager Review'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

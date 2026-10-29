'use client';

import React, { useState } from 'react';
import { Resource, Profile, UserCredential, Booking } from '@/types';
import { evaluateFairUse } from '@/lib/fairUse';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Upload, 
  DollarSign, 
  UserCheck, 
  Clock,
  Sparkles
} from 'lucide-react';

interface EligibilityModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: Profile;
  credentials: UserCredential[];
  bookings: Booking[];
  onUploadCredential: (credentialName: string, issuedBy: string) => void;
  onRequestBooking: (resource: Resource) => void;
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({
  resource,
  isOpen,
  onClose,
  currentUser,
  credentials,
  bookings,
  onUploadCredential,
  onRequestBooking,
}) => {
  if (!isOpen || !resource) return null;

  const [customCredName, setCustomCredName] = useState('');
  const [customIssuedBy, setCustomIssuedBy] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const userBookings = bookings.filter(b => b.user_id === currentUser.id);
  const fairUse = evaluateFairUse(currentUser, resource, userBookings, bookings);

  const userCreds = credentials.filter(c => c.user_id === currentUser.id);
  const verifiedCredNames = userCreds
    .filter(c => c.status === 'verified')
    .map(c => c.credential_name);

  const pendingCredNames = userCreds
    .filter(c => c.status === 'pending')
    .map(c => c.credential_name);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCredName.trim()) return;
    onUploadCredential(customCredName, customIssuedBy || 'Campus Safety Directorate');
    setCustomCredName('');
    setCustomIssuedBy('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleQuickUploadMissing = (credName: string) => {
    onUploadCredential(credName, 'Campus Safety & EHS Office');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
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
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
              Eligibility & Safety Verification
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">{resource.title}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Institutional safety requirements, operator clearance, and anti-monopolization quota review.
            </p>
          </div>
        </div>

        {/* 1. Fair-Use & Allocation Ranking Card */}
        <div className="mb-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-white">Your Fair-Use Allocation Status</span>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
              fairUse.priorityRank === 'High Priority'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                : fairUse.priorityRank === 'Standard Priority'
                ? 'bg-blue-950 text-blue-300 border border-blue-700/50'
                : 'bg-amber-950 text-amber-300 border border-amber-700/50'
            }`}>
              {fairUse.priorityRank}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            {fairUse.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Specific Prerequisite Checklist */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Operational Prerequisites
          </h3>

          {/* Required Certifications */}
          {resource.required_credentials.length === 0 ? (
            <div className="p-3 bg-slate-800/40 rounded-lg text-xs text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              No specialized safety credentials required for standard booking.
            </div>
          ) : (
            resource.required_credentials.map((cred, idx) => {
              const isVerified = verifiedCredNames.includes(cred);
              const isPending = pendingCredNames.includes(cred);

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {isVerified ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : isPending ? (
                      <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">{cred}</p>
                      <p className="text-xs text-slate-400">
                        {isVerified
                          ? 'Active qualification verified in campus safety database'
                          : isPending
                          ? 'Certification submitted — awaiting Manager approval'
                          : 'Mandatory certificate required before operating equipment'}
                      </p>
                    </div>
                  </div>

                  {!isVerified && !isPending && (
                    <button
                      onClick={() => handleQuickUploadMissing(cred)}
                      className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-lg border border-amber-500/30 transition-colors shrink-0"
                    >
                      Submit Proof
                    </button>
                  )}
                </div>
              );
            })
          )}

          {/* Supervision & Deposit Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 flex items-center gap-2.5 text-xs text-slate-300">
              <UserCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                {resource.supervision_required
                  ? 'Staff supervision required during session'
                  : 'Self-guided use permitted once approved'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 flex items-center gap-2.5 text-xs text-slate-300">
              <DollarSign className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {resource.deposit_required > 0
                  ? `$${resource.deposit_required} refundable security hold`
                  : 'No security deposit required'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Upload / Request Custom Qualification */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            Submit Safety Credential or Training Certificate
          </h4>

          {uploadSuccess && (
            <div className="mb-3 p-2.5 bg-emerald-950/80 border border-emerald-600/50 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Credential submitted successfully! Muskan Gupta can now review and approve it.
            </div>
          )}

          <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Certification Title (e.g. CNC Operator)"
              value={customCredName}
              onChange={e => setCustomCredName(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 sm:col-span-2"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Upload Certificate
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onRequestBooking(resource);
            }}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all"
          >
            Continue to Reservation
          </button>
        </div>

      </div>
    </div>
  );
};

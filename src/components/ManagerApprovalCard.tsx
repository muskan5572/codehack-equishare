'use client';

import React, { useState } from 'react';
import { Booking, Resource, Profile, UserCredential } from '@/types';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  User, 
  MapPin, 
  Calendar, 
  Award,
  AlertTriangle,
  Send,
  Sparkles,
  FileBadge
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ManagerApprovalCardProps {
  bookings: Booking[];
  resources: Resource[];
  profiles: Profile[];
  credentials: UserCredential[];
  onReview: (bookingId: string, status: 'approved' | 'rejected' | 'waitlisted', reason: string) => void;
  onVerifyCredential: (credId: string, status: 'verified' | 'rejected') => void;
}

export const ManagerApprovalCard: React.FC<ManagerApprovalCardProps> = ({
  bookings,
  resources,
  profiles,
  credentials,
  onReview,
  onVerifyCredential,
}) => {
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});

  const pendingBookings = bookings.filter(b => b.status === 'pending_approval' || b.status === 'waitlisted');
  const pendingCredentials = credentials.filter(c => c.status === 'pending');

  const handleApprove = (bookingId: string) => {
    const note = decisionNotes[bookingId] || 'All safety qualifications confirmed. Quota cleared by FairShare allocation policy.';
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    onReview(bookingId, 'approved', note);
  };

  const handleReject = (bookingId: string) => {
    const note = decisionNotes[bookingId] || 'Prerequisites or scheduling conflict could not be reconciled.';
    onReview(bookingId, 'rejected', note);
  };

  const handleWaitlist = (bookingId: string) => {
    const note = decisionNotes[bookingId] || 'High-demand window. Queued on priority transparent waitlist.';
    onReview(bookingId, 'waitlisted', note);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Pending Credential Approvals (Safety Certificates) */}
      {pendingCredentials.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-600/40 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <FileBadge className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Operator Credentials Pending Verification ({pendingCredentials.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingCredentials.map(cred => {
              const user = profiles.find(p => p.id === cred.user_id);
              return (
                <div key={cred.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-amber-400 font-semibold">{cred.credential_name}</span>
                    <p className="text-sm font-bold text-white mt-0.5">{user?.full_name}</p>
                    <p className="text-xs text-slate-400">{user?.department} • Issued by: {cred.issued_by}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onVerifyCredential(cred.id, 'verified')}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verify
                    </button>
                    <button
                      onClick={() => onVerifyCredential(cred.id, 'rejected')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-red-950 text-red-400 font-semibold text-xs rounded-lg border border-slate-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Booking Requests Review Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
              Manager Access Review & Decision Desk
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Human-in-the-loop oversight: Review operator certifications, check fair-use anti-monopoly scores, and explain approval or rejection decisions.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {pendingBookings.length} Pending Actions
          </span>
        </div>

        {pendingBookings.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
            <h3 className="text-base font-bold text-white">Review Queue Clean</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              All reservation requests and credential checks have been processed. Switch roles to request a new resource.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingBookings.map(booking => {
              const resource = resources.find(r => r.id === booking.resource_id);
              const applicant = profiles.find(p => p.id === booking.user_id);
              const userCreds = credentials
                .filter(c => c.user_id === booking.user_id && c.status === 'verified')
                .map(c => c.credential_name);

              const missing = resource?.required_credentials.filter(req => !userCreds.includes(req)) || [];
              const hasAllCreds = missing.length === 0;

              return (
                <div
                  key={booking.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all shadow-xl"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left 2 Cols: Details & Applicant */}
                    <div className="lg:col-span-2 space-y-4">
                      
                      {/* Resource & Status Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            booking.status === 'waitlisted'
                              ? 'bg-amber-950 text-amber-300 border border-amber-700/50'
                              : 'bg-teal-950 text-teal-300 border border-teal-700/50'
                          }`}>
                            {booking.status === 'waitlisted' ? `Waitlist Queue #${booking.waitlist_position}` : 'Pending Review'}
                          </span>
                          <span className="text-xs text-slate-400">
                            Requested {new Date(booking.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-teal-400 bg-slate-800 px-2 py-0.5 rounded">
                          {resource?.category}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white">{resource?.title}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-teal-400" />
                          {resource?.location}
                        </p>
                      </div>

                      {/* Applicant Snapshot */}
                      <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/60 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={applicant?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={applicant?.full_name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-600"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{applicant?.full_name}</span>
                              <span className="text-[10px] bg-slate-900 text-slate-300 px-1.5 py-0.2 rounded uppercase font-semibold">
                                {applicant?.role}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">{applicant?.department}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end text-xs text-amber-400 font-bold">
                            <Award className="w-4 h-4" />
                            <span>{applicant?.fair_use_score}/100</span>
                          </div>
                          <span className="text-[10px] text-slate-400">FairShare Score</span>
                        </div>
                      </div>

                      {/* Scheduled Window & Purpose */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                          <span className="text-slate-400 flex items-center gap-1 mb-1">
                            <Calendar className="w-3.5 h-3.5 text-teal-400" />
                            Timeslot Requested:
                          </span>
                          <p className="text-white font-medium">
                            {new Date(booking.start_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            {' → '}
                            {new Date(booking.end_time).toLocaleTimeString([], { timeStyle: 'short' })}
                          </p>
                        </div>

                        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                          <span className="text-slate-400 flex items-center gap-1 mb-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                            Safety Clearance:
                          </span>
                          {hasAllCreds ? (
                            <p className="text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> All Certifications Verified
                            </p>
                          ) : (
                            <p className="text-red-400 font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Missing: {missing.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Purpose Summary */}
                      <div className="text-xs bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                        <span className="text-slate-400 font-semibold">Stated Purpose: </span>
                        <span className="text-slate-300 italic">"{booking.purpose_summary}"</span>
                      </div>

                    </div>

                    {/* Right Col: Human-in-the-Loop Decision Card */}
                    <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                          "Why This Decision" Rationale
                        </h4>
                        <p className="text-[11px] text-slate-400 mb-3">
                          Judges & applicants will see this explainable record in the immutable audit log:
                        </p>
                        <textarea
                          rows={3}
                          placeholder="e.g., Operator credentials verified. Cross-department quota permitted approval."
                          value={decisionNotes[booking.id] || ''}
                          onChange={e => setDecisionNotes({ ...decisionNotes, [booking.id]: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
                        />
                      </div>

                      <div className="space-y-2 pt-4">
                        <button
                          onClick={() => handleApprove(booking.id)}
                          className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve Reservation
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleWaitlist(booking.id)}
                            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium text-xs rounded-lg border border-amber-600/30 transition-colors flex items-center justify-center gap-1"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            Waitlist Queue
                          </button>
                          <button
                            onClick={() => handleReject(booking.id)}
                            className="py-2 px-3 bg-slate-800 hover:bg-red-950/70 text-red-400 font-medium text-xs rounded-lg border border-red-700/30 transition-colors flex items-center justify-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

'use client';

import React from 'react';
import { Profile } from '@/types';
import { 
  X, 
  Sparkles, 
  Scale, 
  Clock, 
  Share2, 
  ShieldCheck, 
  Award, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface FairUseExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Profile;
}

export const FairUseExplanationModal: React.FC<FairUseExplanationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  if (!isOpen) return null;

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
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-teal-400 tracking-wider uppercase">
              Explainable Allocation Architecture
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">FairShare™ Anti-Monopolization System</h2>
            <p className="text-xs text-slate-400 mt-1">
              Preventing resource hoarding while optimizing utilization through transparent rules and priority queues.
            </p>
          </div>
        </div>

        {/* Current User Snapshot */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar_url}
              alt={currentUser.full_name}
              className="w-11 h-11 rounded-full object-cover border border-slate-700"
            />
            <div>
              <p className="text-sm font-bold text-white">{currentUser.full_name}</p>
              <p className="text-xs text-slate-400">{currentUser.department}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end text-lg font-black text-amber-400">
              <Award className="w-5 h-5" />
              <span>{currentUser.fair_use_score} / 100</span>
            </div>
            <span className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider">
              {currentUser.fair_use_score >= 85 ? 'High Priority Tier' : 'Standard Tier'}
            </span>
          </div>
        </div>

        {/* 4 Pillars of Fair Allocation */}
        <div className="space-y-4 mb-6 text-xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Allocation Algorithm Rules
          </h3>

          {/* Rule 1: Cooldowns */}
          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">1. Anti-Monopoly Cooldowns</h4>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                After completing a reservation on high-demand equipment (e.g. 5-Axis CNC or SEM), a mandatory cooldown (12h–48h) activates before the user can re-reserve that same tool. Other researchers take priority during this window.
              </p>
            </div>
          </div>

          {/* Rule 2: Cross-Department Sharing */}
          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">2. Cross-Silo Collaboration Bonus (+10 Pts)</h4>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                To break institutional silos, users requesting resources outside their primary department receive a +10 FairShare bonus, promoting interdisciplinary research and maximizing equipment utility.
              </p>
            </div>
          </div>

          {/* Rule 3: Concurrent Booking Cap */}
          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">3. Active Reservations Cap (Max 2)</h4>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                A single researcher or team may hold at most 2 active concurrent reservations across the institution. Additional requests are transparently queued on the waitlist.
              </p>
            </div>
          </div>

          {/* Rule 4: Reputation Feedback Loop */}
          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">4. Tamper-Evident Condition Feedback</h4>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Users returning equipment on time in flawless condition earn +2 FairShare reputation points. Overdue returns or unaddressed damage deductions reduce priority ranking.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            Understood
          </button>
        </div>

      </div>
    </div>
  );
};

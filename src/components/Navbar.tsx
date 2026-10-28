'use client';

import React from 'react';
import { 
  Building2, 
  Layers, 
  CalendarClock, 
  CheckSquare2, 
  History, 
  AlertTriangle,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { Profile, Booking, Incident } from '@/types';

interface NavbarProps {
  activeTab: 'browse' | 'my-bookings' | 'manager' | 'incidents' | 'audit';
  setActiveTab: (tab: 'browse' | 'my-bookings' | 'manager' | 'incidents' | 'audit') => void;
  currentUser: Profile;
  bookings: Booking[];
  incidents: Incident[];
  onOpenExplainability: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  bookings,
  incidents,
  onOpenExplainability,
}) => {
  const pendingCount = bookings.filter(b => b.status === 'pending_approval').length;
  const activeIncidentCount = incidents.filter(i => i.status === 'investigating').length;
  const myBookingsCount = bookings.filter(b => 
    b.user_id === currentUser.id && 
    (b.status === 'approved' || b.status === 'checked_in' || b.status === 'pending_approval' || b.status === 'waitlisted')
  ).length;

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-10 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('browse')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Building2 className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">EquiShare</span>
                <span className="text-[10px] bg-teal-500/10 text-teal-400 font-semibold px-2 py-0.5 rounded border border-teal-500/20">
                  Institutional
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Trusted Campus & Lab Resource Governance</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'browse'
                  ? 'bg-slate-800 text-teal-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('my-bookings')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all relative ${
                activeTab === 'my-bookings'
                  ? 'bg-slate-800 text-teal-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <CalendarClock className="w-4 h-4" />
              <span>Reservations</span>
              {myBookingsCount > 0 && (
                <span className="ml-1 bg-teal-500/20 text-teal-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {myBookingsCount}
                </span>
              )}
            </button>

            {/* Manager Approvals Tab */}
            <button
              onClick={() => setActiveTab('manager')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all relative ${
                activeTab === 'manager'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <CheckSquare2 className="w-4 h-4" />
              <span>Review & Approvals</span>
              {pendingCount > 0 && (
                <span className="ml-1 bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Incident Reports Tab */}
            <button
              onClick={() => setActiveTab('incidents')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'incidents'
                  ? 'bg-slate-800 text-red-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden md:inline">Incidents</span>
              {activeIncidentCount > 0 && (
                <span className="ml-1 bg-red-500/20 text-red-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {activeIncidentCount}
                </span>
              )}
            </button>

            {/* Audit Log Tab */}
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'audit'
                  ? 'bg-slate-800 text-indigo-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Audit Trail</span>
            </button>
          </nav>

          {/* Explainability / Fairness Info Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenExplainability}
              className="flex items-center gap-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-teal-500/30 transition-colors"
              title="Explainable allocation rules and anti-monopoly fair-use math"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Fair-Use Policy</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

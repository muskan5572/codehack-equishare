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
  Sparkles
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
    <header className="bg-slate-950/70 border-b border-slate-800/80 sticky top-9 z-40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('browse')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  Equi<span className="text-amber-400">Share</span>
                </span>
                <span className="text-[10px] bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                  Institutional
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Trusted Campus & Lab Resource Sharing</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'browse'
                  ? 'bg-slate-800 text-amber-300 shadow-md border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('my-bookings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
                activeTab === 'my-bookings'
                  ? 'bg-slate-800 text-amber-300 shadow-md border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <CalendarClock className="w-4 h-4 text-amber-400" />
              <span>Reservations</span>
              {myBookingsCount > 0 && (
                <span className="ml-1 bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  {myBookingsCount}
                </span>
              )}
            </button>

            {/* Manager Approvals Tab */}
            <button
              onClick={() => setActiveTab('manager')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
                activeTab === 'manager'
                  ? 'bg-slate-800 text-amber-300 shadow-md border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <CheckSquare2 className="w-4 h-4 text-amber-400" />
              <span>Approvals</span>
              {pendingCount > 0 && (
                <span className="ml-1 bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black animate-bounce">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Incident Reports Tab */}
            <button
              onClick={() => setActiveTab('incidents')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'incidents'
                  ? 'bg-slate-800 text-red-300 shadow-md border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="hidden md:inline">Incidents</span>
              {activeIncidentCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {activeIncidentCount}
                </span>
              )}
            </button>

            {/* Audit Log Tab */}
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'audit'
                  ? 'bg-slate-800 text-indigo-300 shadow-md border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <History className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Audit Trail</span>
            </button>
          </nav>

          {/* Explainability / Fairness Info Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenExplainability}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-semibold border border-amber-500/30 transition-all shadow-sm"
              title="Explainable allocation rules and anti-monopoly fair-use math"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Fair-Use Policy</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

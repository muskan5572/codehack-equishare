'use client';

import React from 'react';
import { Profile } from '@/types';
import { ShieldCheck, UserCheck, GraduationCap, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface RoleSwitcherProps {
  currentUser: Profile;
  profiles: Profile[];
  onSwitch: (userId: string) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentUser, profiles, onSwitch }) => {
  return (
    <div className="bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Judge Demo Banner */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500/15 via-emerald-500/10 to-transparent px-3 py-1 rounded-full border border-teal-500/30 shadow-sm shadow-teal-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="font-bold text-teal-300 tracking-wide uppercase text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-400" />
              Judge Sandbox
            </span>
          </div>
          <span className="text-slate-400 hidden md:inline text-[11px]">
            Switch persona to evaluate institutional role permissions:
          </span>
        </div>

        {/* 1-Click Role Switcher Pill Bar */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
          {profiles.map(persona => {
            const isActive = persona.id === currentUser.id;
            
            return (
              <button
                key={persona.id}
                onClick={() => onSwitch(persona.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold shadow-lg shadow-teal-500/25 ring-1 ring-teal-300'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <img
                  src={persona.avatar_url}
                  alt={persona.full_name}
                  className={`w-5 h-5 rounded-full object-cover border ${
                    isActive ? 'border-slate-950' : 'border-slate-700'
                  }`}
                />

                <span>{persona.full_name}</span>

                <span className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-extrabold ${
                  isActive 
                    ? 'bg-slate-950/30 text-slate-950' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                }`}>
                  {persona.role}
                </span>

                {isActive && (
                  <CheckCircle2 className="w-3 h-3 text-slate-950 stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Persona Mini Card & FairShare Meter */}
        <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-slate-800 text-xs">
          <div className="text-right">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Affiliation</span>
            <span className="text-slate-200 font-medium truncate max-w-[150px] block">
              {currentUser.department}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-amber-500/5 px-3 py-1 rounded-lg border border-amber-500/25 shadow-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">FairShare</span>
                <span className="font-black text-amber-400">{currentUser.fair_use_score}/100</span>
              </div>
              <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                  style={{ width: `${currentUser.fair_use_score}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

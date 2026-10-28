'use client';

import React from 'react';
import { Profile } from '@/types';
import { ShieldCheck, UserCheck, GraduationCap, Award, Sparkles } from 'lucide-react';

interface RoleSwitcherProps {
  currentUser: Profile;
  profiles: Profile[];
  onSwitch: (userId: string) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentUser, profiles, onSwitch }) => {
  return (
    <div className="bg-slate-900/90 border-b border-teal-500/20 px-4 py-2.5 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
        
        {/* Judge Demo Banner */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="bg-teal-950/80 text-teal-300 text-xs px-2.5 py-0.5 rounded-full border border-teal-800 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-teal-400" />
            Judge Sandbox Mode
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">
            Switch persona to test full end-to-end access permissions:
          </span>
        </div>

        {/* 1-Click Role Switcher Buttons */}
        <div className="flex items-center gap-2">
          {profiles.map(persona => {
            const isActive = persona.id === currentUser.id;
            
            return (
              <button
                key={persona.id}
                onClick={() => onSwitch(persona.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25 ring-2 ring-teal-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {persona.role === 'manager' && <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />}
                {persona.role === 'researcher' && <UserCheck className="w-3.5 h-3.5 text-teal-300" />}
                {persona.role === 'student' && <GraduationCap className="w-3.5 h-3.5 text-blue-300" />}

                <span>{persona.full_name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded uppercase ${
                  isActive ? 'bg-slate-900/40 text-slate-950' : 'bg-slate-900 text-slate-400'
                }`}>
                  {persona.role}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Persona Mini Card */}
        <div className="hidden lg:flex items-center gap-3 pl-2 border-l border-slate-800 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <span>Dept:</span>
            <span className="text-slate-200 font-medium truncate max-w-[140px]">
              {currentUser.department}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">FairShare:</span>
            <span className="font-bold text-amber-400">{currentUser.fair_use_score}/100</span>
          </div>
        </div>

      </div>
    </div>
  );
};

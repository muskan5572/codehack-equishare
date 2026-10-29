'use client';

import React from 'react';
import { Resource, Profile, UserCredential } from '@/types';
import { 
  MapPin, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  CheckCircle2, 
  UserCheck, 
  Wrench,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  currentUser: Profile;
  userCredentials: UserCredential[];
  onCheckEligibility: (resource: Resource) => void;
  onRequestBooking: (resource: Resource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  currentUser,
  userCredentials,
  onCheckEligibility,
  onRequestBooking,
}) => {
  // Check if current user possesses all required credentials
  const verifiedUserCredNames = userCredentials
    .filter(c => c.user_id === currentUser.id && c.status === 'verified')
    .map(c => c.credential_name);

  const missingCredentials = resource.required_credentials.filter(
    req => !verifiedUserCredNames.includes(req)
  );

  const isEligible = missingCredentials.length === 0;

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl hover:border-teal-500/40 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col group backdrop-blur-md">
      
      {/* Image Banner & Overlays */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-950">
        <img
          src={resource.images[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'}
          alt={resource.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-slate-950/80 backdrop-blur-md text-teal-300 border border-teal-500/30 text-xs px-2.5 py-1 rounded-lg font-bold shadow-sm">
            {resource.category}
          </span>
          {resource.availability_status === 'available' && (
            <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available
            </span>
          )}
          {resource.availability_status === 'in_use' && (
            <span className="bg-amber-950/90 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              In Use
            </span>
          )}
        </div>

        {/* Location & Deposit Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span className="truncate max-w-[190px] font-medium">{resource.location}</span>
          </div>
          {resource.deposit_required > 0 && (
            <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/40 font-bold flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Deposit: ${resource.deposit_required}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="text-teal-400 font-semibold">{resource.department}</span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
            {resource.title}
          </h3>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>

          {/* Operational Rules Tags */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-700/70 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Max: {resource.max_consecutive_hours}h
            </span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-700/70 font-medium">
              <Wrench className="w-3.5 h-3.5 text-slate-400" />
              Cooldown: {resource.cooldown_hours}h
            </span>
            {resource.supervision_required && (
              <span className="bg-blue-950/60 text-blue-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-blue-700/40 font-semibold">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                Staff Supervision
              </span>
            )}
          </div>

          {/* Required Credentials Badges */}
          {resource.required_credentials.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-400" />
                Prerequisites & Operator Clearance:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {resource.required_credentials.map((cred, idx) => {
                  const hasIt = verifiedUserCredNames.includes(cred);
                  return (
                    <span
                      key={idx}
                      className={`text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-semibold ${
                        hasIt
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 shadow-sm'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-600/50 shadow-sm'
                      }`}
                    >
                      {hasIt ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                      )}
                      {cred}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Eligibility Indicator & Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs bg-slate-950/50 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-medium">Access Status:</span>
            {isEligible ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified & Ready
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Missing {missingCredentials.length} Certification
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onCheckEligibility(resource)}
              className="px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-all flex items-center justify-center gap-1"
            >
              Requirements
            </button>
            <button
              onClick={() => onRequestBooking(resource)}
              className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-1 group/btn"
            >
              <span>Request Access</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

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
  Wrench
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col group">
      
      {/* Image Banner & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <img
          src={resource.images[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'}
          alt={resource.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        {/* Category & Status */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-slate-900/80 backdrop-blur-md text-teal-300 border border-teal-500/30 text-xs px-2.5 py-1 rounded-md font-medium">
            {resource.category}
          </span>
          {resource.availability_status === 'available' && (
            <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-600/40 text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available
            </span>
          )}
          {resource.availability_status === 'in_use' && (
            <span className="bg-amber-950/90 text-amber-300 border border-amber-600/40 text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              In Use
            </span>
          )}
        </div>

        {/* Supervision & Deposit Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded border border-slate-700">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span className="truncate max-w-[180px]">{resource.location}</span>
          </div>
          {resource.deposit_required > 0 && (
            <div className="bg-amber-950/90 text-amber-300 px-2 py-1 rounded border border-amber-600/40 font-semibold flex items-center gap-0.5">
              <DollarSign className="w-3 h-3" />
              <span>Deposit: ${resource.deposit_required}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>{resource.department}</span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
            {resource.title}
          </h3>

          <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>

          {/* Operational Rules Tags */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-slate-700/60">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Max: {resource.max_consecutive_hours}h
            </span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-slate-700/60">
              <Wrench className="w-3.5 h-3.5 text-slate-400" />
              Cooldown: {resource.cooldown_hours}h
            </span>
            {resource.supervision_required && (
              <span className="bg-blue-950/60 text-blue-300 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-blue-800/40 font-medium">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                Staff Supervision
              </span>
            )}
          </div>

          {/* Required Credentials Badges */}
          {resource.required_credentials.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-400" />
                Required Qualifications:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {resource.required_credentials.map((cred, idx) => {
                  const hasIt = verifiedUserCredNames.includes(cred);
                  return (
                    <span
                      key={idx}
                      className={`text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium ${
                        hasIt
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/40'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-700/40'
                      }`}
                    >
                      {hasIt ? (
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-2.5 h-2.5 text-amber-400" />
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
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Your Eligibility:</span>
            {isEligible ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified & Ready
              </span>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Missing {missingCredentials.length} Certification
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onCheckEligibility(resource)}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-1"
            >
              Requirements
            </button>
            <button
              onClick={() => onRequestBooking(resource)}
              className="px-3 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-1"
            >
              Request Access
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

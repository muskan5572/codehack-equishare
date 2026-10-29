'use client';

import React, { useState } from 'react';
import { AuditLog } from '@/types';
import { 
  History, 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  CalendarClock, 
  UserCheck, 
  FileText,
  ChevronDown,
  ChevronRight,
  Fingerprint
} from 'lucide-react';

interface AuditTimelineProps {
  logs: AuditLog[];
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.actor_name && log.actor_name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterAction === 'all') return true;
    if (filterAction === 'approvals') return log.action.includes('APPROVED') || log.action.includes('REJECTED');
    if (filterAction === 'condition') return log.action.includes('CHECK_IN') || log.action.includes('RETURN');
    if (filterAction === 'incidents') return log.action.includes('INCIDENT');
    if (filterAction === 'waitlist') return log.action.includes('WAITLIST');

    return true;
  });

  const getActionBadge = (action: string) => {
    if (action.includes('APPROVED') || action.includes('CONFIRMED')) {
      return (
        <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          {action}
        </span>
      );
    }
    if (action.includes('INCIDENT') || action.includes('REJECTED')) {
      return (
        <span className="bg-red-950/80 text-red-300 border border-red-700/50 text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-red-400" />
          {action}
        </span>
      );
    }
    if (action.includes('WAITLIST')) {
      return (
        <span className="bg-amber-950/80 text-amber-300 border border-amber-700/50 text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
          <CalendarClock className="w-3 h-3 text-amber-400" />
          {action}
        </span>
      );
    }
    return (
      <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[11px] px-2 py-0.5 rounded-full font-medium">
        {action}
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-amber-400" />
            Immutable Audit Trail & Compliance Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cryptographically timestamped transaction log of every access request, condition baseline, manager decision, and incident resolution.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-600/50 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          Auditable Ledger Verified
        </span>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by actor, action, or keyword..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'approvals', label: 'Decisions' },
            { id: 'condition', label: 'Inspections' },
            { id: 'incidents', label: 'Incidents' },
            { id: 'waitlist', label: 'Waitlist' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterAction(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterAction === tab.id
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-3 pt-2">
        {filteredLogs.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            No audit records found matching your filters.
          </div>
        ) : (
          filteredLogs.map(log => {
            const isExpanded = expandedLogId === log.id;
            return (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all text-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getActionBadge(log.action)}
                      <span className="text-slate-400 font-semibold">{log.actor_name || 'System Engine'}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-slate-200 text-sm font-medium leading-relaxed">
                      {log.details}
                    </p>
                  </div>

                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <button
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-semibold border border-slate-700 transition-colors flex items-center gap-1 shrink-0"
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>Metadata</span>
                    </button>
                  )}

                </div>

                {/* Expanded JSON Inspector */}
                {isExpanded && log.metadata && (
                  <div className="mt-3 p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-300/90 overflow-x-auto">
                    <pre>{JSON.stringify(log.metadata, null, 2)}</pre>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

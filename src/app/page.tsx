'use client';

import React, { useState } from 'react';
import { useEquiShareStore } from '@/lib/store';
import { Resource, Booking } from '@/types';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { Navbar } from '@/components/Navbar';
import { ResourceCard } from '@/components/ResourceCard';
import { EligibilityModal } from '@/components/EligibilityModal';
import { BookingModal } from '@/components/BookingModal';
import { ManagerApprovalCard } from '@/components/ManagerApprovalCard';
import { CheckInModal } from '@/components/CheckInModal';
import { CheckOutModal } from '@/components/CheckOutModal';
import { IncidentModal } from '@/components/IncidentModal';
import { AuditTimeline } from '@/components/AuditTimeline';
import { FairUseExplanationModal } from '@/components/FairUseExplanationModal';
import { 
  Search, 
  Layers, 
  CalendarClock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles,
  Building2,
  Unlock,
  Clock,
  Check,
  ChevronRight,
  X,
  Compass,
  Cpu,
  Microscope,
  Video,
  Wrench
} from 'lucide-react';

export default function Home() {
  const store = useEquiShareStore();

  const [activeTab, setActiveTab] = useState<'browse' | 'my-bookings' | 'manager' | 'incidents' | 'audit'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  // Floating Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Modal States
  const [eligibilityResource, setEligibilityResource] = useState<Resource | null>(null);
  const [bookingResource, setBookingResource] = useState<Resource | null>(null);
  const [checkInBooking, setCheckInBooking] = useState<Booking | null>(null);
  const [checkOutBooking, setCheckOutBooking] = useState<Booking | null>(null);
  const [incidentBooking, setIncidentBooking] = useState<Booking | null>(null);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

  // Filter resources
  const filteredResources = store.resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesDept = selectedDept === 'all' || resource.department === selectedDept;

    return matchesSearch && matchesCategory && matchesDept;
  });

  const categoryItems = [
    { id: 'all', label: 'All Resources', icon: Compass },
    { id: 'Laboratory', label: 'Laboratory', icon: Microscope },
    { id: 'Fabrication', label: 'Fabrication', icon: Wrench },
    { id: 'Media & AV', label: 'Media & AV', icon: Video },
    { id: 'Testing & Metrology', label: 'Testing & Metrology', icon: Cpu },
  ];

  // Current user's bookings
  const myBookings = store.bookings.filter(b => b.user_id === store.currentUser.id);

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 1. Judge Demo Header (1-Click Switcher) */}
      <RoleSwitcher
        currentUser={store.currentUser}
        profiles={store.profiles}
        onSwitch={(userId) => {
          store.switchUser(userId);
          const target = store.profiles.find(p => p.id === userId);
          showToast(`Switched active persona to ${target?.full_name} (${target?.role.toUpperCase()})`);
        }}
      />

      {/* 2. Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={store.currentUser}
        bookings={store.bookings}
        incidents={store.incidents}
        onOpenExplainability={() => setIsExplainModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ======================================================== */}
        {/* TAB 1: BROWSE & DISCOVER RESOURCES                       */}
        {/* ======================================================== */}
        {activeTab === 'browse' && (
          <div className="space-y-8">
            
            {/* Hero / Banner with High-Tech Ambient Depth */}
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-amber-950/30 p-8 sm:p-10 border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-xl">
              
              {/* Background ambient radial light */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border border-amber-500/40 text-xs font-bold text-amber-300 shadow-sm shadow-amber-500/10">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Institutional Resource Sharing & Safety Protocol</span>
                </div>
                
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Unlock Underused <span className="gradient-text">Equipment & Spaces</span>
                </h1>
                
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                  Safely share high-value CNC milling centers, scanning electron microscopes, laser cutters, and cinema rigs with automated operator eligibility, digital condition baselines, and explainable fair allocation.
                </p>

                {/* 10-Step Interactive Lifecycle Indicator */}
                <div className="pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Complete 10-Step Sharing Lifecycle:
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    {[
                      '1. Listing',
                      '2. Eligibility Check',
                      '3. Request',
                      '4. Verification',
                      '5. Manager Review',
                      '6. Allocation',
                      '7. Check-In Baseline',
                      '8. Return Comparison',
                      '9. Incident Handling',
                      '10. Audit Ledger',
                    ].map((step, idx) => (
                      <span 
                        key={idx}
                        className="bg-slate-950/70 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-md font-medium flex items-center gap-1 shadow-sm"
                      >
                        <Check className="w-3 h-3 text-amber-400 stroke-[3]" />
                        {step}
                      </span>
                    ))}
                  </div>
                </div>

                {/* KPI Metrics Cards */}
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="glass-card p-3.5 rounded-2xl border border-slate-800/80">
                    <p className="text-slate-400 font-medium">Listed Resources</p>
                    <p className="text-2xl font-black text-white mt-1">{store.resources.length}</p>
                    <span className="text-[10px] text-amber-400 font-semibold">Across 4 Depts</span>
                  </div>
                  <div className="glass-card p-3.5 rounded-2xl border border-slate-800/80">
                    <p className="text-slate-400 font-medium">Available Now</p>
                    <p className="text-2xl font-black text-amber-400 mt-1">
                      {store.resources.filter(r => r.availability_status === 'available').length}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-semibold">Ready for booking</span>
                  </div>
                  <div className="glass-card p-3.5 rounded-2xl border border-slate-800/80">
                    <p className="text-slate-400 font-medium">Active Bookings</p>
                    <p className="text-2xl font-black text-amber-400 mt-1">
                      {store.bookings.filter(b => b.status === 'approved' || b.status === 'checked_in').length}
                    </p>
                    <span className="text-[10px] text-amber-400 font-semibold">In session or approved</span>
                  </div>
                  <div className="glass-card p-3.5 rounded-2xl border border-slate-800/80">
                    <p className="text-slate-400 font-medium">Audited Events</p>
                    <p className="text-2xl font-black text-indigo-400 mt-1">{store.auditLogs.length}</p>
                    <span className="text-[10px] text-indigo-400 font-semibold">Tamper-evident logs</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 shadow-lg backdrop-blur-md">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search equipment, laboratories, tools, or locations (e.g. CNC, SEM, Laser)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
                />
              </div>

              {/* Category Pills with Icons */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {categoryItems.map(item => {
                  const Icon = item.icon;
                  const isSelected = selectedCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedCategory(item.id)}
                      className={`px-3 py-2 rounded-xl transition-all font-semibold flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                          : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resource Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredResources.map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  currentUser={store.currentUser}
                  userCredentials={store.credentials}
                  onCheckEligibility={res => setEligibilityResource(res)}
                  onRequestBooking={res => setBookingResource(res)}
                />
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MY RESERVATIONS & CHECK-IN / RETURN WORKFLOWS     */}
        {/* ======================================================== */}
        {activeTab === 'my-bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CalendarClock className="w-6 h-6 text-amber-400" />
                  Your Active Reservations & Handover Desk
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage your bookings, perform digital pre-use condition check-in, and conduct side-by-side return inspections.
                </p>
              </div>
              <span className="text-xs text-slate-400">
                Logged in as: <strong className="text-amber-300">{store.currentUser.full_name}</strong>
              </span>
            </div>

            {myBookings.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
                <CalendarClock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Reservations Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  You haven't requested any resources. Switch over to the catalog to discover equipment.
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-105"
                >
                  Browse Available Equipment
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map(booking => {
                  const resource = store.resources.find(r => r.id === booking.resource_id);
                  const checkIn = store.conditionReports.find(
                    cr => cr.booking_id === booking.id && cr.stage === 'check_in'
                  );
                  const returnOut = store.conditionReports.find(
                    cr => cr.booking_id === booking.id && cr.stage === 'return_check_out'
                  );

                  return (
                    <div
                      key={booking.id}
                      className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 hover:border-amber-500/30 transition-all shadow-xl backdrop-blur-md"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        
                        {/* Info */}
                        <div className="space-y-2.5 max-w-xl">
                          <div className="flex flex-wrap items-center gap-2">
                            {booking.status === 'approved' && (
                              <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                Approved — Ready for Check-In
                              </span>
                            )}
                            {booking.status === 'checked_in' && (
                              <span className="bg-amber-950/80 text-amber-300 border border-amber-500/60 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 animate-pulse shadow-sm">
                                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                                Checked In (Session Active)
                              </span>
                            )}
                            {booking.status === 'pending_approval' && (
                              <span className="bg-amber-950/80 text-amber-300 border border-amber-600/50 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                Awaiting Manager Approval
                              </span>
                            )}
                            {booking.status === 'waitlisted' && (
                              <span className="bg-amber-950/80 text-amber-300 border border-amber-600/50 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                Waitlist Position #{booking.waitlist_position}
                              </span>
                            )}
                            {booking.status === 'returned' && (
                              <span className="bg-slate-800 text-slate-300 border border-slate-700 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5 shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                                Completed & Returned
                              </span>
                            )}
                            {booking.status === 'incident_flagged' && (
                              <span className="bg-red-950/80 text-red-300 border border-red-700/50 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                                Incident Flagged Under Review
                              </span>
                            )}
                            {booking.status === 'cancelled' && (
                              <span className="bg-slate-800 text-slate-400 text-xs px-3 py-1 rounded-full font-medium">
                                Cancelled
                              </span>
                            )}
                            <span className="text-xs text-slate-500 font-mono">
                              ID: {booking.id.slice(0, 12)}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-white">{resource?.title}</h3>
                          <p className="text-xs text-slate-400">
                            Location: {resource?.location} • Department: {resource?.department}
                          </p>

                          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                            <p className="text-slate-300 font-medium">
                              📅 Window: {new Date(booking.start_time).toLocaleString()} → {new Date(booking.end_time).toLocaleTimeString()}
                            </p>
                            <p className="text-slate-400 italic">
                              "{booking.purpose_summary}"
                            </p>
                            {booking.decision_reason && (
                              <p className="text-amber-400 pt-1 text-[11px] border-t border-slate-800">
                                <strong>Decision Reason:</strong> {booking.decision_reason}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Interactive Handover Actions */}
                        <div className="flex flex-col gap-2 shrink-0 min-w-[210px]">
                          
                          {/* Step 7: Check-In Button */}
                          {booking.status === 'approved' && (
                            <button
                              onClick={() => setCheckInBooking(booking)}
                              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Step 7: Check-In Baseline
                            </button>
                          )}

                          {/* Step 8: Return Inspection Button */}
                          {booking.status === 'checked_in' && (
                            <>
                              <button
                                onClick={() => setCheckOutBooking(booking)}
                                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 via-amber-400 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5"
                              >
                                <RotateCcw className="w-4 h-4" />
                                Step 8: Return Inspection
                              </button>
                              <button
                                onClick={() => setIncidentBooking(booking)}
                                className="w-full py-2.5 px-3 bg-red-950/80 hover:bg-red-900/80 text-red-300 border border-red-700/50 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Report Damage / Delay
                              </button>
                            </>
                          )}

                          {/* Cancel button (with auto waitlist promotion) */}
                          {(booking.status === 'pending_approval' || booking.status === 'waitlisted' || booking.status === 'approved') && (
                            <button
                              onClick={() => {
                                store.cancelBooking(booking.id);
                                showToast('Reservation cancelled. Waitlist candidates auto-promoted.');
                              }}
                              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
                            >
                              Cancel Reservation
                            </button>
                          )}

                          {/* Condition Record Badges if completed */}
                          {checkIn && (
                            <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-[11px] text-slate-300">
                              <span className="text-amber-400 font-semibold">Check-in Baseline:</span> {checkIn.physical_condition.toUpperCase()} ({checkIn.cleanliness_rating}/5★)
                            </div>
                          )}

                          {returnOut && (
                            <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-[11px] text-slate-300">
                              <span className="text-emerald-400 font-semibold">Return Sign-off:</span> {returnOut.physical_condition.toUpperCase()} ({returnOut.cleanliness_rating}/5★)
                            </div>
                          )}

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MANAGER REVIEW & DECISION DESK                    */}
        {/* ======================================================== */}
        {activeTab === 'manager' && (
          <ManagerApprovalCard
            bookings={store.bookings}
            resources={store.resources}
            profiles={store.profiles}
            credentials={store.credentials}
            onReview={(bId, status, reason) => {
              store.reviewBooking(bId, status, reason);
              showToast(`Reservation ${status.toUpperCase()}: ${reason}`);
            }}
            onVerifyCredential={(cId, status) => {
              store.verifyCredential(cId, status);
              showToast(`Credential marked as ${status.toUpperCase()}`);
            }}
          />
        )}

        {/* ======================================================== */}
        {/* TAB 4: INCIDENTS & DAMAGE REPORTS                        */}
        {/* ======================================================== */}
        {activeTab === 'incidents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  Incident & Equipment Health Governance
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Active damage reports, delayed return logs, and safety investigations under institutional management.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-950/80 text-red-300 border border-red-800">
                {store.incidents.length} Recorded Incidents
              </span>
            </div>

            {store.incidents.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
                <h3 className="text-base font-bold text-white">Zero Active Incidents</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  All shared campus equipment is operating within normal parameters without pending safety flags.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {store.incidents.map(inc => {
                  const res = store.resources.find(r => r.id === inc.resource_id);
                  const reporter = store.profiles.find(p => p.id === inc.reporter_id);

                  return (
                    <div key={inc.id} className="p-5 bg-slate-900 border border-red-900/30 rounded-3xl flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1.5 max-w-xl">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="bg-red-500/20 text-red-300 border border-red-500/40 px-2.5 py-0.5 rounded-full font-bold uppercase">
                            {inc.severity} Severity
                          </span>
                          <span className="text-slate-400 font-semibold capitalize">
                            Type: {inc.incident_type.replace('_', ' ')}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-500">{new Date(inc.created_at).toLocaleDateString()}</span>
                        </div>

                        <h4 className="text-base font-bold text-white">{res?.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{inc.description}</p>
                        
                        <p className="text-[11px] text-slate-400 pt-1">
                          Reported by: <strong className="text-slate-200">{reporter?.full_name}</strong> ({reporter?.department})
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-semibold border border-slate-700">
                          Status: {inc.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: AUDIT LOG TIMELINE                                */}
        {/* ======================================================== */}
        {activeTab === 'audit' && (
          <AuditTimeline logs={store.auditLogs} />
        )}

      </main>

      {/* ======================================================== */}
      {/* FLOATING TOAST NOTIFICATION                              */}
      {/* ======================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900 border border-amber-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs max-w-sm backdrop-blur-xl">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-medium text-slate-200 flex-1 leading-snug">{toastMessage}</span>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-slate-500 hover:text-white p-1 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODALS & OVERLAYS                                        */}
      {/* ======================================================== */}

      {/* 1. Eligibility Check Modal */}
      <EligibilityModal
        resource={eligibilityResource}
        isOpen={Boolean(eligibilityResource)}
        onClose={() => setEligibilityResource(null)}
        currentUser={store.currentUser}
        credentials={store.credentials}
        bookings={store.bookings}
        onUploadCredential={(name, by) => {
          store.uploadCredential(name, by);
          showToast(`Safety credential "${name}" submitted for Muskan Gupta's review.`);
        }}
        onRequestBooking={res => {
          setEligibilityResource(null);
          setBookingResource(res);
        }}
      />

      {/* 2. Booking Modal */}
      <BookingModal
        resource={bookingResource}
        isOpen={Boolean(bookingResource)}
        onClose={() => setBookingResource(null)}
        currentUser={store.currentUser}
        bookings={store.bookings}
        onSubmitBooking={data => {
          store.requestBooking(data);
          showToast('Reservation submitted! Check the "Reservations" tab or switch to Muskan Gupta to approve.');
        }}
      />

      {/* 3. Check-In Modal */}
      <CheckInModal
        booking={checkInBooking}
        resource={checkInBooking ? store.resources.find(r => r.id === checkInBooking.resource_id) || null : null}
        isOpen={Boolean(checkInBooking)}
        onClose={() => setCheckInBooking(null)}
        onSubmit={(bId, rep) => {
          store.submitCheckIn(bId, rep);
          showToast('Check-in baseline recorded! Resource unlocked.');
        }}
      />

      {/* 4. Check-Out Modal */}
      <CheckOutModal
        booking={checkOutBooking}
        resource={checkOutBooking ? store.resources.find(r => r.id === checkOutBooking.resource_id) || null : null}
        checkInReport={checkOutBooking ? store.conditionReports.find(cr => cr.booking_id === checkOutBooking.id && cr.stage === 'check_in') : undefined}
        isOpen={Boolean(checkOutBooking)}
        onClose={() => setCheckOutBooking(null)}
        onSubmit={(bId, rep) => {
          store.submitReturn(bId, rep);
          showToast('Return completed! Security deposit released and +2 FairShare points awarded.');
        }}
        onOpenIncident={b => setIncidentBooking(b)}
      />

      {/* 5. Incident Report Modal */}
      <IncidentModal
        booking={incidentBooking}
        resource={incidentBooking ? store.resources.find(r => r.id === incidentBooking.resource_id) || null : null}
        isOpen={Boolean(incidentBooking)}
        onClose={() => setIncidentBooking(null)}
        onSubmit={data => {
          store.fileIncident(data);
          showToast('Incident filed and flagged for institutional safety review.');
        }}
      />

      {/* 6. Fair-Use Explainability Modal */}
      <FairUseExplanationModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        currentUser={store.currentUser}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>EquiShare — Built for CodeHack Hackathon. Trusted Institutional Resource & Equipment Governance Platform.</p>
      </footer>

    </div>
  );
}

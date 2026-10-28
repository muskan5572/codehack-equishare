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
  Filter, 
  Layers, 
  CalendarClock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  Sparkles,
  Building2,
  Lock,
  Unlock,
  Clock,
  HelpCircle
} from 'lucide-react';

export default function Home() {
  const store = useEquiShareStore();

  const [activeTab, setActiveTab] = useState<'browse' | 'my-bookings' | 'manager' | 'incidents' | 'audit'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');

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

  const categories = ['all', 'Laboratory', 'Fabrication', 'Media & AV', 'Testing & Metrology'];
  const departments = ['all', 'Robotics & Fabrication Institute', 'Materials Science & Bioengineering', 'Design & Architecture Hub', 'Media & Performing Arts'];

  // Current user's bookings
  const myBookings = store.bookings.filter(b => b.user_id === store.currentUser.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Judge Demo Header (1-Click Switcher) */}
      <RoleSwitcher
        currentUser={store.currentUser}
        profiles={store.profiles}
        onSwitch={store.switchUser}
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
            
            {/* Hero / Banner */}
            <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/60 p-8 border border-slate-800 overflow-hidden shadow-2xl">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Institutional Resource Sharing & Safety Protocol
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Unlock High-Value Laboratories & Equipment
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Safely reserve specialized CNC milling centers, cleanrooms, electron microscopes, and cinema rigs with automated operator eligibility checks and condition audit trails.
                </p>

                {/* KPI Metrics */}
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <p className="text-slate-400">Listed Resources</p>
                    <p className="text-xl font-bold text-white mt-0.5">{store.resources.length}</p>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <p className="text-slate-400">Available Now</p>
                    <p className="text-xl font-bold text-teal-400 mt-0.5">
                      {store.resources.filter(r => r.availability_status === 'available').length}
                    </p>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <p className="text-slate-400">Active Bookings</p>
                    <p className="text-xl font-bold text-amber-400 mt-0.5">
                      {store.bookings.filter(b => b.status === 'approved' || b.status === 'checked_in').length}
                    </p>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <p className="text-slate-400">Audited Events</p>
                    <p className="text-xl font-bold text-indigo-400 mt-0.5">{store.auditLogs.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search equipment, labs, tools, or locations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-colors font-medium ${
                      selectedCategory === cat
                        ? 'bg-teal-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
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
                  <CalendarClock className="w-6 h-6 text-teal-400" />
                  Your Active Reservations & Handover Desk
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage your bookings, perform digital pre-use condition check-in, and conduct side-by-side return inspections.
                </p>
              </div>
              <span className="text-xs text-slate-400">
                Logged in as: <strong className="text-teal-300">{store.currentUser.full_name}</strong>
              </span>
            </div>

            {myBookings.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                <CalendarClock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Reservations Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  You haven't requested any resources. Switch over to the catalog to discover equipment.
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-4 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-teal-400 transition-colors"
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
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all shadow-xl"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        
                        {/* Info */}
                        <div className="space-y-2 max-w-xl">
                          <div className="flex flex-wrap items-center gap-2">
                            {booking.status === 'approved' && (
                              <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                Approved — Ready for Check-In
                              </span>
                            )}
                            {booking.status === 'checked_in' && (
                              <span className="bg-teal-950/80 text-teal-300 border border-teal-700/50 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                                <Unlock className="w-3.5 h-3.5 text-teal-400" />
                                Checked In (Session Active)
                              </span>
                            )}
                            {booking.status === 'pending_approval' && (
                              <span className="bg-amber-950/80 text-amber-300 border border-amber-700/50 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                Awaiting Manager Approval
                              </span>
                            )}
                            {booking.status === 'waitlisted' && (
                              <span className="bg-amber-950/80 text-amber-300 border border-amber-700/50 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                Waitlist Position #{booking.waitlist_position}
                              </span>
                            )}
                            {booking.status === 'returned' && (
                              <span className="bg-slate-800 text-slate-300 border border-slate-700 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                                Completed & Returned
                              </span>
                            )}
                            {booking.status === 'incident_flagged' && (
                              <span className="bg-red-950/80 text-red-300 border border-red-700/50 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                                Incident Flagged Under Review
                              </span>
                            )}
                            {booking.status === 'cancelled' && (
                              <span className="bg-slate-800 text-slate-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
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

                          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs space-y-1">
                            <p className="text-slate-300 font-medium">
                              📅 Window: {new Date(booking.start_time).toLocaleString()} → {new Date(booking.end_time).toLocaleTimeString()}
                            </p>
                            <p className="text-slate-400 italic">
                              "{booking.purpose_summary}"
                            </p>
                            {booking.decision_reason && (
                              <p className="text-teal-400 pt-1 text-[11px] border-t border-slate-800">
                                <strong>Decision Reason:</strong> {booking.decision_reason}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Interactive Handover Actions */}
                        <div className="flex flex-col gap-2 shrink-0 min-w-[200px]">
                          
                          {/* Step 7: Check-In Button */}
                          {booking.status === 'approved' && (
                            <button
                              onClick={() => setCheckInBooking(booking)}
                              className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-1.5"
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
                                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5"
                              >
                                <RotateCcw className="w-4 h-4" />
                                Step 8: Return Inspection
                              </button>
                              <button
                                onClick={() => setIncidentBooking(booking)}
                                className="w-full py-2 px-3 bg-red-950/80 hover:bg-red-900/80 text-red-300 border border-red-700/50 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Report Damage / Delay
                              </button>
                            </>
                          )}

                          {/* Cancel button (with auto waitlist promotion) */}
                          {(booking.status === 'pending_approval' || booking.status === 'waitlisted' || booking.status === 'approved') && (
                            <button
                              onClick={() => store.cancelBooking(booking.id)}
                              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
                            >
                              Cancel Reservation
                            </button>
                          )}

                          {/* Condition Record Badges if completed */}
                          {checkIn && (
                            <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-lg text-[11px] text-slate-300">
                              <span className="text-teal-400 font-semibold">Check-in Baseline:</span> {checkIn.physical_condition.toUpperCase()} ({checkIn.cleanliness_rating}/5★)
                            </div>
                          )}

                          {returnOut && (
                            <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-lg text-[11px] text-slate-300">
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
            onReview={store.reviewBooking}
            onVerifyCredential={store.verifyCredential}
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
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
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
                    <div key={inc.id} className="p-5 bg-slate-900 border border-red-900/30 rounded-2xl flex flex-wrap items-start justify-between gap-4">
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
        onUploadCredential={store.uploadCredential}
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
        onSubmitBooking={store.requestBooking}
      />

      {/* 3. Check-In Modal */}
      <CheckInModal
        booking={checkInBooking}
        resource={checkInBooking ? store.resources.find(r => r.id === checkInBooking.resource_id) || null : null}
        isOpen={Boolean(checkInBooking)}
        onClose={() => setCheckInBooking(null)}
        onSubmit={store.submitCheckIn}
      />

      {/* 4. Check-Out Modal */}
      <CheckOutModal
        booking={checkOutBooking}
        resource={checkOutBooking ? store.resources.find(r => r.id === checkOutBooking.resource_id) || null : null}
        checkInReport={checkOutBooking ? store.conditionReports.find(cr => cr.booking_id === checkOutBooking.id && cr.stage === 'check_in') : undefined}
        isOpen={Boolean(checkOutBooking)}
        onClose={() => setCheckOutBooking(null)}
        onSubmit={store.submitReturn}
        onOpenIncident={b => setIncidentBooking(b)}
      />

      {/* 5. Incident Report Modal */}
      <IncidentModal
        booking={incidentBooking}
        resource={incidentBooking ? store.resources.find(r => r.id === incidentBooking.resource_id) || null : null}
        isOpen={Boolean(incidentBooking)}
        onClose={() => setIncidentBooking(null)}
        onSubmit={store.fileIncident}
      />

      {/* 6. Fair-Use Explainability Modal */}
      <FairUseExplanationModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        currentUser={store.currentUser}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>EquiShare — Built for CodeHack Hackathon. Trusted Institutional Resource & Equipment Governance Platform.</p>
      </footer>

    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  Profile, 
  Resource, 
  Booking, 
  ConditionReport, 
  Incident, 
  AuditLog, 
  UserCredential,
  BookingStatus 
} from '@/types';
import { 
  INITIAL_PROFILES, 
  INITIAL_RESOURCES, 
  INITIAL_BOOKINGS, 
  INITIAL_CREDENTIALS, 
  INITIAL_CONDITION_REPORTS, 
  INITIAL_INCIDENTS, 
  INITIAL_AUDIT_LOGS 
} from './initialData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'equishare_state_v2';

export function useEquiShareStore() {
  const [currentUser, setCurrentUser] = useState<Profile>(INITIAL_PROFILES[1]); // Default to Ishan Roshan
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [credentials, setCredentials] = useState<UserCredential[]>(INITIAL_CREDENTIALS);
  const [conditionReports, setConditionReports] = useState<ConditionReport[]>(INITIAL_CONDITION_REPORTS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage or Supabase on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profiles) setProfiles(parsed.profiles);
        if (parsed.resources) setResources(parsed.resources);
        if (parsed.bookings) setBookings(parsed.bookings);
        if (parsed.credentials) setCredentials(parsed.credentials);
        if (parsed.conditionReports) setConditionReports(parsed.conditionReports);
        if (parsed.incidents) setIncidents(parsed.incidents);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.currentUserId) {
          const user = parsed.profiles?.find((p: Profile) => p.id === parsed.currentUserId);
          if (user) setCurrentUser(user);
        }
      }
    } catch (e) {
      console.warn('Local storage load error, using initial defaults:', e);
    }
    setIsLoaded(true);
  }, []);

  // Persist local state whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentUserId: currentUser.id,
        profiles,
        resources,
        bookings,
        credentials,
        conditionReports,
        incidents,
        auditLogs,
      }));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [currentUser, profiles, resources, bookings, credentials, conditionReports, incidents, auditLogs, isLoaded]);

  // Try fetching live data from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    async function syncFromSupabase() {
      try {
        const { data: dbResources } = await supabase!.from('resources').select('*');
        if (dbResources && dbResources.length > 0) {
          setResources(dbResources);
        }
        const { data: dbBookings } = await supabase!.from('bookings').select('*');
        if (dbBookings && dbBookings.length > 0) {
          setBookings(dbBookings);
        }
        const { data: dbProfiles } = await supabase!.from('profiles').select('*');
        if (dbProfiles && dbProfiles.length > 0) {
          setProfiles(dbProfiles);
        }
      } catch (err) {
        console.warn('Supabase sync notice:', err);
      }
    }
    syncFromSupabase();
  }, []);

  // 1. Switch User Persona (Judge Switcher)
  const switchUser = (userId: string) => {
    const target = profiles.find(p => p.id === userId);
    if (target) {
      setCurrentUser(target);
      addAuditLog({
        actor_id: target.id,
        actor_name: target.full_name,
        action: 'PERSONA_SWITCHED',
        details: `Active role switched to ${target.full_name} (${target.role.toUpperCase()} - ${target.department}).`,
      });
    }
  };

  // 2. Add an Audit Log Entry
  const addAuditLog = (entry: Omit<AuditLog, 'id' | 'created_at'>) => {
    const newEntry: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
      ...entry,
    };
    setAuditLogs(prev => [newEntry, ...prev]);

    // Optional sync to Supabase
    if (isSupabaseConfigured && supabase) {
      Promise.resolve(
        supabase.from('audit_logs').insert([{
          resource_id: entry.resource_id,
          booking_id: entry.booking_id,
          actor_id: entry.actor_id,
          action: entry.action,
          details: entry.details,
          metadata: entry.metadata || {},
        }])
      ).catch(() => {});
    }
  };

  // 3. Request a Booking
  const requestBooking = (data: {
    resourceId: string;
    startTime: string;
    endTime: string;
    purpose: string;
    supervisorName?: string;
  }) => {
    const resource = resources.find(r => r.id === data.resourceId);
    if (!resource) return;

    // Check if there is an overlapping approved booking
    const hasOverlap = bookings.some(b => 
      b.resource_id === data.resourceId &&
      (b.status === 'approved' || b.status === 'checked_in') &&
      new Date(data.startTime) < new Date(b.end_time) &&
      new Date(data.endTime) > new Date(b.start_time)
    );

    const initialStatus: BookingStatus = hasOverlap ? 'waitlisted' : 'pending_approval';
    const waitlistPosition = hasOverlap 
      ? bookings.filter(b => b.resource_id === data.resourceId && b.status === 'waitlisted').length + 1 
      : 0;

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      resource_id: data.resourceId,
      user_id: currentUser.id,
      start_time: data.startTime,
      end_time: data.endTime,
      purpose_summary: data.purpose,
      supervisor_name: data.supervisorName,
      status: initialStatus,
      waitlist_position: waitlistPosition,
      decision_reason: hasOverlap 
        ? `Timeslot conflict detected with approved session. Placed in waitlist position #${waitlistPosition}.`
        : 'Submitted for manager eligibility and safety review.',
      fair_use_deduction: resource.fair_use_weight,
      created_at: new Date().toISOString(),
      resource,
      user: currentUser,
    };

    setBookings(prev => [newBooking, ...prev]);

    // Update active bookings count
    setProfiles(prev => prev.map(p => 
      p.id === currentUser.id 
        ? { ...p, active_bookings_count: p.active_bookings_count + 1 }
        : p
    ));

    addAuditLog({
      resource_id: data.resourceId,
      booking_id: newBooking.id,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      action: initialStatus === 'waitlisted' ? 'BOOKING_WAITLISTED' : 'BOOKING_REQUESTED',
      details: `${currentUser.full_name} submitted booking for "${resource.title}". Status: ${initialStatus.toUpperCase()}.`,
      metadata: { 
        purpose: data.purpose, 
        hasOverlap, 
        waitlistPosition,
        fair_use_score: currentUser.fair_use_score 
      },
    });

    return newBooking;
  };

  // 4. Manager Review (Approve, Reject, or Waitlist)
  const reviewBooking = (bookingId: string, status: 'approved' | 'rejected' | 'waitlisted', reason: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      return {
        ...b,
        status,
        decision_reason: reason,
        updated_at: new Date().toISOString(),
      };
    }));

    const targetBooking = bookings.find(b => b.id === bookingId);
    const targetResource = resources.find(r => r.id === targetBooking?.resource_id);

    addAuditLog({
      resource_id: targetBooking?.resource_id,
      booking_id: bookingId,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      action: `BOOKING_${status.toUpperCase()}`,
      details: `Manager ${currentUser.full_name} marked booking as ${status.toUpperCase()} for "${targetResource?.title}". Reason: ${reason}`,
      metadata: { status, reason },
    });
  };

  // 5. Cancel Booking (with Automatic Waitlist Promotion)
  const cancelBooking = (bookingId: string, cancelReason = 'Cancelled by user') => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (!targetBooking) return;

    setBookings(prev => prev.map(b => 
      b.id === bookingId 
        ? { ...b, status: 'cancelled', decision_reason: cancelReason, updated_at: new Date().toISOString() }
        : b
    ));

    addAuditLog({
      resource_id: targetBooking.resource_id,
      booking_id: bookingId,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      action: 'BOOKING_CANCELLED',
      details: `Reservation cancelled. ${cancelReason}`,
    });

    // Auto-promote first waitlisted candidate for this resource!
    const waitlisted = bookings
      .filter(b => b.resource_id === targetBooking.resource_id && b.status === 'waitlisted')
      .sort((a, b) => a.waitlist_position - b.waitlist_position)[0];

    if (waitlisted) {
      setBookings(prev => prev.map(b => 
        b.id === waitlisted.id
          ? {
              ...b,
              status: 'pending_approval',
              waitlist_position: 0,
              decision_reason: 'Auto-promoted from waitlist queue following cancellation of conflicting slot.',
              updated_at: new Date().toISOString(),
            }
          : b
      ));

      addAuditLog({
        resource_id: targetBooking.resource_id,
        booking_id: waitlisted.id,
        action: 'WAITLIST_AUTO_PROMOTED',
        details: `Waitlist slot #${waitlisted.waitlist_position} automatically advanced to Pending Manager Review due to cancellation.`,
        metadata: { promoted_booking_id: waitlisted.id },
      });
    }
  };

  // 6. Check-In Baseline Condition Inspection
  const submitCheckIn = (bookingId: string, report: Omit<ConditionReport, 'id' | 'stage' | 'booking_id' | 'created_at'>) => {
    const newReport: ConditionReport = {
      id: `cr-in-${Date.now()}`,
      booking_id: bookingId,
      stage: 'check_in',
      created_at: new Date().toISOString(),
      ...report,
    };

    setConditionReports(prev => [newReport, ...prev]);

    setBookings(prev => prev.map(b => 
      b.id === bookingId 
        ? { ...b, status: 'checked_in', updated_at: new Date().toISOString() }
        : b
    ));

    const targetBooking = bookings.find(b => b.id === bookingId);

    addAuditLog({
      resource_id: targetBooking?.resource_id,
      booking_id: bookingId,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      action: 'CHECK_IN_INSPECTED',
      details: `Check-in condition baseline documented: Condition = ${report.physical_condition.toUpperCase()}, Cleanliness = ${report.cleanliness_rating}/5.`,
      metadata: { 
        physical_condition: report.physical_condition,
        guards_intact: report.checklist_safety_guards_intact,
        calibrated: report.checklist_calibrated,
        notes: report.notes,
      },
    });
  };

  // 7. Return Check-Out Inspection & Sign-off
  const submitReturn = (bookingId: string, report: Omit<ConditionReport, 'id' | 'stage' | 'booking_id' | 'created_at'>) => {
    const newReport: ConditionReport = {
      id: `cr-out-${Date.now()}`,
      booking_id: bookingId,
      stage: 'return_check_out',
      created_at: new Date().toISOString(),
      ...report,
    };

    setConditionReports(prev => [newReport, ...prev]);

    setBookings(prev => prev.map(b => 
      b.id === bookingId 
        ? { ...b, status: 'returned', updated_at: new Date().toISOString() }
        : b
    ));

    const targetBooking = bookings.find(b => b.id === bookingId);

    // If returned in good condition, boost FairShare score (+2)
    if (report.physical_condition === 'flawless' || report.physical_condition === 'minor_wear') {
      setProfiles(prev => prev.map(p => 
        p.id === (targetBooking?.user_id || currentUser.id)
          ? { ...p, fair_use_score: Math.min(100, p.fair_use_score + 2) }
          : p
      ));
    }

    addAuditLog({
      resource_id: targetBooking?.resource_id,
      booking_id: bookingId,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      action: 'RETURN_CONFIRMED',
      details: `Return inspection completed: ${report.physical_condition.toUpperCase()}. Security deposit hold eligible for release.`,
      metadata: { 
        physical_condition: report.physical_condition, 
        discrepancy: report.discrepancy_detected,
        score_reward: '+2 points'
      },
    });
  };

  // 8. File an Incident or Damage Report
  const fileIncident = (data: {
    bookingId: string;
    resourceId: string;
    incidentType: Incident['incident_type'];
    severity: Incident['severity'];
    description: string;
    evidenceUrl?: string;
  }) => {
    const newIncident: Incident = {
      id: `inc-${Date.now()}`,
      reporter_id: currentUser.id,
      status: 'investigating',
      created_at: new Date().toISOString(),
      booking_id: data.bookingId,
      resource_id: data.resourceId,
      incident_type: data.incidentType,
      severity: data.severity,
      description: data.description,
      evidence_photo_url: data.evidenceUrl,
    };

    setIncidents(prev => [newIncident, ...prev]);

    setBookings(prev => prev.map(b => 
      b.id === data.bookingId 
        ? { ...b, status: 'incident_flagged', updated_at: new Date().toISOString() }
        : b
    ));

    // Deduct fair use score for incident
    const penalty = data.severity === 'critical' ? 25 : data.severity === 'high' ? 15 : 10;
    const targetBooking = bookings.find(b => b.id === data.bookingId);
    if (targetBooking) {
      setProfiles(prev => prev.map(p => 
        p.id === targetBooking.user_id 
          ? { ...p, fair_use_score: Math.max(20, p.fair_use_score - penalty) }
          : p
      ));
    }

    addAuditLog({
      resource_id: data.resourceId,
      booking_id: data.bookingId,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      action: 'INCIDENT_FLAGGED',
      details: `[${data.severity.toUpperCase()}] Incident logged: ${data.incidentType.toUpperCase()}. ${data.description}`,
      metadata: { severity: data.severity, penalty: `-${penalty} points` },
    });
  };

  // 9. Add or verify a safety credential
  const uploadCredential = (credentialName: string, issuedBy: string) => {
    const newCred: UserCredential = {
      id: `c-${Date.now()}`,
      user_id: currentUser.id,
      credential_name: credentialName,
      issued_by: issuedBy,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setCredentials(prev => [...prev, newCred]);

    addAuditLog({
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      action: 'CREDENTIAL_SUBMITTED',
      details: `${currentUser.full_name} submitted certification for "${credentialName}" (${issuedBy}). Awaiting manager approval.`,
    });
  };

  const verifyCredential = (credentialId: string, status: 'verified' | 'rejected') => {
    setCredentials(prev => prev.map(c => 
      c.id === credentialId 
        ? { ...c, status, verified_at: new Date().toISOString() } 
        : c
    ));

    const targetCred = credentials.find(c => c.id === credentialId);
    addAuditLog({
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      action: `CREDENTIAL_${status.toUpperCase()}`,
      details: `Manager ${currentUser.full_name} marked credential "${targetCred?.credential_name}" as ${status.toUpperCase()}.`,
    });
  };

  return {
    currentUser,
    profiles,
    resources,
    bookings,
    credentials,
    conditionReports,
    incidents,
    auditLogs,
    isLoaded,
    switchUser,
    requestBooking,
    reviewBooking,
    cancelBooking,
    submitCheckIn,
    submitReturn,
    fileIncident,
    uploadCredential,
    verifyCredential,
    addAuditLog,
  };
}

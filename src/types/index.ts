export type UserRole = 'student' | 'researcher' | 'manager' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department: string;
  avatar_url: string;
  fair_use_score: number; // 0 - 100
  active_bookings_count: number;
  verified: boolean;
  created_at?: string;
}

export interface UserCredential {
  id: string;
  user_id: string;
  credential_name: string;
  issued_by: string;
  status: 'verified' | 'pending' | 'rejected';
  certificate_url?: string;
  verified_at?: string;
  created_at?: string;
}

export type ResourceCategory = 
  | 'Laboratory' 
  | 'Fabrication' 
  | 'Computing & AI' 
  | 'Media & AV' 
  | 'Testing & Metrology';

export type AvailabilityStatus = 'available' | 'in_use' | 'maintenance' | 'reserved';

export interface Resource {
  id: string;
  title: string;
  category: ResourceCategory;
  description: string;
  location: string;
  owner_id: string;
  department: string;
  images: string[];
  availability_status: AvailabilityStatus;
  deposit_required: number;
  supervision_required: boolean;
  required_credentials: string[];
  max_consecutive_hours: number;
  cooldown_hours: number;
  fair_use_weight: number;
  created_at?: string;
}

export type BookingStatus = 
  | 'pending_approval' 
  | 'approved' 
  | 'rejected' 
  | 'waitlisted' 
  | 'checked_in' 
  | 'returned' 
  | 'cancelled' 
  | 'incident_flagged';

export interface Booking {
  id: string;
  resource_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  purpose_summary: string;
  supervisor_name?: string;
  status: BookingStatus;
  waitlist_position: number;
  decision_reason?: string;
  fair_use_deduction: number;
  created_at: string;
  updated_at?: string;
  resource?: Resource;
  user?: Profile;
}

export type PhysicalCondition = 'flawless' | 'minor_wear' | 'flagged_issue' | 'damaged';

export interface ConditionReport {
  id: string;
  booking_id: string;
  stage: 'check_in' | 'return_check_out';
  inspector_id: string;
  physical_condition: PhysicalCondition;
  cleanliness_rating: number; // 1 to 5
  checklist_safety_guards_intact: boolean;
  checklist_calibrated: boolean;
  checklist_area_cleaned: boolean;
  photo_urls: string[];
  notes: string;
  discrepancy_detected: boolean;
  created_at: string;
}

export type IncidentType = 'damage' | 'overdue_return' | 'unauthorized_access' | 'safety_breach';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'investigating' | 'resolved' | 'penalty_applied' | 'dismissed';

export interface Incident {
  id: string;
  booking_id: string;
  resource_id: string;
  reporter_id: string;
  incident_type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  evidence_photo_url?: string;
  status: IncidentStatus;
  resolution_notes?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  resource_id?: string;
  booking_id?: string;
  actor_id?: string;
  action: string;
  details: string;
  metadata?: Record<string, any>;
  created_at: string;
  actor_name?: string;
}

-- ====================================================================
-- EQUISHARE: INSTITUTIONAL RESOURCE GOVERNANCE DATABASE MIGRATION
-- Migration: 20261028000000_equishare_schema.sql
-- ====================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'researcher', 'manager', 'admin')),
  department TEXT NOT NULL,
  avatar_url TEXT,
  fair_use_score INTEGER DEFAULT 100 CHECK (fair_use_score BETWEEN 0 AND 100),
  active_bookings_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER CREDENTIALS & CERTIFICATIONS
CREATE TABLE IF NOT EXISTS public.credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  credential_name TEXT NOT NULL,
  issued_by TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'verified' CHECK (status IN ('verified', 'pending', 'rejected')),
  certificate_url TEXT,
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SHARED RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Laboratory', 'Fabrication', 'Computing & AI', 'Media & AV', 'Testing & Metrology')),
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  department TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'in_use', 'maintenance', 'reserved')),
  deposit_required NUMERIC(10, 2) DEFAULT 0.00,
  supervision_required BOOLEAN DEFAULT false,
  required_credentials TEXT[] DEFAULT ARRAY[]::TEXT[],
  max_consecutive_hours INTEGER DEFAULT 4,
  cooldown_hours INTEGER DEFAULT 24,
  fair_use_weight INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKINGS & ALLOCATION TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  purpose_summary TEXT NOT NULL,
  supervisor_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending_approval' CHECK (status IN (
    'pending_approval', 'approved', 'rejected', 'waitlisted', 'checked_in', 'returned', 'cancelled', 'incident_flagged'
  )),
  waitlist_position INTEGER DEFAULT 0,
  decision_reason TEXT,
  fair_use_deduction INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONDITION INSPECTION REPORTS (Before & After)
CREATE TABLE IF NOT EXISTS public.condition_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  stage TEXT NOT NULL CHECK (stage IN ('check_in', 'return_check_out')),
  inspector_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  physical_condition TEXT NOT NULL CHECK (physical_condition IN ('flawless', 'minor_wear', 'flagged_issue', 'damaged')),
  cleanliness_rating INTEGER DEFAULT 5 CHECK (cleanliness_rating BETWEEN 1 AND 5),
  checklist_safety_guards_intact BOOLEAN DEFAULT true,
  checklist_calibrated BOOLEAN DEFAULT true,
  checklist_area_cleaned BOOLEAN DEFAULT true,
  photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  discrepancy_detected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INCIDENTS & DAMAGE REPORTS
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  incident_type TEXT NOT NULL CHECK (incident_type IN ('damage', 'overdue_return', 'unauthorized_access', 'safety_breach')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  evidence_photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'investigating' CHECK (status IN ('investigating', 'resolved', 'penalty_applied', 'dismissed')),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AUDIT LOG (Tamper-evident activity trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

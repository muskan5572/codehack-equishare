import { Profile, Resource, Booking } from '@/types';

export interface FairUseEvaluation {
  score: number; // 0 - 100
  canBook: boolean;
  priorityRank: 'High Priority' | 'Standard Priority' | 'Cool-off Queued' | 'Quota Exceeded';
  cooldownActive: boolean;
  hoursUntilEligible: number;
  reasons: string[];
  departmentCrossShareBonus: boolean;
  estimatedWaitlistPosition?: number;
}

/**
 * Calculates a user's explainable Fair-Use score and anti-monopoly eligibility.
 * Prevents lab equipment monopolization by taking into account:
 * 1. Base user reputation / reliability score
 * 2. Recent usage frequency (24h-48h cooldown rules)
 * 3. Cross-department sharing incentive (priority given if sharing across silos)
 * 4. Active concurrent bookings limit
 */
export function evaluateFairUse(
  user: Profile,
  resource: Resource,
  userBookings: Booking[],
  allResourceBookings: Booking[]
): FairUseEvaluation {
  const reasons: string[] = [];
  let score = user.fair_use_score;

  // 1. Check active concurrent bookings
  const activeBookings = userBookings.filter(b => 
    b.status === 'approved' || b.status === 'checked_in'
  );
  
  if (activeBookings.length >= 2) {
    score -= 25;
    reasons.push(`User already holds ${activeBookings.length} concurrent active reservations (cap: 2).`);
  } else {
    reasons.push(`Active reservation count is healthy (${activeBookings.length}/2).`);
  }

  // 2. Cooldown check on this specific resource
  const recentBookingOnResource = userBookings
    .filter(b => b.resource_id === resource.id && b.status !== 'rejected' && b.status !== 'cancelled')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  let cooldownActive = false;
  let hoursUntilEligible = 0;

  if (recentBookingOnResource) {
    const lastBookingTime = new Date(recentBookingOnResource.end_time).getTime();
    const now = Date.now();
    const hoursSinceLast = (now - lastBookingTime) / (1000 * 60 * 60);

    if (hoursSinceLast < resource.cooldown_hours && hoursSinceLast >= 0) {
      cooldownActive = true;
      hoursUntilEligible = Math.ceil(resource.cooldown_hours - hoursSinceLast);
      score -= 20;
      reasons.push(
        `Anti-monopoly policy: ${resource.cooldown_hours}h cooldown active. ${hoursUntilEligible}h remaining before priority booking.`
      );
    } else {
      reasons.push(`Passed ${resource.cooldown_hours}h fair-usage cooldown window.`);
    }
  }

  // 3. Department Cross-sharing bonus (encourages inter-disciplinary resource sharing)
  const isCrossDepartment = user.department !== resource.department;
  if (isCrossDepartment) {
    score = Math.min(100, score + 10);
    reasons.push(`+10 FairShare Bonus: Cross-department collaboration (${user.department} → ${resource.department}).`);
  }

  // 4. Resource fair-use weight deduction
  score = Math.max(0, score - (resource.fair_use_weight / 2));

  // Determine priority tier
  let priorityRank: FairUseEvaluation['priorityRank'] = 'Standard Priority';
  let canBook = true;

  if (score >= 85 && !cooldownActive) {
    priorityRank = 'High Priority';
  } else if (cooldownActive) {
    priorityRank = 'Cool-off Queued';
  } else if (score < 40) {
    priorityRank = 'Quota Exceeded';
    canBook = false;
    reasons.push('Fair-use score is below institutional safety threshold (40).');
  }

  return {
    score: Math.round(score),
    canBook,
    priorityRank,
    cooldownActive,
    hoursUntilEligible,
    reasons,
    departmentCrossShareBonus: isCrossDepartment,
  };
}

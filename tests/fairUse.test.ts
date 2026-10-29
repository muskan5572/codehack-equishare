import { evaluateFairUse } from '../src/lib/fairUse';
import { Profile, Resource, Booking } from '../src/types';

describe('FairShare(TM) Allocation Algorithm Unit Tests', () => {
  const mockUser: Profile = {
    id: 'user-1',
    email: 'test@campus.edu',
    full_name: 'Test Researcher',
    role: 'researcher',
    department: 'Materials Science',
    avatar_url: '',
    fair_use_score: 95,
    active_bookings_count: 0,
    verified: true,
  };

  const mockResource: Resource = {
    id: 'res-sem',
    title: 'Scanning Electron Microscope',
    category: 'Laboratory',
    description: 'High vacuum SEM',
    location: 'Lab 112',
    owner_id: 'manager-1',
    department: 'Materials Science',
    images: [],
    availability_status: 'available',
    deposit_required: 200,
    supervision_required: true,
    required_credentials: ['Cleanroom Level 100'],
    max_consecutive_hours: 3,
    cooldown_hours: 24,
    fair_use_weight: 20,
  };

  test('should award High Priority status for verified user with zero active bookings', () => {
    const evaluation = evaluateFairUse(mockUser, mockResource, [], []);
    expect(evaluation.canBook).toBe(true);
    expect(evaluation.priorityRank).toBe('High Priority');
  });

  test('should trigger cooldown flag if user booked the same resource recently', () => {
    const recentBooking: Booking = {
      id: 'b-recent',
      resource_id: mockResource.id,
      user_id: mockUser.id,
      start_time: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      end_time: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      purpose_summary: 'Prior characterization session',
      status: 'returned',
      waitlist_position: 0,
      fair_use_deduction: 20,
      created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    };

    const evaluation = evaluateFairUse(mockUser, mockResource, [recentBooking], [recentBooking]);
    expect(evaluation.cooldownActive).toBe(true);
    expect(evaluation.priorityRank).toBe('Cool-off Queued');
  });

  test('should add +10 bonus for cross-department resource sharing', () => {
    const crossDeptUser: Profile = { ...mockUser, department: 'Robotics Engineering' };
    const evaluation = evaluateFairUse(crossDeptUser, mockResource, [], []);
    expect(evaluation.departmentCrossShareBonus).toBe(true);
  });
});

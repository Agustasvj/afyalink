/**
 * AfyaLink — Synthetic Demo Follow-Ups
 * All names and records are fictional.
 */

import type { FollowUp } from '../features/follow-ups/types';

/** Returns a date string relative to today. */
function relativeDate(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

export function seedDemoData(): FollowUp[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'demo-001',
      displayName: 'Demo Member A',
      followUpDate: relativeDate(0),
      category: 'General check-in',
      status: 'scheduled',
      note: 'Routine community wellness check-in.',
      demoCode: 'DEMO-A1',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo-002',
      displayName: 'Demo Member B',
      followUpDate: relativeDate(1),
      category: 'Clinic appointment',
      status: 'contacted',
      note: 'Confirmed appointment at the local clinic.',
      demoCode: 'DEMO-B2',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo-003',
      displayName: 'Demo Member C',
      followUpDate: relativeDate(3),
      category: 'Maternal health follow-up',
      status: 'needs_rescheduling',
      note: 'Needs a new date after previous visit was missed.',
      demoCode: 'DEMO-C3',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo-004',
      displayName: 'Demo Member D',
      followUpDate: relativeDate(5),
      category: 'Child wellness visit',
      status: 'scheduled',
      note: 'Scheduled growth monitoring visit.',
      demoCode: 'DEMO-D4',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo-005',
      displayName: 'Demo Member E',
      followUpDate: relativeDate(-2),
      category: 'Medication review with clinician',
      status: 'attended',
      note: 'Completed medication review; no issues.',
      demoCode: 'DEMO-E5',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo-006',
      displayName: 'Demo Member F',
      followUpDate: relativeDate(0),
      category: 'Maternal health follow-up',
      status: 'scheduled',
      note: 'Second trimester check scheduled for today.',
      demoCode: 'DEMO-F6',
      createdAt: now,
      updatedAt: now,
    },
  ];
}

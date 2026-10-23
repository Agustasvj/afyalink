/**
 * AfyaLink — Follow-Up Domain Types
 * All data is synthetic / demo-only.
 */

export const CATEGORIES = [
  'General check-in',
  'Clinic appointment',
  'Maternal health follow-up',
  'Medication review with clinician',
  'Child wellness visit',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const STATUSES = [
  'scheduled',
  'contacted',
  'attended',
  'needs_rescheduling',
] as const;

export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  scheduled: 'Scheduled',
  contacted: 'Contacted',
  attended: 'Attended',
  needs_rescheduling: 'Needs Rescheduling',
};

export interface FollowUp {
  id: string;
  displayName: string;
  followUpDate: string; // ISO date string YYYY-MM-DD
  category: Category;
  status: Status;
  note: string;
  demoCode: string; // non-identifying code for member view lookup
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface CreateFollowUpInput {
  displayName: string;
  followUpDate: string;
  category: Category;
  status?: Status;
  note?: string;
  demoCode?: string;
}

export interface FollowUpFilters {
  status?: Status;
  search?: string;
}

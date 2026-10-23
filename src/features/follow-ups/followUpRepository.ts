/**
 * AfyaLink — Repository Interface
 * Persistence abstraction so the UI doesn't care about storage backend.
 */

import type { FollowUp, CreateFollowUpInput, FollowUpFilters, Status } from './types';

export interface FollowUpRepository {
  listFollowUps(filters?: FollowUpFilters): Promise<FollowUp[]>;
  createFollowUp(input: CreateFollowUpInput): Promise<FollowUp>;
  updateFollowUpStatus(id: string, status: Status): Promise<FollowUp>;
  getMemberNextStep(demoCode: string): Promise<FollowUp | null>;
}

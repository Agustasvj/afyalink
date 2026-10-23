/**
 * AfyaLink — localStorage Repository Implementation
 * All data is stored in the browser only. No network calls.
 */

import type { FollowUp, CreateFollowUpInput, FollowUpFilters, Status } from './types';
import type { FollowUpRepository } from './followUpRepository';
import { seedDemoData } from '../../data/demoFollowUps';

const STORAGE_KEY = 'afyalink_follow_ups';

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function readAll(): FollowUp[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FollowUp[];
  } catch {
    console.warn('AfyaLink: Could not read follow-ups from localStorage.');
    return [];
  }
}

function writeAll(records: FollowUp[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('AfyaLink: Could not write follow-ups to localStorage.', e);
    throw new Error('Failed to save. Your browser storage may be full or unavailable.');
  }
}

/** Ensure demo data is seeded on first use. */
export function ensureSeeded(): void {
  const existing = readAll();
  if (existing.length === 0) {
    writeAll(seedDemoData());
  }
}

export const localStorageRepository: FollowUpRepository = {
  async listFollowUps(filters?: FollowUpFilters): Promise<FollowUp[]> {
    let records = readAll();

    if (filters?.status) {
      records = records.filter((r) => r.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      records = records.filter(
        (r) =>
          r.displayName.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.demoCode.toLowerCase().includes(q)
      );
    }

    // Sort by follow-up date ascending
    records.sort(
      (a, b) =>
        new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime()
    );

    return records;
  },

  async createFollowUp(input: CreateFollowUpInput): Promise<FollowUp> {
    const now = new Date().toISOString();
    const record: FollowUp = {
      id: generateId(),
      displayName: input.displayName.trim(),
      followUpDate: input.followUpDate,
      category: input.category,
      status: input.status ?? 'scheduled',
      note: input.note?.trim() ?? '',
      demoCode:
        input.demoCode?.trim() ||
        `DEMO-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      createdAt: now,
      updatedAt: now,
    };

    const records = readAll();
    records.push(record);
    writeAll(records);
    return record;
  },

  async updateFollowUpStatus(id: string, status: Status): Promise<FollowUp> {
    const records = readAll();
    const idx = records.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Follow-up record not found.');

    records[idx] = {
      ...records[idx],
      status,
      updatedAt: new Date().toISOString(),
    };
    writeAll(records);
    return records[idx];
  },

  async getMemberNextStep(demoCode: string): Promise<FollowUp | null> {
    const records = readAll();
    return (
      records.find(
        (r) => r.demoCode.toLowerCase() === demoCode.toLowerCase()
      ) ?? null
    );
  },
};

/**
 * AfyaLink — Follow-Up Validation
 */

import { CATEGORIES, STATUSES, type CreateFollowUpInput } from './types';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateFollowUpInput(
  input: Partial<CreateFollowUpInput>
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Display name
  if (!input.displayName || input.displayName.trim().length === 0) {
    errors.push({ field: 'displayName', message: 'Display name is required.' });
  } else if (input.displayName.trim().length > 80) {
    errors.push({
      field: 'displayName',
      message: 'Display name must be 80 characters or fewer.',
    });
  }

  // Follow-up date
  if (!input.followUpDate) {
    errors.push({ field: 'followUpDate', message: 'Follow-up date is required.' });
  } else {
    const parsed = new Date(input.followUpDate + 'T00:00:00');
    if (isNaN(parsed.getTime())) {
      errors.push({
        field: 'followUpDate',
        message: 'Please enter a valid date.',
      });
    }
  }

  // Category
  if (!input.category) {
    errors.push({ field: 'category', message: 'Category is required.' });
  } else if (!(CATEGORIES as readonly string[]).includes(input.category)) {
    errors.push({
      field: 'category',
      message: 'Please select a valid category.',
    });
  }

  // Status (optional on create, but validate if present)
  if (
    input.status &&
    !(STATUSES as readonly string[]).includes(input.status)
  ) {
    errors.push({ field: 'status', message: 'Please select a valid status.' });
  }

  // Note
  if (input.note && input.note.length > 300) {
    errors.push({
      field: 'note',
      message: 'Note must be 300 characters or fewer.',
    });
  }

  return errors;
}

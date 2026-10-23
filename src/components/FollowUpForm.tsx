import React, { useState, useCallback } from 'react';
import { X, Save } from 'lucide-react';
import { CATEGORIES, type CreateFollowUpInput, type Category } from '../features/follow-ups/types';
import { validateFollowUpInput, type ValidationError } from '../features/follow-ups/validation';

interface FollowUpFormProps {
  onSubmit: (input: CreateFollowUpInput) => Promise<void>;
  onCancel: () => void;
}

export default function FollowUpForm({ onSubmit, onCancel }: FollowUpFormProps) {
  const today = new Date().toISOString().split('T')[0];

  const [displayName, setDisplayName] = useState('');
  const [followUpDate, setFollowUpDate] = useState(today);
  const [category, setCategory] = useState<Category | ''>('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [saving, setSaving] = useState(false);

  const getError = (field: string) => errors.find((e) => e.field === field)?.message;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const input: Partial<CreateFollowUpInput> = {
        displayName,
        followUpDate,
        category: category as Category,
        note,
      };

      const validationErrors = validateFollowUpInput(input);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      setSaving(true);
      try {
        await onSubmit(input as CreateFollowUpInput);
      } catch {
        setErrors([{ field: '_form', message: 'Failed to save. Please try again.' }]);
      } finally {
        setSaving(false);
      }
    },
    [displayName, followUpDate, category, note, onSubmit]
  );

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal-header">
          <h2 className="modal-title" id="form-title">Add Follow-Up</h2>
          <button className="btn-ghost btn" onClick={onCancel} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {getError('_form') && (
              <div className="alert-panel danger" style={{ marginBottom: '16px' }}>
                <div className="alert-panel-content">
                  <p>{getError('_form')}</p>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="displayName" className="form-label">
                Display name or pseudonym
              </label>
              <input
                id="displayName"
                type="text"
                className={`form-input ${getError('displayName') ? 'error' : ''}`}
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setErrors((prev) => prev.filter((er) => er.field !== 'displayName'));
                }}
                placeholder="e.g. Community Member X"
                autoFocus
              />
              {getError('displayName') && (
                <span className="form-error">{getError('displayName')}</span>
              )}
              <span className="form-hint">Use a pseudonym — do not enter real names in this demo.</span>
            </div>

            <div className="form-group">
              <label htmlFor="followUpDate" className="form-label">
                Follow-up date
              </label>
              <input
                id="followUpDate"
                type="date"
                className={`form-input ${getError('followUpDate') ? 'error' : ''}`}
                value={followUpDate}
                onChange={(e) => {
                  setFollowUpDate(e.target.value);
                  setErrors((prev) => prev.filter((er) => er.field !== 'followUpDate'));
                }}
              />
              {getError('followUpDate') && (
                <span className="form-error">{getError('followUpDate')}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                className={`form-select ${getError('category') ? 'error' : ''}`}
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as Category);
                  setErrors((prev) => prev.filter((er) => er.field !== 'category'));
                }}
              >
                <option value="">Select a category…</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {getError('category') && (
                <span className="form-error">{getError('category')}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="note" className="form-label">
                Note <span style={{ fontWeight: 400, color: 'var(--clr-text-secondary)' }}>(optional)</span>
              </label>
              <textarea
                id="note"
                className={`form-textarea ${getError('note') ? 'error' : ''}`}
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setErrors((prev) => prev.filter((er) => er.field !== 'note'));
                }}
                placeholder="Short, non-sensitive note…"
                rows={3}
              />
              {getError('note') && (
                <span className="form-error">{getError('note')}</span>
              )}
              <span className="form-hint">{note.length}/300 characters. Do not include sensitive health details.</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="pill-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="pill-btn primary" disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving…' : 'Save Follow-Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

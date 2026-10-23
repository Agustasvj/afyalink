import { Calendar, Tag, FileText, Hash } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { STATUSES, STATUS_LABELS, type FollowUp, type Status } from '../features/follow-ups/types';

interface FollowUpListProps {
  followUps: FollowUp[];
  onStatusChange: (id: string, status: Status) => void;
}

/** Format a date string as a human-readable local date. */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';

  return date.toLocaleDateString('en-KE', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

export default function FollowUpList({ followUps, onStatusChange }: FollowUpListProps) {
  if (followUps.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <FileText size={24} />
        </div>
        <p className="empty-state-title">No follow-ups found</p>
        <p>Add a new follow-up to get started, or adjust your filters.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="desktop-only">
        <table className="follow-up-table" role="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Category</th>
              <th>Status</th>
              <th>Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {followUps.map((fu) => (
              <tr key={fu.id}>
                <td style={{ fontWeight: 600 }}>{fu.displayName}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} style={{ color: 'var(--clr-text-secondary)' }} />
                    {formatDate(fu.followUpDate)}
                  </span>
                </td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={14} style={{ color: 'var(--clr-text-secondary)' }} />
                    {fu.category}
                  </span>
                </td>
                <td>
                  <StatusBadge status={fu.status} />
                </td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--clr-text-secondary)' }}>
                    <Hash size={12} />
                    {fu.demoCode}
                  </span>
                </td>
                <td>
                  <select
                    className="status-select"
                    value={fu.status}
                    onChange={(e) => onStatusChange(fu.id, e.target.value as Status)}
                    aria-label={`Change status for ${fu.displayName}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mobile-only">
        {followUps.map((fu) => (
          <div className="follow-up-card" key={fu.id}>
            <div className="follow-up-card-header">
              <span className="follow-up-card-name">{fu.displayName}</span>
              <StatusBadge status={fu.status} />
            </div>
            <div className="follow-up-card-details">
              <span>
                <Calendar size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
                {formatDate(fu.followUpDate)}
              </span>
              <span>
                <Tag size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
                {fu.category}
              </span>
              {fu.note && (
                <span style={{ fontStyle: 'italic' }}>"{fu.note}"</span>
              )}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                Code: {fu.demoCode}
              </span>
            </div>
            <div className="follow-up-card-actions">
              <select
                className="status-select"
                value={fu.status}
                onChange={(e) => onStatusChange(fu.id, e.target.value as Status)}
                aria-label={`Change status for ${fu.displayName}`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

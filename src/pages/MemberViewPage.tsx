import { useState, useCallback } from 'react';
import {
  User,
  Search,
  Calendar,
  Tag,
  FileText,
  Info,
  AlertTriangle,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import type { FollowUp } from '../features/follow-ups/types';
import type { FollowUpRepository } from '../features/follow-ups/followUpRepository';

interface MemberViewPageProps {
  repo: FollowUpRepository;
}

/** Format a date string as a human-readable local date. */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-KE', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function MemberViewPage({ repo }: MemberViewPageProps) {
  const [demoCode, setDemoCode] = useState('');
  const [record, setRecord] = useState<FollowUp | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!demoCode.trim()) return;

      setLoading(true);
      setError(null);
      try {
        const result = await repo.getMemberNextStep(demoCode.trim());
        setRecord(result);
      } catch (err) {
        console.error(err);
        setError('Could not look up your record. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [demoCode, repo]
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <User size={24} />
          My Next Step
        </h1>
        <p className="page-description">
          Community members can look up their upcoming appointment or follow-up using their demo code.
        </p>
      </div>

      {/* Info box */}
      <div className="alert-panel info" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="alert-panel-icon"><Info size={20} /></div>
        <div className="alert-panel-content">
          <h3>Demo Lookup</h3>
          <p>
            Enter a demo code to view a single follow-up record. This does not expose the full
            register. Try codes like <strong>DEMO-A1</strong>, <strong>DEMO-B2</strong>, or{' '}
            <strong>DEMO-C3</strong>.
          </p>
        </div>
      </div>

      {/* Lookup form */}
      <form onSubmit={handleLookup} style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        <div className="search-input-wrapper" style={{ flex: 1, minWidth: '200px' }}>
          <Search />
          <input
            type="text"
            className="search-input"
            placeholder="Enter your demo code (e.g. DEMO-A1)"
            value={demoCode}
            onChange={(e) => setDemoCode(e.target.value)}
            aria-label="Demo code"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading || !demoCode.trim()}>
          {loading ? 'Looking up…' : 'Look Up'}
        </button>
      </form>

      {error && (
        <div className="alert-panel danger" style={{ marginBottom: 'var(--space-lg)' }}>
          <div className="alert-panel-icon"><AlertTriangle size={20} /></div>
          <div className="alert-panel-content"><p>{error}</p></div>
        </div>
      )}

      {/* Result: not found */}
      {record === null && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FileText size={24} />
          </div>
          <p className="empty-state-title">No record found</p>
          <p>
            We couldn't find a follow-up for code "<strong>{demoCode}</strong>".
            Please check the code and try again, or contact your community health worker.
          </p>
        </div>
      )}

      {/* Result: found */}
      {record && (
        <div className="member-card">
          <div className="member-card-header">
            <div className="member-card-icon">
              <User size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Your Next Step</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)' }}>
                Follow-up details for {record.displayName}
              </p>
            </div>
          </div>

          <div className="member-card-detail">
            <span className="member-card-label">
              <Calendar size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
              Appointment date
            </span>
            <span className="member-card-value">{formatDate(record.followUpDate)}</span>
          </div>

          <div className="member-card-detail">
            <span className="member-card-label">
              <Tag size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
              Type
            </span>
            <span className="member-card-value">{record.category}</span>
          </div>

          <div className="member-card-detail">
            <span className="member-card-label">Status</span>
            <StatusBadge status={record.status} />
          </div>

          {record.note && (
            <div className="member-card-detail">
              <span className="member-card-label">Note</span>
              <span className="member-card-value" style={{ fontWeight: 400, fontStyle: 'italic' }}>
                {record.note}
              </span>
            </div>
          )}

          <hr className="section-divider" />

          <div style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)', lineHeight: 1.7 }}>
            <p>
              <strong>What to do next:</strong> Please attend your follow-up on the date above.
              If you need to change the date or have questions, contact your community health
              worker or visit your local clinic.
            </p>
            <p style={{ marginTop: '8px' }}>
              <em>
                Reminder shown in this demo — AfyaLink does not send real SMS or notifications
                in this prototype.
              </em>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

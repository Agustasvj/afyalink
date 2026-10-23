import { useState, useCallback } from 'react';
import {
  User,
  Search,
  Calendar,
  Tag,
  FileText,
  Info,
  AlertTriangle,
  ArrowRight,
  Sparkles,
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
        <span className="eyebrow">Patient Care Navigation</span>
        <h1 className="page-title serif-display">
          <User size={28} style={{ color: 'var(--clr-accent-mint)' }} />
          My Next Step
        </h1>
        <p className="page-description">
          Community members can enter their assigned care code to view their appointment date
          and actionable next steps without exposing other patients' records.
        </p>
      </div>

      {/* Info hint pill */}
      <div className="alert-panel info" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="alert-panel-icon"><Info size={20} /></div>
        <div className="alert-panel-content">
          <h3>Private Member Lookup</h3>
          <p>
            Enter your care code to view your scheduled check-in. Try synthetic demo codes like{' '}
            <strong style={{ color: '#FFFFFF' }}>DEMO-A1</strong>,{' '}
            <strong style={{ color: '#FFFFFF' }}>DEMO-B2</strong>, or{' '}
            <strong style={{ color: '#FFFFFF' }}>DEMO-C3</strong>.
          </p>
        </div>
      </div>

      {/* Lookup form */}
      <form onSubmit={handleLookup} style={{ display: 'flex', gap: '10px', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        <div className="search-input-wrapper" style={{ flex: 1, minWidth: '240px' }}>
          <Search />
          <input
            type="text"
            className="search-input"
            placeholder="Enter your care code (e.g. DEMO-A1)"
            value={demoCode}
            onChange={(e) => setDemoCode(e.target.value)}
            aria-label="Care code"
          />
        </div>
        <button type="submit" className="pill-btn primary" disabled={loading || !demoCode.trim()}>
          {loading ? 'Retrieving…' : 'Look Up Next Step'}
          <ArrowRight size={16} />
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
            We couldn't find a record for code "<strong>{demoCode}</strong>".
            Please double-check your code or check with your community health worker.
          </p>
        </div>
      )}

      {/* Result: found (Santa Cruz Spec Card) */}
      {record && (
        <div className="member-card">
          <div className="sc-card-brand" style={{ marginBottom: '4px' }}>
            Community Care Card · Scoped View
          </div>

          <div className="member-card-header">
            <div className="member-card-icon">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="serif-display" style={{ fontSize: '2.1rem', color: '#FFFFFF', lineHeight: 1.1 }}>
                {record.displayName}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-secondary)', marginTop: '2px' }}>
                Code: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--clr-accent-mint)' }}>{record.demoCode}</span>
              </p>
            </div>
          </div>

          <div className="member-card-detail">
            <span className="member-card-label">
              <Calendar size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
              Scheduled Appointment
            </span>
            <span className="member-card-value" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#EAF3EF' }}>
              {formatDate(record.followUpDate)}
            </span>
          </div>

          <div className="member-card-detail">
            <span className="member-card-label">
              <Tag size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
              Care Category
            </span>
            <span className="pill-btn" style={{ fontSize: '0.8rem', padding: '4px 12px', cursor: 'default' }}>
              {record.category}
            </span>
          </div>

          <div className="member-card-detail">
            <span className="member-card-label">Current Status</span>
            <StatusBadge status={record.status} />
          </div>

          {record.note && (
            <div className="member-card-detail" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
              <span className="member-card-label">Care Instructions / Note</span>
              <span style={{ fontSize: '0.9rem', color: '#D4E2DC', fontStyle: 'italic', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', width: '100%' }}>
                "{record.note}"
              </span>
            </div>
          )}

          <hr className="section-divider" style={{ margin: 'var(--space-lg) 0' }} />

          <div style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)', lineHeight: 1.6 }}>
            <p>
              <strong style={{ color: '#FFFFFF' }}>Actionable next step:</strong> Please attend your clinic or dispensary
              check-in on the scheduled date. If you need to reschedule or require mobility support, contact your frontline community health worker.
            </p>
            <p style={{ marginTop: '8px', fontSize: '0.785rem', color: 'var(--clr-text-muted)' }}>
              <em>
                Demo notice: AfyaLink coordinates follow-up appointments locally in this prototype without third-party SMS delivery.
              </em>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

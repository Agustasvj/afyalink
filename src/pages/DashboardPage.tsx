import { useEffect, useState, useCallback } from 'react';
import {
  CalendarCheck,
  CalendarClock,
  AlertCircle,
  Activity,
  Lightbulb,
  ClipboardList,
  Users,
  HeartPulse,
} from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import StatusBadge from '../components/StatusBadge';
import type { FollowUp, Status } from '../features/follow-ups/types';
import type { FollowUpRepository } from '../features/follow-ups/followUpRepository';

interface DashboardPageProps {
  repo: FollowUpRepository;
  onNavigate: (page: 'follow-ups') => void;
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
  });
}

export default function DashboardPage({ repo, onNavigate }: DashboardPageProps) {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await repo.listFollowUps();
      setFollowUps(data);
      setError(null);
    } catch (e) {
      setError('Could not load follow-ups. Please try refreshing.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [repo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const dueToday = followUps.filter((f) => f.followUpDate === todayStr);
  const upcoming = followUps.filter(
    (f) => f.followUpDate > todayStr && f.status !== 'attended'
  );
  const needsRescheduling = followUps.filter(
    (f) => f.status === 'needs_rescheduling'
  );
  const totalActive = followUps.filter(
    (f) => f.status !== 'attended'
  );

  const handleStatusChange = useCallback(
    async (id: string, status: Status) => {
      try {
        await repo.updateFollowUpStatus(id, status);
        await loadData();
      } catch (e) {
        console.error(e);
      }
    },
    [repo, loadData]
  );

  if (loading) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert-panel danger">
          <div className="alert-panel-icon"><AlertCircle size={22} /></div>
          <div className="alert-panel-content">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={loadData}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <Activity size={24} />
          Overview
        </h1>
        <p className="page-description">
          Community follow-up dashboard — all data is fictional and for demonstration only.
        </p>
      </div>

      {/* Summary cards */}
      <div className="summary-grid">
        <SummaryCard
          icon={<CalendarCheck size={22} />}
          value={dueToday.length}
          label="Due today"
          variant="teal"
        />
        <SummaryCard
          icon={<CalendarClock size={22} />}
          value={upcoming.length}
          label="Upcoming"
          variant="teal"
        />
        <SummaryCard
          icon={<AlertCircle size={22} />}
          value={needsRescheduling.length}
          label="Needs rescheduling"
          variant="amber"
        />
        <SummaryCard
          icon={<ClipboardList size={22} />}
          value={totalActive.length}
          label="Total active"
          variant="teal"
        />
      </div>

      {/* Today's follow-ups */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarCheck size={20} />
          Today's Follow-ups
        </h2>
        {dueToday.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--space-lg)' }}>
            <p className="empty-state-title">No follow-ups due today</p>
            <p>Great — you're all caught up! Check the register for upcoming items.</p>
          </div>
        ) : (
          <div>
            {dueToday.map((fu) => (
              <div
                key={fu.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-sm) 0',
                  borderBottom: '1px solid var(--clr-border)',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <span style={{ fontWeight: 600 }}>{fu.displayName}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)' }}>
                    {fu.category}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatusBadge status={fu.status} />
                  <select
                    className="status-select"
                    value={fu.status}
                    onChange={(e) =>
                      handleStatusChange(fu.id, e.target.value as Status)
                    }
                    aria-label={`Update status for ${fu.displayName}`}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="contacted">Contacted</option>
                    <option value="attended">Attended</option>
                    <option value="needs_rescheduling">Needs Rescheduling</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'var(--space-md)', textAlign: 'right' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('follow-ups')}
          >
            View all follow-ups →
          </button>
        </div>
      </div>

      {/* How AfyaLink helps */}
      <div className="info-section">
        <h3>
          <Lightbulb size={18} />
          How AfyaLink Helps
        </h3>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-item-icon"><ClipboardList size={16} /></div>
            <div className="info-item-text">
              <strong>Organised follow-ups</strong>
              Replace scattered notebooks with a simple digital register.
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-icon"><CalendarCheck size={16} /></div>
            <div className="info-item-text">
              <strong>Clear next steps</strong>
              Community members see their upcoming appointment or action.
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-icon"><Users size={16} /></div>
            <div className="info-item-text">
              <strong>Low-bandwidth friendly</strong>
              Works on modest phones — no constant internet needed.
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-icon"><HeartPulse size={16} /></div>
            <div className="info-item-text">
              <strong>Community-centred</strong>
              Designed for CHWs in Kenyan community health settings.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

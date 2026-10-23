import { useEffect, useState, useCallback } from 'react';
import {
  CalendarCheck,
  CalendarClock,
  AlertCircle,
  Plus,
  ArrowRight,
  ClipboardList,
  Sparkles,
  MapPin,
  HeartHandshake,
  ShieldCheck,
  Smartphone,
  Layers,
} from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import StatusBadge from '../components/StatusBadge';
import FollowUpForm from '../components/FollowUpForm';
import type { FollowUp, Status, CreateFollowUpInput } from '../features/follow-ups/types';
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

type TabKey = 'today' | 'upcoming' | 'reschedule';

export default function DashboardPage({ repo, onNavigate }: DashboardPageProps) {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('today');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

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

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const todayStr = new Date().toISOString().split('T')[0];

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
        showToastMsg('Status updated');
        await loadData();
      } catch (e) {
        console.error(e);
      }
    },
    [repo, loadData]
  );

  const handleCreateFollowUp = async (input: CreateFollowUpInput) => {
    await repo.createFollowUp(input);
    setShowAddModal(false);
    showToastMsg('Follow-up scheduled');
    await loadData();
  };

  const currentList =
    activeTab === 'today'
      ? dueToday
      : activeTab === 'upcoming'
      ? upcoming
      : needsRescheduling;

  if (loading) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Sparkles size={24} />
          </div>
          <p className="empty-state-title">Loading care registry…</p>
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
            <h3>Unable to access local database</h3>
            <p>{error}</p>
          </div>
        </div>
        <button className="pill-btn primary" onClick={loadData}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* ── Santa Cruz Inspired Editorial Hero ────────────────── */}
      <section className="santa-cruz-hero">
        <span className="eyebrow">Frontline Care Navigation</span>
        <h1 className="santa-cruz-headline">
          Your clinic manages the visit.<br />
          AfyaLink remembers the follow-up.
        </h1>
        <p className="santa-cruz-subheadline">
          Every non-emergency check-in, maternal visit, and immunization next step organized
          in one focused register. Lightweight, calm, and designed for frontline community health workers.
        </p>

        <div className="santa-cruz-actions">
          <button className="btn-primary btn" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Add Follow-Up
          </button>
          <button className="btn-secondary btn" onClick={() => onNavigate('follow-ups')}>
            Open Register
            <ArrowRight size={16} />
          </button>
          <span className="demo-badge">
            <Sparkles size={12} />
            Offline Storage
          </span>
        </div>
      </section>

      {/* ── Santa Cruz Feature Card (Centerpiece) ─────────────── */}
      <div className="santa-cruz-card">
        <div className="sc-card-brand">AfyaLink Active Care Roster</div>
        <h2 className="sc-card-title">Community Care Queue</h2>
        <div className="sc-card-meta">
          <MapPin size={14} />
          <span>Health Unit 04 · 2026 · Kasarani Catchment</span>
        </div>

        {/* Action pills row */}
        <div className="sc-card-pills">
          <button className="pill-btn primary" onClick={() => setShowAddModal(true)}>
            <Plus size={14} />
            Add Patient Check-in
          </button>
          <button className="pill-btn" onClick={() => onNavigate('follow-ups')}>
            <ClipboardList size={14} />
            Full Register
          </button>
          <span className="pill-btn" style={{ cursor: 'default' }}>
            <Layers size={14} />
            {totalActive.length} Active Records
          </span>
        </div>

        {/* Santa Cruz Horizontal Tabs */}
        <div className="sc-tabs">
          <button
            className={`sc-tab ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            Due Today ({dueToday.length})
          </button>
          <button
            className={`sc-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Care ({upcoming.length})
          </button>
          <button
            className={`sc-tab ${activeTab === 'reschedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('reschedule')}
          >
            Needs Rescheduling ({needsRescheduling.length})
          </button>
        </div>

        <div className="sc-cost-bar">
          <span>Current active caseload: <strong>{totalActive.length} community members</strong></span>
          <span>Status: <strong style={{ color: 'var(--clr-accent-mint)' }}>Operational</strong></span>
        </div>

        {/* Santa Cruz Nested Dark List Items */}
        {currentList.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--space-lg)' }}>
            <p className="empty-state-title">No records in this queue</p>
            <p>All items in this category are up to date.</p>
          </div>
        ) : (
          <div>
            {currentList.map((fu) => (
              <div key={fu.id} className="sc-nested-item">
                <div className="sc-nested-left">
                  <div className="sc-item-avatar">
                    {fu.displayName.slice(0, 1)}
                  </div>
                  <div>
                    <div className="sc-item-name">{fu.displayName}</div>
                    <div className="sc-item-category">
                      {fu.category} · {formatDate(fu.followUpDate)}
                    </div>
                    {fu.note && (
                      <div style={{ fontSize: '0.785rem', color: 'var(--clr-text-muted)', fontStyle: 'italic', marginTop: '2px' }}>
                        "{fu.note}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="sc-nested-right">
                  <StatusBadge status={fu.status} />
                  <select
                    className="status-select"
                    value={fu.status}
                    onChange={(e) => handleStatusChange(fu.id, e.target.value as Status)}
                    aria-label={`Update status for ${fu.displayName}`}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="contacted">Contacted</option>
                    <option value="attended">Attended</option>
                    <option value="needs_rescheduling">Needs Reschedule</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Summary Metric Cards Grid ─────────────────────────── */}
      <div className="summary-grid">
        <SummaryCard
          icon={<CalendarCheck size={18} />}
          value={dueToday.length}
          label="Due Today"
        />
        <SummaryCard
          icon={<CalendarClock size={18} />}
          value={upcoming.length}
          label="Upcoming"
        />
        <SummaryCard
          icon={<AlertCircle size={18} />}
          value={needsRescheduling.length}
          label="Needs Reschedule"
        />
        <SummaryCard
          icon={<ClipboardList size={18} />}
          value={totalActive.length}
          label="Total Active"
        />
      </div>

      {/* ── How AfyaLink Helps (Dark Atmospheric Panel) ───────── */}
      <div className="info-section">
        <h3>
          <HeartHandshake size={22} style={{ color: 'var(--clr-accent-mint)' }} />
          Designed for Frontline Community Health
        </h3>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-item-icon"><ClipboardList size={16} /></div>
            <div className="info-item-text">
              <strong>Structured check-in register</strong>
              Replaces loose notebooks and verbal reminders with a reliable, local digital log.
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-icon"><CalendarCheck size={16} /></div>
            <div className="info-item-text">
              <strong>Clear community next steps</strong>
              Gives each patient a scoped lookup code so they always know their scheduled appointment.
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-icon"><Smartphone size={16} /></div>
            <div className="info-item-text">
              <strong>Low-bandwidth & offline-first</strong>
              Zero latency and runs without constant mobile data or expensive devices.
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-icon"><ShieldCheck size={16} /></div>
            <div className="info-item-text">
              <strong>Privacy & non-diagnostic boundary</strong>
              Never collects invasive data or gives automated clinical advice.
            </div>
          </div>
        </div>
      </div>

      {/* Add Follow-Up Modal */}
      {showAddModal && (
        <FollowUpForm
          onSubmit={handleCreateFollowUp}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className="toast success">{toast}</div>
        </div>
      )}
    </div>
  );
}

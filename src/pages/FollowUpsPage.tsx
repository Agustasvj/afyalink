import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Download, ClipboardList, Filter } from 'lucide-react';
import FollowUpList from '../components/FollowUpList';
import FollowUpForm from '../components/FollowUpForm';
import type { FollowUp, Status, CreateFollowUpInput, FollowUpFilters } from '../features/follow-ups/types';
import { STATUSES, STATUS_LABELS } from '../features/follow-ups/types';
import type { FollowUpRepository } from '../features/follow-ups/followUpRepository';

interface FollowUpsPageProps {
  repo: FollowUpRepository;
}

/** Generate CSV from follow-ups. */
function toCSV(records: FollowUp[]): string {
  const headers = ['Display Name', 'Follow-Up Date', 'Category', 'Status', 'Note', 'Demo Code', 'Created At'];
  const rows = records.map((r) => [
    `"${r.displayName}"`,
    r.followUpDate,
    `"${r.category}"`,
    r.status,
    `"${r.note.replace(/"/g, '""')}"`,
    r.demoCode,
    r.createdAt,
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export default function FollowUpsPage({ repo }: FollowUpsPageProps) {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const filters: FollowUpFilters = {};
      if (statusFilter) filters.status = statusFilter;
      if (search.trim()) filters.search = search.trim();
      const data = await repo.listFollowUps(filters);
      setFollowUps(data);
    } catch (e) {
      console.error(e);
      showToast('Failed to load follow-ups.', 'error');
    } finally {
      setLoading(false);
    }
  }, [repo, statusFilter, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCreate = useCallback(
    async (input: CreateFollowUpInput) => {
      await repo.createFollowUp(input);
      setShowForm(false);
      showToast('Follow-up record added', 'success');
      await loadData();
    },
    [repo, loadData]
  );

  const handleStatusChange = useCallback(
    async (id: string, status: Status) => {
      try {
        await repo.updateFollowUpStatus(id, status);
        showToast('Status updated', 'success');
        await loadData();
      } catch (e) {
        console.error(e);
        showToast('Failed to update status', 'error');
      }
    },
    [repo, loadData]
  );

  const handleExport = () => {
    const csv = toCSV(followUps);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `afyalink-follow-ups-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully', 'success');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="eyebrow">Frontline Management</span>
        <h1 className="page-title serif-display">
          <ClipboardList size={28} style={{ color: 'var(--clr-accent-mint)' }} />
          Follow-Up Register
        </h1>
        <p className="page-description">
          Review, filter, and update patient follow-up lifecycles across your community catchment.
        </p>
      </div>

      {/* Toolbar with Santa Cruz Pill Styling */}
      <div className="toolbar">
        <div className="search-input-wrapper">
          <Search />
          <input
            type="search"
            className="search-input"
            placeholder="Search by pseudonym, category, or code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search follow-ups"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={15} style={{ color: 'var(--clr-text-muted)' }} />
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '160px', borderRadius: 'var(--radius-pill)', padding: '9px 16px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | '')}
              aria-label="Filter by status"
            >
              <option value="">All statuses ({followUps.length})</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <button className="pill-btn" onClick={handleExport} title="Export CSV">
            <Download size={14} />
            Export CSV
          </button>

          <button className="pill-btn primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            Add Follow-Up
          </button>
        </div>
      </div>

      {/* Follow-up list in dark glass container */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="empty-state" style={{ padding: 'var(--space-2xl)' }}>
            <p>Loading records…</p>
          </div>
        ) : (
          <FollowUpList followUps={followUps} onStatusChange={handleStatusChange} />
        )}
      </div>

      {/* Add form modal */}
      {showForm && (
        <FollowUpForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>{toast.message}</div>
        </div>
      )}
    </div>
  );
}

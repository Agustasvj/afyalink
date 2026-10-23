import { STATUS_LABELS, type Status } from '../features/follow-ups/types';

interface StatusBadgeProps {
  status: Status;
}

/**
 * Accessible status chip with both a colour dot and text label.
 * Never relies on colour alone.
 */
export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge ${status}`} role="status">
      <span className="status-dot" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}

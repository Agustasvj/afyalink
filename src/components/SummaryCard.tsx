import React from 'react';

interface SummaryCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  variant?: 'teal' | 'amber' | 'red';
}

export default function SummaryCard({ icon, value, label, variant = 'teal' }: SummaryCardProps) {
  return (
    <div className="summary-card">
      <div className={`summary-card-icon ${variant}`}>{icon}</div>
      <span className="summary-card-value">{value}</span>
      <span className="summary-card-label">{label}</span>
    </div>
  );
}

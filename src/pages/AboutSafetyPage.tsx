import { ShieldAlert, Code, Scale, Github } from 'lucide-react';
import SafetyNotice from '../components/SafetyNotice';

export default function AboutSafetyPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <span className="eyebrow">Protocol & Governance</span>
        <h1 className="page-title serif-display">
          <ShieldAlert size={28} style={{ color: 'var(--clr-accent-mint)' }} />
          About & Safety
        </h1>
        <p className="page-description">
          Ethical boundaries, urgent medical notices, privacy guarantees, and open-source architecture.
        </p>
      </div>

      <SafetyNotice />

      <hr className="section-divider" />

      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 className="serif-display" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Code size={20} style={{ color: 'var(--clr-accent-mint)' }} />
          About AfyaLink
        </h2>
        <div style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--clr-text-secondary)' }}>
          <p>
            <strong style={{ color: '#FFFFFF' }}>AfyaLink</strong> is a community health navigation and follow-up
            coordination system designed for frontline community health workers and dispensary teams.
          </p>
          <p style={{ marginTop: '12px' }}>
            It is a mobile-first, low-bandwidth community health tool. Its sole purpose is to help community health workers (CHWs) organize
            non-emergency follow-ups and help community members know their practical next step for accessing care.
          </p>
          <p style={{ marginTop: '12px' }}>
            <strong style={{ color: '#FFFFFF' }}>Non-clinical demonstration boundary:</strong> AfyaLink does not store real
            patient data, does not send real third-party SMS messages, and does not provide clinical
            diagnoses, risk scores, or prescription recommendations. All records in this demo are entirely synthetic.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 className="serif-display" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Scale size={20} style={{ color: 'var(--clr-accent-mint)' }} />
          Privacy & Data Sovereignty
        </h2>
        <div style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--clr-text-secondary)' }}>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>All records are stored <strong style={{ color: '#FFFFFF' }}>locally in your browser</strong> using browser localStorage.</li>
            <li>No data is transmitted to external servers, cloud databases, or third-party analytical trackers in this default mode.</li>
            <li>No national identification numbers, phone numbers, exact physical addresses, or detailed clinical records are collected.</li>
            <li>Data does not leak across different browsers, devices, or patient view sessions.</li>
            <li>Clearing browser storage or cache instantly resets all local test records.</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h2 className="serif-display" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Github size={20} style={{ color: 'var(--clr-accent-mint)' }} />
          Open Source & Architecture
        </h2>
        <div style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--clr-text-secondary)' }}>
          <p>
            AfyaLink is open-source under the <strong style={{ color: '#FFFFFF' }}>MIT Licence</strong>.
            Built with React 18, TypeScript, and Vite with zero external styling dependencies.
          </p>
        </div>
      </div>
    </div>
  );
}

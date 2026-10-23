import { ShieldAlert, Code, Scale, Github } from 'lucide-react';
import SafetyNotice from '../components/SafetyNotice';

export default function AboutSafetyPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <ShieldAlert size={24} />
          About & Safety
        </h1>
        <p className="page-description">
          Important information about this prototype, its limitations, and safety guidance.
        </p>
      </div>

      <SafetyNotice />

      <hr className="section-divider" />

      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code size={20} />
          About AfyaLink
        </h2>
        <div style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--clr-text-secondary)' }}>
          <p>
            <strong>AfyaLink</strong> is a buildathon prototype created for the{' '}
            <strong>IEEE Day 2026 Buildathon — Track 1: Health and Humanity</strong>,
            hosted by the IEEE Moi University Student Branch.
          </p>
          <p style={{ marginTop: '12px' }}>
            It is a mobile-first, low-bandwidth community health navigation and follow-up
            tool. Its purpose is to help community health workers (CHWs) organise
            non-emergency follow-ups and help community members know their next step.
          </p>
          <p style={{ marginTop: '12px' }}>
            <strong>This is not a production application.</strong> It does not store real
            patient data, does not send real messages, and does not provide clinical
            advice. All data in the demo is fictional.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scale size={20} />
          Privacy & Data
        </h2>
        <div style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--clr-text-secondary)' }}>
          <ul style={{ paddingLeft: '20px' }}>
            <li>All data is stored <strong>locally in your browser</strong> using localStorage.</li>
            <li>No data is sent to any server or third party.</li>
            <li>No real personal information, national IDs, phone numbers, or clinical history is collected.</li>
            <li>Data does not persist across different browsers or devices.</li>
            <li>Clearing your browser data will remove all records.</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Github size={20} />
          Open Source
        </h2>
        <div style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--clr-text-secondary)' }}>
          <p>
            This project is open-source under the <strong>MIT Licence</strong>.
            Built with React, TypeScript, and Vite.
          </p>
        </div>
      </div>
    </div>
  );
}

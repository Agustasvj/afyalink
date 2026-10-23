import { AlertTriangle, ShieldAlert, HeartHandshake, Info } from 'lucide-react';

/**
 * Safety disclaimer and urgent help panel.
 * Spec: "Do not invent or hard-code unverified phone numbers."
 */
export default function SafetyNotice() {
  return (
    <div>
      <div className="alert-panel danger">
        <div className="alert-panel-icon">
          <AlertTriangle size={22} />
        </div>
        <div className="alert-panel-content">
          <h3>Urgent Help</h3>
          <p>
            AfyaLink is <strong>not an emergency service</strong>. If you or someone you know is
            facing a potentially life-threatening emergency, please seek immediate local emergency
            assistance or go to the nearest emergency department. Do not rely on this app for
            urgent or emergency care.
          </p>
        </div>
      </div>

      <div className="alert-panel warning">
        <div className="alert-panel-icon">
          <ShieldAlert size={22} />
        </div>
        <div className="alert-panel-content">
          <h3>Clinical & Safety Note</h3>
          <p>
            AfyaLink does not diagnose, prescribe, or replace a qualified health professional.
            This prototype uses <strong>fictional data only</strong> and is not intended for
            clinical use. It is a community follow-up coordination tool built for the IEEE Day
            2026 Buildathon.
          </p>
        </div>
      </div>

      <div className="alert-panel info">
        <div className="alert-panel-icon">
          <Info size={22} />
        </div>
        <div className="alert-panel-content">
          <h3>Demo Prototype</h3>
          <p>
            All names, records, and data displayed in this application are entirely fictional.
            No real personal or patient data is collected, stored, or transmitted. Data is stored
            locally in your browser and is not shared between devices.
          </p>
        </div>
      </div>

      <div className="alert-panel info" style={{ marginTop: '8px' }}>
        <div className="alert-panel-icon">
          <HeartHandshake size={22} />
        </div>
        <div className="alert-panel-content">
          <h3>What AfyaLink Is</h3>
          <p>
            A lightweight, mobile-friendly tool to help community health workers organise
            non-emergency follow-ups and help community members know their next step for
            accessing care. It does not send real SMS or WhatsApp messages — all reminders
            are shown within this demo only.
          </p>
        </div>
      </div>
    </div>
  );
}

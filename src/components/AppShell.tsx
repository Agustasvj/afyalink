import React, { useState, useCallback } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  User,
  ShieldAlert,
  Menu,
  X,
  AlertTriangle,
} from 'lucide-react';

export type Page = 'dashboard' | 'follow-ups' | 'member-view' | 'about-safety';

interface AppShellProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

const NAV_ITEMS: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard', label: 'Overview', icon: <LayoutDashboard /> },
  { page: 'follow-ups', label: 'Follow-ups', icon: <ClipboardList /> },
  { page: 'member-view', label: 'Member View', icon: <User /> },
  { page: 'about-safety', label: 'About & Safety', icon: <ShieldAlert /> },
];

export default function AppShell({ currentPage, onNavigate, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = useCallback(
    (page: Page) => {
      onNavigate(page);
      setSidebarOpen(false);
    },
    [onNavigate]
  );

  return (
    <div className="app-layout">
      {/* Mobile header */}
      <header className="mobile-header">
        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={24} />
        </button>
        <div className="sidebar-brand">
          <span className="sidebar-title">AfyaLink</span>
        </div>
        <span className="demo-badge">
          <AlertTriangle size={12} />
          Demo
        </span>
      </header>

      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">A</div>
            <div>
              <div className="sidebar-title">AfyaLink</div>
              <div className="sidebar-subtitle">Community follow-up</div>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
            style={{ display: sidebarOpen ? 'flex' : 'none', marginTop: '8px' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.page}
              className={`nav-link ${currentPage === item.page ? 'active' : ''}`}
              onClick={() => handleNav(item.page)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="demo-badge">
            <AlertTriangle size={12} />
            Demo data only
          </span>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content" id="main-content">
        {children}
      </main>
    </div>
  );
}

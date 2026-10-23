import { useState, useEffect } from 'react';
import AppShell, { type Page } from '../components/AppShell';
import DashboardPage from '../pages/DashboardPage';
import FollowUpsPage from '../pages/FollowUpsPage';
import MemberViewPage from '../pages/MemberViewPage';
import AboutSafetyPage from '../pages/AboutSafetyPage';
import { localStorageRepository, ensureSeeded } from '../features/follow-ups/localStorageRepository';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');

  // Seed demo data on first load
  useEffect(() => {
    ensureSeeded();
  }, []);

  const repo = localStorageRepository;

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage repo={repo} onNavigate={setPage as (p: 'follow-ups') => void} />;
      case 'follow-ups':
        return <FollowUpsPage repo={repo} />;
      case 'member-view':
        return <MemberViewPage repo={repo} />;
      case 'about-safety':
        return <AboutSafetyPage />;
      default:
        return <DashboardPage repo={repo} onNavigate={setPage as (p: 'follow-ups') => void} />;
    }
  };

  return (
    <AppShell currentPage={page} onNavigate={setPage}>
      {renderPage()}
    </AppShell>
  );
}

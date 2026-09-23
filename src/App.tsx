import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './components/pages/auth/LoginPage';

import { DashboardPage } from './components/pages/dashboard/DashboardPage';
import { RoomsPage } from './components/pages/rooms/RoomsPage';
import { DevicesPage } from './components/pages/devices/DevicesPage';
import { ShareDashboardPage } from './components/pages/share/ShareDashboardPage';
import { AskAIPage } from './components/pages/ai/AskAIPage';
import { AlertsPage } from './components/pages/alerts/AlertsPage';
import { ThresholdsPage } from './components/pages/thresholds/ThresholdsPage';
import { UsersPage } from './components/pages/users/UsersPage';
import { PreferencesPage } from './components/pages/preferences/PreferencesPage';

const PageRenderer: React.FC = () => {
  const { activeRoute } = useApp();

  switch (activeRoute) {
    case 'dashboard':
      return <DashboardPage />;
    case 'rooms':
      return <RoomsPage />;
    case 'devices':
      return <DevicesPage />;
    case 'share':
      return <ShareDashboardPage />;
    case 'ask-ai':
      return <AskAIPage />;
    case 'alerts':
      return <AlertsPage />;
    case 'thresholds':
      return <ThresholdsPage />;
    case 'users':
      return <UsersPage />;
    case 'preferences':
      return <PreferencesPage />;
    default:
      return <DashboardPage />;
  }
};

const MainContent: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppShell>
      <PageRenderer />
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;

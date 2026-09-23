import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Menu, ChevronDown } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const {
    activeRoute,
    alerts,
    setIsNotificationOpen,
    setIsMobileSidebarOpen,
    setActiveRoute,
  } = useApp();

  const openAlertsCount = alerts.filter((a) => a.status === 'open').length;

  const pageTitles: Record<string, string> = {
    dashboard: 'Air Quality Dashboard',
    rooms: 'Rooms',
    devices: 'Devices',
    share: 'Share dashboards',
    'ask-ai': 'SmartEco Assistant',
    alerts: 'Alerts',
    thresholds: 'Alerts Thresholds',
    users: 'User Access Management',
    preferences: 'Preferences',
  };

  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-teal-100/50 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-white/60"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title */}
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {pageTitles[activeRoute] || 'Air Quality Dashboard'}
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationOpen(true)}
          className="relative p-2 text-slate-600 hover:text-[#217C70] rounded-xl hover:bg-white/80 transition-colors"
          title="Notifications & Alerts"
        >
          <Bell className="w-5 h-5" />
          {openAlertsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white">
              {openAlertsCount}
            </span>
          )}
        </button>

        {/* User Profile Control */}
        <div
          onClick={() => setActiveRoute('preferences')}
          className="flex items-center gap-2.5 pl-3 border-l border-teal-100/60 cursor-pointer hover:opacity-90 select-none"
        >
          <div className="w-8 h-8 rounded-full bg-teal-100 text-[#217C70] font-black flex items-center justify-center text-xs border border-teal-200/60 shadow-2xs">
            P
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-xs font-bold text-slate-800">Pujitha</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

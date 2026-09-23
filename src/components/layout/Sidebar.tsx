import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  Cpu,
  Share2,
  Sparkles,
  AlertTriangle,
  Sliders,
  Users,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import SmartEcoWhiteLogo from '../../assets/SmartEco-white-logo.png';

interface NavItemDef {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const {
    activeRoute,
    setActiveRoute,
    alerts,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    logout,
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const openAlertsCount = alerts.filter((a) => a.status === 'open').length;

  const mainNavItems: NavItemDef[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms', label: 'Rooms', icon: Building2 },
    { id: 'devices', label: 'Devices', icon: Cpu },
    { id: 'share', label: 'Share dashboard', icon: Share2 },
    { id: 'ask-ai', label: 'Ask AI', icon: Sparkles },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: openAlertsCount > 0 ? openAlertsCount : undefined },
    { id: 'thresholds', label: 'Thresholds', icon: Sliders },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const handleNavClick = (id: string) => {
    setActiveRoute(id);
    setIsMobileSidebarOpen(false);
  };

  const handleSignOut = () => {
    logout();
  };

  const content = (
    <div
      className={`flex flex-col h-full bg-[#217C70] text-white border-r border-[#196359] select-none transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header / Logo + Circular Glass Toggle Button */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between min-h-[72px]">
        {!isCollapsed ? (
          <>
            <div className="flex items-center overflow-hidden">
              <img
                src={SmartEcoWhiteLogo}
                alt="SmartEco Logo"
                className="h-9 w-auto object-contain"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {/* Circular Glass Collapse Button beside Logo */}
              <button
                onClick={() => setIsCollapsed(true)}
                title="Collapse Sidebar"
                className="hidden md:flex w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/35 hover:scale-105 active:scale-95 transition-all items-center justify-center shadow-md shadow-black/10 shrink-0 group cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* Mobile close button */}
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="md:hidden p-1 text-teal-100 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center justify-center gap-2 py-1">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-black text-white text-xs shadow-inner">
              SE
            </div>

            {/* Circular Glass Expand Button beside Logo */}
            <button
              onClick={() => setIsCollapsed(false)}
              title="Expand Sidebar"
              className="hidden md:flex w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/35 hover:scale-105 active:scale-95 transition-all items-center justify-center shadow-md shadow-black/10 shrink-0 group cursor-pointer mt-1"
            >
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0 py-3' : 'justify-between px-4 py-3'
              } rounded-2xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg shadow-black/10'
                  : 'text-teal-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-teal-100/70 group-hover:text-white'
                  }`}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </div>

              {!isCollapsed && item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                    isActive ? 'bg-white text-[#217C70]' : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Navigation & Profile */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {/* User Card */}
        <div
          className={`flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'gap-3 px-3.5 py-3'
          } rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xs`}
          title={isCollapsed ? 'Pujitha (pujitha@smarteco.io)' : undefined}
        >
          <div className="w-9 h-9 rounded-full bg-white/20 text-white font-black flex items-center justify-center text-xs shrink-0 border border-white/30">
            P
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">Pujitha</span>
              <span className="text-[10px] text-teal-100/70 truncate">pujitha@smarteco.io</span>
            </div>
          )}
        </div>

        {/* Preferences */}
        <button
          onClick={() => handleNavClick('preferences')}
          title={isCollapsed ? 'Preferences' : undefined}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3.5 py-2.5'
          } rounded-xl text-xs font-semibold transition-all ${
            activeRoute === 'preferences'
              ? 'bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold'
              : 'text-teal-100/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Settings className={`w-4 h-4 ${activeRoute === 'preferences' ? 'text-white' : 'text-teal-100/70'}`} />
          {!isCollapsed && <span>Preferences</span>}
        </button>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          title={isCollapsed ? 'Sign Out' : undefined}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3.5 py-2.5'
          } rounded-xl text-xs font-semibold text-teal-100/80 hover:text-rose-200 hover:bg-rose-500/20 transition-all`}
        >
          <LogOut className="w-4 h-4 text-teal-100/70" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

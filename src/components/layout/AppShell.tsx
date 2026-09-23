import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { NotificationDrawer } from './NotificationDrawer';
import { ToastContainer } from '../common/ToastContainer';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#F4F7F6] text-slate-900 selection:bg-[#217C70] selection:text-white flex overflow-x-hidden">
      {/* Soft Ambient Background Mesh Objects for Glassmorphism Reflections */}
      <div className="fixed top-[-10%] left-[-5%] w-[45vw] h-[45vw] bg-teal-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-emerald-100/40 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed top-[30%] right-[20%] w-[25vw] h-[25vw] bg-sky-100/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1700px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Slide-out Drawers & System Toasts */}
      <NotificationDrawer />
      <ToastContainer />
    </div>
  );
};

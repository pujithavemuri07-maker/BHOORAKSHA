import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DEOSidebar } from './DEOSidebar';
import { DEOHeader } from './DEOHeader';

export const DEOLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Fixed Sidebar */}
      <DEOSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <DEOHeader onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Dynamic Page Routed Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

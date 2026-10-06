import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { GISHeader } from './GISHeader';
import { GISSidebar } from './GISSidebar';

export const GISLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans lg:grid lg:grid-cols-[16rem_1fr] flex flex-col">
      {/* Desktop Sidebar: Grid Column 1 (16rem/256px), in normal layout flow */}
      <div className="hidden lg:block h-screen overflow-y-auto border-r border-slate-800 bg-slate-950">
        <GISSidebar />
      </div>

      {/* Mobile / Tablet Off-Canvas Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 w-64 max-w-xs h-full bg-slate-950 shadow-2xl border-r border-slate-800">
            <GISSidebar onCloseMobile={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area: Grid Column 2 (1fr), NEVER renders underneath sidebar */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <GISHeader onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default GISLayout;

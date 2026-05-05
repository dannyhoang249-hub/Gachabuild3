'use client';

import { useState } from 'react';
import GlobalSidebar from './GlobalSidebar';
import ModernHeader from './ModernHeader';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <ModernHeader />

      <div className="app-layout">
        {/* Global Sidebar */}
        <div className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <GlobalSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content Area */}
        <main className="app-main">
          <div className="max-w-screen-xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

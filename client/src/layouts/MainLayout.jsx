import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { Topbar } from '../components/Sidebar';

/**
 * Main application layout
 * Contains the sidebar + main content area
 * Mobile: sidebar slides in from left with overlay
 * Desktop: sidebar always visible
 */
export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar  = useCallback(() => setSidebarOpen(true),  []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <>
      {/* Animated background blobs */}
      <div className="animated-bg" aria-hidden="true" />

      {/* Sidebar — receives isOpen to apply/remove .open CSS class */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main content — shifted right on desktop */}
      <div className="main-content">
        {/* Mobile top bar with hamburger */}
        <Topbar onMenuClick={openSidebar} />

        {/* Page content */}
        <main className="py-6">
          <Outlet />
        </main>
      </div>
    </>
  );
}

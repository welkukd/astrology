'use client';

import { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={cn('min-h-screen bg-bg-primary', className)}>
      {/* Navbar - Fixed at top */}
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content Area */}
        <main
          className={cn(
            'flex-1 min-w-0 transition-all duration-300 ease-out-expo',
            'lg:ml-64', // Default sidebar width
            'pt-16', // Account for fixed navbar
            'pb-20', // Account for bottom nav on mobile
          )}
          style={{ maxWidth: 'calc(1440px - 16rem)' }} // 1440px max minus sidebar
        >
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer className="lg:ml-64" style={{ maxWidth: 'calc(1440px - 16rem)' }} />
    </div>
  );
}
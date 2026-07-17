'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Star, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/app/providers';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { session, supabase } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setMobileOpen(false);
  };

  const isHome = pathname === '/';

  const navLink = (href: string, label: string, icon?: React.ReactNode) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          active
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Star className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Astrology Assistant
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {session && (
              <>
                {navLink('/dashboard', 'Dashboard', <LayoutDashboard className="h-4 w-4" />)}
                {navLink('/chart/new', 'New Chart', <Moon className="h-4 w-4" />)}
              </>
            )}
            {!session && (
              <>
                {navLink('/chart/new', 'Get Your Chart', <Moon className="h-4 w-4" />)}
                {navLink('/methodology', 'Methodology')}
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2">
          {session && (
            <>
              {navLink('/dashboard', 'Dashboard', <LayoutDashboard className="h-4 w-4" />)}
              {navLink('/chart/new', 'New Chart', <Moon className="h-4 w-4" />)}
            </>
          )}
          {!session && (
            <>
              {navLink('/chart/new', 'Get Your Chart', <Moon className="h-4 w-4" />)}
              {navLink('/methodology', 'Methodology')}
            </>
          )}
          {session ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

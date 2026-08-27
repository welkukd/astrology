'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, LayoutDashboard, BookOpen, Zap, Heart, UserPlus, Menu, X, LogOut, Crown, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/app/providers';
import { cn } from '@/lib/utils';

const navigationItems = [
  { href: '/dashboard/astrology', label: 'Astrology', icon: Sparkles },
  { href: '/dashboard/tarot', label: 'Tarot', icon: BookOpen },
  { href: '/dashboard/guide', label: 'AI Guide', icon: Heart },
  { href: '/dashboard/humandesign', label: 'Human Design', icon: Crown },
  { href: '/dashboard/library', label: 'Library', icon: LayoutDashboard },
];

const publicNavigationItems = [
  { href: '/chart/new', label: 'Get Your Chart', icon: Moon },
  { href: '/methodology', label: 'Methodology', icon: Sparkles },
];

const bottomNavItems = [
  { href: '/dashboard/astrology', label: 'Astrology', icon: Sparkles },
  { href: '/dashboard/tarot', label: 'Tarot', icon: BookOpen },
  { href: '/dashboard/guide', label: 'Guide', icon: Heart },
  { href: '/dashboard/humandesign', label: 'Design', icon: Crown },
  { href: '/dashboard/library', label: 'Library', icon: LayoutDashboard },
];

const publicBottomNavItems = [
  { href: '/chart/new', label: 'Chart', icon: Moon },
  { href: '/tarot', label: 'Tarot', icon: BookOpen },
  { href: '/guide', label: 'Guide', icon: Heart },
  { href: '/humandesign', label: 'Design', icon: Crown },
  { href: '/methodology', label: 'Method', icon: Sparkles },
];

export function Navbar() {
  const pathname = usePathname();
  const { session, supabase } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setMobileOpen(false);
  };

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href + '/'));

  const navLink = (href: string, label: string, Icon?: React.ComponentType<{ className?: string }>) => {
    const active = isActive(href);
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-sm text-body-sm font-normal transition-all duration-150',
          active
            ? 'text-accent-gold bg-accent-gold-muted'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
        )}
        aria-current={active ? 'page' : undefined}
      >
        {Icon && <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />}
        <span>{label}</span>
      </Link>
    );
  };

  const bottomNavLink = (item: typeof bottomNavItems[0]) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex flex-col items-center gap-1 px-3 py-2 rounded-sm transition-all duration-150 min-w-[60px]',
          active
            ? 'text-accent-gold'
            : 'text-text-muted hover:text-text-primary'
        )}
        aria-current={active ? 'page' : undefined}
        aria-label={item.label}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
        <span className="text-caption font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50" style={{
      backgroundColor: 'rgba(15, 16, 18, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <span className="text-heading-3 font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                Astrology Assistant
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {session ? (
              <>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return navLink(item.href, item.label, Icon);
                })}
              </>
            ) : (
              <>
                {publicNavigationItems.map((item) => {
                  const Icon = item.icon;
                  return navLink(item.href, item.label, Icon);
                })}
              </>
            )}
          </div>

          {/* Desktop CTA / Auth Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {session ? (
              <>
                {/* User indicator */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-sm text-body-sm text-text-muted">
                  <span className="w-2 h-2 rounded-full bg-success" aria-hidden="true" />
                  Signed in
                </div>
                <button
                  onClick={handleSignOut}
                  className="btn-ghost"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="btn-primary"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 rounded-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden border-t py-4 space-y-2"
            style={{ borderColor: 'var(--border-subtle)' }}
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1">
              {session ? (
                navigationItems.map((item) => {
                  const Icon = item.icon;
                  return navLink(item.href, item.label, Icon);
                })
              ) : (
                publicNavigationItems.map((item) => {
                  const Icon = item.icon;
                  return navLink(item.href, item.label, Icon);
                })
              )}
            </div>

            <div className="pt-4 space-y-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="w-full btn-ghost justify-start"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="w-full btn-primary justify-center"
                  onClick={() => setMobileOpen(false)}
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Get Started
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Bottom Navigation (Mobile < 640px) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t px-2 py-1.5" style={{
          backgroundColor: 'rgba(15, 16, 18, 0.98)',
          backdropFilter: 'blur(20px)',
          borderColor: 'var(--border-subtle)',
        }} role="navigation" aria-label="Bottom navigation">
          <div className="flex items-center justify-around max-w-[1440px] mx-auto">
            {(session ? bottomNavItems : publicBottomNavItems).map(bottomNavLink)}
          </div>
        </div>
      </div>
    </nav>
  );
}
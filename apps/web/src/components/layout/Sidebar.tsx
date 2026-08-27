'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, Heart, Crown, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { href: '/dashboard/astrology', label: 'Astrology', icon: Sparkles, description: 'Birth charts & transits' },
  { href: '/dashboard/tarot', label: 'Tarot', icon: BookOpen, description: 'Card readings & spreads' },
  { href: '/dashboard/guide', label: 'AI Guide', icon: Heart, description: 'Personal guidance' },
  { href: '/dashboard/humandesign', label: 'Human Design', icon: Crown, description: 'Bodygraph & strategy' },
  { href: '/dashboard/library', label: 'Library', icon: LayoutDashboard, description: 'Saved readings' },
];

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href + '/'));

  const handleKeyDown = (e: React.KeyboardEvent, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = href;
    }
  };

  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm"
          onClick={() => onToggle?.()}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-out-expo',
          'border-r',
          collapsed ? 'w-16' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--border-subtle)',
        }}
        aria-label="Main navigation"
      >
        {/* Logo & Collapse Toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <Link href="/dashboard/astrology" className="flex items-center gap-2" aria-label="Astrology Assistant Home">
            <span className="h-8 w-8 text-accent-gold flex-shrink-0" aria-hidden="true">★</span>
            {!collapsed && (
              <span className="text-heading-3 font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                Astrology Assistant
              </span>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex items-center justify-center p-1.5 rounded-sm transition-colors',
              'text-text-muted hover:text-text-primary hover:bg-bg-hover',
              collapsed && 'rotate-180'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto" role="navigation" aria-label="Dashboard sections">
          <ul className="space-y-1" role="list">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onKeyDown={(e) => handleKeyDown(e, item.href)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-150',
                      'group relative overflow-hidden',
                      active
                        ? 'text-accent-gold bg-accent-gold-muted'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover',
                      collapsed && 'justify-center'
                    )}
                    aria-current={active ? 'page' : undefined}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    {!collapsed && (
                      <div className="flex-1 min-w-0 text-left">
                        <span className="block text-body-sm font-medium truncate">{item.label}</span>
                        <span className="block text-caption text-text-subtle truncate">{item.description}</span>
                      </div>
                    )}
                    {active && !collapsed && (
                      <span className="absolute right-2 w-0.5 h-6 bg-accent-gold rounded-r-full" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Section - User Info / Upgrade */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          {!collapsed && (
            <div className="space-y-3">
              <Link
                href="/pricing"
                className="btn-secondary w-full justify-center text-body-sm py-2.5"
              >
                <Crown className="h-4 w-4" aria-hidden="true" />
                Upgrade to Pro
              </Link>
              <div className="text-caption text-text-subtle text-center">
                Private spiritual toolkit
              </div>
            </div>
          )}
          {collapsed && (
            <div className="text-center">
              <Link
                href="/pricing"
                className="btn-secondary p-2 rounded-sm"
                title="Upgrade to Pro"
                aria-label="Upgrade to Pro"
              >
                <Crown className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
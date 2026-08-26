'use client';

import Link from 'next/link';
import { Moon, Sparkles, BookOpen, Heart, Crown, LayoutDashboard, Github, Twitter, Mail, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const footerLinks = {
  pillars: [
    { href: '/dashboard/astrology', label: 'Astrology', icon: Sparkles },
    { href: '/dashboard/tarot', label: 'Tarot', icon: BookOpen },
    { href: '/dashboard/guide', label: 'AI Guide', icon: Heart },
    { href: '/dashboard/humandesign', label: 'Human Design', icon: Crown },
    { href: '/dashboard/library', label: 'Library', icon: LayoutDashboard },
  ],
  resources: [
    { href: '/methodology', label: 'Methodology' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/disclaimer', label: 'Disclaimer' },
    { href: '/about', label: 'About' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
    { href: '/disclaimer', label: 'Disclaimer' },
  ],
  social: [
    { href: 'https://github.com', label: 'GitHub', icon: Github, external: true },
    { href: 'https://twitter.com', label: 'Twitter', icon: Twitter, external: true },
    { href: 'mailto:hello@gaia.app', label: 'Email', icon: Mail, external: true },
  ],
};

interface FooterProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Footer({ className, style }: FooterProps) {
  return (
    <footer
      className={cn('border-t py-8 lg:py-12 px-4 sm:px-6 lg:px-8', className)}
      style={{
        backgroundColor: 'var(--bg-panel)',
        borderColor: 'var(--border-subtle)',
        ...style,
      }}
      role="contentinfo"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8 mb-8 lg:mb-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2" aria-label="Gaia Home">
              <Moon className="h-8 w-8 text-accent-gold" aria-hidden="true" />
              <span className="text-heading-3 font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                Gaia
              </span>
            </Link>
            <p className="text-body-sm text-text-muted leading-relaxed max-w-xs">
              Private spiritual toolkit. Birth charts, tarot, AI guidance, and Human Design — all in one place. No tracking, no noise.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {footerLinks.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-text-muted hover:text-accent-gold transition-colors"
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">{item.external ? `${item.label} (opens in new tab)` : item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Pillars Column */}
          <nav className="space-y-3" aria-label="Pillars">
            <h3 className="text-label font-semibold text-text-primary">Pillars</h3>
            <ul className="space-y-2" role="list">
              {footerLinks.pillars.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 text-body-sm text-text-secondary hover:text-accent-gold transition-colors"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Resources Column */}
          <nav className="space-y-3" aria-label="Resources">
            <h3 className="text-label font-semibold text-text-primary">Resources</h3>
            <ul className="space-y-2" role="list">
              {footerLinks.resources.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Column */}
          <nav className="space-y-3" aria-label="Legal">
            <h3 className="text-label font-semibold text-text-primary">Legal</h3>
            <ul className="space-y-2" role="list">
              {footerLinks.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="divider-subtle mb-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-caption text-text-subtle text-center sm:text-left">
            © {new Date().getFullYear()} Gaia. Private spiritual toolkit. For entertainment and reflection only.
          </p>

          <div className="flex items-center gap-4 text-caption text-text-subtle">
            <span>Not medical, legal, or financial advice.</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </div>
        </div>
      </div>
    </footer>
  );
}
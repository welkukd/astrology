'use client';

import { Sparkles, Brain, BookOpen, Flame, Cloud, Zap, Moon, Heart, Plus, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { GoldTriangle } from '@/components/ui/GoldTriangle';

interface QuickActionItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  badge?: string;
}

const quickActions: QuickActionItem[] = [
  {
    id: 'daily-tarot',
    label: 'Daily Tarot',
    description: 'Draw your card for today',
    icon: <Sparkles className="h-5 w-5" />,
    href: '/dashboard/tarot',
  },
  {
    id: 'meditation',
    label: 'Meditation',
    description: 'Guided sessions & timer',
    icon: <Brain className="h-5 w-5" />,
    href: '/dashboard/guide/meditation',
  },
  {
    id: 'dream-journal',
    label: 'Dream Journal',
    description: 'Record & interpret dreams',
    icon: <Cloud className="h-5 w-5" />,
    href: '/dashboard/guide/dream',
  },
  {
    id: 'habits',
    label: 'Habits',
    description: 'Track daily practices',
    icon: <Flame className="h-5 w-5" />,
    href: '/dashboard/guide/habits',
  },
  {
    id: 'library',
    label: 'Library',
    description: 'Saved readings & entries',
    icon: <BookOpen className="h-5 w-5" />,
    href: '/dashboard/guide/library',
  },
  {
    id: 'ask-guide',
    label: 'Ask the Guide',
    description: 'AI spiritual guidance',
    icon: <Zap className="h-5 w-5" />,
    onClick: () => window.location.href = '/dashboard/guide?tab=chat',
    variant: 'primary',
    badge: 'AI',
  },
];

export function QuickActions({ className }: { className?: string }) {
  return (
    <section aria-labelledby="quick-actions-heading" className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 mb-4">
        <GoldTriangle orientation="down" size="sm" aria-hidden="true" />
        <h2 id="quick-actions-heading" className="text-heading-3 font-display font-medium text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
          Quick Actions
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant || 'secondary'}
            size="lg"
            className={cn(
              'h-28 flex flex-col items-center justify-center gap-3 text-left',
              'hover:shadow-card-hover transition-all duration-300 ease-out-expo'
            )}
            onClick={action.onClick}
            asChild={!!action.href}
          >
            {action.href ? (
              <a href={action.href} className="w-full h-full flex flex-col items-center justify-center gap-3 text-left">
                <div className="flex items-center gap-2 w-full justify-center">
                  <span className="p-2 rounded-lg bg-accent-gold/15 text-accent-gold">
                    {action.icon}
                  </span>
                  {action.badge && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-accent-gold text-bg-primary">
                      {action.badge}
                    </span>
                  )}
                </div>
                <div className="w-full text-center">
                  <span className="font-medium text-body-lg">{action.label}</span>
                  <p className="text-caption text-text-muted">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-text-muted self-end opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </a>
            ) : (
              <>
                <div className="flex items-center gap-2 w-full justify-center">
                  <span className="p-2 rounded-lg bg-accent-gold/15 text-accent-gold">
                    {action.icon}
                  </span>
                  {action.badge && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-accent-gold text-bg-primary">
                      {action.badge}
                    </span>
                  )}
                </div>
                <div className="w-full text-center">
                  <span className="font-medium text-body-lg">{action.label}</span>
                  <p className="text-caption text-text-muted">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-text-muted self-end opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </>
            )}
          </Button>
        ))}
      </div>
    </section>
  );
}
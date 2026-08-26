'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Heart, Sparkles, Flame, Cloud, CheckCircle, Clock, Brain, Bed, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GoldTriangle } from '@/components/ui/GoldTriangle';
import { Badge } from '@/components/ui/Badge';
import { Divider } from '@/components/ui/Divider';

interface DailyPracticeData {
  tarot: {
    card?: string;
    drawn: boolean;
    guidance?: string;
  };
  meditation: {
    type?: string;
    completed: boolean;
    duration?: number;
    streak: number;
  };
  habit: {
    name?: string;
    completed: boolean;
    streak: number;
    target: number;
  };
  dream: {
    recorded: boolean;
    lucid: boolean;
    quality?: number;
  };
}

const DEFAULT_PRACTICE: DailyPracticeData = {
  tarot: { drawn: false },
  meditation: { completed: false, streak: 0 },
  habit: { completed: false, streak: 0, target: 1 },
  dream: { recorded: false, lucid: false },
};

const STORAGE_KEY = 'gaia-daily-practice';

export function DailyPracticeCard({ onQuickAction }: { onQuickAction?: (action: string) => void }) {
  const [practice, setPractice] = useState<DailyPracticeData>(DEFAULT_PRACTICE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setPractice(JSON.parse(stored));
        } catch {
          setPractice(DEFAULT_PRACTICE);
        }
      }
      setHydrated(true);
    }
  }, []);

  const updatePractice = (updates: Partial<DailyPracticeData>) => {
    const newPractice = { ...practice, ...updates };
    setPractice(newPractice);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPractice));
    }
  };

  const toggleTarot = () => {
    updatePractice({
      tarot: { ...practice.tarot, drawn: !practice.tarot.drawn, card: practice.tarot.drawn ? undefined : 'The Star' },
    });
    onQuickAction?.('tarot');
  };

  const toggleMeditation = () => {
    updatePractice({
      meditation: { ...practice.meditation, completed: !practice.meditation.completed, streak: practice.meditation.completed ? practice.meditation.streak : practice.meditation.streak + 1 },
    });
    onQuickAction?.('meditation');
  };

  const toggleHabit = () => {
    updatePractice({
      habit: { ...practice.habit, completed: !practice.habit.completed, streak: practice.habit.completed ? practice.habit.streak : practice.habit.streak + 1 },
    });
    onQuickAction?.('habit');
  };

  const toggleDream = () => {
    updatePractice({
      dream: { ...practice.dream, recorded: !practice.dream.recorded },
    });
    onQuickAction?.('dream');
  };

  if (!hydrated) {
    return (
      <Card variant="elevated" padding="xl" className="animate-pulse">
        <div className="space-y-6">
          <div className="h-8 w-1/4 bg-bg-hover rounded-md" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-bg-hover rounded-lg" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const sections = [
    {
      id: 'tarot',
      icon: Sparkles,
      label: 'Tarot',
      subtitle: 'Daily Draw',
      completed: practice.tarot.drawn,
      onClick: toggleTarot,
      color: 'text-accent-gold',
      bgColor: 'bg-accent-gold-muted',
      detail: practice.tarot.card ? `Drawn: ${practice.tarot.card}` : 'Draw your card',
    },
    {
      id: 'meditation',
      icon: Brain,
      label: 'Meditation',
      subtitle: `${practice.meditation.duration || 10} min`,
      completed: practice.meditation.completed,
      onClick: toggleMeditation,
      streak: practice.meditation.streak,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/15',
      detail: practice.meditation.completed ? `Streak: ${practice.meditation.streak}d` : 'Begin session',
    },
    {
      id: 'habit',
      icon: Flame,
      label: 'Habit',
      subtitle: practice.habit.name || 'Daily Practice',
      completed: practice.habit.completed,
      onClick: toggleHabit,
      streak: practice.habit.streak,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/15',
      detail: practice.habit.completed ? `Streak: ${practice.habit.streak}d` : 'Mark complete',
    },
    {
      id: 'dream',
      icon: Cloud,
      label: 'Dream',
      subtitle: 'Journal',
      completed: practice.dream.recorded,
      onClick: toggleDream,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/15',
      detail: practice.dream.recorded ? (practice.dream.lucid ? 'Lucid recorded' : `Quality: ${practice.dream.quality || '—'}/5`) : 'Record dream',
    },
  ];

  return (
    <Card variant="elevated" padding="xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <GoldTriangle orientation="down" size="lg" aria-hidden="true" />
          <h2 className="text-heading-2 font-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Daily Practice
          </h2>
        </div>
        <div className="flex items-center gap-2 text-caption text-text-muted">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-gold" aria-hidden="true" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Four Practice Sections */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={section.onClick}
            className={cn(
              'relative p-5 rounded-xl transition-all duration-300 ease-out-expo',
              'border border-border-subtle bg-bg-card',
              'hover:border-border-standard hover:shadow-card-hover',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
              section.completed ? 'opacity-70' : '',
              'touch-target min-h-[140px]'
            )}
            aria-pressed={section.completed}
          >
            {/* Icon */}
            <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center mb-4', section.bgColor)}>
              <section.icon className={cn('h-6 w-6', section.color)} aria-hidden="true" />
            </div>

            {/* Content */}
            <div className="space-y-1">
              <h3 className="text-heading-3 font-display font-medium text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                {section.label}
              </h3>
              <p className="text-body-sm text-text-muted">{section.subtitle}</p>
            </div>

            {/* Status Indicator */}
            <div className="absolute top-4 right-4">
              {section.completed ? (
                <CheckCircle className="h-5 w-5 text-success" aria-hidden="true" />
              ) : (
                <span className="text-caption text-text-subtle">Tap to start</span>
              )}
            </div>

            {/* Streak Badge */}
            {section.streak !== undefined && section.streak > 0 && (
              <div className="absolute bottom-4 left-4">
                <Badge variant="subtle" className="gap-1">
                  <Flame className="h-3 w-3 text-orange-400" aria-hidden="true" />
                  {section.streak}d
                </Badge>
              </div>
            )}

            {/* Detail */}
            <p className="mt-3 text-caption text-text-subtle">{section.detail}</p>
          </button>
        ))}
      </div>

      {/* Progress Summary */}
      <Divider className="my-6" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {sections.filter(s => s.completed).length > 0 && (
            <>
              <span className="text-body-md font-medium text-text-primary">
                {sections.filter(s => s.completed).length}/4 completed
              </span>
              <div className="hidden sm:flex items-center gap-1.5 h-2">
                {sections.map((s, i) => (
                  <div
                    key={s.id}
                    className={cn(
                      'flex-1 rounded transition-colors',
                      s.completed ? 'bg-accent-gold' : 'bg-border-subtle'
                    )}
                    style={{ height: '6px' }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {sections.filter(s => s.completed).length === 4 && (
          <Badge variant="gold" className="animate-pulse-gold">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Practice Complete
          </Badge>
        )}
      </div>
    </Card>
  );
}
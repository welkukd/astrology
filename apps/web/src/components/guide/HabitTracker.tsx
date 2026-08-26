'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Flame, Check, ChevronLeft, ChevronRight, Trash2, Edit, Target, Calendar, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GoldTriangle } from '@/components/ui/GoldTriangle';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { CreateHabitModal } from './CreateHabitModal';

interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'custom';
  target: number; // times per period
  color: string;
  createdAt: number;
  completions: Record<string, boolean>; // date string -> completed
  streak: number;
  bestStreak: number;
}

const CATEGORIES = [
  { value: 'mindfulness', label: 'Mindfulness', color: 'bg-blue-500', icon: 'Brain' },
  { value: 'movement', label: 'Movement', color: 'bg-green-500', icon: 'Activity' },
  { value: 'sleep', label: 'Sleep', color: 'bg-purple-500', icon: 'Moon' },
  { value: 'nutrition', label: 'Nutrition', color: 'bg-orange-500', icon: 'Apple' },
  { value: 'learning', label: 'Learning', color: 'bg-indigo-500', icon: 'BookOpen' },
  { value: 'creative', label: 'Creative', color: 'bg-pink-500', icon: 'Palette' },
  { value: 'spiritual', label: 'Spiritual', color: 'bg-yellow-500', icon: 'Sparkles' },
  { value: 'other', label: 'Other', color: 'bg-gray-500', icon: 'MoreHorizontal' },
];

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom', label: 'Custom Days' },
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function HabitTracker({ onNewHabit }: { onNewHabit?: () => void }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gaia-habits');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Migrate old habits without streak/bestStreak
          const migrated = parsed.map((h: Habit) => ({
            ...h,
            streak: h.streak ?? 0,
            bestStreak: h.bestStreak ?? 0,
          }));
          setHabits(migrated);
        } catch {
          setHabits([]);
        }
      }
    }
  }, []);

  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gaia-habits', JSON.stringify(newHabits));
    }
  };

  const getWeekDates = (offset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (offset * 7));
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  const isToday = (dateStr: string) => {
    return dateStr === new Date().toISOString().split('T')[0];
  };

  const isFuture = (dateStr: string) => {
    return dateStr > new Date().toISOString().split('T')[0];
  };

  const toggleCompletion = (habitId: string, dateStr: string) => {
    if (isFuture(dateStr)) return;
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const newCompletions = { ...habit.completions, [dateStr]: !habit.completions[dateStr] };
      let newStreak = habit.streak;
      let newBestStreak = habit.bestStreak;
      
      // Recalculate streak
      let currentStreak = 0;
      const sortedDates = Object.keys(newCompletions).sort().reverse();
      const todayStr = new Date().toISOString().split('T')[0];
      
      for (const date of sortedDates) {
        if (newCompletions[date]) {
          currentStreak++;
        } else {
          break;
        }
      }
      newStreak = currentStreak;
      newBestStreak = Math.max(newBestStreak, newStreak);
      
      return { ...habit, completions: newCompletions, streak: newStreak, bestStreak: newBestStreak };
    }));
  };

  const handleCreateHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'streak' | 'bestStreak'>) => {
    const newHabit: Habit = {
      ...habit,
      id: `habit-${Date.now()}`,
      createdAt: Date.now(),
      completions: {},
      streak: 0,
      bestStreak: 0,
    };
    saveHabits([...habits, newHabit]);
    setShowCreateModal(false);
  };

  const handleUpdateHabit = (id: string, updates: Partial<Habit>) => {
    saveHabits(habits.map(h => h.id === id ? { ...h, ...updates } : h));
    setEditingHabit(null);
  };

  const handleDeleteHabit = (id: string) => {
    saveHabits(habits.filter(h => h.id !== id));
  };

  const getCategoryInfo = (categoryValue: string) => {
    return CATEGORIES.find(c => c.value === categoryValue) || CATEGORIES[CATEGORIES.length - 1];
  };

  const getCompletionRate = (habit: Habit) => {
    const weekCompletions = weekDates.filter(d => habit.completions[d]).length;
    return habit.frequency === 'daily' ? weekCompletions : weekCompletions;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <GoldTriangle orientation="down" size="lg" aria-hidden="true" />
          <h1 className="text-display font-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Habits
          </h1>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          New Habit
        </Button>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setWeekOffset(o => o - 1)} aria-label="Previous week">
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </Button>
        <div className="text-center">
          <p className="text-heading-3 font-display font-medium text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
            {weekDates[0] === weekDates[6] 
              ? new Date(weekDates[0]).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              : `${new Date(weekDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(weekDates[6]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
            }
          </p>
          {weekOffset !== 0 && (
            <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)}>
              This Week
            </Button>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={() => setWeekOffset(o => o + 1)} aria-label="Next week" disabled={weekOffset >= 0}>
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>

      {/* Habits Grid */}
      {habits.length === 0 ? (
        <Card variant="default" padding="xl" className="text-center py-16">
          <Target className="h-16 w-16 text-text-muted mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-heading-3 font-display font-medium text-text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            No habits yet
          </h3>
          <p className="text-body-md text-text-secondary mb-6">
            Create your first habit to start building daily practices.
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Create Habit
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => {
            const categoryInfo = getCategoryInfo(habit.category);
            const weekCompletions = weekDates.filter(d => habit.completions[d]).length;
            
            return (
              <Card key={habit.id} variant="hover" padding="default" className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', categoryInfo.color)}>
                      <Flame className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-heading-3 font-display font-medium text-text-primary truncate" style={{ fontFamily: 'var(--font-display)' }}>
                          {habit.name}
                        </h3>
                        <Badge variant="subtle" className="text-xs">{habit.frequency}</Badge>
                      </div>
                      <p className="text-caption text-text-muted truncate">{categoryInfo.label} • Target: {habit.target}/week</p>
                    </div>
                  </div>

                  {/* Weekly Heatmap */}
                  <div className="flex items-center gap-1 flex-shrink-0" role="img" aria-label={`Weekly progress for ${habit.name}`}>
                    {weekDates.map((date, dayIndex) => {
                      const completed = habit.completions[date];
                      const today = isToday(date);
                      const future = isFuture(date);
                      
                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => toggleCompletion(habit.id, date)}
                          disabled={future}
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                            'touch-target',
                            future && 'opacity-40 cursor-not-allowed',
                            completed
                              ? 'bg-accent-gold text-bg-primary shadow-gold-glow'
                              : today
                              ? 'bg-bg-hover border-2 border-accent-gold'
                              : 'bg-bg-panel border border-border-subtle hover:bg-bg-hover'
                          )}
                          aria-label={`${WEEK_DAYS[dayIndex]}: ${completed ? 'Completed' : 'Not completed'}`}
                          aria-pressed={completed}
                        >
                          {completed && <Check className="h-4 w-4" aria-hidden="true" />}
                          {!completed && !future && today && <span className="text-caption font-medium text-accent-gold">{WEEK_DAYS[dayIndex][0]}</span>}
                          {!completed && !future && !today && <span className="text-caption text-text-subtle">{WEEK_DAYS[dayIndex][0]}</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Streak & Actions */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1 text-caption">
                      <Flame className="h-3 w-3 text-orange-400" aria-hidden="true" />
                      <span className="font-medium text-text-primary">{habit.streak}</span>
                      <span className="text-text-muted">/</span>
                      <span className="font-medium text-text-muted">{habit.bestStreak}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditingHabit(habit)} aria-label="Edit habit">
                        <Edit className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteHabit(habit.id)} aria-label="Delete habit">
                        <Trash2 className="h-4 w-4 text-danger" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Stats Summary */}
      {habits.length > 0 && (
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <GoldTriangle orientation="down" size="sm" aria-hidden="true" />
            <h2 className="text-heading-3 font-display font-medium text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
              This Week
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4 bg-bg-panel rounded-lg">
              <p className="text-display font-mono font-semibold text-accent-gold" style={{ fontFamily: 'var(--font-mono)' }}>
                {habits.reduce((sum, h) => sum + weekDates.filter(d => h.completions[d]).length, 0)}
              </p>
              <p className="text-caption text-text-muted">Completions</p>
            </div>
            <div className="text-center p-4 bg-bg-panel rounded-lg">
              <p className="text-display font-mono font-semibold text-text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                {habits.filter(h => h.streak > 0).length}
              </p>
              <p className="text-caption text-text-muted">Active Streaks</p>
            </div>
            <div className="text-center p-4 bg-bg-panel rounded-lg">
              <p className="text-display font-mono font-semibold text-text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                {Math.round(habits.reduce((sum, h) => sum + (weekDates.filter(d => h.completions[d]).length / (h.frequency === 'daily' ? 7 : 1)), 0) / habits.length * 100) || 0}%
              </p>
              <p className="text-caption text-text-muted">Avg Completion</p>
            </div>
          </div>
        </Card>
      )}

      {/* Create Habit Modal */}
      <CreateHabitModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateHabit}
        initialData={editingHabit || undefined}
        onUpdate={editingHabit ? (data) => handleUpdateHabit(editingHabit.id, data) : undefined}
      />

      {/* Edit Habit Modal */}
      {editingHabit && (
        <CreateHabitModal
          isOpen={!!editingHabit}
          onClose={() => setEditingHabit(null)}
          onSubmit={() => {}}
          initialData={editingHabit}
          onUpdate={(data) => handleUpdateHabit(editingHabit.id, data)}
        />
      )}
    </div>
  );
}
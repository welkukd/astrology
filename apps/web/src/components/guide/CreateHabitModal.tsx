'use client';

import { useState, useEffect } from 'react';
import { Flame, Target, Calendar, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface HabitData {
  name: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'custom';
  target: number;
  customDays?: string[];
  color: string;
}

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<HabitData, 'id' | 'createdAt' | 'completions' | 'streak' | 'bestStreak'>) => void;
  initialData?: HabitData;
  onUpdate?: (data: Partial<HabitData>) => void;
}

const CATEGORIES = [
  { value: 'mindfulness', label: 'Mindfulness', color: 'bg-blue-500' },
  { value: 'movement', label: 'Movement', color: 'bg-green-500' },
  { value: 'sleep', label: 'Sleep', color: 'bg-purple-500' },
  { value: 'nutrition', label: 'Nutrition', color: 'bg-orange-500' },
  { value: 'learning', label: 'Learning', color: 'bg-indigo-500' },
  { value: 'creative', label: 'Creative', color: 'bg-pink-500' },
  { value: 'spiritual', label: 'Spiritual', color: 'bg-yellow-500' },
  { value: 'other', label: 'Other', color: 'bg-gray-500' },
];

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom', label: 'Custom Days' },
];

const WEEK_DAYS = [
  { value: '0', label: 'Sun' },
  { value: '1', label: 'Mon' },
  { value: '2', label: 'Tue' },
  { value: '3', label: 'Wed' },
  { value: '4', label: 'Thu' },
  { value: '5', label: 'Fri' },
  { value: '6', label: 'Sat' },
];

const COLOR_OPTIONS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
  'bg-indigo-500', 'bg-pink-500', 'bg-yellow-500', 'bg-red-500',
  'bg-teal-500', 'bg-cyan-500',
];

export function CreateHabitModal({ isOpen, onClose, onSubmit, initialData, onUpdate }: CreateHabitModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('mindfulness');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [target, setTarget] = useState(1);
  const [customDays, setCustomDays] = useState<string[]>(['1', '2', '3', '4', '5']); // Mon-Fri default
  const [color, setColor] = useState('bg-blue-500');
  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setCategory(initialData.category);
        setFrequency(initialData.frequency);
        setTarget(initialData.target);
        setCustomDays(initialData.customDays || ['1', '2', '3', '4', '5']);
        setColor(initialData.color);
      } else {
        setName('');
        setCategory('mindfulness');
        setFrequency('daily');
        setTarget(1);
        setCustomDays(['1', '2', '3', '4', '5']);
        setColor('bg-blue-500');
      }
    }
  }, [isOpen, initialData]);

  const handleToggleDay = (day: string) => {
    setCustomDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data: Omit<HabitData, 'id' | 'createdAt' | 'completions' | 'streak' | 'bestStreak'> = {
      name: name.trim(),
      category,
      frequency,
      target,
      customDays: frequency === 'custom' ? customDays : undefined,
      color,
    };

    if (isEditing && onUpdate) {
      onUpdate(data);
    } else {
      onSubmit(data);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={isEditing ? 'Edit Habit' : 'Create New Habit'}
      description="Build a consistent practice with tracking and streaks"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-6">
            {/* Name */}
            <Input
              label="Habit Name"
              placeholder="e.g., Morning Meditation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
            />

            {/* Category */}
            <div>
              <label className="label-base block mb-2">Category</label>
              <div className="grid gap-2 sm:grid-cols-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all',
                      'flex flex-col items-center gap-2 text-center',
                      category === cat.value
                        ? 'border-accent-gold bg-accent-gold/10'
                        : 'border-border-subtle hover:border-border-standard'
                    )}
                    aria-pressed={category === cat.value}
                  >
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', cat.color)}>
                      <Flame className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    <span className="text-caption font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <Select
              label="Frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly' | 'custom')}
              options={FREQUENCY_OPTIONS}
              placeholder="Select frequency"
            />

            {/* Target */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Target (times per period)"
                type="number"
                min="1"
                max="10"
                value={target}
                onChange={(e) => setTarget(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              />
              <div className="flex items-end">
                <label className="label-base block mb-2 w-full">Color</label>
                <div className="flex flex-wrap gap-2 w-full">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={cn(
                        'w-10 h-10 rounded-lg border-2 transition-all flex-shrink-0',
                        color === c ? 'border-accent-gold scale-110' : 'border-transparent hover:border-border-standard'
                      )}
                      aria-pressed={color === c}
                      aria-label={c.replace('bg-', '').replace('-500', '')}
                    >
                      <div className={cn('w-full h-full rounded-md', c)} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Days */}
            {frequency === 'custom' && (
              <div>
                <label className="label-base block mb-2">Days</label>
                <div className="flex gap-2 flex-wrap">
                  {WEEK_DAYS.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleToggleDay(day.value)}
                      className={cn(
                        'w-12 h-12 rounded-lg font-medium transition-all',
                        'touch-target',
                        customDays.includes(day.value)
                          ? 'bg-accent-gold text-bg-primary font-semibold shadow-gold-glow'
                          : 'bg-bg-panel border border-border-subtle text-text-muted hover:border-accent-gold hover:text-accent-gold'
                      )}
                      aria-pressed={customDays.includes(day.value)}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
                {customDays.length === 0 && (
                  <p className="text-caption text-danger mt-2">Select at least one day</p>
                )}
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!name.trim() || (frequency === 'custom' && customDays.length === 0)}>
            <Check className="h-4 w-4 mr-2" aria-hidden="true" />
            {isEditing ? 'Save Changes' : 'Create Habit'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
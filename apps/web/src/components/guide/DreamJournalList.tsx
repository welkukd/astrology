'use client';

import { useState, useEffect } from 'react';
import { Plus, Moon, Sun, Brain, Sparkles, ChevronRight, Edit, Trash2, Eye, EyeOff, Star, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GoldTriangle } from '@/components/ui/GoldTriangle';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { DreamEntryModal } from './DreamEntryModal';
import { DreamInterpretModal } from './DreamInterpretModal';

interface DreamEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  lucid: boolean;
  symbols: string[];
  emotions: string[];
  sleepQuality: number; // 1-5
  interpreted: boolean;
  interpretation?: string;
  createdAt: number;
}

const EMOTION_OPTIONS = [
  'Peaceful', 'Anxious', 'Joyful', 'Sad', 'Fearful', 'Curious',
  'Confused', 'Empowered', 'Vulnerable', 'Nostalgic', 'Angry', 'Grateful'
];

const SYMBOL_SUGGESTIONS = [
  'Water', 'Fire', 'Flying', 'Falling', 'Animals', 'Doors',
  'Keys', 'Mirrors', 'Stairs', 'Vehicles', 'Houses', 'Nature',
  'Numbers', 'Colors', 'People', 'Objects', 'Places', 'Time'
];

export function DreamJournalList({ onNewEntry }: { onNewEntry?: () => void }) {
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDream, setEditingDream] = useState<DreamEntry | null>(null);
  const [interpretingDream, setInterpretingDream] = useState<DreamEntry | null>(null);
  const [filter, setFilter] = useState<'all' | 'lucid' | 'interpreted'>('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gaia-dream-journal');
      if (stored) {
        try {
          setDreams(JSON.parse(stored));
        } catch {
          setDreams([]);
        }
      }
    }
  }, []);

  const saveDreams = (newDreams: DreamEntry[]) => {
    setDreams(newDreams);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gaia-dream-journal', JSON.stringify(newDreams));
    }
  };

  const handleCreateDream = (dream: Omit<DreamEntry, 'id' | 'createdAt' | 'interpreted'>) => {
    const newDream: DreamEntry = {
      ...dream,
      id: `dream-${Date.now()}`,
      createdAt: Date.now(),
      interpreted: false,
    };
    saveDreams([newDream, ...dreams]);
    setShowCreateModal(false);
  };

  const handleUpdateDream = (id: string, updates: Partial<DreamEntry>) => {
    saveDreams(dreams.map(d => d.id === id ? { ...d, ...updates } : d));
    setEditingDream(null);
  };

  const handleDeleteDream = (id: string) => {
    saveDreams(dreams.filter(d => d.id !== id));
  };

  const handleInterpret = (dream: DreamEntry) => {
    setInterpretingDream(dream);
  };

  const handleInterpretComplete = (dreamId: string, interpretation: string) => {
    saveDreams(dreams.map(d => 
      d.id === dreamId ? { ...d, interpreted: true, interpretation } : d
    ));
    setInterpretingDream(null);
  };

  const filteredDreams = dreams.filter(dream => {
    if (filter === 'lucid') return dream.lucid;
    if (filter === 'interpreted') return dream.interpreted;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <GoldTriangle orientation="down" size="lg" aria-hidden="true" />
          <h1 className="text-display font-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Dream Journal
          </h1>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          New Entry
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-bg-panel border border-border-subtle rounded-lg p-1" role="tablist">
        {[
          { value: 'all', label: 'All Dreams', icon: <Moon className="h-4 w-4" /> },
          { value: 'lucid', label: 'Lucid', icon: <Sun className="h-4 w-4" /> },
          { value: 'interpreted', label: 'Interpreted', icon: <Brain className="h-4 w-4" /> },
        ].map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={filter === tab.value}
            onClick={() => setFilter(tab.value as typeof filter)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
              filter === tab.value
                ? 'bg-accent-gold text-bg-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dream List */}
      {filteredDreams.length === 0 ? (
        <Card variant="default" padding="xl" className="text-center py-16">
          <Moon className="h-16 w-16 text-text-muted mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-heading-3 font-display font-medium text-text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {filter === 'all' ? 'No dreams recorded yet' : filter === 'lucid' ? 'No lucid dreams' : 'No interpreted dreams'}
          </h3>
          <p className="text-body-md text-text-secondary mb-6">
            {filter === 'all' 
              ? 'Start your dream journal to track patterns and receive AI interpretations.'
              : filter === 'lucid'
              ? 'Lucid dreams will appear here when you mark them as lucid.'
              : 'AI interpretations will appear here after you interpret a dream.'
            }
          </p>
          {filter === 'all' && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Record Your First Dream
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDreams.map((dream) => (
            <Card key={dream.id} variant="hover" padding="default" className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-heading-3 font-display font-medium text-text-primary truncate" style={{ fontFamily: 'var(--font-display)' }}>
                      {dream.title}
                    </h3>
                    {dream.lucid && (
                      <Badge variant="gold" className="flex items-center gap-1">
                        <Sun className="h-3 w-3" aria-hidden="true" />
                        Lucid
                      </Badge>
                    )}
                    {dream.interpreted && (
                      <Badge variant="subtle" className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        Interpreted
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-body-sm text-text-muted line-clamp-2 mb-3">{dream.content}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-caption text-text-muted">
                    <span className="flex items-center gap-1">
                      <Moon className="h-3 w-3" aria-hidden="true" />
                      {formatDate(dream.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" aria-hidden="true" />
                      Sleep: {dream.sleepQuality}/5
                    </span>
                    {dream.symbols.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        {dream.symbols.slice(0, 3).join(', ')}
                        {dream.symbols.length > 3 && <span>+{dream.symbols.length - 3}</span>}
                      </span>
                    )}
                    {dream.emotions.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" aria-hidden="true" />
                        {dream.emotions.slice(0, 2).join(', ')}
                        {dream.emotions.length > 2 && <span>+{dream.emotions.length - 2}</span>}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!dream.interpreted && (
                    <Button variant="ghost" size="sm" onClick={() => handleInterpret(dream)}>
                      <Sparkles className="h-4 w-4 mr-1" aria-hidden="true" />
                      Interpret
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => setEditingDream(dream)} aria-label="Edit dream">
                    <Edit className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteDream(dream.id)} aria-label="Delete dream">
                    <Trash2 className="h-4 w-4 text-danger" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              
              {dream.interpretation && (
                <div className="mt-4 p-4 bg-bg-panel rounded-lg border border-border-subtle">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-accent-gold" aria-hidden="true" />
                    <span className="label-base text-accent-gold">AI Interpretation</span>
                  </div>
                  <p className="text-body-sm text-text-secondary line-clamp-3">{dream.interpretation}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Dream Modal */}
      <DreamEntryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateDream}
        initialData={editingDream || undefined}
        onUpdate={editingDream ? (data) => handleUpdateDream(editingDream.id, data) : undefined}
      />

      {/* Edit Dream Modal */}
      {editingDream && (
        <DreamEntryModal
          isOpen={!!editingDream}
          onClose={() => setEditingDream(null)}
          onSubmit={() => {}}
          initialData={editingDream}
          onUpdate={(data) => handleUpdateDream(editingDream.id, data)}
        />
      )}

      {/* Interpret Modal */}
      {interpretingDream && (
        <DreamInterpretModal
          isOpen={!!interpretingDream}
          onClose={() => setInterpretingDream(null)}
          dream={interpretingDream}
          onComplete={handleInterpretComplete}
        />
      )}
    </div>
  );
}
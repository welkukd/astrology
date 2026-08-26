'use client';

import { useState, useCallback, useEffect } from 'react';
import { cn, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/Tabs';
import { GoldTriangle } from '@/components/ui/GoldTriangle';
import { Modal } from '@/components/ui/Modal';
import { TarotCard, TarotCardProps } from './TarotCard';
import { SpreadLayout } from './SpreadLayout';

export interface JournalEntry {
  id: string;
  reading_id?: string;
  title?: string;
  content: string;
  tags: string[];
  mood?: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  reading?: {
    id: string;
    spread: string;
    spread_key: string;
    cards: Array<TarotCardProps & { position: string; positionIndex: number }>;
    question?: string;
    timestamp: number;
  };
}

export interface JournalFilter {
  search?: string;
  tags?: string[];
  mood?: string;
  dateFrom?: string;
  dateTo?: string;
  showPrivate?: boolean;
}

export interface JournalListProps {
  /** Journal entries */
  entries: JournalEntry[];
  /** Filter state */
  filter: JournalFilter;
  /** Callback when filter changes */
  onFilterChange: (filter: Partial<JournalFilter>) => void;
  /** Callback to edit entry */
  onEdit?: (entry: JournalEntry) => void;
  /** Callback to delete entry */
  onDelete?: (entryId: string) => Promise<void>;
  /** Callback to view reading */
  onViewReading?: (readingId: string) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
}

const MOODS = ['Reflective', 'Hopeful', 'Anxious', 'Peaceful', 'Confused', 'Grateful', 'Empowered', 'Sad', 'Excited', 'Neutral'];

function JournalEntryCard({ entry, onEdit, onDelete, onViewReading }: { 
  entry: JournalEntry; 
  onEdit?: (entry: JournalEntry) => void;
  onDelete?: (entryId: string) => Promise<void>;
  onViewReading?: (readingId: string) => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = useCallback(async () => {
    if (onDelete) {
      await onDelete(entry.id);
      setShowDeleteConfirm(false);
    }
  }, [onDelete, entry.id]);

  return (
    <article className="card-default card-hover p-6 relative overflow-hidden group">
      <GoldTriangle orientation="down" size="sm" className="absolute top-4 right-4" aria-hidden="true" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {entry.title && (
              <h3 className="text-heading-3 font-display font-medium text-text-primary truncate" style={{ fontFamily: 'var(--font-display)' }}>
                {entry.title}
              </h3>
            )}
            <span className="text-caption text-text-muted whitespace-nowrap">
              {formatDate(entry.created_at)}
            </span>
            {!entry.is_private && (
              <span className="text-caption font-medium px-2 py-0.5 rounded-pill bg-accent-gold/15 text-accent-gold">
                Public
              </span>
            )}
            {entry.is_private && (
              <span className="text-caption font-medium px-2 py-0.5 rounded-pill bg-bg-hover text-text-muted">
                Private
              </span>
            )}
          </div>

          {entry.mood && (
            <span className="inline-flex items-center gap-1 text-body-sm text-text-secondary mb-2">
              <span className="text-lg" aria-hidden="true">🌙</span>
              {entry.mood}
            </span>
          )}

          <p className="text-body-md text-text-secondary line-clamp-3 mb-3">
            {entry.content}
          </p>

          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {entry.tags.slice(0, 5).map((tag) => (
                <span key={tag} className="text-caption px-2 py-0.5 rounded-pill bg-bg-panel border border-border-subtle text-text-muted">
                  #{tag}
                </span>
              ))}
              {entry.tags.length > 5 && (
                <span className="text-caption px-2 py-0.5 rounded-pill bg-bg-panel border border-border-subtle text-text-muted">
                  +{entry.tags.length - 5} more
                </span>
              )}
            </div>
          )}

          {entry.reading && (
            <div className="pt-3 border-t border-border-subtle">
              <div className="flex items-center gap-2 mb-2">
                <span className="caption text-text-subtle uppercase tracking-wider">Linked Reading</span>
                <Button variant="ghost" size="sm" onClick={() => onViewReading?.(entry.reading!.id)}>
                  View
                </Button>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {entry.reading.cards.slice(0, 5).map((card, idx) => (
                  <TarotCard
                    key={idx}
                    name={card.name}
                    arcana={card.arcana}
                    suit={card.suit}
                    number={card.number}
                    orientation={(card.orientation?.toLowerCase() as 'upright' | 'reversed') || 'upright'}
                    faceUp={true}
                    interactive={false}
                    size="sm"
                    highlightMajor={true}
                    keywords={card.keywords?.slice(0, 1)}
                  />
                ))}
                {entry.reading.cards.length > 5 && (
                  <span className="text-caption text-text-muted px-2">+{entry.reading.cards.length - 5} more</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => onEdit?.(entry)} aria-label="Edit entry">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowDeleteConfirm(true)} aria-label="Delete entry" className="text-danger hover:text-danger hover:bg-danger/10">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Journal Entry"
        description="This action cannot be undone"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-body-md text-text-secondary">
            Are you sure you want to delete this journal entry? It will be permanently removed.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleDelete} className="text-danger hover:bg-danger/10">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </article>
  );
}

interface JournalFilterProps {
  filter: JournalFilter;
  onFilterChange: (filter: Partial<JournalFilter>) => void;
  availableTags: string[];
}

function JournalFilterBar({ filter, onFilterChange, availableTags }: JournalFilterProps) {
  return (
    <div className="card-default p-4 space-y-4">
      {/* Search */}
      <Input
        placeholder="Search entries..."
        value={filter.search || ''}
        onChange={(e) => onFilterChange({ search: e.target.value })}
        leftIcon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>}
      />

      {/* Tag Filter */}
      <div>
        <label className="caption text-text-subtle block mb-2">Filter by tags</label>
        <div className="flex flex-wrap gap-2">
          {availableTags.slice(0, 10).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onFilterChange({ tags: filter.tags?.includes(tag) ? filter.tags.filter(t => t !== tag) : [...(filter.tags || []), tag] })}
              className={cn(
                'px-3 py-1 rounded-pill text-caption font-medium transition-all duration-standard ease-out-expo',
                'focus-visible:outline-none focus-visible:shadow-focus',
                filter.tags?.includes(tag)
                  ? 'bg-accent-gold text-bg-primary'
                  : 'bg-bg-panel text-text-muted hover:text-text-primary hover:bg-bg-hover border border-border-subtle'
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Mood Filter */}
      <div>
        <label className="caption text-text-subtle block mb-2">Filter by mood</label>
        <Select
          value={filter.mood || ''}
          onChange={(e) => onFilterChange({ mood: e.target.value || undefined })}
          options={[{ value: '', label: 'All moods' }, ...MOODS.map(m => ({ value: m, label: m }))]}
          placeholder="All moods"
        />
      </div>

      {/* Date Range */}
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          type="date"
          value={filter.dateFrom || ''}
          onChange={(e) => onFilterChange({ dateFrom: e.target.value || undefined })}
          label="From"
        />
        <Input
          type="date"
          value={filter.dateTo || ''}
          onChange={(e) => onFilterChange({ dateTo: e.target.value || undefined })}
          label="To"
        />
      </div>

      {/* Private Toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={filter.showPrivate || false}
          onChange={(e) => onFilterChange({ showPrivate: e.target.checked })}
          className="h-4 w-4 rounded border-border-standard text-accent-gold focus:ring-accent-gold"
        />
        <span className="text-body-sm text-text-secondary">Show private entries</span>
      </label>
    </div>
  );
}

import { Select } from '@/components/ui/Input';

interface CreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: Partial<JournalEntry>) => Promise<void>;
  initialData?: Partial<JournalEntry> | null;
  isLoading?: boolean;
  availableTags: string[];
}

function CreateEditModal({ isOpen, onClose, onSubmit, initialData, isLoading, availableTags }: CreateEditModalProps) {
  const [formData, setFormData] = useState<Partial<JournalEntry>>({
    title: '',
    content: '',
    tags: [] as string[],
    mood: '',
    is_private: true,
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        tags: initialData.tags || [],
        mood: initialData.mood || '',
        is_private: initialData.is_private ?? true,
      });
    } else if (isOpen && !initialData) {
      setFormData({
        title: '',
        content: '',
        tags: [],
        mood: '',
        is_private: true,
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content?.trim()) return;
    await onSubmit(formData);
    onClose();
  }, [formData, onSubmit, onClose]);

  const handleTagAdd = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      const tag = newTag.trim().toLowerCase().replace(/\s+/g, '-');
      if (!(formData.tags || []).includes(tag)) {
        setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }));
      }
      setNewTag('');
    }
  }, [newTag, formData.tags]);

  const handleTagRemove = useCallback((tag: string) => {
    setFormData(prev => ({ ...prev, tags: (prev.tags || []).filter(t => t !== tag) }));
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Journal Entry' : 'New Journal Entry'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
                    label="Title (optional)"
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Give your entry a title"
                  />

                  <Textarea
                    label="Content"
                    value={formData.content || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your reflection..."
                    rows={6}
                    required
                  />

                  <div>
                    <label className="label-base block mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(formData.tags || []).map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-pill bg-accent-gold/15 text-accent-gold text-caption">
                #{tag}
                <button type="button" onClick={() => handleTagRemove(tag)} className="hover:text-danger" aria-label={`Remove tag ${tag}`}>
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </span>
            ))}
          </div>
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleTagAdd}
            placeholder="Add tag (press Enter)"
            rightIcon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>}
          />
          {availableTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {availableTags.filter(t => !(formData.tags || []).includes(t)).slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }))}
                  className="text-caption px-2 py-1 rounded-pill bg-bg-panel border border-border-subtle text-text-muted hover:text-text-primary hover:bg-bg-hover"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="label-base block mb-2">Mood</label>
          <Select
            value={formData.mood || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value || undefined }))}
            options={[{ value: '', label: 'Select mood' }, ...MOODS.map(m => ({ value: m, label: m }))]}
            placeholder="Select mood"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_private ?? true}
            onChange={(e) => setFormData(prev => ({ ...prev, is_private: e.target.checked }))}
            className="h-4 w-4 rounded border-border-standard text-accent-gold focus:ring-accent-gold"
          />
          <span className="text-body-sm text-text-secondary">Private entry</span>
        </label>

        <div className="flex justify-end gap-2 pt-4 border-t border-border-subtle">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Save Changes' : 'Create Entry'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/**
 * JournalList - List view with filters and create/edit modal
 */
export function JournalList({
  entries,
  filter,
  onFilterChange,
  onEdit,
  onDelete,
  onViewReading,
  isLoading = false,
  emptyMessage = 'No journal entries yet. Start your tarot journal today.',
}: JournalListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Collect all unique tags from entries
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    entries.forEach(entry => entry.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [entries]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      if (!filter.showPrivate && entry.is_private) return false;
      if (filter.search && !entry.content.toLowerCase().includes(filter.search.toLowerCase()) && 
          !entry.title?.toLowerCase().includes(filter.search.toLowerCase())) return false;
      if (filter.tags && filter.tags.length > 0 && !filter.tags.some(tag => entry.tags.includes(tag))) return false;
      if (filter.mood && entry.mood !== filter.mood) return false;
      if (filter.dateFrom && new Date(entry.created_at) < new Date(filter.dateFrom)) return false;
      if (filter.dateTo && new Date(entry.created_at) > new Date(filter.dateTo)) return false;
      return true;
    });
  }, [entries, filter]);

  const handleCreate = useCallback(async (data: Partial<JournalEntry>) => {
    // In a real app, this would call an API
    console.log('Create entry:', data);
  }, []);

  const handleEdit = useCallback(async (data: Partial<JournalEntry>) => {
    if (editingEntry) {
      // In a real app, this would call an API
      console.log('Update entry:', editingEntry.id, data);
    }
  }, [editingEntry]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <GoldTriangle orientation="down" size="lg" aria-hidden="true" />
          <h1 className="text-display font-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Tarot Journal
          </h1>
        </div>
        <Button onClick={() => { setEditingEntry(null); setShowCreateModal(true); }}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Entry
        </Button>
      </div>

      {/* Filter Bar */}
      <JournalFilterBar filter={filter} onFilterChange={onFilterChange} availableTags={allTags} />

      {/* Entries List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card-default p-6 animate-pulse">
              <div className="h-6 bg-bg-panel rounded w-3/4 mb-3" />
              <div className="h-4 bg-bg-panel rounded w-1/2 mb-2" />
              <div className="h-4 bg-bg-panel rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="card-default p-12 text-center">
          <svg className="h-12 w-12 text-text-muted mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <h3 className="text-heading-3 font-display font-medium text-text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {emptyMessage}
          </h3>
          <Button onClick={() => setShowCreateModal(true)} className="mt-4">
            Create First Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <JournalEntryCard
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewReading={onViewReading}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <CreateEditModal
        isOpen={showCreateModal || !!editingEntry}
        onClose={() => { setShowCreateModal(false); setEditingEntry(null); }}
        onSubmit={editingEntry ? handleEdit : handleCreate}
        initialData={editingEntry}
        isLoading={submitting}
        availableTags={allTags}
      />
    </div>
  );
}

// Add useMemo import
import { useMemo } from 'react';
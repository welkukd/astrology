'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { JournalList, JournalEntry, JournalFilter } from '@/components/tarot/JournalList';

interface JournalPageData {
  entries: JournalEntry[];
}

/**
 * Journal Page - /dashboard/tarot/journal
 * List with filters, create/edit entry modal
 */
export default async function JournalPage() {
  // In a real app, this would be fetched from an API
  // For now, we'll use client-side state with localStorage
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filter, setFilter] = useState<JournalFilter>({
    search: '',
    tags: [],
    mood: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    showPrivate: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load entries from localStorage on mount
  useEffect(() => {
    const loadEntries = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('gaia-tarot-journal');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setEntries(parsed);
          } catch {
            setEntries([]);
          }
        }
      }
      setIsLoading(false);
    };
    loadEntries();
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && entries.length > 0) {
      localStorage.setItem('gaia-tarot-journal', JSON.stringify(entries));
    }
  }, [entries]);

  const handleFilterChange = useCallback((newFilter: Partial<JournalFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  const handleCreate = useCallback(async (data: Partial<JournalEntry>) => {
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      title: data.title,
      content: data.content || '',
      tags: data.tags || [],
      mood: data.mood,
      is_private: data.is_private ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEntries(prev => [newEntry, ...prev]);
  }, []);

  const handleEdit = useCallback(async (data: Partial<JournalEntry>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === data.id ? { ...entry, ...data, updated_at: new Date().toISOString() } : entry
    ));
  }, []);

  const handleDelete = useCallback(async (entryId: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
  }, []);

  const handleViewReading = useCallback((readingId: string) => {
    window.location.href = `/dashboard/tarot/reading/${readingId}`;
  }, []);

  return (
    <JournalList
      entries={entries}
      filter={filter}
      onFilterChange={handleFilterChange}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onViewReading={handleViewReading}
      isLoading={isLoading}
    />
  );
}
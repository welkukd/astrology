'use client';

import { useState, useEffect, useCallback } from 'react';
import { notFound } from 'next/navigation';
import { ReadingView } from '@/components/tarot/ReadingView';

interface ReadingDetailPageProps {
  params: Promise<{ id: string }>;
}

interface ReadingData {
  id: string;
  spread: string;
  spread_key: string;
  question?: string;
  cards: Array<{
    card_id: string;
    name: string;
    orientation: string;
    arcana: 'major' | 'minor';
    suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
    number?: number;
    position: string;
    positionIndex: number;
    positionMeaning: string;
    interpretation?: string;
    keywords?: string[];
    imageUrl?: string;
  }>;
  timestamp: number;
  interpretation?: Record<string, string>;
}

/**
 * Reading Detail Page - /dashboard/tarot/reading/[id]
 * Full reading view with spread layout, positioned cards, and AI interpretations
 */
export default async function ReadingDetailPage({ params }: ReadingDetailPageProps) {
  const { id } = await params;

  // Fetch reading data
  const [reading, setReading] = useState<ReadingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchReading = async () => {
      try {
        const res = await fetch(`/api/tarot/reading/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            notFound();
          }
          const err = await res.json().catch(() => ({ detail: 'Failed to load reading' }));
          throw new Error(err.detail || 'Failed to load reading');
        }
        const data = await res.json();
        // Transform cards to match ReadingCard type
        const transformedCards = data.cards.map((card: typeof data.cards[0], idx: number) => ({
          ...card,
          positionMeaning: card.positionMeaning || '',
          interpretation: card.interpretation,
          orientation: card.orientation.toLowerCase() as 'upright' | 'reversed',
        }));
        setReading({ ...data, cards: transformedCards });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reading');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReading();
  }, [id]);

  const handleSave = useCallback(async (readingId: string) => {
    try {
      const res = await fetch(`/api/tarot/reading/${readingId}/save`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to save reading');
    } catch (err) {
      console.error('Failed to save:', err);
    }
  }, []);

  const handleShare = useCallback((readingId: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Tarot Reading',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, []);

  const handleExport = useCallback((readingId: string) => {
    if (reading) {
      const content = `# ${reading.spread} Reading\n\n${reading.question ? `Question: ${reading.question}\n\n` : ''}Cards:\n${reading.cards.map((c, i) => `${i + 1}. ${c.name} (${c.orientation}) - ${c.position}: ${c.positionMeaning}`).join('\n')}\n\n---\nSource: Gaia Tarot`;
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reading.spread.toLowerCase().replace(/\s+/g, '-')}-reading.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [reading]);

  const handleDelete = useCallback(async (readingId: string) => {
    try {
      const res = await fetch(`/api/tarot/reading/${readingId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete reading');
      window.location.href = '/dashboard/tarot';
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  }, []);

  const handleFavorite = useCallback(async (readingId: string) => {
    try {
      const res = await fetch(`/api/tarot/reading/${readingId}/favorite`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to toggle favorite');
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-10 w-10 border-3 border-accent-gold/30 border-t-accent-gold rounded-full mx-auto" />
          <p className="text-body-md text-text-secondary">Loading reading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-default p-8 text-center">
        <h2 className="text-heading-3 font-display font-medium text-text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Unable to Load Reading
        </h2>
        <p className="text-body-md text-text-secondary">{error}</p>
      </div>
    );
  }

  if (!reading) {
    notFound();
  }

  return (
    <ReadingView
      reading={reading as unknown as {
        id: string;
        spread: string;
        spread_key: string;
        question?: string;
        cards: Array<{
          card_id: string;
          name: string;
          orientation: 'upright' | 'reversed';
          arcana: 'major' | 'minor';
          suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
          number?: number;
          position: string;
          positionIndex: number;
          positionMeaning: string;
          interpretation?: string;
          keywords?: string[];
          imageUrl?: string;
        }>;
        timestamp: number;
        interpretation?: Record<string, string>;
      }}
      onSave={handleSave}
      onShare={handleShare}
      onExport={handleExport}
      onDelete={handleDelete}
      onToggleFavorite={handleFavorite}
      isSaved={false}
      isFavorite={false}
    />
  );
}
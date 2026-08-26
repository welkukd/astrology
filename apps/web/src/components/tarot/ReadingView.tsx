'use client';

import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { GoldTriangle } from '@/components/ui/GoldTriangle';
import { Modal } from '@/components/ui/Modal';
import { SpreadLayout } from './SpreadLayout';
import { TarotCard, TarotCardProps } from './TarotCard';
import { CardMeaningModal, CardMeaningData } from './CardMeaningModal';

export interface ReadingCard extends TarotCardProps {
  position: string;
  positionIndex: number;
  positionMeaning: string;
  interpretation?: string;
  card_id: string;
}

// Type for SpreadLayout spreadType prop
type SpreadLayoutType = 'single' | 'three_card' | 'celtic_cross' | 'relationship' | 'horseshoe' | 'career';

export interface ReadingViewProps {
  /** Reading data */
  reading: {
    id: string;
    spread: string;
    spread_key: string;
    question?: string;
    cards: ReadingCard[];
    timestamp: number;
    interpretation?: Record<string, string>;
  } | null;
  /** Whether loading */
  isLoading?: boolean;
  /** Error message */
  error?: string;
  /** Callback to save reading */
  onSave?: (readingId: string) => Promise<void>;
  /** Callback to share reading */
  onShare?: (readingId: string) => void;
  /** Callback to export reading */
  onExport?: (readingId: string) => void;
  /** Callback to delete reading */
  onDelete?: (readingId: string) => Promise<void>;
  /** Whether reading is saved */
  isSaved?: boolean;
  /** Whether reading is favorite */
  isFavorite?: boolean;
  /** Callback to toggle favorite */
  onToggleFavorite?: (readingId: string) => Promise<void>;
}

/**
 * ReadingView - Full reading display with positioned cards and AI interpretations
 */
export function ReadingView({
  reading,
  isLoading = false,
  error,
  onSave,
  onShare,
  onExport,
  onDelete,
  isSaved = false,
  isFavorite = false,
  onToggleFavorite,
}: ReadingViewProps) {
  const [selectedCard, setSelectedCard] = useState<CardMeaningData | null>(null);
  const [showMeaningModal, setShowMeaningModal] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleCardClick = useCallback((card: TarotCardProps & { position: string; positionIndex: number } & Record<string, unknown>) => {
    // Convert to CardMeaningData for the modal
    const cardRecord = card as Record<string, unknown>;
    const meaningData: CardMeaningData = {
      card_id: cardRecord.card_id as string,
      name: card.name,
      arcana: card.arcana,
      suit: card.suit,
      number: card.number,
      orientation: ((cardRecord.orientation as string)?.toLowerCase() as 'upright' | 'reversed') || 'upright',
      keywords: card.keywords || [],
      meaning_upright: (cardRecord.interpretation as string) || `Upright meaning for ${card.name}`,
      meaning_reversed: `Reversed meaning for ${card.name}`,
      imageUrl: card.imageUrl,
    };
    setSelectedCard(meaningData);
    setShowMeaningModal(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (reading && onSave) {
      await onSave(reading.id);
      setShowSaveConfirm(false);
    }
  }, [reading, onSave]);

  const handleDelete = useCallback(async () => {
    if (reading && onDelete) {
      await onDelete(reading.id);
      setShowDeleteConfirm(false);
    }
  }, [reading, onDelete]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-10 w-10 border-3 border-accent-gold/30 border-t-accent-gold rounded-full mx-auto" />
          <p className="text-body-md text-text-secondary">Drawing your cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-default p-8 text-center">
        <svg className="h-12 w-12 text-danger mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3 className="text-heading-3 font-display font-medium text-text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Unable to Load Reading
        </h3>
        <p className="text-body-md text-text-secondary">{error}</p>
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="card-default p-8 text-center">
        <p className="text-body-md text-text-muted">No reading data available</p>
      </div>
    );
  }

  const spreadType = reading.spread_key as SpreadLayoutType;
  const formattedDate = new Date(reading.timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <GoldTriangle orientation="down" size="lg" aria-hidden="true" />
          <div>
            <h1 className="text-display font-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {reading.spread}
            </h1>
            <div className="flex items-center gap-4 mt-1 text-body-sm text-text-muted">
              <time dateTime={new Date(reading.timestamp).toISOString()}>{formattedDate}</time>
              {reading.question && (
                <>
                  <span aria-hidden="true">•</span>
                  <span className="max-w-[300px] truncate">"{reading.question}"</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={isSaved ? 'secondary' : 'primary'}
            size="sm"
            leftIcon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>}
            onClick={() => onSave ? setShowSaveConfirm(true) : undefined}
            disabled={!onSave || isSaved}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>} onClick={() => onShare?.(reading.id)}>
            Share
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>} onClick={() => onExport?.(reading.id)}>
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>}
            onClick={() => setShowDeleteConfirm(true)}
            className="text-danger hover:text-danger hover:bg-danger/10"
          >
            Delete
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite?.(reading.id)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
          >
            <svg className={cn('h-5 w-5', isFavorite ? 'fill-accent-gold text-accent-gold' : '')} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Question */}
      {reading.question && (
        <div className="card-default p-6 border-l-4" style={{ borderLeftColor: 'var(--accent-gold)' }}>
          <h2 className="text-heading-3 font-display font-medium text-text-primary mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <GoldTriangle orientation="down" size="sm" aria-hidden="true" />
            Your Question
          </h2>
          <p className="text-body-lg text-text-secondary italic">"{reading.question}"</p>
        </div>
      )}

      {/* Spread Layout */}
      <div className="card-default p-6">
        <SpreadLayout
          spreadType={spreadType}
          cards={reading.cards as unknown as Array<TarotCardProps & { position: string; positionIndex: number } & Record<string, unknown>>}
          faceUp={true}
          onCardClick={handleCardClick}
          showPositionMeanings={true}
        />
      </div>

      {/* AI Interpretations */}
      {(reading.interpretation || reading.cards.some(c => c.interpretation)) && (
        <section className="space-y-6">
          <h2 className="text-heading-2 font-display font-medium text-text-primary flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
            <GoldTriangle orientation="down" size="md" aria-hidden="true" />
            Interpretations
          </h2>

          {reading.cards.map((card, index) => {
            const positionInterpretation = reading.interpretation?.[card.position] || card.interpretation;
            if (!positionInterpretation) return null;

            return (
              <article
                key={card.position}
                className="card-default p-6 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <TarotCard
                    name={card.name}
                    arcana={card.arcana}
                    suit={card.suit}
                    number={card.number}
                    orientation={(card.orientation?.toLowerCase() as 'upright' | 'reversed') || 'upright'}
                    faceUp={true}
                    interactive={true}
                    onFlip={() => handleCardClick(card as unknown as TarotCardProps & { position: string; positionIndex: number } & Record<string, unknown>)}
                    size="sm"
                    highlightMajor={true}
                    keywords={card.keywords}
                    imageUrl={card.imageUrl}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-caption font-mono text-accent-gold min-w-[28px] text-right">
                        {card.positionIndex + 1}.
                      </span>
                      <h3 className="text-heading-3 font-display font-medium text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                        {card.position}
                      </h3>
                      {card.arcana === 'major' && (
                        <span className="text-caption font-medium px-2 py-0.5 rounded-pill bg-accent-gold/15 text-accent-gold">
                          Major Arcana
                        </span>
                      )}
                    </div>
                    <p className="text-body-sm text-text-muted mt-1">{card.positionMeaning}</p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none ml-12">
                  <p className="text-body-md text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {positionInterpretation}
                  </p>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Card Meaning Modal */}
      <CardMeaningModal
        isOpen={showMeaningModal}
        onClose={() => setShowMeaningModal(false)}
        card={selectedCard}
      />

      {/* Save Confirmation Modal */}
      <Modal
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        title="Save Reading"
        description="Save this reading to your journal for future reference"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-body-md text-text-secondary">
            This reading will be added to your Tarot Journal where you can review it anytime.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowSaveConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={isSaved}>
              Save Reading
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Reading"
        description="This action cannot be undone"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-body-md text-text-secondary">
            Are you sure you want to delete this reading? It will be permanently removed.
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
    </div>
  );
}
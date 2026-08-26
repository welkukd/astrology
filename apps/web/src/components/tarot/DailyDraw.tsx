'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { TarotCard, TarotCardProps, TarotCardBack } from './TarotCard';
import { GoldTriangle } from '@/components/ui/GoldTriangle';
import { Button } from '@/components/ui/Button';
import { CardMeaningModal, CardMeaningData } from './CardMeaningModal';
import { SpreadLayout } from './SpreadLayout';

export interface DailyDrawCard extends Omit<TarotCardProps, 'orientation'> {
  card_id: string;
  draw_date: string;
  personal_reflection?: string;
  ai_guidance?: Record<string, unknown>;
  number_roman?: string;
  orientation?: 'upright' | 'reversed' | 'Upright' | 'Reversed';
}

export interface DailyDrawProps {
  /** Initial daily draw data (from server or cache) */
  initialCard?: DailyDrawCard | null;
  /** Whether user can draw a new card (once per day) */
  canDraw?: boolean;
  /** Callback when user draws a new card */
  onDraw?: () => Promise<DailyDrawCard | null>;
  /** Callback when user saves reflection */
  onSaveReflection?: (reflection: string) => Promise<void>;
  /** Show as compact version (for dashboard) */
  compact?: boolean;
}

/**
 * DailyDraw - Daily tarot card component with flip animation
 */
export function DailyDraw({
  initialCard,
  canDraw = true,
  onDraw,
  onSaveReflection,
  compact = false,
}: DailyDrawProps) {
  const [currentCard, setCurrentCard] = useState<DailyDrawCard | null>(initialCard ?? null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState('');
  const [savingReflection, setSavingReflection] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    if (!initialCard && typeof window !== 'undefined') {
      const cached = localStorage.getItem('gaia-daily-draw');
      if (cached) {
        try {
          const data = JSON.parse(cached) as DailyDrawCard | null;
          if (data) {
            const today = new Date().toISOString().split('T')[0];
            if (data.draw_date === today) {
              setCurrentCard(data);
            }
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [initialCard]);

  // Save to localStorage when card changes
  useEffect(() => {
    if (currentCard && typeof window !== 'undefined') {
      localStorage.setItem('gaia-daily-draw', JSON.stringify(currentCard));
    }
  }, [currentCard]);

  const handleFlip = useCallback(() => {
    if (currentCard) {
      setIsFlipped(prev => !prev);
    }
  }, [currentCard]);

  const handleDraw = useCallback(async () => {
    if (!onDraw || isDrawing) return;

    setIsDrawing(true);
    try {
      const newCard = await onDraw();
      if (newCard) {
        setCurrentCard(newCard);
        setIsFlipped(false);
        setShowReflection(false);
        setReflection('');
      }
    } catch (error) {
      console.error('Failed to draw daily card:', error);
    } finally {
      setIsDrawing(false);
    }
  }, [onDraw, isDrawing]);

  const handleSaveReflection = useCallback(async () => {
    if (!onSaveReflection || !reflection.trim() || savingReflection) return;

    setSavingReflection(true);
    try {
      await onSaveReflection(reflection.trim());
      if (currentCard) {
        setCurrentCard(prev => prev ? { ...prev, personal_reflection: reflection.trim() } : null);
      }
      setShowReflection(false);
    } catch (error) {
      console.error('Failed to save reflection:', error);
    } finally {
      setSavingReflection(false);
    }
  }, [onSaveReflection, reflection, savingReflection, currentCard]);

  // Determine if we should show the draw button
  const shouldShowDraw = canDraw && (!currentCard || isDrawing);

  if (compact) {
    return (
      <div className="card-default card-hover p-6 relative overflow-hidden">
        <GoldTriangle orientation="down" size="md" className="absolute top-4 right-4" aria-hidden="true" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-caption font-medium px-2 py-1 rounded-pill bg-accent-gold/15 text-accent-gold">
                Daily Draw
              </span>
              {currentCard && (
                <time className="text-caption text-text-muted" dateTime={currentCard.draw_date}>
                  {new Date(currentCard.draw_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </time>
              )}
            </div>

            {currentCard ? (
              <>
                <div className="flex items-center gap-4">
                  <TarotCard
                    name={currentCard.name}
                    arcana={currentCard.arcana}
                    suit={currentCard.suit}
                    number={currentCard.number}
                    orientation={(currentCard.orientation?.toLowerCase() as 'upright' | 'reversed') || 'upright'}
                    faceUp={!isFlipped}
                    interactive={true}
                    onFlip={handleFlip}
                    size="sm"
                    highlightMajor={true}
                    keywords={currentCard.keywords}
                    imageUrl={currentCard.imageUrl}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-heading-3 font-display font-medium text-text-primary truncate" style={{ fontFamily: 'var(--font-display)' }}>
                      {currentCard.name}
                    </h3>
                    <p className="text-caption text-text-muted mt-1 flex items-center gap-1">
                      {currentCard.arcana === 'major' ? 'Major Arcana' : `${currentCard.suit ? currentCard.suit.charAt(0).toUpperCase() + currentCard.suit.slice(1) : 'Unknown'}`}
                      {currentCard.orientation && (
                        <>
                          <span aria-hidden="true">•</span>
                          <span className="capitalize">{currentCard.orientation.toLowerCase()}</span>
                        </>
                      )}
                    </p>
                    {currentCard.personal_reflection && (
                      <p className="text-body-sm text-text-secondary mt-2 line-clamp-2 italic">
                        "{currentCard.personal_reflection}"
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <TarotCardBack size="md" />
                <p className="text-body-sm text-text-muted mt-3">No daily draw yet</p>
              </div>
            )}

            {canDraw && (
              <Button
                variant={currentCard ? 'secondary' : 'primary'}
                size="sm"
                fullWidth
                onClick={handleDraw}
                disabled={isDrawing}
                isLoading={isDrawing}
                className="mt-4"
              >
                {currentCard ? 'Redraw Card' : 'Draw Daily Card'}
              </Button>
            )}
          </div>
        </div>

        {showReflection && (
          <div className="mt-6 pt-4 border-t border-border-subtle animate-slide-up">
            <label htmlFor="daily-reflection" className="label-base block mb-2">
              Personal Reflection
            </label>
            <textarea
              id="daily-reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What does this card mean for you today?"
              className="w-full min-h-[80px] bg-bg-panel border border-border-subtle rounded-md p-3 text-text-primary placeholder:text-text-subtle focus:border-accent-gold focus:outline-none focus:ring-2 focus:ring-accent-gold/20 font-body"
            />
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={handleSaveReflection} disabled={savingReflection || !reflection.trim()} isLoading={savingReflection}>
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowReflection(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {currentCard && currentCard.personal_reflection && !showReflection && (
          <Button variant="ghost" size="sm" className="mt-4" onClick={() => setShowReflection(true)}>
            Edit Reflection
          </Button>
        )}

        {!currentCard?.personal_reflection && currentCard && !showReflection && (
          <Button variant="ghost" size="sm" className="mt-4" onClick={() => setShowReflection(true)}>
            Add Reflection
          </Button>
        )}
      </div>
    );
  }

  // Full version
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-heading-2 font-display font-medium text-text-primary flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
            <GoldTriangle orientation="down" size="md" aria-hidden="true" />
            Daily Draw
          </h2>
          <p className="text-body-sm text-text-muted mt-1">Your card for today</p>
        </div>

        {canDraw && (
          <Button
            variant={currentCard ? 'secondary' : 'primary'}
            onClick={handleDraw}
            disabled={isDrawing}
            isLoading={isDrawing}
          >
            {currentCard ? 'Redraw' : 'Draw Card'}
          </Button>
        )}
      </div>

      {/* Card Display */}
      <div className="flex justify-center">
        {currentCard ? (
          <TarotCard
            name={currentCard.name}
            arcana={currentCard.arcana}
            suit={currentCard.suit}
            number={currentCard.number}
            orientation={(currentCard.orientation?.toLowerCase() as 'upright' | 'reversed') || 'upright'}
            faceUp={!isFlipped}
            interactive={true}
            onFlip={handleFlip}
            size="xl"
            highlightMajor={true}
            keywords={currentCard.keywords}
            imageUrl={currentCard.imageUrl}
            className="transition-transform duration-600 ease-out-expo"
            style={{
              transform: isFlipped && !prefersReducedMotion ? 'rotateY(180deg)' : undefined,
            }}
          />
        ) : (
          <TarotCardBack size="xl" />
        )}
      </div>

      {currentCard && (
        <>
          {/* Card Info */}
          <div className="text-center space-y-3">
            <h3 className="text-display font-display font-medium text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
              {currentCard.name}
            </h3>
            <div className="flex items-center justify-center gap-4 text-body-sm text-text-muted">
              <span className="flex items-center gap-1">
                <span className="text-accent-gold" aria-hidden="true">
                  {currentCard.arcana === 'major' ? '★' : suitSymbols[currentCard.suit || 'wands']}
                </span>
                {currentCard.arcana === 'major' ? 'Major Arcana' : `${currentCard.suit ? currentCard.suit.charAt(0).toUpperCase() + currentCard.suit.slice(1) : 'Unknown'}`}
              </span>
              {currentCard.orientation && (
                <span className="flex items-center gap-1">
                  <span className="text-accent-gold" aria-hidden="true">
                    {currentCard.orientation === 'Reversed' ? '↻' : '↑'}
                  </span>
                  {currentCard.orientation}
                </span>
              )}
              {currentCard.number !== undefined && currentCard.arcana === 'major' && (
                <span>{currentCard.number_roman || `X${currentCard.number}`}</span>
              )}
            </div>

            {currentCard.keywords && currentCard.keywords.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {currentCard.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="text-caption px-3 py-1 rounded-pill"
                    style={{ backgroundColor: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Reflection */}
          <div className="card-default p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-heading-3 font-display font-medium text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                Personal Reflection
              </h4>
            </div>

            {showReflection ? (
              <div className="space-y-3 animate-slide-up">
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="What does this card mean for you today? How does it resonate with your current situation?"
                  className="w-full min-h-[100px] bg-bg-panel border border-border-subtle rounded-md p-4 text-text-primary placeholder:text-text-subtle focus:border-accent-gold focus:outline-none focus:ring-2 focus:ring-accent-gold/20 font-body"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowReflection(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveReflection} disabled={savingReflection || !reflection.trim()} isLoading={savingReflection}>
                    Save Reflection
                  </Button>
                </div>
              </div>
            ) : currentCard.personal_reflection ? (
              <div className="space-y-3">
                <p className="text-body-md text-text-secondary italic leading-relaxed">
                  "{currentCard.personal_reflection}"
                </p>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setShowReflection(true)}>
                    Edit
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-body-md text-text-muted mb-4">Capture your thoughts on today's card</p>
                <Button variant="secondary" onClick={() => setShowReflection(true)}>
                  Add Reflection
                </Button>
              </div>
            )}
          </div>

          {/* AI Guidance */}
          {currentCard.ai_guidance && (
            <div className="card-default p-6 border-l-4" style={{ borderLeftColor: 'var(--accent-gold)' }}>
              <h4 className="text-heading-3 font-display font-medium text-text-primary mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                <GoldTriangle orientation="down" size="sm" aria-hidden="true" />
                AI Guidance
              </h4>
              <div className="prose prose-invert max-w-none text-body-md text-text-secondary">
                {typeof currentCard.ai_guidance === 'object' && currentCard.ai_guidance !== null
                  ? Object.entries(currentCard.ai_guidance).map(([key, value]) => (
                      <div key={key} className="mb-3">
                        <p className="caption text-accent-gold uppercase tracking-wider mb-1">{key}</p>
                        <p>{String(value)}</p>
                      </div>
                    ))
                  : String(currentCard.ai_guidance)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Suit symbols for reference
const suitSymbols: Record<string, string> = {
  wands: '♣',
  cups: '♥',
  swords: '♠',
  pentacles: '♦',
};
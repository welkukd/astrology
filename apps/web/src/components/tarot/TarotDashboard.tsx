'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Sparkles, Shuffle, Plus, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { GoldTriangle } from '@/components/ui/GoldTriangle';
import { DailyDraw } from '@/components/tarot/DailyDraw';
import { ReadingForm, DEFAULT_SPREADS, SpreadOption } from '@/components/tarot/ReadingForm';
import { SpreadLayout } from '@/components/tarot/SpreadLayout';
import { TarotCard, TarotCardProps, TarotCardBack } from '@/components/tarot/TarotCard';

interface RecentReading {
  id: string;
  spread: string;
  spread_key: string;
  question?: string;
  cards: Array<TarotCardProps & { position: string; positionIndex: number }>;
  timestamp: number;
}

export interface TarotDashboardProps {
  /** Initial daily draw card */
  initialDailyCard?: DailyDrawCard | null;
  /** Recent readings */
  recentReadings?: RecentReading[];
  /** Callback to draw daily card */
  onDrawDaily?: () => Promise<DailyDrawCard | null>;
  /** Callback to save reflection */
  onSaveReflection?: (reflection: string) => Promise<void>;
  /** Callback to generate new reading */
  onGenerateReading?: (spreadKey: string, question: string) => Promise<RecentReading | null>;
}

export interface DailyDrawCard extends Omit<TarotCardProps, 'orientation'> {
  card_id: string;
  draw_date: string;
  personal_reflection?: string;
  ai_guidance?: Record<string, unknown>;
  number_roman?: string;
  orientation?: 'upright' | 'reversed' | 'Upright' | 'Reversed';
}

/**
 * TarotDashboard - Main tarot dashboard with daily draw, quick actions, and recent readings
 */
export function TarotDashboard({
  initialDailyCard,
  recentReadings = [],
  onDrawDaily,
  onSaveReflection,
  onGenerateReading,
}: TarotDashboardProps) {
  const [selectedSpread, setSelectedSpread] = useState<string>('three_card');
  const [question, setQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReadingForm, setShowReadingForm] = useState(false);
  const [previewCards, setPreviewCards] = useState<Array<TarotCardProps & { position: string; positionIndex: number }>>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  // Generate preview cards for selected spread
  useEffect(() => {
    const spread = DEFAULT_SPREADS.find(s => s.key === selectedSpread);
    if (spread) {
      const cards: Array<TarotCardProps & { position: string; positionIndex: number }> = spread.positions.map((pos, idx) => ({
        name: `Card ${idx + 1}`,
        arcana: idx === 0 ? 'major' : 'minor',
        suit: idx > 0 ? 'wands' : undefined,
        number: idx + 1,
        orientation: 'upright',
        faceUp: false,
        interactive: false,
        size: 'sm',
        highlightMajor: idx === 0,
        position: pos.name,
        positionIndex: idx,
      }));
      setPreviewCards(cards);
    }
  }, [selectedSpread]);

  const handleGenerate = useCallback(async (spreadKey: string, q: string) => {
    if (!onGenerateReading) return;
    
    setIsGenerating(true);
    setError(undefined);
    try {
      const reading = await onGenerateReading(spreadKey, q);
      if (reading) {
        // Navigate to reading detail page
        window.location.href = `/dashboard/tarot/reading/${reading.id}`;
      }
    } catch (err) {
      setError('Failed to generate reading. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [onGenerateReading]);

  const quickSpreads: Array<{ key: string; label: string; icon: React.ReactNode; description: string }> = [
    { key: 'single', label: '1 Card', icon: <Sparkles className="h-5 w-5" />, description: 'Quick insight' },
    { key: 'three_card', label: '3 Cards', icon: <BookOpen className="h-5 w-5" />, description: 'Past, present, future' },
    { key: 'celtic_cross', label: 'Celtic Cross', icon: <Shuffle className="h-5 w-5" />, description: 'Deep dive (10 cards)' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <GoldTriangle orientation="down" size="lg" aria-hidden="true" />
          <h1 className="text-display font-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Tarot
          </h1>
        </div>
      </div>

      {/* Daily Draw Section */}
      <section aria-labelledby="daily-draw-heading">
        <DailyDraw
          initialCard={initialDailyCard}
          canDraw={!!onDrawDaily}
          onDraw={onDrawDaily}
          onSaveReflection={onSaveReflection}
          compact={true}
        />
      </section>

      {/* Quick Actions */}
      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="text-heading-3 font-display font-medium text-text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
          <GoldTriangle orientation="down" size="sm" aria-hidden="true" />
          Quick Actions
        </h2>

        <div className="grid gap-3 sm:grid-cols-3">
          {quickSpreads.map((spread) => (
            <Button
              key={spread.key}
              variant={selectedSpread === spread.key ? 'primary' : 'secondary'}
              className="h-28 flex flex-col items-center justify-center gap-2 text-left"
              onClick={() => { setSelectedSpread(spread.key); setShowReadingForm(true); }}
            >
              <div className="flex items-center gap-2">
                {spread.icon}
                <span className="font-medium">{spread.label}</span>
              </div>
              <span className="text-caption text-text-muted">{spread.description}</span>
            </Button>
          ))}
        </div>
      </section>

      {/* Reading Form (collapsible) */}
      {showReadingForm && (
        <section className="animate-slide-up">
          <ReadingForm
            selectedSpread={selectedSpread}
            onSpreadChange={setSelectedSpread}
            question={question}
            onQuestionChange={setQuestion}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            error={error}
            showPreview={true}
            previewCards={previewCards}
          />
        </section>
      )}

      {/* Recent Readings */}
      <section aria-labelledby="recent-readings-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="recent-readings-heading" className="text-heading-3 font-display font-medium text-text-primary flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <GoldTriangle orientation="down" size="sm" aria-hidden="true" />
            Recent Readings
          </h2>
          {recentReadings.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/dashboard/library'}>
              View All
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        {recentReadings.length === 0 ? (
          <Card variant="default" padding="lg">
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-text-muted mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-heading-3 font-display font-medium text-text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                No readings yet
              </h3>
              <p className="text-body-md text-text-secondary mb-6">
                Your tarot readings will appear here once you generate them.
              </p>
              <Button onClick={() => { setSelectedSpread('three_card'); setShowReadingForm(true); }}>
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Create Your First Reading
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentReadings.slice(0, 5).map((reading) => (
              <article
                key={reading.id}
                className="card-default card-hover p-4 group"
                onClick={() => window.location.href = `/dashboard/tarot/reading/${reading.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-caption font-medium px-2 py-1 rounded-pill bg-accent-gold/15 text-accent-gold">
                        {reading.spread}
                      </span>
                      <time className="text-caption text-text-muted" dateTime={new Date(reading.timestamp).toISOString()}>
                        {new Date(reading.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </time>
                    </div>
                    {reading.question && (
                      <p className="text-body-sm text-text-secondary truncate mb-2">"{reading.question}"</p>
                    )}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {reading.cards.slice(0, 4).map((card, idx) => (
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
                      {reading.cards.length > 4 && (
                        <span className="text-caption text-text-muted px-2">+{reading.cards.length - 4} more</span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-text-muted group-hover:text-accent-gold transition-colors flex-shrink-0" aria-hidden="true" />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
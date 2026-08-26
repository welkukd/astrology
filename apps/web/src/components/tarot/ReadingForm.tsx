'use client';

import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { GoldTriangle } from '@/components/ui/GoldTriangle';
import { SpreadLayout } from './SpreadLayout';
import { TarotCard, TarotCardProps, TarotCardBack } from './TarotCard';

export interface SpreadOption {
  key: string;
  name: string;
  description: string;
  cardCount: number;
  positions: Array<{ position: number; name: string; meaning: string }>;
  icon?: React.ReactNode;
}

export const DEFAULT_SPREADS: SpreadOption[] = [
  {
    key: 'single',
    name: 'Single Card',
    description: 'Quick insight or daily guidance',
    cardCount: 1,
    positions: [{ position: 1, name: 'Guidance', meaning: 'The energy or message for you right now' }],
  },
  {
    key: 'three_card',
    name: 'Three Card Spread',
    description: 'Past, present, future or situation, action, outcome',
    cardCount: 3,
    positions: [
      { position: 1, name: 'Past / Situation', meaning: 'What led to this moment or the current situation' },
      { position: 2, name: 'Present / Action', meaning: 'Current energy or recommended action' },
      { position: 3, name: 'Future / Outcome', meaning: 'Likely outcome or direction' },
    ],
  },
  {
    key: 'celtic_cross',
    name: 'Celtic Cross',
    description: 'Classic 10-card deep dive',
    cardCount: 10,
    positions: [
      { position: 1, name: 'Present', meaning: 'Current situation' },
      { position: 2, name: 'Challenge', meaning: 'Immediate obstacle' },
      { position: 3, name: 'Past', meaning: 'Foundation or recent past' },
      { position: 4, name: 'Future', meaning: 'Near future' },
      { position: 5, name: 'Above', meaning: 'Conscious goal or aspiration' },
      { position: 6, name: 'Below', meaning: 'Subconscious influence' },
      { position: 7, name: 'Self', meaning: 'Your attitude' },
      { position: 8, name: 'Environment', meaning: 'External influences' },
      { position: 9, name: 'Hopes/Fears', meaning: 'Inner hopes or fears' },
      { position: 10, name: 'Outcome', meaning: 'Final outcome' },
    ],
  },
  {
    key: 'relationship',
    name: 'Relationship Spread',
    description: 'Explore dynamics between two people',
    cardCount: 7,
    positions: [
      { position: 1, name: 'You', meaning: 'Your energy in the relationship' },
      { position: 2, name: 'Partner', meaning: "Partner's energy" },
      { position: 3, name: 'Foundation', meaning: 'Relationship foundation' },
      { position: 4, name: 'Past', meaning: 'Past influences on the relationship' },
      { position: 5, name: 'Future', meaning: 'Future potential' },
      { position: 6, name: 'Challenges', meaning: 'Current challenges' },
      { position: 7, name: 'Advice', meaning: 'Guidance for the relationship' },
    ],
  },
  {
    key: 'horseshoe',
    name: 'Horseshoe Spread',
    description: 'Seven-card overview of a situation',
    cardCount: 7,
    positions: [
      { position: 1, name: 'Past', meaning: 'Past influences' },
      { position: 2, name: 'Present', meaning: 'Current situation' },
      { position: 3, name: 'Hidden Influences', meaning: 'Unseen factors' },
      { position: 4, name: 'Obstacles', meaning: 'Challenges to overcome' },
      { position: 5, name: 'Environment', meaning: 'External influences' },
      { position: 6, name: 'Advice', meaning: 'Best course of action' },
      { position: 7, name: 'Outcome', meaning: 'Likely result' },
    ],
  },
  {
    key: 'career',
    name: 'Career Path',
    description: 'Five-card spread for professional direction',
    cardCount: 5,
    positions: [
      { position: 1, name: 'Current Path', meaning: 'Where you are now professionally' },
      { position: 2, name: 'Strengths', meaning: 'Your key assets and talents' },
      { position: 3, name: 'Challenges', meaning: 'Obstacles in your career' },
      { position: 4, name: 'Advice', meaning: 'Guidance for growth' },
      { position: 5, name: 'Outcome', meaning: 'Potential future direction' },
    ],
  },
];

interface SpreadCardProps {
  spread: SpreadOption;
  isSelected: boolean;
  onSelect: () => void;
  showPreview?: boolean;
  previewCards?: Array<TarotCardProps & { position: string; positionIndex: number }>;
}

function SpreadCard({ spread, isSelected, onSelect, showPreview, previewCards }: SpreadCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className={cn(
        'card-default relative overflow-hidden transition-all duration-300 ease-out-expo',
        'group cursor-pointer',
        isSelected
          ? 'border-accent-gold/50 shadow-lg shadow-accent-gold/10'
          : 'border-border-subtle hover:border-accent-gold/30 hover:shadow-card-hover',
        isHovered && 'scale-[1.02] z-10'
      )}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); }}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={spread.name}
    >
      {/* Gold triangle accent for selected */}
      {isSelected && (
        <GoldTriangle orientation="down" size="sm" className="absolute top-3 right-3 z-10" aria-hidden="true" />
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-heading-3 font-display font-medium text-text-primary truncate" style={{ fontFamily: 'var(--font-display)' }}>
              {spread.name}
            </h3>
            <p className="text-body-sm text-text-muted mt-1">{spread.description}</p>
          </div>
          <div className="flex items-center gap-2 text-caption text-text-muted">
            <span className="flex items-center gap-1 px-2 py-1 rounded-pill bg-bg-panel border border-border-subtle">
              <span aria-hidden="true">🃏</span>
              {spread.cardCount} cards
            </span>
          </div>
        </div>

        {/* Position meanings preview */}
        <div className="space-y-2 mb-4">
          {spread.positions.slice(0, 3).map((pos, idx) => (
            <div key={pos.position} className="flex items-start gap-2 text-body-sm">
              <span className="text-caption font-mono text-accent-gold/60 min-w-[24px] text-right">
                {pos.position}.
              </span>
              <span className="font-medium text-text-primary">{pos.name}</span>
              <span className="text-text-muted flex-1 truncate">{pos.meaning}</span>
            </div>
          ))}
          {spread.positions.length > 3 && (
            <p className="text-caption text-text-muted text-center">
              +{spread.positions.length - 3} more positions
            </p>
          )}
        </div>

        {/* Preview cards */}
        {showPreview && previewCards && previewCards.length > 0 && (
          <div className="pt-4 border-t border-border-subtle">
            <p className="caption text-text-subtle uppercase tracking-wider mb-3">Preview</p>
            <SpreadLayout
              spreadType={spread.key as SpreadLayoutProps['spreadType']}
              cards={previewCards as Array<TarotCardProps & { position: string; positionIndex: number } & Record<string, unknown>>}
              faceUp={true}
            />
          </div>
        )}
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-accent-gold/50 rounded-lg pointer-events-none" aria-hidden="true" />
      )}
    </article>
  );
}

interface SpreadLayoutProps {
  spreadType: 'single' | 'three_card' | 'celtic_cross' | 'relationship' | 'horseshoe' | 'career';
  cards: Array<TarotCardProps & { position: string; positionIndex: number }>;
  faceUp?: boolean;
}

export interface ReadingFormProps {
  /** Available spreads */
  spreads?: SpreadOption[];
  /** Selected spread key */
  selectedSpread?: string;
  /** Callback when spread selection changes */
  onSpreadChange?: (spreadKey: string) => void;
  /** Question input value */
  question?: string;
  /** Callback when question changes */
  onQuestionChange?: (question: string) => void;
  /** Callback when generate is clicked */
  onGenerate?: (spreadKey: string, question: string) => void;
  /** Whether generation is in progress */
  isGenerating?: boolean;
  /** Error message */
  error?: string;
  /** Show spread preview cards */
  showPreview?: boolean;
  /** Preview cards for selected spread */
  previewCards?: Array<TarotCardProps & { position: string; positionIndex: number }>;
}

/**
 * ReadingForm - Spread selection and question input for tarot readings
 */
export function ReadingForm({
  spreads = DEFAULT_SPREADS,
  selectedSpread,
  onSpreadChange,
  question = '',
  onQuestionChange,
  onGenerate,
  isGenerating = false,
  error,
  showPreview = false,
  previewCards,
}: ReadingFormProps) {
  const [localQuestion, setLocalQuestion] = useState(question);

  // Sync local question with prop
  useEffect(() => {
    setLocalQuestion(question);
  }, [question]);

  const handleQuestionChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setLocalQuestion(value);
    onQuestionChange?.(value);
  }, [onQuestionChange]);

  const handleGenerate = useCallback(() => {
    if (selectedSpread && onGenerate) {
      onGenerate(selectedSpread, localQuestion.trim());
    }
  }, [selectedSpread, onGenerate, localQuestion]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-display font-display font-semibold tracking-tight flex items-center gap-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          <GoldTriangle orientation="down" size="lg" aria-hidden="true" />
          New Reading
        </h1>
        <p className="text-body-lg text-text-secondary mt-2">
          Choose a spread, ask your question, and draw the cards
        </p>
      </div>

      {/* Spread Selection */}
      <section aria-labelledby="spreads-heading">
        <h2 id="spreads-heading" className="text-heading-3 font-display font-medium text-text-primary mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Select Spread
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spreads.map((spread) => (
            <SpreadCard
              key={spread.key}
              spread={spread}
              isSelected={selectedSpread === spread.key}
              onSelect={() => onSpreadChange?.(spread.key)}
              showPreview={showPreview && selectedSpread === spread.key}
                            previewCards={previewCards as Array<TarotCardProps & { position: string; positionIndex: number } & Record<string, unknown>>}
              />
          ))}
        </div>
      </section>

      {/* Question Input */}
      <section aria-labelledby="question-heading">
        <h2 id="question-heading" className="text-heading-3 font-display font-medium text-text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Your Question <span className="text-body-md font-normal text-text-muted">(optional)</span>
        </h2>

        <div className="card-default p-6">
          <Textarea
            value={localQuestion}
            onChange={handleQuestionChange}
            placeholder="What would you like guidance on? (e.g., 'What should I focus on in my career?' or 'How can I improve my relationship?')"
            className="min-h-[120px]"
            rows={4}
          />

          {error && (
            <div className="mt-3 flex items-center gap-2 p-3 rounded-md" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <svg className="h-5 w-5 text-danger flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-body-sm text-danger">{error}</p>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <p className="caption text-text-subtle">
              {localQuestion.length}/1000 characters
            </p>
            <Button
              size="lg"
              fullWidth={false}
              onClick={handleGenerate}
              disabled={isGenerating || !selectedSpread}
              isLoading={isGenerating}
            >
              {isGenerating ? 'Drawing Cards...' : 'Generate Reading'}
            </Button>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="card-default p-6 border-border-standard">
        <h3 className="text-heading-3 font-display font-medium text-text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
          <GoldTriangle orientation="down" size="sm" aria-hidden="true" />
          Tips for Better Readings
        </h3>
        <ul className="space-y-2 text-body-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-accent-gold flex-shrink-0 mt-0.5">•</span>
            Ask open-ended questions rather than yes/no questions
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-gold flex-shrink-0 mt-0.5">•</span>
            Focus on yourself and your actions, not others' thoughts
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-gold flex-shrink-0 mt-0.5">•</span>
            Be specific about the area of life you want guidance on
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-gold flex-shrink-0 mt-0.5">•</span>
            The Celtic Cross gives the most comprehensive insight
          </li>
        </ul>
      </section>
    </div>
  );
}
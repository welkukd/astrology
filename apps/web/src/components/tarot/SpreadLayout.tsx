'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { TarotCard, TarotCardProps } from './TarotCard';
import { GoldTriangle } from '@/components/ui/GoldTriangle';

export interface SpreadLayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of card data with positions */
  cards: Array<TarotCardProps & { position: string; positionIndex: number } & Record<string, unknown>>;
  /** Spread type for layout logic */
  spreadType: 'single' | 'three_card' | 'celtic_cross' | 'relationship' | 'horseshoe' | 'career';
  /** Whether cards are face up */
  faceUp?: boolean;
  /** Click handler for individual cards */
  onCardClick?: (card: TarotCardProps & { position: string; positionIndex: number } & Record<string, unknown>, index: number) => void;
  /** Show position meanings */
  showPositionMeanings?: boolean;
  /** Position meanings override */
  positionMeanings?: Record<string, string>;
}

const positionMeanings: Record<string, Record<string, string>> = {
  single: {
    Guidance: 'The energy or message for you right now',
  },
  three_card: {
    Past: 'What led to this moment or the current situation',
    Present: 'Current energy or recommended action',
    Future: 'Likely outcome or direction',
  },
  celtic_cross: {
    Present: 'Current situation',
    Challenge: 'Immediate obstacle',
    Past: 'Foundation or recent past',
    Future: 'Near future',
    Above: 'Conscious goal or aspiration',
    Below: 'Subconscious influence',
    Self: 'Your attitude',
    Environment: 'External influences',
    Hopes_Fears: 'Inner hopes or fears',
    Outcome: 'Final outcome',
  },
  relationship: {
    You: 'Your energy in the relationship',
    Partner: 'Partner\'s energy',
    Foundation: 'Relationship foundation',
    Past: 'Past influences on the relationship',
    Future: 'Future potential',
    Challenges: 'Current challenges',
    Advice: 'Guidance for the relationship',
  },
};

function getPositionMeaning(spreadType: SpreadLayoutProps['spreadType'], position: string): string {
  const meanings = positionMeanings[spreadType] || {};
  // Normalize position key
  const key = position.replace(/\s+/g, '_').replace(/&/g, 'and');
  return meanings[key] || meanings[position] || '';
}

export const SpreadLayout = forwardRef<HTMLDivElement, SpreadLayoutProps>(
  (
    {
      cards,
      spreadType,
      faceUp = true,
      onCardClick,
      showPositionMeanings = true,
      positionMeanings: customMeanings,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isMajorArcana = (card: TarotCardProps) => card.arcana === 'major';

    // Spread-specific layout classes
    const layoutClasses: Record<SpreadLayoutProps['spreadType'], string> = {
      single: 'flex justify-center',
      three_card: 'grid grid-cols-1 md:grid-cols-3 gap-6 items-start',
      celtic_cross: 'relative',
      relationship: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start',
      horseshoe: 'grid grid-cols-1 md:grid-cols-7 gap-3 items-start',
      career: 'grid grid-cols-1 md:grid-cols-5 gap-4 items-start',
    };

    // Celtic Cross specific positioning
    const celticCrossPositions: Record<number, { top: string; left: string; transform?: string; rotate?: string }> = {
      0: { top: '30%', left: '50%', transform: 'translate(-50%, -50%)' },      // Present - center
      1: { top: '30%', left: '50%', transform: 'translate(-50%, -50%) rotate(90deg)' }, // Challenge - horizontal over present
      2: { top: '30%', left: '20%', transform: 'translate(-50%, -50%)' },       // Past - left
      3: { top: '30%', left: '80%', transform: 'translate(-50%, -50%)' },       // Future - right
      4: { top: '10%', left: '50%', transform: 'translate(-50%, -50%)' },       // Above - top
      5: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },       // Below - bottom
      6: { top: '70%', left: '20%', transform: 'translate(-50%, -50%)' },       // Advice - bottom left
      7: { top: '70%', left: '50%', transform: 'translate(-50%, -50%)' },       // External - bottom center
      8: { top: '70%', left: '80%', transform: 'translate(-50%, -50%)' },       // Hopes/Fears - bottom right
      9: { top: '90%', left: '50%', transform: 'translate(-50%, -50%)' },       // Outcome - bottom
    };

    const renderCard = (card: SpreadLayoutProps['cards'][0], index: number) => {
      const meaning = customMeanings?.[card.position] || getPositionMeaning(spreadType, card.position);
      const isMajor = isMajorArcana(card);
      const CardComponent = TarotCard;

      const handleClick = () => onCardClick?.(card, index);

      const cardProps: TarotCardProps = {
        ...card,
        faceUp,
        interactive: !!onCardClick,
        onFlip: handleClick,
        highlightMajor: true,
        size: spreadType === 'celtic_cross' ? 'md' : 'lg',
        keywords: card.keywords,
        position: card.position,
      };

      if (spreadType === 'celtic_cross') {
        const pos = celticCrossPositions[index] || { top: '50%', left: '50%' };
        return (
          <div
            key={card.position || index}
            className="absolute"
            style={{
              top: pos.top,
              left: pos.left,
              transform: pos.transform,
              zIndex: index === 0 || index === 1 ? 10 : 5,
            }}
          >
            <div className="flex flex-col items-center gap-2 min-w-[140px]">
              <CardComponent {...cardProps} />
              {showPositionMeanings && meaning && (
                <GoldTriangleSection orientation="down" size="sm">
                  <p className="text-caption text-text-muted text-center max-w-[140px] leading-relaxed">
                    {meaning}
                  </p>
                </GoldTriangleSection>
              )}
            </div>
          </div>
        );
      }

      return (
        <div
          key={card.position || index}
          className="flex flex-col items-center gap-2"
        >
          <CardComponent {...cardProps} />
          {showPositionMeanings && meaning && (
            <GoldTriangleSection orientation="down" size="sm">
              <p className="text-caption text-text-muted text-center max-w-[140px] leading-relaxed">
                {meaning}
              </p>
            </GoldTriangleSection>
          )}
        </div>
      );
    };

    // Celtic Cross uses absolute positioning
    if (spreadType === 'celtic_cross') {
      return (
        <div
          ref={ref}
          className={cn(
            'relative',
            'min-h-[700px]',
            'md:min-h-[800px]',
            className
          )}
          {...props}
        >
          <div className="relative w-full h-full">
            {cards.map(renderCard)}
          </div>
          {/* Center cross indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="h-32 w-32 text-accent-gold/5" viewBox="0 0 100 100" aria-hidden="true">
              <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
        </div>
      );
    }

    // Other spreads use grid/flex layout
    return (
      <div
        ref={ref}
        className={cn(
          layoutClasses[spreadType],
          className
        )}
        {...props}
      >
        {cards.map(renderCard)}
        {children}
      </div>
    );
  }
);

SpreadLayout.displayName = 'SpreadLayout';

/**
 * GoldTriangleSection - section divider with gold triangle (local copy to avoid circular deps)
 */
interface GoldTriangleSectionProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'up' | 'down';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

function GoldTriangleSection({
  orientation = 'down',
  size = 'md',
  children,
  className,
  ...props
}: GoldTriangleSectionProps) {
  return (
    <div className={cn('relative flex flex-col items-center', className)} {...props}>
      <GoldTriangle orientation={orientation} size={size} className="mb-2" aria-hidden="true" />
      {children}
    </div>
  );
}
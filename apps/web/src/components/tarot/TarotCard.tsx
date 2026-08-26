'use client';

import { forwardRef, HTMLAttributes, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TarotCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card name (e.g., "The Fool", "Ace of Wands") */
  name: string;
  /** Card arcana type */
  arcana: 'major' | 'minor';
  /** Card suit for minor arcana */
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  /** Card number (0-21 for major, 1-14 for minor) */
  number?: number;
  /** Card orientation */
  orientation?: 'upright' | 'reversed';
  /** Whether card is flipped (showing back) */
  isFlipped?: boolean;
  /** Whether card is face up (not flipped) */
  faceUp?: boolean;
  /** Click handler for flip */
  onFlip?: () => void;
  /** Whether card is interactive */
  interactive?: boolean;
  /** Card size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Custom className */
  className?: string;
  /** Show position label (for spreads) */
  position?: string;
  /** Keywords for the card */
  keywords?: string[];
  /** Whether to show gold border/glow for Major Arcana */
  highlightMajor?: boolean;
  /** Image URL for card art */
  imageUrl?: string;
  /** Unique ID for accessibility */
  id?: string;
}

const sizeClasses: Record<NonNullable<TarotCardProps['size']>, string> = {
  sm: 'w-[60px]',
  md: 'w-[80px]',
  lg: 'w-[110px]',
  xl: 'w-[160px]',
};

const suitSymbols: Record<NonNullable<TarotCardProps['suit']>, string> = {
  wands: '♣',
  cups: '♥',
  swords: '♠',
  pentacles: '♦',
};

const suitColors: Record<NonNullable<TarotCardProps['suit']>, string> = {
  wands: '#fbbf24',    // gold for fire
  cups: '#3b82f6',     // blue for water
  swords: '#e5e7eb',   // silver/gray for air
  pentacles: '#22c55e', // green for earth
};

export const TarotCard = forwardRef<HTMLDivElement, TarotCardProps>(
  (
    {
      name,
      arcana,
      suit,
      number,
      orientation = 'upright',
      isFlipped = false,
      faceUp = true,
      onFlip,
      interactive = true,
      size = 'md',
      className,
      position,
      keywords = [],
      highlightMajor = true,
      imageUrl,
      id,
      style,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const isMajor = arcana === 'major';
    const isReversed = orientation === 'reversed';
    const showBack = isFlipped || !faceUp;

    // Rotation for reversed cards (180deg flip on Y axis + 180deg rotation)
    const cardRotation = isReversed ? 'rotateY(180deg) rotate(180deg)' : 'rotateY(0deg)';

    // Flip animation
    const flipTransform = showBack
      ? 'rotateY(180deg)'
      : cardRotation;

    const cardWidth = size === 'sm' ? 60 : size === 'md' ? 80 : size === 'lg' ? 110 : 160;
    const cardStyle: React.CSSProperties = {
      ...style,
      width: cardWidth,
      // Flip transform
      transform: prefersReducedMotion ? (showBack ? 'rotateY(180deg)' : cardRotation) : flipTransform,
      transformStyle: 'preserve-3d',
      transition: prefersReducedMotion
        ? 'none'
        : 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms ease-out',
    };

    // Major Arcana gets gold border and glow
    const majorStyles: React.CSSProperties = highlightMajor && isMajor
      ? {
          borderColor: '#fbbf24',
          boxShadow: '0 0 32px rgba(251,191,36,0.15), 0 0 64px rgba(251,191,36,0.08), inset 0 1px 0 rgba(255,255,255,0.03)',
        }
      : {};

    const handleClick = () => {
      if (interactive && onFlip) {
        onFlip();
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (interactive && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onFlip?.();
      }
    };

    return (
      <div
        ref={ref}
        id={id}
        role={interactive ? 'button' : 'img'}
        tabIndex={interactive ? 0 : -1}
        aria-label={showBack ? 'Tarot card back' : `${name}${isReversed ? ' (Reversed)' : ''}${position ? `, Position: ${position}` : ''}`}
        aria-pressed={!showBack}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'relative',
          'tarot-card',
          'perspective-1000',
          sizeClasses[size],
          'select-none',
          interactive && 'cursor-pointer touch-target',
          !interactive && 'cursor-default',
          isHovered && interactive && 'z-10',
          className
        )}
        style={cardStyle}
        {...props}
      >
        {/* Card Inner - handles 3D flip */}
        <div className="relative w-full h-full" style={{ aspectRatio: '5/7' }}>
          {/* Card Front */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg overflow-hidden transition-all duration-standard ease-out-expo">
            <div
              className="absolute inset-0 w-full h-full flex flex-col"
              style={{
                background: imageUrl
                  ? `url(${imageUrl}) center/cover no-repeat`
                  : 'linear-gradient(180deg, #1a1d21 0%, #0f1012 100%)',
                border: highlightMajor && isMajor ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.08)',
                ...majorStyles,
              }}
            >
              {/* Card Top - Number/Name */}
              <div className="flex items-center justify-between p-3 pt-4">
                {/* Number for Major Arcana */}
                {(isMajor && number !== undefined) && (
                  <span className="text-caption font-display font-medium text-accent-gold uppercase tracking-wider">
                    {number === 0 ? '0' : number.toString().padStart(2, '0')}
                  </span>
                )}
                {/* Suit symbol for Minor Arcana */}
                {!isMajor && suit && (
                  <span
                    className="text-lg font-medium"
                    style={{ color: suitColors[suit] }}
                    aria-hidden="true"
                  >
                    {suitSymbols[suit]}
                  </span>
                )}
              </div>

              {/* Card Center - Image area */}
              <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                {imageUrl ? null : (
                  <div className="text-center">
                    <span className="text-4xl md:text-6xl lg:text-8xl font-display font-light" style={{ color: isMajor ? '#fbbf24' : suit ? suitColors[suit] : '#8a8f98' }}>
                      {isMajor ? '★' : suitSymbols[suit || 'wands']}
                    </span>
                  </div>
                )}
                {/* Reversed indicator */}
                {isReversed && !showBack && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2" aria-hidden="true">
                    <svg className="h-5 w-5 text-accent-gold/60 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m18 15 6-6-6-6" />
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Card Bottom - Name and keywords */}
              <div className="p-3 pb-4 text-center">
                <p className="text-body-sm font-display font-medium text-text-primary leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                  {name}
                </p>
                {keywords.length > 0 && !showBack && (
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-1">
                    {keywords.slice(0, 3).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="text-caption px-1.5 py-0.5 rounded-sm"
                        style={{
                          backgroundColor: 'rgba(251,191,36,0.15)',
                          color: '#fbbf24',
                          fontSize: size === 'sm' ? '0.625rem' : '0.75rem',
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Position label for spreads */}
              {position && !showBack && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-caption font-medium px-2 py-0.5 rounded-sm" style={{ backgroundColor: 'rgba(8,9,10,0.9)', color: '#fbbf24' }}>
                  {position}
                </div>
              )}
            </div>
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg overflow-hidden rotate-y-180 transition-all duration-standard ease-out-expo" style={{ transform: 'rotateY(180deg)' }}>
            <div
              className="absolute inset-0 w-full h-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #0f1012 0%, #1a1d21 50%, #08090a 100%)',
                border: '1px solid rgba(251,191,36,0.3)',
              }}
            >
              <div className="text-center p-6">
                <svg className="mx-auto mb-3 h-10 w-10 text-accent-gold/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <p className="text-body-sm font-display font-medium text-accent-gold uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>
                  Tarot
                </p>
                <p className="text-caption text-text-muted mt-1">Gaia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Flip animation overlay for reduced motion */}
        {prefersReducedMotion && showBack && (
          <div className="absolute inset-0 bg-bg-primary/90 rounded-lg flex items-center justify-center" aria-hidden="true">
            <span className="text-caption text-text-muted">Card back</span>
          </div>
        )}
      </div>
    );
  }
);

TarotCard.displayName = 'TarotCard';

/**
 * TarotCardBack - standalone card back component
 */
interface TarotCardBackProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const backSizeClasses: Record<NonNullable<TarotCardBackProps['size']>, string> = {
  sm: 'w-[60px]',
  md: 'w-[80px]',
  lg: 'w-[110px]',
  xl: 'w-[160px]',
};

export function TarotCardBack({ size = 'md', className, ...props }: TarotCardBackProps) {
  return (
    <div
      className={cn(
        'tarot-card tarot-card-back',
        'perspective-1000',
        backSizeClasses[size],
        'select-none',
        className
      )}
      style={{ aspectRatio: '5/7' }}
      {...props}
    >
      <div className="absolute inset-0 w-full h-full rounded-lg overflow-hidden flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #0f1012 0%, #1a1d21 50%, #08090a 100%)',
        border: '1px solid rgba(251,191,36,0.3)',
      }}>
        <div className="text-center p-6">
          <svg className="mx-auto mb-3 h-10 w-10 text-accent-gold/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <p className="text-body-sm font-display font-medium text-accent-gold uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>
            Tarot
          </p>
          <p className="text-caption text-text-muted mt-1">Gaia</p>
        </div>
      </div>
    </div>
  );
}
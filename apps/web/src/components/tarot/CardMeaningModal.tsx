'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronUp, ChevronDown, Copy, Share2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TarotCard, TarotCardProps } from './TarotCard';
import { GoldTriangle } from '@/components/ui/GoldTriangle';
import { Button } from '@/components/ui/Button';

export interface CardMeaningData extends TarotCardProps {
  card_id: string;
  meaning_upright: string;
  meaning_reversed: string;
  element?: string;
  zodiac_association?: string;
  hebrew_letter?: string;
  number_roman?: string;
}

export interface CardMeaningModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardMeaningData | null;
  onShare?: (card: CardMeaningData) => void;
  onExport?: (card: CardMeaningData) => void;
  onCopyMeaning?: (meaning: string, orientation: 'upright' | 'reversed') => void;
}

const suitElements: Record<string, string> = {
  wands: 'Fire',
  cups: 'Water',
  swords: 'Air',
  pentacles: 'Earth',
};

const suitSymbols: Record<string, string> = {
  wands: '♣',
  cups: '♥',
  swords: '♠',
  pentacles: '♦',
};

const suitColors: Record<string, string> = {
  wands: '#fbbf24',
  cups: '#3b82f6',
  swords: '#e5e7eb',
  pentacles: '#22c55e',
};

export function CardMeaningModal({
  isOpen,
  onClose,
  card,
  onShare,
  onExport,
  onCopyMeaning,
}: CardMeaningModalProps) {
  const [activeTab, setActiveTab] = useState<'upright' | 'reversed'>('upright');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown as unknown as EventListener);
    return () => document.removeEventListener('keydown', handleKeyDown as unknown as EventListener);
  }, [isOpen, onClose]);

  if (!isOpen || !card) return null;

  const isMajor = card.arcana === 'major';
  const suit = card.suit;
  const element = isMajor ? 'Spirit' : suitElements[suit || 'wands'];
  const symbol = isMajor ? '★' : suitSymbols[suit || 'wands'];
  const color = isMajor ? '#fbbf24' : suitColors[suit || 'wands'];

  const handleCopy = () => {
    const meaning = activeTab === 'upright' ? card.meaning_upright : card.meaning_reversed;
    navigator.clipboard.writeText(`${card.name} (${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}): ${meaning}`);
    onCopyMeaning?.(meaning, activeTab);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${card.name} - Tarot Card Meaning`,
        text: `${card.name} (${activeTab}): ${activeTab === 'upright' ? card.meaning_upright : card.meaning_reversed}`,
      });
    } else {
      onShare?.(card);
    }
  };

  const handleExport = () => {
    const content = `# ${card.name} (${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)})\n\n${activeTab === 'upright' ? card.meaning_upright : card.meaning_reversed}\n\n---\nSource: Gaia Tarot`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.name.toLowerCase().replace(/\s+/g, '-')}-${activeTab}.md`;
    a.click();
    URL.revokeObjectURL(url);
    onExport?.(card);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-meaning-title"
      aria-describedby="card-meaning-description"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-overlay-modal backdrop-blur-modal z-[400]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'relative w-full max-w-[600px] max-h-[90vh]',
          'bg-bg-elevated border border-border-standard rounded-xxl',
          'shadow-modal overflow-hidden',
          'animate-scale-in'
        )}
      >
        {/* Header */}
        <div className="relative overflow-hidden">
          {/* Gold triangle accent */}
          <GoldTriangle
            orientation="down"
            size="lg"
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          />

          <div className="relative p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Card preview */}
                <TarotCard
                  name={card.name}
                  arcana={card.arcana}
                  suit={card.suit}
                  number={card.number}
                  orientation="upright"
                  faceUp={true}
                  interactive={false}
                  size="sm"
                  highlightMajor={true}
                  keywords={card.keywords}
                  imageUrl={card.imageUrl}
                />

                <div>
                  <h2 id="card-meaning-title" className="text-heading-3 font-display font-medium text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                    {card.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-caption font-medium px-2 py-1 rounded-pill" style={{ backgroundColor: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                      {isMajor ? 'Major Arcana' : 'Minor Arcana'}
                    </span>
                    {!isMajor && suit && (
                      <span className="text-caption font-medium px-2 py-1 rounded-pill flex items-center gap-1" style={{ backgroundColor: `${color}15`, color }}>
                        <span aria-hidden="true">{symbol}</span>
                        {suit.charAt(0).toUpperCase() + suit.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className={cn(
                  'p-2 rounded-full',
                  'bg-transparent border border-border-subtle text-text-muted',
                  'hover:bg-bg-hover hover:text-text-primary hover:border-border-standard',
                  'transition-all duration-micro ease-out-expo',
                  'focus-visible:outline-none focus-visible:shadow-focus',
                  'touch-target'
                )}
                aria-label="Close modal"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-y border-border-subtle px-6">
          <div className="flex items-center gap-1 bg-bg-panel rounded-lg p-1" role="tablist" aria-label="Card orientation">
            <button
              role="tab"
              aria-selected={activeTab === 'upright'}
              aria-controls="upright-panel"
              id="upright-tab"
              tabIndex={activeTab === 'upright' ? 0 : -1}
              onClick={() => setActiveTab('upright')}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-md',
                'font-body text-sm font-medium',
                'transition-all duration-standard ease-out-expo',
                'focus-visible:outline-none focus-visible:shadow-focus',
                'touch-target',
                activeTab === 'upright'
                  ? 'bg-accent-gold text-bg-primary font-semibold shadow-sm'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
              )}
            >
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
              <span>Upright</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'reversed'}
              aria-controls="reversed-panel"
              id="reversed-tab"
              tabIndex={activeTab === 'reversed' ? 0 : -1}
              onClick={() => setActiveTab('reversed')}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-md',
                'font-body text-sm font-medium',
                'transition-all duration-standard ease-out-expo',
                'focus-visible:outline-none focus-visible:shadow-focus',
                'touch-target',
                activeTab === 'reversed'
                  ? 'bg-accent-gold text-bg-primary font-semibold shadow-sm'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
              )}
            >
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
              <span>Reversed</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div id="card-meaning-description" className="space-y-6" hidden>
            Meaning for {card.name} in {activeTab} position
          </div>

          {/* Card Details */}
          <div className="grid gap-4 sm:grid-cols-2 border-b border-border-subtle pb-6">
            <div>
              <p className="caption text-text-subtle uppercase tracking-wider mb-1">Element</p>
              <p className="text-body-md font-medium text-text-primary">{element}</p>
            </div>
            {!isMajor && suit && (
              <div>
                <p className="caption text-text-subtle uppercase tracking-wider mb-1">Suit</p>
                <p className="text-body-md font-medium text-text-primary flex items-center gap-2">
                  <span style={{ color }} aria-hidden="true">{symbol}</span>
                  {suit.charAt(0).toUpperCase() + suit.slice(1)}
                </p>
              </div>
            )}
            {card.number !== undefined && (
              <div>
                <p className="caption text-text-subtle uppercase tracking-wider mb-1">Number</p>
                <p className="text-body-md font-medium text-text-primary">
                  {isMajor ? card.number_roman || card.number.toString() : card.number.toString()}
                </p>
              </div>
            )}
            {card.zodiac_association && (
              <div>
                <p className="caption text-text-subtle uppercase tracking-wider mb-1">Zodiac</p>
                <p className="text-body-md font-medium text-text-primary">{card.zodiac_association}</p>
              </div>
            )}
            {card.hebrew_letter && (
              <div>
                <p className="caption text-text-subtle uppercase tracking-wider mb-1">Hebrew Letter</p>
                <p className="text-body-md font-medium text-text-primary">{card.hebrew_letter}</p>
              </div>
            )}
            {card.keywords && card.keywords.length > 0 && (
              <div className="sm:col-span-2">
                <p className="caption text-text-subtle uppercase tracking-wider mb-2">Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {card.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="text-caption px-3 py-1.5 rounded-pill"
                      style={{ backgroundColor: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Meaning Content */}
          <div className="animate-slide-up">
            <h3 className="text-heading-3 font-display font-medium text-text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Meaning
            </h3>

            <div className="prose prose-invert max-w-none">
              <p className="text-body-md text-text-secondary leading-relaxed whitespace-pre-wrap">
                {activeTab === 'upright' ? card.meaning_upright : card.meaning_reversed}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-border-subtle">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Copy className="h-4 w-4" />}
                onClick={handleCopy}
                aria-label={`Copy ${activeTab} meaning`}
              >
                Copy Meaning
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Share2 className="h-4 w-4" />}
                onClick={handleShare}
                aria-label="Share card meaning"
              >
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={handleExport}
                aria-label="Export card meaning"
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * CardMeaningTooltip - hover tooltip for quick card meanings
 */
export interface CardMeaningTooltipProps {
  card: CardMeaningData;
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

export function CardMeaningTooltip({ card, open, onClose, triggerRef }: CardMeaningTooltipProps) {
  if (!open || !card) return null;

  const isMajor = card.arcana === 'major';
  const suit = card.suit;
  const element = isMajor ? 'Spirit' : suitElements[suit || 'wands'];

  return createPortal(
    <div
      className="fixed z-[700] animate-fade-in"
      style={{
        top: triggerRef.current?.getBoundingClientRect().bottom ?? 0,
        left: triggerRef.current?.getBoundingClientRect().left ?? 0,
      }}
      role="tooltip"
    >
      <div className="max-w-[320px] bg-bg-elevated border border-border-standard rounded-lg p-4 shadow-modal">
        <div className="flex items-start gap-3">
          <TarotCard
            name={card.name}
            arcana={card.arcana}
            suit={card.suit}
            number={card.number}
            orientation="upright"
            faceUp={true}
            interactive={false}
            size="sm"
            highlightMajor={true}
            keywords={card.keywords?.slice(0, 3)}
            imageUrl={card.imageUrl}
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-heading-3 font-display font-medium text-text-primary truncate" style={{ fontFamily: 'var(--font-display)' }}>
              {card.name}
            </h4>
            <p className="text-caption text-text-muted mt-1">
              {isMajor ? 'Major Arcana' : `${suit ? suit.charAt(0).toUpperCase() + suit.slice(1) : 'Unknown'} • ${element}`}
            </p>
            <p className="text-body-sm text-text-secondary mt-2 line-clamp-3">
              {card.meaning_upright}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
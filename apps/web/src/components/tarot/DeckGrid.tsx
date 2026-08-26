'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/Tabs';
import { GoldTriangle } from '@/components/ui/GoldTriangle';
import { Modal } from '@/components/ui/Modal';
import { TarotCard, TarotCardProps } from './TarotCard';
import { CardMeaningModal, CardMeaningData } from './CardMeaningModal';

export interface DeckCard extends TarotCardProps {
  card_id: string;
  meaning_upright: string;
  meaning_reversed: string;
  element?: string;
  zodiac_association?: string;
  hebrew_letter?: string;
  number_roman?: string;
}

// Full 78-card deck data
const MAJOR_ARCANA_CARDS: DeckCard[] = [
  { card_id: '0', name: 'The Fool', number: 0, arcana: 'major', keywords: ['beginnings', 'innocence', 'spontaneity', 'faith'], meaning_upright: 'New beginnings, innocence, spontaneity, a free spirit. The Fool represents the start of a journey, taking a leap of faith into the unknown. Trust your instincts and embrace new experiences with an open heart.', meaning_reversed: 'Recklessness, naivety, poor judgment. You may be acting without thinking or ignoring warnings. Take time to consider consequences before leaping.', element: 'Air', zodiac_association: 'Uranus', hebrew_letter: 'Aleph', number_roman: '0' },
  { card_id: '1', name: 'The Magician', number: 1, arcana: 'major', keywords: ['manifestation', 'resourcefulness', 'power', 'inspired action'], meaning_upright: 'Manifestation, resourcefulness, power, inspired action. You have all the tools you need to create your reality. Focus your will and take action to bring your visions to life.', meaning_reversed: 'Manipulation, untapped potential, deception. You may be misusing your skills or doubting your abilities. Realign with your true purpose and use your gifts ethically.', element: 'Air', zodiac_association: 'Mercury', hebrew_letter: 'Beth', number_roman: 'I' },
  { card_id: '2', name: 'The High Priestess', number: 2, arcana: 'major', keywords: ['intuition', 'sacred knowledge', 'divine feminine', 'subconscious'], meaning_upright: 'Intuition, sacred knowledge, divine feminine, subconscious. Trust your inner voice and listen to your dreams. The answers you seek are already within you.', meaning_reversed: 'Secrets, disconnected from intuition, withdrawal. You may be ignoring your inner wisdom or keeping secrets. Reconnect with your intuitive nature.', element: 'Water', zodiac_association: 'Moon', hebrew_letter: 'Gimel', number_roman: 'II' },
  { card_id: '3', name: 'The Empress', number: 3, arcana: 'major', keywords: ['femininity', 'beauty', 'nature', 'abundance', 'nurturing'], meaning_upright: 'Femininity, beauty, nature, abundance, nurturing. Creative energy flows through you. Nurture your projects and relationships. Abundance surrounds you.', meaning_reversed: 'Creative block, dependence, neglect. You may be neglecting self-care or stifling creativity. Reconnect with nature and your creative essence.', element: 'Earth', zodiac_association: 'Venus', hebrew_letter: 'Daleth', number_roman: 'III' },
  { card_id: '4', name: 'The Emperor', number: 4, arcana: 'major', keywords: ['authority', 'structure', 'control', 'fatherhood'], meaning_upright: 'Authority, structure, control, fatherhood. Take charge of your life with confidence. Establish order and boundaries. Lead with wisdom and strength.', meaning_reversed: 'Tyranny, rigidity, lack of discipline. You may be too controlling or lacking structure. Find balance between authority and flexibility.', element: 'Fire', zodiac_association: 'Aries', hebrew_letter: 'He', number_roman: 'IV' },
  { card_id: '5', name: 'The Hierophant', number: 5, arcana: 'major', keywords: ['tradition', 'conformity', 'morality', 'ethics', 'spiritual wisdom'], meaning_upright: 'Tradition, conformity, morality, ethics, spiritual wisdom. Seek guidance from established wisdom. Learn from teachers and traditions. Honor your spiritual path.', meaning_reversed: 'Rebellion, nonconformity, dogmatism. You may be rejecting tradition blindly or following it without question. Find your own spiritual truth.', element: 'Earth', zodiac_association: 'Taurus', hebrew_letter: 'Vav', number_roman: 'V' },
  { card_id: '6', name: 'The Lovers', number: 6, arcana: 'major', keywords: ['love', 'harmony', 'relationships', 'values alignment', 'choices'], meaning_upright: 'Love, harmony, relationships, values alignment, choices. A significant partnership or choice based on values. Choose what aligns with your heart.', meaning_reversed: 'Disharmony, imbalance, misaligned values. Relationship tensions or difficult choices. Examine whether your connections reflect your true values.', element: 'Air', zodiac_association: 'Gemini', hebrew_letter: 'Zayin', number_roman: 'VI' },
  { card_id: '7', name: 'The Chariot', number: 7, arcana: 'major', keywords: ['control', 'willpower', 'victory', 'assertion', 'determination'], meaning_upright: 'Control, willpower, victory, assertion, determination. You have the drive to overcome obstacles. Stay focused and steer your life with confidence.', meaning_reversed: 'Lack of control, aggression, defeat. You may be pushing too hard or losing direction. Regain control and align your actions with your goals.', element: 'Water', zodiac_association: 'Cancer', hebrew_letter: 'Cheth', number_roman: 'VII' },
  { card_id: '8', name: 'Strength', number: 8, arcana: 'major', keywords: ['strength', 'courage', 'patience', 'control', 'compassion'], meaning_upright: 'Strength, courage, patience, control, compassion. Inner strength tames the beast. Face challenges with gentle power and compassion.', meaning_reversed: 'Self-doubt, weakness, insecurity. You may feel powerless or act aggressively from fear. Cultivate inner confidence and self-compassion.', element: 'Fire', zodiac_association: 'Leo', hebrew_letter: 'Teth', number_roman: 'VIII' },
  { card_id: '9', name: 'The Hermit', number: 9, arcana: 'major', keywords: ['soul searching', 'introspection', 'being alone', 'inner guidance'], meaning_upright: 'Soul searching, introspection, being alone, inner guidance. Take time for solitude and reflection. Your inner light guides the way.', meaning_reversed: 'Isolation, loneliness, withdrawal. You may be avoiding necessary introspection or isolating excessively. Seek balance between solitude and connection.', element: 'Earth', zodiac_association: 'Virgo', hebrew_letter: 'Yod', number_roman: 'IX' },
  { card_id: '10', name: 'Wheel of Fortune', number: 10, arcana: 'major', keywords: ['good luck', 'karma', 'life cycles', 'destiny', 'turning point'], meaning_upright: 'Good luck, karma, life cycles, destiny, turning point. The wheel turns in your favor. Embrace change as part of the cosmic cycle.', meaning_reversed: 'Bad luck, resistance to change, negative cycles. You may be fighting inevitable changes. Accept the cycles of life and adapt.', element: 'Fire', zodiac_association: 'Jupiter', hebrew_letter: 'Kaph', number_roman: 'X' },
  { card_id: '11', name: 'Justice', number: 11, arcana: 'major', keywords: ['justice', 'fairness', 'truth', 'cause and effect', 'law'], meaning_upright: 'Justice, fairness, truth, cause and effect, law. Truth prevails. Decisions made now have karmic consequences. Act with integrity.', meaning_reversed: 'Injustice, dishonesty, unfairness. You may be avoiding accountability or facing biased judgment. Seek truth and make amends.', element: 'Air', zodiac_association: 'Libra', hebrew_letter: 'Lamed', number_roman: 'XI' },
  { card_id: '12', name: 'The Hanged Man', number: 12, arcana: 'major', keywords: ['pause', 'surrender', 'letting go', 'new perspectives'], meaning_upright: 'Pause, surrender, letting go, new perspectives. Voluntary sacrifice brings new understanding. See things from a different angle.', meaning_reversed: 'Stalling, resistance, martyrdom. You may be avoiding necessary sacrifice or feeling stuck. Release control and allow new perspectives.', element: 'Water', zodiac_association: 'Neptune', hebrew_letter: 'Mem', number_roman: 'XII' },
  { card_id: '13', name: 'Death', number: 13, arcana: 'major', keywords: ['endings', 'change', 'transformation', 'transition'], meaning_upright: 'Endings, change, transformation, transition. A necessary ending makes way for rebirth. Embrace the transformation.', meaning_reversed: 'Resistance to change, stagnation, partial endings. You may be clinging to what must end. Allow the natural cycle of death and rebirth.', element: 'Water', zodiac_association: 'Scorpio', hebrew_letter: 'Nun', number_roman: 'XIII' },
  { card_id: '14', name: 'Temperance', number: 14, arcana: 'major', keywords: ['balance', 'moderation', 'patience', 'purpose', 'meaning'], meaning_upright: 'Balance, moderation, patience, purpose, meaning. Blend opposites to find harmony. Practice moderation in all things.', meaning_reversed: 'Imbalance, excess, impatience. You may be overindulging or lacking patience. Restore equilibrium and find your center.', element: 'Fire', zodiac_association: 'Sagittarius', hebrew_letter: 'Samekh', number_roman: 'XIV' },
  { card_id: '15', name: 'The Devil', number: 15, arcana: 'major', keywords: ['shadow self', 'attachment', 'addiction', 'restriction', 'sexuality'], meaning_upright: 'Shadow self, attachment, addiction, restriction, sexuality. Confront your shadows. Recognize unhealthy patterns and choose freedom.', meaning_reversed: 'Release, detachment, breaking free. You are liberating yourself from bondage. Continue the work of shadow integration.', element: 'Earth', zodiac_association: 'Capricorn', hebrew_letter: 'Ayin', number_roman: 'XV' },
  { card_id: '16', name: 'The Tower', number: 16, arcana: 'major', keywords: ['sudden change', 'upheaval', 'chaos', 'revelation', 'awakening'], meaning_upright: 'Sudden change, upheaval, chaos, revelation, awakening. False structures collapse. Though shocking, this clears the way for truth.', meaning_reversed: 'Fear of change, delayed disaster, internal upheaval. The transformation is happening internally. Embrace the necessary breakdown.', element: 'Fire', zodiac_association: 'Mars', hebrew_letter: 'Pe', number_roman: 'XVI' },
  { card_id: '17', name: 'The Star', number: 17, arcana: 'major', keywords: ['hope', 'faith', 'purpose', 'renewal', 'spirituality'], meaning_upright: 'Hope, faith, purpose, renewal, spirituality. After the storm, healing arrives. Trust in the universe and your path forward.', meaning_reversed: 'Despair, lack of faith, disconnection. You may feel hopeless or lost. Reconnect with your inner light and hope.', element: 'Air', zodiac_association: 'Aquarius', hebrew_letter: 'Tzaddi', number_roman: 'XVII' },
  { card_id: '18', name: 'The Moon', number: 18, arcana: 'major', keywords: ['illusion', 'fear', 'anxiety', 'subconscious', 'intuition'], meaning_upright: 'Illusion, fear, anxiety, subconscious, intuition. Things are not as they seem. Trust your intuition to navigate uncertainty.', meaning_reversed: 'Confusion, repressed fears, deception releasing. The fog is lifting. Face your fears and trust your inner knowing.', element: 'Water', zodiac_association: 'Pisces', hebrew_letter: 'Qoph', number_roman: 'XVIII' },
  { card_id: '19', name: 'The Sun', number: 19, arcana: 'major', keywords: ['positivity', 'fun', 'warmth', 'success', 'vitality'], meaning_upright: 'Positivity, fun, warmth, success, vitality. Joy and success shine upon you. Radiate confidence and share your light.', meaning_reversed: 'Temporary clouding, excessive optimism, burnout. Joy may be delayed but not denied. Rest and recharge your solar energy.', element: 'Fire', zodiac_association: 'Sun', hebrew_letter: 'Resh', number_roman: 'XIX' },
  { card_id: '20', name: 'Judgement', number: 20, arcana: 'major', keywords: ['judgement', 'rebirth', 'inner calling', 'absolution'], meaning_upright: 'Judgement, rebirth, inner calling, absolution. A higher calling awakens. Rise to your true purpose and forgive the past.', meaning_reversed: 'Self-doubt, ignoring the call, self-criticism. You may be resisting your transformation. Answer the call and release self-judgment.', element: 'Fire', zodiac_association: 'Pluto', hebrew_letter: 'Shin', number_roman: 'XX' },
  { card_id: '21', name: 'The World', number: 21, arcana: 'major', keywords: ['completion', 'integration', 'accomplishment', 'travel'], meaning_upright: 'Completion, integration, accomplishment, travel. A cycle completes successfully. Celebrate your achievement and prepare for the next level.', meaning_reversed: 'Incompletion, delays, lack of closure. You may feel unfinished. Tie up loose ends and acknowledge your progress.', element: 'Earth', zodiac_association: 'Saturn', hebrew_letter: 'Tau', number_roman: 'XXI' },
];

const SUITS = ['wands', 'cups', 'swords', 'pentacles'] as const;
const SUIT_NAMES: Record<string, string> = { wands: 'Wands', cups: 'Cups', swords: 'Swords', pentacles: 'Pentacles' };
const SUIT_ELEMENTS: Record<string, string> = { wands: 'Fire', cups: 'Water', swords: 'Air', pentacles: 'Earth' };
const SUIT_SYMBOLS: Record<string, string> = { wands: '♣', cups: '♥', swords: '♠', pentacles: '♦' };
const SUIT_COLORS: Record<string, string> = { wands: '#fbbf24', cups: '#3b82f6', swords: '#e5e7eb', pentacles: '#22c55e' };

const MINOR_RANKS = [
  { number: 1, name: 'Ace', keywords: ['new beginnings', 'potential', 'opportunity'] },
  { number: 2, name: 'Two', keywords: ['balance', 'partnership', 'duality', 'choices'] },
  { number: 3, name: 'Three', keywords: ['growth', 'expansion', 'creativity', 'collaboration'] },
  { number: 4, name: 'Four', keywords: ['stability', 'structure', 'rest', 'contemplation'] },
  { number: 5, name: 'Five', keywords: ['conflict', 'loss', 'change', 'adversity', 'growth through challenge'] },
  { number: 6, name: 'Six', keywords: ['harmony', 'balance', 'giving', 'receiving', 'progress'] },
  { number: 7, name: 'Seven', keywords: ['assessment', 'patience', 'perseverance', 'spiritual growth'] },
  { number: 8, name: 'Eight', keywords: ['movement', 'action', 'power', 'mastery', 'progress'] },
  { number: 9, name: 'Nine', keywords: ['fruition', 'attainment', 'wisdom', 'completion', 'reflection'] },
  { number: 10, name: 'Ten', keywords: ['completion', 'fulfillment', 'end of cycle', 'transition'] },
  { number: 11, name: 'Page', keywords: ['messenger', 'curiosity', 'beginnings', 'learning', 'potential'] },
  { number: 12, name: 'Knight', keywords: ['action', 'movement', 'quest', 'idealism', 'energy'] },
  { number: 13, name: 'Queen', keywords: ['nurturing', 'maturity', 'embodiment', 'compassion', 'mastery'] },
  { number: 14, name: 'King', keywords: ['authority', 'mastery', 'leadership', 'control', 'vision'] },
];

function generateMinorArcana(): DeckCard[] {
  const cards: DeckCard[] = [];
  for (const suit of SUITS) {
    for (const rank of MINOR_RANKS) {
      const cardName = `${rank.name} of ${SUIT_NAMES[suit]}`;
      const cardId = `${suit}-${rank.number}`;
      const element = SUIT_ELEMENTS[suit];
      
      cards.push({
        card_id: cardId,
        name: cardName,
        arcana: 'minor',
        suit: suit,
        number: rank.number,
        keywords: rank.keywords,
        meaning_upright: `${rank.name} of ${SUIT_NAMES[suit]}: ${rank.keywords.join(', ')}. This card brings the energy of ${element.toLowerCase()} in its ${rank.name.toLowerCase()} expression.`,
        meaning_reversed: `Reversed ${rank.name} of ${SUIT_NAMES[suit]}: Blocked or internalized ${element.toLowerCase()} energy. The lessons of this card are being experienced internally or with delay.`,
        element,
        zodiac_association: '',
        hebrew_letter: '',
        number_roman: rank.number <= 10 ? rank.number.toString() : '',
      });
    }
  }
  return cards;
}

const FULL_DECK: DeckCard[] = [...MAJOR_ARCANA_CARDS, ...generateMinorArcana()];

export interface DeckGridProps {
  /** Initial deck data (defaults to full deck) */
  initialDeck?: DeckCard[];
  /** Search/filter query */
  searchQuery?: string;
  /** Callback when search changes */
  onSearchChange?: (query: string) => void;
  /** Click handler for cards */
  onCardClick?: (card: DeckCard) => void;
}

function getCardNumberRoman(num: number): string {
  const romans: Record<number, string> = { 0: '0', 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII', 13: 'XIII', 14: 'XIV', 15: 'XV', 16: 'XVI', 17: 'XVII', 18: 'XVIII', 19: 'XIX', 20: 'XX', 21: 'XXI' };
  return romans[num] || num.toString();
}

/**
 * DeckGrid - 78-card grid with Major Arcana row and Minor by suit
 */
export function DeckGrid({
  initialDeck = FULL_DECK,
  searchQuery = '',
  onSearchChange,
  onCardClick,
}: DeckGridProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [selectedCard, setSelectedCard] = useState<DeckCard | null>(null);
  const [showMeaningModal, setShowMeaningModal] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeSuitFilter, setActiveSuitFilter] = useState<'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'>('all');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
    onSearchChange?.(value);
  }, [onSearchChange]);

  const filteredCards = useMemo(() => {
    return initialDeck.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        card.keywords?.some(k => k.toLowerCase().includes(localSearch.toLowerCase()));
      
      const matchesFilter = activeSuitFilter === 'all' || 
        (activeSuitFilter === 'major' && card.arcana === 'major') ||
        (card.arcana === 'minor' && card.suit === activeSuitFilter);
      
      return matchesSearch && matchesFilter;
    });
  }, [initialDeck, localSearch, activeSuitFilter]);

  const majorArcana = useMemo(() => filteredCards.filter(c => c.arcana === 'major'), [filteredCards]);
  const minorBySuit = useMemo(() => {
    const suits = ['wands', 'cups', 'swords', 'pentacles'] as const;
    const result: Record<string, DeckCard[]> = {};
    for (const suit of suits) {
      result[suit] = filteredCards.filter(c => c.arcana === 'minor' && c.suit === suit);
    }
    return result;
  }, [filteredCards]);

  const handleCardClick = useCallback((card: DeckCard) => {
    const meaningData: CardMeaningData = {
      ...card,
      orientation: 'upright',
      imageUrl: card.imageUrl,
    };
    setSelectedCard(meaningData);
    setShowMeaningModal(true);
    onCardClick?.(card);
  }, [onCardClick]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <GoldTriangle orientation="down" size="lg" aria-hidden="true" />
          <h1 className="text-display font-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Tarot Deck
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Input
            placeholder="Search cards..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            leftIcon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>}
            className="w-64"
          />
        </div>
      </div>

      {/* Suit Filters */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by suit">
        <button
          role="tab"
          aria-selected={activeSuitFilter === 'all'}
          onClick={() => setActiveSuitFilter('all')}
          className={cn(
            'px-3 py-1.5 rounded-pill text-caption font-medium transition-all duration-standard ease-out-expo',
            'focus-visible:outline-none focus-visible:shadow-focus',
            activeSuitFilter === 'all'
              ? 'bg-accent-gold text-bg-primary'
              : 'bg-bg-panel text-text-muted hover:text-text-primary hover:bg-bg-hover border border-border-subtle'
          )}
        >
          All ({filteredCards.length})
        </button>
        <button
          role="tab"
          aria-selected={activeSuitFilter === 'major'}
          onClick={() => setActiveSuitFilter('major')}
          className={cn(
            'px-3 py-1.5 rounded-pill text-caption font-medium transition-all duration-standard ease-out-expo',
            'focus-visible:outline-none focus-visible:shadow-focus',
            activeSuitFilter === 'major'
              ? 'bg-accent-gold text-bg-primary'
              : 'bg-bg-panel text-text-muted hover:text-text-primary hover:bg-bg-hover border border-border-subtle'
          )}
        >
          Major Arcana ({majorArcana.length})
        </button>
        {SUITS.map(suit => (
          <button
            key={suit}
            role="tab"
            aria-selected={activeSuitFilter === suit}
            onClick={() => setActiveSuitFilter(suit)}
            className={cn(
              'px-3 py-1.5 rounded-pill text-caption font-medium transition-all duration-standard ease-out-expo flex items-center gap-1',
              'focus-visible:outline-none focus-visible:shadow-focus',
              activeSuitFilter === suit
                ? 'bg-accent-gold text-bg-primary'
                : 'bg-bg-panel text-text-muted hover:text-text-primary hover:bg-bg-hover border border-border-subtle'
            )}
            style={{ color: activeSuitFilter === suit ? undefined : SUIT_COLORS[suit] }}
          >
            <span aria-hidden="true">{SUIT_SYMBOLS[suit]}</span>
            {SUIT_NAMES[suit]} ({minorBySuit[suit]?.length || 0})
          </button>
        ))}
      </div>

      {/* Major Arcana Section */}
      {majorArcana.length > 0 && (
        <section aria-labelledby="major-arcana-heading">
          <h2 id="major-arcana-heading" className="text-heading-3 font-display font-medium text-text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <GoldTriangle orientation="down" size="sm" aria-hidden="true" />
            Major Arcana
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
            {majorArcana.map((card) => (
              <TarotCard
                key={card.card_id}
                name={card.name}
                arcana={card.arcana}
                number={card.number}
                orientation="upright"
                faceUp={true}
                interactive={true}
                onFlip={() => handleCardClick(card)}
                size="md"
                highlightMajor={true}
                keywords={card.keywords?.slice(0, 2)}
                imageUrl={card.imageUrl}
                className="group"
              />
            ))}
          </div>
        </section>
      )}

      {/* Minor Arcana Sections */}
      {SUITS.map((suit) => {
        const suitCards = minorBySuit[suit] || [];
        if (suitCards.length === 0) return null;

        return (
          <section key={suit} aria-labelledby={`${suit}-heading`} className="space-y-4">
            <h2 id={`${suit}-heading`} className="text-heading-3 font-display font-medium text-text-primary flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: SUIT_COLORS[suit] }}>
              <GoldTriangle orientation="down" size="sm" aria-hidden="true" style={{ color: SUIT_COLORS[suit] }} />
              <span aria-hidden="true">{SUIT_SYMBOLS[suit]}</span>
              {SUIT_NAMES[suit]} ({suitCards.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
              {suitCards.map((card) => (
                <TarotCard
                  key={card.card_id}
                  name={card.name}
                  arcana={card.arcana}
                  suit={card.suit}
                  number={card.number}
                  orientation="upright"
                  faceUp={true}
                  interactive={true}
                  onFlip={() => handleCardClick(card)}
                  size="md"
                  highlightMajor={false}
                  keywords={card.keywords?.slice(0, 2)}
                  imageUrl={card.imageUrl}
                  className="group"
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Card Meaning Modal */}
      <CardMeaningModal
        isOpen={showMeaningModal}
        onClose={() => setShowMeaningModal(false)}
        card={selectedCard}
      />
    </div>
  );
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReadingForm, DEFAULT_SPREADS } from '@/components/tarot/ReadingForm';

interface GeneratedReading {
  id: string;
  spread: string;
  spread_key: string;
  question?: string;
  cards: Array<{
    card: string;
    orientation: string;
    arcana: string;
    suit?: string;
    position: string;
  }>;
  timestamp: number;
}

/**
 * Reading Page - /dashboard/tarot/reading
 * Spread selection, question input, and generate button
 */
export default function ReadingPage() {
  const [selectedSpread, setSelectedSpread] = useState<string>('three_card');
  const [question, setQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [previewCards, setPreviewCards] = useState<Array<{
    name: string;
    arcana: 'major' | 'minor';
    suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
    number?: number;
    orientation: 'upright' | 'reversed';
    faceUp: boolean;
    interactive: boolean;
    size: 'sm' | 'md' | 'lg' | 'xl';
    highlightMajor: boolean;
    position: string;
    positionIndex: number;
  }>>([]);

  // Generate preview cards for selected spread
  useEffect(() => {
    const spread = DEFAULT_SPREADS.find(s => s.key === selectedSpread);
    if (spread) {
      const cards = spread.positions.map((pos, idx) => ({
        name: `Card ${idx + 1}`,
        arcana: idx === 0 ? 'major' as const : 'minor' as const,
        suit: idx > 0 ? 'wands' as const : undefined,
        number: idx + 1,
        orientation: 'upright' as const,
        faceUp: false,
        interactive: false,
        size: 'sm' as const,
        highlightMajor: idx === 0,
        position: pos.name,
        positionIndex: idx,
      }));
      setPreviewCards(cards);
    }
  }, [selectedSpread, DEFAULT_SPREADS]);

  const handleGenerate = useCallback(async (spreadKey: string, q: string) => {
    setIsGenerating(true);
    setError(undefined);
    
    try {
      const res = await fetch('/api/tarot/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spread: spreadKey, question: q.trim() || undefined }),
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Failed to generate reading' }));
        throw new Error(err.detail || 'Failed to generate reading');
      }
      
      const reading: GeneratedReading = await res.json();
      
      // Navigate to reading detail page
      window.location.href = `/dashboard/tarot/reading/${reading.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate reading');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <ReadingForm
        spreads={DEFAULT_SPREADS}
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
    </div>
  );
}
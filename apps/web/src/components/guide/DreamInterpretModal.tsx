'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Brain, Loader2, CheckCircle, Copy, Heart, Moon, Sun, Star, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GoldTriangle } from '@/components/ui/GoldTriangle';

interface DreamEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  lucid: boolean;
  symbols: string[];
  emotions: string[];
  sleepQuality: number;
  interpreted: boolean;
  interpretation?: string;
  createdAt: number;
}

interface DreamInterpretModalProps {
  isOpen: boolean;
  onClose: () => void;
  dream: DreamEntry;
  onComplete: (dreamId: string, interpretation: string) => void;
}

export function DreamInterpretModal({ isOpen, onClose, dream, onComplete }: DreamInterpretModalProps) {
  const [interpretation, setInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && !dream.interpreted) {
      interpretDream();
    } else if (isOpen && dream.interpretation) {
      setInterpretation(dream.interpretation);
    }
  }, [isOpen, dream]);

  const interpretDream = async () => {
    setIsLoading(true);
    setError(null);
    setInterpretation('');

    try {
      // Simulate API call to /api/guide/interpret-dream
      const response = await fetch('/api/guide/interpret-dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: dream.title,
          content: dream.content,
          lucid: dream.lucid,
          symbols: dream.symbols,
          emotions: dream.emotions,
          sleepQuality: dream.sleepQuality,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to interpret dream');
      }

      const data = await response.json();
      setInterpretation(data.interpretation || 'Unable to generate interpretation at this time.');
    } catch (err) {
      // Fallback interpretation for demo
      setTimeout(() => {
        const fallback = generateFallbackInterpretation(dream);
        setInterpretation(fallback);
        setIsLoading(false);
      }, 1500);
    }
  };

  const generateFallbackInterpretation = (dream: DreamEntry): string => {
    const symbolText = dream.symbols.length > 0 
      ? `The symbols of ${dream.symbols.slice(0, 3).join(', ')}` 
      : 'The imagery in your dream';
    
    const emotionText = dream.emotions.length > 0
      ? `reflect ${dream.emotions.slice(0, 2).join(' and ')}`
      : 'carry emotional significance';

    const lucidText = dream.lucid 
      ? 'Your lucid awareness within the dream suggests a growing capacity for conscious exploration of your inner landscape. '
      : '';

    return `${symbolText} ${emotionText}, pointing to themes of transformation and self-discovery. ${lucidText}The sleep quality rating of ${dream.sleepQuality}/5 indicates ${dream.sleepQuality >= 4 ? 'restorative' : dream.sleepQuality >= 3 ? 'adequate' : 'disrupted'} rest, which may influence dream vividness. Consider how these elements connect to your current waking life circumstances. This dream may be inviting you to explore ${dream.symbols[0]?.toLowerCase() || 'the unknown'} as a metaphor for personal growth.`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(interpretation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (interpretation) {
      onComplete(dream.id, interpretation);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="AI Dream Interpretation"
      description={`${dream.lucid ? 'Lucid ' : ''}Dream: "${dream.title}"`}
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <ModalBody>
        <div className="space-y-6">
          {/* Dream Summary */}
          <Card variant="default" padding="default">
            <div className="flex items-start gap-3">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', dream.lucid ? 'bg-yellow-500/15' : 'bg-purple-500/15')}>
                {dream.lucid ? <Sun className="h-6 w-6 text-yellow-400" /> : <Moon className="h-6 w-6 text-purple-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-heading-3 font-display font-medium text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                  {dream.title}
                </h4>
                <p className="text-body-sm text-text-muted mt-1 line-clamp-2">{dream.content}</p>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-caption text-text-muted">
                  <span className="flex items-center gap-1">
                    <Moon className="h-3 w-3" aria-hidden="true" />
                    {new Date(dream.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" aria-hidden="true" />
                    Sleep: {dream.sleepQuality}/5
                  </span>
                  {dream.symbols.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      {dream.symbols.slice(0, 2).join(', ')}
                      {dream.symbols.length > 2 && <span>+{dream.symbols.length - 2}</span>}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Interpretation */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GoldTriangle orientation="down" size="sm" aria-hidden="true" />
              <h3 className="text-heading-3 font-display font-medium text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                Interpretation
              </h3>
            </div>

            {isLoading ? (
              <Card variant="default" padding="lg" className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 text-accent-gold animate-spin" aria-hidden="true" />
                  <p className="text-body-md text-text-secondary">Consulting the stars...</p>
                  <p className="text-caption text-text-muted">Analyzing symbols, emotions, and archetypal patterns</p>
                </div>
              </Card>
            ) : error ? (
              <Card variant="default" padding="lg" className="border-danger/30">
                <div className="flex items-center gap-3 text-danger">
                  <AlertCircle className="h-5 w-5" aria-hidden="true" />
                  <p className="text-body-md">{error}</p>
                </div>
                <Button variant="secondary" className="mt-4" onClick={interpretDream}>
                  <Loader2 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Try Again
                </Button>
              </Card>
            ) : (
              <Card variant="default" padding="lg">
                <div className="prose prose-invert max-w-none">
                  <p className="text-body-md text-text-secondary whitespace-pre-wrap">{interpretation}</p>
                </div>
                <div className="flex items-center justify-end gap-2 mt-4">
                  <Button variant="ghost" size="sm" onClick={handleCopy} aria-label={copied ? 'Copied' : 'Copy interpretation'}>
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-success mr-1" aria-hidden="true" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" aria-hidden="true" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Save Prompt */}
          {!isLoading && interpretation && !dream.interpreted && (
            <div className="p-4 bg-accent-gold/5 border border-accent-gold-border rounded-lg">
              <p className="text-body-sm text-text-secondary text-center">
                Save this interpretation to your dream journal for future reference.
              </p>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Close
        </Button>
        {!isLoading && interpretation && !dream.interpreted && (
          <Button variant="primary" onClick={handleSave}>
            <CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />
            Save Interpretation
          </Button>
        )}
        {dream.interpreted && (
          <Button variant="ghost" onClick={onClose}>
            Done
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
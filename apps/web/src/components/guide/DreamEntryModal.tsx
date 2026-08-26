'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Sparkles, Heart, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface DreamEntryData {
  title: string;
  content: string;
  date: string;
  lucid: boolean;
  symbols: string[];
  emotions: string[];
  sleepQuality: number;
}

interface DreamEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<DreamEntryData, 'id' | 'createdAt' | 'interpreted'>) => void;
  initialData?: DreamEntryData;
  onUpdate?: (data: Partial<DreamEntryData>) => void;
}

const EMOTION_OPTIONS = [
  { value: 'peaceful', label: 'Peaceful' },
  { value: 'anxious', label: 'Anxious' },
  { value: 'joyful', label: 'Joyful' },
  { value: 'sad', label: 'Sad' },
  { value: 'fearful', label: 'Fearful' },
  { value: 'curious', label: 'Curious' },
  { value: 'confused', label: 'Confused' },
  { value: 'empowered', label: 'Empowered' },
  { value: 'vulnerable', label: 'Vulnerable' },
  { value: 'nostalgic', label: 'Nostalgic' },
  { value: 'angry', label: 'Angry' },
  { value: 'grateful', label: 'Grateful' },
];

const SYMBOL_SUGGESTIONS = [
  'Water', 'Fire', 'Flying', 'Falling', 'Animals', 'Doors',
  'Keys', 'Mirrors', 'Stairs', 'Vehicles', 'Houses', 'Nature',
  'Numbers', 'Colors', 'People', 'Objects', 'Places', 'Time'
];

const SLEEP_QUALITY_OPTIONS = [
  { value: '1', label: '1 - Very Poor' },
  { value: '2', label: '2 - Poor' },
  { value: '3', label: '3 - Average' },
  { value: '4', label: '4 - Good' },
  { value: '5', label: '5 - Excellent' },
];

export function DreamEntryModal({ isOpen, onClose, onSubmit, initialData, onUpdate }: DreamEntryModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [lucid, setLucid] = useState(false);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [symbolInput, setSymbolInput] = useState('');
  const [emotions, setEmotions] = useState<string[]>([]);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [showSymbolSuggestions, setShowSymbolSuggestions] = useState(false);
  const [showEmotionSuggestions, setShowEmotionSuggestions] = useState(false);
  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setContent(initialData.content);
        setDate(initialData.date);
        setLucid(initialData.lucid);
        setSymbols(initialData.symbols);
        setEmotions(initialData.emotions);
        setSleepQuality(initialData.sleepQuality);
      } else {
        // Reset to defaults for new entry
        const today = new Date().toISOString().split('T')[0];
        setTitle('');
        setContent('');
        setDate(today);
        setLucid(false);
        setSymbols([]);
        setEmotions([]);
        setSleepQuality(3);
      }
    }
  }, [isOpen, initialData]);

  const handleAddSymbol = () => {
    const symbol = symbolInput.trim();
    if (symbol && !symbols.includes(symbol)) {
      setSymbols([...symbols, symbol]);
      setSymbolInput('');
    }
  };

  const handleRemoveSymbol = (symbol: string) => {
    setSymbols(symbols.filter(s => s !== symbol));
  };

  const handleAddEmotion = (emotion: string) => {
    if (!emotions.includes(emotion)) {
      setEmotions([...emotions, emotion]);
    }
  };

  const handleRemoveEmotion = (emotion: string) => {
    setEmotions(emotions.filter(e => e !== emotion));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const data: Omit<DreamEntryData, 'id' | 'createdAt' | 'interpreted'> = {
      title: title.trim(),
      content: content.trim(),
      date,
      lucid,
      symbols,
      emotions,
      sleepQuality,
    };

    if (isEditing && onUpdate) {
      onUpdate(data);
    } else {
      onSubmit(data);
    }
  };

  const filteredSymbols = SYMBOL_SUGGESTIONS.filter(s => 
    s.toLowerCase().includes(symbolInput.toLowerCase()) && !symbols.includes(s)
  );

  const filteredEmotions = EMOTION_OPTIONS.filter(e => 
    e.label.toLowerCase().includes(symbolInput.toLowerCase()) && !emotions.includes(e.value)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={isEditing ? 'Edit Dream Entry' : 'New Dream Entry'}
      description="Record your dream details for pattern tracking and AI interpretation"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-6">
            {/* Title */}
            <Input
              label="Dream Title"
              placeholder="e.g., Flying over mountains"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Date */}
            <Input
              label="Dream Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
            />

            {/* Content */}
            <Textarea
              label="Dream Content"
              placeholder="Describe your dream in detail..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
            />

            {/* Lucid Checkbox */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lucid}
                  onChange={(e) => setLucid(e.target.checked)}
                  className="w-4 h-4 rounded border-border-standard text-accent-gold focus:ring-accent-gold"
                />
                <span className="text-body-md text-text-primary">Lucid Dream</span>
              </label>
              {lucid && (
                <Badge variant="gold" className="flex items-center gap-1">
                  <Sun className="h-3 w-3" aria-hidden="true" />
                  Lucid
                </Badge>
              )}
            </div>

            {/* Symbols */}
            <div>
              <label className="label-base block mb-2">Symbols & Themes</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {symbols.map((symbol) => (
                  <Badge key={symbol} variant="subtle" className="gap-1">
                    {symbol}
                    <button
                      type="button"
                      onClick={() => handleRemoveSymbol(symbol)}
                      className="ml-1 hover:text-danger"
                      aria-label={`Remove ${symbol}`}
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="relative">
                <Input
                  placeholder="Add a symbol (e.g., Water, Flying, Keys)..."
                  value={symbolInput}
                  onChange={(e) => {
                    setSymbolInput(e.target.value);
                    setShowSymbolSuggestions(true);
                  }}
                  onFocus={() => setShowSymbolSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSymbolSuggestions(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSymbol();
                    }
                  }}
                  rightIcon={
                    symbols.length > 0 && (
                      <span className="text-caption text-text-muted">{symbols.length} symbols</span>
                    )
                  }
                />
                {showSymbolSuggestions && filteredSymbols.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-bg-elevated border border-border-standard rounded-lg shadow-elevated max-h-40 overflow-y-auto">
                    {filteredSymbols.map((symbol) => (
                      <button
                        key={symbol}
                        type="button"
                        onClick={() => {
                          setSymbolInput(symbol);
                          handleAddSymbol();
                          setShowSymbolSuggestions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-body-sm text-text-primary hover:bg-bg-hover"
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Emotions */}
            <div>
              <label className="label-base block mb-2">Emotions</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {emotions.map((emotion) => (
                  <Badge key={emotion} variant="subtle" className="gap-1">
                    {EMOTION_OPTIONS.find(e => e.value === emotion)?.label || emotion}
                    <button
                      type="button"
                      onClick={() => handleRemoveEmotion(emotion)}
                      className="ml-1 hover:text-danger"
                      aria-label={`Remove ${emotion}`}
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {EMOTION_OPTIONS.map((emotion) => (
                  <button
                    key={emotion.value}
                    type="button"
                    onClick={() => handleAddEmotion(emotion.value)}
                    disabled={emotions.includes(emotion.value)}
                    className={cn(
                      'px-3 py-1.5 rounded-pill text-sm font-medium transition-all',
                      emotions.includes(emotion.value)
                        ? 'bg-accent-gold text-bg-primary'
                        : 'bg-bg-panel text-text-muted border border-border-subtle hover:border-accent-gold hover:text-accent-gold'
                    )}
                    aria-pressed={emotions.includes(emotion.value)}
                  >
                    {emotion.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sleep Quality */}
            <div>
              <label className="label-base block mb-2">Sleep Quality</label>
              <Select
                value={sleepQuality.toString()}
                onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                options={SLEEP_QUALITY_OPTIONS}
                placeholder="Select sleep quality"
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!title.trim() || !content.trim()}>
            <Check className="h-4 w-4 mr-2" aria-hidden="true" />
            {isEditing ? 'Save Changes' : 'Save Dream'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Bell, BellOff, X, Check, Heart, Brain, Smile, Frown, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { GoldTriangle } from '@/components/ui/GoldTriangle';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { Divider } from '@/components/ui/Divider';

interface MeditationType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  defaultDuration: number;
  chimes: boolean;
}

interface SessionData {
  preMood?: number;
  postMood?: number;
  notes?: string;
}

interface MeditationPlayerProps {
  type: MeditationType;
  duration: number;
  onComplete: (sessionData: SessionData) => void;
  onClose: () => void;
}

const CHIME_INTERVALS = [5, 10, 15, 20, 25, 30]; // minutes

export function MeditationPlayer({ type, duration, onComplete, onClose }: MeditationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime] = useState(duration * 60); // seconds
  const [chimesEnabled, setChimesEnabled] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [preMood, setPreMood] = useState<number | null>(null);
  const [postMood, setPostMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [chimeTimes, setChimeTimes] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate chime times based on duration
  useEffect(() => {
    const times: number[] = [];
    for (let i = 1; i <= duration; i++) {
      if (CHIME_INTERVALS.includes(i)) {
        times.push(i * 60);
      }
    }
    setChimeTimes(times);
  }, [duration]);

  // TTS for guidance
  const speakGuidance = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = volume;
      ttsRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  }, [volume]);

  // Play chime sound
  const playChime = useCallback(() => {
    if (!chimesEnabled) return;
    // Create a simple chime using Web Audio API
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    oscillator.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.5); // E5
    
    gainNode.gain.setValueAtTime(0.3 * volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 1.5);
  }, [chimesEnabled, volume]);

  // Timer logic
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          
          // Check for chime times
          if (chimesEnabled && chimeTimes.includes(next)) {
            playChime();
          }
          
          // Speak guidance at certain intervals
          if (next === 10) {
            speakGuidance('Welcome to your meditation. Settle into a comfortable position.');
          } else if (next === 30) {
            speakGuidance('Bring your attention to your breath. Notice the natural rhythm.');
          } else if (next === totalTime - 30) {
            speakGuidance('Begin to gently return your awareness to the room.');
          } else if (next === totalTime - 10) {
            speakGuidance('When you are ready, slowly open your eyes.');
          }
          
          if (next >= totalTime) {
            handleComplete();
            return totalTime;
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, totalTime, chimesEnabled, chimeTimes, playChime, speakGuidance]);

  const handleComplete = () => {
    setIsPlaying(false);
    speakGuidance('Your meditation session is complete. Take a moment to notice how you feel.');
    setTimeout(() => {
      setShowMoodModal(true);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? (currentTime / totalTime) * 100 : 0;

  const handlePlayPause = () => {
    if (isPlaying) {
      speechSynthesis.pause();
    } else {
      speechSynthesis.resume();
      // Initial guidance
      if (currentTime === 0) {
        speakGuidance(`Beginning ${type.name} meditation for ${duration} minutes. Find a comfortable position and close your eyes.`);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (seconds: number) => {
    setCurrentTime(prev => Math.max(0, Math.min(totalTime, prev + seconds)));
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  };

  const handleMoodSubmit = () => {
    if (preMood !== null && postMood !== null) {
      onComplete({ preMood, postMood, notes });
      setShowMoodModal(false);
      setPreMood(null);
      setPostMood(null);
      setNotes('');
      setCurrentTime(0);
      onClose();
    }
  };

  return (
    <>
      {/* Player Card */}
      <Card variant="elevated" padding="xl" className="relative overflow-hidden animate-slide-up">
        <GoldTriangle orientation="down" size="md" className="absolute top-6 right-6 opacity-50" aria-hidden="true" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className={cn('w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0', type.bgColor)}>
            {type.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-heading-2 font-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {type.name}
            </h2>
            <p className="text-body-sm text-text-muted mt-1">{type.description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close player">
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        {/* Progress Ring */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
            <circle
              cx="128"
              cy="128"
              r="110"
              fill="none"
              stroke="var(--border-subtle)"
              strokeWidth="8"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              fill="none"
              stroke="var(--accent-gold)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 110}
              strokeDashoffset={2 * Math.PI * 110 * (1 - progress / 100)}
              className="transition-all duration-1000 ease-out-expo"
              style={{ filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.4))' }}
            />
            {chimeTimes.map((chimeTime, idx) => {
              const chimeProgress = chimeTime / totalTime;
              const angle = chimeProgress * 2 * Math.PI - Math.PI / 2;
              const x = 128 + 118 * Math.cos(angle);
              const y = 128 + 118 * Math.sin(angle);
              const passed = currentTime >= chimeTime;
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r={4}
                  fill={passed ? 'var(--accent-gold)' : 'var(--border-standard)'}
                  className="transition-colors"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <time className="text-display font-mono font-medium text-text-primary" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
              {formatTime(currentTime)}
            </time>
            <span className="text-caption text-text-muted">/ {formatTime(totalTime)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6">
          {/* Main Controls */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => handleSkip(-15)} aria-label="Rewind 15 seconds">
              <SkipBack className="h-6 w-6" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="primary"
              className="w-20 h-20 rounded-full"
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-8 w-8" aria-hidden="true" /> : <Play className="h-8 w-8" aria-hidden="true" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleSkip(15)} aria-label="Forward 15 seconds">
              <SkipForward className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChimesEnabled(!chimesEnabled)}
              aria-pressed={chimesEnabled}
              aria-label={chimesEnabled ? 'Disable interval chimes' : 'Enable interval chimes'}
              className={cn(chimesEnabled ? 'text-accent-gold' : 'text-text-muted')}
            >
              {chimesEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-caption text-text-muted">Volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-32 h-2 accent-accent-gold"
                aria-label="Volume"
              />
              {volume > 0 ? <Volume2 className="h-4 w-4 text-text-muted" /> : <VolumeX className="h-4 w-4 text-text-muted" />}
            </div>

            <Badge variant="subtle" className="text-xs">
              {duration} min session
            </Badge>
          </div>
        </div>
      </Card>

      {/* Mood Modal */}
      <Modal
        isOpen={showMoodModal}
        onClose={() => setShowMoodModal(false)}
        size="md"
        closeOnOverlayClick={false}
        closeOnEscape={false}
        title="How was your session?"
        description="Rate your mood before and after to track your progress"
      >
        <div className="space-y-6">
          {/* Pre-mood */}
          <div>
            <label className="label-base block mb-3">Before Meditation</label>
            <div className="flex items-center justify-center gap-3">
              {[1, 2, 3, 4, 5].map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setPreMood(mood)}
                  className={cn(
                    'w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-200',
                    'border-2',
                    preMood === mood
                      ? 'border-accent-gold bg-accent-gold/15 text-accent-gold shadow-gold-glow'
                      : 'border-border-subtle text-text-muted hover:border-border-standard hover:text-text-primary'
                  )}
                  aria-pressed={preMood === mood}
                >
                  {mood <= 2 ? <Frown className="h-6 w-6" /> : mood === 3 ? <Minus className="h-6 w-6" /> : <Smile className="h-6 w-6" />}
                  <span className="text-caption font-medium mt-1">{mood}</span>
                </button>
              ))}
            </div>
          </div>

          <Divider />

          {/* Post-mood */}
          <div>
            <label className="label-base block mb-3">After Meditation</label>
            <div className="flex items-center justify-center gap-3">
              {[1, 2, 3, 4, 5].map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setPostMood(mood)}
                  className={cn(
                    'w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-200',
                    'border-2',
                    postMood === mood
                      ? 'border-accent-gold bg-accent-gold/15 text-accent-gold shadow-gold-glow'
                      : 'border-border-subtle text-text-muted hover:border-border-standard hover:text-text-primary'
                  )}
                  aria-pressed={postMood === mood}
                >
                  {mood <= 2 ? <Frown className="h-6 w-6" /> : mood === 3 ? <Minus className="h-6 w-6" /> : <Smile className="h-6 w-6" />}
                  <span className="text-caption font-medium mt-1">{mood}</span>
                </button>
              ))}
            </div>
          </div>

          <Divider />

          {/* Notes */}
          <Textarea
            label="Notes (optional)"
            placeholder="Any insights, sensations, or thoughts..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowMoodModal(false)}>
            Skip
          </Button>
          <Button variant="primary" onClick={handleMoodSubmit} disabled={preMood === null || postMood === null}>
            Save Session
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
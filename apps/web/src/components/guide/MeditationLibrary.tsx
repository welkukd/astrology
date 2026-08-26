'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Music, Wind, Flame, Droplets, Leaf, Sun, Moon, Heart, Clock, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/Tabs';
import { GoldTriangle } from '@/components/ui/GoldTriangle';
import { Select } from '@/components/ui/Input';
import { MeditationPlayer } from './MeditationPlayer';

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

const MEDITATION_TYPES: MeditationType[] = [
  {
    id: 'breath',
    name: 'Breath Awareness',
    description: 'Focus on the natural rhythm of breathing',
    icon: <Wind className="h-6 w-6" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/15',
    defaultDuration: 10,
    chimes: true,
  },
  {
    id: 'body-scan',
    name: 'Body Scan',
    description: 'Progressive relaxation through body awareness',
    icon: <Heart className="h-6 w-6" />,
    color: 'text-green-400',
    bgColor: 'bg-green-500/15',
    defaultDuration: 15,
    chimes: true,
  },
  {
    id: 'loving-kindness',
    name: 'Loving Kindness',
    description: 'Cultivate compassion for self and others',
    icon: <Sun className="h-6 w-6" />,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/15',
    defaultDuration: 12,
    chimes: false,
  },
  {
    id: 'mantra',
    name: 'Mantra',
    description: 'Repeat a sacred sound or phrase',
    icon: <Music className="h-6 w-6" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/15',
    defaultDuration: 20,
    chimes: true,
  },
  {
    id: 'visualization',
    name: 'Visualization',
    description: 'Guided imagery for calm and clarity',
    icon: <Leaf className="h-6 w-6" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
    defaultDuration: 15,
    chimes: false,
  },
  {
    id: 'walking',
    name: 'Walking Meditation',
    description: 'Mindful movement and presence',
    icon: <Flame className="h-6 w-6" />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/15',
    defaultDuration: 10,
    chimes: false,
  },
];

const DURATION_OPTIONS = [
  { value: '5', label: '5 minutes' },
  { value: '10', label: '10 minutes' },
  { value: '15', label: '15 minutes' },
  { value: '20', label: '20 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '60 minutes' },
];

interface SavedMeditation {
  id: string;
  typeId: string;
  duration: number;
  completedAt: number;
  preMood?: number;
  postMood?: number;
  notes?: string;
}

export function MeditationLibrary({ onSelectType }: { onSelectType?: (type: MeditationType) => void }) {
  const [selectedType, setSelectedType] = useState<MeditationType>(MEDITATION_TYPES[0]);
  const [duration, setDuration] = useState(10);
  const [showPlayer, setShowPlayer] = useState(false);
  const [savedMeditations, setSavedMeditations] = useState<SavedMeditation[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gaia-saved-meditations');
      if (stored) {
        try {
          setSavedMeditations(JSON.parse(stored));
        } catch {
          setSavedMeditations([]);
        }
      }
    }
  }, []);

  const handleStartSession = (type: MeditationType) => {
    setSelectedType(type);
    setDuration(type.defaultDuration);
    setShowPlayer(true);
    onSelectType?.(type);
  };

  const handleSaveSession = (session: Omit<SavedMeditation, 'id' | 'completedAt'>) => {
    const newSession: SavedMeditation = {
      ...session,
      id: `med-${Date.now()}`,
      completedAt: Date.now(),
    };
    const updated = [newSession, ...savedMeditations].slice(0, 50);
    setSavedMeditations(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gaia-saved-meditations', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <GoldTriangle orientation="down" size="lg" aria-hidden="true" />
          <h1 className="text-display font-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Meditation
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={duration.toString()}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            options={DURATION_OPTIONS}
            placeholder="Duration"
            className="w-[140px]"
          />
        </div>
      </div>

      {/* Meditation Types Grid */}
      <section aria-labelledby="types-heading">
        <h2 id="types-heading" className="text-heading-3 font-display font-medium text-text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
          <GoldTriangle orientation="down" size="sm" aria-hidden="true" />
          Meditation Types
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MEDITATION_TYPES.map((type) => (
            <Card
              key={type.id}
              variant="hover"
              padding="lg"
              className={cn(
                'relative overflow-hidden',
                selectedType.id === type.id && 'border-accent-gold/30 shadow-gold-glow'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0', type.bgColor)}>
                    {type.icon}
                  </div>
                  <div>
                    <h3 className="text-heading-3 font-display font-medium text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                      {type.name}
                    </h3>
                    <p className="text-body-sm text-text-muted mt-1">{type.description}</p>
                  </div>
                </div>
                {selectedType.id === type.id && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="gold" className="text-xs">
                      Selected
                    </Badge>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3 text-caption text-text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {type.defaultDuration} min default
                </span>
                {type.chimes && (
                  <span className="flex items-center gap-1">
                    <Music className="h-3 w-3" aria-hidden="true" />
                    Interval chimes
                  </span>
                )}
              </div>

              <Button
                className="mt-4 w-full"
                variant={selectedType.id === type.id ? 'primary' : 'secondary'}
                onClick={() => handleStartSession(type)}
                disabled={showPlayer}
              >
                {selectedType.id === type.id ? (
                  <>
                    <Pause className="h-4 w-4" aria-hidden="true" />
                    Session Active
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" aria-hidden="true" />
                    Start Session
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Meditation Player */}
      {showPlayer && (
        <MeditationPlayer
          type={selectedType}
          duration={duration}
          onComplete={(sessionData: SessionData) => {
            handleSaveSession({
              typeId: selectedType.id,
              duration,
              ...sessionData,
            });
            setShowPlayer(false);
          }}
          onClose={() => setShowPlayer(false)}
        />
      )}

      {/* Recent Sessions */}
      {savedMeditations.length > 0 && (
        <section aria-labelledby="recent-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="recent-heading" className="text-heading-3 font-display font-medium text-text-primary flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
              <GoldTriangle orientation="down" size="sm" aria-hidden="true" />
              Recent Sessions
            </h2>
          </div>

          <div className="space-y-3">
            {savedMeditations.slice(0, 10).map((session) => {
              const type = MEDITATION_TYPES.find(t => t.id === session.typeId);
              return (
                <Card key={session.id} variant="default" padding="default" className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {type && (
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', type.bgColor)}>
                          {type.icon}
                        </div>
                      )}
                      <div>
                        <p className="text-body-md font-medium text-text-primary">{type?.name || 'Meditation'}</p>
                        <p className="text-caption text-text-muted">
                          {new Date(session.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {' · '}
                          {session.duration} min
                          {session.preMood !== undefined && session.postMood !== undefined && (
                            <>
                              {' · '}
                              Mood: {session.preMood} → {session.postMood}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <Badge variant="subtle">{session.duration} min</Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
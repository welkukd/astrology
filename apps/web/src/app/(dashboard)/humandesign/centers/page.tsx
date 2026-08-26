'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalClose } from '@/components/ui/Modal';
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/Tabs';
import { GoldTriangle, GoldTriangleSection } from '@/components/ui/GoldTriangle';
import { BodygraphSVG } from '@/components/humandesign/BodygraphSVG';
import { HDChartData, HDCenter, HDGate, CenterType, CenterStatus } from '@/components/humandesign/types';
import {
  Crown, Heart, Brain, Target, Compass, Zap, Circle, Shield, User,
  Loader2, AlertTriangle, Info, ChevronRight, Search, Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CENTER_LABELS: Record<CenterType, string> = {
  Head: 'Head',
  Ajna: 'Ajna',
  Throat: 'Throat',
  'G Center': 'G',
  'Heart/Ego': 'Ego',
  'Solar Plexus': 'SP',
  Spleen: 'Spleen',
  Sacral: 'Sacral',
  Root: 'Root',
};

const CENTER_FULL_NAMES: Record<CenterType, string> = {
  Head: 'Head Center',
  Ajna: 'Ajna Center',
  Throat: 'Throat Center',
  'G Center': 'G Center (Identity)',
  'Heart/Ego': 'Heart / Ego Center',
  'Solar Plexus': 'Solar Plexus Center',
  Spleen: 'Spleen Center',
  Sacral: 'Sacral Center',
  Root: 'Root Center',
};

const CENTER_QUESTIONS: Record<CenterType, string> = {
  Head: 'What inspires me?',
  Ajna: 'What do I think?',
  Throat: 'How do I express?',
  'G Center': 'Who am I? Where am I going?',
  'Heart/Ego': 'What is my worth?',
  'Solar Plexus': 'What do I feel?',
  Spleen: 'What is safe/healthy?',
  Sacral: 'Do I have energy for this?',
  Root: 'What pressures me?',
};

const CENTER_THEMES: Record<CenterType, string> = {
  Head: 'Inspiration / Mental Pressure',
  Ajna: 'Conceptualization / Mental Awareness',
  Throat: 'Manifestation / Communication',
  'G Center': 'Identity / Direction / Love',
  'Heart/Ego': 'Willpower / Ego / Value',
  'Solar Plexus': 'Emotions / Spirit / Desire',
  Spleen: 'Intuition / Survival / Health',
  Sacral: 'Life Force / Sexuality / Work',
  Root: 'Pressure / Stress / Drive',
};

const CENTER_SHADOWS: Record<CenterType, string> = {
  Head: 'Mental anxiety, pressure to figure everything out, confusion',
  Ajna: 'Overthinking, mental rigidity, certainty addiction',
  Throat: 'Speaking without invitation, manifestation frustration, silence',
  'G Center': 'Identity crisis, directionlessness, seeking love externally',
  'Heart/Ego': 'Proving worth, overcommitment, burnout, false promises',
  'Solar Plexus': 'Emotional avoidance, drama, decision-making in the wave',
  Spleen: 'Holding onto fear, ignoring intuition, health neglect',
  Sacral: 'Doing what you don\'t have energy for, frustration, burnout',
  Root: 'Chronic stress, rushing, pressure to act prematurely',
};

const CENTER_GIFTS: Record<CenterType, string> = {
  Head: 'Inspiration, mental clarity, divine download reception',
  Ajna: 'Conceptualization, mental awareness, research, analysis',
  Throat: 'Manifestation, communication, expression, creation',
  'G Center': 'Authentic identity, magnetic direction, self-love',
  'Heart/Ego': 'Willpower, value recognition, heart-centered commitments',
  'Solar Plexus': 'Emotional wisdom, spirit, depth, empathy, creativity',
  Spleen: 'Intuitive knowing, survival instinct, health awareness, timing',
  Sacral: 'Sustainable life force, sexual vitality, work satisfaction',
  Root: 'Drive, pressure as fuel, adrenaline mastery, stress alchemy',
};

const CENTER_ICONS: Record<CenterType, React.ComponentType<{ className?: string }>> = {
  Head: Crown,
  Ajna: Brain,
  Throat: Target,
  'G Center': Compass,
  'Heart/Ego': Heart,
  'Solar Plexus': User,
  Spleen: Shield,
  Sacral: Zap,
  Root: Circle,
};

const ALL_CENTER_TYPES: CenterType[] = [
  'Head', 'Ajna', 'Throat', 'G Center', 'Heart/Ego',
  'Solar Plexus', 'Spleen', 'Sacral', 'Root',
];

const STATUS_COLORS: Record<CenterStatus, { bg: string; border: string; text: string; badge: 'gold' | 'subtle' }> = {
  defined: { bg: 'bg-accent-gold-muted', border: 'border-accent-gold-border', text: 'text-accent-gold', badge: 'gold' },
  undefined: { bg: 'bg-bg-hover', border: 'border-border-subtle', text: 'text-text-secondary', badge: 'subtle' },
  open: { bg: 'bg-transparent', border: 'border-border-subtle', text: 'text-text-muted', badge: 'subtle' },
};

interface CentersPageProps {
  chartId?: string;
}

export default function CentersPage({ chartId }: CentersPageProps) {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [chart, setChart] = useState<HDChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<HDCenter | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'defined' | 'undefined' | 'open'>('all');

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      router.push('/auth/login');
      return;
    }
    if (!chartId) return;

    const fetchChart = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/charts/${chartId}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ detail: 'Failed to load chart' }));
          throw new Error(err.detail || 'Failed to load chart');
        }
        const data = await res.json();
        setChart(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chart');
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, [session, authLoading, chartId, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-accent-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-default p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-accent-gold mx-auto mb-4" />
        <h2 className="heading-3 font-medium mb-2">Unable to Load Chart</h2>
        <p className="text-text-muted mb-6">{error}</p>
        <Button variant="secondary" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="card-default p-8 text-center">
        <Info className="h-12 w-12 text-text-muted mx-auto mb-4" />
        <h2 className="heading-3 font-medium mb-2">No Chart Data</h2>
        <p className="text-text-muted">Select a chart to view your Human Design centers.</p>
      </div>
    );
  }

  const filteredCenters = chart.bodygraph_data.centers.filter(center => {
    if (activeFilter === 'all') return true;
    return center.status === activeFilter;
  });

  const definedCount = chart.bodygraph_data.centers.filter(c => c.defined).length;
  const undefinedCount = chart.bodygraph_data.centers.filter(c => c.status === 'undefined').length;
  const openCount = chart.bodygraph_data.centers.filter(c => c.status === 'open').length;

  const handleCenterClick = (center: HDCenter) => {
    setSelectedCenter(center);
    setShowModal(true);
  };

  const centerGates = (center: HDCenter) => {
    return chart.bodygraph_data.gates.filter(g => g.center === center.id);
  };

  const centerChannels = (center: HDCenter) => {
    return chart.bodygraph_data.channels.filter(
      c => c.defined && (c.center_start === center.id || c.center_end === center.id)
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with GoldTriangle */}
      <GoldTriangleSection orientation="down" size="lg" className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 w-full">
          <div>
            <h1 className="text-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Centers
            </h1>
            <p className="text-body-lg text-text-secondary mt-2">
              {chart.subject_name} — {definedCount} Defined, {undefinedCount} Undefined, {openCount} Open
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="gold" className="text-sm">{definedCount} Defined</Badge>
            <Badge variant="subtle" className="text-sm">{undefinedCount} Undefined</Badge>
            <Badge variant="subtle" className="text-sm border-border-subtle bg-transparent">{openCount} Open</Badge>
          </div>
        </div>
      </GoldTriangleSection>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'defined', 'undefined', 'open'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              'px-4 py-2 rounded-pill text-sm font-medium transition-all',
              activeFilter === filter
                ? 'bg-accent-gold text-bg-primary shadow-gold-glow'
                : 'bg-bg-card border border-border-subtle text-text-secondary hover:border-accent-gold hover:text-accent-gold'
            )}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
            {filter !== 'all' && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-bg-primary">
                {chart.bodygraph_data.centers.filter(c => c.status === filter).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCenters.map(center => {
          const colors = STATUS_COLORS[center.status];
          const Icon = CENTER_ICONS[center.id];
          const gates = centerGates(center);
          const definedGates = gates.filter(g => g.defined);
          const channels = centerChannels(center);

          return (
            <Card
              key={center.id}
              variant="hover"
              padding="default"
              className={cn(
                'relative overflow-hidden cursor-pointer transition-all',
                colors.bg,
                colors.border,
                center.status === 'defined' && 'shadow-gold-glow'
              )}
              onClick={() => handleCenterClick(center)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn('p-3 rounded-xl', colors.bg, colors.border)}>
                    <Icon className={cn('h-6 w-6', colors.text)} />
                  </div>
                  <div>
                    <h3 className="text-heading-3 font-medium text-text-primary">{CENTER_FULL_NAMES[center.id]}</h3>
                    <p className="label text-text-muted">{CENTER_LABELS[center.id]}</p>
                  </div>
                </div>
                <Badge variant={colors.badge} className="text-xs">
                  {center.status.charAt(0).toUpperCase() + center.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-3 text-body-sm">
                <div className="pt-3 border-t border-border-subtle">
                  <span className="label text-text-muted">Theme:</span>
                  <p className="text-text-secondary mt-1">{CENTER_THEMES[center.id]}</p>
                </div>
                <div>
                  <span className="label text-text-muted">Question:</span>
                  <p className="text-text-primary mt-1 font-medium">"{CENTER_QUESTIONS[center.id]}"</p>
                </div>
                <div className="flex items-center gap-3 text-caption text-text-muted">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" /> {definedGates.length} Gates
                  </span>
                  <span className="flex items-center gap-1">
                    <Circle className="h-3 w-3" /> {channels.length} Channels
                  </span>
                </div>
              </div>

              {/* Gold triangle accent on defined centers */}
              {center.status === 'defined' && (
                <GoldTriangle
                  size="sm"
                  orientation="down"
                  className="absolute top-4 right-4"
                  pulse
                />
              )}
            </Card>
          );
        })}

        {/* Empty state if no centers match filter */}
        {filteredCenters.length === 0 && (
          <div className="col-span-full card-default p-12 text-center">
            <Search className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h3 className="heading-3 font-medium mb-2">No centers match filter</h3>
            <p className="text-text-muted">Try selecting a different filter</p>
          </div>
        )}
      </div>

      {/* Mini Bodygraph Overview */}
      <Card variant="elevated" padding="default" className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Circle className="h-5 w-5 text-accent-gold" />
            Bodygraph Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <BodygraphSVG
              centers={chart.bodygraph_data.centers}
              channels={chart.bodygraph_data.channels}
              gates={chart.bodygraph_data.gates}
              definitionType={chart.definition_type}
            />
          </div>
        </CardContent>
      </Card>

      {/* Center Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedCenter(null); }}
        title={selectedCenter ? CENTER_FULL_NAMES[selectedCenter.id] : ''}
        size="lg"
      >
        {selectedCenter && (
          <>
            <ModalHeader>
              <div className="flex items-center gap-3">
                <div className={cn('p-3 rounded-xl', STATUS_COLORS[selectedCenter.status].bg, STATUS_COLORS[selectedCenter.status].border)}>
                  {(() => {
                    const Icon = CENTER_ICONS[selectedCenter.id];
                    return Icon ? <Icon className={cn('h-6 w-6', STATUS_COLORS[selectedCenter.status].text)} /> : null;
                  })()}
                </div>
                <div>
                  <ModalTitle className="text-heading-2">{CENTER_FULL_NAMES[selectedCenter.id]}</ModalTitle>
                  <Badge variant={STATUS_COLORS[selectedCenter.status].badge}>
                    {selectedCenter.status.charAt(0).toUpperCase() + selectedCenter.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Theme */}
                <div>
                  <h4 className="label text-text-muted mb-2 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-accent-gold" />
                    Theme
                  </h4>
                  <p className="body text-text-secondary">{CENTER_THEMES[selectedCenter.id]}</p>
                </div>

                {/* Question */}
                <div>
                  <h4 className="label text-text-muted mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent-gold" />
                    Core Question
                  </h4>
                  <p className="body text-text-primary font-medium">"{CENTER_QUESTIONS[selectedCenter.id]}"</p>
                </div>

                {/* Not-Self / Shadow */}
                <div className="bg-semantic-danger/10 border border-semantic-danger/20 rounded-lg p-4">
                  <h4 className="label text-semantic-danger mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Not-Self / Shadow
                  </h4>
                  <p className="body text-text-secondary">{CENTER_SHADOWS[selectedCenter.id]}</p>
                </div>

                {/* Gift */}
                <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-lg p-4">
                  <h4 className="label text-accent-gold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Gift / High Expression
                  </h4>
                  <p className="body text-text-secondary">{CENTER_GIFTS[selectedCenter.id]}</p>
                </div>

                {/* Gates in this center */}
                {centerGates(selectedCenter).length > 0 && (
                  <div>
                    <h4 className="label text-text-muted mb-3 flex items-center gap-2">
                      <Circle className="h-4 w-4 text-accent-gold" />
                      Active Gates ({centerGates(selectedCenter).length})
                    </h4>
                    <div className="space-y-2">
                      {centerGates(selectedCenter).map(gate => (
                        <button
                          key={gate.number}
                          className="w-full text-left p-3 bg-bg-hover rounded-lg border border-border-subtle hover:border-accent-gold hover:text-accent-gold transition-all flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium text-text-primary">Gate {gate.number}: {gate.name}</div>
                            <div className="text-caption text-text-muted">
                              Line {gate.line} • Color {gate.color} • Tone {gate.tone} • Base {gate.base}
                              {' • '}{gate.conscious ? 'Personality (Black)' : 'Design (Red)'}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-text-muted" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Defined channels connected to this center */}
                {centerChannels(selectedCenter).length > 0 && (
                  <div>
                    <h4 className="label text-text-muted mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent-gold" />
                      Defined Channels ({centerChannels(selectedCenter).length})
                    </h4>
                    <div className="space-y-2">
                      {centerChannels(selectedCenter).map(channel => (
                        <button
                          key={channel.id}
                          className="w-full text-left p-3 bg-bg-hover rounded-lg border border-border-subtle hover:border-accent-gold hover:text-accent-gold transition-all flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium text-text-primary">{channel.id} — {channel.name}</div>
                            <div className="text-caption text-text-muted">
                              {channel.center_start} ↔ {channel.center_end}
                              {' • '}{channel.circuit || '—'} Circuit
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-text-muted" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalClose />
          </>
        )}
      </Modal>
    </div>
  );
}
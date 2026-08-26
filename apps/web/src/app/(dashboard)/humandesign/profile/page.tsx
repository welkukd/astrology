'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GoldTriangle, GoldTriangleSection } from '@/components/ui/GoldTriangle';
import { HDChartData, HDProfile, HDIncarnationCross, HDVariable, HDProfileLine, VariableArrow, CenterType } from '@/components/humandesign/types';
import {
  Crown, Zap, Shield, User, Target, Compass, Circle, Heart, Brain,
  Loader2, AlertTriangle, Info, ChevronRight, Search, Filter, X,
  ArrowUpDown, ArrowDownUp, Hash, Hexagon, Sun, Moon, Sparkles, ArrowLeft, ArrowRight
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

const PROFILE_LINE_INFO: Record<number, { name: string; keynotes: string[]; description: string }> = {
  1: {
    name: 'Investigator',
    keynotes: ['Research', 'Foundation', 'Authority', 'Depth'],
    description: 'The 1st line is driven to investigate and build a solid foundation of knowledge. They need to research thoroughly before feeling secure. Their authority comes from depth of understanding.',
  },
  2: {
    name: 'Hermit',
    keynotes: ['Natural Talent', 'Solitude', 'Projection', 'Calling'],
    description: 'The 2nd line has natural talents that others project onto them. They need solitude to develop their gifts. They are "called out" by others rather than initiating.',
  },
  3: {
    name: 'Martyr',
    keynotes: ['Trial & Error', 'Discovery', 'Resilience', 'Experience'],
    description: 'The 3rd line learns through trial and error. They discover what works by bumping into life. Their resilience comes from experiencing what doesn\'t work first.',
  },
  4: {
    name: 'Opportunist',
    keynotes: ['Network', 'Opportunity', 'Influence', 'Foundation'],
    description: 'The 4th line builds their life through their network. Opportunities come through connections. They need a solid foundation of friends and colleagues.',
  },
  5: {
    name: 'Heretic',
    keynotes: ['Projection', 'Solution', 'Leadership', 'Practicality'],
    description: 'The 5th line carries a projection field - others see them as the solution. They can universalize their experience to help others. Practical leaders.',
  },
  6: {
    name: 'Role Model',
    keynotes: ['Three Phases', 'Wisdom', 'Objectivity', 'Transition'],
    description: 'The 6th line lives in three phases: 0-30 (experimenting), 30-50 (observing), 50+ (role model). They gain wisdom through objective observation over time.',
  },
};

const VARIABLE_INFO: Record<string, { description: string; left: string; right: string }> = {
  PHS: {
    description: 'Primary Health System - Your optimal digestion type and how you absorb nutrients and information.',
    left: 'Active/Structured digestion - Needs routine, specific conditions, selective',
    right: 'Passive/Receptive digestion - Open, adaptable, absorbs from environment',
  },
  Environment: {
    description: 'Your optimal environment for thriving - where you feel most at home and supported.',
    left: 'Active/Structured environment - Needs specific, controlled surroundings',
    right: 'Passive/Receptive environment - Thrives in varied, open environments',
  },
  Perspective: {
    description: 'Your cognitive perspective - how you naturally view and process the world.',
    left: 'Active/Structured perspective - Focused, strategic, sees patterns',
    right: 'Passive/Receptive perspective - Peripheral, holistic, sees connections',
  },
  Motivation: {
    description: 'Your core motivation - what drives you at the deepest level.',
    left: 'Active/Structured motivation - Driven by specific goals, outcomes',
    right: 'Passive/Receptive motivation - Driven by process, experience, flow',
  },
};

const ARROW_LABELS: Record<VariableArrow, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  left: { label: 'Left (Active/Structured)', icon: ArrowLeft, color: '#ef4444' },
  right: { label: 'Right (Passive/Receptive)', icon: ArrowRight, color: '#3b82f6' },
};

interface ProfilePageProps {
  chartId?: string;
}

export default function ProfilePage({ chartId }: ProfilePageProps) {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [chart, setChart] = useState<HDChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <p className="text-text-muted">Select a chart to view your Human Design profile.</p>
      </div>
    );
  }

  const profile = chart.bodygraph_data.profile;
  const cross = chart.bodygraph_data.incarnation_cross;
  const variables = chart.bodygraph_data.variables;
  const definitionType = chart.definition_type;

  return (
    <div className="space-y-8">
      {/* Header with GoldTriangle */}
      <GoldTriangleSection orientation="down" size="lg" className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 w-full">
          <div>
            <h1 className="text-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Profile & Cross
            </h1>
            <p className="text-body-lg text-text-secondary mt-2">
              {chart.subject_name} — {chart.hd_type} • {chart.profile} Profile • {cross?.name || 'Incarnation Cross'}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="gold" className="text-sm">{chart.profile}</Badge>
            <Badge variant="gold" className="text-sm">{cross?.quarter || '—'} Quarter</Badge>
            {definitionType && (
              <Badge variant="subtle" className="text-sm">{definitionType} Definition</Badge>
            )}
          </div>
        </div>
      </GoldTriangleSection>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Overview */}
          <Card variant="elevated" padding="default">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-accent-gold-muted">
                    <User className="h-6 w-6 text-accent-gold" />
                  </div>
                  <div>
                    <CardTitle className="mb-0">Profile {profile?.profile || chart.profile}</CardTitle>
                    <p className="text-body-sm text-text-muted">
                      {profile?.conscious_line.name} / {profile?.unconscious_line.name}
                    </p>
                  </div>
                </div>
                <GoldTriangle size="md" orientation="down" className="text-accent-gold" pulse />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Description */}
              {profile?.description && (
                <div className="p-4 bg-bg-hover rounded-lg border border-border-subtle">
                  <p className="body text-text-secondary">{profile.description}</p>
                </div>
              )}

              {/* Conscious & Unconscious Lines */}
              {profile && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Conscious Line */}
                  <Card variant="default" padding="default" className="relative">
                    <div className="absolute top-4 right-4">
                      <GoldTriangle size="sm" orientation="down" className="text-accent-gold" pulse />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-accent-gold-muted">
                        <Sun className="h-6 w-6 text-accent-gold" />
                      </div>
                      <div>
                        <h4 className="label text-text-muted">Conscious (Personality)</h4>
                        <p className="text-heading-3 font-medium text-accent-gold">Line {profile.conscious_line.line}</p>
                      </div>
                    </div>
                    <h3 className="text-heading-3 font-medium text-text-primary mb-2">{profile.conscious_line.name}</h3>
                    <p className="text-body-sm text-text-secondary mb-4">{PROFILE_LINE_INFO[profile.conscious_line.line]?.description}</p>
                    <div>
                      <h5 className="label text-text-muted mb-2">Keynotes</h5>
                      <div className="flex flex-wrap gap-2">
                        {PROFILE_LINE_INFO[profile.conscious_line.line]?.keynotes.map((k, idx) => (
                          <Badge key={idx} variant="subtle" className="text-xs">{k}</Badge>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Unconscious Line */}
                  <Card variant="default" padding="default" className="relative">
                    <div className="absolute top-4 right-4">
                      <GoldTriangle size="sm" orientation="down" className="text-semantic-danger" pulse />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-semantic-danger/20">
                        <Moon className="h-6 w-6 text-semantic-danger" />
                      </div>
                      <div>
                        <h4 className="label text-text-muted">Unconscious (Design)</h4>
                        <p className="text-heading-3 font-medium text-semantic-danger">Line {profile.unconscious_line.line}</p>
                      </div>
                    </div>
                    <h3 className="text-heading-3 font-medium text-text-primary mb-2">{profile.unconscious_line.name}</h3>
                    <p className="text-body-sm text-text-secondary mb-4">{PROFILE_LINE_INFO[profile.unconscious_line.line]?.description}</p>
                    <div>
                      <h5 className="label text-text-muted mb-2">Keynotes</h5>
                      <div className="flex flex-wrap gap-2">
                        {PROFILE_LINE_INFO[profile.unconscious_line.line]?.keynotes.map((k, idx) => (
                          <Badge key={idx} variant="subtle" className="text-xs">{k}</Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Profile Synthesis */}
              {profile && (
                <div className="pt-6 border-t border-border-subtle">
                  <h4 className="label text-text-muted mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent-gold" />
                    Profile Synthesis
                  </h4>
                  <p className="body text-text-secondary">
                    Your {profile.profile} profile combines the {profile.conscious_line.name} (Line {profile.conscious_line.line}) consciously 
                    with the {profile.unconscious_line.name} (Line {profile.unconscious_line.line}) unconsciously. 
                    This creates a unique life theme where you consciously {profile.conscious_line.keynotes[0].toLowerCase()} 
                    while unconsciously {profile.unconscious_line.keynotes[0].toLowerCase()}.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Incarnation Cross */}
          <Card variant="elevated" padding="default">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-accent-gold-muted">
                    <Compass className="h-6 w-6 text-accent-gold" />
                  </div>
                  <div>
                    <CardTitle className="mb-0">Incarnation Cross</CardTitle>
                    <p className="text-body-sm text-text-muted">{cross?.name || 'Loading...'}</p>
                  </div>
                </div>
                <GoldTriangle size="md" orientation="down" className="text-accent-gold" pulse />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {cross && (
                <>
                  {/* Cross Gates */}
                  <div className="grid grid-cols-4 gap-4">
                    <Card variant="default" padding="default" className="text-center">
                      <h5 className="label text-text-muted mb-1">Conscious Sun</h5>
                      <div className="text-3xl font-display font-semibold text-accent-gold">Gate {cross.conscious_sun_gate}</div>
                      <p className="text-caption text-text-muted mt-1">{chart.bodygraph_data.gates.find(g => g.number === cross.conscious_sun_gate)?.name || '—'}</p>
                    </Card>
                    <Card variant="default" padding="default" className="text-center">
                      <h5 className="label text-text-muted mb-1">Conscious Earth</h5>
                      <div className="text-3xl font-display font-semibold text-accent-gold">Gate {cross.conscious_earth_gate}</div>
                      <p className="text-caption text-text-muted mt-1">{chart.bodygraph_data.gates.find(g => g.number === cross.conscious_earth_gate)?.name || '—'}</p>
                    </Card>
                    <Card variant="default" padding="default" className="text-center">
                      <h5 className="label text-text-muted mb-1">Unconscious Sun</h5>
                      <div className="text-3xl font-display font-semibold text-semantic-danger">Gate {cross.unconscious_sun_gate}</div>
                      <p className="text-caption text-text-muted mt-1">{chart.bodygraph_data.gates.find(g => g.number === cross.unconscious_sun_gate)?.name || '—'}</p>
                    </Card>
                    <Card variant="default" padding="default" className="text-center">
                      <h5 className="label text-text-muted mb-1">Unconscious Earth</h5>
                      <div className="text-3xl font-display font-semibold text-semantic-danger">Gate {cross.unconscious_earth_gate}</div>
                      <p className="text-caption text-text-muted mt-1">{chart.bodygraph_data.gates.find(g => g.number === cross.unconscious_earth_gate)?.name || '—'}</p>
                    </Card>
                  </div>

                  {/* Cross Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="label text-text-muted mb-2">Quarter</h5>
                      <p className="text-heading-3 font-medium text-accent-gold">{cross.quarter}</p>
                    </div>
                    <div>
                      <h5 className="label text-text-muted mb-2">Theme</h5>
                      <p className="body text-text-secondary">{cross.theme || 'Theme information not available'}</p>
                    </div>
                  </div>

                  {/* Cross Description */}
                  {cross.theme && (
                    <div className="pt-6 border-t border-border-subtle">
                      <h5 className="label text-text-muted mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent-gold" />
                        Life Purpose Theme
                      </h5>
                      <p className="body text-text-secondary leading-relaxed">
                        Your Incarnation Cross is formed by the four gates of your Sun and Earth (both conscious and unconscious).
                        This cross represents your life purpose theme - the unique contribution you're here to make.
                        The {cross.quarter} quarter indicates the seasonal quality of your purpose.
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Variables (PHS) */}
        <div className="space-y-6">
          <Card variant="elevated" padding="default">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-accent-gold-muted">
                  <Brain className="h-6 w-6 text-accent-gold" />
                </div>
                <div>
                  <CardTitle className="mb-0">Variables (PHS)</CardTitle>
                  <p className="text-body-sm text-text-muted">Primary Health System</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-body-sm text-text-muted">
                Your four variables determine your optimal digestion, environment, perspective, and motivation.
                Arrows: <span className="text-semantic-danger">← Left = Active/Structured</span>, 
                <span className="text-accent-blue">→ Right = Passive/Receptive</span>
              </p>

              {variables.map((variable, idx) => {
                const info = VARIABLE_INFO[variable.name];
                const arrowInfo = ARROW_LABELS[variable.arrow];
                const ArrowIcon = arrowInfo.icon;

                return (
                  <Card key={variable.name} variant="default" padding="default" className="relative">
                    <div className="absolute top-4 right-4">
                      <GoldTriangle size="sm" orientation="down" className={cn('pulse', variable.arrow === 'left' ? 'text-semantic-danger' : 'text-accent-blue')} />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-accent-gold-muted">
                        <Brain className="h-5 w-5 text-accent-gold" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-heading-3 font-medium text-text-primary">{variable.name}</h4>
                        <p className="label text-text-muted">{arrowInfo.label}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <ArrowIcon className={cn('h-5 w-5', variable.arrow === 'left' ? 'text-semantic-danger' : 'text-accent-blue')} />
                      <span className="text-body-sm font-medium" style={{ color: variable.arrow === 'left' ? '#ef4444' : '#3b82f6' }}>
                        {variable.arrow === 'left' ? '← Structured/Active' : '→ Receptive/Passive'}
                      </span>
                    </div>

                    {info && (
                      <p className="text-body-sm text-text-secondary mb-3">{info.description}</p>
                    )}

                    {/* Color, Tone, Base */}
                    <div className="grid grid-cols-3 gap-3 text-center mb-3">
                      <div className="p-2 bg-bg-hover rounded-lg">
                        <div className="text-xl font-display font-semibold text-accent-gold">{variable.color}</div>
                        <div className="label text-text-muted">Color</div>
                      </div>
                      <div className="p-2 bg-bg-hover rounded-lg">
                        <div className="text-xl font-display font-semibold text-accent-gold">{variable.tone}</div>
                        <div className="label text-text-muted">Tone</div>
                      </div>
                      <div className="p-2 bg-bg-hover rounded-lg">
                        <div className="text-xl font-display font-semibold text-accent-gold">{variable.base}</div>
                        <div className="label text-text-muted">Base</div>
                      </div>
                    </div>

                    {/* Left/Right meaning */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2 bg-semantic-danger/10 rounded-lg border border-semantic-danger/20">
                        <div className="label text-semantic-danger mb-1">Left Arrow</div>
                        <p className="text-text-secondary">{info?.left || 'Active, structured approach'}</p>
                      </div>
                      <div className="p-2 bg-accent-blue/10 rounded-lg border border-accent-blue/20">
                        <div className="label text-accent-blue mb-1">Right Arrow</div>
                        <p className="text-text-secondary">{info?.right || 'Passive, receptive approach'}</p>
                      </div>
                    </div>

                    {variable.description && (
                      <div className="mt-3 pt-3 border-t border-border-subtle">
                        <p className="text-body-sm text-text-muted">{variable.description}</p>
                      </div>
                    )}
                  </Card>
                );
              })}

              {/* Variable Synthesis */}
              {variables.length === 4 && (
                <div className="pt-4 border-t border-border-subtle">
                  <h5 className="label text-text-muted mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent-gold" />
                    Variable Configuration
                  </h5>
                  <p className="text-body-sm text-text-secondary">
                    Your variable configuration is <strong className="text-text-primary">
                      {variables.map(v => v.arrow === 'left' ? 'L' : 'R').join('/')}
                    </strong>.
                    This unique combination of {variables.filter(v => v.arrow === 'left').length} Left and 
                    {variables.filter(v => v.arrow === 'right').length} Right arrows creates your specific 
                    cognitive and physical design for navigating life.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Strategy & Authority Summary */}
          <Card variant="hover" padding="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent-gold" />
                Strategy & Authority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-accent-gold-muted/30 rounded-lg border border-accent-gold-border">
                <h4 className="label text-text-muted mb-1">Strategy</h4>
                <p className="text-heading-3 font-medium text-accent-gold">{chart.strategy}</p>
              </div>
              <div className="p-4 bg-bg-hover rounded-lg border border-border-subtle">
                <h4 className="label text-text-muted mb-1">Authority</h4>
                <p className="text-heading-3 font-medium text-text-primary">{chart.authority}</p>
                <p className="text-body-sm text-text-secondary mt-1">
                  {chart.authority === 'Emotional' && 'Wait for emotional clarity over time. Never decide in the moment.'}
                  {chart.authority === 'Sacral' && 'Instant gut response — sacral sounds (uh-huh, un-uh) guide decisions.'}
                  {chart.authority === 'Splenic' && 'Intuitive, in-the-moment knowing. Quiet, instantaneous, never repeats.'}
                  {chart.authority === 'Ego' && 'Decisions based on willpower and what\'s genuinely desired. "I want" or "I don\'t want".'}
                  {chart.authority === 'Self-Projected' && 'Need to hear themselves speak their truth to know what\'s correct.'}
                  {chart.authority === 'Mental' && 'Sound boarding — need to talk through decisions in the right environment with right people.'}
                  {chart.authority === 'Lunar' && 'Must wait 28-day lunar cycle, tracking how each gate activation feels.'}
                </p>
              </div>
              <div className="p-4 bg-bg-hover rounded-lg border border-border-subtle">
                <h4 className="label text-text-muted mb-1">Signature</h4>
                <p className="text-heading-3 font-medium text-accent-gold">{chart.signature}</p>
              </div>
              <div className="p-4 bg-semantic-danger/10 rounded-lg border border-semantic-danger/20">
                <h4 className="label text-semantic-danger mb-1">Not-Self Theme</h4>
                <p className="text-heading-3 font-medium text-semantic-danger">{chart.not_self_theme}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Definition Type Detail */}
      {definitionType && (
        <Card variant="elevated" padding="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent-gold" />
              Definition Type: {definitionType}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="label text-text-muted mb-2">Description</h4>
                <p className="body text-text-secondary">
                  {definitionType === 'Single' && 'All defined centers are connected in one continuous circuit. Energy flows smoothly internally.'}
                  {definitionType === 'Split' && 'Two separate islands of definition. Need others to bridge the split for wholeness.'}
                  {definitionType === 'Triple Split' && 'Three separate islands of definition. Need multiple bridges/people for wholeness.'}
                  {definitionType === 'Quadruple Split' && 'Four separate islands. Rare. Need many bridges; very fast processing when connected.'}
                  {definitionType === 'No Definition' && 'All centers undefined. Completely open to conditioning. Mirror of environment.'}
                </p>
              </div>
              <div>
                <h4 className="label text-text-muted mb-2">Characteristics</h4>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const characteristics = 
                      definitionType === 'Single' ? ['Self-contained', 'Consistent energy flow', 'Less dependent on others for wholeness'] :
                      definitionType === 'Split' ? ['Two areas of life', 'Seek bridging through relationships', 'Can feel split internally'] :
                      definitionType === 'Triple Split' ? ['Three distinct areas', 'Need variety in relationships', 'Fast processing when bridged'] :
                      definitionType === 'Quadruple Split' ? ['Four distinct areas', 'Highly dependent on environment/people', 'Very fast when bridged'] :
                      definitionType === 'No Definition' ? ['No consistent energy', 'Wisdom through sampling', 'Environment is everything'] :
                      [];
                    return characteristics.map((char, idx) => (
                      <Badge key={idx} variant="subtle" className="text-xs">{char}</Badge>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
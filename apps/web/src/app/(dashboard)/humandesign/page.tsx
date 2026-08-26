'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GoldTriangle, GoldTriangleSection } from '@/components/ui/GoldTriangle';
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/Tabs';
import { BodygraphSVG } from '@/components/humandesign/BodygraphSVG';
import { HDChartData, HDCenter, HDChannel, HDGate, HDType, HDAuthority, DefinitionType, CENTER_LABELS } from '@/components/humandesign/types';
import {
  Crown, Zap, Shield, User, Target, Compass, Circle, Heart, Brain,
  Loader2, AlertTriangle, Info, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const HD_TYPE_ICONS: Record<HDType, React.ComponentType<{ className?: string }>> = {
  Manifestor: Zap,
  Generator: Circle,
  'Manifesting Generator': Zap,
  Projector: Target,
  Reflector: Shield,
};

const HD_TYPE_DESCRIPTIONS: Record<HDType, string> = {
  Manifestor: 'Initiator — Closed, repelling aura. Strategy: To Inform.',
  Generator: 'Builder — Open, enveloping aura. Strategy: To Respond.',
  'Manifesting Generator': 'Hybrid — Open aura with motor-to-Throat. Strategy: Respond, then Inform.',
  Projector: 'Guide — Focused, absorbing aura. Strategy: Wait for Invitation.',
  Reflector: 'Mirror — Resistant, sampling aura. Strategy: Wait Lunar Cycle.',
};

const AUTHORITY_DESCRIPTIONS: Record<HDAuthority, string> = {
  Emotional: 'Wait for emotional clarity over time. Never decide in the moment.',
  Sacral: 'Instant gut response — sacral sounds guide decisions.',
  Splenic: 'Intuitive, in-the-moment knowing. Quiet, instantaneous.',
  Ego: 'Decisions based on willpower and genuine desire.',
  'Self-Projected': 'Need to hear themselves speak their truth.',
  Mental: 'Sound boarding — talk through decisions in right environment.',
  Lunar: 'Must wait 28-day lunar cycle, tracking gate activations.',
};

const DEFINITION_TYPE_INFO: Record<DefinitionType, { description: string; characteristics: string[] }> = {
  Single: {
    description: 'All defined centers are connected in one continuous circuit. Energy flows smoothly internally.',
    characteristics: ['Self-contained', 'Consistent energy flow', 'Less dependent on others for wholeness'],
  },
  Split: {
    description: 'Two separate islands of definition. Need others to bridge the split for wholeness.',
    characteristics: ['Two areas of life', 'Seek bridging through relationships', 'Can feel split internally'],
  },
  'Triple Split': {
    description: 'Three separate islands of definition. Need multiple bridges/people for wholeness.',
    characteristics: ['Three distinct areas', 'Need variety in relationships', 'Fast processing when bridged'],
  },
  'Quadruple Split': {
    description: 'Four separate islands. Rare. Need many bridges; very fast processing when connected.',
    characteristics: ['Four distinct areas', 'Highly dependent on environment/people', 'Very fast when bridged'],
  },
  'No Definition': {
    description: 'All centers undefined. Completely open to conditioning. Mirror of environment.',
    characteristics: ['No consistent energy', 'Wisdom through sampling', 'Environment is everything'],
  },
};

interface HumanDesignDashboardProps {
  chartId?: string;
}

export default function HumanDesignDashboard({ chartId }: HumanDesignDashboardProps) {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [chart, setChart] = useState<HDChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'definition' | 'variables'>('overview');

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
        <p className="text-text-muted">Select a chart to view your Human Design.</p>
      </div>
    );
  }

  const TypeIcon = HD_TYPE_ICONS[chart.hd_type] || Crown;
  const definedCenters = chart.bodygraph_data.centers.filter(c => c.defined).length;
  const undefinedCenters = chart.bodygraph_data.centers.filter(c => c.status === 'undefined').length;
  const openCenters = chart.bodygraph_data.centers.filter(c => c.status === 'open').length;
  const definedChannels = chart.bodygraph_data.channels.filter(c => c.defined).length;

  return (
    <div className="space-y-8">
      {/* Header with GoldTriangle Accent */}
      <GoldTriangleSection orientation="down" size="lg" className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 w-full">
          <div>
            <h1 className="text-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Human Design
            </h1>
            <p className="text-body-lg text-text-secondary mt-2">
              {chart.subject_name} • {chart.hd_type} • {chart.authority} Authority
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="gold" className="text-sm">
              {chart.profile} Profile
            </Badge>
            {chart.incarnation_cross && (
              <Badge variant="subtle" className="text-sm max-w-[200px] truncate">
                {chart.incarnation_cross}
              </Badge>
            )}
          </div>
        </div>
      </GoldTriangleSection>

      {/* Type, Authority, Profile, Cross Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Type Card */}
        <Card variant="hover" padding="default" className="relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <TypeIcon className="h-16 w-16 text-accent-gold" />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent-gold-muted">
              <TypeIcon className="h-5 w-5 text-accent-gold" />
            </div>
            <div>
              <h3 className="label text-text-muted">Energy Type</h3>
              <p className="text-heading-3 font-medium text-text-primary">{chart.hd_type}</p>
            </div>
          </div>
          <p className="text-body-sm text-text-secondary">{HD_TYPE_DESCRIPTIONS[chart.hd_type]}</p>
          <div className="mt-3 pt-3 border-t border-border-subtle">
            <span className="label text-text-muted">Strategy:</span>
            <p className="text-body-sm text-text-primary font-medium mt-1">{chart.strategy}</p>
          </div>
          <div className="mt-2">
            <span className="label text-text-muted">Signature:</span>
            <p className="text-body-sm text-accent-gold font-medium mt-1">{chart.signature}</p>
          </div>
          <div className="mt-2">
            <span className="label text-text-muted">Not-Self:</span>
            <p className="text-body-sm text-semantic-danger font-medium mt-1">{chart.not_self_theme}</p>
          </div>
        </Card>

        {/* Authority Card */}
        <Card variant="hover" padding="default" className="relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <Brain className="h-16 w-16 text-accent-gold" />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent-gold-muted">
              <Brain className="h-5 w-5 text-accent-gold" />
            </div>
            <div>
              <h3 className="label text-text-muted">Inner Authority</h3>
              <p className="text-heading-3 font-medium text-text-primary">{chart.authority}</p>
            </div>
          </div>
          <p className="text-body-sm text-text-secondary">{AUTHORITY_DESCRIPTIONS[chart.authority]}</p>
        </Card>

        {/* Profile Card */}
        <Card variant="hover" padding="default" className="relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <User className="h-16 w-16 text-accent-gold" />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent-gold-muted">
              <User className="h-5 w-5 text-accent-gold" />
            </div>
            <div>
              <h3 className="label text-text-muted">Profile</h3>
              <p className="text-heading-3 font-medium text-text-primary">{chart.profile}</p>
            </div>
          </div>
          {chart.bodygraph_data.profile && (
            <>
              <p className="text-body-sm text-text-secondary mb-2">
                {chart.bodygraph_data.profile.conscious_line.name} / {chart.bodygraph_data.profile.unconscious_line.name}
              </p>
              <p className="text-body-sm text-text-muted">{chart.bodygraph_data.profile.description}</p>
            </>
          )}
        </Card>

        {/* Incarnation Cross Card */}
        <Card variant="hover" padding="default" className="relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <Compass className="h-16 w-16 text-accent-gold" />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent-gold-muted">
              <Compass className="h-5 w-5 text-accent-gold" />
            </div>
            <div>
              <h3 className="label text-text-muted">Incarnation Cross</h3>
              <p className="text-heading-3 font-medium text-text-primary truncate max-w-[200px]">
                {chart.incarnation_cross || 'Loading...'}
              </p>
            </div>
          </div>
          {chart.bodygraph_data.incarnation_cross?.theme && (
            <p className="text-body-sm text-text-secondary">{chart.bodygraph_data.incarnation_cross.theme}</p>
          )}
          <div className="mt-3 pt-3 border-t border-border-subtle">
            <span className="label text-text-muted">Quarter:</span>
            <p className="text-body-sm text-text-secondary mt-1">{chart.bodygraph_data.incarnation_cross?.quarter || '—'}</p>
          </div>
        </Card>
      </div>

      {/* Main Content: Bodygraph + Definition Summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bodygraph - Large, Interactive */}
        <div className="lg:col-span-2">
          <Card variant="elevated" padding="none" className="h-[700px] lg:h-[800px] overflow-hidden">
            <CardHeader className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent-gold-muted">
                    <Circle className="h-5 w-5 text-accent-gold" />
                  </div>
                  <CardTitle className="mb-0">Bodygraph</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={definedCenters > 0 ? 'gold' : 'subtle'} className="text-xs">
                    {definedCenters} Defined
                  </Badge>
                  <Badge variant={undefinedCenters > 0 ? 'gold' : 'subtle'} className="text-xs">
                    {undefinedCenters} Undefined
                  </Badge>
                  <Badge variant={openCenters > 0 ? 'gold' : 'subtle'} className="text-xs">
                    {openCenters} Open
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <div className="w-full h-full">
                <BodygraphSVG
                  centers={chart.bodygraph_data.centers}
                  channels={chart.bodygraph_data.channels}
                  gates={chart.bodygraph_data.gates}
                  definitionType={chart.definition_type}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Definition Summary Panel */}
        <div className="space-y-4">
          {/* Definition Type */}
          <Card variant="hover" padding="default">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent-gold-muted flex-shrink-0">
                <Shield className="h-5 w-5 text-accent-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="label text-text-muted">Definition Type</h3>
                <p className="text-heading-3 font-medium text-text-primary mt-1">
                  {chart.definition_type || 'Single'} Definition
                </p>
              </div>
            </div>
            {chart.definition_type && DEFINITION_TYPE_INFO[chart.definition_type] && (
              <div className="mt-4 pt-4 border-t border-border-subtle space-y-3">
                <p className="text-body-sm text-text-secondary">
                  {DEFINITION_TYPE_INFO[chart.definition_type].description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {DEFINITION_TYPE_INFO[chart.definition_type].characteristics.map((char, idx) => (
                    <Badge key={idx} variant="subtle" className="text-xs">{char}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Center Summary */}
          <Card variant="hover" padding="default">
            <h3 className="label text-text-muted mb-4 flex items-center gap-2">
              <Heart className="h-4 w-4 text-accent-gold" />
              Center Summary
            </h3>
            <div className="space-y-3">
              {chart.bodygraph_data.centers.map(center => (
                <div
                  key={center.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg transition-colors',
                    center.defined ? 'bg-accent-gold-muted border border-accent-gold-border' : 'bg-bg-hover'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
                        center.status === 'defined' && 'bg-accent-gold text-bg-primary',
                        center.status === 'undefined' && 'bg-text-muted text-bg-primary',
                        center.status === 'open' && 'border border-border-standard bg-transparent'
                      )}
                    >
                      {CENTER_LABELS[center.id]}
                    </div>
                    <span className="text-body-sm font-medium text-text-primary">{center.name}</span>
                  </div>
                  <Badge
                    variant={center.status === 'defined' ? 'gold' : 'subtle'}
                    className="text-xs"
                  >
                    {center.status.charAt(0).toUpperCase() + center.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Channel Summary */}
          <Card variant="hover" padding="default">
            <h3 className="label text-text-muted mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent-gold" />
              Defined Channels ({definedChannels})
            </h3>
            {definedChannels > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {chart.bodygraph_data.channels
                  .filter(c => c.defined)
                  .map(channel => (
                    <button
                      key={channel.id}
                      className="w-full text-left p-3 bg-bg-hover rounded-lg border border-border-subtle hover:border-accent-gold hover:text-accent-gold transition-all text-body-sm flex items-center justify-between"
                    >
                      <span>{channel.id} — {channel.name}</span>
                      <ChevronRight className="h-4 w-4 text-text-muted" />
                    </button>
                  ))}
              </div>
            ) : (
              <p className="text-body-sm text-text-muted text-center py-4">No defined channels</p>
            )}
          </Card>
        </div>
      </div>

      {/* Tabs for deeper exploration */}
      <Tabs
        defaultValue="overview"
        onChange={(value: string) => setActiveTab(value as 'overview' | 'definition' | 'variables')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabTrigger value="overview">Overview</TabTrigger>
          <TabTrigger value="definition">Definition</TabTrigger>
          <TabTrigger value="variables">Variables (PHS)</TabTrigger>
        </TabsList>

        <TabContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="hover" padding="default">
              <h3 className="label text-text-muted mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-accent-gold" />
                Strategy & Signature
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-body-sm font-medium text-text-primary mb-1">Strategy</h4>
                  <p className="text-body text-text-secondary">{chart.strategy}</p>
                </div>
                <div>
                  <h4 className="text-body-sm font-medium text-text-primary mb-1">Signature (Aligned State)</h4>
                  <p className="text-body text-accent-gold font-medium">{chart.signature}</p>
                </div>
                <div>
                  <h4 className="text-body-sm font-medium text-text-primary mb-1">Not-Self Theme (Misaligned)</h4>
                  <p className="text-body text-semantic-danger font-medium">{chart.not_self_theme}</p>
                </div>
                <div>
                  <h4 className="text-body-sm font-medium text-text-primary mb-1">Aura Type</h4>
                  <p className="text-body text-text-secondary">
                    {HD_TYPE_DESCRIPTIONS[chart.hd_type].split('. ')[0]}.
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="hover" padding="default">
              <h3 className="label text-text-muted mb-4 flex items-center gap-2">
                <Compass className="h-4 w-4 text-accent-gold" />
                Incarnation Cross Details
              </h3>
              {chart.bodygraph_data.incarnation_cross && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-body-sm font-medium text-text-primary mb-1">Cross Name</h4>
                    <p className="text-heading-3 font-medium text-text-primary">{chart.bodygraph_data.incarnation_cross.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-body-sm font-medium text-text-primary mb-1">Conscious Sun</h4>
                      <p className="text-body text-accent-gold font-medium">Gate {chart.bodygraph_data.incarnation_cross.conscious_sun_gate}</p>
                    </div>
                    <div>
                      <h4 className="text-body-sm font-medium text-text-primary mb-1">Conscious Earth</h4>
                      <p className="text-body text-accent-gold font-medium">Gate {chart.bodygraph_data.incarnation_cross.conscious_earth_gate}</p>
                    </div>
                    <div>
                      <h4 className="text-body-sm font-medium text-text-primary mb-1">Unconscious Sun</h4>
                      <p className="text-body text-semantic-danger font-medium">Gate {chart.bodygraph_data.incarnation_cross.unconscious_sun_gate}</p>
                    </div>
                    <div>
                      <h4 className="text-body-sm font-medium text-text-primary mb-1">Unconscious Earth</h4>
                      <p className="text-body text-semantic-danger font-medium">Gate {chart.bodygraph_data.incarnation_cross.unconscious_earth_gate}</p>
                    </div>
                  </div>
                  {chart.bodygraph_data.incarnation_cross.theme && (
                    <div className="pt-4 border-t border-border-subtle">
                      <h4 className="text-body-sm font-medium text-text-primary mb-1">Life Theme</h4>
                      <p className="text-body text-text-secondary">{chart.bodygraph_data.incarnation_cross.theme}</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </TabContent>

        <TabContent value="definition" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="hover" padding="default">
              <h3 className="label text-text-muted mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent-gold" />
                Definition Breakdown
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-body-sm font-medium text-text-primary mb-2">Defined Centers ({definedCenters})</h4>
                  <div className="flex flex-wrap gap-2">
                    {chart.bodygraph_data.centers.filter(c => c.defined).map(c => (
                      <Badge key={c.id} variant="gold">{CENTER_LABELS[c.id]}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-body-sm font-medium text-text-primary mb-2">Undefined Centers ({undefinedCenters})</h4>
                  <div className="flex flex-wrap gap-2">
                    {chart.bodygraph_data.centers.filter(c => c.status === 'undefined').map(c => (
                      <Badge key={c.id} variant="subtle">{CENTER_LABELS[c.id]}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-body-sm font-medium text-text-primary mb-2">Open Centers ({openCenters})</h4>
                  <div className="flex flex-wrap gap-2">
                    {chart.bodygraph_data.centers.filter(c => c.status === 'open').map(c => (
                      <Badge key={c.id} variant="subtle" className="border-border-subtle bg-transparent">{CENTER_LABELS[c.id]}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="hover" padding="default">
              <h3 className="label text-text-muted mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent-gold" />
                Circuit Summary
              </h3>
              <div className="space-y-4">
                {['Individual', 'Tribal', 'Collective'].map(circuit => {
                  const circuitChannels = chart.bodygraph_data.channels.filter(c => c.defined && c.circuit === circuit);
                  if (circuitChannels.length === 0) return null;
                  return (
                    <div key={circuit}>
                      <h4 className="text-body-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent-gold" />
                        {circuit} Circuit ({circuitChannels.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {circuitChannels.map(ch => (
                          <Badge key={ch.id} variant="subtle" className="text-xs">{ch.id}</Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </TabContent>

        <TabContent value="variables" className="space-y-6">
          <Card variant="hover" padding="default">
            <h3 className="label text-text-muted mb-4 flex items-center gap-2">
              <Brain className="h-4 w-4 text-accent-gold" />
              Variables (PHS) — Primary Health System
            </h3>
            <p className="text-body-sm text-text-muted mb-6">
              Your four variables determine your optimal environment, digestion, perspective, and motivation.
              Arrows: Left = Active/Structured, Right = Passive/Receptive
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {chart.bodygraph_data.variables.map((variable, idx) => (
                <Card key={variable.name} variant="default" padding="default" className="relative">
                  <GoldTriangle size="sm" orientation="down" className="absolute top-4 right-4" pulse />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-accent-gold-muted">
                      <Brain className="h-5 w-5 text-accent-gold" />
                    </div>
                    <div>
                      <h4 className="text-heading-3 font-medium text-text-primary">{variable.name}</h4>
                      <p className="label text-text-muted">
                        {variable.arrow === 'left' ? '← Left (Active/Structured)' : '→ Right (Passive/Receptive)'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xl font-display font-semibold text-accent-gold">{variable.color}</div>
                      <div className="label text-text-muted">Color</div>
                    </div>
                    <div>
                      <div className="text-xl font-display font-semibold text-accent-gold">{variable.tone}</div>
                      <div className="label text-text-muted">Tone</div>
                    </div>
                    <div>
                      <div className="text-xl font-display font-semibold text-accent-gold">{variable.base}</div>
                      <div className="label text-text-muted">Base</div>
                    </div>
                  </div>
                  {variable.description && (
                    <div className="mt-3 pt-3 border-t border-border-subtle">
                      <p className="text-body-sm text-text-secondary">{variable.description}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </Card>
        </TabContent>
      </Tabs>
    </div>
  );
}
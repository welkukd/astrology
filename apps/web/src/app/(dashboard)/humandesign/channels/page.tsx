'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalClose } from '@/components/ui/Modal';
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/Tabs';
import { GoldTriangle, GoldTriangleSection } from '@/components/ui/GoldTriangle';
import { Input } from '@/components/ui/Input';
import { HDChartData, HDChannel, HDGate, CenterType } from '@/components/humandesign/types';
import {
  Crown, Zap, Shield, User, Target, Compass, Circle, Heart, Brain,
  Loader2, AlertTriangle, Info, ChevronRight, Search, Filter, X,
  ArrowUpDown, ArrowDownUp
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

const CIRCUIT_COLORS: Record<string, string> = {
  Individual: '#fbbf24',    // Gold
  Tribal: '#ef4444',        // Red
  Collective: '#3b82f6',    // Blue
};

const CIRCUIT_LABELS = ['Individual', 'Tribal', 'Collective'] as const;
type CircuitType = typeof CIRCUIT_LABELS[number];

const KEYSTONE_GATES = [20, 34, 57, 10, 1, 2, 7, 13, 25, 46, 49, 19, 55, 39, 41, 30, 36, 35, 40, 37, 21, 45, 26, 44, 51, 25, 28, 38, 54, 32, 58, 18, 52, 9, 53, 42, 60, 3, 61, 24, 63, 4, 64, 47, 43, 23, 17, 62, 11, 56, 12, 22, 8, 1, 16, 48, 31, 7, 33, 13, 57, 10, 20, 34];

interface ChannelsPageProps {
  chartId?: string;
}

export default function ChannelsPage({ chartId }: ChannelsPageProps) {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [chart, setChart] = useState<HDChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<HDChannel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterDefinition, setFilterDefinition] = useState<'all' | 'defined' | 'undefined'>('all');
  const [filterCircuit, setFilterCircuit] = useState<CircuitType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'circuit' | 'gates'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

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
        <p className="text-text-muted">Select a chart to view your Human Design channels.</p>
      </div>
    );
  }

  const allChannels = chart.bodygraph_data.channels;
  const definedChannels = allChannels.filter(c => c.defined);
  const undefinedChannels = allChannels.filter(c => !c.defined);

  const filteredChannels = useMemo(() => {
    let result = allChannels;

    // Filter by definition
    if (filterDefinition === 'defined') {
      result = result.filter(c => c.defined);
    } else if (filterDefinition === 'undefined') {
      result = result.filter(c => !c.defined);
    }

    // Filter by circuit
    if (filterCircuit !== 'all') {
      result = result.filter(c => c.circuit === filterCircuit);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query) ||
        c.gate_start.toString().includes(query) ||
        c.gate_end.toString().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      switch (sortBy) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'circuit':
          aVal = a.circuit || 'zzz';
          bVal = b.circuit || 'zzz';
          break;
        case 'gates':
          aVal = a.gate_start + a.gate_end;
          bVal = b.gate_start + b.gate_end;
          break;
      }

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [allChannels, filterDefinition, filterCircuit, searchQuery, sortBy, sortDir]);

  const handleSort = (field: 'name' | 'circuit' | 'gates') => {
    if (sortBy === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const handleChannelClick = (channel: HDChannel) => {
    setSelectedChannel(channel);
    setShowModal(true);
  };

  const clearFilters = () => {
    setFilterDefinition('all');
    setFilterCircuit('all');
    setSearchQuery('');
  };

  const hasActiveFilters = filterDefinition !== 'all' || filterCircuit !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="space-y-8">
      {/* Header with GoldTriangle */}
      <GoldTriangleSection orientation="down" size="lg" className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 w-full">
          <div>
            <h1 className="text-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Channels
            </h1>
            <p className="text-body-lg text-text-secondary mt-2">
              {chart.subject_name} — {definedChannels.length} of 36 Channels Defined
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="gold" className="text-sm">{definedChannels.length} Defined</Badge>
            <Badge variant="subtle" className="text-sm">{undefinedChannels.length} Undefined</Badge>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-text-muted">
                <X className="h-4 w-4 mr-1" /> Clear Filters
              </Button>
            )}
          </div>
        </div>
      </GoldTriangleSection>

      {/* Filter Bar */}
      <Card variant="default" padding="default" className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search channels by name, ID, or gate numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-3">
          {/* Definition Filter */}
          <div className="flex items-center gap-2">
            <span className="label text-text-muted">Definition:</span>
            {(['all', 'defined', 'undefined'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setFilterDefinition(filter)}
                className={cn(
                  'px-3 py-1.5 rounded-pill text-sm font-medium transition-all',
                  filterDefinition === filter
                    ? 'bg-accent-gold text-bg-primary shadow-gold-glow'
                    : 'bg-bg-card border border-border-subtle text-text-secondary hover:border-accent-gold hover:text-accent-gold'
                )}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-bg-primary">
                  {filter === 'all' ? allChannels.length : filter === 'defined' ? definedChannels.length : undefinedChannels.length}
                </span>
              </button>
            ))}
          </div>

          {/* Circuit Filter */}
          <div className="flex items-center gap-2">
            <span className="label text-text-muted">Circuit:</span>
            {(['all', 'Individual', 'Tribal', 'Collective'] as const).map(circuit => (
              <button
                key={circuit}
                onClick={() => setFilterCircuit(circuit)}
                className={cn(
                  'px-3 py-1.5 rounded-pill text-sm font-medium transition-all',
                  filterCircuit === circuit
                    ? 'text-bg-primary shadow-gold-glow'
                    : 'bg-bg-card border border-border-subtle text-text-secondary hover:border-accent-gold hover:text-accent-gold',
                  filterCircuit === circuit && `bg-[${circuit !== 'all' ? CIRCUIT_COLORS[circuit] : 'var(--color-accent-gold)'}]`
                )}
                style={filterCircuit === circuit && circuit !== 'all' ? { backgroundColor: CIRCUIT_COLORS[circuit] } : undefined}
              >
                {circuit}
                <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-bg-primary/50">
                  {allChannels.filter(c => circuit === 'all' || c.circuit === circuit).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3 pt-2 border-t border-border-subtle">
          <span className="label text-text-muted">Sort:</span>
          {(['name', 'circuit', 'gates'] as const).map(field => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1',
                sortBy === field
                  ? 'bg-accent-gold text-bg-primary'
                  : 'bg-bg-card border border-border-subtle text-text-secondary hover:border-accent-gold hover:text-accent-gold'
              )}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {sortBy === field && (
                <span className="ml-1">
                  {sortDir === 'asc' ? <ArrowUpDown className="h-3 w-3" /> : <ArrowDownUp className="h-3 w-3" />}
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Channels List */}
      <div className="space-y-3">
        {filteredChannels.length === 0 ? (
          <Card variant="default" padding="xl" className="text-center">
            <Filter className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h3 className="heading-3 font-medium mb-2">No channels match filters</h3>
            <p className="text-text-muted">Try adjusting your filters or search query</p>
          </Card>
        ) : (
          filteredChannels.map(channel => {
            const gateStart = chart.bodygraph_data.gates.find(g => g.number === channel.gate_start);
            const gateEnd = chart.bodygraph_data.gates.find(g => g.number === channel.gate_end);
            const isKeystone = KEYSTONE_GATES.includes(channel.gate_start) || KEYSTONE_GATES.includes(channel.gate_end);
            const circuitColor = channel.circuit ? CIRCUIT_COLORS[channel.circuit] : 'rgba(255,255,255,0.2)';

            return (
              <Card
                key={channel.id}
                variant="hover"
                padding="default"
                className={cn(
                  'cursor-pointer transition-all',
                  channel.defined
                    ? 'bg-accent-gold-muted/30 border-accent-gold-border/50 shadow-gold-glow/20'
                    : 'bg-bg-card border-border-subtle'
                )}
                onClick={() => handleChannelClick(channel)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className={cn(
                        'px-3 py-1 rounded-pill text-xs font-semibold uppercase tracking-wide',
                        channel.defined
                          ? 'bg-accent-gold text-bg-primary'
                          : 'bg-bg-hover text-text-muted border border-border-subtle'
                      )}>
                        {channel.defined ? 'Defined' : 'Undefined'}
                      </div>

                      {channel.circuit && (
                        <Badge variant="subtle" className="text-xs" style={{ backgroundColor: `${circuitColor}20`, borderColor: `${circuitColor}60`, color: circuitColor }}>
                          {channel.circuit} Circuit
                        </Badge>
                      )}

                      {isKeystone && (
                        <Badge variant="gold" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" /> Keystone
                        </Badge>
                      )}

                      <span className="text-caption text-text-muted">
                        {channel.center_start} ↔ {channel.center_end}
                      </span>
                    </div>

                    <h3 className="text-heading-3 font-medium text-text-primary mb-1">{channel.name}</h3>
                    <p className="text-body-sm text-text-secondary">{channel.id} — Gate {channel.gate_start} → Gate {channel.gate_end}</p>

                    {gateStart && gateEnd && (
                      <div className="mt-2 flex items-center gap-4 text-caption text-text-muted">
                        <span className="flex items-center gap-1">
                          <Circle className="h-3 w-3" />
                          Gate {gateStart.number}: {gateStart.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Circle className="h-3 w-3" />
                          Gate {gateEnd.number}: {gateEnd.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <ChevronRight className="h-5 w-5 text-text-muted" />
                    {channel.defined && (
                      <GoldTriangle size="sm" orientation="right" className="text-accent-gold" pulse />
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Channel Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedChannel(null); }}
        title={selectedChannel?.name}
        size="lg"
      >
        {selectedChannel && (
          <>
            <ModalHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-accent-gold-muted">
                  <Zap className="h-6 w-6 text-accent-gold" />
                </div>
                <div>
                  <ModalTitle className="text-heading-2">{selectedChannel.name}</ModalTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={selectedChannel.defined ? 'gold' : 'subtle'}>
                      {selectedChannel.defined ? 'Defined' : 'Undefined'}
                    </Badge>
                    {selectedChannel.circuit && (
                      <Badge variant="subtle" style={{ backgroundColor: `${CIRCUIT_COLORS[selectedChannel.circuit]}20`, borderColor: `${CIRCUIT_COLORS[selectedChannel.circuit]}60`, color: CIRCUIT_COLORS[selectedChannel.circuit] }}>
                        {selectedChannel.circuit} Circuit
                      </Badge>
                    )}
                    {(KEYSTONE_GATES.includes(selectedChannel.gate_start) || KEYSTONE_GATES.includes(selectedChannel.gate_end)) && (
                      <Badge variant="gold">
                        <Zap className="h-3 w-3 mr-1" /> Keystone Channel
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Gate Pair */}
                <div className="grid grid-cols-2 gap-4">
                  <Card variant="default" padding="default" className="text-center">
                    <h4 className="label text-text-muted mb-2">Gate {selectedChannel.gate_start} (Start)</h4>
                    <p className="text-heading-3 font-medium text-text-primary">
                      {chart.bodygraph_data.gates.find(g => g.number === selectedChannel.gate_start)?.name || '—'}
                    </p>
                    <p className="text-caption text-text-muted mt-1">
                      {CENTER_LABELS[selectedChannel.center_start]}
                    </p>
                  </Card>
                  <Card variant="default" padding="default" className="text-center">
                    <h4 className="label text-text-muted mb-2">Gate {selectedChannel.gate_end} (End)</h4>
                    <p className="text-heading-3 font-medium text-text-primary">
                      {chart.bodygraph_data.gates.find(g => g.number === selectedChannel.gate_end)?.name || '—'}
                    </p>
                    <p className="text-caption text-text-muted mt-1">
                      {CENTER_LABELS[selectedChannel.center_end]}
                    </p>
                  </Card>
                </div>

                {/* Circuit & Keystone */}
                <div className="grid grid-cols-2 gap-4">
                  <Card variant="default" padding="default">
                    <h4 className="label text-text-muted mb-2">Circuit</h4>
                    <p className="text-heading-3 font-medium" style={{ color: selectedChannel.circuit ? CIRCUIT_COLORS[selectedChannel.circuit] : 'var(--text-primary)' }}>
                      {selectedChannel.circuit || '—'}
                    </p>
                    <p className="text-caption text-text-muted mt-1">
                      {selectedChannel.circuit === 'Individual' && 'Self-empowerment, mutation, unique expression'}
                      {selectedChannel.circuit === 'Tribal' && 'Support, community, touch, material resources'}
                      {selectedChannel.circuit === 'Collective' && 'Sharing, patterns, abstract understanding, logic'}
                    </p>
                  </Card>
                  <Card variant="default" padding="default">
                    <h4 className="label text-text-muted mb-2">Keystone</h4>
                    <p className="text-heading-3 font-medium text-accent-gold">
                      {KEYSTONE_GATES.includes(selectedChannel.gate_start) || KEYSTONE_GATES.includes(selectedChannel.gate_end) ? 'Yes' : 'No'}
                    </p>
                    <p className="text-caption text-text-muted mt-1">
                      Keystone channels have gates that are pivotal in the bodygraph
                    </p>
                  </Card>
                </div>

                {/* Theme */}
                {selectedChannel.theme && (
                  <div>
                    <h4 className="label text-text-muted mb-2 flex items-center gap-2">
                      <Crown className="h-4 w-4 text-accent-gold" />
                      Theme / Keynote
                    </h4>
                    <p className="body text-text-secondary">{selectedChannel.theme}</p>
                  </div>
                )}

                {/* Shadow */}
                {selectedChannel.shadow && (
                  <div className="bg-semantic-danger/10 border border-semantic-danger/20 rounded-lg p-4">
                    <h4 className="label text-semantic-danger mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Not-Self / Shadow
                    </h4>
                    <p className="body text-text-secondary">{selectedChannel.shadow}</p>
                  </div>
                )}

                {/* Description */}
                {selectedChannel.description && (
                  <div>
                    <h4 className="label text-text-muted mb-2">Description</h4>
                    <p className="body text-text-secondary">{selectedChannel.description}</p>
                  </div>
                )}

                {/* Gate Details */}
                <div className="pt-4 border-t border-border-subtle">
                  <h4 className="label text-text-muted mb-3">Gate Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { gate: chart.bodygraph_data.gates.find(g => g.number === selectedChannel.gate_start), label: 'Start Gate' },
                      { gate: chart.bodygraph_data.gates.find(g => g.number === selectedChannel.gate_end), label: 'End Gate' },
                    ].map(({ gate, label }) => gate && (
                      <Card key={gate.number} variant="default" padding="default">
                        <h5 className="label text-text-muted mb-2">{label}: Gate {gate.number}</h5>
                        <p className="text-body font-medium text-text-primary mb-2">{gate.name}</p>
                        <div className="grid grid-cols-4 gap-2 text-center text-caption">
                          <div><span className="text-text-muted">Line</span> <div className="font-semibold text-accent-gold">{gate.line}</div></div>
                          <div><span className="text-text-muted">Color</span> <div className="font-semibold text-accent-gold">{gate.color}</div></div>
                          <div><span className="text-text-muted">Tone</span> <div className="font-semibold text-accent-gold">{gate.tone}</div></div>
                          <div><span className="text-text-muted">Base</span> <div className="font-semibold text-accent-gold">{gate.base}</div></div>
                        </div>
                        <div className="mt-2 text-caption text-text-muted">
                          {gate.conscious ? 'Personality (Black)' : 'Design (Red)'}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalClose />
          </>
        )}
      </Modal>
    </div>
  );
}
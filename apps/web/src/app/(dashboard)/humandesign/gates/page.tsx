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
import { HDChartData, HDGate, CenterType } from '@/components/humandesign/types';
import {
  Crown, Zap, Shield, User, Target, Compass, Circle, Heart, Brain,
  Loader2, AlertTriangle, Info, ChevronRight, Search, Filter, X,
  ArrowUpDown, ArrowDownUp, Hash, Hexagon
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

const ALL_CENTER_TYPES: CenterType[] = [
  'Head', 'Ajna', 'Throat', 'G Center', 'Heart/Ego',
  'Solar Plexus', 'Spleen', 'Sacral', 'Root',
];

interface GatesPageProps {
  chartId?: string;
}

export default function GatesPage({ chartId }: GatesPageProps) {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [chart, setChart] = useState<HDChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGate, setSelectedGate] = useState<HDGate | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterCenter, setFilterCenter] = useState<CenterType | 'all'>('all');
  const [filterDefinition, setFilterDefinition] = useState<'all' | 'defined' | 'undefined'>('all');
  const [filterConscious, setFilterConscious] = useState<'all' | 'conscious' | 'unconscious'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'number' | 'center' | 'line' | 'definition'>('number');
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
        <p className="text-text-muted">Select a chart to view your Human Design gates.</p>
      </div>
    );
  }

  const allGates = chart.bodygraph_data.gates;
  const definedGates = allGates.filter(g => g.defined);
  const consciousGates = allGates.filter(g => g.defined && g.conscious);
  const unconsciousGates = allGates.filter(g => g.defined && !g.conscious);

  const filteredGates = useMemo(() => {
    let result = allGates;

    // Filter by center
    if (filterCenter !== 'all') {
      result = result.filter(g => g.center === filterCenter);
    }

    // Filter by definition
    if (filterDefinition === 'defined') {
      result = result.filter(g => g.defined);
    } else if (filterDefinition === 'undefined') {
      result = result.filter(g => !g.defined);
    }

    // Filter by conscious/unconscious
    if (filterConscious === 'conscious') {
      result = result.filter(g => g.defined && g.conscious);
    } else if (filterConscious === 'unconscious') {
      result = result.filter(g => g.defined && !g.conscious);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(g =>
        g.name.toLowerCase().includes(query) ||
        g.number.toString().includes(query) ||
        g.center.toLowerCase().includes(query) ||
        g.keynotes.some(k => k.toLowerCase().includes(query))
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      switch (sortBy) {
        case 'number':
          aVal = a.number;
          bVal = b.number;
          break;
        case 'center':
          aVal = a.center;
          bVal = b.center;
          break;
        case 'line':
          aVal = a.line;
          bVal = b.line;
          break;
        case 'definition':
          aVal = a.defined ? 0 : 1;
          bVal = b.defined ? 0 : 1;
          break;
      }

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [allGates, filterCenter, filterDefinition, filterConscious, searchQuery, sortBy, sortDir]);

  const handleSort = (field: 'number' | 'center' | 'line' | 'definition') => {
    if (sortBy === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const handleGateClick = (gate: HDGate) => {
    setSelectedGate(gate);
    setShowModal(true);
  };

  const clearFilters = () => {
    setFilterCenter('all');
    setFilterDefinition('all');
    setFilterConscious('all');
    setSearchQuery('');
  };

  const hasActiveFilters = filterCenter !== 'all' || filterDefinition !== 'all' || filterConscious !== 'all' || searchQuery.trim() !== '';

  // I Ching hexagram data (simplified)
  const ICHING_HEXAGRAMS: Record<number, { name: string; structure: string; element: string }> = {
    1: { name: 'The Creative', structure: '☰ Heaven over Heaven', element: 'Heaven' },
    2: { name: 'The Receptive', structure: '☷ Earth over Earth', element: 'Earth' },
    3: { name: 'Difficulty at the Beginning', structure: '☳ Thunder over Water', element: 'Water' },
    4: { name: 'Youthful Folly', structure: '☵ Water over Mountain', element: 'Mountain' },
    5: { name: 'Waiting', structure: '☰ Heaven over Water', element: 'Water' },
    6: { name: 'Conflict', structure: '☵ Water over Heaven', element: 'Heaven' },
    7: { name: 'The Army', structure: '☷ Earth over Water', element: 'Water' },
    8: { name: 'Holding Together', structure: '☵ Water over Earth', element: 'Earth' },
    // ... abbreviated for brevity
  };

  return (
    <div className="space-y-8">
      {/* Header with GoldTriangle */}
      <GoldTriangleSection orientation="down" size="lg" className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 w-full">
          <div>
            <h1 className="text-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Gates
            </h1>
            <p className="text-body-lg text-text-secondary mt-2">
              {chart.subject_name} — {definedGates.length} of 64 Gates Defined ({consciousGates.length} Conscious, {unconsciousGates.length} Unconscious)
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="gold" className="text-sm">{definedGates.length} Defined</Badge>
            <Badge variant="subtle" className="text-sm">{unconsciousGates.length} Design (Red)</Badge>
            <Badge variant="gold" className="text-sm">{consciousGates.length} Personality (Black)</Badge>
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
            placeholder="Search gates by name, number, center, or keynotes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Chips Row 1: Center */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="label text-text-muted">Center:</span>
          {(['all', ...ALL_CENTER_TYPES] as const).map((center) => (
            <button
              key={center}
              onClick={() => setFilterCenter(center as "all" | CenterType)}
              className={cn(
                'px-3 py-1.5 rounded-pill text-sm font-medium transition-all',
                filterCenter === center
                  ? 'bg-accent-gold text-bg-primary shadow-gold-glow'
                  : 'bg-bg-card border border-border-subtle text-text-secondary hover:border-accent-gold hover:text-accent-gold'
              )}
            >
              {center === 'all' ? 'All' : CENTER_LABELS[center]}
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-bg-primary">
                {allGates.filter(g => center === 'all' || g.center === center).length}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Chips Row 2: Definition & Conscious */}
        <div className="flex items-center gap-2 flex-wrap">
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
                {filter === 'all' ? allGates.length : filter === 'defined' ? definedGates.length : allGates.length - definedGates.length}
              </span>
            </button>
          ))}

          <div className="w-px h-6 bg-border-subtle mx-2" />

          <span className="label text-text-muted">Type:</span>
          {(['all', 'conscious', 'unconscious'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setFilterConscious(filter)}
              className={cn(
                'px-3 py-1.5 rounded-pill text-sm font-medium transition-all',
                filterConscious === filter
                  ? 'bg-accent-gold text-bg-primary shadow-gold-glow'
                  : 'bg-bg-card border border-border-subtle text-text-secondary hover:border-accent-gold hover:text-accent-gold'
              )}
            >
              {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-bg-primary">
                {filter === 'all' ? definedGates.length : filter === 'conscious' ? consciousGates.length : unconsciousGates.length}
              </span>
            </button>
          ))}
        </div>

        {/* View Mode & Sort */}
        <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="label text-text-muted">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={cn('p-2 rounded-lg transition-all', viewMode === 'grid' ? 'bg-accent-gold text-bg-primary' : 'bg-bg-card border border-border-subtle text-text-secondary hover:border-accent-gold hover:text-accent-gold')}
            >
              <Hash className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn('p-2 rounded-lg transition-all', viewMode === 'list' ? 'bg-accent-gold text-bg-primary' : 'bg-bg-card border border-border-subtle text-text-secondary hover:border-accent-gold hover:text-accent-gold')}
            >
              <Hexagon className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="label text-text-muted">Sort:</span>
            {(['number', 'center', 'line', 'definition'] as const).map(field => (
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
        </div>
      </Card>

      {/* Gates Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredGates.map(gate => (
            <Card
              key={gate.number}
              variant="hover"
              padding="default"
              className={cn(
                'cursor-pointer transition-all text-center',
                gate.defined
                  ? 'bg-accent-gold-muted/30 border-accent-gold-border/50 shadow-gold-glow/20'
                  : 'bg-bg-card border-border-subtle'
              )}
              onClick={() => handleGateClick(gate)}
            >
              <div className="space-y-2">
                <div className={cn(
                  'text-3xl font-display font-bold',
                  gate.defined ? 'text-accent-gold' : 'text-text-muted'
                )}>
                  {gate.number}
                </div>
                <p className="text-body-sm font-medium text-text-primary truncate">{gate.name}</p>
                <div className="flex items-center justify-center gap-2 text-caption text-text-muted">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs',
                    gate.defined ? (gate.conscious ? 'bg-accent-gold/20 text-accent-gold' : 'bg-semantic-danger/20 text-semantic-danger') : 'bg-bg-hover text-text-muted'
                  )}>
                    {gate.defined ? (gate.conscious ? '● Personality' : '● Design') : 'Undefined'}
                  </span>
                  <span>{CENTER_LABELS[gate.center]}</span>
                </div>
                <div className="text-caption text-text-muted">
                  L{gate.line} C{gate.color} T{gate.tone} B{gate.base}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredGates.map(gate => (
            <Card
              key={gate.number}
              variant="hover"
              padding="default"
              className={cn(
                'cursor-pointer transition-all',
                gate.defined
                  ? 'bg-accent-gold-muted/30 border-accent-gold-border/50 shadow-gold-glow/20'
                  : 'bg-bg-card border-border-subtle'
              )}
              onClick={() => handleGateClick(gate)}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-16 h-16 rounded-xl flex items-center justify-center font-display font-bold text-2xl flex-shrink-0',
                  gate.defined ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold-border' : 'bg-bg-hover text-text-muted'
                )}>
                  {gate.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-heading-3 font-medium text-text-primary">{gate.name}</h3>
                    <Badge variant={gate.defined ? (gate.conscious ? 'gold' : 'subtle') : 'subtle'} className="text-xs">
                      {gate.defined ? (gate.conscious ? 'Personality (Black)' : 'Design (Red)') : 'Undefined'}
                    </Badge>
                    <Badge variant="subtle" className="text-xs">{CENTER_FULL_NAMES[gate.center]}</Badge>
                  </div>
                  <p className="text-body-sm text-text-secondary truncate">{gate.description || 'No description available'}</p>
                  <div className="flex items-center gap-4 mt-2 text-caption text-text-muted">
                    <span>Line {gate.line} • Color {gate.color} • Tone {gate.tone} • Base {gate.base}</span>
                    {gate.keynotes.length > 0 && (
                      <span className="flex flex-wrap gap-1">
                        {gate.keynotes.slice(0, 3).map((k, i) => (
                          <Badge key={i} variant="subtle" className="text-xs">{k}</Badge>
                        ))}
                        {gate.keynotes.length > 3 && <span className="text-text-muted">+{gate.keynotes.length - 3} more</span>}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-text-muted flex-shrink-0" />
                {gate.defined && <GoldTriangle size="sm" orientation="right" className="text-accent-gold" pulse />}
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredGates.length === 0 && (
        <Card variant="default" padding="xl" className="text-center">
          <Filter className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="heading-3 font-medium mb-2">No gates match filters</h3>
          <p className="text-text-muted">Try adjusting your filters or search query</p>
        </Card>
      )}

      {/* Gate Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedGate(null); }}
        title={`Gate ${selectedGate?.number}: ${selectedGate?.name}`}
        size="lg"
      >
        {selectedGate && (
          <>
            <ModalHeader>
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-16 h-16 rounded-xl flex items-center justify-center font-display font-bold text-2xl',
                  selectedGate.defined ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold-border' : 'bg-bg-hover text-text-muted'
                )}>
                  {selectedGate.number}
                </div>
                <div>
                  <ModalTitle className="text-heading-2">Gate {selectedGate.number}: {selectedGate.name}</ModalTitle>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant={selectedGate.defined ? (selectedGate.conscious ? 'gold' : 'subtle') : 'subtle'}>
                      {selectedGate.defined ? (selectedGate.conscious ? 'Personality (Black)' : 'Design (Red)') : 'Undefined'}
                    </Badge>
                    <Badge variant="subtle">{CENTER_FULL_NAMES[selectedGate.center]}</Badge>
                    {selectedGate.harmonic_gate && (
                      <Badge variant="subtle">Harmonic: Gate {selectedGate.harmonic_gate}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Line, Color, Tone, Base */}
                <div className="grid grid-cols-4 gap-4">
                  <Card variant="default" padding="default" className="text-center">
                    <div className="text-3xl font-display font-semibold text-accent-gold">{selectedGate.line}</div>
                    <div className="label text-text-muted">Line (1-6)</div>
                    <p className="text-caption text-text-muted mt-1">
                      {['Foundation', 'Projection', 'Adaptation', 'Externalization', 'Expression', 'Transition'][selectedGate.line - 1] || '—'}
                    </p>
                  </Card>
                  <Card variant="default" padding="default" className="text-center">
                    <div className="text-3xl font-display font-semibold text-accent-gold">{selectedGate.color}</div>
                    <div className="label text-text-muted">Color (1-6)</div>
                    <p className="text-caption text-text-muted mt-1">
                      {['Fear', 'Hope', 'Desire', 'Need', 'Guilt', 'Innocence'][selectedGate.color - 1] || '—'}
                    </p>
                  </Card>
                  <Card variant="default" padding="default" className="text-center">
                    <div className="text-3xl font-display font-semibold text-accent-gold">{selectedGate.tone}</div>
                    <div className="label text-text-muted">Tone (1-6)</div>
                    <p className="text-caption text-text-muted mt-1">
                      {['Smell', 'Taste', 'Outer Vision', 'Inner Vision', 'Feeling', 'Touch'][selectedGate.tone - 1] || '—'}
                    </p>
                  </Card>
                  <Card variant="default" padding="default" className="text-center">
                    <div className="text-3xl font-display font-semibold text-accent-gold">{selectedGate.base}</div>
                    <div className="label text-text-muted">Base (1-5)</div>
                    <p className="text-caption text-text-muted mt-1">
                      {['Foundation', 'Duality', 'Creativity', 'Mastery', 'Completion'][selectedGate.base - 1] || '—'}
                    </p>
                  </Card>
                </div>

                {/* Description */}
                {selectedGate.description && (
                  <div>
                    <h4 className="label text-text-muted mb-2">Description</h4>
                    <p className="body text-text-secondary">{selectedGate.description}</p>
                  </div>
                )}

                {/* Keynotes */}
                {selectedGate.keynotes.length > 0 && (
                  <div>
                    <h4 className="label text-text-muted mb-2">Keynotes</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedGate.keynotes.map((keynote, idx) => (
                        <Badge key={idx} variant="subtle">{keynote}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* I Ching Hexagram */}
                <div className="pt-4 border-t border-border-subtle">
                  <h4 className="label text-text-muted mb-3 flex items-center gap-2">
                    <Hexagon className="h-4 w-4 text-accent-gold" />
                    I Ching Hexagram {selectedGate.number}
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card variant="default" padding="default">
                      <h5 className="label text-text-muted mb-1">Hexagram Name</h5>
                      <p className="text-heading-3 font-medium text-text-primary">
                        {ICHING_HEXAGRAMS[selectedGate.number]?.name || `Hexagram ${selectedGate.number}`}
                      </p>
                    </Card>
                    <Card variant="default" padding="default">
                      <h5 className="label text-text-muted mb-1">Structure</h5>
                      <p className="text-body font-mono text-text-primary text-center text-xl">
                        {ICHING_HEXAGRAMS[selectedGate.number]?.structure || '—'}
                      </p>
                    </Card>
                    <Card variant="default" padding="default">
                      <h5 className="label text-text-muted mb-1">Element</h5>
                      <p className="text-body font-medium text-accent-gold text-center">
                        {ICHING_HEXAGRAMS[selectedGate.number]?.element || '—'}
                      </p>
                    </Card>
                  </div>
                  <div className="mt-4 p-4 bg-bg-hover rounded-lg">
                    <h5 className="label text-text-muted mb-2">Line {selectedGate.line} of Hexagram {selectedGate.number}</h5>
                    <p className="text-body-sm text-text-secondary">
                      This line represents the specific expression of this gate in your design.
                      {selectedGate.conscious ? 'As a conscious (Personality) gate, this is part of your conscious self-expression.' : 'As an unconscious (Design) gate, this operates below your conscious awareness.'}
                    </p>
                  </div>
                </div>

                {/* Harmonic Gate */}
                {selectedGate.harmonic_gate && (
                  <div className="pt-4 border-t border-border-subtle">
                    <h4 className="label text-text-muted mb-3">Harmonic Gate</h4>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-accent-gold/10 border border-accent-gold-border flex items-center justify-center font-display font-bold text-2xl text-accent-gold">
                        {selectedGate.harmonic_gate}
                      </div>
                      <div>
                        <p className="text-heading-3 font-medium text-text-primary">
                          Gate {selectedGate.harmonic_gate}: {chart.bodygraph_data.gates.find(g => g.number === selectedGate.harmonic_gate)?.name || '—'}
                        </p>
                        <p className="text-body-sm text-text-muted">
                          Harmonic gates share the same line, color, tone, and base.
                          They resonate with each other across the bodygraph.
                        </p>
                      </div>
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
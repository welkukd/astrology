'use client';

import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Sparkles, Brain, Cloud, Flame, Heart, Filter, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GoldTriangle } from '@/components/ui/GoldTriangle';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/Tabs';

interface LibraryItem {
  id: string;
  type: 'meditation' | 'dream' | 'habit' | 'tarot';
  title: string;
  subtitle: string;
  date: string;
  data: Record<string, unknown>;
  tags: string[];
}

const MEDITATION_TYPES: Record<string, { name: string; icon: React.ReactNode; color: string }> = {
  'breath': { name: 'Breath Awareness', icon: <span>💨</span>, color: 'text-blue-400' },
  'body-scan': { name: 'Body Scan', icon: <span>❤️</span>, color: 'text-green-400' },
  'loving-kindness': { name: 'Loving Kindness', icon: <span>☀️</span>, color: 'text-yellow-400' },
  'mantra': { name: 'Mantra', icon: <span>🎵</span>, color: 'text-purple-400' },
  'visualization': { name: 'Visualization', icon: <span>🍃</span>, color: 'text-emerald-400' },
  'walking': { name: 'Walking Meditation', icon: <span>🔥</span>, color: 'text-orange-400' },
};

export function GuideLibrary() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'meditation' | 'dream' | 'habit' | 'tarot'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load from localStorage
      const meditations = JSON.parse(localStorage.getItem('gaia-saved-meditations') || '[]');
      const dreams = JSON.parse(localStorage.getItem('gaia-dream-journal') || '[]');
      const habits = JSON.parse(localStorage.getItem('gaia-habits') || '[]');
      const tarotReadings = JSON.parse(localStorage.getItem('gaia-tarot-readings') || '[]');

      const allItems: LibraryItem[] = [
        ...meditations.map((m: any) => ({
          id: m.id,
          type: 'meditation' as const,
          title: MEDITATION_TYPES[m.typeId]?.name || 'Meditation',
          subtitle: `${m.duration} min • ${new Date(m.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          date: m.completedAt,
          data: m,
          tags: [m.typeId, `${m.duration}min`, m.preMood !== undefined ? `mood:${m.preMood}→${m.postMood}` : ''].filter(Boolean),
        })),
        ...dreams.map((d: any) => ({
          id: d.id,
          type: 'dream' as const,
          title: d.title,
          subtitle: `${d.lucid ? 'Lucid • ' : ''}Sleep: ${d.sleepQuality}/5 • ${new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          date: d.createdAt,
          data: d,
          tags: ['dream', d.lucid ? 'lucid' : '', d.interpreted ? 'interpreted' : '', ...d.symbols.slice(0, 2), ...d.emotions.slice(0, 1)].filter(Boolean),
        })),
        ...habits.map((h: any) => ({
          id: h.id,
          type: 'habit' as const,
          title: h.name,
          subtitle: `${h.category} • Streak: ${h.streak}d • Best: ${h.bestStreak}d`,
          date: h.createdAt,
          data: h,
          tags: ['habit', h.category, h.frequency, h.streak > 0 ? 'active' : 'inactive'].filter(Boolean),
        })),
        ...tarotReadings.map((t: any) => ({
          id: t.id,
          type: 'tarot' as const,
          title: t.spread || 'Tarot Reading',
          subtitle: `${t.cards?.length || 0} cards • ${new Date(t.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          date: t.timestamp,
          data: t,
          tags: ['tarot', t.spread_key || ''].filter(Boolean),
        })),
      ].sort((a, b) => b.date - a.date);

      setItems(allItems);
    }
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesTab = activeTab === 'all' || item.type === activeTab;
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [items, activeTab, searchQuery]);

  const tabs = [
    { value: 'all', label: 'All', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'meditation', label: 'Meditations', icon: <Brain className="h-4 w-4" /> },
    { value: 'dream', label: 'Dreams', icon: <Cloud className="h-4 w-4" /> },
    { value: 'habit', label: 'Habits', icon: <Flame className="h-4 w-4" /> },
    { value: 'tarot', label: 'Tarot', icon: <Sparkles className="h-4 w-4" /> },
  ];

  const getTypeIcon = (type: LibraryItem['type']) => {
    switch (type) {
      case 'meditation': return <Brain className="h-4 w-4 text-blue-400" />;
      case 'dream': return <Cloud className="h-4 w-4 text-purple-400" />;
      case 'habit': return <Flame className="h-4 w-4 text-orange-400" />;
      case 'tarot': return <Sparkles className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getTypeBadge = (type: LibraryItem['type']) => {
    switch (type) {
      case 'meditation': return <Badge variant="subtle" className="text-xs"><Brain className="h-3 w-3 mr-1" />Meditation</Badge>;
      case 'dream': return <Badge variant="subtle" className="text-xs"><Cloud className="h-3 w-3 mr-1" />Dream</Badge>;
      case 'habit': return <Badge variant="subtle" className="text-xs"><Flame className="h-3 w-3 mr-1" />Habit</Badge>;
      case 'tarot': return <Badge variant="subtle" className="text-xs"><Sparkles className="h-3 w-3 mr-1" />Tarot</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <GoldTriangle orientation="down" size="lg" aria-hidden="true" />
          <h1 className="text-display font-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Library
          </h1>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" aria-hidden="true" />
        <Input
          placeholder="Search library..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
        <TabsList className="grid grid-cols-5 gap-1">
          {tabs.map((tab) => (
            <TabTrigger key={tab.value} value={tab.value} className="flex items-center justify-center gap-1.5 py-2">
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabTrigger>
          ))}
        </TabsList>

        <TabContent value="all" forceMount>
          {renderItems(filteredItems)}
        </TabContent>
        <TabContent value="meditation" forceMount>
          {renderItems(filteredItems.filter(i => i.type === 'meditation'))}
        </TabContent>
        <TabContent value="dream" forceMount>
          {renderItems(filteredItems.filter(i => i.type === 'dream'))}
        </TabContent>
        <TabContent value="habit" forceMount>
          {renderItems(filteredItems.filter(i => i.type === 'habit'))}
        </TabContent>
        <TabContent value="tarot" forceMount>
          {renderItems(filteredItems.filter(i => i.type === 'tarot'))}
        </TabContent>
      </Tabs>
    </div>
  );

  function renderItems(itemsToRender: LibraryItem[]) {
    if (itemsToRender.length === 0) {
      return (
        <Card variant="default" padding="xl" className="text-center py-16">
          <BookOpen className="h-16 w-16 text-text-muted mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-heading-3 font-display font-medium text-text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {searchQuery ? 'No results found' : activeTab === 'all' ? 'Library is empty' : `No ${activeTab}s yet`}
          </h3>
          <p className="text-body-md text-text-secondary mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms.'
              : activeTab === 'all'
              ? 'Your saved meditations, dreams, habits, and tarot readings will appear here.'
              : `Start a ${activeTab} session to see it here.`
            }
          </p>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {itemsToRender.map((item) => (
          <Card key={item.id} variant="hover" padding="default" className="p-4">
            <div className="flex items-start gap-4">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', getTypeColor(item.type))}>
                {getTypeIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-heading-3 font-display font-medium text-text-primary truncate" style={{ fontFamily: 'var(--font-display)' }}>
                      {item.title}
                    </h3>
                    <p className="text-body-sm text-text-muted mt-1">{item.subtitle}</p>
                  </div>
                  {getTypeBadge(item.type)}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.slice(0, 5).map((tag) => (
                    <Badge key={tag} variant="subtle" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 5 && (
                    <Badge variant="subtle" className="text-xs">+{item.tags.length - 5}</Badge>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" aria-label={`View ${item.type} details`}>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  function getTypeColor(type: LibraryItem['type']) {
    switch (type) {
      case 'meditation': return 'bg-blue-500/15';
      case 'dream': return 'bg-purple-500/15';
      case 'habit': return 'bg-orange-500/15';
      case 'tarot': return 'bg-yellow-500/15';
    }
  }
}
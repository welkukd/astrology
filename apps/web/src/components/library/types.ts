'use client';

export type PillarType = 'astrology' | 'tarot' | 'guide' | 'humandesign';

export type ContentType =
  | 'natal-chart'
  | 'transit'
  | 'progression'
  | 'synastry'
  | 'solar-return'
  | 'ai-reading'
  | 'tarot-reading'
  | 'tarot-journal'
  | 'daily-draw'
  | 'meditation'
  | 'dream'
  | 'habit'
  | 'hd-chart'
  | 'hd-gate'
  | 'hd-channel';

export interface LibraryItem {
  id: string;
  pillar: PillarType;
  type: ContentType;
  title: string;
  subtitle: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
  tags: string[];
  data: Record<string, unknown>;
  preview?: {
    image?: string;
    text?: string;
    metadata?: Record<string, unknown>;
  };
}

export interface LibraryFilter {
  search: string;
  pillar: PillarType | 'all';
  type: ContentType | 'all';
  tags: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy: 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';
}

export interface LibraryState {
  items: LibraryItem[];
  filter: LibraryFilter;
  isLoading: boolean;
  viewMode: 'grid' | 'list';
}

export const PILLAR_LABELS: Record<PillarType, string> = {
  astrology: 'Astrology',
  tarot: 'Tarot',
  guide: 'Guide',
  humandesign: 'Human Design',
};

export const PILLAR_ICONS: Record<PillarType, string> = {
  astrology: 'sparkles',
  tarot: 'book-open',
  guide: 'brain',
  humandesign: 'zap',
};

export const PILLAR_COLORS: Record<PillarType, string> = {
  astrology: 'bg-yellow-500/15 text-yellow-400',
  tarot: 'bg-purple-500/15 text-purple-400',
  guide: 'bg-blue-500/15 text-blue-400',
  humandesign: 'bg-orange-500/15 text-orange-400',
};

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  'natal-chart': 'Natal Chart',
  transit: 'Transit',
  progression: 'Progression',
  synastry: 'Synastry',
  'solar-return': 'Solar Return',
  'ai-reading': 'AI Reading',
  'tarot-reading': 'Tarot Reading',
  'tarot-journal': 'Journal Entry',
  'daily-draw': 'Daily Draw',
  meditation: 'Meditation',
  dream: 'Dream',
  habit: 'Habit',
  'hd-chart': 'HD Chart',
  'hd-gate': 'Gate',
  'hd-channel': 'Channel',
};

export const CONTENT_TYPE_PILLAR: Record<ContentType, PillarType> = {
  'natal-chart': 'astrology',
  transit: 'astrology',
  progression: 'astrology',
  synastry: 'astrology',
  'solar-return': 'astrology',
  'ai-reading': 'astrology',
  'tarot-reading': 'tarot',
  'tarot-journal': 'tarot',
  'daily-draw': 'tarot',
  meditation: 'guide',
  dream: 'guide',
  habit: 'guide',
  'hd-chart': 'humandesign',
  'hd-gate': 'humandesign',
  'hd-channel': 'humandesign',
};
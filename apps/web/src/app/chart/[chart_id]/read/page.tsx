'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/providers';
import { Moon, Star, Sparkles, Calendar, Clock, ArrowLeft, Loader2, ChevronDown, ChevronRight, Zap, Heart, Brain, Sun, TrendingUp, MessageSquare, BookOpen } from 'lucide-react';
import { cn, getSignEmoji, getPlanetEmoji } from '@/lib/utils';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { getFullReading, getYearlyReading, getDashaReading, getPlanetInSign, getPlanetInHouse, getAspectInterpretation, type ReadingSection } from '@/lib/interpretations';

const SECTION_ICONS: Record<string, any> = {
  overview: Sparkles, personality: Brain, career: TrendingUp, love: Heart,
  money: Sun, health: Moon, spirituality: Star, challenges: Zap,
  strengths: Sparkles, advice: MessageSquare, theme: Calendar,
  'key dates': Calendar, best: Calendar, opportunities: Sparkles,
  timing: Clock, guidance: MessageSquare, transition: Clock,
  'life chapters': Clock, 'planetary periods': Star, 'current period': Clock,
  'major transits': Zap,   'what to expect': Star,
};

function SectionCard({ section }: { section: ReadingSection }) {
  const [expanded, setExpanded] = useState(true);
  const key = section.title.toLowerCase().split(' ')[0];
  const Icon = SECTION_ICONS[key] || Sparkles;
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
          <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="flex-1 font-semibold text-gray-900 dark:text-white">{section.title}</h3>
        {expanded ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
      </button>
      {expanded && (
        <div className="px-5 pb-5 pt-0">
          <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
            {section.content}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReadingPage() {
  const router = useRouter();
  const params = useParams();
  const chartId = params.chart_id as string;
  const { session, loading: authLoading } = useAuth();

  const [chart, setChart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('full');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token}`,
  });

  useEffect(() => {
    if (authLoading) return;
    if (!session) { router.push('/auth/login'); return; }
    fetchChart();
  }, [chartId, session, authLoading, router]);

  const fetchChart = async () => {
    try {
      const res = await fetch(`/api/charts/${chartId}`, { headers: authHeaders() });
      if (!res.ok) { router.push('/chart/new'); return; }
      setChart(await res.json());
    } catch { router.push('/chart/new'); }
    finally { setLoading(false); }
  };

  if (loading || authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary-600" /></div>;
  }
  if (!chart) return null;

  const planets = chart.planets || [];
  const houses = chart.houses || [];
  const aspects = chart.aspects || [];
  const subject = chart.subject || {};
  const sunSign = planets.find((p: any) => p.name === 'Sun')?.sign;
  const moonSign = planets.find((p: any) => p.name === 'Moon')?.sign;
  const risingSign = houses[0]?.sign;

  const fullReading = getFullReading(chart);
  const yearlyReading = getYearlyReading(chart, selectedYear);
  const dashaReading = getDashaReading(chart);

  const tabs = [
    { id: 'full', label: 'Full Reading', icon: Sparkles },
    { id: 'planets', label: 'Planets', icon: Star },
    { id: 'yearly', label: 'Yearly', icon: Calendar },
    { id: 'dasha', label: 'Life Chapters', icon: Clock },
    { id: 'transits', label: 'Transits', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DisclaimerBanner />
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href={`/chart/${chartId}`} className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-semibold">Chart</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="font-medium text-gray-900 dark:text-white">Reading</span>
            </div>
            <Link href="/chart/new" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
              <Moon className="h-4 w-4" /> New Chart
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{subject.name || 'Your'}'s Reading</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {subject.date} {subject.time && subject.time !== '12:00' ? `at ${subject.time?.slice(0,5)}` : ''} • {sunSign && `${sunSign} Sun`} {moonSign && `• ${moonSign} Moon`} {risingSign && `• ${risingSign} Rising`}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-4">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors',
                  activeTab === tab.id ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400')}>
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Big Three</h3>
              {[
                { label: 'Sun', sign: sunSign, emoji: '☉' },
                { label: 'Moon', sign: moonSign, emoji: '☽' },
                { label: 'Rising', sign: risingSign, emoji: '↑' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 py-2">
                  <span className="text-lg">{item.emoji}</span>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.sign}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Planets</h3>
              <div className="space-y-2">
                {planets.slice(0, 10).map((p: any) => (
                  <div key={p.name} className="flex items-center gap-2 text-sm">
                    <span>{getPlanetEmoji(p.name)}</span>
                    <span className="text-gray-700 dark:text-gray-300">{p.name}</span>
                    <span className="text-gray-400 ml-auto">{p.sign}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3 space-y-6">
            {activeTab === 'full' && (
              <div className="space-y-4">
                {fullReading.map((section, i) => (
                  <SectionCard key={i} section={section} />
                ))}
              </div>
            )}

            {activeTab === 'planets' && (
              <div className="space-y-4">
                {planets.map((p: any) => {
                  const signText = getPlanetInSign(p.name, p.sign);
                  const houseText = getPlanetInHouse(p.name, p.house);
                  return (
                    <div key={p.name} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                      <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getPlanetEmoji(p.name)}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{p.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <span>{getSignEmoji(p.sign)}</span>
                              <span>{p.sign} {p.degree_in_sign?.toFixed(1)}°</span>
                              {p.house && <><span>•</span><span>House {p.house}</span></>}
                              {p.retrograde && <span className="text-orange-500">(R)</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-5 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">In {p.sign}</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{signText}</p>
                        </div>
                        {p.house && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">In House {p.house}</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{houseText}</p>
                          </div>
                        )}
                        {p.nakshatra && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Nakshatra: {p.nakshatra} Pada {p.nakshatra_pada}</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">Ruled by {p.nakshatra_lord}. This Nakshatra adds {p.nakshatra_lord === 'Sun' ? 'leadership and vitality' : p.nakshatra_lord === 'Moon' ? 'emotional depth and intuition' : p.nakshatra_lord === 'Mars' ? 'courage and drive' : p.nakshatra_lord === 'Mercury' ? 'intellect and communication' : p.nakshatra_lord === 'Jupiter' ? 'wisdom and expansion' : p.nakshatra_lord === 'Venus' ? 'beauty and harmony' : p.nakshatra_lord === 'Saturn' ? 'discipline and structure' : p.nakshatra_lord === 'Rahu' ? 'ambition and unconventional energy' : 'transformation and spiritual depth'} to the {p.name} placement.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'yearly' && (
              <div className="space-y-6">
                <div className="flex gap-2 flex-wrap">
                  {[2024, 2025, 2026, 2027, 2028].map(year => (
                    <button key={year} onClick={() => setSelectedYear(year)}
                      className={cn('px-4 py-2 rounded-lg font-medium transition-colors',
                        selectedYear === year ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700')}>
                      {year}
                    </button>
                  ))}
                </div>
                {yearlyReading.map((section, i) => (
                  <SectionCard key={i} section={section} />
                ))}
              </div>
            )}

            {activeTab === 'dasha' && (
              <div className="space-y-4">
                {dashaReading.map((section, i) => (
                  <SectionCard key={i} section={section} />
                ))}
              </div>
            )}

            {activeTab === 'transits' && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Current Planetary Transits</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    Transits show how current planetary positions interact with your birth chart. The most significant transits involve outer planets (Saturn, Jupiter, Uranus, Neptune, Pluto) moving through the zodiac and forming aspects to your natal planets.
                  </p>
                </div>

                {aspects.filter((a: any) => ['square', 'opposition', 'trine', 'conjunction'].includes(a.aspect)).map((a: any, i: number) => (
                  <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl">{getPlanetEmoji(a.planet1)}</span>
                      <span className={cn('px-3 py-1 rounded-full text-sm font-medium',
                        a.aspect === 'conjunction' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                        a.aspect === 'opposition' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                        a.aspect === 'trine' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                      )}>{a.aspect}</span>
                      <span className="text-xl">{getPlanetEmoji(a.planet2)}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {getAspectInterpretation(a.planet1, a.planet2, a.aspect)}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Orb: {a.orb}° {a.applying ? '(Applying)' : '(Separating)'}</p>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

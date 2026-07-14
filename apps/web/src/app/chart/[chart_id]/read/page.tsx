'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/providers';
import { Moon, Star, Sparkles, Calendar, Clock, ArrowLeft, Loader2, ChevronDown, ChevronRight, Zap, Heart, Brain, Sun, TrendingUp, MessageSquare } from 'lucide-react';
import { cn, formatDate, getSignEmoji, getPlanetEmoji } from '@/lib/utils';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';

type ReadingSection = {
  title: string;
  content: string;
  icon: any;
};

function parseReading(text: string): ReadingSection[] {
  const sections: ReadingSection[] = [];
  const parts = text.split(/^### /m).filter(Boolean);
  const icons: Record<string, any> = {
    'overview': Sparkles, 'personality': Brain, 'career': TrendingUp,
    'love': Heart, 'money': Sun, 'health': Moon, 'spirituality': Star,
    'challenges': Zap, 'strengths': Sparkles, 'theme': Calendar,
    'advice': MessageSquare, 'key': Calendar, 'best': Calendar,
    'opportunities': Sparkles, 'timing': Clock, 'guidance': MessageSquare,
    'transition': Clock, 'active': Zap, 'what': Star, 'major': Zap,
    'current': Clock, 'life': Star, 'period': Clock, 'sub': Clock,
  };

  for (const part of parts) {
    const lines = part.split('\n');
    const title = lines[0].trim();
    const content = lines.slice(1).join('\n').trim();
    if (!content) continue;
    const key = title.toLowerCase().split(' ')[0];
    const icon = icons[key] || Sparkles;
    sections.push({ title, content, icon });
  }
  return sections;
}

function ReadingSectionCard({ section }: { section: ReadingSection }) {
  const [expanded, setExpanded] = useState(true);
  const Icon = section.icon;
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
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed">
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
  const [fullReading, setFullReading] = useState<string | null>(null);
  const [yearlyReadings, setYearlyReadings] = useState<Record<number, string | null>>({});
  const [monthlyReading, setMonthlyReading] = useState<string | null>(null);
  const [dashaReading, setDashaReading] = useState<string | null>(null);
  const [dashaData, setDashaData] = useState<any>(null);
  const [transitsReading, setTransitsReading] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    if (chart && !fullReading && !generating) {
      generateReading('full');
    }
  }, [chart]);

  const fetchChart = async () => {
    try {
      const res = await fetch(`/api/charts/${chartId}`, { headers: authHeaders() });
      if (!res.ok) { router.push('/chart/new'); return; }
      setChart(await res.json());
    } catch { router.push('/chart/new'); }
    finally { setLoading(false); }
  };

  const generateReading = async (type: string, params: any = {}) => {
    const key = type === 'yearly' ? `yearly_${params.year}` : type;
    setGenerating(key);
    setError(null);
    try {
      const body = { reading_type: type, chart_id: chartId, ...params };
      const res = await fetch('/api/reading', { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || errData.error || `Server error ${res.status}`);
      }
      const data = await res.json();
      if (!data.content) throw new Error('No reading content returned');

      if (type === 'full') setFullReading(data.content);
      else if (type === 'yearly') setYearlyReadings(prev => ({ ...prev, [params.year]: data.content }));
      else if (type === 'monthly') setMonthlyReading(data.content);
      else if (type === 'dasha') { setDashaReading(data.content); if (data.dasha_data) setDashaData(data.dasha_data); }
      else if (type === 'transits') setTransitsReading(data.content);
    } catch (e: any) {
      setError(e.message || 'Failed to generate reading. Please try again.');
    } finally { setGenerating(null); }
  };

  const tabs = [
    { id: 'full', label: 'Full Reading', icon: Sparkles },
    { id: 'yearly', label: 'Yearly', icon: Calendar },
    { id: 'monthly', label: 'Monthly', icon: Calendar },
    { id: 'dasha', label: 'Life Chapters', icon: Clock },
    { id: 'transits', label: 'Transits', icon: Zap },
  ];

  if (loading || authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary-600" /></div>;
  }
  if (!chart) return null;

  const planets = chart.planets || [];
  const sunSign = planets.find((p: any) => p.name === 'Sun')?.sign;
  const moonSign = planets.find((p: any) => p.name === 'Moon')?.sign;
  const risingSign = (chart.houses || [])[0]?.sign;
  const subject = chart.subject || {};

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

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
            <Zap className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium">Dismiss</button>
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-primary-600" />
              Planetary Positions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">Planet</th>
                  <th className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">Sign</th>
                  <th className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">Degree</th>
                  <th className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">House</th>
                  <th className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">Nakshatra</th>
                </tr>
              </thead>
              <tbody>
                {planets.map((p: any) => (
                  <tr key={p.name} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getPlanetEmoji(p.name)}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span>{getSignEmoji(p.sign)}</span>
                        <span className="text-gray-700 dark:text-gray-300">{p.sign}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.degree_in_sign?.toFixed(2)}°</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                        {p.house || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{p.nakshatra || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          </aside>

          <main className="lg:col-span-3 space-y-6">
            {activeTab === 'full' && (
              <div className="space-y-4">
                {generating === 'full' && !fullReading ? (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <Loader2 className="h-12 w-12 text-primary-600 mx-auto mb-4 animate-spin" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Generating Your Reading...</h2>
                    <p className="text-gray-500 dark:text-gray-400">AI is analyzing your birth chart. This takes 10-20 seconds.</p>
                  </div>
                ) : fullReading ? (
                  parseReading(fullReading).map((section, i) => (
                    <ReadingSectionCard key={i} section={section} />
                  ))
                ) : (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <Sparkles className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Get Your Complete Reading</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Our AI will analyze your birth chart and generate a comprehensive reading covering personality, career, love, money, health, and more.
                    </p>
                    <button onClick={() => generateReading('full')} disabled={generating === 'full'}
                      className="px-8 py-4 bg-primary-600 text-white rounded-xl text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25 disabled:opacity-50 flex items-center gap-2 mx-auto">
                      {generating === 'full' ? <><Loader2 className="h-5 w-5 animate-spin" /> Generating...</> : <><Sparkles className="h-5 w-5" /> Generate Full Reading</>}
                    </button>
                    <p className="text-xs text-gray-400 mt-4">Takes 10-20 seconds. Uses AI to interpret your chart data.</p>
                  </div>
                )}
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

                {yearlyReadings[selectedYear] ? (
                  parseReading(yearlyReadings[selectedYear]!).map((section, i) => (
                    <ReadingSectionCard key={i} section={section} />
                  ))
                ) : (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <Calendar className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{selectedYear} Yearly Prediction</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Get your personalized {selectedYear} horoscope based on your birth chart.</p>
                    <button onClick={() => generateReading('yearly', { year: selectedYear })} disabled={generating === `yearly_${selectedYear}`}
                      className="px-8 py-4 bg-primary-600 text-white rounded-xl text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25 disabled:opacity-50 flex items-center gap-2 mx-auto">
                      {generating === `yearly_${selectedYear}` ? <><Loader2 className="h-5 w-5 animate-spin" /> Generating...</> : <><Calendar className="h-5 w-5" /> Get {selectedYear} Prediction</>}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'monthly' && (
              <div className="space-y-6">
                <div className="flex gap-2 flex-wrap">
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                    <button key={i} onClick={() => setSelectedMonth(i + 1)}
                      className={cn('px-3 py-2 rounded-lg font-medium text-sm transition-colors',
                        selectedMonth === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700')}>
                      {m}
                    </button>
                  ))}
                </div>

                {monthlyReading ? (
                  parseReading(monthlyReading).map((section, i) => (
                    <ReadingSectionCard key={i} section={section} />
                  ))
                ) : (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <Calendar className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Monthly Forecast</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Get your {['','January','February','March','April','May','June','July','August','September','October','November','December'][selectedMonth]} {selectedYear} reading.</p>
                    <button onClick={() => generateReading('monthly', { year: selectedYear, month: selectedMonth })} disabled={generating === 'monthly'}
                      className="px-8 py-4 bg-primary-600 text-white rounded-xl text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25 disabled:opacity-50 flex items-center gap-2 mx-auto">
                      {generating === 'monthly' ? <><Loader2 className="h-5 w-5 animate-spin" /> Generating...</> : <><Calendar className="h-5 w-5" /> Get Monthly Forecast</>}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'dasha' && (
              <div className="space-y-6">
                {dashaReading ? (
                  <>
                    {dashaData && (
                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Life Chapters Timeline</h3>
                        <div className="space-y-2">
                          {(dashaData.mahadashas || []).map((md: any, i: number) => {
                            const isActive = md.planet === dashaData.current_mahadasha;
                            return (
                              <div key={i} className={cn('flex items-center gap-3 p-3 rounded-lg', isActive ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' : 'bg-gray-50 dark:bg-gray-800')}>
                                <span className="text-lg">{getPlanetEmoji(md.planet)}</span>
                                <div className="flex-1">
                                  <p className={cn('font-medium', isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white')}>{md.planet} Mahadasha</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{md.start_date} → {md.end_date}</p>
                                </div>
                                {isActive && <span className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-medium">Current</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {parseReading(dashaReading).map((section, i) => (
                      <ReadingSectionCard key={i} section={section} />
                    ))}
                  </>
                ) : (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <Clock className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Life Chapters (Vimshottari Dasha)</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Discover the planetary periods that shape your life trajectory. See which Mahadasha you're in and what it means.
                    </p>
                    <button onClick={() => generateReading('dasha')} disabled={generating === 'dasha'}
                      className="px-8 py-4 bg-primary-600 text-white rounded-xl text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25 disabled:opacity-50 flex items-center gap-2 mx-auto">
                      {generating === 'dasha' ? <><Loader2 className="h-5 w-5 animate-spin" /> Generating...</> : <><Clock className="h-5 w-5" /> Calculate Life Chapters</>}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transits' && (
              <div className="space-y-6">
                {transitsReading ? (
                  parseReading(transitsReading).map((section, i) => (
                    <ReadingSectionCard key={i} section={section} />
                  ))
                ) : (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <Zap className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Current Transits</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      See how current planetary positions are affecting your birth chart right now. What opportunities and challenges are in the sky?
                    </p>
                    <button onClick={() => generateReading('transits')} disabled={generating === 'transits'}
                      className="px-8 py-4 bg-primary-600 text-white rounded-xl text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25 disabled:opacity-50 flex items-center gap-2 mx-auto">
                      {generating === 'transits' ? <><Loader2 className="h-5 w-5 animate-spin" /> Generating...</> : <><Zap className="h-5 w-5" /> Get Transit Reading</>}
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

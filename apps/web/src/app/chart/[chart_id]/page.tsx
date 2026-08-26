'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/providers';
import { Moon, Star, Sparkles, Download, Share2, Loader2, MessageSquare, BookOpen, LayoutGrid } from 'lucide-react';
import { cn, formatDate, getSignEmoji, getPlanetEmoji } from '@/lib/utils';
import { getRandomHook } from '@/lib/hooks';
import { ChartWheel } from '@/components/chart/ChartWheel';
import { VedicChart } from '@/components/chart/VedicChart';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';

export default function ChartPage() {
  const router = useRouter();
  const params = useParams();
  const chartId = params.chart_id as string;
  const { session, loading: authLoading } = useAuth();
  const [chart, setChart] = useState<any>(null);
  const [interpretations, setInterpretations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [interpreting, setInterpreting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [chartStyle, setChartStyle] = useState<'western' | 'vedic'>('western');

  const token = session?.access_token;
  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token]);

  const fetchChart = useCallback(async () => {
    try {
      const res = await fetch(`/api/charts/${chartId}`, { headers: authHeaders() });
      if (!res.ok) { router.push('/chart/new'); return; }
      setChart(await res.json());
    } catch { router.push('/chart/new'); }
    finally { setLoading(false); }
  }, [chartId, authHeaders, router]);

  const interpret = useCallback(async (type: string, context: any = {}) => {
    setInterpreting(type);
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ chart_id: chartId, type, context }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setInterpretations(prev => ({ ...prev, [type]: data.content }));
    } catch { console.error('Interpret error:', type); }
    finally { setInterpreting(null); }
  }, [chartId, authHeaders]);

  const askQuestion = useCallback(async () => {
    if (!question.trim()) return;
    setInterpreting('question');
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ chart_id: chartId, type: 'question', context: { question } }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAnswer(data.content);
    } catch { console.error('Question error'); }
    finally { setInterpreting(null); }
  }, [chartId, authHeaders, question]);

  const handleExport = useCallback(async () => {
    try {
      const res = await fetch(`/api/charts/${chartId}/export`, { method: 'POST', headers: authHeaders() });
      if (!res.ok) { console.error('Export failed:', res.status); return; }
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `chart-${chartId}.json`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error('Export error:', e); }
  }, [chartId, authHeaders]);

  // Use a ref to prevent re-running the initial load on every session refresh
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!session) { router.push('/auth/login'); return; }
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    fetchChart();
  }, [chartId, session, authLoading, router, fetchChart]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary-600" /></div>;
  if (!chart) return null;

  const planets = chart.planets || [];
  const houses = chart.houses || [];
  const aspects = chart.aspects || [];
  const subject = chart.subject || {};
  const sunSign = planets.find((p: any) => p.name === 'Sun')?.sign;
  const moonSign = planets.find((p: any) => p.name === 'Moon')?.sign;
  const risingSign = houses[0]?.sign;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'planets', label: 'Planets', icon: Star },
    { id: 'houses', label: 'Houses', icon: Moon },
    { id: 'aspects', label: 'Aspects', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DisclaimerBanner />
  
            <section className="mb-6">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:bg-gradient-to-r from-amber-900/30 dark:to-yellow-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Daily Cosmic Hook
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-center italic">
                  {getRandomHook()}
                </p>
              </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/chart/${chartId}/read`} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
            <BookOpen className="h-4 w-4" />
            Get Reading
          </Link>
          <Link href={`/chart/${chartId}/chat`} className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors text-sm font-medium">
            <MessageSquare className="h-4 w-4" />
            Chat with Astrologer
          </Link>
          <button onClick={handleExport} className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" title="Export JSON"><Download className="h-5 w-5" /></button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Chart Info</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500 dark:text-gray-400">Name</dt><dd className="font-medium text-gray-900 dark:text-white">{subject.name || '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500 dark:text-gray-400">Born</dt><dd className="font-medium text-gray-900 dark:text-white">{subject.date || '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500 dark:text-gray-400">Time</dt><dd className="font-medium text-gray-900 dark:text-white">{subject.time_unknown ? 'Unknown' : subject.time?.slice(0,5) || '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500 dark:text-gray-400">Location</dt><dd className="font-medium text-gray-900 dark:text-white truncate">{`${subject.latitude?.toFixed(4)}, ${subject.longitude?.toFixed(4)}`}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500 dark:text-gray-400">System</dt><dd className="font-medium text-gray-900 dark:text-white capitalize">{subject.zodiac || '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500 dark:text-gray-400">Houses</dt><dd className="font-medium text-gray-900 dark:text-white">{subject.house_system || '—'}</dd></div>
              </dl>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Big Three</h2>
              <div className="space-y-4">
                {[
                  { label: 'Sun', sign: sunSign, emoji: '☉' },
                  { label: 'Moon', sign: moonSign, emoji: '☽' },
                  { label: 'Rising', sign: risingSign, emoji: '↑' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.sign}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{subject.name || 'Birth Chart'}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{subject.date} • {subject.zodiac} • {subject.house_system}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setChartStyle('western')}
                      className={cn('p-2 rounded-lg transition-colors', chartStyle === 'western' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800')}
                      title="Western Chart"
                    >
                      <Star className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setChartStyle('vedic')}
                      className={cn('p-2 rounded-lg transition-colors', chartStyle === 'vedic' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800')}
                      title="Vedic Chart"
                    >
                      <LayoutGrid className="h-5 w-5" />
                    </button>
                    <span className="px-3 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                      {chart.metadata?.engine} / {chart.metadata?.ephemeris}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {chartStyle === 'western' ? (
                  <ChartWheel planets={planets} houses={houses} aspects={aspects} />
                ) : (
                  <VedicChart
                    planets={planets}
                    ascendant_sign={risingSign || ''}
                  />
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="border-b border-gray-200 dark:border-gray-800">
                <nav className="flex gap-6 px-6" aria-label="Chart sections">
                  {tabs.map(tab => (
                    <button key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn('flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                        activeTab === tab.id ? 'border-primary-500 text-primary-600 dark:text-primary-400' :
                        'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300')}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && <OverviewTab chart={chart} interpretation={interpretations.overview} onRequest={() => interpret('overview')} interpreting={interpreting === 'overview'} />}
                {activeTab === 'planets' && <PlanetsTab planets={planets} interpretations={interpretations} onRequest={(ctx: any) => interpret(`planet-${ctx.planet}`, ctx)} interpreting={interpreting} />}
                {activeTab === 'houses' && <HousesTab houses={houses} planets={planets} />}
                {activeTab === 'aspects' && <AspectsTab aspects={aspects} />}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary-600" />
                Ask a Question
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Ask about specific placements, aspects, or what a transit means for you.</p>
              <div className="flex gap-2">
                <input type="text" value={question} onChange={e => setQuestion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && askQuestion()}
                  placeholder="e.g., What does Mars in my 7th house mean for relationships?"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                <button onClick={askQuestion} disabled={interpreting === 'question' || !question.trim()}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {interpreting === 'question' ? <Loader2 className="h-5 w-5 animate-spin" /> : <><MessageSquare className="h-5 w-5" /> Ask</>}
                </button>
              </div>
              {answer && <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"><p className="whitespace-pre-wrap">{answer}</p></div>}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ chart, interpretation, onRequest, interpreting }: any) {
  const planets = chart.planets || [];
  const sun = planets.find((p: any) => p.name === 'Sun');
  const moon = planets.find((p: any) => p.name === 'Moon');
  const rising = (chart.houses || [])[0];
  const all: Record<string, any> = { sun, moon, rising };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['sun', 'moon', 'rising'].map(k => {
          const item = all[k];
          return (
            <div key={k} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="font-semibold text-gray-900 dark:text-white capitalize">{k}</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {item?.sign || '—'} {getSignEmoji(item?.sign || '')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item?.degree_in_sign?.toFixed(1)}° in House {item?.house || '—'}
              </p>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        {interpretation ? (
          <div className="whitespace-pre-wrap">{interpretation}</div>
        ) : (
          <button onClick={onRequest} disabled={interpreting}
            className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {interpreting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            Generate AI Overview
          </button>
        )}
      </div>
    </div>
  );
}

function PlanetsTab({ planets, interpretations, onRequest, interpreting }: any) {
  return (
    <div className="space-y-4">
      {planets.map((p: any) => {
        const key = `planet-${p.name}`;
        const interp = interpretations[key];
        return (
          <div key={p.name} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getPlanetEmoji(p.name)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{p.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{getSignEmoji(p.sign)}</span>
                      <span>{p.sign} {p.degree_in_sign.toFixed(1)}°</span>
                      {p.house && <><span>•</span><span>House {p.house}</span></>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              {interp ? (
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 text-sm">{interp}</div>
              ) : (
                <button onClick={() => onRequest({ planet: p.name, sign: p.sign, house: p.house })}
                  disabled={interpreting === key}
                  className="w-full py-3 px-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 text-sm font-medium transition-colors disabled:opacity-50">
                  {interpreting === key ? 'Loading...' : 'Get AI Interpretation'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HousesTab({ houses, planets, interpretations, onRequest, interpreting }: any) {
  return (
    <div className="space-y-3">
      {houses.map((h: any) => {
        const key = `house-${h.number}`;
        const interp = interpretations[key];
        return (
          <div key={h.number} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900 dark:text-white w-8 text-right">{h.number}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">House {h.number} • {h.sign}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{h.degree_in_sign.toFixed(1)}°</p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                <p>Cusp: {h.longitude.toFixed(2)}°</p>
              </div>
            </div>
            <div className="mt-3 ml-11 flex flex-wrap gap-1">
              {planets.filter((p: any) => p.house === h.number).map((p: any) => (
                <span key={p.name} className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                  {getPlanetEmoji(p.name)} {p.name}
                </span>
              ))}
            </div>
            {interp ? (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {interp}
              </div>
            ) : (
              <button onClick={() => onRequest({ house: h.number })} disabled={interpreting === key}
                className="w-full py-2 px-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 rounded hover:bg-primary-100 text-sm font-medium transition-colors disabled:opacity-50">
                {interpreting === key ? 'Loading...' : 'Get AI Interpretation'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AspectsTab({ aspects }: any) {
  const colors: Record<string, string> = {
    conjunction: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    opposition: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    trine: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    square: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    sextile: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  };

  return (
    <div className="space-y-2">
      {aspects.length === 0 ? <p className="text-gray-500 dark:text-gray-400 text-center py-8">No major aspects found</p>
        : aspects.map((a: any, i: number) => (
          <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3"><span className="text-xl">{getPlanetEmoji(a.planet1)}</span><span className="font-medium text-gray-900 dark:text-white">{a.planet1}</span></div>
            <span className={cn('px-3 py-1 rounded-full text-sm font-medium', colors[a.aspect] || 'bg-gray-100 text-gray-700')}>{a.aspect}</span>
            <div className="flex items-center gap-3"><span className="font-medium text-gray-900 dark:text-white">{a.planet2}</span><span className="text-xl">{getPlanetEmoji(a.planet2)}</span></div>
            <div className="text-right text-sm text-gray-500 dark:text-gray-400"><p>Orb: {a.orb}°</p><p>{a.applying ? 'Applying' : 'Separating'}</p></div>
          </div>
        ))}
    </div>
  );
}
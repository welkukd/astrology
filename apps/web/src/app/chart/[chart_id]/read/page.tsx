'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/providers';
import { Moon, Star, Sparkles, Calendar, Clock, ArrowLeft, Loader2, ChevronDown, ChevronRight, FileDown, Globe } from 'lucide-react';
import { cn, getSignEmoji, getPlanetEmoji } from '@/lib/utils';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';

type ReadingData = {
  sections: Record<string, string>;
  dasha: {
    birth_nakshatra: string;
    nakshatra_pada: number;
    starting_lord: string;
    current_mahadasha: string | null;
    current_antardasha: string | null;
    current_period: {
      mahadasha: string;
      mahadasha_end: string;
      mahadasha_remaining: string;
      antardasha: string;
      antardasha_end: string;
      antardasha_remaining: string;
    } | null;
    mahadashas: Array<{
      planet: string;
      start_date: string;
      end_date: string;
      antardashas: Array<{
        planet: string;
        start_date: string;
        end_date: string;
      }>;
    }>;
  } | null;
};

const SECTION_META: Record<string, { title: string; icon: any }> = {
  overview: { title: 'Life Overview', icon: Sparkles },
  personality: { title: 'Personality & Identity', icon: Star },
  career: { title: 'Career & Purpose', icon: Sparkles },
  love: { title: 'Love & Relationships', icon: Moon },
  wealth: { title: 'Money & Wealth', icon: Sparkles },
  health: { title: 'Health & Wellbeing', icon: Moon },
  spirituality: { title: 'Spirituality', icon: Star },
  challenges: { title: 'Challenges & Growth', icon: Sparkles },
  nakshatra: { title: 'Nakshatra Profile', icon: Star },
};

export default function ReadingPage() {
  const router = useRouter();
  const params = useParams();
  const chartId = params.chart_id as string;
  const { session, loading: authLoading } = useAuth();

  const [chart, setChart] = useState<any>(null);
  const [reading, setReading] = useState<ReadingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [language, setLanguage] = useState<'ml' | 'en'>('ml');
  const [activeTab, setActiveTab] = useState('full');
  const [expandedDasha, setExpandedDasha] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token}`,
  });

  const fetchReading = useCallback(async (lang: 'ml' | 'en') => {
    const res = await fetch(`/api/reading-v2/${chartId}?lang=${lang}`, { headers: authHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 'cached' && data.reading) {
      // Check if cached reading has the correct format (multiple sections)
      const sections = data.reading?.sections;
      if (sections && typeof sections === 'object' && Object.keys(sections).length > 2) {
        return data.reading as ReadingData;
      }
      // Bad format (double-encoded) — return null to trigger regeneration
      return null;
    }
    return null;
  }, [chartId, authHeaders]);

  const generateReading = useCallback(async (lang: 'ml' | 'en') => {
    setGenerating(true);
    try {
      // Call Railway backend directly — Vercel Hobby has 10s serverless timeout,
      // but AI generation takes 20-30s. Direct call bypasses that limit.
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://astrology-api-production-813b.up.railway.app';
      const res = await fetch(`${backendUrl}/api/v1/reading/${chartId}/generate`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang, force: true }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      if (data.reading) setReading(data.reading as ReadingData);
    } catch (e) {
      console.error('Generation error:', e);
    } finally {
      setGenerating(false);
    }
  }, [chartId, session]);

  // Use a ref to prevent re-running the initial load on every session refresh
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!session) { router.push('/auth/login'); return; }
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    (async () => {
      setLoading(true);
      // Fetch chart data
      try {
        const chartRes = await fetch(`/api/charts/${chartId}`, { headers: authHeaders() });
        if (!chartRes.ok) { router.push('/chart/new'); return; }
        setChart(await chartRes.json());
      } catch {
        router.push('/chart/new');
        return;
      }

      // Fetch cached reading
      const cached = await fetchReading(language);
      if (!cached) {
        await generateReading(language);
      } else {
        setReading(cached);
      }
      setLoading(false);
    })();
  }, [chartId, authLoading, router]);

  const switchLanguage = async (lang: 'ml' | 'en') => {
    setLanguage(lang);
    const cached = await fetchReading(lang);
    if (cached) {
      setReading(cached);
    } else {
      setReading(null);
      await generateReading(lang);
    }
  };

  const downloadPdf = async () => {
    setPdfLoading(true);
    try {
      const res = await fetch(`/api/reading-v2/${chartId}/pdf?lang=${language}`, { headers: authHeaders() });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `astrology-report-${chartId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('PDF error:', e);
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  const sections = reading?.sections || {};
  const dasha = reading?.dasha;
  const currentPeriod = dasha?.current_period;
  const planets = chart?.planets || [];

  const tabs = [
    { id: 'full', label: language === 'ml' ? 'പൂർണ്ണ വായന' : 'Full Reading', icon: Sparkles },
    { id: 'dasha', label: language === 'ml' ? 'ദശാ കാലം' : 'Dasha Timeline', icon: Clock },
    { id: 'planets', label: language === 'ml' ? 'ഗ്രഹങ്ങൾ' : 'Planets', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DisclaimerBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-2">
              <ArrowLeft className="h-4 w-4" /> {language === 'ml' ? 'തിരികെ' : 'Back'}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {chart?.subject?.name || (language === 'ml' ? 'നിങ്ങളുടെ വായന' : 'Your Reading')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {chart?.subject?.date} {chart?.subject?.time && chart?.subject.time !== '12:00' ? `at ${chart.subject.time.slice(0, 5)}` : ''}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => switchLanguage('ml')}
                className={cn('px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5',
                  language === 'ml' ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-300 shadow-sm' : 'text-gray-500')}
              >
                <Globe className="h-3.5 w-3.5" /> മലയാളം
              </button>
              <button
                onClick={() => switchLanguage('en')}
                className={cn('px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  language === 'en' ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-300 shadow-sm' : 'text-gray-500')}
              >
                English
              </button>
            </div>

            {/* PDF download */}
            <button
              onClick={downloadPdf}
              disabled={pdfLoading || !reading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {pdfLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              {language === 'ml' ? 'PDF ഡൗൺലോഡ്' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Generating state */}
        {generating && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {language === 'ml' ? 'നിങ്ങളുടെ വായന തയ്യാറാക്കുന്നു...' : 'Generating your personalized reading...'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {language === 'ml' ? '~20 സെക്കൻഡ് എടുക്കും' : 'This takes ~20 seconds'}
            </p>
          </div>
        )}

        {!generating && reading && (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    activeTab === tab.id ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800')}>
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Full Reading Tab */}
            {activeTab === 'full' && (
              <div className="space-y-4">
                {Object.entries(SECTION_META).map(([key, meta]) => {
                  const content = sections[key];
                  if (!content) return null;
                  const Icon = meta.icon;
                  return (
                    <div key={key} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                      <div className="flex items-center gap-3 p-5 border-b border-gray-100 dark:border-gray-800">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                          <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{meta.title}</h3>
                      </div>
                      <div className="p-5">
                        <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{content}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Dasha Timeline Tab */}
            {activeTab === 'dasha' && dasha && (
              <div className="space-y-4">
                {/* Current Period Card */}
                {currentPeriod && (
                  <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-primary-200 dark:border-primary-800 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                        {language === 'ml' ? 'നിലവിൽ സജീവം' : 'ACTIVE NOW'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {currentPeriod.mahadasha} Mahadasha
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {currentPeriod.mahadasha_end} വരെ • {currentPeriod.mahadasha_remaining} ശേഷിക്കുന്നു
                    </p>
                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {currentPeriod.antardasha} Antardasha
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {currentPeriod.antardasha_end} വരെ • {currentPeriod.antardasha_remaining} ശേഷിക്കുന്നു
                      </p>
                    </div>
                  </div>
                )}

                {/* All Mahadashas */}
                {dasha.mahadashas?.map((md) => {
                  const isExpanded = expandedDasha === md.planet;
                  const isCurrent = md.planet === dasha.current_mahadasha;
                  return (
                    <div key={md.planet} className={cn('bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden',
                      isCurrent ? 'border-primary-300 dark:border-primary-700' : 'border-gray-200 dark:border-gray-800')}>
                      <button
                        onClick={() => setExpandedDasha(isExpanded ? null : md.planet)}
                        className="w-full flex items-center gap-3 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        {isExpanded ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
                        <span className="text-2xl">{getPlanetEmoji(md.planet)}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            {md.planet} Mahadasha
                            {isCurrent && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">NOW</span>}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {md.start_date} → {md.end_date}
                          </p>
                        </div>
                      </button>
                      {isExpanded && md.antardashas && (
                        <div className="pl-16 pr-5 pb-5 space-y-2">
                          {md.antardashas.map((ad) => {
                            const isCurrentAd = isCurrent && ad.planet === dasha.current_antardasha;
                            return (
                              <div key={ad.planet} className={cn('flex items-center justify-between py-2 px-3 rounded-lg',
                                isCurrentAd ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-gray-50 dark:bg-gray-800/50')}>
                                <span className="flex items-center gap-2">
                                  <span>{getPlanetEmoji(ad.planet)}</span>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{ad.planet} Antardasha</span>
                                  {isCurrentAd && <span className="text-xs text-green-600 font-medium">●</span>}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{ad.start_date} → {ad.end_date}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Planets Tab */}
            {activeTab === 'planets' && (
              <div className="space-y-4">
                {planets.map((p: any) => (
                  <div key={p.name} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                    <div className="flex items-center gap-3 mb-3">
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
                    {p.nakshatra && (
                      <div className="text-xs text-gray-400 mb-3">
                        Nakshatra: {p.nakshatra} Pada {p.nakshatra_pada} (Lord: {p.nakshatra_lord})
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

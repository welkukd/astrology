'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Moon, Star, Calendar, MessageCircle, Zap, TrendingUp, Heart, BookOpen, Share2 } from 'lucide-react';
import { useAuth } from '@/app/providers';
import { cn } from '@/lib/utils';
import { getRandomHook } from '@/lib/hooks';

export default function CompatibilityPage() {
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [chartList, setChartList] = useState<any[]>([]);
  const [selectedChartA, setSelectedChartA] = useState<string>('');
  const [selectedChartB, setSelectedChartB] = useState<string>('');

  // Fetch user's charts
  const fetchCharts = useCallback(async () => {
    if (!session?.access_token) return;
    try {
      const res = await fetch('/api/charts', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch charts');
      const data = await res.json();
      setChartList(data);
      // Auto-select first two charts if available
      if (data.length >= 2) {
        setSelectedChartA(data[0].id);
        setSelectedChartB(data[1].id);
      } else if (data.length === 1) {
        setSelectedChartA(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  }, [session?.access_token]);

  // Fetch compatibility
  const fetchCompatibility = useCallback(async (chartA: string, chartB: string) => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/compatibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ chart_id: chartA, chart_b_id: chartB }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to get compatibility');
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchCharts();
  }, [fetchCharts]);

  useEffect(() => {
    if (selectedChartA && selectedChartB && selectedChartA !== selectedChartB) {
      fetchCompatibility(selectedChartA, selectedChartB);
    }
  }, [selectedChartA, selectedChartB, fetchCompatibility]);

  const handleChartAChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChartA(e.target.value);
    // Reset result when chart changes
    setResult(null);
  };

  const handleChartBChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChartB(e.target.value);
    // Reset result when chart changes
    setResult(null);
  };

  const handleSwap = () => {
    setSelectedChartA(selectedChartB);
    setSelectedChartB(selectedChartA);
  };

  if (!session?.access_token) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Relationship Compatibility
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Discover the astrological chemistry between two people.
          </p>
        </div>

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

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
            <MessageCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Person
              </label>
              <select
                value={selectedChartA}
                onChange={handleChartAChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {chartList.map((chart: any) => (
                  <option key={chart.id} value={chart.id}>
                    {chart.subject_name || 'Unnamed'} • {new Date(chart.birth_datetime_utc).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleSwap}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Share2 className="h-4 w-4" /> Swap
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Second Person
              </label>
              <select
                value={selectedChartB}
                onChange={handleChartBChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {chartList.map((chart: any) => (
                  <option key={chart.id} value={chart.id}>
                    {chart.subject_name || 'Unnamed'} • {new Date(chart.birth_datetime_utc).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (selectedChartA && selectedChartB && selectedChartA !== selectedChartB) {
                    fetchCompatibility(selectedChartA, selectedChartB);
                  }
                }}
                disabled={loading || !selectedChartA || !selectedChartB || selectedChartA === selectedChartB}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Check Compatibility'
                )}
              </button>
            </div>
          </div>
        </div>

        {result && !loading && (
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Compatibility Results
              </h2>
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <strong>{result.chart_a_info?.name}</strong> & <strong>{result.chart_b_info?.name}</strong>
                  </p>
                  <div className="flex items-center justify-center gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Compatibility Score</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{result.overall_score}%</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Relationship Strengths
                  </h3>
                  {result.strengths && result.strengths.length > 0 ? (
                    <div className="space-y-2">
                      {result.strengths.map((strength: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <Star className="h-4 w-4 mt-1 text-green-500 dark:text-green-400 flex-shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300">{strength}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        No specific strengths identified.
                      </p>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Potential Challenges
                  </h3>
                  {result.challenges && result.challenges.length > 0 ? (
                    <div className="space-y-2">
                      {result.challenges.map((challenge: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <Zap className="h-4 w-4 mt-1 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300">{challenge}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        No significant challenges identified.
                      </p>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Advice & Guidance
                  </h3>
                  {result.advice && result.advice.length > 0 ? (
                    <div className="space-y-2">
                      {result.advice.map((advice: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <Heart className="h-4 w-4 mt-1 text-pink-500 dark:text-pink-400 flex-shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300">{advice}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        No specific advice available.
                      </p>
                    </>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Detailed Analysis
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {result.detailed_analysis}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          <strong>Important:</strong> Compatibility readings are for entertainment and self-reflection only.
          They are not a substitute for professional advice or therapy.
        </p>
      </div>
    </div>
  );
}
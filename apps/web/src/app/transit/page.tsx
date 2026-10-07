'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Moon, Star, Calendar, MessageCircle, Zap, TrendingUp, Heart } from 'lucide-react';
import { useAuth } from '@/app/providers';
import { cn } from '@/lib/utils';

export default function TransitPage() {
  const router = useRouter();
  const { session, authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transits, setTransits] = useState<any>(null);
  const [chartList, setChartList] = useState<any[]>([]);
  const [selectedChartId, setSelectedChartId] = useState<string>('');

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
      // Auto-select the most recent chart
      if (data.length > 0) {
        setSelectedChartId(data[0].id);
        await fetchTransits(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  }, [session?.access_token]);

  // Fetch transits for a chart
  const fetchTransits = useCallback(async (chartId: string) => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/transits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ chart_id: chartId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to get transits');
      }
      const data = await res.json();
      setTransits(data);
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
    if (selectedChartId) {
      fetchTransits(selectedChartId);
    }
  }, [selectedChartId, fetchTransits]);

  const handleChartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChartId(e.target.value);
  };

  const formatAspect = (aspect: any) => {
    const { transit_planet, natal_point, aspect: aspectType, orb, applying } = aspect;
    const applyingText = applying ? 'applying' : 'separating';
    return `${transit_planet} ${aspectType} ${natal_point} (orb ${orb}°, ${applyingText})`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!session?.access_token) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Current Transits
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            See how the current planetary movements affect your natal chart.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
            <MessageCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Chart
            </label>
            <select
              value={selectedChartId}
              onChange={handleChartChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {chartList.map((chart: any) => (
                <option key={chart.id} value={chart.id}>
                  {chart.subject_name || 'Unnamed'} • {new Date(chart.birth_datetime_utc).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="text-center py-8">
              <Loader2 className="h-5 w-5 mx-auto mb-3 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">Calculating transits...</p>
            </div>
          )}

          {transits && !loading && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Current Planetary Positions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {transits.current_planets.map((planet: any) => (
                  <div key={planet.name} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{planet.name}</span>
                      {planet.retrograde && (
                        <span className="text-xs text-primary-500 dark:text-primary-400">Rx</span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.floor(planet.longitude % 30)}°
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {planet.sign} {planet.degree_in_sign.toFixed(2)}′
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Speed: {planet.speed.toFixed(2)}°/day
                    </p>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Active Transits
              </h2>
              {transits.active_transits.length > 0 ? (
                <div className="space-y-3">
                  {transits.active_transits.map((t: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="font-medium text-gray-900 dark:text-white mb-1">
                        {formatAspect(t)}
                      </p>
                      {t.natal_point_type === 'house_cusp' && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          (House cusp)
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                  No major transits active at this time.
                </p>
              )}

              {Object.keys(transits.transit_dates || {}).length > 0 && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Upcoming Exact Transit Hits
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(transits.transit_dates || {}).map(([key, dates], index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="font-medium text-gray-900 dark:text-white">{key}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(Array.isArray(dates) ? dates.slice(0, 3).join(', ') : '')}{Array.isArray(dates) && dates.length > 3 ? '…' : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          <strong>Important:</strong> Transit calculations are for entertainment and self-reflection only.
          They are not a substitute for professional advice.
        </p>
      </div>
    </div>
  );
}
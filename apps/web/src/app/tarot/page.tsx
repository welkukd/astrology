'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Moon, Star, Calendar, MessageCircle, Zap, TrendingUp, Heart, BookOpen } from 'lucide-react';
import { useAuth } from '@/app/providers';
import { cn } from '@/lib/utils';

export default function TarotPage() {
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState<any>(null);
  const [spreadType, setSpreadType] = useState<'single' | 'three' | 'celtic' | 'relationship'>('three');
  const [question, setQuestion] = useState('');

  const SPREAD_OPTIONS = [
    { value: 'single', label: 'Single Card', description: 'Quick insight or daily guidance' },
    { value: 'three', label: 'Three-Card Spread', description: 'Past, present, future' },
    { value: 'celtic', label: 'Celtic Cross', description: 'Detailed comprehensive reading' },
    { value: 'relationship', label: 'Relationship Spread', description: 'Dynamics between two people' },
  ];

  // Fetch a new tarot reading
  const fetchReading = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/tarot/reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ spread_type: spreadType, question: question.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to get reading');
      }
      const data = await res.json();
      setReading(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, spreadType, question]);

  useEffect(() => {
    fetchReading();
  }, [fetchReading]);

  if (!session?.access_token) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Tarot Readings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Draw cards and receive guidance from the tarot.
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              New Reading
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Spread Type
                </label>
                <select
                  value={spreadType}
                  onChange={(e) => setSpreadType(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {SPREAD_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {SPREAD_OPTIONS.find((o) => o.value === spreadType)?.description}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question (optional)
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a specific question for more focused guidance..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent h-20"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={fetchReading}
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Drawing Cards...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4" />
                    Get Reading
                  </>
                )}
              </button>
            </div>
          </div>

          {reading && !loading && (
            <div className="space-y-6">
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Your Tarot Reading
                </h2>
                <div className="space-y-4">
                  {reading.question && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Question:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 italic">
                        "{reading.question}"
                      </p>
                    </div>
                  )}
                  <div className="grid gap-6 sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]">
                    {reading.cards_drawn.map((card: any, index: number) => (
                      <div key={index} className="text-center">
                        <div className="bg-white dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="text-3xl font-bold mb-2">
                            {/* Use first letter for card name display */}
                            {card.name.charAt(0)}
                            {card.arcana === 'major' && (
                              <span className="text-xs text-primary-500">✦</span>
                            )}
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">{card.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {card.upright ? 'Upright' : 'Reversed'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Interpretation
                    </h3>
                    {typeof reading.interpretation === 'string' && (
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {reading.interpretation}
                      </p>
                    )}
                    {typeof reading.interpretation === 'object' && reading.interpretation !== null && (
                      <div className="space-y-3">
                        {Object.entries(reading.interpretation).map(([key, value]) => (
                          <div key={key} className="flex items-start gap-3">
                            <span className="flex-shrink-0 text-primary-500">•</span>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{key}</p>
                              <p className="text-gray-700 dark:text-gray-300">{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!reading && !loading && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 mx-auto mb-4 text-primary-500" />
              <p className="text-gray-600 dark:text-gray-400">
                Click "Get Drawing" to receive your tarot reading.
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          <strong>Important:</strong> Tarot readings are for entertainment and self-reflection only.
          They are not a substitute for professional advice.
        </p>
      </div>
    </div>
  );
}
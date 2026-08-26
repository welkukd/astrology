'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Moon, Star, Calendar, MessageCircle, Zap, TrendingUp, Heart } from 'lucide-react';
import { useAuth } from '@/app/providers';
import { cn } from '@/lib/utils';

export default function NumerologyPage() {
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    birthdate: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      if (!session?.access_token) {
        router.push('/auth/login');
        return;
      }

      // Basic validation
      if (!formData.full_name.trim()) {
        throw new Error('Full name is required');
      }
      if (!formData.birthdate) {
        throw new Error('Birthdate is required');
      }
      // Simple date format check (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.birthdate)) {
        throw new Error('Birthdate must be in YYYY-MM-DD format');
      }

      const res = await fetch('/api/v1/numerology', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          birthdate: formData.birthdate,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to get numerology report');
      }

      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const formatNumberWithMeaning = (number: number) => {
    const meaningMap: Record<number, string> = {
      1: 'Leadership, Independence',
      2: 'Cooperation, Diplomacy',
      3: 'Creativity, Expression',
      4: 'Stability, Hard Work',
      5: 'Freedom, Adventure',
      6: 'Love, Responsibility',
      7: 'Spirituality, Analysis',
      8: 'Power, Success',
      9: 'Compassion, Humanity',
      11: 'Intuition, Inspiration',
      22: 'Master Builder, Vision',
      33: 'Master Teacher, Blessing',
    };
    return meaningMap[number] || '';
  };

  if (!session?.access_token) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Numerology Report
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Discover the numbers that influence your life path and personality.
          </p>
        </div>

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
                Full Name
              </label>
              <input
                value={formData.full_name}
                onChange={e => handleInputChange('full_name', e.target.value)}
                placeholder="Enter your full name (as on birth certificate)"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Birthdate (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={formData.birthdate}
                onChange={e => handleInputChange('birthdate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  'Generate Report'
                )}
              </button>
            </div>
          </div>
        </div>

        {report && (
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Your Numerology Report
              </h2>
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Name: <span className="font-medium">{report.full_name}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Birthdate: <span className="font-medium">{report.birthdate}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[ 
                    { key: 'life_path', label: 'Life Path', icon: 'Moon', color: 'blue' },
                    { key: 'expression', label: 'Expression', icon: 'Star', color: 'purple' },
                    { key: 'heart_desire', label: "Heart's Desire", icon: 'Heart', color: 'red' },
                    { key: 'personality', label: 'Personality', icon: 'Zap', color: 'green' },
                    { key: 'birth_day', label: 'Birth Day', icon: 'Calendar', color: 'indigo' },
                  ].map(({ key, label, icon, color }) => {
                    const num = report[key]?.number || 0;
                    const meaning = formatNumberWithMeaning(num);
                    const Icon = (() => {
                      switch (icon) {
                        case 'Moon': return Moon;
                        case 'Star': return Star;
                        case 'Heart': return Heart;
                        case 'Zap': return Zap;
                        case 'Calendar': return Calendar;
                        default: return Star;
                      }
                    })();
                    return (
                      <div key={key} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                          <Icon className={`h-5 w-5 text-${color}-500 dark:text-${color}-400`} />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{num}</div>
                        {meaning && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">{meaning}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Detailed Interpretations
                  </h3>
                  <div className="space-y-3">
                    {[ 
                      { key: 'life_path', label: 'Life Path Number' },
                      { key: 'expression', label: 'Expression Number' },
                      { key: 'heart_desire', label: "Heart's Desire Number" },
                      { key: 'personality', label: 'Personality Number' },
                      { key: 'birth_day', label: 'Birth Day Number' },
                    ].map(({ key, label }) => {
                      const interp = report[key]?.interpretation || 'No interpretation available.';
                      return (
                        <div key={key} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="font-medium text-gray-900 dark:text-white mb-1">{label}</p>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{interp}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          <strong>Important:</strong> Numerology is for entertainment and self-reflection only.
          It is not a substitute for professional advice.
        </p>
      </div>
    </div>
  );
}
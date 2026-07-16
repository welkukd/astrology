'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/providers';
import { Moon, Plus, Loader2, Calendar, Trash2, BookOpen, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { session, loading: authLoading } = useAuth();
  const [charts, setCharts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!session) return;
    fetchCharts();
  }, [session, authLoading]);

  const fetchCharts = async () => {
    try {
      const res = await fetch('/api/charts', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.ok) setCharts(await res.json());
    } catch {}
    finally { setLoading(false); }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary-600" /></div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Moon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign in to view your charts</h1>
          <Link href="/auth/login" className="text-primary-600 hover:underline">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Moon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Astrology App</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{session.user?.email}</span>
              <Link href="/chart/new" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
                <Plus className="h-4 w-4" /> New Chart
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Charts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{charts.length} chart{charts.length !== 1 ? 's' : ''} saved</p>
        </div>

        {charts.length === 0 ? (
          <div className="text-center py-20">
            <Star className="h-16 w-16 text-primary-600 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No charts yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first birth chart to get started</p>
            <Link href="/chart/new" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium">
              <Plus className="h-5 w-5" /> Create Your First Chart
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charts.map(chart => (
              <div key={chart.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{chart.subject_name || 'Birth Chart'}</h3>
                  <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                    <p className="flex items-center gap-2"><Calendar className="h-4 w-4" />{chart.birth_datetime_utc ? format(new Date(chart.birth_datetime_utc), 'MMM d, yyyy') : '—'}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/chart/${chart.id}/read`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
                      <BookOpen className="h-4 w-4" /> Reading
                    </Link>
                    <Link href={`/chart/${chart.id}`} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">
                      Chart
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

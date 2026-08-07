'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/providers';
import { Moon, Plus, Loader2, Calendar, Trash2, BookOpen, Star, CreditCard, Zap, Crown, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type BillingStatus = {
  plan: string;
  status: string;
  plan_id?: string;
  current_period_end?: number;
  cancel_at_period_end?: boolean;
  charts_used: number;
  charts_limit: number;
};

export default function DashboardPage() {
  const { session, loading: authLoading } = useAuth();
  const [charts, setCharts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState<BillingStatus | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [portalError, setPortalError] = useState<string | null>(null);

  // Use a ref to prevent re-running the initial load on every session refresh
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!session) return;
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    fetchCharts();
    fetchBilling();
  }, [session, authLoading]);

  const fetchCharts = async () => {
    try {
      setFetchError(null);
      const res = await fetch('/api/charts', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.ok) setCharts(await res.json());
      else setFetchError('Failed to load charts. Please try again.');
    } catch {
      setFetchError('Failed to load charts. Please try again.');
    }
    finally { setLoading(false); }
  };

  const fetchBilling = async () => {
    try {
      setFetchError(null);
      const res = await fetch('/api/billing/status', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.ok) setBilling(await res.json());
      else setFetchError('Failed to load billing info. Please try again.');
    } catch {
      setFetchError('Failed to load billing info. Please try again.');
    }
  };

  const openPortal = async () => {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const res = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (!res.ok) {
        setPortalError('Could not open billing portal. Please try again.');
        return;
      }
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setPortalError('Could not open billing portal. Please try again.');
    } catch {
      setPortalError('Could not open billing portal. Please try again.');
    }
    finally { setPortalLoading(false); }
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

  const isPro = billing?.plan === 'pro';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Billing Status Card */}
        <div className="mb-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                isPro ? "bg-primary-50 dark:bg-primary-900/20" : "bg-gray-100 dark:bg-gray-800"
              )}>
                {isPro ? (
                  <Zap className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                ) : (
                  <Star className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {isPro ? 'Pro Plan' : 'Free Plan'}
                  {isPro && billing?.plan_id === 'lifetime' && (
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                      Lifetime
                    </span>
                  )}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isPro
                    ? billing?.cancel_at_period_end
                      ? `Cancels ${billing.current_period_end ? format(new Date(billing.current_period_end * 1000), 'MMM d, yyyy') : 'soon'}`
                      : billing?.plan_id === 'lifetime'
                        ? 'One-time payment — no expiry'
                        : `Renews ${billing?.current_period_end ? format(new Date(billing.current_period_end * 1000), 'MMM d, yyyy') : ''}`
                    : `${billing?.charts_used ?? charts.length} of ${billing?.charts_limit ?? 3} free charts used`
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isPro ? (
                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium disabled:opacity-50"
                >
                  {portalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                  Manage Subscription
                </button>
              ) : (
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                >
                  <Zap className="h-4 w-4" /> Upgrade to Pro
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Charts</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{charts.length} chart{charts.length !== 1 ? 's' : ''} saved</p>
          </div>
          <Link
            href="/chart/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium text-sm"
          >
            <Plus className="h-5 w-5" /> New Chart
          </Link>
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

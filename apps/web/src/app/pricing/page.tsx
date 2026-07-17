'use client';

import Link from 'next/link';
import { ArrowLeft, Check, Star } from 'lucide-react';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DisclaimerBanner />
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link href="/" className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Home</span>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-900 dark:text-white">Pricing</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our astrology calculations and interpretations are completely free. No hidden fees, no premium tiers.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-primary-500 dark:border-primary-400 p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Free Forever</h2>
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">$0</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">No credit card required</p>

            <ul className="space-y-3 mb-8">
              {[
                'Unlimited natal chart calculations',
                'Swiss Ephemeris precision',
                'AI-powered interpretations',
                '12+ house systems',
                'Tropical & Sidereal zodiac',
                'Aspects, dignities & nakshatras',
                'Chart export (JSON)',
                'Data deletion anytime',
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/chart/new"
              className="block w-full py-3 bg-primary-600 text-white rounded-xl text-center font-semibold hover:bg-primary-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-8 text-sm">
          This is a self-hosted open-source project. All features are free to use.
        </p>
      </div>
    </div>
  );
}

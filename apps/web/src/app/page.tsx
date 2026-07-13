'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Moon, Star, Sparkles, ArrowRight, Shield, Lock, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/chart/new');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Star className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Astrology Assistant</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/chart/new" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                Get Your Chart
              </Link>
              <Link href="/auth/login" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>AI-powered • Astronomically accurate • Privacy-first</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight mb-6 text-balance">
            Your Birth Chart,{' '}
            <span className="text-primary-600 dark:text-primary-400">Explained</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto text-balance">
            Enter your birth details to generate a precise natal chart. Our AI assistant interprets the planetary positions in clear, personalized language&mdash;no astrologer persona, just clear insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-xl text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25"
            >
              <span className="flex items-center gap-2">
                Get Your Free Chart
                <ArrowRight className="h-5 w-5" />
              </span>
            </button>
            <Link
              href="/disclaimer"
              className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              Read Our Approach
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Your data encrypted, never sold</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>GDPR & CCPA compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <span>Swiss Ephemeris precision</span>
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Moon className="h-6 w-6" />}
            title="Precise Calculations"
            description="Powered by Swiss Ephemeris (Moshier) with sub-arcsecond precision. Tropical and Sidereal zodiacs, 22+ house systems."
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6" />}
            title="AI Interpretations"
            description="Clear, personalized explanations of your placements. No fake astrologers&mdash;just AI interpreting calculated data."
          />
          <FeatureCard
            icon={<Star className="h-6 w-6" />}
            title="Your Data, Your Control"
            description="Export your chart as JSON anytime. Delete your account and all data with one click. No tracking, no ads."
          />
        </div>
      </div>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              For entertainment and reflection only. Not professional advice.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">Terms</Link>
              <Link href="/disclaimer" className="hover:text-gray-700 dark:hover:text-gray-300">Disclaimer</Link>
              <Link href="/methodology" className="hover:text-gray-700 dark:hover:text-gray-300">Methodology</Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                <Github className="h-4 w-4" />
                Open Source
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400 mb-4 w-fit">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
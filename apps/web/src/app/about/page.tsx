import Link from 'next/link';
import { Star, Shield, Lock, Brain, Globe, Database, Eye, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Astrology Assistant</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Professional-grade astrological calculations powered by Swiss Ephemeris, interpreted by advanced AI — designed from the ground up with your privacy as the top priority.
          </p>
        </div>

        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <Star className="h-6 w-6 text-primary-600" />
              What We Are
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                Astrology Assistant is a self-hosted, open-source astrology application that generates precise natal charts and provides AI-powered interpretations. We combine the astronomical accuracy of the Swiss Ephemeris — the same calculation engine used by professional astrologers worldwide — with modern AI to deliver clear, personalized insights about your birth chart.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mt-4">
                Unlike mainstream astrology apps, we don&apos;t monetize your data. There are no ads, no tracking pixels, no third-party analytics, and no premium paywalls hiding basic features. Your birth data is yours alone.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <Brain className="h-6 w-6 text-primary-600" />
              How AI Interpretations Work
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                When you request an interpretation, your chart data — planetary positions, house placements, and aspects — is sent to a large language model (Google Gemini). The AI receives structured astronomical data and generates natural-language explanations of what each placement means.
              </p>
              <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What the AI receives:</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Planet names, signs, degrees, and house placements</li>
                  <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Aspect types (conjunction, trine, square, etc.) and orbs</li>
                  <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> House cusps and rising sign</li>
                  <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Your chosen zodiac system (Tropical or Sidereal)</li>
                </ul>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mt-4">
                The AI does <strong>not</strong> receive your name, email, or any personally identifiable information with interpretation requests. It only sees the raw astronomical data.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary-600" />
              Privacy-First by Design
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <Lock className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Encrypted &amp; Secure</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  All data is encrypted in transit and at rest. Authentication is handled by Supabase with industry-standard JWT tokens. No passwords are stored in plaintext.
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <Database className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">You Own Your Data</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Export your chart data as JSON anytime. Delete your account and all associated data with one click. We don&apos;t keep backups of deleted accounts.
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <Eye className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No Tracking</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  No Google Analytics, no Facebook pixels, no advertising trackers. We don&apos;t sell, share, or monetize your data in any way. Period.
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <Globe className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">GDPR &amp; CCPA Compliant</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Full compliance with international privacy regulations. You can request data access, correction, or deletion at any time.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <Heart className="h-6 w-6 text-primary-600" />
              Our Philosophy
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                We believe astrology can be a powerful tool for self-reflection and personal growth — when presented honestly and accurately. That means using professional-grade astronomical calculations, being transparent about what AI can and cannot do, and never overstating our interpretations.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mt-4">
                Astrology Assistant is not a replacement for professional astrologers, therapists, or medical professionals. It&apos;s a tool for exploration, reflection, and curiosity — nothing more, nothing less.
              </p>
            </div>
          </section>
        </div>
      </div>

      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">Astrology Assistant</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Professional-grade astrological calculations powered by Swiss Ephemeris and interpreted by advanced AI. Your privacy is our priority.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/chart/new" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Generate Chart</Link></li>
                <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</Link></li>
                <li><Link href="/methodology" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Methodology</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/disclaimer" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Disclaimer</Link></li>
                <li><Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                <li><a href="mailto:support@astrology-app.com" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Astrology Assistant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

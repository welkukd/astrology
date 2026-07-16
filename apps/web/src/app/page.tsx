'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Moon, Star, Sparkles, ArrowRight, Shield, Lock, Github, Globe, Brain, Database, Zap, Heart, Eye, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/chart/new');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-purple-600/10 to-pink-600/10 dark:from-primary-900/20 dark:via-purple-900/20 dark:to-pink-900/20 animate-gradient-xy"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 dark:bg-primary-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>AI-powered • Astronomically accurate • Privacy-first</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              <span className="text-gray-900 dark:text-white">Your Birth Chart,</span>
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 dark:from-primary-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                Decoded by AI
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto text-balance leading-relaxed">
              Enter your birth details to generate a precise natal chart. Our AI assistant interprets the planetary positions in clear, personalized language&mdash;no astrologer persona, just clear insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={handleGetStarted}
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 transform hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center gap-2">
                  Get Your Free Chart
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Our Platform</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Professional-grade astrological calculations combined with cutting-edge AI for insights you can actually use.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Moon className="h-6 w-6" />}
              title="Swiss Ephemeris Precision"
              description="Powered by the same ephemeris used by professional astrologers. Sub-arcsecond accuracy for planetary positions."
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6" />}
              title="AI-Powered Interpretations"
              description="Clear, personalized explanations of your placements. No fake astrologers&mdash;just AI interpreting calculated data."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="22+ House Systems"
              description="Placidus, Koch, Whole Sign, Equal, and more. Choose the system that resonates with your practice."
            />
            <FeatureCard
              icon={<Database className="h-6 w-6" />}
              title="Your Data, Your Control"
              description="Export your chart as JSON anytime. Delete your account and all data with one click. No tracking, no ads."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Instant Results"
              description="Generate your complete natal chart in seconds. No waiting, no appointments, no expensive consultations."
            />
            <FeatureCard
              icon={<Eye className="h-6 w-6" />}
              title="Multiple Perspectives"
              description="Tropical and Sidereal zodiacs, 12+ aspect types, planetary dignities, and arabic parts included."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get your personalized birth chart interpretation in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-600/20 via-primary-600 to-primary-600/20"></div>
            
            <StepCard
              step={1}
              icon={<Star className="h-6 w-6" />}
              title="Enter Your Details"
              description="Provide your birth date, time, and location. The more precise, the more accurate your chart will be."
            />
            <StepCard
              step={2}
              icon={<Sparkles className="h-6 w-6" />}
              title="Get Your Chart"
              description="Our engine calculates your complete natal chart with 12 planets, 12 houses, and dozens of aspects."
            />
            <StepCard
              step={3}
              icon={<Brain className="h-6 w-6" />}
              title="Read Your Insights"
              description="AI interprets your unique planetary placements into clear, actionable insights about your personality and life."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What People <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Are Saying</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands who have discovered their astrological blueprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="I've tried many astrology apps, but this is the first one that gave me insights I could actually relate to. The AI explanations are so clear and personal."
              author="Sarah M."
              role="Marketing Director"
            />
            <TestimonialCard
              quote="As someone skeptical about astrology, I was impressed by the scientific accuracy of the calculations. The AI keeps it grounded and practical."
              author="Michael R."
              role="Software Engineer"
            />
            <TestimonialCard
              quote="The birth chart analysis was spot-on. It helped me understand my relationship patterns and career inclinations in ways I hadn't considered before."
              author="Emma L."
              role="Life Coach"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Discover Your Stars?
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Get your free natal chart with AI-powered interpretations. No sign-up required for basic readings.
          </p>
          <button
            onClick={handleGetStarted}
            className="group px-8 py-4 bg-white text-primary-600 rounded-xl text-lg font-semibold hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center gap-2">
              Generate Your Chart Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* Footer */}
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
              <div className="flex items-center gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <Github className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/chart/new" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Generate Chart</Link></li>
                <li><Link href="/disclaimer" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Our Approach</Link></li>
                <li><Link href="/methodology" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Methodology</Link></li>
                <li><Link href="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Disclaimer</Link></li>
                <li><a href="mailto:support@astrology-app.com" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Astrology Assistant. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                For entertainment and reflection only. Not professional advice.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-lg hover:shadow-primary-600/10 hover:-translate-y-1">
      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400 mb-4 w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, icon, title, description }: { step: number; icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="relative text-center p-8">
      <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-purple-600 text-white mb-6 shadow-lg shadow-primary-600/25">
        <span className="text-xl font-bold">{step}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <Quote className="h-8 w-8 text-primary-400 dark:text-primary-500 mb-4 opacity-50" />
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic">&ldquo;{quote}&rdquo;</p>
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">{author}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
      </div>
    </div>
  );
}

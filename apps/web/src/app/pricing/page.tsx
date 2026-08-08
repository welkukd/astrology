'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Star, Zap, Crown, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/providers';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Try it out — no card required',
    icon: Star,
    color: 'gray',
    features: [
      '3 birth charts',
      'Basic AI interpretations',
      'Western & Vedic zodiac',
      '10 house systems',
      'Chart export (JSON)',
      'Data deletion anytime',
    ],
    cta: 'Get Started Free',
    ctaHref: '/chart/new',
    highlighted: false,
    priceKey: null,
    mode: null,
  },
  {
    name: 'Pro Monthly',
    price: '$4.99',
    period: '/month',
    description: 'Full access, cancel anytime',
    icon: Zap,
    color: 'primary',
    features: [
      'Unlimited birth charts',
      'Full AI readings (9 sections)',
      '22+ house systems',
      'Planetary dignities & nakshatras',
      'PDF export',
      'Daily horoscope',
      'Compatibility analysis',
      'Priority support',
    ],
    cta: 'Start Pro',
    ctaHref: null,
    highlighted: true,
    priceKey: 'pro_monthly',
    mode: 'subscription',
  },
  {
    name: 'Lifetime',
    price: '$29.99',
    period: 'one-time',
    description: 'Pay once, use forever',
    icon: Crown,
    color: 'yellow',
    features: [
      'Everything in Pro',
      'One-time payment',
      'No subscription needed',
      'All future features included',
      'Priority support forever',
    ],
    cta: 'Get Lifetime',
    ctaHref: null,
    highlighted: false,
    priceKey: 'lifetime',
    mode: 'payment',
  },
];

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; btn: string; icon: string }> = {
  gray: {
    border: 'border-gray-200 dark:border-gray-700',
    bg: 'bg-white dark:bg-gray-900',
    text: 'text-gray-900 dark:text-white',
    btn: 'bg-gray-900 dark:bg-white dark:text-gray-900 text-white hover:bg-gray-800',
    icon: 'text-gray-400',
  },
  primary: {
    border: 'border-primary-500 dark:border-primary-400 ring-2 ring-primary-500/20',
    bg: 'bg-white dark:bg-gray-900',
    text: 'text-gray-900 dark:text-white',
    btn: 'bg-primary-600 text-white hover:bg-primary-700',
    icon: 'text-primary-600 dark:text-primary-400',
  },
  yellow: {
    border: 'border-yellow-400 dark:border-yellow-500',
    bg: 'bg-white dark:bg-gray-900',
    text: 'text-gray-900 dark:text-white',
    btn: 'bg-yellow-500 text-gray-900 hover:bg-yellow-400 font-bold',
    icon: 'text-yellow-500',
  },
};

export default function PricingPage() {
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/billing/prices')
      .then((res) => res.json())
      .then((data) => {
        if (data.prices) setPrices(data.prices);
      })
      .catch(() => {
        // Prices failed to load — checkout will show error
      });
  }, []);

  const handleCheckout = async (tier: typeof TIERS[0]) => {
    if (!session) {
      router.push('/auth/signup');
      return;
    }

    if (tier.ctaHref) {
      router.push(tier.ctaHref);
      return;
    }

    // Stripe checkout
    const priceId = tier.priceKey ? prices[tier.priceKey] : null;
    if (!priceId || !tier.mode) return;

    setLoading(tier.name);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          mode: tier.mode,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('Checkout unavailable. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DisclaimerBanner />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Trusted by 10,000+ users
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Professional-grade astrology powered by Swiss Ephemeris and AI. Start free, upgrade when you&apos;re ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TIERS.map((tier) => {
            const colors = COLOR_MAP[tier.color];
            const Icon = tier.icon;
            const isLoading = loading === tier.name;

            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl border-2 ${colors.border} ${colors.bg} p-8 flex flex-col ${
                  tier.highlighted ? 'shadow-xl scale-[1.02]' : 'shadow-sm'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl bg-gray-100 dark:bg-gray-800 ${colors.icon}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className={`text-xl font-bold ${colors.text}`}>{tier.name}</h3>
                </div>

                <div className="mb-1">
                  <span className={`text-4xl font-extrabold ${colors.text}`}>{tier.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">{tier.period}</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{tier.description}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 mt-0.5 shrink-0 ${colors.icon}`} />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(tier)}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 ${colors.btn}`}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    tier.cta
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              No credit card for Free
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Secure payments via Stripe
            </span>
          </div>
        </div>

        <div className="mt-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 max-w-3xl mx-auto">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              {
                q: 'What calculations do you use?',
                a: 'Swiss Ephemeris — the same library professional astrologers use. Sub-arcsecond accuracy for all planetary positions.',
              },
              {
                q: 'Is my birth data private?',
                a: 'Yes. Your data is encrypted, never sold, and you can delete everything with one click. GDPR & CCPA compliant.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel from your dashboard anytime. You keep access until the end of your billing period.',
              },
              {
                q: 'What AI model do you use?',
                a: 'We use advanced language models to interpret your chart. The AI provides clear, personalized insights — no fake astrologer personas.',
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{faq.q}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

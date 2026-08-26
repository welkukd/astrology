'use client';

import { Sparkles } from 'lucide-react';

export default function AstrologyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Astrology
        </h1>
        <p className="text-body-lg text-text-secondary mt-2">
          Birth charts, transits, and celestial timing.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article className="card-default card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-gold-muted)' }}>
              <Sparkles className="h-5 w-5 text-accent-gold" aria-hidden="true" />
            </div>
            <h2 className="text-heading-3 font-medium">Natal Chart</h2>
          </div>
          <p className="text-body-sm text-text-muted">
            Calculate your complete birth chart with planetary positions, houses, and aspects.
          </p>
        </article>

        <article className="card-default card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-gold-muted)' }}>
              <Sparkles className="h-5 w-5 text-accent-gold" aria-hidden="true" />
            </div>
            <h2 className="text-heading-3 font-medium">Transits</h2>
          </div>
          <p className="text-body-sm text-text-muted">
            Track current planetary movements and their impact on your natal chart.
          </p>
        </article>

        <article className="card-default card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-gold-muted)' }}>
              <Sparkles className="h-5 w-5 text-accent-gold" aria-hidden="true" />
            </div>
            <h2 className="text-heading-3 font-medium">Progressions</h2>
          </div>
          <p className="text-body-sm text-text-muted">
            Explore secondary progressions and solar arcs for long-term forecasting.
          </p>
        </article>

        <article className="card-default card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-gold-muted)' }}>
              <Sparkles className="h-5 w-5 text-accent-gold" aria-hidden="true" />
            </div>
            <h2 className="text-heading-3 font-medium">Synastry</h2>
          </div>
          <p className="text-body-sm text-text-muted">
            Compare charts with others to understand relationship dynamics.
          </p>
        </article>

        <article className="card-default card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-gold-muted)' }}>
              <Sparkles className="h-5 w-5 text-accent-gold" aria-hidden="true" />
            </div>
            <h2 className="text-heading-3 font-medium">Solar Returns</h2>
          </div>
          <p className="text-body-sm text-text-muted">
            Annual solar return charts for the year ahead themes.
          </p>
        </article>

        <article className="card-default card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-gold-muted)' }}>
              <Sparkles className="h-5 w-5 text-accent-gold" aria-hidden="true" />
            </div>
            <h2 className="text-heading-3 font-medium">AI Interpretations</h2>
          </div>
          <p className="text-body-sm text-text-muted">
            Get personalized AI-generated readings for any chart placement.
          </p>
        </article>
      </div>
    </div>
  );
}
'use client';

import { LayoutDashboard, BookOpen, Star, Clock } from 'lucide-react';

export default function LibraryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Library
        </h1>
        <p className="text-body-lg text-text-secondary mt-2">
          Your saved readings, charts, and personal insights.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <article className="card-default card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-gold-muted)' }}>
              <LayoutDashboard className="h-5 w-5 text-accent-gold" aria-hidden="true" />
            </div>
            <h2 className="text-heading-3 font-medium">Saved Charts</h2>
          </div>
          <p className="text-body-sm text-text-muted">
            Access all your natal charts and return to previous readings.
          </p>
        </article>

        <article className="card-default card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-gold-muted)' }}>
              <BookOpen className="h-5 w-5 text-accent-gold" aria-hidden="true" />
            </div>
            <h2 className="text-heading-3 font-medium">Tarot History</h2>
          </div>
          <p className="text-body-sm text-text-muted">
            Review past card readings and track patterns over time.
          </p>
        </article>

        <article className="card-default card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-gold-muted)' }}>
              <Star className="h-5 w-5 text-accent-gold" aria-hidden="true" />
            </div>
            <h2 className="text-heading-3 font-medium">AI Conversations</h2>
          </div>
          <p className="text-body-sm text-text-muted">
            Continue previous guidance sessions or reference past insights.
          </p>
        </article>

        <article className="card-default card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-gold-muted)' }}>
              <Clock className="h-5 w-5 text-accent-gold" aria-hidden="true" />
            </div>
            <h2 className="text-heading-3 font-medium">Transit Archive</h2>
          </div>
          <p className="text-body-sm text-text-muted">
            Historical transit data and how past cycles manifested.
          </p>
        </article>
      </div>

      {/* Recent Activity Section */}
      <section className="space-y-4">
        <h2 className="text-heading-3 font-medium">Recent Activity</h2>
        <div className="card-default p-6">
          <div className="text-center py-12">
            <LayoutDashboard className="h-12 w-12 text-text-muted mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-body text-text-secondary mb-2">No recent activity</h3>
            <p className="text-body-sm text-text-muted max-w-md mx-auto">
              Start exploring the pillars to build your personal library of insights.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DisclaimerBannerProps {
  /** Custom message to display */
  message?: string;
  /** Custom expanded content */
  expandedContent?: React.ReactNode;
  /** Whether the banner is dismissible */
  dismissible?: boolean;
  /** Custom dismiss key for localStorage */
  dismissKey?: string;
  /** Auto-hide after specified days (default: 7) */
  autoHideDays?: number;
  /** Additional className */
  className?: string;
  /** Callback when dismissed */
  onDismiss?: () => void;
}

export function DisclaimerBanner({
  message = 'This app provides astrological interpretations for entertainment, reflection, and general guidance only.',
  expandedContent,
  dismissible = true,
  dismissKey = 'disclaimer-dismissed',
  autoHideDays = 7,
  className,
  onDismiss,
}: DisclaimerBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(dismissKey);
    if (saved) {
      setDismissed(true);
      return;
    }

    const sessionKey = 'disclaimer-session-started';
    const existing = localStorage.getItem(sessionKey);
    if (!existing) {
      localStorage.setItem(sessionKey, Date.now().toString());
    } else {
      const started = parseInt(existing, 10);
      if (Date.now() - started > autoHideDays * 24 * 60 * 60 * 1000) {
        setDismissed(true);
      }
    }
  }, [dismissKey, autoHideDays]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(dismissKey, 'true');
    onDismiss?.();
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  if (!mounted || (dismissed && !expanded)) return null;

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'bg-[rgba(251,191,36,0.08)] border border-accent-gold-border border-l-[3px] border-l-accent-gold',
        'rounded-md',
        'p-4 lg:px-6',
        className
      )}
      role="region"
      aria-label="Disclaimer"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-accent-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-label font-semibold text-text-primary mb-2">
                Important Disclaimer
              </h4>
              <p className="text-body-sm text-text-secondary">
                {message}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {expandedContent && (
                <button
                  onClick={handleToggleExpand}
                  className={cn(
                    'text-body-sm font-medium text-accent-gold hover:underline',
                    'flex items-center gap-1 transition-colors'
                  )}
                >
                  {expanded ? (
                    <>
                      Show less
                      <ChevronUp className="h-3 w-3" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      Read more
                      <ChevronDown className="h-3 w-3" aria-hidden="true" />
                    </>
                  )}
                </button>
              )}
              {dismissible && (
                <button
                  onClick={handleDismiss}
                  className={cn(
                    'p-1 rounded transition-colors',
                    'text-accent-gold hover:bg-accent-gold-muted',
                    'focus-visible:outline-none focus-visible:shadow-focus'
                  )}
                  aria-label="Dismiss disclaimer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {expanded && expandedContent && (
            <div className="mt-4 pt-4 border-t border-accent-gold-border animate-slide-down">
              {expandedContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Default expanded content for the disclaimer banner
 */
export function DefaultDisclaimerExpandedContent() {
  return (
    <div className="space-y-4 text-body-sm text-text-secondary">
      <div>
        <h5 className="font-semibold text-text-primary mb-1">How This Works</h5>
        <p>
          We use the Swiss Ephemeris (Moshier) via the flatlib library to calculate precise planetary positions
          from your birth date, time, and location. The AI then interprets these positions using established
          astrological meanings.
        </p>
      </div>
      <div>
        <h5 className="font-semibold text-text-primary mb-1">Limitations</h5>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Unknown birth time: Houses and Ascendant cannot be calculated (uses noon default).</li>
          <li>Precision: ~0.1 arcseconds (Moshier) vs 0.001" (full Swiss Ephemeris).</li>
          <li>House systems: Different systems give different house cusps.</li>
          <li>AI interpretation: Based on training data, not personal consultation.</li>
        </ul>
      </div>
      <div>
        <h5 className="font-semibold text-text-primary mb-1">Your Rights</h5>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Export all your data as JSON anytime (Settings → Export).</li>
          <li>Delete your account and all data with one click (Settings → Delete Account).</li>
          <li>GDPR/CCPA: Request data access, correction, or deletion at any time.</li>
        </ul>
      </div>
      <p className="text-caption text-text-subtle">
        Last updated: July 2026. See{' '}
        <a href="/disclaimer" className="underline hover:text-accent-gold">Full Disclaimer</a>{' '}
        and{' '}
        <a href="/methodology" className="underline hover:text-accent-gold">Methodology</a>.
      </p>
    </div>
  );
}
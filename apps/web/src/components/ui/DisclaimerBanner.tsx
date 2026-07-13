'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('disclaimer-dismissed');
    if (saved) setDismissed(true);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('disclaimer-dismissed', 'true');
  };

  if (dismissed && !expanded) return null;

  return (
    <div className="border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 rounded-xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
              Important Disclaimer
            </h4>
            <div className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
              <p>
                <strong>This app provides astrological interpretations for entertainment, reflection, and general guidance only.</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Results are AI-generated interpretations of calculated astronomical data — not guaranteed predictions.</li>
                <li>AI and software can make mistakes. Do not make important medical, legal, financial, relationship, or safety decisions based solely on this app.</li>
                <li>This is an AI assistant, not a human astrologer. We don't use fake personas, credentials, or testimonials.</li>
                <li>Your birth information is sensitive personal data. We encrypt it and never sell it. <a href="/privacy" className="underline hover:text-amber-700">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1"
            >
              {expanded ? 'Show less' : 'Read more'}
              <Info className="h-3 w-3" />
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800 rounded transition-colors"
              aria-label="Dismiss disclaimer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-amber-300 dark:border-amber-700 bg-amber-100 dark:bg-amber-900/30 p-4 text-sm text-amber-800 dark:text-amber-200 space-y-3">
          <div>
            <h5 className="font-semibold mb-1">How This Works</h5>
            <p>We use the Swiss Ephemeris (Moshier) via the flatlib library to calculate precise planetary positions from your birth date, time, and location. The AI then interprets these positions using established astrological meanings.</p>
          </div>
          <div>
            <h5 className="font-semibold mb-1">Limitations</h5>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Unknown birth time: Houses and Ascendant cannot be calculated (uses noon default).</li>
              <li>Precision: ~0.1 arcseconds (Moshier) vs 0.001" (full Swiss Ephemeris).</li>
              <li>House systems: Different systems give different house cusps.</li>
              <li>AI interpretation: Based on training data, not personal consultation.</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-1">Your Rights</h5>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Export all your data as JSON anytime (Settings → Export).</li>
              <li>Delete your account and all data with one click (Settings → Delete Account).</li>
              <li>GDPR/CCPA: Request data access, correction, or deletion at any time.</li>
            </ul>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Last updated: July 2026. See <a href="/disclaimer" className="underline">Full Disclaimer</a> and <a href="/methodology" className="underline">Methodology</a>.
          </p>
        </div>
      )}
    </div>
  );
}
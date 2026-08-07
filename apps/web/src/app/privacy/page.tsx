import { Shield } from 'lucide-react';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DisclaimerBanner />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <p className="text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Information We Collect</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We collect only the information you voluntarily provide: your name, birth date, birth time, and birth location.
              This data is used solely to generate your astrological chart and interpretations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. How We Use Your Information</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Your birth data is processed on our servers to calculate planetary positions and generate interpretations.
              We do not sell, share, or monetize your personal data in any way.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. Data Storage & Security</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Your data is stored securely using Supabase with row-level security policies.
              All connections are encrypted via TLS. You can delete your account and all associated data at any time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Third-Party Services</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
              <li><strong>Supabase</strong> &mdash; Authentication and database storage</li>
              <li><strong>Vercel</strong> &mdash; Frontend hosting</li>
              <li><strong>Railway</strong> &mdash; Backend API hosting</li>
              <li><strong>Google Gemini</strong> &mdash; AI-powered interpretations (optional)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">5. Cookies & Local Storage</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We use browser local storage to maintain your login session and user preferences (such as dark mode).
              We do not use tracking cookies or analytics.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">6. Your Rights</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              You have the right to access, modify, or delete your personal data at any time.
              You can export your chart data as JSON or delete your account from the dashboard.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">7. Changes to This Policy</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We may update this policy from time to time. Any changes will be reflected on this page with an updated date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">8. Contact</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              For privacy-related questions, contact us at{' '}
              <a href="mailto:privacy@astrology-assistant.com" className="text-primary-600 dark:text-primary-400 hover:underline">
                privacy@astrology-assistant.com
              </a>.
            </p>
          </section>
        </div>
      </div>

      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Astrology Assistant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

import { FileText } from 'lucide-react';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DisclaimerBanner />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <p className="text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              By accessing or using Astrology Assistant, you agree to these Terms of Service.
              If you do not agree, please do not use the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Nature of Service</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Astrology Assistant provides astrological chart calculations and AI-generated interpretations
              for entertainment, education, and self-reflection purposes only. Our service is <strong>not</strong> a
              substitute for professional medical, financial, legal, or psychological advice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. User Accounts</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials.
              You may delete your account and all associated data at any time from the dashboard.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Prohibited Uses</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Use the service for any illegal purpose</li>
              <li>Attempt to access other users&apos; data</li>
              <li>Abuse or overload the API</li>
              <li>Resell or commercially distribute generated content</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">5. Intellectual Property</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              The chart calculations and interpretations generated for you are yours to use freely.
              The platform code and design are owned by Astrology Assistant.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">6. Limitation of Liability</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Astrology Assistant is provided &ldquo;as is&rdquo; without warranties of any kind.
              We shall not be liable for any decisions made or actions taken based on the information provided by the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">7. Changes to Terms</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of any changes.
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

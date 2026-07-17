'use client';

import { useState, useEffect } from 'react';
import { Star, Sparkles, Calendar, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { DAILY_READINGS } from '@/lib/daily-readings';

const SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'Fire', dates: 'Mar 21 - Apr 19' },
  { name: 'Taurus', symbol: '♉', element: 'Earth', dates: 'Apr 20 - May 20' },
  { name: 'Gemini', symbol: '♊', element: 'Air', dates: 'May 21 - Jun 20' },
  { name: 'Cancer', symbol: '♋', element: 'Water', dates: 'Jun 21 - Jul 22' },
  { name: 'Leo', symbol: '♌', element: 'Fire', dates: 'Jul 23 - Aug 22' },
  { name: 'Virgo', symbol: '♍', element: 'Earth', dates: 'Aug 23 - Sep 22' },
  { name: 'Libra', symbol: '♎', element: 'Air', dates: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', symbol: '♏', element: 'Water', dates: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', dates: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', symbol: '♑', element: 'Earth', dates: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', symbol: '♒', element: 'Air', dates: 'Jan 20 - Feb 18' },
  { name: 'Pisces', symbol: '♓', element: 'Water', dates: 'Feb 19 - Mar 20' },
];

const ELEMENT_COLORS: Record<string, string> = {
  Fire: 'from-red-500 to-orange-500',
  Earth: 'from-emerald-500 to-teal-500',
  Air: 'from-sky-500 to-blue-500',
  Water: 'from-indigo-500 to-purple-500',
};

const ELEMENT_BG: Record<string, string> = {
  Fire: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
  Earth: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
  Air: 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800',
  Water: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800',
};

export default function HoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('horoscope-sign');
    if (saved && DAILY_READINGS[saved]) setSelectedSign(saved);
  }, []);

  const handleSelect = (sign: string) => {
    setSelectedSign(sign);
    localStorage.setItem('horoscope-sign', sign);
  };

  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const todayStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const selectedData = selectedSign ? SIGNS.find(s => s.name === selectedSign) : null;
  const reading =
    selectedSign && DAILY_READINGS[selectedSign]
      ? DAILY_READINGS[selectedSign][(dayOfYear - 1 + 360) % 30]
      : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DisclaimerBanner />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Updated daily
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Daily Horoscope
          </h1>
          <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            {todayStr}
          </p>
        </div>

        {/* Sign Selector */}
        {!selectedSign && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-6">
              What&apos;s your zodiac sign?
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {SIGNS.map(sign => (
                <button
                  key={sign.name}
                  onClick={() => handleSelect(sign.name)}
                  className={cn(
                    'group p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900',
                    'hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-200',
                    'hover:shadow-lg hover:shadow-primary-600/10 hover:-translate-y-0.5'
                  )}
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {sign.symbol}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {sign.name}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {sign.dates}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reading */}
        {selectedSign && selectedData && reading && (
          <div className="space-y-6">
            {/* Selected sign header */}
            <div className={cn(
              'rounded-2xl border p-6 text-center',
              ELEMENT_BG[selectedData.element]
            )}>
              <div className="text-5xl mb-3">{selectedData.symbol}</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedData.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {selectedData.dates} • {selectedData.element} Sign
              </p>
              <button
                onClick={() => setSelectedSign(null)}
                className="mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Change sign
              </button>
            </div>

            {/* Today's reading */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2 rounded-lg bg-gradient-to-br text-white',
                    ELEMENT_COLORS[selectedData.element]
                  )}>
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Today&apos;s Reading
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {todayStr}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {reading}
                </p>
              </div>
            </div>

            {/* All signs quick view */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-600" />
                Quick Look — All Signs
              </h3>
              <div className="space-y-3">
                {SIGNS.map(sign => {
                  const signReading =
                    DAILY_READINGS[sign.name]?.[(dayOfYear - 1 + 360) % 30] || '';
                  const isActive = sign.name === selectedSign;
                  return (
                    <button
                      key={sign.name}
                      onClick={() => handleSelect(sign.name)}
                      className={cn(
                        'w-full text-left p-4 rounded-xl transition-colors',
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      )}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xl">{sign.symbol}</span>
                        <span className={cn(
                          'font-medium',
                          isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'
                        )}>
                          {sign.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 ml-8">
                        {signReading}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

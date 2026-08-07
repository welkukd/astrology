import Link from 'next/link';
import { Star, Globe, Compass, Circle, ArrowRightLeft, Calculator } from 'lucide-react';

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Calculation <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Methodology</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Every chart calculation is based on peer-reviewed astronomical algorithms. Here&apos;s exactly how we compute your natal chart.
          </p>
        </div>

        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <Calculator className="h-6 w-6 text-primary-600" />
              Swiss Ephemeris
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                We use <strong>flatlib</strong> with <strong>pyswisseph</strong> (Python bindings for the Swiss Ephemeris), the same calculation library used by professional astrologers worldwide. The Swiss Ephemeris was developed by Astrodienst AG and is based on the JPL Development Ephemeris (DE431), providing sub-arcsecond accuracy for planetary positions.
              </p>
              <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What this means for accuracy:</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Planetary positions accurate to within ~0.001 degrees</li>
                  <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Positions computed from the actual astronomical coordinates of the Sun, Moon, and planets</li>
                  <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Based on VSOP87 planetary theory and ELP2000 lunar theory</li>
                  <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Same engine used by professional astrological software worldwide</li>
                </ul>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mt-4">
                Unlike apps that approximate positions using simplified formulas, the Swiss Ephemeris interpolates from pre-computed ephemeris tables that cover the years 3000 BCE to 3000 CE. This means your chart is computed with the same precision as a professional astrologer&apos;s software.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <ArrowRightLeft className="h-6 w-6 text-primary-600" />
              Tropical vs Sidereal Zodiac
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
                We support both major zodiac systems. You can choose your preference when generating a chart.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">♈</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Tropical Zodiac</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    The Tropical zodiac is aligned to the seasons, not the stars. Aries begins at the March equinox (0° of the ecliptic). This is the standard system used by most Western astrologers since the 2nd century CE. It is fixed to the Earth&apos;s axial tilt.
                  </p>
                  <div className="mt-3 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm text-primary-700 dark:text-primary-300">
                    <strong>Default.</strong> Used by ~90% of Western astrologers.
                  </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🌌</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Sidereal Zodiac</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    The Sidereal zodiac is aligned to the actual constellations, accounting for the precession of the equinoxes. It uses the Fagan-Bradley ayanamsa by default. Common in Vedic (Jyotish) astrology and some Western evolutionary astrology practices.
                  </p>
                  <div className="mt-3 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-sm text-purple-700 dark:text-purple-300">
                    <strong>Optional.</strong> Requires choosing during chart creation.
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                The difference between Tropical and Sidereal is currently about 24 degrees (the ayanamsa). This means your Sun sign, rising sign, and all planetary positions will shift approximately one sign — so a Tropical Aries may correspond to a Sidereal Pisces. Neither system is &quot;more correct&quot;; they measure different things.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <Globe className="h-6 w-6 text-primary-600" />
              House Systems
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
                Houses divide the chart into 12 sectors representing different life areas. We support 22+ house systems. The most common are:
              </p>

              <div className="space-y-4">
                <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Placidus</h3>
                    <span className="px-3 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">Default</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    A time-based quadrant system that divides houses proportionally to the time it takes each sign to rise above the horizon. The most widely used house system in Western astrology. Can produce intercepted houses at extreme latitudes.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Koch</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Similar to Placidus but uses the Midheaven (MC) as the 10th house cusp anchor. Based on diurnal arc calculations. Popular among some practitioners for its emphasis on the MC.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Whole Sign</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Each house is exactly 30 degrees, beginning with the rising sign. The oldest house system, originating in Hellenistic astrology. Each sign = one house. Simple and avoids issues at high latitudes.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Equal House</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    All houses are exactly 30 degrees, starting from the Ascendant. Different from Whole Sign in that houses are anchored to the ASC degree, not the sign. Avoids intercepted signs.
                  </p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mt-6">
                We also support Alcabitius, Regiomontanus, Campanus, Porphyry, and many more. The choice of house system is a matter of personal preference and astrological tradition — there is no objectively &quot;correct&quot; system.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <Circle className="h-6 w-6 text-primary-600" />
              Aspects &amp; Orbs
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
                Aspects are angular relationships between planets. We calculate all major and minor aspects:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { name: 'Conjunction', angle: '0°', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
                  { name: 'Sextile', angle: '60°', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
                  { name: 'Square', angle: '90°', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
                  { name: 'Trine', angle: '120°', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
                  { name: 'Opposition', angle: '180°', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
                  { name: 'Quincunx', angle: '150°', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
                ].map(a => (
                  <div key={a.name} className={`p-3 rounded-xl text-center ${a.color}`}>
                    <p className="font-semibold text-sm">{a.name}</p>
                    <p className="text-xs opacity-75">{a.angle}</p>
                  </div>
                ))}
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                We calculate 44 different aspects including semisextile, sesquiquadrate, quintile, biquintile, and more. Each aspect includes its orb (how many degrees it extends beyond the exact angle) and whether it is applying or separating.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <Compass className="h-6 w-6 text-primary-600" />
              Calculation Details
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What we compute:</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> <strong>12 planets:</strong> Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, North Node, Chiron</li>
                  <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> <strong>12 houses:</strong> Placidus (default) + 21 other systems</li>
                  <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> <strong>44 aspects:</strong> Major + minor aspects with orbs</li>
                  <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> <strong>Planetary dignities:</strong> Domicile, exaltation, detriment, fall</li>
                  <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> <strong>Angles:</strong> ASC, MC, IC, DESC</li>
                  <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> <strong>Elemental balance:</strong> Fire, Earth, Air, Water distribution</li>
                </ul>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mt-6">
                All calculations are performed server-side. The browser only renders the pre-computed chart data — no astronomical calculations happen in JavaScript.
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

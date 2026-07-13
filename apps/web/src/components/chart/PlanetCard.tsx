'use client';

import { cn } from '@/lib/utils';
import { getPlanetEmoji, getSignEmoji } from '@/lib/utils';

interface PlanetCardProps {
  planet: any;
  interpretation?: { content: string; loading: boolean };
  onRequestInterpretation?: () => void;
}

export function PlanetCard({ planet, interpretation, onRequestInterpretation }: PlanetCardProps) {
  const signEmoji = getSignEmoji(planet.sign);
  const planetEmoji = getPlanetEmoji(planet.name);
  
  const elementColors: Record<string, string> = {
    Fire: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    Earth: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    Air: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Water: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{planetEmoji}</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{planet.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="text-xl">{signEmoji}</span>
                <span>{planet.sign} {planet.degree_in_sign.toFixed(1)}°</span>
                {planet.house && (
                  <>
                    <span>•</span>
                    <span>House {planet.house}</span>
                  </>
                )}
                {planet.retrograde && (
                  <>
                    <span>•</span>
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <span className="animate-spin">↻</span> Retrograde
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {planet.element && (
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', elementColors[planet.element])}>
              {planet.element}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {interpretation?.loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent"></div>
          </div>
        ) : interpretation?.content ? (
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            {interpretation.content.split('\n').map((para, i) => (
              <p key={i} className="mb-2">{para}</p>
            ))}
          </div>
        ) : (
          <button
            onClick={onRequestInterpretation}
            className="w-full py-3 px-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 text-sm font-medium transition-colors"
          >
            Get AI Interpretation
          </button>
        )}
      </div>
    </div>
  );
}
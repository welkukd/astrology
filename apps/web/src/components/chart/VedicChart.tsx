'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface VedicPlanet {
  name: string;
  sign: string;
  degree_in_sign: number;
  house?: number;
}

interface VedicChartProps {
  planets: VedicPlanet[];
  ascendant_sign: string;
  className?: string;
}

const SIGN_GRID: Record<string, { row: number; col: number }> = {
  Pisces:     { row: 0, col: 0 },
  Aries:      { row: 0, col: 1 },
  Taurus:     { row: 0, col: 2 },
  Gemini:     { row: 0, col: 3 },
  Aquarius:   { row: 1, col: 0 },
  Cancer:     { row: 1, col: 3 },
  Capricorn:  { row: 2, col: 0 },
  Leo:        { row: 2, col: 3 },
  Sagittarius:{ row: 3, col: 0 },
  Scorpio:    { row: 3, col: 1 },
  Libra:      { row: 3, col: 2 },
  Virgo:      { row: 3, col: 3 },
};

const PLANET_ABBR: Record<string, string> = {
  Sun: 'Su',
  Moon: 'Mo',
  Mercury: 'Me',
  Venus: 'Ve',
  Mars: 'Ma',
  Jupiter: 'Ju',
  Saturn: 'Sa',
  Uranus: 'Ur',
  Neptune: 'Ne',
  Pluto: 'Pl',
  Rahu: 'Ra',
  Ketu: 'Ch',
};

const SIGN_LABELS: Record<string, string> = {
  Pisces: 'Pi', Aries: 'Ar', Taurus: 'Ta', Gemini: 'Ge',
  Aquarius: 'Aq', Cancer: 'Ca', Capricorn: 'Cp', Leo: 'Le',
  Sagittarius: 'Sg', Scorpio: 'Sc', Libra: 'Li', Virgo: 'Vi',
};

const SIGN_BG = '#f8fafc';
const BORDER_COLOR = '#cbd5e1';
const ASC_COLOR = '#dc2626';

export function VedicChart({ planets, ascendant_sign, className }: VedicChartProps) {
  const size = 400;
  const cellSize = size / 4;

  const planetsBySign: Record<string, VedicPlanet[]> = {};
  for (const p of planets) {
    const sign = p.sign;
    if (!planetsBySign[sign]) planetsBySign[sign] = [];
    planetsBySign[sign].push(p);
  }

  const signOrder = [
    ['Pisces', 'Aries', 'Taurus', 'Gemini'],
    ['Aquarius', null, null, 'Cancer'],
    ['Capricorn', null, null, 'Leo'],
    ['Sagittarius', 'Scorpio', 'Libra', 'Virgo'],
  ];

  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="w-full h-auto"
      >
        {signOrder.map((row, ri) =>
          row.map((sign, ci) => {
            if (!sign) return null;

            const x = ci * cellSize;
            const y = ri * cellSize;
            const isAsc = sign === ascendant_sign;
            const cellPlanets = planetsBySign[sign] || [];

            return (
              <g key={sign}>
                <rect
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  fill={isAsc ? '#fef2f2' : SIGN_BG}
                  stroke={isAsc ? ASC_COLOR : BORDER_COLOR}
                  strokeWidth={isAsc ? 2 : 1}
                />

                <text
                  x={x + 4}
                  y={y + 12}
                  fontSize={9}
                  fill={isAsc ? ASC_COLOR : '#94a3b8'}
                  fontWeight={isAsc ? 700 : 400}
                >
                  {SIGN_LABELS[sign]}
                </text>

                {cellPlanets.map((planet, pi) => {
                  const px = x + 8;
                  const py = y + cellSize - 14 - pi * 16;
                  const abbr = PLANET_ABBR[planet.name] || planet.name.slice(0, 2);

                  return (
                    <text
                      key={planet.name}
                      x={px}
                      y={py}
                      fontSize={12}
                      fontWeight={600}
                      fill="#1e293b"
                    >
                      {abbr}
                      <tspan fontSize={8} fill="#64748b">
                        {Math.floor(planet.degree_in_sign)}°
                      </tspan>
                    </text>
                  );
                })}

                {isAsc && (
                  <text
                    x={x + cellSize - 4}
                    y={y + 12}
                    fontSize={8}
                    fill={ASC_COLOR}
                    textAnchor="end"
                    fontWeight={700}
                  >
                    ASC
                  </text>
                )}
              </g>
            );
          })
        )}

        <line x1={0} y1={cellSize} x2={size} y2={cellSize} stroke={BORDER_COLOR} strokeWidth={1} />
        <line x1={0} y1={cellSize * 2} x2={size} y2={cellSize * 2} stroke={BORDER_COLOR} strokeWidth={1} />
        <line x1={0} y1={cellSize * 3} x2={size} y2={cellSize * 3} stroke={BORDER_COLOR} strokeWidth={1} />
        <line x1={cellSize} y1={0} x2={cellSize} y2={size} stroke={BORDER_COLOR} strokeWidth={1} />
        <line x1={cellSize * 2} y1={0} x2={cellSize * 2} y2={size} stroke={BORDER_COLOR} strokeWidth={1} />
        <line x1={cellSize * 3} y1={0} x2={cellSize * 3} y2={size} stroke={BORDER_COLOR} strokeWidth={1} />
      </svg>
    </div>
  );
}

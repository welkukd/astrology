'use client';

import React from 'react';

interface ChartWheelProps {
  planets: Array<{
    name: string;
    longitude: number;
    sign: string;
    degree_in_sign: number;
    house: number;
    retrograde?: boolean;
  }>;
  houses: Array<{
    number: number;
    longitude: number;
    sign: string;
    degree_in_sign: number;
  }>;
  aspects: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
  }>;
}

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
  'North Node': '☊',
  Chiron: '⚷',
};

const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const SIGN_ELEMENT_COLORS: Record<string, string> = {
  Fire: '#dc2626',
  Earth: '#16a34a',
  Air: '#ca8a04',
  Water: '#2563eb',
};

function getElement(signIndex: number): string {
  const elements = ['Fire', 'Earth', 'Air', 'Water'];
  return elements[signIndex % 4];
}

const ASPECT_COLORS: Record<string, string> = {
  Conjunction: '#9333ea',
  Sextile: '#22c55e',
  Square: '#f97316',
  Trine: '#3b82f6',
  Opposition: '#ef4444',
};

const CENTER = 250;
const OUTER_R = 230;
const SIGN_INNER_R = 180;
const PLANET_R = 155;
const HOUSE_LINE_INNER_R = 130;
const SIZE = 500;

function polarToCartesian(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function arcPath(startAngle: number, endAngle: number, outerR: number, innerR: number): string {
  const startOuter = polarToCartesian(startAngle, outerR);
  const endOuter = polarToCartesian(endAngle, outerR);
  const startInner = polarToCartesian(startAngle, innerR);
  const endInner = polarToCartesian(endAngle, innerR);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${startInner.x} ${startInner.y}`,
    `L ${startOuter.x} ${startOuter.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}`,
    'Z',
  ].join(' ');
}

export function ChartWheel({ planets, houses, aspects }: ChartWheelProps) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full h-auto max-w-[500px]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="chart-clip">
          <circle cx={CENTER} cy={CENTER} r={OUTER_R} />
        </clipPath>
      </defs>

      <circle cx={CENTER} cy={CENTER} r={OUTER_R} fill="#fafafa" stroke="#d1d5db" strokeWidth={1.5} />
      <circle cx={CENTER} cy={CENTER} r={SIGN_INNER_R} fill="white" stroke="#d1d5db" strokeWidth={1} />

      {SIGN_SYMBOLS.map((symbol, i) => {
        const startAngle = i * 30;
        const endAngle = startAngle + 30;
        const midAngle = startAngle + 15;
        const element = getElement(i);
        const labelPos = polarToCartesian(midAngle, (OUTER_R + SIGN_INNER_R) / 2);

        return (
          <g key={`sign-${i}`}>
            <path
              d={arcPath(startAngle, endAngle, OUTER_R, SIGN_INNER_R)}
              fill="white"
              stroke="#e5e7eb"
              strokeWidth={0.5}
            />
            <text
              x={labelPos.x}
              y={labelPos.y - 4}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={20}
              fill={SIGN_ELEMENT_COLORS[element]}
            >
              {symbol}
            </text>
            <text
              x={labelPos.x}
              y={labelPos.y + 16}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={7}
              fill="#9ca3af"
              fontWeight={500}
            >
              {SIGN_NAMES[i].slice(0, 3).toUpperCase()}
            </text>
          </g>
        );
      })}

      {houses.map((house) => {
        const angle = house.longitude;
        const innerPt = polarToCartesian(angle, SIGN_INNER_R);
        const outerPt = polarToCartesian(angle, HOUSE_LINE_INNER_R);
        const labelPt = polarToCartesian(angle, HOUSE_LINE_INNER_R - 14);

        return (
          <g key={`house-${house.number}`}>
            <line
              x1={innerPt.x}
              y1={innerPt.y}
              x2={outerPt.x}
              y2={outerPt.y}
              stroke="#9ca3af"
              strokeWidth={1.5}
              strokeDasharray="4,3"
            />
            <text
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={9}
              fill="#6b7280"
              fontWeight={600}
            >
              {house.number}
            </text>
          </g>
        );
      })}

      {aspects.map((aspect) => {
        const p1 = planets.find((p) => p.name === aspect.planet1);
        const p2 = planets.find((p) => p.name === aspect.planet2);
        if (!p1 || !p2) return null;

        const pos1 = polarToCartesian(p1.longitude, PLANET_R);
        const pos2 = polarToCartesian(p2.longitude, PLANET_R);
        const color = ASPECT_COLORS[aspect.aspect] || '#9ca3af';

        return (
          <line
            key={`${aspect.planet1}-${aspect.planet2}-${aspect.aspect}`}
            x1={pos1.x}
            y1={pos1.y}
            x2={pos2.x}
            y2={pos2.y}
            stroke={color}
            strokeWidth={1}
            strokeDasharray={aspect.orb > 5 ? '3,3' : 'none'}
            opacity={0.5}
          />
        );
      })}

      {planets.map((planet) => {
        const angle = planet.longitude;
        const pos = polarToCartesian(angle, PLANET_R);
        const symbol = PLANET_SYMBOLS[planet.name] || planet.name[0];

        return (
          <g key={planet.name}>
            <circle cx={pos.x} cy={pos.y} r={14} fill="white" stroke="#d1d5db" strokeWidth={1} />
            <text
              x={pos.x}
              y={pos.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={16}
              fill="#1f2937"
            >
              {symbol}
            </text>
            {planet.retrograde && (
              <text
                x={pos.x + 10}
                y={pos.y - 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={7}
                fill="#dc2626"
                fontWeight={700}
              >
                R
              </text>
            )}
          </g>
        );
      })}

      <circle cx={CENTER} cy={CENTER} r={3} fill="#6b7280" />

      <g>
        {[
          { label: 'Conjunction', color: ASPECT_COLORS.Conjunction },
          { label: 'Sextile', color: ASPECT_COLORS.Sextile },
          { label: 'Square', color: ASPECT_COLORS.Square },
          { label: 'Trine', color: ASPECT_COLORS.Trine },
          { label: 'Opposition', color: ASPECT_COLORS.Opposition },
        ].map((item, i) => (
          <g key={item.label} transform={`translate(${CENTER - 80 + i * 36}, ${SIZE - 16})`}>
            <line x1={0} y1={0} x2={12} y2={0} stroke={item.color} strokeWidth={2} />
          </g>
        ))}
        <text x={CENTER - 80 - 4} y={SIZE - 13} textAnchor="end" fontSize={6} fill="#9ca3af">
        </text>
        <text x={CENTER - 80 + 5 * 36 + 4} y={SIZE - 13} textAnchor="start" fontSize={6} fill="#9ca3af">
        </text>
      </g>
    </svg>
  );
}

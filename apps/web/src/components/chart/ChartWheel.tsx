'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getSignEmoji, getPlanetEmoji } from '@/lib/utils';

interface ChartWheelProps {
  planets: any[];
  houses: any[];
  aspects: any[];
  className?: string;
  size?: number;
}

const SIGN_COLORS = [
  '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF',
  '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF',
  '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF',
];

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export function ChartWheel({ planets, houses, aspects, className, size = 400 }: ChartWheelProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: size, height: size });

  useEffect(() => {
    if (svgRef.current) {
      const bbox = svgRef.current.getBoundingClientRect();
      setDimensions({ width: bbox.width, height: bbox.height });
    }
  }, []);

  const radius = Math.min(dimensions.width, dimensions.height) / 2 - 20;
  const center = { x: dimensions.width / 2, y: dimensions.height / 2 };

  const polarToCartesian = (angle: number, r: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: center.x + r * Math.cos(rad),
      y: center.y + r * Math.sin(rad),
    };
  };

  const drawSignWheel = () => {
    const signs: React.ReactNode[] = [];
    for (let i = 0; i < 12; i++) {
      const startAngle = i * 30;
      const endAngle = (i + 1) * 30;
      const midAngle = startAngle + 15;
      
      const outerR = radius;
      const innerR = radius * 0.65;
      
      const start = polarToCartesian(startAngle, outerR);
      const end = polarToCartesian(endAngle, outerR);
      const innerStart = polarToCartesian(startAngle, innerR);
      const innerEnd = polarToCartesian(endAngle, innerR);
      
      const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
      
      signs.push(
        <path
          key={i}
          d={`M ${innerStart.x} ${innerStart.y} L ${start.x} ${start.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${end.x} ${end.y} L ${innerEnd.x} ${innerEnd.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y} Z`}
          fill={SIGN_COLORS[i]}
          opacity={0.3}
          stroke="#fff"
          strokeWidth={1}
        />
      );
      
      const labelPos = polarToCartesian(midAngle, radius * 0.82);
      signs.push(
        <text
          key={`label-${i}`}
          x={labelPos.x}
          y={labelPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fontWeight={600}
          fill="#374151"
          transform={`rotate(${midAngle} ${labelPos.x} ${labelPos.y})`}
        >
          {getSignEmoji(SIGN_NAMES[i])} {SIGN_NAMES[i].slice(0,3)}
        </text>
      );
    }
    return signs;
  };

  const drawHouses = () => {
    const houseLines: React.ReactNode[] = [];
    houses.forEach((house, i) => {
      const angle = house.longitude;
      const innerR = radius * 0.65;
      const outerR = radius;
      
      const inner = polarToCartesian(angle, innerR);
      const outer = polarToCartesian(angle, outerR);
      
      houseLines.push(
        <line
          key={i}
          x1={inner.x}
          y1={inner.y}
          x2={outer.x}
          y2={outer.y}
          stroke="#9ca3af"
          strokeWidth={1.5}
          strokeDasharray="4,4"
          opacity={0.7}
        />
      );
      
      const labelPos = polarToCartesian(angle, radius * 0.55);
      houseLines.push(
        <text
          key={`house-label-${i}`}
          x={labelPos.x}
          y={labelPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fontWeight={600}
          fill="#6b7280"
        >
          H{house.number}
        </text>
      );
    });
    return houseLines;
  };

  const drawPlanets = () => {
    return planets.map((planet) => {
      const angle = planet.longitude;
      const r = radius * 0.78;
      const pos = polarToCartesian(angle, r);
      
      return (
        <g key={planet.name} transform={`translate(${pos.x}, ${pos.y})`}>
          <circle
            r={16}
            fill="#fff"
            stroke="#e5e7eb"
            strokeWidth={1.5}
          />
          <text
            x={0}
            y={4}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={18}
          >
            {getPlanetEmoji(planet.name)}
          </text>
          <text
            x={0}
            y={22}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={8}
            fill="#6b7280"
          >
            {planet.sign.slice(0,3)} {planet.degree_in_sign.toFixed(1)}°
          </text>
          {planet.house && (
            <text
              x={0}
              y={32}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={7}
              fill="#9ca3af"
            >
              H{planet.house}
            </text>
          )}
        </g>
      );
    });
  };

  const drawAspects = () => {
    const aspectLines: React.ReactNode[] = [];
    aspects.forEach((aspect) => {
      const p1 = planets.find(p => p.name === aspect.planet1);
      const p2 = planets.find(p => p.name === aspect.planet2);
      if (!p1 || !p2) return;
      
      const pos1 = polarToCartesian(p1.longitude, radius * 0.78);
      const pos2 = polarToCartesian(p2.longitude, radius * 0.78);
      
      const color = aspectColors[aspect.aspect] || '#9ca3af';
      
      aspectLines.push(
        <line
          key={`${aspect.planet1}-${aspect.planet2}`}
          x1={pos1.x}
          y1={pos1.y}
          x2={pos2.x}
          y2={pos2.y}
          stroke={color}
          strokeWidth={aspect.applying ? 2 : 1}
          strokeDasharray={aspect.applying ? 'none' : '3,3'}
          opacity={0.6}
        />
      );
    });
    return aspectLines;
  };

  const aspectColors: Record<string, string> = {
    conjunction: '#ef4444',
    opposition: '#f97316',
    trine: '#22c55e',
    square: '#ef4444',
    sextile: '#3b82f6',
    quincunx: '#a855f7',
    semisextile: '#ec4899',
    semisquare: '#f97316',
    sesquiquadrate: '#a855f7',
  };

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="max-w-full h-auto"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <circle
          cx={center.x}
          cy={center.y}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={2}
        />
        
        <circle
          cx={center.x}
          cy={center.y}
          r={radius * 0.65}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={1}
        />
        
        {drawSignWheel()}
        {drawHouses()}
        {drawAspects()}
        {drawPlanets()}
        
        <circle
          cx={center.x}
          cy={center.y}
          r={4}
          fill="#6b7280"
        />
      </svg>
      
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-center gap-2 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Square/Opp</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> Trine</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Sextile</span>
        <span className="flex items-center gap-1 border-b border-dotted border-gray-400"></span> Applying
        <span className="flex items-center gap-1 border-b border-dashed border-gray-400"></span> Separating
      </div>
    </div>
  );
}
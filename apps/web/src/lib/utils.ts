import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function getSignEmoji(sign: string): string {
  const emojis: Record<string, string> = {
    Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
    Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
    Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
  };
  return emojis[sign] || '';
}

export function getPlanetEmoji(planet: string): string {
  const emojis: Record<string, string> = {
    Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀',
    Mars: '♂', Jupiter: '♃', Saturn: '♄', Uranus: '⛢',
    Neptune: '♆', Pluto: '♇', Chiron: '⚷', 'North Node': '☊',
  };
  return emojis[planet] || '';
}
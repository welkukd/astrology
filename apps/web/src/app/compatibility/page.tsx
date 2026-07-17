'use client';

import { useState } from 'react';
import {
  Heart,
  Sparkles,
  Star,
  Sun,
  Moon,
  Flame,
  Droplets,
  Leaf,
  Wind,
  ChevronDown,
  ChevronRight,
  Loader2,
  Users,
  Zap,
  MessageSquare,
  Scale,
  Shield,
} from 'lucide-react';
import { cn, getSignEmoji } from '@/lib/utils';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';

// ---------------------------------------------------------------------------
// Zodiac sign calculation from birth date
// ---------------------------------------------------------------------------
const SIGNS = [
  { name: 'Aries', start: [3, 21], end: [4, 19], element: 'Fire' },
  { name: 'Taurus', start: [4, 20], end: [5, 20], element: 'Earth' },
  { name: 'Gemini', start: [5, 21], end: [6, 20], element: 'Air' },
  { name: 'Cancer', start: [6, 21], end: [7, 22], element: 'Water' },
  { name: 'Leo', start: [7, 23], end: [8, 22], element: 'Fire' },
  { name: 'Virgo', start: [8, 23], end: [9, 22], element: 'Earth' },
  { name: 'Libra', start: [9, 23], end: [10, 22], element: 'Air' },
  { name: 'Scorpio', start: [10, 23], end: [11, 21], element: 'Water' },
  { name: 'Sagittarius', start: [11, 22], end: [12, 21], element: 'Fire' },
  { name: 'Capricorn', start: [12, 22], end: [1, 19], element: 'Earth' },
  { name: 'Aquarius', start: [1, 20], end: [2, 18], element: 'Air' },
  { name: 'Pisces', start: [2, 19], end: [3, 20], element: 'Water' },
];

function getSunSign(dateStr: string): string {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  for (const sign of SIGNS) {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    if (sm <= em) {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return sign.name;
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return sign.name;
    }
  }
  return 'Pisces';
}

function getElement(sign: string): string {
  return SIGNS.find(s => s.name === sign)?.element || '';
}

function getModality(sign: string): string {
  const modalities: Record<string, string> = {
    Aries: 'Cardinal', Leo: 'Fixed', Sagittarius: 'Mutable',
    Taurus: 'Fixed', Virgo: 'Mutable', Capricorn: 'Cardinal',
    Gemini: 'Mutable', Libra: 'Cardinal', Aquarius: 'Fixed',
    Cancer: 'Cardinal', Scorpio: 'Fixed', Pisces: 'Mutable',
  };
  return modalities[sign] || '';
}

// ---------------------------------------------------------------------------
// Compatibility scoring
// ---------------------------------------------------------------------------
const ELEMENT_HARMONY: Record<string, number> = {
  'Fire-Fire': 82, 'Earth-Earth': 85, 'Air-Air': 80, 'Water-Water': 88,
  'Fire-Air': 90, 'Air-Fire': 90,
  'Earth-Water': 87, 'Water-Earth': 87,
  'Fire-Earth': 65, 'Earth-Fire': 65,
  'Fire-Water': 50, 'Water-Fire': 50,
  'Air-Earth': 60, 'Earth-Air': 60,
  'Air-Water': 55, 'Water-Air': 55,
};

const ELEMENT_NAMES: Record<string, string> = {
  Fire: 'Fire (passion, energy, action)',
  Earth: 'Earth (stability, practicality, grounding)',
  Air: 'Air (intellect, communication, ideas)',
  Water: 'Water (emotion, intuition, depth)',
};

const ELEMENT_ICON: Record<string, any> = {
  Fire: Flame, Earth: Leaf, Air: Wind, Water: Droplets,
};

function computeScore(signA: string, signB: string): number {
  const eA = getElement(signA);
  const eB = getElement(signB);
  const key = `${eA}-${eB}`;
  return ELEMENT_HARMONY[key] || 70;
}

// ---------------------------------------------------------------------------
// Pre-written interpretations
// ---------------------------------------------------------------------------
interface CompatibilityReading {
  sections: ReadingSection[];
}

type ReadingSection = {
  title: string;
  content: string;
  icon: string;
};

function generateReading(
  nameA: string, signA: string,
  nameB: string, signB: string,
  score: number,
  dateA: string, dateB: string,
  timeUnknownA: boolean, timeUnknownB: boolean,
  locationA: string, locationB: string,
): CompatibilityReading {
  const eA = getElement(signA);
  const eB = getElement(signB);
  const key = `${eA}-${eB}`;
  const mA = getModality(signA);
  const mB = getModality(signB);

  const sections: ReadingSection[] = [];

  // --- Score overview ---
  let scoreLabel: string;
  let scoreColor: string;
  if (score >= 85) { scoreLabel = 'Soulmate Potential'; scoreColor = 'high'; }
  else if (score >= 70) { scoreLabel = 'Strong Connection'; scoreColor = 'good'; }
  else if (score >= 55) { scoreLabel = 'Interesting Dynamic'; scoreColor = 'moderate'; }
  else { scoreLabel = 'Growth Opportunity'; scoreColor = 'challenging'; }

  sections.push({
    title: `Overall Compatibility: ${score}/100 — ${scoreLabel}`,
    content: `${nameA} (${signA}) and ${nameB} (${signB}) share a ${scoreLabel.toLowerCase()} in their astrological connection. With a combined score of ${score} out of 100, this pairing ${score >= 70 ? 'naturally complements' : 'brings both excitement and learning opportunities for'} each other.

${nameA}'s ${signA} energy (${eA}) meets ${nameB}'s ${signB} energy (${eB}), creating a dynamic that ${key.includes('Fire') || key.includes('Air') ? 'fizzles with intellectual and creative火花' : 'deepens through shared emotional and practical understanding'}.

This is a fun, lighthearted snapshot of zodiac compatibility. Real connection depends on communication, effort, trust, and shared values — no stars can predict the full story of two people.`,
    icon: 'sparkles',
  });

  // --- Sun sign match ---
  sections.push({
    title: 'Sun Sign Match',
    content: `${nameA}'s Sun in ${signA} ${getSignEmoji(signA)} meets ${nameB}'s Sun in ${signB} ${getSignEmoji(signB)}.

${signA} is a ${mA} ${eA} sign — ${eA === 'Fire' ? 'driven by passion, spontaneity, and a desire to lead' : eA === 'Earth' ? 'grounded in practicality, patience, and building lasting value' : eA === 'Air' ? 'fueled by ideas, communication, and social connection' : 'guided by emotion, intuition, and deep empathy'}.

${signB} is a ${mB} ${eB} sign — ${eB === 'Fire' ? 'bringing warmth, enthusiasm, and a bold spirit' : eB === 'Earth' ? 'offering stability, reliability, and a down-to-earth approach' : eB === 'Air' ? 'contributing wit, perspective, and intellectual curiosity' : 'providing emotional depth, sensitivity, and nurturing care'}.

${eA === eB
  ? `Both being ${eA} signs, ${nameA} and ${nameB} share a natural understanding of each other's core drives. You speak the same elemental language, which creates an easy, intuitive bond.`
  : `As different elements, ${nameA} and ${nameB} bring complementary energies to the relationship. Where one is strong, the other fills in — creating a balanced and potentially enriching dynamic.`}`,
    icon: 'sun',
  });

  // --- Element harmony ---
  sections.push({
    title: 'Element Harmony',
    content: `Element pair: ${eA} + ${eB}

${ELEMENT_NAMES[eA]}
${ELEMENT_NAMES[eB]}

${key.includes('Fire') && key.includes('Air')
  ? "Fire and Air is one of the most naturally harmonious combinations. Air feeds Fire's flames, creating an exciting, stimulating connection full of ideas and action."
  : key.includes('Earth') && key.includes('Water')
  ? "Earth and Water create a deeply nurturing bond. Water nourishes Earth, and Earth provides structure for Water's emotions — a grounding, nurturing pairing."
  : eA === eB
  ? `Two ${eA} signs understand each other deeply. The challenge is avoiding stagnation or becoming too insular. Keep growing together by embracing new experiences.`
  : (key === 'Fire-Earth' || key === 'Earth-Fire')
  ? "Fire and Earth can be tricky — Fire's impulsiveness clashes with Earth's caution. But when balanced, Fire brings excitement while Earth brings grounding. Patience is key."
  : (key === 'Fire-Water' || key === 'Water-Fire')
  ? "Fire and Water is the most volatile combination — passion meets emotion. When it works, it's intensely transformative. When it doesn't, it can be turbulent. Communication is everything."
  : (key === 'Air-Earth' || key === 'Air-Water' || key === 'Earth-Air' || key === 'Water-Air')
  ? "This pairing requires the most conscious effort. Air's need for freedom can feel threatening to Earth/Water's need for security. But with respect for differences, you can learn enormously from each other."
  : "This elemental combination offers growth through understanding. Your differences are your greatest teachers — embrace them with curiosity and compassion."}`,
    icon: 'flame',
  });

  // --- Relationship strengths ---
  const strengths: string[] = [];
  if (eA === eB) {
    strengths.push(`Natural understanding — you both process the world similarly`);
    strengths.push(`Shared values and priorities come naturally`);
    strengths.push(`Easy emotional shorthand; less need to explain your perspective`);
  } else {
    strengths.push(`Complementary strengths — where one is weak, the other shines`);
    strengths.push(`Broadened perspectives from different elemental approaches`);
    strengths.push(`Dynamic energy that keeps the relationship from becoming stale`);
  }
  if (mA === mB) {
    strengths.push(`Same modality (${mA}) means similar pace and approach to life`);
  } else {
    strengths.push(`Different modalities create a balanced rhythm — one initiates, one stabilizes`);
  }

  sections.push({
    title: 'Relationship Strengths',
    content: `Here's what makes ${nameA} and ${nameB}'s connection special:

${strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

${score >= 80
  ? "Your natural compatibility gives you a strong foundation. Lean into what works and don't take the ease for granted."
  : "While some things require more effort, the areas where you naturally connect are genuinely meaningful. Build on those foundations."}`,
    icon: 'heart',
  });

  // --- Relationship challenges ---
  const challenges: string[] = [];
  if (eA === eB) {
    challenges.push(`Being too similar may lead to blind spots — you might reinforce each other's limitations`);
    challenges.push(`Competition can arise when both want the same things`);
  } else {
    challenges.push(`Different communication styles may lead to misunderstandings`);
    challenges.push(`One person's pace may feel too fast or too slow for the other`);
  }
  if (mA !== mB) {
    challenges.push(`Different modality timing — one of you acts while the other reflects`);
  }
  if (score < 70) {
    challenges.push(`Requires more conscious communication and patience than naturally harmonious pairings`);
  }

  sections.push({
    title: 'Relationship Challenges',
    content: `Every pairing has areas for growth. Here's what ${nameA} and ${nameB} may navigate:

${challenges.map((s, i) => `${i + 1}. ${s}`).join('\n')}

These aren't dealbreakers — they're invitations to grow together. Awareness of these dynamics is the first step to transforming challenges into strengths.`,
    icon: 'shield',
  });

  // --- Overall vibe ---
  sections.push({
    title: 'Overall Vibe',
    content: `${nameA} and ${nameB} have the ${scoreLabel.toLowerCase()} — a ${score >= 80 ? 'vibrant' : score >= 65 ? 'thoughtful' : 'intriguing'} connection that ${score >= 80 ? 'flows naturally' : 'rewards intentional effort'}.

${score >= 85
  ? "This is the kind of pairing that feels like coming home. You instinctively understand each other's needs and rhythms. Don't let familiarity breed complacency — keep choosing each other."
  : score >= 70
  ? "A solid, meaningful connection with room to deepen. Your differences add spice while your common ground provides stability. This is sustainable, real love territory."
  : score >= 55
  ? "An interesting dynamic that keeps you both on your toes. There's real potential here, but it requires both people to meet halfway. The growth this pairing offers is its greatest gift."
  : "This pairing is a wild card — intense, unpredictable, and potentially transformative. It won't be boring, but it demands emotional maturity and clear communication from both sides."}`,
    icon: 'zap',
  });

  // --- Advice ---
  sections.push({
    title: 'Advice for the Couple',
    content: `${getAdvice(signA, signB, eA, eB, score)}

General guidance for ${nameA} and ${nameB}:

1. Communicate openly — especially when your natural styles differ
2. Celebrate your differences as strengths, not obstacles
3. Create shared rituals that honor both of your elemental needs
4. Give each other space to be authentic in your own sign's energy
5. Remember: astrology is a lens, not a limit. Your relationship is written by both of you.`,
    icon: 'message',
  });

  return { sections };
}

function getAdvice(signA: string, signB: string, eA: string, eB: string, score: number): string {
  if (eA === 'Fire' && eB === 'Fire') {
    return `Two Fire signs together can be explosive — in the best and worst ways. Channel your shared passion into joint projects and adventures. Watch out for power struggles: take turns leading, and remember that vulnerability is not weakness. Your greatest strength is your combined enthusiasm — use it to uplift each other.`;
  }
  if (eA === 'Earth' && eB === 'Earth') {
    return `Two Earth signs create a rock-solid foundation. Your shared love of stability and routine is a gift. The challenge is breaking out of comfort zones together — try new experiences, be spontaneous, and don't let practicality eclipse romance. Your patience with each other is your superpower.`;
  }
  if (eA === 'Air' && eB === 'Air') {
    return `Two Air signs spark incredible intellectual chemistry. Conversations flow endlessly and ideas multiply. The gap to bridge is emotional depth — don't let everything stay in the head. Practice being present, feeling feelings, and grounding your brilliant ideas in tangible actions together.`;
  }
  if (eA === 'Water' && eB === 'Water') {
    return `Two Water signs share an almost psychic emotional bond. You intuitively understand each other's depths. The risk is drowning in shared emotion or becoming codependent. Maintain individual identities, pursue separate interests, and create emotional anchors outside the relationship.`;
  }
  if ((eA === 'Fire' && eB === 'Air') || (eA === 'Air' && eB === 'Fire')) {
    return `Fire and Air is nature's perfect teamwork. Air feeds Fire's passion with ideas and perspective. Fire inspires Air to take action on their thoughts. Keep stimulating each other intellectually and don't shy away from heated debates — they're your foreplay. Just remember to slow down sometimes and simply be together.`;
  }
  if ((eA === 'Earth' && eB === 'Water') || (eA === 'Water' && eB === 'Earth')) {
    return `Earth and Water create a garden together. Water's emotions are nourished by Earth's stability, and Earth finds meaning in Water's depth. Protect this gentle dynamic: don't let Earth become too rigid or Water too overwhelming. Your natural nurturing ability is your relationship's greatest asset.`;
  }
  return `This pairing asks both of you to stretch beyond your comfort zones. That's not a flaw — it's where the real growth happens. Lead with curiosity, not judgment. Ask "help me understand" more often than "why don't you...". Your differences, when honored, become your greatest teachers.`;
}

// ---------------------------------------------------------------------------
// UI Components
// ---------------------------------------------------------------------------
const SECTION_ICONS: Record<string, any> = {
  sparkles: Sparkles, sun: Sun, flame: Flame, heart: Heart,
  shield: Shield, zap: Zap, message: MessageSquare,
};

function SectionCard({ section }: { section: ReadingSection }) {
  const [expanded, setExpanded] = useState(true);
  const key = section.title.toLowerCase().split(':')[0].split(' ')[0];
  const Icon = SECTION_ICONS[section.icon] || SECTION_ICONS[key] || Sparkles;
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
          <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="flex-1 font-semibold text-gray-900 dark:text-white">{section.title}</h3>
        {expanded ? (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {expanded && (
        <div className="px-5 pb-5 pt-0">
          <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
            {section.content}
          </div>
        </div>
      )}
    </div>
  );
}

function PersonForm({
  label,
  data,
  onChange,
}: {
  label: string;
  data: { name: string; date: string; time: string; timeUnknown: boolean; location: string };
  onChange: (d: typeof data) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Users className="h-5 w-5 text-primary-600" />
        {label}
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
        <input
          type="text"
          value={data.name}
          onChange={e => onChange({ ...data, name: e.target.value })}
          placeholder={`Enter ${label.toLowerCase()} name`}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
        <input
          type="date"
          value={data.date}
          onChange={e => onChange({ ...data, date: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time of Birth</label>
          <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={data.timeUnknown}
              onChange={e => onChange({ ...data, timeUnknown: e.target.checked, time: e.target.checked ? '' : data.time })}
              className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
            />
            Unknown
          </label>
        </div>
        <input
          type="time"
          value={data.time}
          onChange={e => onChange({ ...data, time: e.target.value })}
          disabled={data.timeUnknown}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Birth Location</label>
        <input
          type="text"
          value={data.location}
          onChange={e => onChange({ ...data, location: e.target.value })}
          placeholder="e.g., Mumbai, India"
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

function ScoreBadge({ score, label }: { score: number; label: string }) {
  let color: string;
  if (score >= 85) color = 'from-emerald-500 to-green-600';
  else if (score >= 70) color = 'from-blue-500 to-indigo-600';
  else if (score >= 55) color = 'from-amber-500 to-orange-600';
  else color = 'from-rose-500 to-red-600';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn('w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold bg-gradient-to-br shadow-lg', color)}>
        {score}
      </div>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function CompatibilityPage() {
  const [personA, setPersonA] = useState({ name: '', date: '', time: '', timeUnknown: true, location: '' });
  const [personB, setPersonB] = useState({ name: '', date: '', time: '', timeUnknown: true, location: '' });
  const [reading, setReading] = useState<CompatibilityReading | null>(null);
  const [loading, setLoading] = useState(false);

  const canCompare = personA.date && personB.date;

  const handleCompare = () => {
    if (!canCompare) return;
    setLoading(true);
    setTimeout(() => {
      const signA = getSunSign(personA.date);
      const signB = getSunSign(personB.date);
      const score = computeScore(signA, signB);
      const result = generateReading(
        personA.name || 'Person A', signA,
        personB.name || 'Person B', signB,
        score,
        personA.date, personB.date,
        personA.timeUnknown, personB.timeUnknown,
        personA.location, personB.location,
      );
      setReading(result);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DisclaimerBanner />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Heart className="h-8 w-8 text-pink-500" />
            Compatibility Reading
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Compare two birth charts to discover zodiac compatibility, elemental harmony, and relationship insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <PersonForm label="Person A" data={personA} onChange={setPersonA} />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <PersonForm label="Person B" data={personB} onChange={setPersonB} />
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleCompare}
            disabled={!canCompare || loading}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-primary-600 text-white rounded-xl hover:from-pink-600 hover:to-primary-700 transition-all font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            {loading ? 'Calculating...' : 'Compare'}
          </button>
        </div>

        {reading && (
          <div className="space-y-6">
            {/* Quick sign summary */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{personA.name || 'Person A'}</p>
                  <p className="text-3xl mt-1">{getSignEmoji(getSunSign(personA.date))}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{getSunSign(personA.date)}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{getElement(getSunSign(personA.date))}</p>
                </div>
                <div className="flex justify-center">
                  <ScoreBadge score={computeScore(getSunSign(personA.date), getSunSign(personB.date))} label="Compatibility" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{personB.name || 'Person B'}</p>
                  <p className="text-3xl mt-1">{getSignEmoji(getSunSign(personB.date))}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{getSunSign(personB.date)}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{getElement(getSunSign(personB.date))}</p>
                </div>
              </div>
            </div>

            {/* Interpretation sections */}
            <div className="space-y-4">
              {reading.sections.map((section, i) => (
                <SectionCard key={i} section={section} />
              ))}
            </div>
          </div>
        )}

        {!reading && !loading && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Enter birth details for two people and click Compare</p>
            <p className="text-sm mt-1">to discover your zodiac compatibility</p>
          </div>
        )}
      </div>
    </div>
  );
}

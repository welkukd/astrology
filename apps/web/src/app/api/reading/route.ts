import { NextRequest, NextResponse } from 'next/server';

const BACKEND = (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('your-backend'))
  ? process.env.NEXT_PUBLIC_API_URL
  : 'https://astrology-api-production-813b.up.railway.app';

const GEMINI_KEY = process.env.GEMINI_API_KEY;

function getAccessToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return null;
}

function chartSummary(chart: any): string {
  const planets = chart.planets || [];
  const houses = chart.houses || [];
  const aspects = chart.aspects || [];
  const subject = chart.subject || {};
  const vedic = chart.vedic || {};

  const lines = [
    `Name: ${subject.name || 'Unknown'}`,
    `Date: ${subject.date} Time: ${subject.time || 'Unknown'}`,
    `Location: ${subject.latitude}, ${subject.longitude}`,
    `Zodiac: ${subject.zodiac || 'tropical'} | Houses: ${subject.house_system || 'Placidus'}`,
    vedic.moon_nakshatra ? `Birth Star: ${vedic.moon_nakshatra} Pada ${vedic.moon_nakshatra_pada} (${vedic.moon_nakshatra_lord})` : '',
    '',
    'PLANET POSITIONS:',
  ];
  for (const p of planets) {
    const retro = p.retrograde ? ' (R)' : '';
    const nak = p.nakshatra ? ` [${p.nakshatra} ${p.nakshatra_pada}]` : '';
    lines.push(`${p.name}: ${p.sign} ${p.degree_in_sign?.toFixed(1)}° House ${p.house || '?'}${retro}${nak}`);
  }
  lines.push('', 'HOUSE CUSPS:');
  for (const h of houses) {
    lines.push(`House ${h.number}: ${h.sign} ${h.degree_in_sign?.toFixed(1)}°`);
  }
  lines.push('', 'ASPECTS:');
  for (const a of aspects) {
    lines.push(`${a.planet1} ${a.aspect} ${a.planet2} (orb ${a.orb?.toFixed(1)}°)`);
  }
  return lines.filter(Boolean).join('\n');
}

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_KEY) throw new Error('Gemini API key not configured');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_KEY}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 2000 },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Gemini API error');
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No reading generated.';
}

const PROMPTS: Record<string, (chartText: string, params: any) => string> = {
  full: (ct, p) => `You are an expert Vedic and Western astrologer. Provide a comprehensive natal chart reading.

Use "may indicate," "suggests," "invites reflection on." Be supportive and empowering.
Never predict death, illness, or specific events. Never give medical, legal, or financial advice.

${ct}

Provide a COMPLETE reading with these sections (use ### headings):

### Overview
A 2-3 sentence summary of the chart's overall theme.

### Personality & Core Identity
Who you are at your core. Sun, Moon, Rising analysis. 150-200 words.

### Career & Purpose
Career tendencies, professional strengths, life purpose. 150-200 words.

### Love & Relationships
Relationship patterns, partnership style, what you need in love. 150-200 words.

### Money & Finances
Financial tendencies, earning style, wealth patterns. 100-150 words.

### Health & Wellbeing
General health tendencies, energy patterns. 100-150 words.

### Strengths & Talents
Natural gifts, special abilities. 100-150 words.

### Challenges & Lessons
Growth edges, lessons the chart highlights. 100-150 words.

### Life Advice
Practical guidance based on the chart. 100-150 words.`,

  yearly: (ct, p) => `You are an expert Vedic and Western astrologer. Provide a detailed yearly horoscope for ${p.year}.

Use "may indicate," "suggests." Be supportive. Never predict specific events.

${ct}

Provide a COMPLETE prediction with these sections (use ### headings):

### Overall Theme of ${p.year}
The dominant energy for the year. 100-150 words.

### Career & Work
Professional outlook, opportunities. 150-200 words.

### Love & Relationships
Romantic outlook, relationship themes. 150-200 words.

### Money & Finance
Financial outlook. 100-150 words.

### Health
Health trends. 100-150 words.

### Key Dates & Advice
Best months, practical guidance. 100-150 words.`,

  monthly: (ct, p) => {
    const months = ['','January','February','March','April','May','June','July','August','September','October','November','December'];
    return `You are an expert Vedic and Western astrologer. Monthly horoscope for ${months[p.month]} ${p.year}.

Use "may indicate," "suggests." Be supportive.

${ct}

Provide a reading with these sections (use ### headings):

### ${months[p.month]} Theme
Dominant energy. 50-100 words.

### Career
Professional outlook. 50-100 words.

### Love
Romantic outlook. 50-100 words.

### Money
Financial outlook. 50-100 words.

### Health
Health trends. 50-100 words.

### Best Dates
Best timing. 50-100 words.`;
  },

  dasha: (ct, p) => `You are an expert Vedic astrologer. Interpret the Vimshottari Dasha life chapters for this chart.

The Dasha system divides life into 120-year planetary periods. Each Mahadasha brings specific themes.

${ct}

Provide a reading with these sections (use ### headings):

### Life Chapters Overview
Summary of the Dasha trajectory. 100-150 words.

### Key Life Transitions
Major Mahadasha changes and what they mean. 150-200 words.

### Planetary Periods Guide
What each planet's Mahadasha brings:
- Ketu: 2-3 sentences
- Venus: 2-3 sentences
- Sun: 2-3 sentences
- Moon: 2-3 sentences
- Mars: 2-3 sentences
- Rahu: 2-3 sentences
- Jupiter: 2-3 sentences
- Saturn: 2-3 sentences
- Mercury: 2-3 sentences

### Guidance
How to work with planetary period energy. 100-150 words.`,

  transits: (ct, p) => `You are an expert Vedic and Western astrologer. Interpret current planetary transits for this natal chart.

Transits show how current planets interact with your birth chart — revealing active energies.

${ct}

Today's date: ${new Date().toISOString().split('T')[0]}

Provide a reading with these sections (use ### headings):

### Current Sky Overview
What's happening in the sky now. 100-150 words.

### Major Transits Active
Detailed interpretation of current major planetary movements. 200-300 words.

### What to Expect
General themes to be aware of. 100-150 words.

### Opportunities
Where to focus for growth. 100-150 words.

### Challenges
Areas needing attention. 100-150 words.

### Advice
Practical guidance. 100-150 words.`,
};

export async function POST(request: NextRequest) {
  try {
    const token = getAccessToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { reading_type, chart_id, ...params } = body;

    if (!PROMPTS[reading_type]) return NextResponse.json({ error: 'Invalid reading type' }, { status: 400 });

    // Fetch chart from backend
    const chartRes = await fetch(`${BACKEND}/api/v1/charts/${chart_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!chartRes.ok) return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
    const chart = await chartRes.json();

    const chartText = chartSummary(chart);
    const prompt = PROMPTS[reading_type](chartText, params);
    const content = await callGemini(prompt);

    return NextResponse.json({ type: reading_type, content });
  } catch (err: any) {
    console.error('Reading error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

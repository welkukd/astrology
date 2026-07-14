import { NextRequest, NextResponse } from 'next/server';

const BACKEND = (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('your-backend'))
  ? process.env.NEXT_PUBLIC_API_URL
  : 'https://astrology-api-production-8082.up.railway.app';

function getAccessToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const token = getAccessToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { reading_type, ...rest } = body;

    const endpoints: Record<string, string> = {
      full: '/api/v1/reading/full',
      yearly: '/api/v1/reading/yearly',
      monthly: '/api/v1/reading/monthly',
      dasha: '/api/v1/reading/dasha',
      transits: '/api/v1/reading/transits',
    };

    const endpoint = endpoints[reading_type];
    if (!endpoint) return NextResponse.json({ error: 'Invalid reading type' }, { status: 400 });

    const res = await fetch(`${BACKEND}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(rest),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Reading failed' }));
      return NextResponse.json({ error: err.detail || 'Reading failed' }, { status: res.status });
    }
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

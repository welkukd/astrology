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
    const res = await fetch(`${BACKEND}/api/v1/interpret`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    if (!res.ok) return NextResponse.json({ error: 'Interpretation failed' }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }); }
}

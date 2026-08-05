import { NextRequest, NextResponse } from 'next/server';

const BACKEND = (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('your-backend'))
  ? process.env.NEXT_PUBLIC_API_URL
  : 'https://astrology-api-production-813b.up.railway.app';

function getAccessToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return null;
}

export async function GET(request: NextRequest, { params }: any) {
  const { chart_id } = await params;
  try {
    const token = getAccessToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const res = await fetch(`${BACKEND}/api/v1/charts/${chart_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'Chart not found' }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }); }
}

export async function DELETE(request: NextRequest, { params }: any) {
  const { chart_id } = await params;
  try {
    const token = getAccessToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const res = await fetch(`${BACKEND}/api/v1/charts/${chart_id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'Delete failed' }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }); }
}

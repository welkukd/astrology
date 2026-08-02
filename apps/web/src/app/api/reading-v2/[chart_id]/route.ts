import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://astrology-api-production-813b.up.railway.app';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chart_id: string }> },
) {
  const { chart_id } = await params;
  const auth = request.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const lang = request.nextUrl.searchParams.get('lang') || 'ml';
  const res = await fetch(`${BACKEND}/api/v1/reading/${chart_id}?lang=${lang}`, {
    headers: { Authorization: auth },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

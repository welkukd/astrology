import { NextRequest, NextResponse } from 'next/server';

const BACKEND = (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('your-backend'))
  ? process.env.NEXT_PUBLIC_API_URL
  : 'https://astrology-api-production-813b.up.railway.app';

function getAccessToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getAccessToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const res = await fetch(`${BACKEND}/api/v1/tarot/readings/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ detail: 'Reading not found' }, { status: 404 });
      }
      const err = await res.json().catch(() => ({ detail: 'Failed to load reading' }));
      return NextResponse.json({ detail: err.detail || 'Failed to load reading' }, { status: res.status });
    }
    return NextResponse.json(await res.json());
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getAccessToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const res = await fetch(`${BACKEND}/api/v1/tarot/readings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to delete reading' }));
      return NextResponse.json({ detail: err.detail || 'Failed to delete reading' }, { status: res.status });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getAccessToken(request);
    if (!token) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'save') {
      const res = await fetch(`${BACKEND}/api/v1/tarot/readings/${id}/save`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Failed to save reading' }));
        return NextResponse.json({ detail: err.detail || 'Failed to save reading' }, { status: res.status });
      }
      return NextResponse.json(await res.json());
    }

    if (action === 'favorite') {
      const res = await fetch(`${BACKEND}/api/v1/tarot/readings/${id}/favorite`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Failed to toggle favorite' }));
        return NextResponse.json({ detail: err.detail || 'Failed to toggle favorite' }, { status: res.status });
      }
      return NextResponse.json(await res.json());
    }

    return NextResponse.json({ detail: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
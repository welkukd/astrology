import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

const BACKEND = (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('your-backend'))
  ? process.env.NEXT_PUBLIC_API_URL
  : 'https://astrology-api-production-8082.up.railway.app';

export async function GET(request: NextRequest, { params }: any) {
  const { chart_id } = await params;
  try {
    const supabase = await createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const res = await fetch(`${BACKEND}/api/v1/charts/${chart_id}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(await res.json());
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }); }
}

export async function DELETE(request: NextRequest, { params }: any) {
  const { chart_id } = await params;
  try {
    const supabase = await createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const res = await fetch(`${BACKEND}/api/v1/charts/${chart_id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }); }
}

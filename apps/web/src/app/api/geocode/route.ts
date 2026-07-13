import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q || q.length < 3) {
    return NextResponse.json({ results: [] });
  }
  
  try {
    const apiKey = process.env.GEOAPIFY_KEY;
    const url = apiKey
      ? `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(q)}&limit=10&apiKey=${apiKey}`
      : `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=10&addressdetails=1`;
    
    const res = await fetch(url, {
      headers: apiKey ? {} : { 'User-Agent': 'AstrologyApp/1.0' },
    });
    
    if (!res.ok) throw new Error('Geocoding failed');
    
    const data = await res.json();
    
    let results;
    if (apiKey) {
      results = data.results?.map((r: any) => ({
        place_id: r.place_id,
        display_name: r.formatted,
        lat: r.lat,
        lon: r.lon,
        timezone: r.timezone?.name || 'UTC',
      })) || [];
    } else {
      results = data.map((r: any) => ({
        place_id: r.place_id,
        display_name: r.display_name,
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
        timezone: 'UTC',
      }));
    }
    
    return NextResponse.json({ results });
  } catch (err) {
    console.error('Geocode error:', err);
    return NextResponse.json({ results: [] });
  }
}
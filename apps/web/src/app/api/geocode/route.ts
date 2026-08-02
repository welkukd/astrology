import { NextRequest, NextResponse } from 'next/server';

const POPULAR_CITIES: Record<string, { lat: number; lon: number; timezone: string }> = {
  'chennai': { lat: 13.0827, lon: 80.2707, timezone: 'Asia/Kolkata' },
  'bangalore': { lat: 12.9716, lon: 77.5946, timezone: 'Asia/Kolkata' },
  'bengaluru': { lat: 12.9716, lon: 77.5946, timezone: 'Asia/Kolkata' },
  'mumbai': { lat: 19.0760, lon: 72.8777, timezone: 'Asia/Kolkata' },
  'delhi': { lat: 28.7041, lon: 77.1025, timezone: 'Asia/Kolkata' },
  'hyderabad': { lat: 17.3850, lon: 78.4867, timezone: 'Asia/Kolkata' },
  'kochi': { lat: 9.9312, lon: 76.2673, timezone: 'Asia/Kolkata' },
  'cochin': { lat: 9.9312, lon: 76.2673, timezone: 'Asia/Kolkata' },
  'thiruvananthapuram': { lat: 8.5241, lon: 76.9366, timezone: 'Asia/Kolkata' },
  'trivandrum': { lat: 8.5241, lon: 76.9366, timezone: 'Asia/Kolkata' },
  'kolkata': { lat: 22.5726, lon: 88.3639, timezone: 'Asia/Kolkata' },
  'pune': { lat: 18.5204, lon: 73.8567, timezone: 'Asia/Kolkata' },
  'jaipur': { lat: 26.9124, lon: 75.7873, timezone: 'Asia/Kolkata' },
  'lucknow': { lat: 26.8467, lon: 80.9462, timezone: 'Asia/Kolkata' },
  'ahmedabad': { lat: 23.0225, lon: 72.5714, timezone: 'Asia/Kolkata' },
  'kottayam': { lat: 9.5916, lon: 76.5222, timezone: 'Asia/Kolkata' },
  'muvattupuzha': { lat: 9.9761, lon: 76.5760, timezone: 'Asia/Kolkata' },
  'ernakulam': { lat: 9.9816, lon: 76.3046, timezone: 'Asia/Kolkata' },
  'thrissur': { lat: 10.5270, lon: 76.2144, timezone: 'Asia/Kolkata' },
  'palakkad': { lat: 10.7867, lon: 76.6547, timezone: 'Asia/Kolkata' },
  'malappuram': { lat: 11.0510, lon: 76.0711, timezone: 'Asia/Kolkata' },
  'kannur': { lat: 11.8745, lon: 75.3704, timezone: 'Asia/Kolkata' },
  'kasaragod': { lat: 12.4996, lon: 74.9868, timezone: 'Asia/Kolkata' },
  'alappuzha': { lat: 9.4981, lon: 76.3388, timezone: 'Asia/Kolkata' },
  'pathanamthitta': { lat: 9.2648, lon: 76.7870, timezone: 'Asia/Kolkata' },
  'idukki': { lat: 9.8500, lon: 76.9933, timezone: 'Asia/Kolkata' },
  'wayanad': { lat: 11.6854, lon: 76.1320, timezone: 'Asia/Kolkata' },
  'kozhikode': { lat: 11.2588, lon: 75.7804, timezone: 'Asia/Kolkata' },
  'calicut': { lat: 11.2588, lon: 75.7804, timezone: 'Asia/Kolkata' },
  'madurai': { lat: 9.9252, lon: 78.1198, timezone: 'Asia/Kolkata' },
  'coimbatore': { lat: 11.0168, lon: 76.9558, timezone: 'Asia/Kolkata' },
  'mysore': { lat: 12.2958, lon: 76.6394, timezone: 'Asia/Kolkata' },
  'mysuru': { lat: 12.2958, lon: 76.6394, timezone: 'Asia/Kolkata' },
  'nagpur': { lat: 21.1458, lon: 79.0882, timezone: 'Asia/Kolkata' },
  'indore': { lat: 22.7196, lon: 75.8577, timezone: 'Asia/Kolkata' },
  'patna': { lat: 25.6093, lon: 85.1376, timezone: 'Asia/Kolkata' },
  'vadodara': { lat: 22.3072, lon: 73.1812, timezone: 'Asia/Kolkata' },
  'surat': { lat: 21.1702, lon: 72.8311, timezone: 'Asia/Kolkata' },
  'visakhapatnam': { lat: 17.6868, lon: 83.2185, timezone: 'Asia/Kolkata' },
  'kakinada': { lat: 16.9891, lon: 82.2475, timezone: 'Asia/Kolkata' },
  'tirupati': { lat: 13.6288, lon: 79.4192, timezone: 'Asia/Kolkata' },
  'beijing': { lat: 39.9042, lon: 116.4074, timezone: 'Asia/Shanghai' },
  'shanghai': { lat: 31.2304, lon: 121.4737, timezone: 'Asia/Shanghai' },
  'guangzhou': { lat: 23.1291, lon: 113.2644, timezone: 'Asia/Shanghai' },
  'shenzhen': { lat: 22.5431, lon: 114.0579, timezone: 'Asia/Shanghai' },
  'chengdu': { lat: 30.5728, lon: 104.0668, timezone: 'Asia/Shanghai' },
  'hong kong': { lat: 22.3193, lon: 114.1694, timezone: 'Asia/Hong_Kong' },
  'taipei': { lat: 25.0330, lon: 121.5654, timezone: 'Asia/Taipei' },
  'singapore': { lat: 1.3521, lon: 103.8198, timezone: 'Asia/Singapore' },
  'dubai': { lat: 25.2048, lon: 55.2708, timezone: 'Asia/Dubai' },
  'abu dhabi': { lat: 24.4539, lon: 54.3773, timezone: 'Asia/Dubai' },
  'new york': { lat: 40.7128, lon: -74.0060, timezone: 'America/New_York' },
  'london': { lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  'los angeles': { lat: 34.0522, lon: -118.2437, timezone: 'America/Los_Angeles' },
  'chicago': { lat: 41.8781, lon: -87.6298, timezone: 'America/Chicago' },
  'sydney': { lat: -33.8688, lon: 151.2093, timezone: 'Australia/Sydney' },
  'tokyo': { lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
  'kathmandu': { lat: 27.7172, lon: 85.3240, timezone: 'Asia/Kathmandu' },
  'colombo': { lat: 6.9271, lon: 79.8612, timezone: 'Asia/Colombo' },
  'dhaka': { lat: 23.8103, lon: 90.4125, timezone: 'Asia/Dhaka' },
};

function matchLocalCities(query: string): Array<{ place_id: string; display_name: string; lat: number; lon: number; timezone: string }> {
  const q = query.toLowerCase().trim();
  const results: Array<{ place_id: string; display_name: string; lat: number; lon: number; timezone: string }> = [];

  for (const [city, data] of Object.entries(POPULAR_CITIES)) {
    if (city.includes(q) || q.includes(city)) {
      results.push({
        place_id: `local_${city}`,
        display_name: `${city.charAt(0).toUpperCase() + city.slice(1)}, ${data.timezone.includes('Kolkata') ? 'India' : data.timezone.split('/')[1] || ''}`,
        lat: data.lat,
        lon: data.lon,
        timezone: data.timezone,
      });
    }
  }

  return results;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const localResults = matchLocalCities(q);

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=10&addressdetails=1&extratags=1`;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'AstrologyApp/1.0 (astrology@example.com)' },
    });

    if (!res.ok) throw new Error('Geocoding failed');

    const data = await res.json();

    const remoteResults = data.map((r: any) => ({
      place_id: r.place_id,
      display_name: r.display_name,
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon),
      timezone: r.extratags?.timezone || 'UTC',
    }));

    const combined = [...localResults, ...remoteResults].slice(0, 15);

    return NextResponse.json({ results: combined });
  } catch (err) {
    console.error('Geocode error:', err);
    return NextResponse.json({ results: localResults });
  }
}

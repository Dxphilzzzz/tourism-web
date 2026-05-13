// TourEase — Weather API proxy
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat') ?? '14.5995';
  const lng = searchParams.get('lng') ?? '120.9842';

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relativehumidity_2m&forecast_days=1&timezone=Asia/Manila`;
  const res = await fetch(url, { next: { revalidate: 900 } }); // 15 min cache
  const data = await res.json();

  return NextResponse.json(data);
}

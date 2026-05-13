// ============================================================
// TourEase — useWeather hook
// Fetches live weather from open-meteo (no API key required)
// ============================================================
'use client';

import { useState, useEffect } from 'react';
import type { WeatherData } from '@/types';
import { getWeatherInfo } from '@/lib/utils';

// Default: Manila, Philippines
const DEFAULT_LAT = 14.5995;
const DEFAULT_LNG = 120.9842;

export function useWeather(lat = DEFAULT_LAT, lng = DEFAULT_LNG) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchWeather() {
      try {
        setLoading(true);
        const url = new URL('https://api.open-meteo.com/v1/forecast');
        url.searchParams.set('latitude',              String(lat));
        url.searchParams.set('longitude',             String(lng));
        url.searchParams.set('current_weather',       'true');
        url.searchParams.set('hourly',                'relativehumidity_2m');
        url.searchParams.set('forecast_days',         '1');
        url.searchParams.set('timezone',              'Asia/Manila');

        const res  = await fetch(url.toString());
        const json = await res.json();

        if (!cancelled) {
          const cw       = json.current_weather;
          const humidity = json.hourly?.relativehumidity_2m?.[0] ?? 0;
          const info     = getWeatherInfo(cw.weathercode);

          setWeather({
            temperature: Math.round(cw.temperature),
            weathercode: cw.weathercode,
            windspeed:   Math.round(cw.windspeed),
            humidity,
            description: info.description,
            icon:        info.icon,
          });
          setError(null);
        }
      } catch {
        if (!cancelled) setError('Unable to fetch weather');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchWeather();
    // Refresh every 15 minutes
    const id = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, [lat, lng]);

  return { weather, loading, error };
}

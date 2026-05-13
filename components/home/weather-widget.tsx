// ============================================================
// TourEase — Weather Widget
// Live weather using open-meteo (no API key)
// ============================================================
'use client';

import { useWeather } from '@/hooks/use-weather';
import { Wind, Droplets, Thermometer, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function WeatherWidget() {
  const { weather, loading, error } = useWeather(); // Manila default

  if (loading) {
    return (
      <div className="rounded-2xl p-5 h-32" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        <Skeleton className="h-full w-full rounded-xl" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="rounded-2xl p-5 flex items-center gap-3" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        <RefreshCw className="w-5 h-5" style={{ color: 'var(--muted-color)' }} />
        <span className="text-sm" style={{ color: 'var(--muted-color)' }}>Weather unavailable</span>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 bg-gradient-to-br from-ocean-500 to-teal-600 text-white shadow-lg animate-fade-in"
      aria-label="Current weather"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-white/70 uppercase tracking-wide">Manila Weather</p>
          <p className="text-3xl font-display font-bold mt-0.5">{weather.temperature}°C</p>
          <p className="text-sm text-white/80 mt-0.5">{weather.description}</p>
        </div>
        <div className="text-5xl" role="img" aria-label={weather.description}>
          {weather.icon}
        </div>
      </div>

      <div className="flex items-center gap-4 pt-3 border-t border-white/20">
        <div className="flex items-center gap-1.5 text-sm text-white/80">
          <Wind className="w-4 h-4" />
          {weather.windspeed} km/h
        </div>
        <div className="flex items-center gap-1.5 text-sm text-white/80">
          <Droplets className="w-4 h-4" />
          {weather.humidity}%
        </div>
        <div className="flex items-center gap-1.5 text-sm text-white/80">
          <Thermometer className="w-4 h-4" />
          Feels {weather.temperature}°C
        </div>
      </div>
    </div>
  );
}

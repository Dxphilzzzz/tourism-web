// ============================================================
// TourEase — Tourism Map (Leaflet, client-only)
// Dynamic import prevents SSR issues on Cloudflare edge
// ============================================================
'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Filter, Locate } from 'lucide-react';
import type { MapPin as MapPinType } from '@/types';

interface TourismMapProps {
  pins:        MapPinType[];
  height?:     string;
  showFilters?: boolean;
  center?:     [number, number];
  zoom?:       number;
}

const CATEGORY_COLORS: Record<string, string> = {
  beaches:       '#0ea5e9',
  resorts:       '#8b5cf6',
  mountains:     '#10b981',
  restaurants:   '#f59e0b',
  hotels:        '#ec4899',
  'tourist-spots': '#6366f1',
  transportation: '#ef4444',
  events:        '#f97316',
  cafes:         '#84cc16',
  'tour-guides': '#06b6d4',
};

export default function TourismMap({
  pins,
  height    = '500px',
  showFilters = true,
  center    = [12.8797, 121.7740], // Philippines center
  zoom      = 6,
}: TourismMapProps) {
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [userLocation, setUserLocation]      = useState<[number, number] | null>(null);

  // Get unique categories from pins
  const categories = [...new Set(pins.map((p) => p.category))];

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Dynamically import Leaflet only on client
    let L: any;
    let map: any;

    async function init() {
      L = (await import('leaflet')).default;

      // Inject Leaflet CSS if not already present
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      map = L.map(mapRef.current!, { zoomControl: true, attributionControl: false }).setView(center, zoom);
      mapInstance.current = map;

      // Tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      addPins(L, map, pins);
    }

    init();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update pins when filter changes
  useEffect(() => {
    if (!mapInstance.current) return;
    async function update() {
      const L = (await import('leaflet')).default;
      const map = mapInstance.current;
      // Clear existing markers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
      });
      const filtered = activeCategory ? pins.filter((p) => p.category === activeCategory) : pins;
      addPins(L, map, filtered);
    }
    update();
  }, [activeCategory, pins]);

  function addPins(L: any, map: any, data: MapPinType[]) {
    data.forEach((pin) => {
      if (!pin.lat || !pin.lng) return;
      const color = pin.categoryColor || CATEGORY_COLORS[pin.category] || '#0ea5e9';

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            width:36px;height:36px;border-radius:50% 50% 50% 0;
            background:${color};transform:rotate(-45deg);
            border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);
            display:flex;align-items:center;justify-content:center;
          ">
            <div style="transform:rotate(45deg);font-size:14px">📍</div>
          </div>`,
        iconSize:   [36, 36],
        iconAnchor: [18, 36],
      });

      const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="min-width:180px;font-family:Inter,sans-serif">
          ${pin.coverImage ? `<img src="${pin.coverImage}" style="width:100%;height:100px;object-fit:cover;border-radius:8px 8px 0 0;margin:-16px -16px 10px" alt="">` : ''}
          <div style="padding:4px 0">
            <strong style="font-size:14px">${pin.name}</strong><br>
            <div style="margin:4px 0">⭐ ${pin.rating?.toFixed(1) ?? '—'}</div>
            <a href="/${pin.type === 'destination' ? 'explore' : 'businesses'}/${pin.slug}"
               style="color:#0ea5e9;font-size:12px;font-weight:600">
              View Details →
            </a>
          </div>
        </div>
      `, { maxWidth: 220 });
    });
  }

  const locateUser = () => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      setUserLocation(coords);
      mapInstance.current?.flyTo(coords, 13);
    });
  };

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ height }}>
      {/* Map */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Controls overlay */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-[400]">
        <button
          onClick={locateUser}
          title="My Location"
          className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center hover:bg-ocean-50 dark:hover:bg-slate-700 transition-colors border"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <Locate className="w-4 h-4 text-ocean-500" />
        </button>
      </div>

      {/* Category filters */}
      {showFilters && categories.length > 0 && (
        <div className="absolute bottom-3 left-3 right-3 z-[400]">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !activeCategory
                  ? 'bg-ocean-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 shadow border'
              }`}
              style={!activeCategory ? {} : { borderColor: 'var(--border-color)', color: 'var(--fg)' }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                  activeCategory === cat
                    ? 'text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 shadow border'
                }`}
                style={activeCategory === cat
                  ? { background: CATEGORY_COLORS[cat] ?? '#0ea5e9' }
                  : { borderColor: 'var(--border-color)', color: 'var(--fg)' }
                }
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pin count badge */}
      <div className="absolute top-3 left-3 z-[400]">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-md border text-xs font-semibold"
          style={{ borderColor: 'var(--border-color)', color: 'var(--fg)' }}
        >
          <MapPin className="w-3.5 h-3.5 text-ocean-500" />
          {activeCategory ? pins.filter(p => p.category === activeCategory).length : pins.length} places
        </div>
      </div>
    </div>
  );
}

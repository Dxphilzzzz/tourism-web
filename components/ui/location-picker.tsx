// ============================================================
// TourEase — Location Picker (Leaflet + Nominatim)
// Allows searching and clicking on map to get lat/lng
// ============================================================
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Search, MapPin, Locate, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string, city?: string) => void;
  defaultCenter?: [number, number];
  className?: string;
}

export default function LocationPicker({ onLocationSelect, defaultCenter = [12.8797, 121.7740], className }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const updateMarker = useCallback(async (lat: number, lng: number, L: any, map: any, flyTo = true) => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
      markerRef.current.on('dragend', () => {
        const pos = markerRef.current.getLatLng();
        onLocationSelect(pos.lat, pos.lng);
      });
    }
    if (flyTo) map.flyTo([lat, lng], 15);
    onLocationSelect(lat, lng);
  }, [onLocationSelect]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    let L: any;
    async function init() {
      L = (await import('leaflet')).default;

      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Fix icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, { zoomControl: true, attributionControl: false }).setView(defaultCenter, 6);
      mapInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      map.on('click', (e: any) => {
        updateMarker(e.latlng.lat, e.latlng.lng, L, map, false);
      });
    }
    init();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerRef.current = null;
      }
    };
  }, [defaultCenter, updateMarker]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setSearching(false);
    }
  };

  const selectSuggestion = async (s: any) => {
    const lat = parseFloat(s.lat);
    const lng = parseFloat(s.lon);
    const L = (await import('leaflet')).default;
    updateMarker(lat, lng, L, mapInstance.current);
    
    // Attempt to extract city/address info
    const city = s.address?.city || s.address?.town || s.address?.village || s.address?.municipality || '';
    onLocationSelect(lat, lng, s.display_name, city);
    
    setSuggestions([]);
    setSearchQuery(s.display_name);
  };

  const locateMe = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const L = (await import('leaflet')).default;
      updateMarker(lat, lng, L, mapInstance.current);
    });
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a location (e.g. Boracay White Beach)"
              className="input-base pl-10"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2 bg-ocean-500 text-white rounded-xl hover:bg-ocean-600 disabled:opacity-50 transition-colors"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
          <button
            type="button"
            onClick={locateMe}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border rounded-xl hover:bg-slate-50 transition-colors"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <Locate className="w-4 h-4 text-ocean-500" />
          </button>
        </form>

        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border rounded-xl shadow-xl z-[1000] max-h-60 overflow-y-auto" style={{ borderColor: 'var(--border-color)' }}>
            {suggestions.map((s) => (
              <button
                key={s.place_id}
                onClick={() => selectSuggestion(s)}
                className="w-full text-left px-4 py-3 hover:bg-ocean-50 dark:hover:bg-slate-800 transition-colors text-sm border-b last:border-0"
                style={{ borderColor: 'var(--border-color)', color: 'var(--fg)' }}
              >
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 text-ocean-500 shrink-0 mt-0.5" />
                  <span>{s.display_name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={mapRef} className="h-64 w-full rounded-2xl border bg-slate-100 z-10" style={{ borderColor: 'var(--border-color)' }} />
      <p className="text-[10px] text-center" style={{ color: 'var(--muted-color)' }}>
        Tip: You can also click on the map or drag the pin to refine the location.
      </p>
    </div>
  );
}

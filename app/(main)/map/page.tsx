// TourEase — Interactive Map Page
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';
import type { MapPin as MapPinType } from '@/types';

const TourismMap = dynamic(() => import('@/components/map/tourism-map'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center"><Skeleton className="w-full h-full" /></div>,
});

export default function MapPage() {
  const [pins, setPins] = useState<MapPinType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: dests } = await supabase
        .from('destinations')
        .select('id, name, slug, latitude, longitude, cover_image_url, average_rating, category:categories(name, slug, color)')
        .eq('status', 'approved')
        .not('latitude', 'is', null);

      const { data: biz } = await supabase
        .from('businesses')
        .select('id, name, slug, latitude, longitude, cover_image_url, average_rating, category')
        .eq('status', 'approved')
        .not('latitude', 'is', null);

      const destPins: MapPinType[] = (dests ?? []).map((d: any) => ({
        id: d.id, name: d.name, lat: d.latitude, lng: d.longitude,
        category: d.category?.slug ?? 'other', categoryColor: d.category?.color ?? '#0ea5e9',
        coverImage: d.cover_image_url, rating: d.average_rating, slug: d.slug, type: 'destination' as const,
      }));

      const bizPins: MapPinType[] = (biz ?? []).map((b: any) => ({
        id: b.id, name: b.name, lat: b.latitude, lng: b.longitude,
        category: b.category, categoryColor: '#8b5cf6',
        coverImage: b.cover_image_url, rating: b.average_rating, slug: b.slug, type: 'business' as const,
      }));

      setPins([...destPins, ...bizPins]);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="h-full relative">
        {loading ? (
          <div className="h-full flex items-center justify-center" style={{ background: 'var(--bg)' }}>
            <div className="text-center">
              <MapPin className="w-12 h-12 text-ocean-400 mx-auto mb-3 animate-float" />
              <p className="text-sm font-medium" style={{ color: 'var(--muted-color)' }}>Loading map…</p>
            </div>
          </div>
        ) : (
          <TourismMap pins={pins} height="100%" zoom={7} />
        )}
      </div>
    </div>
  );
}

// ============================================================
// TourEase — useFavorites hook
// Toggle favorites with optimistic UI updates
// ============================================================
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export function useFavorites() {
  const { user } = useAuth();
  const supabase  = createClient();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading]         = useState(false);

  // Load user's favorite IDs on mount
  useEffect(() => {
    if (!user) { setFavoriteIds(new Set()); return; }

    async function load() {
      const { data } = await supabase
        .from('favorites')
        .select('destination_id, business_id')
        .eq('user_id', user!.id);

      if (data) {
        const ids = data.flatMap((f) => [f.destination_id, f.business_id]).filter(Boolean) as string[];
        setFavoriteIds(new Set(ids));
      }
    }
    load();
  }, [user, supabase]);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (id: string, type: 'destination' | 'business') => {
      if (!user) return;

      const column = type === 'destination' ? 'destination_id' : 'business_id';
      const isAlreadyFav = favoriteIds.has(id);

      // Optimistic update
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isAlreadyFav) next.delete(id);
        else              next.add(id);
        return next;
      });

      try {
        setLoading(true);
        if (isAlreadyFav) {
          await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq(column, id);
        } else {
          await supabase
            .from('favorites')
            .insert({ user_id: user.id, [column]: id });
        }
      } catch {
        // Rollback on error
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (isAlreadyFav) next.add(id);
          else              next.delete(id);
          return next;
        });
      } finally {
        setLoading(false);
      }
    },
    [user, favoriteIds, supabase]
  );

  return { isFavorite, toggleFavorite, loading };
}

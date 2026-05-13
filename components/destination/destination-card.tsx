// ============================================================
// TourEase — Destination Card
// Rich card with image, rating, category, favorites
// ============================================================
'use client';

import Image from 'next/image';
import Link  from 'next/link';
import { Heart, MapPin, Star, Eye, DollarSign } from 'lucide-react';
import { cn, formatCurrency, truncate } from '@/lib/utils';
import { useFavorites } from '@/hooks/use-favorites';
import { useAuth }      from '@/hooks/use-auth';
import { toast }        from 'sonner';
import type { Destination } from '@/types';

interface DestinationCardProps {
  destination: Destination;
  className?:  string;
  priority?:   boolean;
}

export default function DestinationCard({ destination, className, priority = false }: DestinationCardProps) {
  const { user }                = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(destination.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please log in to save favorites'); return; }
    toggleFavorite(destination.id, 'destination');
    toast.success(fav ? 'Removed from favorites' : 'Added to favorites');
  };

  const cat = destination.category;

  return (
    <Link
      href={`/explore/${destination.slug}`}
      className={cn('group block rounded-2xl overflow-hidden card-lift', className)}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-200 dark:bg-slate-800">
        {destination.cover_image_url ? (
          <Image
            src={destination.cover_image_url}
            alt={destination.name}
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl bg-gradient-to-br from-ocean-100 to-teal-100 dark:from-ocean-900/30 dark:to-teal-900/30">
            {cat?.icon ?? '📍'}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category badge */}
        {cat && (
          <div
            className="absolute top-3 left-3 category-pill text-white"
            style={{ background: cat.color + 'cc' }}
          >
            <span>{cat.icon}</span> {cat.name}
          </div>
        )}

        {/* Favorite button */}
        <button
          id={`fav-${destination.id}`}
          onClick={handleFavorite}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200',
            fav
              ? 'bg-rose-500 text-white scale-110'
              : 'bg-white/20 text-white hover:bg-white/40'
          )}
        >
          <Heart className={cn('w-4 h-4', fav && 'fill-current')} />
        </button>

        {/* Featured badge */}
        {destination.is_featured && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-amber-400 text-amber-900 text-xs font-bold">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-base mb-1 group-hover:text-ocean-500 transition-colors" style={{ color: 'var(--fg)' }}>
          {destination.name}
        </h3>

        <div className="flex items-center gap-1 mb-2 text-sm" style={{ color: 'var(--muted-color)' }}>
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{destination.city}, {destination.province}</span>
        </div>

        {destination.short_description && (
          <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--muted-color)' }}>
            {destination.short_description}
          </p>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>
              {destination.average_rating > 0 ? destination.average_rating.toFixed(1) : '—'}
            </span>
            <span className="text-xs" style={{ color: 'var(--muted-color)' }}>
              ({destination.review_count})
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Views */}
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-color)' }}>
              <Eye className="w-3.5 h-3.5" />
              {destination.view_count > 999 ? `${(destination.view_count / 1000).toFixed(1)}k` : destination.view_count}
            </div>

            {/* Entrance fee */}
            {destination.entrance_fee !== null && (
              <div className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-3.5 h-3.5" />
                {destination.entrance_fee === 0 ? 'Free' : formatCurrency(destination.entrance_fee)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================================
// TourEase — Business Card
// ============================================================
'use client';

import Image from 'next/image';
import Link  from 'next/link';
import { Heart, MapPin, Star, Clock, Phone } from 'lucide-react';
import { cn, getPriceRange } from '@/lib/utils';
import { useFavorites } from '@/hooks/use-favorites';
import { useAuth }      from '@/hooks/use-auth';
import { VerifiedBadge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Business } from '@/types';

const CATEGORY_ICONS: Record<string, string> = {
  hotel:      '🏨',
  restaurant: '🍽️',
  transport:  '🚌',
  'tour-guide': '🗺️',
  resort:     '🌴',
  cafe:       '☕',
  shop:       '🛍️',
  activity:   '🎯',
};

interface BusinessCardProps {
  business:   Business;
  className?: string;
}

export default function BusinessCard({ business, className }: BusinessCardProps) {
  const { user }                = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(business.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please log in to save favorites'); return; }
    toggleFavorite(business.id, 'business');
    toast.success(fav ? 'Removed from favorites' : 'Saved!');
  };

  return (
    <Link
      href={`/businesses/${business.slug}`}
      className={cn('group block rounded-2xl overflow-hidden card-lift', className)}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Cover image */}
      <div className="relative h-44 overflow-hidden bg-slate-200 dark:bg-slate-800">
        {business.cover_image_url ? (
          <Image
            src={business.cover_image_url}
            alt={business.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-900/10">
            {CATEGORY_ICONS[business.category] ?? '🏢'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Category pill */}
        <div className="absolute top-3 left-3 category-pill bg-white/20 text-white backdrop-blur-sm">
          {CATEGORY_ICONS[business.category]} {business.category.replace('-', ' ')}
        </div>

        {/* Favorite */}
        <button
          id={`fav-biz-${business.id}`}
          onClick={handleFavorite}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all',
            fav ? 'bg-rose-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'
          )}
        >
          <Heart className={cn('w-4 h-4', fav && 'fill-current')} />
        </button>

        {/* Price range on image */}
        {business.price_range && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/50 text-white text-xs font-bold backdrop-blur-sm">
            {getPriceRange(business.price_range)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name + verified */}
        <div className="flex items-start gap-2 mb-1">
          {/* Logo */}
          {business.logo_url && (
            <div className="w-8 h-8 rounded-lg overflow-hidden border shrink-0" style={{ borderColor: 'var(--border-color)' }}>
              <Image src={business.logo_url} alt="" width={32} height={32} className="object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-semibold text-sm group-hover:text-ocean-500 transition-colors truncate" style={{ color: 'var(--fg)' }}>
                {business.name}
              </h3>
              {business.is_verified && <VerifiedBadge />}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-3 text-xs" style={{ color: 'var(--muted-color)' }}>
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{business.city}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>
              {business.average_rating > 0 ? business.average_rating.toFixed(1) : '—'}
            </span>
            <span className="text-xs" style={{ color: 'var(--muted-color)' }}>({business.review_count})</span>
          </div>
          {business.phone && (
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-color)' }}>
              <Phone className="w-3.5 h-3.5" />
              Contact
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

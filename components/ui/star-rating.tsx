// ============================================================
// TourEase — Star Rating Component
// ============================================================
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value:      number;
  max?:       number;
  size?:      'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?:  (rating: number) => void;
  className?: string;
}

const sizeMap = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-6 h-6' };

export function StarRating({
  value, max = 5, size = 'md',
  interactive = false, onChange, className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? (hovered || value) : value;

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      onMouseLeave={() => interactive && setHovered(0)}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(display);
        return (
          <Star
            key={i}
            className={cn(
              sizeMap[size],
              'transition-colors duration-100',
              filled ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-300 dark:text-slate-600',
              interactive && 'cursor-pointer hover:scale-110 transition-transform'
            )}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onClick={() => interactive && onChange?.(i + 1)}
          />
        );
      })}
    </div>
  );
}

export function RatingDisplay({ value, count, size = 'sm' }: { value: number; count?: number; size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center gap-1.5">
      <StarRating value={value} size={size} />
      <span className={cn('font-semibold', size === 'sm' ? 'text-sm' : 'text-base')} style={{ color: 'var(--fg)' }}>
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-xs" style={{ color: 'var(--muted-color)' }}>({count.toLocaleString()})</span>
      )}
    </div>
  );
}

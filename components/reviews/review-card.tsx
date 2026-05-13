// ============================================================
// TourEase — Review Card
// ============================================================
import { ThumbsUp, Flag } from 'lucide-react';
import { StarRating }     from '@/components/ui/star-rating';
import { Avatar }         from '@/components/ui/avatar';
import { formatRelativeTime } from '@/lib/utils';
import type { Review }    from '@/types';
import Image from 'next/image';

interface ReviewCardProps {
  review:     Review;
  onHelpful?: (id: string) => void;
  onFlag?:    (id: string) => void;
}

export default function ReviewCard({ review, onHelpful, onFlag }: ReviewCardProps) {
  const user = (review as any).user;

  return (
    <div
      className="p-5 rounded-2xl animate-fade-in"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar src={user?.avatar_url} name={user?.full_name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>
              {user?.full_name ?? 'Anonymous'}
            </span>
            <span className="text-xs" style={{ color: 'var(--muted-color)' }}>
              {formatRelativeTime(review.created_at)}
            </span>
          </div>
          <StarRating value={review.rating} size="sm" className="mt-0.5" />
        </div>
      </div>

      {/* Content */}
      {review.title && (
        <h4 className="font-semibold mb-1.5" style={{ color: 'var(--fg)' }}>{review.title}</h4>
      )}
      <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--muted-color)' }}>
        {review.content}
      </p>

      {/* Images */}
      {review.image_urls?.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {review.image_urls.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
              <Image src={url} alt={`Review photo ${i + 1}`} fill className="object-cover" sizes="80px" />
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <button
          onClick={() => onHelpful?.(review.id)}
          className="flex items-center gap-1.5 text-xs transition-colors hover:text-ocean-500"
          style={{ color: 'var(--muted-color)' }}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          Helpful ({review.helpful_count})
        </button>
        <button
          onClick={() => onFlag?.(review.id)}
          className="flex items-center gap-1.5 text-xs transition-colors hover:text-rose-500 ml-auto"
          style={{ color: 'var(--muted-color)' }}
        >
          <Flag className="w-3.5 h-3.5" />
          Report
        </button>
      </div>
    </div>
  );
}

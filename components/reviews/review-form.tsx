// ============================================================
// TourEase — Review Form Component
// ============================================================
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast }   from 'sonner';
import { StarRating } from '@/components/ui/star-rating';
import { Button }     from '@/components/ui/button';
import { createReview } from '@/services/reviews';
import { useAuth }      from '@/hooks/use-auth';

interface ReviewFormValues {
  title:   string;
  content: string;
}

interface ReviewFormProps {
  destinationId?: string;
  businessId?:    string;
  onSuccess?:     () => void;
}

export default function ReviewForm({ destinationId, businessId, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating,    setRating]    = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormValues>();

  const onSubmit = async (values: ReviewFormValues) => {
    if (!user) { toast.error('Please log in to submit a review'); return; }
    if (rating === 0) { toast.error('Please select a rating'); return; }

    setSubmitting(true);
    const { error } = await createReview({
      destination_id: destinationId,
      business_id:    businessId,
      rating,
      title:   values.title || undefined,
      content: values.content,
    });

    if (error) {
      toast.error(error);
    } else {
      toast.success('Review submitted! Thank you.');
      reset();
      setRating(0);
      onSuccess?.();
    }
    setSubmitting(false);
  };

  if (!user) {
    return (
      <div className="text-center py-8 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        <p className="text-sm mb-3" style={{ color: 'var(--muted-color)' }}>Log in to write a review</p>
        <a href="/login" className="text-ocean-500 text-sm font-semibold hover:underline">Sign In →</a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-5 rounded-2xl space-y-4"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
    >
      <h3 className="font-semibold" style={{ color: 'var(--fg)' }}>Write a Review</h3>

      {/* Star Rating Picker */}
      <div>
        <label className="block text-sm mb-2" style={{ color: 'var(--muted-color)' }}>Your Rating *</label>
        <StarRating value={rating} interactive onChange={setRating} size="lg" />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm mb-1.5" style={{ color: 'var(--muted-color)' }}>Title</label>
        <input
          {...register('title')}
          placeholder="Summarize your experience"
          className="input-base"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm mb-1.5" style={{ color: 'var(--muted-color)' }}>Review *</label>
        <textarea
          {...register('content', { required: 'Please write your review' })}
          rows={4}
          placeholder="Share your experience in detail…"
          className="input-base resize-none"
        />
        {errors.content && <p className="text-xs text-rose-500 mt-1">{errors.content.message}</p>}
      </div>

      <Button type="submit" loading={submitting} fullWidth>
        Submit Review
      </Button>
    </form>
  );
}

// TourEase — Business Detail Page
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReviewCard from '@/components/reviews/review-card';
import ReviewForm from '@/components/reviews/review-form';
import { VerifiedBadge } from '@/components/ui/badge';
import { MapPin, Star, Phone, Mail, Globe, Clock, ArrowLeft, ChevronRight, Navigation } from 'lucide-react';
import { formatCurrency, getPriceRange } from '@/lib/utils';
import type { Business, Review } from '@/types';
import type { Metadata } from 'next';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('businesses').select('name, description').eq('slug', slug).single();
  return data ? { title: data.name, description: data.description.slice(0, 160) } : { title: 'Business Not Found' };
}

export default async function BusinessDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase.from('businesses').select('*, owner:profiles(id, full_name, avatar_url)').eq('slug', slug).single();
  if (!data) notFound();
  const biz = data as Business;

  const { data: reviews } = await supabase.from('reviews').select('*, user:profiles(id, full_name, avatar_url)')
    .eq('business_id', biz.id).eq('is_flagged', false).order('created_at', { ascending: false }).limit(10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--muted-color)' }}>
        <Link href="/businesses" className="hover:text-ocean-500 flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Businesses</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span style={{ color: 'var(--fg)' }}>{biz.name}</span>
      </nav>

      {/* Cover */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 bg-slate-200 dark:bg-slate-800">
        {biz.cover_image_url ? (
          <Image src={biz.cover_image_url} alt={biz.name} fill className="object-cover" priority sizes="100vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-900/10">🏢</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-3xl font-display font-bold text-white">{biz.name}</h1>
            {biz.is_verified && <VerifiedBadge />}
          </div>
          <div className="flex items-center gap-3 text-white/80 text-sm">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {biz.city}</span>
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {biz.average_rating.toFixed(1)} ({biz.review_count})</span>
            {biz.price_range && <span>{getPriceRange(biz.price_range)}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--fg)' }}>About</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--muted-color)' }}>{biz.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold mb-5" style={{ color: 'var(--fg)' }}>Reviews ({biz.review_count})</h2>
            <div className="space-y-4 mb-6">
              {(reviews ?? []).map((r: any) => <ReviewCard key={r.id} review={r} />)}
              {(!reviews || reviews.length === 0) && (
                <div className="text-center py-10 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                  <Star className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm" style={{ color: 'var(--muted-color)' }}>No reviews yet</p>
                </div>
              )}
            </div>
            <ReviewForm businessId={biz.id} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="p-5 rounded-2xl space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <h3 className="font-semibold" style={{ color: 'var(--fg)' }}>Contact</h3>
            {biz.phone && <a href={`tel:${biz.phone}`} className="flex items-center gap-3 text-sm hover:text-ocean-500" style={{ color: 'var(--fg)' }}><Phone className="w-4 h-4 text-ocean-500" />{biz.phone}</a>}
            {biz.email && <a href={`mailto:${biz.email}`} className="flex items-center gap-3 text-sm hover:text-ocean-500" style={{ color: 'var(--fg)' }}><Mail className="w-4 h-4 text-violet-500" />{biz.email}</a>}
            {biz.website && <a href={biz.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-ocean-500" style={{ color: 'var(--fg)' }}><Globe className="w-4 h-4 text-amber-500" />Website</a>}
            {biz.operating_hours && <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--fg)' }}><Clock className="w-4 h-4 text-teal-500" />{biz.operating_hours}</div>}
            {biz.latitude && biz.longitude && (
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${biz.latitude},${biz.longitude}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-ocean-500 text-white text-sm font-semibold hover:bg-ocean-600 transition-colors mt-2">
                <Navigation className="w-4 h-4" /> Get Directions
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

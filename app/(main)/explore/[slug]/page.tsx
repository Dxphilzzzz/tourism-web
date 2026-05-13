// ============================================================
// TourEase — Destination Detail Page
// ============================================================
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link  from 'next/link';
import ReviewCard from '@/components/reviews/review-card';
import ReviewForm from '@/components/reviews/review-form';
import { StarRating } from '@/components/ui/star-rating';
import { Badge }      from '@/components/ui/badge';
import { Avatar }     from '@/components/ui/avatar';
import {
  MapPin, Clock, DollarSign, Phone, Mail, Globe, ArrowLeft,
  Star, Eye, Calendar, Share2, Navigation, ChevronRight, Info,
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { Destination, Review } from '@/types';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('destinations').select('name, short_description').eq('slug', slug).single();
  if (!data) return { title: 'Destination Not Found' };
  return {
    title: data.name,
    description: data.short_description ?? `Discover ${data.name} on TourEase`,
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: destination } = await supabase
    .from('destinations')
    .select('*, category:categories(*), images:destination_images(*), submitter:profiles(id, full_name, avatar_url)')
    .eq('slug', slug)
    .single();

  if (!destination) notFound();
  const dest = destination as Destination;

  // Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, user:profiles(id, full_name, avatar_url)')
    .eq('destination_id', dest.id)
    .eq('is_flagged', false)
    .order('created_at', { ascending: false })
    .limit(10);

  const allReviews = (reviews ?? []) as Review[];
  const cat = dest.category;

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-color)' }}>
          <Link href="/explore" className="hover:text-ocean-500 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Explore
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          {cat && (
            <>
              <Link href={`/explore?category=${cat.slug}`} className="hover:text-ocean-500 transition-colors">{cat.name}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
          <span style={{ color: 'var(--fg)' }}>{dest.name}</span>
        </nav>
      </div>

      {/* Hero Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden" style={{ maxHeight: '420px' }}>
          {/* Main image */}
          <div className="md:col-span-2 relative h-64 md:h-full bg-slate-200 dark:bg-slate-800">
            {dest.cover_image_url ? (
              <Image src={dest.cover_image_url} alt={dest.name} fill className="object-cover" priority sizes="66vw" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-ocean-100 to-teal-100 dark:from-ocean-900/30 dark:to-teal-900/30">
                {cat?.icon ?? '📍'}
              </div>
            )}
          </div>
          {/* Side images */}
          <div className="hidden md:grid grid-rows-2 gap-3">
            {(dest.images ?? []).slice(0, 2).map((img, i) => (
              <div key={img.id} className="relative bg-slate-200 dark:bg-slate-800">
                <Image src={img.url} alt={img.caption ?? `Photo ${i + 1}`} fill className="object-cover" sizes="33vw" />
              </div>
            ))}
            {(!dest.images || dest.images.length < 2) && (
              <div className="bg-gradient-to-br from-ocean-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-ocean-300" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title + Meta */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  {cat && (
                    <span className="category-pill text-white text-xs mb-2 inline-flex" style={{ background: cat.color }}>
                      {cat.icon} {cat.name}
                    </span>
                  )}
                  <h1 className="text-3xl font-display font-bold mt-2" style={{ color: 'var(--fg)' }}>{dest.name}</h1>
                </div>
                {dest.is_featured && <Badge variant="warning">⭐ Featured</Badge>}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--muted-color)' }}>
                  <MapPin className="w-4 h-4" /> {dest.city}, {dest.province}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>
                    {dest.average_rating > 0 ? dest.average_rating.toFixed(1) : 'No ratings'}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--muted-color)' }}>({dest.review_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--muted-color)' }}>
                  <Eye className="w-4 h-4" /> {dest.view_count.toLocaleString()} views
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--fg)' }}>
                  <Share2 className="w-4 h-4" /> Share
                </button>
                {dest.latitude && dest.longitude && (
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${dest.latitude},${dest.longitude}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-ocean-500 text-white hover:bg-ocean-600 transition-colors">
                    <Navigation className="w-4 h-4" /> Get Directions
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="p-6 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--fg)' }}>About</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--muted-color)' }}>
                {dest.description}
              </p>
            </div>

            {/* Travel Tips */}
            {dest.travel_tips && (
              <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-amber-600" />
                  <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-300">Travel Tips</h2>
                </div>
                <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-300/80 whitespace-pre-line">
                  {dest.travel_tips}
                </p>
              </div>
            )}

            {/* Reviews Section */}
            <div>
              <h2 className="text-xl font-display font-bold mb-5" style={{ color: 'var(--fg)' }}>
                Reviews ({dest.review_count})
              </h2>
              <div className="space-y-4 mb-6">
                {allReviews.length > 0 ? (
                  allReviews.map((review) => <ReviewCard key={review.id} review={review} />)
                ) : (
                  <div className="text-center py-10 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                    <Star className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm" style={{ color: 'var(--muted-color)' }}>No reviews yet. Be the first!</p>
                  </div>
                )}
              </div>
              <ReviewForm destinationId={dest.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick Info Card */}
            <div className="p-5 rounded-2xl space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <h3 className="font-semibold" style={{ color: 'var(--fg)' }}>Quick Info</h3>
              {dest.entrance_fee !== null && (
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--muted-color)' }}>Entrance Fee</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>
                      {dest.entrance_fee === 0 ? 'Free Entry' : formatCurrency(dest.entrance_fee)}
                    </p>
                  </div>
                </div>
              )}
              {dest.opening_hours && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-ocean-500 shrink-0" />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--muted-color)' }}>Hours</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>{dest.opening_hours}</p>
                  </div>
                </div>
              )}
              {dest.contact_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-teal-500 shrink-0" />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--muted-color)' }}>Phone</p>
                    <a href={`tel:${dest.contact_phone}`} className="text-sm font-semibold text-ocean-500 hover:underline">{dest.contact_phone}</a>
                  </div>
                </div>
              )}
              {dest.contact_email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-violet-500 shrink-0" />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--muted-color)' }}>Email</p>
                    <a href={`mailto:${dest.contact_email}`} className="text-sm font-semibold text-ocean-500 hover:underline">{dest.contact_email}</a>
                  </div>
                </div>
              )}
              {dest.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--muted-color)' }}>Website</p>
                    <a href={dest.website} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-ocean-500 hover:underline truncate block">{dest.website}</a>
                  </div>
                </div>
              )}
            </div>

            {/* Submitted By */}
            {dest.submitter && (
              <div className="p-5 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-color)' }}>Submitted by</p>
                <div className="flex items-center gap-3">
                  <Avatar src={(dest.submitter as any).avatar_url} name={(dest.submitter as any).full_name} size="md" />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>{(dest.submitter as any).full_name ?? 'Traveler'}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-color)' }}>{formatDate(dest.created_at)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Location Map Placeholder */}
            {dest.latitude && dest.longitude && (
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
                <Link href={`/map?lat=${dest.latitude}&lng=${dest.longitude}&zoom=14`}
                  className="block h-48 bg-gradient-to-br from-ocean-50 to-teal-50 dark:from-ocean-900/20 dark:to-teal-900/20 flex items-center justify-center group">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-ocean-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-ocean-600 dark:text-ocean-400">View on Map</p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

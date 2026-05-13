// TourEase — Travel Guides Page
import { createServerSupabaseClient } from '@/lib/supabase-server';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Download, Search, Calendar, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { TravelGuide } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Guides',
  description: 'Download free travel guides for the Philippines. Offline-ready, printable, and community-written.',
};

export default async function GuidesPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('travel_guides')
    .select('*, author:profiles(id, full_name, avatar_url), category:categories(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const guides = (data ?? []) as TravelGuide[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-bold mb-2" style={{ color: 'var(--fg)' }}>Travel Guides</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--muted-color)' }}>
        Community-written guides you can download for offline use
      </p>

      {guides.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {guides.map((guide) => {
            const author = guide.author as any;
            return (
              <Link key={guide.id} href={`/guides/${guide.slug}`}
                className="group block rounded-2xl overflow-hidden card-lift"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
                <div className="relative h-44 bg-slate-200 dark:bg-slate-800">
                  {guide.cover_image_url ? (
                    <Image src={guide.cover_image_url} alt={guide.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl bg-gradient-to-br from-ocean-50 to-teal-50 dark:from-ocean-900/20 dark:to-teal-900/20">📖</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {guide.is_downloadable && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1">
                      <Download className="w-3 h-3" /> Offline
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-base mb-1 group-hover:text-ocean-500 transition-colors" style={{ color: 'var(--fg)' }}>{guide.title}</h3>
                  <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--muted-color)' }}>{guide.description}</p>
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted-color)' }}>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{author?.full_name ?? 'Unknown'}</span>
                    <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" />{guide.download_count}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-ocean-300" />
          <p className="font-semibold" style={{ color: 'var(--fg)' }}>No guides yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-color)' }}>Be the first to create a travel guide!</p>
        </div>
      )}
    </div>
  );
}

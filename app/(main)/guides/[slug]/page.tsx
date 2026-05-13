// TourEase — Guide Detail Page
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import { ArrowLeft, ChevronRight, Download, Calendar, QrCode, Printer } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { TravelGuide } from '@/types';
import type { Metadata } from 'next';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('travel_guides').select('title, description').eq('slug', slug).single();
  return data ? { title: data.title, description: data.description.slice(0, 160) } : { title: 'Guide Not Found' };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('travel_guides')
    .select('*, author:profiles(id, full_name, avatar_url, bio), category:categories(*)')
    .eq('slug', slug).single();
  if (!data) notFound();
  const guide = data as TravelGuide;
  const author = guide.author as any;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--muted-color)' }}>
        <Link href="/guides" className="hover:text-ocean-500 flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Guides</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span style={{ color: 'var(--fg)' }}>{guide.title}</span>
      </nav>

      {guide.cover_image_url && (
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
          <Image src={guide.cover_image_url} alt={guide.title} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <h1 className="text-3xl md:text-4xl font-display font-bold mb-4" style={{ color: 'var(--fg)' }}>{guide.title}</h1>

      <div className="flex items-center gap-4 mb-6 flex-wrap">
        {author && (
          <div className="flex items-center gap-2">
            <Avatar src={author.avatar_url} name={author.full_name} size="sm" />
            <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>{author.full_name}</span>
          </div>
        )}
        <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--muted-color)' }}>
          <Calendar className="w-3.5 h-3.5" /> {formatDate(guide.created_at)}
        </span>
        <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--muted-color)' }}>
          <Download className="w-3.5 h-3.5" /> {guide.download_count} downloads
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {guide.is_downloadable && (
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ocean-500 text-white font-semibold text-sm hover:bg-ocean-600 transition-colors">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        )}
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          style={{ borderColor: 'var(--border-color)', color: 'var(--fg)' }}>
          <QrCode className="w-4 h-4" /> QR Code
        </button>
        <button onClick={() => { if (typeof window !== 'undefined') window.print(); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          style={{ borderColor: 'var(--border-color)', color: 'var(--fg)' }}>
          <Printer className="w-4 h-4" /> Print
        </button>
      </div>

      {/* Tags */}
      {guide.tags?.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-8">
          {guide.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-ocean-500/10 text-ocean-600 dark:text-ocean-400">{tag}</span>
          ))}
        </div>
      )}

      {/* Content */}
      <article className="prose-tourism" dangerouslySetInnerHTML={{ __html: guide.content.replace(/\n/g, '<br />') }} />
    </div>
  );
}

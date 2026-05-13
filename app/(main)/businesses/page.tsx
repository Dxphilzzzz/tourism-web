// TourEase — Business Directory Page
import { createServerSupabaseClient } from '@/lib/supabase-server';
import BusinessCard from '@/components/business/business-card';
import Link from 'next/link';
import { Building2, Search } from 'lucide-react';
import type { Metadata } from 'next';
import type { Business } from '@/types';

export const metadata: Metadata = {
  title: 'Business Directory',
  description: 'Discover top-rated hotels, restaurants, and tour guides in the Philippines.',
};

const CATS = [
  { value: '', label: 'All', icon: '🏢' },
  { value: 'hotel', label: 'Hotels', icon: '🏨' },
  { value: 'restaurant', label: 'Restaurants', icon: '🍽️' },
  { value: 'resort', label: 'Resorts', icon: '🌴' },
  { value: 'cafe', label: 'Cafes', icon: '☕' },
  { value: 'transport', label: 'Transport', icon: '🚌' },
  { value: 'tour-guide', label: 'Guides', icon: '🗺️' },
];

interface Props { searchParams: Promise<Record<string, string | undefined>> }

export default async function BusinessesPage({ searchParams }: Props) {
  const p = await searchParams;
  const cat = p.category ?? '';
  const search = p.search;
  const supabase = await createServerSupabaseClient();

  let q = supabase.from('businesses').select('*', { count: 'exact' })
    .eq('status', 'approved').order('average_rating', { ascending: false });
  if (cat) q = q.eq('category', cat);
  if (search) q = q.or(`name.ilike.%${search}%,description.ilike.%${search}%`);

  const { data, count } = await q;
  const biz = (data ?? []) as Business[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-bold mb-2" style={{ color: 'var(--fg)' }}>Business Directory</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--muted-color)' }}>{count ?? 0} businesses</p>

      <form action="/businesses" method="GET" className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-color)' }} />
          <input name="search" defaultValue={search} placeholder="Search businesses…" className="input-base pl-10" />
        </div>
      </form>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
        {CATS.map((c) => (
          <Link key={c.value} href={c.value ? `/businesses?category=${c.value}` : '/businesses'}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              cat === c.value ? 'bg-ocean-500 text-white' : ''
            }`}
            style={cat !== c.value ? { color: 'var(--fg)', background: 'var(--card-bg)', border: '1px solid var(--border-color)' } : {}}>
            <span>{c.icon}</span> {c.label}
          </Link>
        ))}
      </div>

      {biz.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
          {biz.map((b) => <BusinessCard key={b.id} business={b} />)}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <Building2 className="w-12 h-12 mx-auto mb-3 text-ocean-300" />
          <p className="font-semibold" style={{ color: 'var(--fg)' }}>No businesses found</p>
        </div>
      )}
    </div>
  );
}

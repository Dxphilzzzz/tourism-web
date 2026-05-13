// ============================================================
// TourEase — Explore Destinations Page
// Server-rendered with filters and pagination
// ============================================================
import { createServerSupabaseClient } from '@/lib/supabase-server';
import DestinationCard from '@/components/destination/destination-card';
import Link from 'next/link';
import { MapPin, Search, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import type { Destination, Category } from '@/types';

export const metadata: Metadata = {
  title: 'Explore Destinations',
  description: 'Discover amazing tourist destinations, beaches, mountains, restaurants, and hidden gems across the Philippines.',
};

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function ExplorePage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category;
  const search   = params.search;
  const page     = parseInt(params.page ?? '1');
  const pageSize = 12;

  const supabase = await createServerSupabaseClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  // Build destination query
  const from = (page - 1) * pageSize;
  const to   = from + pageSize - 1;

  let query = supabase
    .from('destinations')
    .select('*, category:categories(*)', { count: 'exact' })
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (category) {
    // Get category ID from slug
    const cat = (categories ?? []).find((c: any) => c.slug === category);
    if (cat) query = query.eq('category_id', cat.id);
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,city.ilike.%${search}%`);
  }

  const { data: destinations, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / pageSize);
  const cats = (categories ?? []) as Category[];
  const dests = (destinations ?? []) as Destination[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2" style={{ color: 'var(--fg)' }}>
          Explore Destinations
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-color)' }}>
          {count ?? 0} destination{(count ?? 0) !== 1 ? 's' : ''} found
          {category ? ` in "${category.replace('-', ' ')}"` : ''}
          {search ? ` matching "${search}"` : ''}
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 shrink-0">
          {/* Search */}
          <form action="/explore" method="GET" className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-color)' }} />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search destinations…"
                className="input-base pl-10"
              />
            </div>
            {category && <input type="hidden" name="category" value={category} />}
          </form>

          {/* Category Filter */}
          <div className="p-4 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-ocean-500" />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>Categories</h3>
            </div>
            <div className="space-y-1">
              <Link
                href="/explore"
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  !category ? 'bg-ocean-500/10 text-ocean-600 dark:text-ocean-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                style={!category ? {} : { color: 'var(--fg)' }}
              >
                All Categories
              </Link>
              {cats.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/explore?category=${cat.slug}${search ? `&search=${search}` : ''}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    category === cat.slug
                      ? 'bg-ocean-500/10 text-ocean-600 dark:text-ocean-400 font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  style={category !== cat.slug ? { color: 'var(--fg)' } : {}}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {dests.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                {dests.map((dest, i) => (
                  <DestinationCard key={dest.id} destination={dest} priority={i < 6} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {page > 1 && (
                    <Link
                      href={`/explore?page=${page - 1}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                      style={{ color: 'var(--fg)' }}
                    >
                      <ArrowLeft className="w-4 h-4" /> Previous
                    </Link>
                  )}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                      const p = i + 1;
                      return (
                        <Link
                          key={p}
                          href={`/explore?page=${p}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            p === page
                              ? 'bg-ocean-500 text-white'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          style={p !== page ? { color: 'var(--fg)' } : {}}
                        >
                          {p}
                        </Link>
                      );
                    })}
                  </div>
                  {page < totalPages && (
                    <Link
                      href={`/explore?page=${page + 1}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                      style={{ color: 'var(--fg)' }}
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <MapPin className="w-12 h-12 mx-auto mb-3 text-ocean-300" />
              <p className="text-lg font-semibold mb-1" style={{ color: 'var(--fg)' }}>No destinations found</p>
              <p className="text-sm" style={{ color: 'var(--muted-color)' }}>
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

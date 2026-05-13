// ============================================================
// TourEase — Destinations Service
// All Supabase queries for destinations
// ============================================================
import { createClient } from '@/lib/supabase';
import type { Destination, PaginatedResponse } from '@/types';

export interface DestinationFilters {
  category?:   string;
  city?:       string;
  status?:     'pending' | 'approved' | 'rejected';
  featured?:   boolean;
  search?:     string;
  page?:       number;
  pageSize?:   number;
  sortBy?:     'created_at' | 'average_rating' | 'view_count' | 'review_count';
  sortOrder?:  'asc' | 'desc';
}

export async function getDestinations(
  filters: DestinationFilters = {}
): Promise<PaginatedResponse<Destination>> {
  const supabase = createClient();
  const {
    category, city, status = 'approved',
    featured, search,
    page = 1, pageSize = 12,
    sortBy = 'created_at', sortOrder = 'desc',
  } = filters;

  const from = (page - 1) * pageSize;
  const to   = from + pageSize - 1;

  let query = supabase
    .from('destinations')
    .select(`
      *,
      category:categories(*),
      submitter:profiles(id, full_name, avatar_url)
    `, { count: 'exact' })
    .eq('status', status)
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(from, to);

  if (category) query = query.eq('categories.slug', category);
  if (city)     query = query.ilike('city', `%${city}%`);
  if (featured) query = query.eq('is_featured', true);
  if (search)   query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data:       (data ?? []) as Destination[],
    count:      count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('destinations')
    .select(`
      *,
      category:categories(*),
      images:destination_images(*),
      submitter:profiles(id, full_name, avatar_url, bio)
    `)
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as Destination;
}

export async function getFeaturedDestinations(limit = 6): Promise<Destination[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('destinations')
    .select('*, category:categories(*)')
    .eq('status', 'approved')
    .eq('is_featured', true)
    .order('average_rating', { ascending: false })
    .limit(limit);
  return (data ?? []) as Destination[];
}

export async function getTrendingDestinations(limit = 8): Promise<Destination[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('destinations')
    .select('*, category:categories(*)')
    .eq('status', 'approved')
    .order('view_count', { ascending: false })
    .limit(limit);
  return (data ?? []) as Destination[];
}

export async function getTopRatedDestinations(limit = 6): Promise<Destination[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('destinations')
    .select('*, category:categories(*)')
    .eq('status', 'approved')
    .gte('review_count', 1)
    .order('average_rating', { ascending: false })
    .limit(limit);
  return (data ?? []) as Destination[];
}

export async function getNearbyDestinations(
  lat: number,
  lng: number,
  radiusKm = 20,
  limit = 6
): Promise<Destination[]> {
  const supabase = createClient();
  // Simple bounding-box approximation (~1° ≈ 111km)
  const delta = radiusKm / 111;
  const { data } = await supabase
    .from('destinations')
    .select('*, category:categories(*)')
    .eq('status', 'approved')
    .gte('latitude',  lat - delta)
    .lte('latitude',  lat + delta)
    .gte('longitude', lng - delta)
    .lte('longitude', lng + delta)
    .limit(limit);
  return (data ?? []) as Destination[];
}

export async function incrementViewCount(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.rpc('increment_view_count', { destination_id: id });
}

export async function createDestination(
  data: Partial<Destination>
): Promise<{ data: Destination | null; error: string | null }> {
  const supabase = createClient();
  const { data: result, error } = await supabase
    .from('destinations')
    .insert(data)
    .select()
    .single();
  return { data: result as Destination, error: error?.message ?? null };
}

export async function updateDestination(
  id: string,
  updates: Partial<Destination>
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from('destinations')
    .update(updates)
    .eq('id', id);
  return { error: error?.message ?? null };
}

export async function getMapPins() {
  const supabase = createClient();
  const { data } = await supabase
    .from('destinations')
    .select('id, name, slug, latitude, longitude, cover_image_url, average_rating, category:categories(name, color)')
    .eq('status', 'approved')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);
  return data ?? [];
}

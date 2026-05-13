// ============================================================
// TourEase — Travel Guides Service
// ============================================================
import { createClient } from '@/lib/supabase';
import type { TravelGuide, PaginatedResponse } from '@/types';

export async function getTravelGuides(params: {
  page?:     number;
  pageSize?: number;
  search?:   string;
  category?: string;
} = {}): Promise<PaginatedResponse<TravelGuide>> {
  const supabase = createClient();
  const { page = 1, pageSize = 9, search, category } = params;
  const from = (page - 1) * pageSize;
  const to   = from + pageSize - 1;

  let query = supabase
    .from('travel_guides')
    .select('*, author:profiles(id, full_name, avatar_url), category:categories(*), destination:destinations(id, name, slug)', { count: 'exact' })
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (search)   query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  if (category) query = query.eq('category_id', category);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data:       (data ?? []) as TravelGuide[],
    count:      count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getGuideBySlug(slug: string): Promise<TravelGuide | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('travel_guides')
    .select('*, author:profiles(*), category:categories(*), destination:destinations(*)')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data as TravelGuide;
}

export async function incrementDownloadCount(id: string): Promise<void> {
  const supabase = createClient();
  const { data } = await supabase.from('travel_guides').select('download_count').eq('id', id).single();
  if (data) {
    await supabase.from('travel_guides').update({ download_count: data.download_count + 1 }).eq('id', id);
  }
}

export async function createGuide(data: Partial<TravelGuide>): Promise<{ data: TravelGuide | null; error: string | null }> {
  const supabase = createClient();
  const { data: result, error } = await supabase
    .from('travel_guides')
    .insert(data)
    .select()
    .single();
  return { data: result as TravelGuide, error: error?.message ?? null };
}

// ============================================================
// TourEase — Businesses Service
// ============================================================
import { createClient } from '@/lib/supabase';
import type { Business, PaginatedResponse } from '@/types';

export interface BusinessFilters {
  category?: string;
  city?:     string;
  status?:   'pending' | 'approved' | 'rejected';
  search?:   string;
  page?:     number;
  pageSize?: number;
  verified?: boolean;
}

export async function getBusinesses(
  filters: BusinessFilters = {}
): Promise<PaginatedResponse<Business>> {
  const supabase = createClient();
  const {
    category, city, status = 'approved',
    search, verified,
    page = 1, pageSize = 12,
  } = filters;

  const from = (page - 1) * pageSize;
  const to   = from + pageSize - 1;

  let query = supabase
    .from('businesses')
    .select('*, owner:profiles(id, full_name, avatar_url)', { count: 'exact' })
    .eq('status', status)
    .order('average_rating', { ascending: false })
    .range(from, to);

  if (category) query = query.eq('category', category);
  if (city)     query = query.ilike('city', `%${city}%`);
  if (verified) query = query.eq('is_verified', true);
  if (search)   query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data:       (data ?? []) as Business[],
    count:      count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('businesses')
    .select('*, owner:profiles(*)')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data as Business;
}

export async function getTopRatedBusinesses(limit = 6): Promise<Business[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('businesses')
    .select('*')
    .eq('status', 'approved')
    .gte('review_count', 1)
    .order('average_rating', { ascending: false })
    .limit(limit);
  return (data ?? []) as Business[];
}

export async function createBusiness(
  data: Partial<Business>
): Promise<{ data: Business | null; error: string | null }> {
  const supabase = createClient();
  const { data: result, error } = await supabase
    .from('businesses')
    .insert(data)
    .select()
    .single();
  return { data: result as Business, error: error?.message ?? null };
}

export async function updateBusiness(
  id: string,
  updates: Partial<Business>
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('id', id);
  return { error: error?.message ?? null };
}

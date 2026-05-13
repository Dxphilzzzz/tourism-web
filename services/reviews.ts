// ============================================================
// TourEase — Reviews Service
// ============================================================
import { createClient } from '@/lib/supabase';
import type { Review } from '@/types';

export async function getReviews(params: {
  destinationId?: string;
  businessId?:    string;
  userId?:        string;
  limit?:         number;
  page?:          number;
}): Promise<{ data: Review[]; count: number }> {
  const supabase = createClient();
  const { destinationId, businessId, userId, limit = 10, page = 1 } = params;
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let query = supabase
    .from('reviews')
    .select('*, user:profiles(id, full_name, avatar_url)', { count: 'exact' })
    .eq('is_flagged', false)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (destinationId) query = query.eq('destination_id', destinationId);
  if (businessId)    query = query.eq('business_id', businessId);
  if (userId)        query = query.eq('user_id', userId);

  const { data, count, error } = await query;
  if (error) throw error;
  return { data: (data ?? []) as Review[], count: count ?? 0 };
}

export async function createReview(data: {
  destination_id?: string;
  business_id?:    string;
  rating:          number;
  title?:          string;
  content:         string;
  image_urls?:     string[];
}): Promise<{ data: Review | null; error: string | null }> {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: null, error: 'Not authenticated' };

  const { data: result, error } = await supabase
    .from('reviews')
    .insert({ ...data, user_id: user.user.id })
    .select('*, user:profiles(*)')
    .single();

  return { data: result as Review, error: error?.message ?? null };
}

export async function updateReview(
  id: string,
  updates: { rating?: number; title?: string; content?: string }
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from('reviews').update(updates).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteReview(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function flagReview(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from('reviews').update({ is_flagged: true }).eq('id', id);
}

export async function markHelpful(id: string): Promise<void> {
  const supabase = createClient();
  // Increment helpful_count
  const { data } = await supabase.from('reviews').select('helpful_count').eq('id', id).single();
  if (data) {
    await supabase.from('reviews').update({ helpful_count: data.helpful_count + 1 }).eq('id', id);
  }
}

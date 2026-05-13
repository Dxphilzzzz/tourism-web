// ============================================================
// TourEase — Admin Service
// ============================================================
import { createClient } from '@/lib/supabase';

export async function getPlatformStats() {
  const supabase = createClient();

  const [destinations, businesses, reviews, guides, users] = await Promise.all([
    supabase.from('destinations').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('reviews').select('id', { count: 'exact', head: true }),
    supabase.from('travel_guides').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
  ]);

  return {
    destinations: destinations.count ?? 0,
    businesses:   businesses.count ?? 0,
    reviews:      reviews.count ?? 0,
    guides:       guides.count ?? 0,
    users:        users.count ?? 0,
  };
}

export async function getPendingDestinations() {
  const supabase = createClient();
  const { data } = await supabase
    .from('destinations')
    .select('*, category:categories(*), submitter:profiles(id, full_name, avatar_url)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getPendingBusinesses() {
  const supabase = createClient();
  const { data } = await supabase
    .from('businesses')
    .select('*, owner:profiles(id, full_name, avatar_url)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function moderateDestination(
  id: string,
  status: 'approved' | 'rejected'
): Promise<void> {
  const supabase = createClient();
  await supabase.from('destinations').update({ status }).eq('id', id);
}

export async function moderateBusiness(
  id: string,
  status: 'approved' | 'rejected'
): Promise<void> {
  const supabase = createClient();
  await supabase.from('businesses').update({ status }).eq('id', id);
}

export async function verifyBusiness(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from('businesses').update({ is_verified: true }).eq('id', id);
}

export async function getReports() {
  const supabase = createClient();
  const { data } = await supabase
    .from('reports')
    .select('*, reporter:profiles(id, full_name)')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function resolveReport(id: string, adminNotes: string): Promise<void> {
  const supabase = createClient();
  await supabase.from('reports').update({ status: 'resolved', admin_notes: adminNotes }).eq('id', id);
}

export async function getAllUsers() {
  const supabase = createClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function updateUserRole(id: string, role: string): Promise<void> {
  const supabase = createClient();
  await supabase.from('profiles').update({ role }).eq('id', id);
}

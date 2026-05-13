// TourEase — Favorites API
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabase.from('favorites')
    .select('*, destination:destinations(id, name, slug, cover_image_url), business:businesses(id, name, slug, cover_image_url)')
    .eq('user_id', user.id);

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { destination_id, business_id } = body;

  const { data, error } = await supabase.from('favorites')
    .insert({ user_id: user.id, destination_id, business_id })
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await supabase.from('favorites').delete().eq('id', id).eq('user_id', user.id);
  return NextResponse.json({ ok: true });
}

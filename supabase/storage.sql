-- ============================================================
-- TourEase — Supabase Storage Buckets
-- Run in Supabase SQL Editor
-- ============================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'destination-images',
    'destination-images',
    TRUE,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'business-images',
    'business-images',
    TRUE,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'review-images',
    'review-images',
    TRUE,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'avatars',
    'avatars',
    TRUE,
    2097152, -- 2MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'travel-guides',
    'travel-guides',
    TRUE,
    52428800, -- 50MB
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
  )
ON CONFLICT (id) DO NOTHING;

-- ── STORAGE RLS POLICIES ─────────────────────────────────────

-- Destination images: public read, authenticated upload
CREATE POLICY "destination_images_read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'destination-images');
CREATE POLICY "destination_images_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'destination-images');
CREATE POLICY "destination_images_delete_own" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'destination-images' AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- Business images: public read, authenticated upload
CREATE POLICY "business_images_read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'business-images');
CREATE POLICY "business_images_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'business-images');

-- Review images: public read, authenticated upload
CREATE POLICY "review_images_read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'review-images');
CREATE POLICY "review_images_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'review-images');

-- Avatars: public read, own upload
CREATE POLICY "avatars_read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'avatars');
CREATE POLICY "avatars_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );
CREATE POLICY "avatars_update_own" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- Travel guides: public read
CREATE POLICY "guides_read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'travel-guides');
CREATE POLICY "guides_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'travel-guides');

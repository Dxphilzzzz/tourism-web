-- ============================================================
-- TourEase — Comprehensive Mock Data Seed
-- Run AFTER schema.sql AND seed.sql
-- WARNING: This will insert mock users with password 'password123'
-- ============================================================

-- ── 1. MOCK USERS ──────────────────────────────────────────
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
VALUES
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'admin@tourease.com', crypt('password123', gen_salt('bf')), NOW(), '{"full_name": "Admin User"}', NOW(), NOW(), 'authenticated', 'authenticated', ''),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'business@tourease.com', crypt('password123', gen_salt('bf')), NOW(), '{"full_name": "Juan Dela Cruz"}', NOW(), NOW(), 'authenticated', 'authenticated', ''),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'user1@tourease.com', crypt('password123', gen_salt('bf')), NOW(), '{"full_name": "Maria Santos"}', NOW(), NOW(), 'authenticated', 'authenticated', ''),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'user2@tourease.com', crypt('password123', gen_salt('bf')), NOW(), '{"full_name": "Pedro Penduko"}', NOW(), NOW(), 'authenticated', 'authenticated', '')
ON CONFLICT (id) DO NOTHING;

-- Give it a moment for the trigger to run, or we can just run the update assuming trigger fired
UPDATE public.profiles SET role = 'admin', is_verified = true, avatar_url = 'https://i.pravatar.cc/150?u=admin' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE public.profiles SET role = 'business_owner', is_verified = true, avatar_url = 'https://i.pravatar.cc/150?u=juan' WHERE id = '22222222-2222-2222-2222-222222222222';
UPDATE public.profiles SET role = 'visitor', avatar_url = 'https://i.pravatar.cc/150?u=maria' WHERE id = '33333333-3333-3333-3333-333333333333';
UPDATE public.profiles SET role = 'visitor', avatar_url = 'https://i.pravatar.cc/150?u=pedro' WHERE id = '44444444-4444-4444-4444-444444444444';

-- ── 2. MOCK DESTINATIONS ──────────────────────────────────
INSERT INTO public.destinations (
  id, slug, name, description, short_description, travel_tips, category_id, address, city, province, 
  latitude, longitude, entrance_fee, opening_hours, status, is_featured, cover_image_url, submitted_by
) VALUES
  (
    'd1111111-1111-1111-1111-111111111111', 'boracay-white-beach', 'Boracay White Beach', 
    'Famous for its powdery white sand and crystal clear waters. White Beach is the main tourism beach of Boracay and stretches for 4 kilometers. It is lined with hotels, resorts, restaurants, and bars.',
    'World-famous powdery white sand beach',
    'Best to visit from November to May. Don''t miss the spectacular sunset views.',
    '00000000-0000-0000-0000-000000000001', -- Beaches
    'White Beach Path', 'Malay', 'Aklan',
    11.9674, 121.9248, 0, '24/7', 'approved', true,
    'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1000',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'd2222222-2222-2222-2222-222222222222', 'chocolate-hills', 'Chocolate Hills', 
    'A geological formation in the Bohol province of the Philippines. There are at least 1,260 hills but there may be as many as 1,776 hills spread over an area of more than 50 square kilometers. They are covered in green grass that turns brown during the dry season, hence the name.',
    'Unique geological mounds that turn brown in summer',
    'Rent a scooter to explore the area. The main viewing deck requires climbing a long set of stairs.',
    '00000000-0000-0000-0000-000000000003', -- Mountains
    'Carmen', 'Carmen', 'Bohol',
    9.8296, 124.1648, 50, '8:00 AM - 11:30 PM', 'approved', true,
    'https://images.unsplash.com/photo-1544837581-2c091d3161c9?q=80&w=1000',
    '33333333-3333-3333-3333-333333333333'
  ),
  (
    'd3333333-3333-3333-3333-333333333333', 'intramuros', 'Intramuros',
    'The historic walled area within the city of Manila, the capital of the Philippines. It is known as the Walled City, and was the seat of government and political power when the Philippines was a component realm of the Spanish Empire.',
    'The historic walled city of Manila',
    'Take a Kalesa (horse-drawn carriage) ride or join a walking tour to learn about the rich history.',
    '00000000-0000-0000-0000-000000000006', -- Tourist Spots
    'Intramuros', 'Manila', 'Metro Manila',
    14.5896, 120.9747, 0, '24/7', 'approved', false,
    'https://images.unsplash.com/photo-1627914757367-9337f7a77e26?q=80&w=1000',
    '11111111-1111-1111-1111-111111111111'
  )
ON CONFLICT (id) DO NOTHING;

-- ── 3. MOCK BUSINESSES ────────────────────────────────────
INSERT INTO public.businesses (
  id, owner_id, name, slug, description, category, address, city, province, 
  latitude, longitude, phone, email, website, cover_image_url, is_verified, status, price_range
) VALUES
  (
    'b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 
    'Juan''s Island Grill', 'juans-island-grill',
    'The best seafood grill on the island. We serve fresh catch daily with our signature secret sauce. Enjoy beachfront dining with live acoustic music every weekend.',
    'restaurant', 'Station 2, White Beach', 'Malay', 'Aklan',
    11.9650, 121.9250, '+63 912 345 6789', 'hello@juansgrill.com', 'https://juansgrill.ph',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000',
    true, 'approved', 2
  ),
  (
    'b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 
    'Bohol Paradise Resort', 'bohol-paradise-resort',
    'Luxury eco-resort nestled near the Chocolate Hills. Featuring infinity pools, a world-class spa, and farm-to-table dining experiences.',
    'resort', 'Carmen-Sagbayan Road', 'Carmen', 'Bohol',
    9.8300, 124.1650, '+63 998 765 4321', 'stay@boholparadise.com', 'https://boholparadise.com',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000',
    true, 'approved', 4
  )
ON CONFLICT (id) DO NOTHING;

-- ── 4. MOCK REVIEWS ───────────────────────────────────────
-- Destination Reviews
INSERT INTO public.reviews (user_id, destination_id, rating, title, content) VALUES
  ('33333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 5, 'Absolute Paradise', 'The sand is incredibly fine and the water is perfect for swimming. The sunset here is the best I''ve ever seen.'),
  ('44444444-4444-4444-4444-444444444444', 'd1111111-1111-1111-1111-111111111111', 4, 'Beautiful but crowded', 'Stunning beach, but Station 2 can get very crowded during peak season. Go to Station 1 for a quieter experience.'),
  ('33333333-3333-3333-3333-333333333333', 'd2222222-2222-2222-2222-222222222222', 5, 'Unique landscape', 'Seeing the Chocolate Hills in person is surreal. Highly recommend going early in the morning to avoid the heat.')
ON CONFLICT DO NOTHING;

-- Business Reviews
INSERT INTO public.reviews (user_id, business_id, rating, title, content) VALUES
  ('44444444-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111', 5, 'Amazing Seafood', 'The grilled squid and garlic butter shrimp were spectacular. The beachfront view made the dinner even better.'),
  ('33333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 4, 'Great stay', 'The infinity pool looking out over the hills is breathtaking. The food was a bit expensive though.')
ON CONFLICT DO NOTHING;

-- Trigger updates the average rating automatically!

-- ============================================================
-- TourEase — Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- Categories
INSERT INTO public.categories (id, name, slug, icon, color, description) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Beaches',        'beaches',         '🏖️', '#0EA5E9', 'Beautiful beaches and coastal areas'),
  ('00000000-0000-0000-0000-000000000002', 'Resorts',         'resorts',         '🏨', '#8B5CF6', 'Resort accommodations and leisure'),
  ('00000000-0000-0000-0000-000000000003', 'Mountains',       'mountains',       '⛰️', '#10B981', 'Mountain ranges and highlands'),
  ('00000000-0000-0000-0000-000000000004', 'Restaurants',     'restaurants',     '🍽️', '#F59E0B', 'Dining and local cuisine'),
  ('00000000-0000-0000-0000-000000000005', 'Hotels',          'hotels',          '🏩', '#EC4899', 'Hotels and accommodations'),
  ('00000000-0000-0000-0000-000000000006', 'Tourist Spots',   'tourist-spots',   '📸', '#6366F1', 'Popular tourist attractions'),
  ('00000000-0000-0000-0000-000000000007', 'Transportation',  'transportation',  '🚌', '#EF4444', 'Transport services and terminals'),
  ('00000000-0000-0000-0000-000000000008', 'Events',          'events',          '🎉', '#F97316', 'Festivals and cultural events'),
  ('00000000-0000-0000-0000-000000000009', 'Cafes',           'cafes',           '☕', '#84CC16', 'Coffee shops and cafes'),
  ('00000000-0000-0000-0000-000000000010', 'Tour Guides',     'tour-guides',     '🗺️', '#06B6D4', 'Professional tour guide services')
ON CONFLICT (slug) DO NOTHING;

-- Emergency Contacts
INSERT INTO public.emergency_contacts (name, number, category, description, order_index) VALUES
  ('Emergency Hotline',          '911',        'emergency',   'National emergency services',           1),
  ('Philippine Red Cross',       '143',        'medical',     'Medical emergencies and disaster relief', 2),
  ('National Disaster Risk',     '8-911-1406', 'disaster',    'NDRRMC emergency hotline',              3),
  ('Philippine Coast Guard',     '8527-8481',  'coast-guard', 'Maritime emergencies',                  4),
  ('Tourism Hotline',            '1-387',      'tourism',     'DOT tourism assistance hotline',        5),
  ('Police Assistance',          '117',        'police',      'PNP emergency assistance',              6),
  ('Fire Emergency',             '160',        'fire',        'Bureau of Fire Protection',             7),
  ('Medical Emergency',          '8-286-3535', 'medical',     'Philippine General Hospital',           8)
ON CONFLICT DO NOTHING;

-- Announcements (sample travel alerts)
INSERT INTO public.announcements (title, content, type, is_active) VALUES
  ('Welcome to TourEase!', 'Explore the best destinations across the Philippines. Share your travel experiences and discover hidden gems!', 'info', true),
  ('Travel Advisory', 'Check local weather conditions before visiting coastal and mountain areas. Safety first!', 'alert', true),
  ('New Feature: Offline Guides', 'You can now download travel guides for offline use. Access them anytime, anywhere!', 'info', true)
ON CONFLICT DO NOTHING;

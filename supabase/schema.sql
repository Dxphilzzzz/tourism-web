-- ============================================================
-- TourEase — Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fuzzy search

-- ── ENUMS ────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('visitor', 'tourist', 'business_owner', 'admin');
CREATE TYPE destination_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE business_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE business_category AS ENUM ('hotel', 'restaurant', 'transport', 'tour-guide', 'resort', 'cafe', 'shop', 'activity');
CREATE TYPE report_type AS ENUM ('fake_review', 'spam', 'inappropriate', 'incorrect_info', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');
CREATE TYPE announcement_type AS ENUM ('alert', 'info', 'event', 'weather', 'emergency');
CREATE TYPE guide_status AS ENUM ('draft', 'published');

-- ── PROFILES (extends auth.users) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  phone       TEXT,
  role        user_role NOT NULL DEFAULT 'visitor',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── CATEGORIES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  icon        TEXT NOT NULL DEFAULT '📍',
  color       TEXT NOT NULL DEFAULT '#0EA5E9',
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── DESTINATIONS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.destinations (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  description       TEXT NOT NULL,
  short_description TEXT,
  travel_tips       TEXT,
  category_id       UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  address           TEXT NOT NULL,
  city              TEXT NOT NULL,
  province          TEXT NOT NULL DEFAULT 'Philippines',
  latitude          DOUBLE PRECISION,
  longitude         DOUBLE PRECISION,
  entrance_fee      NUMERIC(10, 2),
  opening_hours     TEXT,
  contact_phone     TEXT,
  contact_email     TEXT,
  website           TEXT,
  cover_image_url   TEXT,
  submitted_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status            destination_status NOT NULL DEFAULT 'pending',
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  average_rating    NUMERIC(3, 2) NOT NULL DEFAULT 0,
  review_count      INTEGER NOT NULL DEFAULT 0,
  view_count        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── DESTINATION IMAGES ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.destination_images (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  url            TEXT NOT NULL,
  caption        TEXT,
  is_cover       BOOLEAN NOT NULL DEFAULT FALSE,
  order_index    INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── BUSINESSES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.businesses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT NOT NULL,
  category        business_category NOT NULL,
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  province        TEXT NOT NULL DEFAULT 'Philippines',
  latitude        DOUBLE PRECISION,
  longitude       DOUBLE PRECISION,
  phone           TEXT,
  email           TEXT,
  website         TEXT,
  logo_url        TEXT,
  cover_image_url TEXT,
  is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  status          business_status NOT NULL DEFAULT 'pending',
  average_rating  NUMERIC(3, 2) NOT NULL DEFAULT 0,
  review_count    INTEGER NOT NULL DEFAULT 0,
  price_range     SMALLINT CHECK (price_range BETWEEN 1 AND 4),
  operating_hours TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── REVIEWS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  business_id    UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  rating         SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title          TEXT,
  content        TEXT NOT NULL,
  image_urls     TEXT[] DEFAULT '{}',
  is_flagged     BOOLEAN NOT NULL DEFAULT FALSE,
  helpful_count  INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- At least one of destination_id or business_id must be set
  CONSTRAINT review_target_check CHECK (
    (destination_id IS NOT NULL) OR (business_id IS NOT NULL)
  )
);

-- ── FAVORITES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.favorites (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  business_id    UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, destination_id),
  UNIQUE(user_id, business_id)
);

-- ── TRAVEL GUIDES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.travel_guides (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT NOT NULL,
  content         TEXT NOT NULL,
  cover_image_url TEXT,
  category_id     UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  destination_id  UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  author_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_downloadable BOOLEAN NOT NULL DEFAULT TRUE,
  download_count  INTEGER NOT NULL DEFAULT 0,
  qr_code_url     TEXT,
  tags            TEXT[] DEFAULT '{}',
  status          guide_status NOT NULL DEFAULT 'draft',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── REPORTS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reports (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type           report_type NOT NULL,
  reason         TEXT NOT NULL,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  business_id    UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  review_id      UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  status         report_status NOT NULL DEFAULT 'pending',
  admin_notes    TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── ANNOUNCEMENTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.announcements (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  type       announcement_type NOT NULL DEFAULT 'info',
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── EMERGENCY CONTACTS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  number      TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_destinations_status ON public.destinations(status);
CREATE INDEX idx_destinations_category ON public.destinations(category_id);
CREATE INDEX idx_destinations_city ON public.destinations(city);
CREATE INDEX idx_destinations_featured ON public.destinations(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_destinations_slug ON public.destinations(slug);
CREATE INDEX idx_destinations_search ON public.destinations USING gin(to_tsvector('english', name || ' ' || description));

CREATE INDEX idx_businesses_status ON public.businesses(status);
CREATE INDEX idx_businesses_category ON public.businesses(category);
CREATE INDEX idx_businesses_owner ON public.businesses(owner_id);
CREATE INDEX idx_businesses_slug ON public.businesses(slug);

CREATE INDEX idx_reviews_destination ON public.reviews(destination_id);
CREATE INDEX idx_reviews_business ON public.reviews(business_id);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);

CREATE INDEX idx_favorites_user ON public.favorites(user_id);
CREATE INDEX idx_guides_status ON public.travel_guides(status);
CREATE INDEX idx_announcements_active ON public.announcements(is_active) WHERE is_active = TRUE;

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at on row change
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_destinations BEFORE UPDATE ON public.destinations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_businesses BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_reviews BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_guides BEFORE UPDATE ON public.travel_guides
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Recalculate average rating after review insert/update/delete
CREATE OR REPLACE FUNCTION public.recalculate_ratings()
RETURNS TRIGGER AS $$
BEGIN
  -- Update destination rating
  IF NEW.destination_id IS NOT NULL OR (TG_OP = 'DELETE' AND OLD.destination_id IS NOT NULL) THEN
    UPDATE public.destinations d
    SET
      average_rating = COALESCE((
        SELECT AVG(rating)::NUMERIC(3,2)
        FROM public.reviews r
        WHERE r.destination_id = COALESCE(NEW.destination_id, OLD.destination_id)
      ), 0),
      review_count = (
        SELECT COUNT(*)
        FROM public.reviews r
        WHERE r.destination_id = COALESCE(NEW.destination_id, OLD.destination_id)
      )
    WHERE d.id = COALESCE(NEW.destination_id, OLD.destination_id);
  END IF;

  -- Update business rating
  IF (TG_OP != 'DELETE' AND NEW.business_id IS NOT NULL)
     OR (TG_OP = 'DELETE' AND OLD.business_id IS NOT NULL) THEN
    UPDATE public.businesses b
    SET
      average_rating = COALESCE((
        SELECT AVG(rating)::NUMERIC(3,2)
        FROM public.reviews r
        WHERE r.business_id = COALESCE(NEW.business_id, OLD.business_id)
      ), 0),
      review_count = (
        SELECT COUNT(*)
        FROM public.reviews r
        WHERE r.business_id = COALESCE(NEW.business_id, OLD.business_id)
      )
    WHERE b.id = COALESCE(NEW.business_id, OLD.business_id);
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER recalculate_ratings_after_review
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.recalculate_ratings();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- CATEGORIES (public read)
CREATE POLICY "categories_select_all" ON public.categories FOR SELECT USING (TRUE);
CREATE POLICY "categories_admin_insert" ON public.categories FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- DESTINATIONS (approved public, own pending)
CREATE POLICY "destinations_select_approved" ON public.destinations FOR SELECT
  USING (status = 'approved' OR submitted_by = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "destinations_insert_authenticated" ON public.destinations FOR INSERT
  TO authenticated WITH CHECK (submitted_by = auth.uid());
CREATE POLICY "destinations_update_own_or_admin" ON public.destinations FOR UPDATE
  USING (submitted_by = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- DESTINATION IMAGES
CREATE POLICY "dest_images_select_all" ON public.destination_images FOR SELECT USING (TRUE);
CREATE POLICY "dest_images_insert_authenticated" ON public.destination_images FOR INSERT
  TO authenticated WITH CHECK (TRUE);
CREATE POLICY "dest_images_delete_own" ON public.destination_images FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.destinations d
    WHERE d.id = destination_id AND d.submitted_by = auth.uid()
  ));

-- BUSINESSES
CREATE POLICY "businesses_select_approved" ON public.businesses FOR SELECT
  USING (status = 'approved' OR owner_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "businesses_insert_owner" ON public.businesses FOR INSERT
  TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "businesses_update_own_or_admin" ON public.businesses FOR UPDATE
  USING (owner_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- REVIEWS (public read, own write)
CREATE POLICY "reviews_select_all" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_insert_authenticated" ON public.reviews FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY "reviews_delete_own_or_admin" ON public.reviews FOR DELETE
  USING (user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- FAVORITES (own only)
CREATE POLICY "favorites_select_own" ON public.favorites FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "favorites_insert_own" ON public.favorites FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "favorites_delete_own" ON public.favorites FOR DELETE
  USING (user_id = auth.uid());

-- TRAVEL GUIDES
CREATE POLICY "guides_select_published" ON public.travel_guides FOR SELECT
  USING (status = 'published' OR author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "guides_insert_authenticated" ON public.travel_guides FOR INSERT
  TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "guides_update_own_or_admin" ON public.travel_guides FOR UPDATE
  USING (author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- REPORTS
CREATE POLICY "reports_select_admin" ON public.reports FOR SELECT
  USING (reporter_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "reports_insert_authenticated" ON public.reports FOR INSERT
  TO authenticated WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "reports_update_admin" ON public.reports FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ANNOUNCEMENTS
CREATE POLICY "announcements_select_active" ON public.announcements FOR SELECT
  USING (is_active = TRUE
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "announcements_admin_write" ON public.announcements FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- EMERGENCY CONTACTS (public read)
CREATE POLICY "emergency_select_all" ON public.emergency_contacts FOR SELECT
  USING (is_active = TRUE);
CREATE POLICY "emergency_admin_write" ON public.emergency_contacts FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

// ============================================================
// TourEase — Complete TypeScript Type Definitions
// ============================================================

export type UserRole = 'visitor' | 'tourist' | 'business_owner' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// ── Categories ──────────────────────────────────────────────
export type CategorySlug =
  | 'beaches'
  | 'resorts'
  | 'mountains'
  | 'restaurants'
  | 'hotels'
  | 'tourist-spots'
  | 'transportation'
  | 'events'
  | 'cafes'
  | 'tour-guides';

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  icon: string;
  color: string;
  description: string | null;
  created_at: string;
}

// ── Destinations ─────────────────────────────────────────────
export interface Destination {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description: string | null;
  travel_tips: string | null;
  category_id: string;
  category?: Category;
  address: string;
  city: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  entrance_fee: number | null;
  opening_hours: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  website: string | null;
  cover_image_url: string | null;
  images?: DestinationImage[];
  submitted_by: string;
  submitter?: Profile;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  average_rating: number;
  review_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface DestinationImage {
  id: string;
  destination_id: string;
  url: string;
  caption: string | null;
  is_cover: boolean;
  order_index: number;
  created_at: string;
}

// ── Businesses ───────────────────────────────────────────────
export type BusinessCategory =
  | 'hotel'
  | 'restaurant'
  | 'transport'
  | 'tour-guide'
  | 'resort'
  | 'cafe'
  | 'shop'
  | 'activity';

export interface Business {
  id: string;
  owner_id: string;
  owner?: Profile;
  name: string;
  slug: string;
  description: string;
  category: BusinessCategory;
  address: string;
  city: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  is_verified: boolean;
  is_active: boolean;
  status: 'pending' | 'approved' | 'rejected';
  average_rating: number;
  review_count: number;
  price_range: 1 | 2 | 3 | 4 | null;
  operating_hours: string | null;
  created_at: string;
  updated_at: string;
}

// ── Reviews & Ratings ────────────────────────────────────────
export interface Review {
  id: string;
  user_id: string;
  user?: Profile;
  destination_id: string | null;
  business_id: string | null;
  rating: number; // 1-5
  title: string | null;
  content: string;
  image_urls: string[];
  is_flagged: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

// ── Favorites ────────────────────────────────────────────────
export interface Favorite {
  id: string;
  user_id: string;
  destination_id: string | null;
  destination?: Destination;
  business_id: string | null;
  business?: Business;
  created_at: string;
}

// ── Travel Guides ────────────────────────────────────────────
export interface TravelGuide {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string; // markdown
  cover_image_url: string | null;
  category_id: string | null;
  category?: Category;
  destination_id: string | null;
  destination?: Destination;
  author_id: string;
  author?: Profile;
  is_downloadable: boolean;
  download_count: number;
  qr_code_url: string | null;
  tags: string[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

// ── Reports ──────────────────────────────────────────────────
export type ReportType = 'fake_review' | 'spam' | 'inappropriate' | 'incorrect_info' | 'other';

export interface Report {
  id: string;
  reporter_id: string;
  reporter?: Profile;
  type: ReportType;
  reason: string;
  destination_id: string | null;
  business_id: string | null;
  review_id: string | null;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── Announcements ─────────────────────────────────────────────
export type AnnouncementType = 'alert' | 'info' | 'event' | 'weather' | 'emergency';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  is_active: boolean;
  expires_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// ── Emergency Contacts ────────────────────────────────────────
export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  category: string;
  description: string | null;
  is_active: boolean;
  order_index: number;
}

// ── Weather (open-meteo) ──────────────────────────────────────
export interface WeatherData {
  temperature: number;
  weathercode: number;
  windspeed: number;
  humidity: number;
  description: string;
  icon: string;
}

// ── Map ──────────────────────────────────────────────────────
export interface MapPin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  categoryColor: string;
  coverImage: string | null;
  rating: number;
  slug: string;
  type: 'destination' | 'business';
}

// ── API Response Helpers ─────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
}

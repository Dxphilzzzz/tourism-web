// ============================================================
// TourEase — Homepage
// Hero + Weather + Trending + Announcements + Map Preview + Emergency
// ============================================================
import { createServerSupabaseClient } from '@/lib/supabase-server';
import HeroSection          from '@/components/home/hero-section';
import WeatherWidget        from '@/components/home/weather-widget';
import AnnouncementsBanner  from '@/components/home/announcements-banner';
import EmergencyContacts    from '@/components/home/emergency-contacts';
import DestinationCard      from '@/components/destination/destination-card';
import BusinessCard         from '@/components/business/business-card';
import Navbar               from '@/components/layout/navbar';
import Footer               from '@/components/layout/footer';
import Link                 from 'next/link';
import { MapPin, TrendingUp, Building2, BookOpen, ArrowRight, Star } from 'lucide-react';
import type { Destination, Business, Announcement, EmergencyContact, Category } from '@/types';

export const revalidate = 300; // ISR: revalidate every 5 min

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  // Parallel data fetches
  const [
    { data: destinations },
    { data: businesses },
    { data: announcements },
    { data: emergencyContacts },
    { data: categories },
    { count: destCount },
    { count: bizCount },
    { count: reviewCount },
  ] = await Promise.all([
    supabase.from('destinations').select('*, category:categories(*)').eq('status', 'approved').order('created_at', { ascending: false }).limit(8),
    supabase.from('businesses').select('*').eq('status', 'approved').order('average_rating', { ascending: false }).limit(4),
    supabase.from('announcements').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(5),
    supabase.from('emergency_contacts').select('*').eq('is_active', true).order('order_index'),
    supabase.from('categories').select('*').order('name'),
    supabase.from('destinations').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('reviews').select('id', { count: 'exact', head: true }),
  ]);

  const trendingDestinations = (destinations ?? []) as Destination[];
  const topBusinesses        = (businesses ?? []) as Business[];
  const activeAnnouncements  = (announcements ?? []) as Announcement[];
  const contacts             = (emergencyContacts ?? []) as EmergencyContact[];
  const cats                 = (categories ?? []) as Category[];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <HeroSection
        totalDestinations={destCount ?? 0}
        totalBusinesses={bizCount ?? 0}
        totalReviews={reviewCount ?? 0}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-16">
        {/* Announcements */}
        {activeAnnouncements.length > 0 && (
          <section className="animate-fade-in">
            <AnnouncementsBanner announcements={activeAnnouncements} />
          </section>
        )}

        {/* Category Grid + Weather */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="w-5 h-5 text-ocean-500" />
              <h2 className="text-2xl font-display font-bold" style={{ color: 'var(--fg)' }}>
                Explore Categories
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {cats.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/explore?category=${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl card-lift text-center"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: cat.color + '15' }}
                  >
                    {cat.icon}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--fg)' }}>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Weather Widget */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">🌤️</span>
              <h2 className="text-lg font-display font-bold" style={{ color: 'var(--fg)' }}>Weather</h2>
            </div>
            <WeatherWidget />
          </div>
        </section>

        {/* Trending Destinations */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-ocean-500" />
              <h2 className="text-2xl font-display font-bold" style={{ color: 'var(--fg)' }}>
                Trending Destinations
              </h2>
            </div>
            <Link
              href="/explore"
              className="flex items-center gap-1 text-sm font-semibold text-ocean-500 hover:text-ocean-600 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {trendingDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
              {trendingDestinations.map((dest, i) => (
                <DestinationCard key={dest.id} destination={dest} priority={i < 4} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <MapPin className="w-12 h-12 mx-auto mb-3 text-ocean-300" />
              <p className="text-lg font-semibold mb-1" style={{ color: 'var(--fg)' }}>No Destinations Yet</p>
              <p className="text-sm mb-4" style={{ color: 'var(--muted-color)' }}>Be the first to share a hidden gem!</p>
              <Link href="/dashboard/destinations/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ocean-500 text-white font-semibold text-sm hover:bg-ocean-600 transition-colors">
                Submit a Destination
              </Link>
            </div>
          )}
        </section>

        {/* Top Businesses */}
        {topBusinesses.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-violet-500" />
                <h2 className="text-2xl font-display font-bold" style={{ color: 'var(--fg)' }}>
                  Top-Rated Businesses
                </h2>
              </div>
              <Link href="/businesses" className="flex items-center gap-1 text-sm font-semibold text-ocean-500 hover:text-ocean-600 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
              {topBusinesses.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
          </section>
        )}

        {/* Map Preview + Emergency Contacts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Preview */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-ocean-500" />
                <h2 className="text-2xl font-display font-bold" style={{ color: 'var(--fg)' }}>Interactive Map</h2>
              </div>
              <Link href="/map" className="flex items-center gap-1 text-sm font-semibold text-ocean-500 hover:text-ocean-600 transition-colors">
                Full Map <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div
              className="rounded-2xl overflow-hidden h-80 flex items-center justify-center bg-gradient-to-br from-ocean-50 to-teal-50 dark:from-ocean-900/20 dark:to-teal-900/20"
              style={{ border: '1px solid var(--border-color)' }}
            >
              <Link href="/map" className="text-center group">
                <MapPin className="w-16 h-16 text-ocean-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-ocean-600 dark:text-ocean-400">Open Interactive Map</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-color)' }}>Explore destinations on a live map</p>
              </Link>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div>
            <EmergencyContacts contacts={contacts} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-3xl overflow-hidden relative">
          <div className="hero-gradient p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Share Your Travel Experience
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
              Help fellow travelers discover amazing destinations. Upload spots, write reviews, and create travel guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/destinations/new"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-ocean-700 font-semibold hover:bg-ocean-50 transition-colors shadow-lg"
              >
                <MapPin className="w-4 h-4" />
                Submit a Spot
              </Link>
              <Link
                href="/guides"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/15 text-white font-semibold border border-white/25 hover:bg-white/25 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Browse Guides
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

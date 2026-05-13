// ============================================================
// TourEase — Hero Section
// Full-viewport animated hero with live search
// ============================================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, TrendingUp, Star } from 'lucide-react';

const QUICK_SEARCHES = ['Beaches', 'Mountains', 'Resorts', 'Restaurants', 'Hotels'];

interface HeroSectionProps {
  totalDestinations?: number;
  totalBusinesses?:   number;
  totalReviews?:      number;
}

export default function HeroSection({
  totalDestinations = 0,
  totalBusinesses   = 0,
  totalReviews      = 0,
}: HeroSectionProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/explore?search=${encodeURIComponent(query.trim())}`);
  };

  const quickSearch = (term: string) => {
    router.push(`/explore?category=${term.toLowerCase()}`);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 hero-gradient opacity-90" />

      {/* Decorative overlay pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-ocean-300/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-violet-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6 animate-fade-in">
          <MapPin className="w-4 h-4 text-teal-300" />
          Discover the Philippines
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-white mb-6 leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Explore &amp; Share{' '}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-amber-300">
            Hidden Gems
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Community-powered travel platform. Discover breathtaking destinations, authentic reviews, and unforgettable experiences across the Philippines.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto mb-6 animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-white/60 shrink-0" />
              <input
                id="hero-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, places, experiences…"
                className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-base py-2"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-white text-ocean-700 font-semibold text-sm hover:bg-ocean-50 transition-colors shadow-sm shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Searches */}
        <div className="flex items-center gap-2 justify-center flex-wrap mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <span className="text-white/50 text-sm">Popular:</span>
          {QUICK_SEARCHES.map((term) => (
            <button
              key={term}
              onClick={() => quickSearch(term)}
              className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-sm border border-white/15 transition-all hover:scale-105"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.5s' }}>
          {[
            { icon: MapPin,     value: totalDestinations, label: 'Destinations' },
            { icon: TrendingUp, value: totalBusinesses,   label: 'Businesses' },
            { icon: Star,       value: totalReviews,      label: 'Reviews' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-center">
              <Icon className="w-5 h-5 text-teal-300 mx-auto mb-1" />
              <div className="text-xl font-display font-bold text-white">
                {value > 999 ? `${(value / 1000).toFixed(1)}k+` : `${value}+`}
              </div>
              <div className="text-xs text-white/60">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent" />
    </section>
  );
}

// TourEase — About Page
import { MapPin, Users, Star, BookOpen, Heart, Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About TourEase',
  description: 'Learn about TourEase — the community-powered tourism platform for the Philippines.',
};

const VALUES = [
  { icon: Heart,    title: 'Community-Driven',   desc: 'Built by travelers, for travelers. Every destination and review comes from real experiences.' },
  { icon: MapPin,   title: 'Local Discovery',    desc: 'Uncover hidden gems and popular spots across all provinces of the Philippines.' },
  { icon: Star,     title: 'Trusted Reviews',    desc: 'Honest ratings and reviews help you make informed travel decisions.' },
  { icon: BookOpen, title: 'Travel Guides',      desc: 'Downloadable, offline-ready guides written by the community.' },
  { icon: Shield,   title: 'Safe & Reliable',    desc: 'Emergency contacts, travel alerts, and real-time tourism information.' },
  { icon: Users,    title: 'Inclusive Platform',  desc: 'Supporting local businesses, tour guides, and the Philippine tourism industry.' },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-display font-bold mb-4" style={{ color: 'var(--fg)' }}>
          About <span className="text-ocean-500">TourEase</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--muted-color)' }}>
          TourEase is a community-powered tourism platform dedicated to helping travelers discover the best of the Philippines — from pristine beaches to hidden mountain trails.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 stagger-children">
        {VALUES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="p-6 rounded-2xl card-lift" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <div className="w-12 h-12 rounded-xl bg-ocean-500/10 flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-ocean-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--fg)' }}>{title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-color)' }}>{desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl p-10 text-center hero-gradient">
        <h2 className="text-2xl font-display font-bold text-white mb-3">Join Our Community</h2>
        <p className="text-white/80 mb-6 max-w-lg mx-auto">Help us build the most comprehensive tourism platform for the Philippines.</p>
        <a href="/register" className="inline-flex px-6 py-3 rounded-xl bg-white text-ocean-700 font-semibold hover:bg-ocean-50 transition-colors">
          Get Started Free
        </a>
      </div>
    </div>
  );
}

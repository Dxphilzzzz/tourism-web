// ============================================================
// TourEase — Footer Component
// ============================================================
import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const FOOTER_LINKS = {
  Explore: [
    { label: 'Destinations',  href: '/explore' },
    { label: 'Interactive Map', href: '/map' },
    { label: 'Travel Guides', href: '/guides' },
    { label: 'Businesses',    href: '/businesses' },
  ],
  Community: [
    { label: 'Submit a Spot',   href: '/dashboard/destinations/new' },
    { label: 'Write a Review',  href: '/explore' },
    { label: 'Register Business', href: '/register' },
    { label: 'About Us',        href: '/about' },
  ],
  Support: [
    { label: 'Contact Us',   href: '/contact' },
    { label: 'Help Center',  href: '/about' },
    { label: 'Privacy Policy', href: '/about' },
    { label: 'Terms of Service', href: '/about' },
  ],
};

const EMERGENCY = [
  { name: 'Emergency Hotline', number: '911' },
  { name: 'Tourism Hotline',   number: '1-387' },
  { name: 'Red Cross',         number: '143' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ocean-500 to-teal-600 flex items-center justify-center shadow-sm">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl" style={{ color: 'var(--fg)' }}>
                Tour<span className="text-ocean-500">Ease</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4 max-w-xs" style={{ color: 'var(--muted-color)' }}>
              Your community-powered tourism companion for discovering the best of the Philippines — from beaches to mountain peaks.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook,  href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Twitter,   href: '#', label: 'Twitter' },
                { icon: Youtube,   href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-ocean-500 hover:text-white"
                  style={{ background: 'var(--bg)', color: 'var(--muted-color)' }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--fg)' }}>{title}</h3>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm transition-colors hover:text-ocean-500" style={{ color: 'var(--muted-color)' }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Emergency Contacts Strip */}
        <div className="mt-10 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">🚨 Emergency</span>
            {EMERGENCY.map(({ name, number }) => (
              <a key={name} href={`tel:${number}`} className="flex items-center gap-1.5 text-sm transition-colors hover:text-ocean-500" style={{ color: 'var(--muted-color)' }}>
                <Phone className="w-3.5 h-3.5" />
                {name}: <strong style={{ color: 'var(--fg)' }}>{number}</strong>
              </a>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p className="text-xs" style={{ color: 'var(--muted-color)' }}>
              © {new Date().getFullYear()} TourEase. All rights reserved. Made with ❤️ for the Philippines.
            </p>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-color)' }}>
              <Mail className="w-3.5 h-3.5" />
              hello@tourease.ph
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// TourEase — Auth Layout
// Centered card for login/register
// ============================================================
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient opacity-60" />
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-white">
            Tour<span className="text-teal-300">Ease</span>
          </span>
        </Link>

        {/* Card */}
        <div
          className="rounded-2xl shadow-2xl p-8 animate-scale-in backdrop-blur-xl"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
        >
          {children}
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-white/60">
          © {new Date().getFullYear()} TourEase. All rights reserved.
        </p>
      </div>
    </div>
  );
}

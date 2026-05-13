// ============================================================
// TourEase — Dashboard Sidebar Component
// ============================================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, MapPin, Heart, FileText, Star,
  Settings, PlusCircle, Building2, ShieldCheck,
  Users, Flag, BarChart3, Megaphone, ChevronLeft,
} from 'lucide-react';

const USER_LINKS = [
  { href: '/dashboard',                     label: 'Overview',      icon: LayoutDashboard },
  { href: '/dashboard/destinations/new',    label: 'Submit Spot',   icon: PlusCircle },
  { href: '/dashboard/favorites',           label: 'Favorites',     icon: Heart },
  { href: '/dashboard/reviews',             label: 'My Reviews',    icon: Star },
  { href: '/dashboard/profile',             label: 'Profile',       icon: Settings },
];

const BUSINESS_LINKS = [
  { href: '/business',            label: 'Business Panel',  icon: Building2 },
  { href: '/business/analytics',  label: 'Analytics',       icon: BarChart3 },
];

const ADMIN_LINKS = [
  { href: '/admin',                label: 'Admin Panel',      icon: ShieldCheck },
  { href: '/admin/destinations',   label: 'Destinations',     icon: MapPin },
  { href: '/admin/businesses',     label: 'Businesses',       icon: Building2 },
  { href: '/admin/users',          label: 'Users',            icon: Users },
  { href: '/admin/reports',        label: 'Reports',          icon: Flag },
  { href: '/admin/announcements',  label: 'Announcements',    icon: Megaphone },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isAdmin, isBusinessOwner } = useAuth();

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <aside
      className="w-64 shrink-0 hidden lg:flex flex-col h-screen sticky top-0 border-r overflow-y-auto"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
    >
      {/* Back to site */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-ocean-500"
          style={{ color: 'var(--muted-color)' }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to TourEase
        </Link>
      </div>

      {/* User Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-color)' }}>
          Dashboard
        </p>
        {USER_LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive(href)
                ? 'bg-ocean-500/10 text-ocean-600 dark:text-ocean-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
            style={isActive(href) ? {} : { color: 'var(--fg)' }}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}

        {/* Business Links */}
        {isBusinessOwner && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-color)' }}>
                Business
              </p>
            </div>
            {BUSINESS_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive(href)
                    ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
                style={isActive(href) ? {} : { color: 'var(--fg)' }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </>
        )}

        {/* Admin Links */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-rose-500">
                Admin
              </p>
            </div>
            {ADMIN_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive(href)
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
                style={isActive(href) ? {} : { color: 'var(--fg)' }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}

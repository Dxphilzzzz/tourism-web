// ============================================================
// TourEase — Navbar Component
// Sticky, glassmorphism, responsive with mobile menu
// ============================================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';
import { getInitials } from '@/lib/utils';
import {
  Menu, X, Sun, Moon, MapPin, Compass, BookOpen,
  Building2, User, LogOut, Settings, ChevronDown,
  Search, LayoutDashboard, ShieldCheck,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/explore',    label: 'Explore',    icon: Compass },
  { href: '/map',        label: 'Map',        icon: MapPin },
  { href: '/guides',     label: 'Guides',     icon: BookOpen },
  { href: '/businesses', label: 'Businesses', icon: Building2 },
];

export default function Navbar() {
  const pathname          = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { user, profile, signOut, isAdmin } = useAuth();

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/explore?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'nav-glass shadow-sm' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ocean-500 to-teal-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg hidden sm:block" style={{ color: 'var(--fg)' }}>
                Tour<span className="text-ocean-500">Ease</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(href)
                      ? 'bg-ocean-500/10 text-ocean-600 dark:text-ocean-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Toggle */}
              <button
                id="search-toggle"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Theme Toggle */}
              <button
                id="theme-toggle"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark'
                  ? <Sun className="w-4.5 h-4.5" />
                  : <Moon className="w-4.5 h-4.5" />
                }
              </button>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    id="user-menu-toggle"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean-500 to-teal-600 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
                      {profile?.avatar_url
                        ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                        : <span>{getInitials(profile?.full_name ?? user.email ?? 'U')}</span>
                      }
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg border animate-scale-in"
                      style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                    >
                      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--fg)' }}>
                          {profile?.full_name ?? 'Traveler'}
                        </p>
                        <p className="text-xs truncate" style={{ color: 'var(--muted-color)' }}>{user.email}</p>
                      </div>
                      <div className="py-1">
                        <DropdownLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <DropdownLink href="/dashboard/profile" icon={Settings} label="Profile Settings" />
                        {isAdmin && <DropdownLink href="/admin" icon={ShieldCheck} label="Admin Panel" />}
                        <button
                          onClick={() => { signOut(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                    style={{ color: 'var(--muted-color)' }}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-ocean-500 text-white hover:bg-ocean-600 transition-colors shadow-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Bar (expandable) */}
          {searchOpen && (
            <div className="pb-3 animate-slide-up">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-color)' }} />
                <input
                  id="navbar-search"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations, places, guides…"
                  className="input-base pl-9 pr-4"
                />
              </form>
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t animate-slide-up" style={{ background: 'var(--nav-bg)', borderColor: 'var(--border-color)' }}>
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(href)
                      ? 'bg-ocean-500/10 text-ocean-600'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  style={{ color: isActive(href) ? undefined : 'var(--fg)' }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              {!user && (
                <div className="pt-2 flex gap-2">
                  <Link href="/login"    className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--border-color)', color: 'var(--fg)' }}>Login</Link>
                  <Link href="/register" className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-semibold bg-ocean-500 text-white">Register</Link>
                </div>
              )}
              {user && (
                <div className="pt-2 space-y-1 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800" style={{ color: 'var(--fg)' }}>
                    <User className="w-4 h-4" /> Dashboard
                  </Link>
                  <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Overlay to close menus */}
      {(userMenuOpen || mobileOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setUserMenuOpen(false); setMobileOpen(false); }} />
      )}
    </>
  );
}

function DropdownLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" style={{ color: 'var(--fg)' }}>
      <Icon className="w-4 h-4" style={{ color: 'var(--muted-color)' }} />
      {label}
    </Link>
  );
}

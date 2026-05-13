// TourEase — User Dashboard Overview
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase';
import { Avatar } from '@/components/ui/avatar';
import Link from 'next/link';
import { MapPin, Star, Heart, FileText, PlusCircle, ArrowRight } from 'lucide-react';
import type { Destination, Review, Favorite } from '@/types';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ destinations: 0, reviews: 0, favorites: 0 });
  const [recentDests, setRecentDests] = useState<Destination[]>([]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    async function load() {
      const [dests, revs, favs] = await Promise.all([
        supabase.from('destinations').select('*', { count: 'exact' }).eq('submitted_by', user!.id),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('user_id', user!.id),
        supabase.from('favorites').select('id', { count: 'exact', head: true }).eq('user_id', user!.id),
      ]);
      setStats({
        destinations: dests.count ?? 0,
        reviews: revs.count ?? 0,
        favorites: favs.count ?? 0,
      });
      setRecentDests((dests.data ?? []).slice(0, 3) as Destination[]);
    }
    load();
  }, [user]);

  const STAT_CARDS = [
    { icon: MapPin, label: 'My Destinations', value: stats.destinations, color: 'text-ocean-500', bg: 'bg-ocean-500/10' },
    { icon: Star, label: 'My Reviews', value: stats.reviews, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: Heart, label: 'Favorites', value: stats.favorites, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="max-w-4xl page-enter">
      {/* Welcome */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar src={profile?.avatar_url} name={profile?.full_name} size="lg" />
        <div>
          <h1 className="text-2xl font-display font-bold" style={{ color: 'var(--fg)' }}>
            Welcome, {profile?.full_name?.split(' ')[0] ?? 'Traveler'} 👋
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted-color)' }}>Here&apos;s your travel dashboard</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {STAT_CARDS.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="p-5 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-display font-bold" style={{ color: 'var(--fg)' }}>{value}</p>
            <p className="text-sm" style={{ color: 'var(--muted-color)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link href="/dashboard/destinations/new" className="flex items-center gap-3 p-5 rounded-2xl card-lift"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <PlusCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div><p className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>Submit New Destination</p><p className="text-xs" style={{ color: 'var(--muted-color)' }}>Share a hidden gem</p></div>
          <ArrowRight className="w-4 h-4 ml-auto" style={{ color: 'var(--muted-color)' }} />
        </Link>
        <Link href="/dashboard/profile" className="flex items-center gap-3 p-5 rounded-2xl card-lift"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-violet-500" />
          </div>
          <div><p className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>Edit Profile</p><p className="text-xs" style={{ color: 'var(--muted-color)' }}>Update your info</p></div>
          <ArrowRight className="w-4 h-4 ml-auto" style={{ color: 'var(--muted-color)' }} />
        </Link>
      </div>

      {/* Recent Destinations */}
      {recentDests.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--fg)' }}>My Recent Submissions</h2>
          <div className="space-y-3">
            {recentDests.map((d) => (
              <div key={d.id} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                <MapPin className="w-4 h-4 text-ocean-500" />
                <span className="text-sm font-medium flex-1" style={{ color: 'var(--fg)' }}>{d.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  d.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  d.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                }`}>{d.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

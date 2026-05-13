// TourEase — Admin Dashboard
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { ShieldCheck, MapPin, Building2, Users, Flag, Star, ArrowRight, Clock } from 'lucide-react';

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({ destinations: 0, businesses: 0, users: 0, reviews: 0, pendingDest: 0, pendingBiz: 0, reports: 0 });

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const [d, b, u, r, pd, pb, rep] = await Promise.all([
        supabase.from('destinations').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('destinations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);
      setStats({
        destinations: d.count ?? 0, businesses: b.count ?? 0, users: u.count ?? 0,
        reviews: r.count ?? 0, pendingDest: pd.count ?? 0, pendingBiz: pb.count ?? 0, reports: rep.count ?? 0,
      });
    }
    load();
  }, []);

  if (!isAdmin) return <div className="text-center py-20"><ShieldCheck className="w-12 h-12 mx-auto mb-3 text-rose-400" /><p className="font-semibold" style={{ color: 'var(--fg)' }}>Access Denied</p></div>;

  const CARDS = [
    { icon: MapPin, label: 'Destinations', value: stats.destinations, color: 'text-ocean-500', bg: 'bg-ocean-500/10' },
    { icon: Building2, label: 'Businesses', value: stats.businesses, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { icon: Users, label: 'Users', value: stats.users, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { icon: Star, label: 'Reviews', value: stats.reviews, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  const PENDING = [
    { href: '/admin/destinations', icon: Clock, label: 'Pending Destinations', count: stats.pendingDest, color: 'text-ocean-500' },
    { href: '/admin/businesses', icon: Clock, label: 'Pending Businesses', count: stats.pendingBiz, color: 'text-violet-500' },
    { href: '/admin/reports', icon: Flag, label: 'Open Reports', count: stats.reports, color: 'text-rose-500' },
  ];

  return (
    <div className="max-w-4xl page-enter">
      <h1 className="text-2xl font-display font-bold mb-6" style={{ color: 'var(--fg)' }}>
        <ShieldCheck className="w-6 h-6 inline-block mr-2 text-rose-500" />Admin Panel
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {CARDS.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="p-5 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-display font-bold" style={{ color: 'var(--fg)' }}>{value}</p>
            <p className="text-sm" style={{ color: 'var(--muted-color)' }}>{label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--fg)' }}>Requires Attention</h2>
      <div className="space-y-3">
        {PENDING.map(({ href, icon: Icon, label, count, color }) => (
          <Link key={href} href={href} className="flex items-center gap-3 p-4 rounded-xl card-lift"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <Icon className={`w-5 h-5 ${color}`} />
            <span className="text-sm font-medium flex-1" style={{ color: 'var(--fg)' }}>{label}</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500">{count}</span>
            <ArrowRight className="w-4 h-4" style={{ color: 'var(--muted-color)' }} />
          </Link>
        ))}
      </div>
    </div>
  );
}

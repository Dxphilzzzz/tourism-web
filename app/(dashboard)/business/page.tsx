// TourEase — Business Owner Dashboard
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase';
import { Building2, Star, Eye, MessageCircle } from 'lucide-react';
import { StatusBadge } from '@/components/ui/badge';

export default function BusinessDashboard() {
  const { user, isBusinessOwner } = useAuth();
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    createClient().from('businesses')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setBusinesses(data ?? []));
  }, [user]);

  if (!isBusinessOwner) return (
    <div className="text-center py-20">
      <Building2 className="w-12 h-12 mx-auto mb-3 text-violet-300" />
      <p className="font-semibold" style={{ color: 'var(--fg)' }}>Business Owner Access Only</p>
    </div>
  );

  return (
    <div className="max-w-4xl page-enter">
      <h1 className="text-2xl font-display font-bold mb-6" style={{ color: 'var(--fg)' }}>
        <Building2 className="w-5 h-5 inline-block mr-2 text-violet-500" />My Businesses
      </h1>

      {businesses.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <Building2 className="w-10 h-10 mx-auto mb-2 text-violet-300" />
          <p className="font-semibold" style={{ color: 'var(--fg)' }}>No businesses yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-color)' }}>Register your business to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {businesses.map((biz) => (
            <div key={biz.id} className="p-5 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--fg)' }}>{biz.name}</h3>
                  <p className="text-sm capitalize" style={{ color: 'var(--muted-color)' }}>{biz.category.replace('-', ' ')} · {biz.city}</p>
                </div>
                <StatusBadge status={biz.status} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg)' }}>
                  <Star className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                  <p className="text-sm font-bold" style={{ color: 'var(--fg)' }}>{biz.average_rating.toFixed(1)}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-color)' }}>Rating</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg)' }}>
                  <MessageCircle className="w-4 h-4 text-ocean-500 mx-auto mb-1" />
                  <p className="text-sm font-bold" style={{ color: 'var(--fg)' }}>{biz.review_count}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-color)' }}>Reviews</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg)' }}>
                  <Eye className="w-4 h-4 text-teal-500 mx-auto mb-1" />
                  <p className="text-sm font-bold" style={{ color: 'var(--fg)' }}>{biz.is_verified ? '✓' : '—'}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-color)' }}>Verified</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

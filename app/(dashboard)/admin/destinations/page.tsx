// TourEase — Admin: Moderate Destinations
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { MapPin, Check, X, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminDestinationsPage() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('destinations')
      .select('*, category:categories(name, icon), submitter:profiles(full_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, []);

  const moderate = async (id: string, status: 'approved' | 'rejected') => {
    const supabase = createClient();
    await supabase.from('destinations').update({ status }).eq('id', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success(`Destination ${status}`);
  };

  if (!isAdmin) return <p>Access denied</p>;

  return (
    <div className="max-w-4xl page-enter">
      <h1 className="text-2xl font-display font-bold mb-6" style={{ color: 'var(--fg)' }}>
        <MapPin className="w-5 h-5 inline-block mr-2 text-ocean-500" />Pending Destinations
      </h1>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <Check className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
          <p className="font-semibold" style={{ color: 'var(--fg)' }}>All caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((d) => (
            <div key={d.id} className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--fg)' }}>{d.name}</p>
                <p className="text-xs" style={{ color: 'var(--muted-color)' }}>
                  {d.category?.icon} {d.category?.name} · {d.city} · by {d.submitter?.full_name ?? 'Unknown'} · {formatDate(d.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/explore/${d.slug}`} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><Eye className="w-4 h-4" style={{ color: 'var(--muted-color)' }} /></Link>
                <Button size="xs" variant="primary" onClick={() => moderate(d.id, 'approved')} icon={<Check className="w-3.5 h-3.5" />}>Approve</Button>
                <Button size="xs" variant="danger" onClick={() => moderate(d.id, 'rejected')} icon={<X className="w-3.5 h-3.5" />}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

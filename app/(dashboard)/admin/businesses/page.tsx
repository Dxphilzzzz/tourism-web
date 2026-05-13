// TourEase — Admin: Moderate Businesses
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Building2, Check, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminBusinessesPage() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    createClient().from('businesses')
      .select('*, owner:profiles(full_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .then(({ data }) => setItems(data ?? []));
  }, []);

  const moderate = async (id: string, status: 'approved' | 'rejected') => {
    await createClient().from('businesses').update({ status }).eq('id', id);
    setItems((p) => p.filter((i) => i.id !== id));
    toast.success(`Business ${status}`);
  };

  if (!isAdmin) return <p>Access denied</p>;

  return (
    <div className="max-w-4xl page-enter">
      <h1 className="text-2xl font-display font-bold mb-6" style={{ color: 'var(--fg)' }}>
        <Building2 className="w-5 h-5 inline-block mr-2 text-violet-500" />Pending Businesses
      </h1>
      {items.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <Check className="w-10 h-10 mx-auto mb-2 text-emerald-400" /><p className="font-semibold" style={{ color: 'var(--fg)' }}>All caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((b) => (
            <div key={b.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>{b.name}</p>
                <p className="text-xs" style={{ color: 'var(--muted-color)' }}>{b.category} · {b.city} · by {b.owner?.full_name} · {formatDate(b.created_at)}</p>
              </div>
              <div className="flex gap-2">
                <Button size="xs" variant="primary" onClick={() => moderate(b.id, 'approved')} icon={<Check className="w-3.5 h-3.5" />}>Approve</Button>
                <Button size="xs" variant="danger" onClick={() => moderate(b.id, 'rejected')} icon={<X className="w-3.5 h-3.5" />}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

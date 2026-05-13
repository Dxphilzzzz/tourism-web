// TourEase — Admin: Reports
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Flag, Check } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminReportsPage() {
  const { isAdmin } = useAuth();
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    createClient().from('reports')
      .select('*, reporter:profiles(full_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .then(({ data }) => setReports(data ?? []));
  }, []);

  const resolve = async (id: string) => {
    await createClient().from('reports').update({ status: 'resolved' }).eq('id', id);
    setReports((p) => p.filter((r) => r.id !== id));
    toast.success('Report resolved');
  };

  if (!isAdmin) return <p>Access denied</p>;

  return (
    <div className="max-w-4xl page-enter">
      <h1 className="text-2xl font-display font-bold mb-6" style={{ color: 'var(--fg)' }}>
        <Flag className="w-5 h-5 inline-block mr-2 text-rose-500" />Reports
      </h1>
      {reports.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <Check className="w-10 h-10 mx-auto mb-2 text-emerald-400" /><p className="font-semibold" style={{ color: 'var(--fg)' }}>No pending reports</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="p-4 rounded-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 capitalize">{r.type.replace('_', ' ')}</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--muted-color)' }}>by {r.reporter?.full_name} · {formatDate(r.created_at)}</span>
                </div>
                <Button size="xs" variant="primary" onClick={() => resolve(r.id)} icon={<Check className="w-3.5 h-3.5" />}>Resolve</Button>
              </div>
              <p className="text-sm" style={{ color: 'var(--fg)' }}>{r.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

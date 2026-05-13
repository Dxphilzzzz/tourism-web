// TourEase — Submit New Destination
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { MapPin, Upload } from 'lucide-react';
import { slugify } from '@/lib/utils';
import { toast } from 'sonner';
import { useEffect } from 'react';
import type { Category } from '@/types';

export default function NewDestinationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    createClient().from('categories').select('*').order('name').then(({ data }) => {
      setCategories((data ?? []) as Category[]);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;

    const { error } = await createClient().from('destinations').insert({
      name,
      slug: slugify(name) + '-' + Date.now().toString(36),
      description: fd.get('description') as string,
      short_description: fd.get('short_description') as string || null,
      travel_tips: fd.get('travel_tips') as string || null,
      category_id: fd.get('category_id') as string || null,
      address: fd.get('address') as string,
      city: fd.get('city') as string,
      province: fd.get('province') as string || 'Philippines',
      latitude: fd.get('latitude') ? parseFloat(fd.get('latitude') as string) : null,
      longitude: fd.get('longitude') ? parseFloat(fd.get('longitude') as string) : null,
      entrance_fee: fd.get('entrance_fee') ? parseFloat(fd.get('entrance_fee') as string) : null,
      opening_hours: fd.get('opening_hours') as string || null,
      contact_phone: fd.get('contact_phone') as string || null,
      contact_email: fd.get('contact_email') as string || null,
      submitted_by: user.id,
      status: 'pending',
    }).select().single();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Destination submitted for review!');
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl page-enter">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-ocean-500/10 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-ocean-500" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold" style={{ color: 'var(--fg)' }}>Submit a Destination</h1>
          <p className="text-sm" style={{ color: 'var(--muted-color)' }}>Share a new spot with the community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl space-y-5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Name *</label>
          <input name="name" required placeholder="e.g. El Nido Beach" className="input-base" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Category</label>
            <select name="category_id" className="input-base">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>City *</label>
            <input name="city" required placeholder="e.g. El Nido" className="input-base" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Address *</label>
          <input name="address" required placeholder="Full address" className="input-base" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Province</label>
            <input name="province" defaultValue="Philippines" className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Entrance Fee (₱)</label>
            <input name="entrance_fee" type="number" step="0.01" placeholder="0 for free" className="input-base" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Short Description</label>
          <input name="short_description" placeholder="One-line summary" className="input-base" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Description *</label>
          <textarea name="description" rows={4} required placeholder="Describe this destination in detail…" className="input-base resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Travel Tips</label>
          <textarea name="travel_tips" rows={3} placeholder="Tips for visitors…" className="input-base resize-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Latitude</label>
            <input name="latitude" type="number" step="any" placeholder="e.g. 11.0524" className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Longitude</label>
            <input name="longitude" type="number" step="any" placeholder="e.g. 119.3528" className="input-base" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Opening Hours</label>
            <input name="opening_hours" placeholder="e.g. 8:00 AM - 5:00 PM" className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Contact Phone</label>
            <input name="contact_phone" placeholder="Phone number" className="input-base" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Contact Email</label>
          <input name="contact_email" type="email" placeholder="email@example.com" className="input-base" />
        </div>

        <Button type="submit" loading={loading} fullWidth size="lg" icon={<Upload className="w-4 h-4" />}>
          Submit for Review
        </Button>
      </form>
    </div>
  );
}

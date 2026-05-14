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
import dynamic from 'next/dynamic';

const LocationPicker = dynamic(() => import('@/components/ui/location-picker'), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-slate-100 animate-pulse rounded-2xl" />
});

export default function NewDestinationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    createClient().from('categories').select('*').order('name').then(({ data }) => {
      setCategories((data ?? []) as Category[]);
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const supabase = createClient();

    let cover_image_url = null;

    // 1. Upload Image if exists
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('destination-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        toast.error('Failed to upload image: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('destination-images')
        .getPublicUrl(filePath);
      
      cover_image_url = publicUrl;
    }

    // 2. Insert Destination
    const { error } = await supabase.from('destinations').insert({
      name,
      slug: slugify(name) + '-' + Math.random().toString(36).substring(7),
      description: fd.get('description') as string,
      short_description: fd.get('short_description') as string || null,
      travel_tips: fd.get('travel_tips') as string || null,
      category_id: fd.get('category_id') as string || null,
      address: fd.get('address') as string,
      city: fd.get('city') as string,
      province: fd.get('province') as string || 'Philippines',
      latitude: coords?.lat || null,
      longitude: coords?.lng || null,
      entrance_fee: fd.get('entrance_fee') ? parseFloat(fd.get('entrance_fee') as string) : null,
      opening_hours: fd.get('opening_hours') as string || null,
      contact_phone: fd.get('contact_phone') as string || null,
      contact_email: fd.get('contact_email') as string || null,
      cover_image_url,
      submitted_by: user.id,
      status: 'pending',
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Destination submitted for review!');
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl page-enter pb-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-ocean-500/10 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-ocean-500" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold" style={{ color: 'var(--fg)' }}>Submit a Destination</h1>
          <p className="text-sm" style={{ color: 'var(--muted-color)' }}>Share a new spot with the community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl space-y-8" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        {/* Basic Info Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold border-b pb-2 mb-4" style={{ color: 'var(--fg)', borderColor: 'var(--border-color)' }}>Basic Information</h2>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--fg)' }}>Cover Image</label>
            <div 
              className="relative h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden group transition-all"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg)' }}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button type="button" variant="outline" size="sm" onClick={() => { setImageFile(null); setImagePreview(null); }}>Remove Image</Button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-ocean-50 dark:bg-ocean-900/20 flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-ocean-500" />
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--fg)' }}>Click to upload cover photo</p>
                  <p className="text-xs" style={{ color: 'var(--muted-color)' }}>JPG, PNG or WebP (max 10MB)</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Destination Name *</label>
              <input name="name" required placeholder="e.g. Boracay White Beach" className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Category</label>
              <select name="category_id" className="input-base">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Entrance Fee (₱)</label>
              <input name="entrance_fee" type="number" step="0.01" placeholder="0 for free" className="input-base" />
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold border-b pb-2 mb-4" style={{ color: 'var(--fg)', borderColor: 'var(--border-color)' }}>Description</h2>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Short Summary</label>
            <input name="short_description" placeholder="A one-line catchphrase for this spot" className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Detailed Description *</label>
            <textarea name="description" rows={5} required placeholder="What makes this place special? Tell us about the history, vibes, and features…" className="input-base resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Travel Tips</label>
            <textarea name="travel_tips" rows={3} placeholder="What should travelers bring? When is the best time to visit?" className="input-base resize-none" />
          </div>
        </section>

        {/* Location Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold border-b pb-2 mb-4" style={{ color: 'var(--fg)', borderColor: 'var(--border-color)' }}>Location Details</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--fg)' }}>Find on Map *</label>
            <LocationPicker 
              onLocationSelect={(lat, lng, addr, city) => {
                setCoords({ lat, lng });
                if (addr) (document.querySelector('input[name="address"]') as HTMLInputElement).value = addr;
                if (city) (document.querySelector('input[name="city"]') as HTMLInputElement).value = city;
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Full Address *</label>
              <input name="address" required placeholder="Complete address" className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>City / Municipality *</label>
              <input name="city" required placeholder="e.g. Puerto Princesa" className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Province</label>
              <input name="province" defaultValue="Philippines" className="input-base" />
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold border-b pb-2 mb-4" style={{ color: 'var(--fg)', borderColor: 'var(--border-color)' }}>Contact & Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Opening Hours</label>
              <input name="opening_hours" placeholder="e.g. 24/7 or 8AM - 6PM" className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Contact Phone</label>
              <input name="contact_phone" placeholder="Phone number" className="input-base" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Contact Email</label>
              <input name="contact_email" type="email" placeholder="official@destination.com" className="input-base" />
            </div>
          </div>
        </section>

        <div className="pt-6">
          <Button type="submit" loading={loading} fullWidth size="lg" icon={<Upload className="w-4 h-4" />}>
            Submit Destination
          </Button>
          <p className="text-[10px] text-center mt-3" style={{ color: 'var(--muted-color)' }}>
            Note: Submissions are reviewed by our community team before being published live.
          </p>
        </div>
      </form>
    </div>
  );
}

// TourEase — Profile Settings Page
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Settings, Save, Camera } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.from('profiles').update({
      full_name: fd.get('full_name') as string,
      bio: fd.get('bio') as string || null,
      phone: fd.get('phone') as string || null,
    }).eq('id', profile!.id);

    if (error) toast.error(error.message);
    else { toast.success('Profile updated!'); await refreshProfile(); }
    setLoading(false);
  };

  if (!profile) return null;

  return (
    <div className="max-w-2xl page-enter">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-violet-500" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold" style={{ color: 'var(--fg)' }}>Profile Settings</h1>
          <p className="text-sm" style={{ color: 'var(--muted-color)' }}>Manage your account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl space-y-5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar src={profile.avatar_url} name={profile.full_name} size="xl" />
            <button type="button" className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-ocean-500 text-white flex items-center justify-center shadow-md">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--fg)' }}>{profile.full_name}</p>
            <p className="text-sm" style={{ color: 'var(--muted-color)' }}>{profile.email}</p>
            <p className="text-xs mt-1 px-2 py-0.5 rounded-full bg-ocean-500/10 text-ocean-600 dark:text-ocean-400 font-semibold inline-block capitalize">{profile.role.replace('_', ' ')}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Full Name</label>
          <input name="full_name" defaultValue={profile.full_name ?? ''} className="input-base" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Bio</label>
          <textarea name="bio" rows={3} defaultValue={profile.bio ?? ''} placeholder="Tell us about yourself…" className="input-base resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Phone</label>
          <input name="phone" defaultValue={profile.phone ?? ''} placeholder="Phone number" className="input-base" />
        </div>

        <Button type="submit" loading={loading} icon={<Save className="w-4 h-4" />}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}

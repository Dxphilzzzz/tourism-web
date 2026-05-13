// TourEase — Contact Page
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Mail, Phone, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll get back to you soon.');
    (e.target as HTMLFormElement).reset();
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold mb-3" style={{ color: 'var(--fg)' }}>Contact Us</h1>
        <p className="text-lg" style={{ color: 'var(--muted-color)' }}>Have questions? We&apos;d love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--fg)' }}>Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-ocean-500 mt-0.5" />
                <div><p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>Email</p><p className="text-sm" style={{ color: 'var(--muted-color)' }}>hello@tourease.ph</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-teal-500 mt-0.5" />
                <div><p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>Tourism Hotline</p><p className="text-sm" style={{ color: 'var(--muted-color)' }}>1-387</p></div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-violet-500 mt-0.5" />
                <div><p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>Location</p><p className="text-sm" style={{ color: 'var(--muted-color)' }}>Manila, Philippines</p></div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-ocean-500/5 border border-ocean-500/20">
            <MessageCircle className="w-8 h-8 text-ocean-500 mb-3" />
            <h3 className="font-semibold mb-1" style={{ color: 'var(--fg)' }}>Emergency?</h3>
            <p className="text-sm mb-3" style={{ color: 'var(--muted-color)' }}>For emergencies, call the Philippine Emergency Hotline.</p>
            <a href="tel:911" className="text-lg font-bold text-ocean-500">📞 911</a>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Name</label>
                <input name="name" required placeholder="Your name" className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Email</label>
                <input name="email" type="email" required placeholder="you@example.com" className="input-base" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Subject</label>
              <input name="subject" required placeholder="What's this about?" className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Message</label>
              <textarea name="message" rows={5} required placeholder="Tell us more…" className="input-base resize-none" />
            </div>
            <Button type="submit" loading={loading} fullWidth icon={<Send className="w-4 h-4" />}>
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

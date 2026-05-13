// ============================================================
// TourEase — Announcements Banner
// Dismissable travel alerts from DB
// ============================================================
'use client';

import { useState } from 'react';
import { X, AlertTriangle, Info, Calendar, Cloud, Megaphone } from 'lucide-react';
import type { Announcement } from '@/types';
import { cn } from '@/lib/utils';

const TYPE_MAP = {
  alert:     { icon: AlertTriangle, bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-800 dark:text-amber-300' },
  info:      { icon: Info,          bg: 'bg-ocean-50 dark:bg-ocean-900/20',  border: 'border-ocean-200 dark:border-ocean-800', text: 'text-ocean-800 dark:text-ocean-300' },
  event:     { icon: Calendar,      bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800', text: 'text-violet-800 dark:text-violet-300' },
  weather:   { icon: Cloud,         bg: 'bg-slate-50 dark:bg-slate-900/20',  border: 'border-slate-200 dark:border-slate-800', text: 'text-slate-700 dark:text-slate-300' },
  emergency: { icon: AlertTriangle, bg: 'bg-rose-50 dark:bg-rose-900/20',   border: 'border-rose-200 dark:border-rose-800',   text: 'text-rose-800 dark:text-rose-300' },
};

interface AnnouncementsBannerProps {
  announcements: Announcement[];
}

export default function AnnouncementsBanner({ announcements }: AnnouncementsBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const visible = announcements.filter((a) => !dismissed.has(a.id));
  if (!visible.length) return null;

  return (
    <div className="space-y-2">
      {visible.map((a) => {
        const { icon: Icon, bg, border, text } = TYPE_MAP[a.type] ?? TYPE_MAP.info;
        return (
          <div
            key={a.id}
            className={cn('flex items-start gap-3 px-4 py-3 rounded-xl border animate-fade-in', bg, border)}
          >
            <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', text)} />
            <div className="flex-1 min-w-0">
              <p className={cn('text-sm font-semibold', text)}>{a.title}</p>
              <p className={cn('text-xs mt-0.5', text, 'opacity-80')}>{a.content}</p>
            </div>
            <button
              onClick={() => setDismissed((p) => new Set([...p, a.id]))}
              className={cn('p-1 rounded hover:opacity-70 transition-opacity shrink-0', text)}
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

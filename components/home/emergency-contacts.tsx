// ============================================================
// TourEase — Emergency Contacts Panel
// ============================================================
import { Phone, AlertCircle } from 'lucide-react';
import type { EmergencyContact } from '@/types';

const CATEGORY_COLORS: Record<string, string> = {
  emergency:   '#ef4444',
  medical:     '#f59e0b',
  disaster:    '#f97316',
  'coast-guard': '#0ea5e9',
  tourism:     '#10b981',
  police:      '#6366f1',
  fire:        '#ef4444',
  general:     '#64748b',
};

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
}

export default function EmergencyContacts({ contacts }: EmergencyContactsProps) {
  if (!contacts.length) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 bg-rose-500/10 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <AlertCircle className="w-5 h-5 text-rose-500" />
        <h3 className="font-semibold text-rose-600 dark:text-rose-400">Emergency Hotlines</h3>
      </div>

      {/* Contacts */}
      <div className="divide-y" style={{ borderColor: 'var(--border-color)' } as React.CSSProperties}>
        {contacts.map((c) => (
          <a
            key={c.id}
            href={`tel:${c.number}`}
            className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: (CATEGORY_COLORS[c.category] ?? '#64748b') + '20' }}
            >
              <Phone className="w-4 h-4" style={{ color: CATEGORY_COLORS[c.category] ?? '#64748b' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--fg)' }}>{c.name}</p>
              {c.description && (
                <p className="text-xs truncate" style={{ color: 'var(--muted-color)' }}>{c.description}</p>
              )}
            </div>
            <span className="text-sm font-bold group-hover:text-ocean-500 transition-colors" style={{ color: 'var(--fg)' }}>
              {c.number}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

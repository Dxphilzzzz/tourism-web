// ============================================================
// TourEase — Modal Component
// ============================================================
'use client';

import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open:       boolean;
  onClose:    () => void;
  title?:     string;
  children:   ReactNode;
  size?:      'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export function Modal({ open, onClose, title, children, size = 'md', className }: ModalProps) {
  // Lock body scroll
  useEffect(() => {
    if (open) document.body.classList.add('overflow-hidden');
    else       document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  // Escape key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={cn(
          'relative w-full rounded-2xl shadow-2xl animate-scale-in overflow-hidden',
          sizes[size], className
        )}
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--fg)' }}>{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              style={{ color: 'var(--muted-color)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {/* Body */}
        <div className="overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
}

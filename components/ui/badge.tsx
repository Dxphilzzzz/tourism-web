// ============================================================
// TourEase — Badge Component
// ============================================================
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';

interface BadgeProps {
  children:   React.ReactNode;
  variant?:   BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  danger:  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  info:    'bg-ocean-100 text-ocean-700 dark:bg-ocean-900/30 dark:text-ocean-400',
  outline: 'border border-current bg-transparent',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('badge', variants[variant], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: 'pending' | 'approved' | 'rejected' }) {
  const map = {
    pending:  { variant: 'warning' as BadgeVariant,  label: 'Pending' },
    approved: { variant: 'success' as BadgeVariant,  label: 'Approved' },
    rejected: { variant: 'danger'  as BadgeVariant,  label: 'Rejected' },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ocean-500 text-white text-xs font-semibold">
      ✓ Verified
    </span>
  );
}

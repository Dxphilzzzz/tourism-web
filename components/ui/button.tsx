// ============================================================
// TourEase — Button Component
// ============================================================
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size    = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  icon?:     React.ReactNode;
  iconEnd?:  React.ReactNode;
  fullWidth?: boolean;
}

const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none';

const variants: Record<Variant, string> = {
  primary:   'bg-ocean-500 text-white hover:bg-ocean-600 active:bg-ocean-700 shadow-sm hover:shadow-md',
  secondary: 'bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700 shadow-sm',
  ghost:     'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-current',
  danger:    'bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 shadow-sm',
  outline:   'border border-current bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50',
};

const sizes: Record<Size, string> = {
  xs: 'px-2.5 py-1    text-xs',
  sm: 'px-3.5 py-1.5  text-sm',
  md: 'px-5   py-2.5  text-sm',
  lg: 'px-6   py-3    text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, iconEnd, fullWidth, className, children, disabled, ...rest }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
      {!loading && iconEnd}
    </button>
  )
);

Button.displayName = 'Button';

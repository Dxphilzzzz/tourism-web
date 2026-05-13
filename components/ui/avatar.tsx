// ============================================================
// TourEase — Avatar Component
// ============================================================
import { cn, getInitials } from '@/lib/utils';
import Image from 'next/image';

interface AvatarProps {
  src?:       string | null;
  name?:      string | null;
  size?:      'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: { container: 'w-6 h-6',  text: 'text-[10px]' },
  sm: { container: 'w-8 h-8',  text: 'text-xs' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-14 h-14', text: 'text-lg' },
  xl: { container: 'w-20 h-20', text: 'text-2xl' },
};

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const { container, text } = sizeMap[size];
  const initials = getInitials(name ?? 'U');

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden flex items-center justify-center shrink-0',
        'bg-gradient-to-br from-ocean-500 to-teal-600 text-white font-semibold',
        container, className
      )}
    >
      {src ? (
        <Image src={src} alt={name ?? 'User'} fill className="object-cover" sizes="80px" />
      ) : (
        <span className={text}>{initials}</span>
      )}
    </div>
  );
}

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  size?: number;
  className?: string;
}

export function LoadingIndicator({ size = 24, className }: LoadingIndicatorProps) {
  return (
    <Loader2
      style={{ width: `${size}px`, height: `${size}px` }}
      className={cn('animate-spin text-primary', className)}
      aria-label="Loading..."
    />
  );
}

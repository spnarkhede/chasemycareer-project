import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingMessageProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingMessage({ 
  message = 'Loading...', 
  className,
  size = 'md' 
}: LoadingMessageProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      <span className={cn('text-muted-foreground', textSizeClasses[size])}>
        {message}
      </span>
    </div>
  );
}

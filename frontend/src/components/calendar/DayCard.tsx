import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DayCardProps {
  dayNumber: number;
  theme: string;
  isCompleted: boolean;
  isLocked: boolean;
  onClick: () => void;
}

export function DayCard({ dayNumber, theme, isCompleted, isLocked, onClick }: DayCardProps) {
  return (
    <Card
      className={cn(
        'relative transition-all duration-300 p-4 h-full',
        'border-2',
        isLocked
          ? 'bg-muted/50 border-muted cursor-not-allowed opacity-60'
          : 'cursor-pointer hover:shadow-lg hover:scale-105',
        !isLocked && isCompleted
          ? 'bg-success/10 border-success hover:bg-success/20'
          : !isLocked && 'bg-card border-border hover:border-primary'
      )}
      onClick={isLocked ? undefined : onClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <span className={cn(
            'text-sm font-bold px-2 py-1 rounded',
            isLocked
              ? 'bg-muted text-muted-foreground'
              : isCompleted
              ? 'bg-success text-success-foreground'
              : 'bg-primary text-primary-foreground'
          )}>
            Day {dayNumber}
          </span>
          {isLocked ? (
            <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          ) : isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          )}
        </div>
        <h3 className={cn(
          'text-sm font-semibold line-clamp-2 flex-grow',
          isLocked
            ? 'text-muted-foreground'
            : isCompleted
            ? 'text-success-foreground'
            : 'text-card-foreground'
        )}>
          {theme}
        </h3>
        {isLocked && (
          <p className="text-xs text-muted-foreground mt-2">
            Complete Day {dayNumber - 1} first
          </p>
        )}
      </div>
    </Card>
  );
}

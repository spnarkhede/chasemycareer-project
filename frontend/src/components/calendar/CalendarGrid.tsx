import { DayCard } from './DayCard';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Lock } from 'lucide-react';
import type { DayContent } from '@/types';

interface CalendarGridProps {
  days: DayContent[];
  completedDays: Set<number>;
  onDayClick: (day: DayContent) => void;
  onCongratulationsClick: () => void;
}

export function CalendarGrid({ days, completedDays, onDayClick, onCongratulationsClick }: CalendarGridProps) {
  const allDaysCompleted = completedDays.size === 50;

  // Helper function to check if a day is locked
  const isDayLocked = (dayNumber: number): boolean => {
    // Day 1 is never locked
    if (dayNumber === 1) return false;
    // All other days are locked if the previous day is not completed
    return !completedDays.has(dayNumber - 1);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
      {days.map((day) => (
        <DayCard
          key={day.dayNumber}
          dayNumber={day.dayNumber}
          theme={day.theme}
          isCompleted={completedDays.has(day.dayNumber)}
          isLocked={isDayLocked(day.dayNumber)}
          onClick={() => onDayClick(day)}
        />
      ))}
      
      {/* Congratulations Card */}
      <Card
        className={`relative overflow-hidden transition-all duration-300 ${
          allDaysCompleted
            ? 'cursor-pointer hover:scale-105 hover:shadow-xl bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-400'
            : 'cursor-not-allowed opacity-60 bg-muted'
        }`}
        onClick={() => allDaysCompleted && onCongratulationsClick()}
      >
        <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center min-h-[120px]">
          <div className="relative mb-2">
            {allDaysCompleted ? (
              <Trophy className="w-12 h-12 text-yellow-600 animate-bounce" />
            ) : (
              <div className="relative">
                <Trophy className="w-12 h-12 text-muted-foreground" />
                <Lock className="w-6 h-6 text-muted-foreground absolute -bottom-1 -right-1 bg-background rounded-full p-1" />
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className={`text-sm font-bold ${allDaysCompleted ? 'text-yellow-700' : 'text-muted-foreground'}`}>
              {allDaysCompleted ? '🎉 Congratulations!' : 'Locked'}
            </div>
            <div className={`text-xs ${allDaysCompleted ? 'text-yellow-600' : 'text-muted-foreground'}`}>
              {allDaysCompleted ? 'View Your Achievement' : `Complete all 50 days`}
            </div>
          </div>
          {!allDaysCompleted && (
            <div className="mt-2 text-xs text-muted-foreground">
              {completedDays.size}/50 days
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

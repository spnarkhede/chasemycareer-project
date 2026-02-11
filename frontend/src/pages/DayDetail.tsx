import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Clock, Lightbulb, Target, ListChecks, BookOpen, ExternalLink, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProgress } from '@/hooks/use-progress';
import { jobSearchData } from '@/data/jobSearchData';
import { useToast } from '@/hooks/use-toast';

export default function DayDetail() {
  const { dayNumber } = useParams<{ dayNumber: string }>();
  const navigate = useNavigate();
  const { isCompleted, toggleDay, completedDays } = useProgress();
  const { toast } = useToast();

  const currentDayNumber = Number.parseInt(dayNumber || '1', 10);
  const day = jobSearchData.find((d) => d.dayNumber === currentDayNumber);

  // Check if day is locked (previous day not completed)
  const isDayLocked = currentDayNumber > 1 && !completedDays.has(currentDayNumber - 1);

  // Redirect if day is locked
  useEffect(() => {
    if (isDayLocked) {
      toast({
        title: 'Day Locked',
        description: `Please complete Day ${currentDayNumber - 1} first to unlock Day ${currentDayNumber}.`,
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [isDayLocked, currentDayNumber, navigate, toast]);

  if (!day) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Day not found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Calendar
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state while checking lock status
  if (isDayLocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Day {currentDayNumber} is Locked</h1>
          <p className="text-muted-foreground mb-4">
            Complete Day {currentDayNumber - 1} first
          </p>
        </div>
      </div>
    );
  }

  const hasPrevious = currentDayNumber > 1;
  const hasNext = currentDayNumber < 50;
  const completed = isCompleted(currentDayNumber);
  
  // Check if next day is unlocked
  const isNextDayUnlocked = hasNext && (completed || completedDays.has(currentDayNumber));

  const handlePrevious = () => {
    if (hasPrevious) {
      navigate(`/day/${currentDayNumber - 1}`);
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      if (!isNextDayUnlocked) {
        toast({
          title: 'Day Locked',
          description: `Please complete Day ${currentDayNumber} first to unlock Day ${currentDayNumber + 1}.`,
          variant: 'destructive',
        });
        return;
      }
      navigate(`/day/${currentDayNumber + 1}`);
      window.scrollTo(0, 0);
    }
  };

  const handleToggleComplete = () => {
    toggleDay(currentDayNumber);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Calendar
          </Button>

          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default" className="text-sm">
                  Day {day.dayNumber}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {day.timeCommitment}
                </Badge>
              </div>
              <h1 className="text-3xl xl:text-4xl font-bold mb-2">{day.theme}</h1>
            </div>
            <Button
              variant={completed ? 'default' : 'outline'}
              size="sm"
              onClick={handleToggleComplete}
              className="flex-shrink-0"
            >
              {completed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 mr-2" />
                  Mark Complete
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
            <Target className="w-5 h-5 text-accent-foreground mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm mb-1">Today's Objective</h3>
              <p className="text-sm text-muted-foreground">{day.objective}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Key Tasks</h3>
            </div>
            <ul className="space-y-2">
              {day.keyTasks.map((task, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-1">•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Step-by-Step Instructions</h3>
            </div>
            <div className="space-y-4">
              {day.instructions.map((instruction, index) => (
                <div key={index} className="pl-4 border-l-2 border-primary/30">
                  <h4 className="font-semibold text-sm mb-2">{instruction.title}</h4>
                  <ol className="space-y-1.5">
                    {instruction.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-sm text-muted-foreground flex gap-2">
                        <span className="font-medium text-primary">{stepIndex + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {day.resources.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Resources & Tools</h3>
                </div>
                <div className="space-y-2">
                  {day.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {resource.title}
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
            <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm mb-1">Pro Tip</h3>
              <p className="text-sm text-muted-foreground">{day.proTip}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Estimated time: {day.timeCommitment}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!hasPrevious}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous Day
          </Button>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={!hasNext || !isNextDayUnlocked}
          >
            Next Day
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
